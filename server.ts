import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  SUPPORTED_PROVIDERS,
  fetchOpenRouterModels,
  checkOpenRouterConnection,
  testProviderConnection,
  executeMultiProviderJson,
  performStrictTargetedProjectUpdate
} from './src/server/aiAdapters.ts';
import { executeAgenticWorkflow } from './src/server/agenticEngine.ts';
import { validateProjectFiles } from './src/server/codeValidator.ts';
import {
  IS_PROD,
  DATA_DIR,
  HttpError,
  atomicWriteJson,
  registerUser,
  loginUser,
  getUserById,
  setSession,
  clearSession,
  requireAuth,
  rateLimit,
  sameOriginOnly,
  securityHeaders
} from './src/server/security.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

if (IS_PROD) app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(securityHeaders);
app.use(express.json({ limit: '10mb' }));
app.use('/api', sameOriginOnly);

// Every AI call costs money: limit how often one user can trigger them.
const AI_LIMIT = parseInt(process.env.AI_RATE_LIMIT || '30', 10);
const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: AI_LIMIT,
  by: 'user',
  message: 'You have reached the AI request limit. Please wait a few minutes and try again.'
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  by: 'ip',
  message: 'Too many sign-in attempts. Please try again later.'
});

// Persistent Project Store backed by disk and in-memory map.
// Every project belongs to the user who created it (ownerId).
const projectsStore = new Map<string, any>();
const DB_FILE = path.join(DATA_DIR, 'projects.json');

function loadProjectsFromDisk() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (Array.isArray(data)) {
        for (const p of data) {
          if (p && p.id && p.ownerId) projectsStore.set(p.id, p);
        }
        console.log(`[Persistence] Loaded ${projectsStore.size} projects from disk.`);
      }
    }
  } catch (err: any) {
    console.warn('[Persistence] Could not load projects from disk:', err.message);
  }
}

let saveTimer: NodeJS.Timeout | null = null;
function writeProjectsNow() {
  saveTimer = null;
  try {
    atomicWriteJson(DB_FILE, Array.from(projectsStore.values()));
  } catch (err: any) {
    console.warn('[Persistence] Could not save projects to disk:', err.message);
  }
}
// Debounced so a burst of edits becomes a single write.
function saveProjectsToDisk() {
  if (!saveTimer) saveTimer = setTimeout(writeProjectsNow, 400);
}
process.on('SIGTERM', () => { writeProjectsNow(); process.exit(0); });
process.on('SIGINT', () => { writeProjectsNow(); process.exit(0); });

loadProjectsFromDisk();

function ownedProject(req: Request, res: Response) {
  const proj = projectsStore.get(String(req.params.id));
  if (!proj || proj.ownerId !== req.userId) {
    res.status(404).json({ error: 'Project not found' });
    return null;
  }
  return proj;
}

// System Status Endpoint (Audited and verified with working Gemini 2.5 Flash)
app.get('/api/status', (req: Request, res: Response) => {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  res.json({
    status: 'online',
    hasApiKey: Boolean(key && key.length > 5),
    recommendedModel: 'gemini-2.5-flash',
    fallbackModels: ['gemini-flash-latest', 'gemini-3.1-flash-lite'],
    version: '5.0.0-agentic-engine',
    agentWorkflow: 'enabled',
    isolatedValidator: 'enabled',
  });
});

// Multi-Provider Metadata Endpoint
app.get('/api/ai/providers', (req: Request, res: Response) => {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  res.json({
    providers: SUPPORTED_PROVIDERS,
    serverDefault: {
      provider: (key && key.length > 5) || !(process.env.OPENROUTER_API_KEY || '').trim() ? 'gemini' : 'openrouter',
      model: (key && key.length > 5) || !(process.env.OPENROUTER_API_KEY || '').trim() ? 'gemini-2.5-flash' : (process.env.OPENROUTER_DEFAULT_MODEL || 'openrouter/auto'),
      hasBuiltinKey: Boolean(key && key.length > 5)
    },
    openrouter: {
      hasServerKey: Boolean((process.env.OPENROUTER_API_KEY || '').trim())
    }
  });
});

// Is the OpenRouter key set and does it really work?
app.get('/api/ai/openrouter/status', requireAuth, aiLimiter, async (_req: Request, res: Response) => {
  res.json(await checkOpenRouterConnection());
});

// Every model available on OpenRouter (live list, cached for one hour)
app.get('/api/ai/openrouter/models', requireAuth, async (_req: Request, res: Response) => {
  try {
    const models = await fetchOpenRouterModels();
    res.json({ success: true, count: models.length, models });
  } catch (err: any) {
    res.status(502).json({ success: false, error: err.message || 'Could not load OpenRouter models' });
  }
});

// AI Connection Tester (BYOK validation)
app.post('/api/ai/test-connection', requireAuth, aiLimiter, async (req: Request, res: Response) => {
  try {
    const result = await testProviderConnection(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message || 'Connection test failed'
    });
  }
});

// Project Validation Endpoint (Isolated syntax and structure checker)
app.post('/api/ai/validate', requireAuth, (req: Request, res: Response) => {
  const { files = {} } = req.body;
  const result = validateProjectFiles(files);
  res.json(result);
});

// Strict Targeted Update for Existing Projects (Autonomous Agentic Workflow)
app.post('/api/ai/targeted-update', requireAuth, aiLimiter, async (req: Request, res: Response) => {
  const { prompt, currentFiles = {}, targetedSelector, aiConfig, language = 'so' } = req.body;
  const userPrompt = String(prompt || '').trim().slice(0, 4000);
  if (!userPrompt) return res.status(400).json({ success: false, error: 'Please describe what you want to build.' });

  try {
    // Execute iterative agentic workflow with real function calling
    const result = await executeAgenticWorkflow({
      prompt: userPrompt,
      mode: 'edit',
      currentFiles,
      targetedSelector,
      language,
      aiConfig
    });

    res.json({
      success: true,
      updatedFiles: result.files,
      changeRecord: result.changeRecord,
      explanation: result.explanation,
      validation: result.validation,
      featuresImplemented: result.featuresImplemented,
      modelUsed: result.modelUsed
    });
  } catch (err: any) {
    console.error('[Targeted Update Agent Error]:', err);
    // Deterministic fallback
    try {
      const fallbackResult = await performStrictTargetedProjectUpdate(userPrompt, currentFiles, aiConfig, language);
      res.json({
        success: true,
        ...fallbackResult
      });
    } catch (fallbackErr: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Failed to apply targeted update'
      });
    }
  }
});

// Phase 1: Build Complete Web Application (Autonomous Agentic Workflow)
app.post('/api/ai/build', requireAuth, aiLimiter, async (req: Request, res: Response) => {
  const { prompt, language = 'so', aiConfig } = req.body;
  const userPrompt = String(prompt || '').trim().slice(0, 4000);
  if (!userPrompt) return res.status(400).json({ success: false, error: 'Please describe what you want to build.' });

  let buildError = '';
  try {
    // Run full iterative agentic workflow
    const result = await executeAgenticWorkflow({
      prompt: userPrompt,
      mode: 'create',
      language,
      aiConfig
    });

    if (result && result.files && result.files['index.html']) {
      return res.json({
        success: true,
        projectName: result.projectName || userPrompt.slice(0, 32),
        tagline: result.tagline || userPrompt,
        explanation: result.explanation,
        indexHtml: result.files['index.html'],
        appTsx: result.files['src/App.tsx'] || '',
        files: result.files,
        changeRecord: result.changeRecord,
        validation: result.validation,
        featuresImplemented: result.featuresImplemented,
        modelUsed: result.modelUsed,
        fallback: Boolean(result.fallback),
        databaseTables: [
          {
            name: 'items',
            columns: ['id', 'title', 'category', 'status', 'created_at'],
            sampleRows: [
              { id: 1, title: 'Item 1', category: 'General', status: 'Active', created_at: new Date().toISOString() }
            ]
          }
        ]
      });
    }
  } catch (err: any) {
    buildError = err.message || String(err);
    console.warn('[Build Agent] Build failed:', buildError);
  }

  return res.status(502).json({
    success: false,
    error: `The AI could not build your project: ${buildError || 'no result'}. Check your API key and model, then try again.`
  });
});

// Phase 2: Plan Project Files
app.post('/api/ai/plan', requireAuth, async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const projectName = prompt ? prompt.slice(0, 30).trim() : 'Real Web Application';
  return res.json({
    projectName: projectName,
    projectDescription: `Full-stack application for: ${prompt}`,
    files: [
      { path: 'index.html', description: 'Interactive live preview sandbox' },
      { path: 'src/App.tsx', description: 'Main application entry point' },
      { path: 'src/components/Navbar.tsx', description: 'Responsive navigation bar' },
      { path: 'src/styles.css', description: 'Global styling and animations' }
    ]
  });
});

// Phase 3: Revise Existing Project (Calls Agentic Engine)
app.post('/api/ai/revise', requireAuth, aiLimiter, async (req: Request, res: Response) => {
  const { prompt, currentHtml = '', currentFiles = {}, aiConfig, language = 'so' } = req.body;
  const userPrompt = String(prompt || '').trim().slice(0, 4000);
  if (!userPrompt) return res.status(400).json({ success: false, error: 'Please describe what you want to build.' });

  try {
    const files = Object.keys(currentFiles).length > 0 
      ? currentFiles 
      : { 'index.html': currentHtml };

    const result = await executeAgenticWorkflow({
      prompt: userPrompt,
      mode: 'edit',
      currentFiles: files,
      language,
      aiConfig
    });

    const htmlKey = Object.keys(result.files).find(p => p.toLowerCase().endsWith('.html')) || 'index.html';
    const modifiedHtml = result.files[htmlKey] || currentHtml;

    return res.json({
      success: true,
      explanation: result.explanation,
      indexHtml: modifiedHtml,
      appTsx: result.files['src/App.tsx'],
      changeRecord: result.changeRecord,
      operations: [
        { op: 'update', path: htmlKey, content: modifiedHtml },
        ...(result.files['src/App.tsx'] ? [{ op: 'update', path: 'src/App.tsx', content: result.files['src/App.tsx'] }] : [])
      ],
      updatedFiles: result.files,
      validation: result.validation,
      featuresImplemented: result.featuresImplemented,
      modelUsed: result.modelUsed
    });
  } catch (err: any) {
    console.error('[Revise Error]:', err);
    res.status(500).json({ success: false, error: err.message || 'Revision failed' });
  }
});

// Auth endpoints (scrypt password hashes + signed httpOnly session cookie)
app.post('/api/auth/register', authLimiter, async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body?.email, req.body?.password, req.body?.fullName);
    setSession(res, user.id);
    res.status(201).json({ user });
  } catch (err: any) {
    res.status(err instanceof HttpError ? err.status : 500).json({ error: err.message || 'Could not create account.' });
  }
});

app.post('/api/auth/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const user = await loginUser(req.body?.email, req.body?.password);
    setSession(res, user.id);
    res.json({ user });
  } catch (err: any) {
    res.status(err instanceof HttpError ? err.status : 500).json({ error: err.message || 'Could not sign in.' });
  }
});

app.get('/api/auth/me', requireAuth, (req: Request, res: Response) => {
  res.json({ user: getUserById(req.userId!) });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  clearSession(res);
  res.json({ success: true });
});

// Persistent Project Storage Endpoints (each user only sees their own projects)
app.get('/api/projects', requireAuth, (req: Request, res: Response) => {
  res.json(Array.from(projectsStore.values()).filter(p => p.ownerId === req.userId));
});

app.get('/api/projects/:id', requireAuth, (req: Request, res: Response) => {
  const proj = ownedProject(req, res);
  if (proj) res.json(proj);
});

app.post('/api/projects', requireAuth, (req: Request, res: Response) => {
  const id = String(req.body?.id || req.body?._id || `proj-${Date.now()}`);
  const existing = projectsStore.get(id);
  if (existing && existing.ownerId !== req.userId) {
    return res.status(409).json({ error: 'Project id already in use.' });
  }
  const record = {
    ...req.body,
    id,
    _id: id,
    ownerId: req.userId,
    updatedAt: new Date().toISOString(),
    createdAt: req.body?.createdAt || new Date().toISOString()
  };
  projectsStore.set(id, record);
  saveProjectsToDisk();
  res.json(record);
});

app.put('/api/projects/:id', requireAuth, (req: Request, res: Response) => {
  const id = String(req.params.id);
  const existing = projectsStore.get(id);
  if (existing && existing.ownerId !== req.userId) {
    return res.status(404).json({ error: 'Project not found' });
  }
  const record = {
    ...(existing || {}),
    ...req.body,
    id,
    _id: id,
    ownerId: req.userId,
    updatedAt: new Date().toISOString()
  };
  projectsStore.set(id, record);
  saveProjectsToDisk();
  res.json(record);
});

app.delete('/api/projects/:id', requireAuth, (req: Request, res: Response) => {
  const proj = ownedProject(req, res);
  if (!proj) return;
  projectsStore.delete(proj.id);
  saveProjectsToDisk();
  res.json({ success: true, id: proj.id });
});

// Serve static assets from dist in production
if (IS_PROD) {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // In development, mount Vite dev server middleware
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { 
      middlewareMode: true,
      hmr: false,
    },
    appType: 'custom',
  });
  app.use(vite.middlewares);

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      res.status(500).end(e.stack);
    }
  });
}

// JSON error handler (bad JSON, body too large, etc.)
app.use((err: any, _req: Request, res: Response, next: express.NextFunction) => {
  if (res.headersSent) return next(err);
  const status = err?.status || err?.statusCode || 500;
  res.status(status).json({
    success: false,
    error: status === 413 ? 'The request is too large.' : status < 500 ? 'Bad request.' : 'Server error.'
  });
});

app.listen(PORT, () => {
  checkOpenRouterConnection().then(r => {
    if (r.configured) console.log(`[OpenRouter] ${r.connected ? 'OK' : 'NOT connected'}: ${r.message}`);
  });
  console.log(`[FURSAD AI Engine] Server running on port ${PORT}`);
});
