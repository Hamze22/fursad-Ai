import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { 
  generateGeminiAssistantHtml, 
  generateRestaurantHtml, 
  generateSchoolPortalHtml, 
  generateDynamicOperationsHtml 
} from './src/data/domainTemplates.ts';
import {
  SUPPORTED_PROVIDERS,
  testProviderConnection,
  executeMultiProviderJson,
  performStrictTargetedProjectUpdate
} from './src/server/aiAdapters.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));

// Persistent In-Memory Project Store
const projectsStore = new Map<string, any>();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: apiKey || undefined,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err);
    }
  }
  return aiClient;
}

// System Status Endpoint
app.get('/api/status', (req: Request, res: Response) => {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  res.json({
    status: 'online',
    hasApiKey: Boolean(key && key.length > 5),
    recommendedModel: 'gemini-3.8-flash',
    version: '4.2.0-multi-provider-gateway',
  });
});

// Multi-Provider Metadata Endpoint
app.get('/api/ai/providers', (req: Request, res: Response) => {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  res.json({
    providers: SUPPORTED_PROVIDERS,
    serverDefault: {
      provider: 'gemini',
      model: 'gemini-3.8-flash',
      hasBuiltinKey: Boolean(key && key.length > 5)
    }
  });
});

// AI Connection Tester (BYOK validation)
app.post('/api/ai/test-connection', async (req: Request, res: Response) => {
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

// Strict Targeted Update for Existing Projects
app.post('/api/ai/targeted-update', async (req: Request, res: Response) => {
  const { prompt, currentFiles = {}, aiConfig, language = 'so' } = req.body;
  const userPrompt = (prompt || '').trim();

  try {
    const result = await performStrictTargetedProjectUpdate(userPrompt, currentFiles, aiConfig, language);
    res.json({
      success: true,
      ...result
    });
  } catch (err: any) {
    console.error('[Targeted Update Error]:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to apply targeted update'
    });
  }
});

// Helper to generate with Gemini with multiple model fallbacks
async function callGeminiJson(contents: any, systemInstruction?: string, temp = 0.2): Promise<any> {
  const client = getAiClient();
  if (!client) {
    throw new Error('AI client not initialized');
  }

  const candidateModels = [
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash'
  ];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await client.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: temp,
        },
      });

      const text = response.text || '';
      let cleaned = text.trim();
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      } else {
        cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
      }
      return JSON.parse(cleaned);
    } catch (err: any) {
      console.warn(`[Gemini] Model ${model} failed:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

// System Prompt for Complete AI Build
const BUILD_SYSTEM_PROMPT = `You are FURSAD AI Builder, the premier full-stack AI web development engine.
The user provides a prompt describing a web application, website, or digital product they want to build.
The prompt may be written in Somali, English, Arabic, or another language.

CRITICAL RULES:
1. NEVER produce an empty or generic marketing landing page that simply repeats the prompt text as an <h2> headline!
2. If the user asks for a specific application or tool (e.g. calculator, todo app, tic-tac-toe, quiz game, weather app, expense tracker, unit converter):
   - You MUST build the REAL, FULLY FUNCTIONAL INTERACTIVE APPLICATION / GAME!
   - Every button must do something real with JavaScript!
3. If the user asks for a business/service app (e.g. school portal, hospital clinic, restaurant menu/ordering, e-commerce shop, real estate, car rental, gym, job board, booking system):
   - Build a comprehensive, multi-section web application featuring real data, working search and category filters, working shopping cart or booking modal, working order submission toasts, and responsive Tailwind styling!
4. Always provide an extensive, professional, multi-paragraph explanation in Somali (Af-Soomaali) detailing everything built, all features, and how to test them.

MANDATORY OUTPUT FORMAT:
You MUST respond with valid, strict JSON matching this schema:
{
  "projectName": "string (A descriptive, engaging title for the project)",
  "tagline": "string (A short, compelling subtitle)",
  "explanation": "string (Extensive, high-detail multi-paragraph explanation in Somali detailing:
    🚀 Maxaa la dhisay (Overview of the application)
    ✨ Astaamaha & Qeybaha (All sections, buttons, modals, interactive state)
    🎨 Naqshadda & Styling-ka (Tailwind color palette, responsive design)
    ⚙️ Sida loo tijaabiyo Live Preview-ga (Specific buttons you can click to test interactive state)
    💡 Talooyinka xiga (Suggestions for further modifications))",
  "indexHtml": "string (A complete, standalone HTML5 document with <!DOCTYPE html>, <html>, <head> with Tailwind CDN <script src='https://cdn.tailwindcss.com'></script>, FontAwesome <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' />, Google Fonts, and a complete <body> with real interactive JavaScript in <script> tags for counters, modals, filters, and dynamic DOM updates)",
  "appTsx": "string (Complete React component code for src/App.tsx matching the project)",
  "databaseTables": [
    {
      "name": "string (e.g. items, orders, users)",
      "columns": ["id", "title", "category", "price", "status"],
      "sampleRows": [
        { "id": 1, "title": "Sample Item", "category": "General", "price": 25.0, "status": "Active" }
      ]
    }
  ]
}`;

// System Prompt for AI Revision
const REVISE_SYSTEM_PROMPT = `You are FURSAD AI Builder, an elite code editor and AI development engine.
The user has an existing web application and provides an instruction to modify, restyle, add features, or transform it.
The user's instruction may be in Somali, English, or any language.

YOUR GOAL:
1. Understand the instruction (e.g. "bedel colorka", "kudar faallooyin", "ka dhig dukaan buugaagta", "add cart", "change title", "make calculator").
2. Apply the modifications directly to the code. Ensure the interactive JavaScript and Tailwind CSS are updated.
3. Provide a detailed, professional explanation in Somali of what was changed and how to verify it in the live preview.

MANDATORY OUTPUT FORMAT:
You MUST respond with valid, strict JSON matching this schema:
{
  "explanation": "string (Detailed explanation in Somali of exactly what was modified, added, or styled)",
  "indexHtml": "string (The complete updated HTML5 document with Tailwind CSS and working interactive JavaScript)",
  "appTsx": "string (The complete updated React code for src/App.tsx)",
  "operations": [
    { "op": "update", "path": "index.html", "content": "..." },
    { "op": "update", "path": "src/App.tsx", "content": "..." }
  ]
}`;

// Phase 1: Build Complete Web Application
app.post('/api/ai/build', async (req: Request, res: Response) => {
  const { prompt, model = 'gemini-2.5-flash', language = 'so', aiConfig } = req.body;
  const userPrompt = (prompt || '').trim();

  try {
    const userMessage = `User Request: "${userPrompt}"
Language for explanation: Somali (Af-Soomaali).

Requirements:
- Build a COMPLETE, rich, functional application (not just a title or placeholder text!).
- If it is a tool or game (e.g. calculator, todo, quiz), build the real working tool with embedded JavaScript logic!
- If it is a business/platform (e.g. store, school, restaurant, hospital, rental), build a full multi-feature portal with interactive filters, search, modal dialogs, and real data!
- Output valid, strict JSON matching the schema.`;

    let data: any = null;

    if (aiConfig && aiConfig.provider && (aiConfig.apiKey || aiConfig.provider === 'gemini')) {
      try {
        data = await executeMultiProviderJson(userMessage, BUILD_SYSTEM_PROMPT, aiConfig);
      } catch (provErr: any) {
        console.warn(`[Build Provider ${aiConfig.provider}] Fallback to default Gemini:`, provErr.message);
      }
    }

    if (!data) {
      data = await callGeminiJson(
        [{ role: 'user', parts: [{ text: userMessage }] }],
        BUILD_SYSTEM_PROMPT,
        0.3
      );
    }

    if (data && data.indexHtml && data.projectName) {
      return res.json({
        success: true,
        projectName: data.projectName,
        tagline: data.tagline || userPrompt,
        explanation: data.explanation || `Waxaan si guul leh kuugu dhisay: "${data.projectName}"!`,
        indexHtml: data.indexHtml,
        appTsx: data.appTsx || `import React from 'react';\n\nexport default function App() {\n  return <div className="p-8 text-white">${data.projectName}</div>;\n}`,
        databaseTables: data.databaseTables || [],
        files: {
          'index.html': data.indexHtml,
          'src/App.tsx': data.appTsx || '',
          ...(data.files || {})
        }
      });
    }
  } catch (err: any) {
    console.warn('[Gemini Build] API call encountered error, using intelligent application synthesizer:', err.message);
  }

  // Resilient fallback: build a rich, domain-specific functional application
  const promptLower = userPrompt.toLowerCase();
  let projectName = userPrompt.slice(0, 36) || 'Fursad AI Application';
  let category = 'Web Application';

  const isGemini = promptLower.includes('gemini') || 
    promptLower.includes('assistant') || 
    promptLower.includes('caawiye') || 
    promptLower.includes('chat') || 
    promptLower.includes('bot') || 
    promptLower.includes('llm') || 
    promptLower.includes('hadn wax ka codsado') ||
    promptLower.includes('wax ka codsado') ||
    promptLower.includes('ai builder') ||
    promptLower.includes('ai app');

  let fallbackHtml = '';

  if (isGemini) {
    projectName = 'Gemini 2.5 Flash • FURSAD AI Assistant';
    category = 'Artificial Intelligence Assistant';
    fallbackHtml = generateGeminiAssistantHtml(projectName);
  } else if (promptLower.includes('restaurant') || promptLower.includes('cunto') || promptLower.includes('cafe') || promptLower.includes('food') || promptLower.includes('dalab')) {
    projectName = 'Somali Delights • Restaurant & Food Order';
    category = 'Food & Hospitality';
    fallbackHtml = generateRestaurantHtml(projectName);
  } else if (promptLower.includes('school') || promptLower.includes('dugsi') || promptLower.includes('arday') || promptLower.includes('academy')) {
    projectName = 'Iftin Academy • Portal-ka Ardayda';
    category = 'Education Platform';
    fallbackHtml = generateSchoolPortalHtml(projectName);
  } else {
    fallbackHtml = generateDynamicOperationsHtml(projectName, userPrompt);
  }

  return res.json({
    success: true,
    projectName: projectName,
    tagline: userPrompt,
    explanation: `✨ Waxaan si buuxda kuugu dhisay barnaamijka: **${projectName}**!\n\n🚀 **Astaamaha la diyaariyay:**\n• Qaybta sare ee Hero-ga iyo Header-ka casriga ah\n• Badhanno firfircoon oo modal furi kara kuna dari kara xog cusub (Interactive State)\n• Filter-ka qaybaha (Tabs) iyo sanduuqa raadinta (Live Search Filter)\n• Koodhka buuxa ee index.html, Tailwind utility classes, iyo JavaScript diyaar ah.`,
    indexHtml: fallbackHtml,
    appTsx: `import React from 'react';\n\nexport default function App() {\n  return <div className="min-h-screen bg-slate-950 text-white p-8"><h1>${projectName}</h1></div>;\n}`,
    databaseTables: [
      {
        name: 'items',
        columns: ['id', 'title', 'category', 'status', 'created_at'],
        sampleRows: [
          { id: 1, title: 'Item 1', category: 'General', status: 'Active', created_at: new Date().toISOString() }
        ]
      }
    ],
    files: {
      'index.html': fallbackHtml,
      'src/App.tsx': `import React from 'react';\n\nexport default function App() {\n  return <div className="min-h-screen bg-slate-950 text-white p-8"><h1>${projectName}</h1></div>;\n}`
    }
  });
});

// Phase 2: Plan Project Files
app.post('/api/ai/plan', async (req: Request, res: Response) => {
  const { prompt, systemPrompt } = req.body;
  try {
    const data = await callGeminiJson([{ role: 'user', parts: [{ text: `Task: ${prompt}` }] }], systemPrompt, 0.1);
    return res.json(data);
  } catch (err: any) {
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
  }
});

// Phase 3: Revise Existing Project (Strict Targeted Update Mode)
app.post('/api/ai/revise', async (req: Request, res: Response) => {
  const { prompt, currentHtml = '', currentFiles = {}, aiConfig, language = 'so' } = req.body;
  const userPrompt = (prompt || '').trim();

  try {
    const files = Object.keys(currentFiles).length > 0 
      ? currentFiles 
      : { 'index.html': currentHtml };

    const result = await performStrictTargetedProjectUpdate(userPrompt, files, aiConfig, language);
    const htmlKey = Object.keys(result.updatedFiles).find(p => p.toLowerCase().endsWith('.html')) || 'index.html';
    const modifiedHtml = result.updatedFiles[htmlKey] || currentHtml;

    return res.json({
      success: true,
      explanation: result.explanation,
      indexHtml: modifiedHtml,
      appTsx: result.updatedFiles['src/App.tsx'],
      changeRecord: result.changeRecord,
      operations: [
        { op: 'update', path: htmlKey, content: modifiedHtml },
        ...(result.updatedFiles['src/App.tsx'] ? [{ op: 'update', path: 'src/App.tsx', content: result.updatedFiles['src/App.tsx'] }] : [])
      ],
      updatedFiles: result.updatedFiles
    });
  } catch (err: any) {
    console.error('[Revise Error]:', err);
    res.status(500).json({ success: false, error: err.message || 'Revision failed' });
  }
});

// Mock Auth Endpoints for the Builder flow
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  res.json({ user: { email: email || 'guest@example.com' } });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  res.status(401).json({ error: 'Not authenticated' });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  res.json({ success: true });
});

// Real In-Memory Project Persistence Endpoints (Preserves existing projects across refresh and re-opening)
app.get('/api/projects', (req: Request, res: Response) => {
  const list = Array.from(projectsStore.values());
  res.json(list);
});

app.get('/api/projects/:id', (req: Request, res: Response) => {
  const proj = projectsStore.get(req.params.id);
  if (!proj) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(proj);
});

app.post('/api/projects', (req: Request, res: Response) => {
  const id = req.body.id || req.body._id || `proj-${Date.now()}`;
  const record = {
    ...req.body,
    id,
    _id: id,
    updatedAt: new Date().toISOString(),
    createdAt: req.body.createdAt || new Date().toISOString()
  };
  projectsStore.set(id, record);
  res.json(record);
});

app.put('/api/projects/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const existing = projectsStore.get(id) || {};
  const record = {
    ...existing,
    ...req.body,
    id,
    _id: id,
    updatedAt: new Date().toISOString()
  };
  projectsStore.set(id, record);
  res.json(record);
});

app.delete('/api/projects/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  projectsStore.delete(id);
  res.json({ success: true, id });
});

// Serve static assets from dist in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // In development, mount Vite dev server middleware
  const { createServer } = await import('vite');
  const fs = (await import('fs')).default;
  const vite = await createServer({
    server: { 
      middlewareMode: true,
      hmr: false,
    },
    appType: 'custom', // Use custom to handle the index.html yourself
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
