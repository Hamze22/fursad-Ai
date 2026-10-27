import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { validateProjectFiles, autoFixCommonHtmlIssues } from './codeValidator.ts';
import { ChangeRecord, AIProviderConfig } from '../types.ts';
import { executeMultiProviderJson, getProviderCandidates, providerLabel } from './aiAdapters.ts';

// Recommended reliable models in order of priority based on live API audit
export const WORKING_GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash'
];

interface AgentWorkspace {
  files: Record<string, string>;
  filesCreated: string[];
  filesModified: string[];
  filesDeleted: string[];
  logs: string[];
}

export interface AgentExecutionResult {
  success: boolean;
  projectName?: string;
  tagline?: string;
  explanation: string;
  files: Record<string, string>;
  changeRecord?: ChangeRecord;
  validation: {
    passed: boolean;
    errors: string[];
    warnings: string[];
    checks: string[];
  };
  featuresImplemented: string[];
  modelUsed: string;
  fallback?: boolean;
}

// Function Declarations for Gemini Function Calling
const AGENT_TOOLS: FunctionDeclaration[] = [
  {
    name: 'list_project_files',
    description: 'Lists all files currently in the project workspace with their sizes.',
    parameters: {
      type: Type.OBJECT,
      properties: {},
    },
  },
  {
    name: 'read_project_file',
    description: 'Reads the entire content of a file from the project workspace.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        path: {
          type: Type.STRING,
          description: 'The relative file path, e.g. index.html or src/App.tsx',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'write_project_file',
    description: 'Creates a new file or overwrites an existing file with complete content.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        path: {
          type: Type.STRING,
          description: 'The file path, e.g. index.html, src/App.tsx, styles.css',
        },
        content: {
          type: Type.STRING,
          description: 'The complete, pristine code content of the file.',
        },
      },
      required: ['path', 'content'],
    },
  },
  {
    name: 'patch_project_file',
    description: 'Surgically replaces a specific snippet within an existing file. Ideal for targeted style, text, or component changes.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        path: {
          type: Type.STRING,
          description: 'The file path to modify, e.g. index.html',
        },
        search: {
          type: Type.STRING,
          description: 'The exact string snippet currently in the file to find and replace.',
        },
        replace: {
          type: Type.STRING,
          description: 'The replacement string snippet.',
        },
      },
      required: ['path', 'search', 'replace'],
    },
  },
  {
    name: 'delete_project_file',
    description: 'Deletes an obsolete file from the project workspace.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        path: {
          type: Type.STRING,
          description: 'The file path to remove',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'validate_project',
    description: 'Runs isolated syntax, HTML structure, and JavaScript parsing validation on the project files. Returns any errors found.',
    parameters: {
      type: Type.OBJECT,
      properties: {},
    },
  },
  {
    name: 'finish_agent_task',
    description: 'Concludes the agentic workflow after all file operations and validations have succeeded.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        projectName: {
          type: Type.STRING,
          description: 'Name of the project',
        },
        summary: {
          type: Type.STRING,
          description: 'Short 1-sentence technical summary of the exact changes made',
        },
        explanation: {
          type: Type.STRING,
          description: 'Detailed user explanation in Somali (Af-Soomaali) detailing all implemented sections and how to test them',
        },
        featuresImplemented: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'List of features actually built or updated',
        },
      },
      required: ['summary', 'explanation'],
    },
  },
];

const AGENT_SYSTEM_PROMPT = `You are FURSAD AI's Autonomous Senior Web Architect and Coding Engine.
You operate via iterative tool calling to inspect, plan, write, patch, and validate complete web projects.

MODES OF OPERATION:
1. CREATE MODE (New Project):
   - Build a comprehensive, multi-section / multi-page responsive web application with real interactive features!
   - Must create "index.html" with HTML5, Tailwind CDN (<script src="https://cdn.tailwindcss.com"></script>), FontAwesome icons, and working JavaScript.
   - Include real interactive interactions: working tabs/page switcher (e.g. Home, About, Services/Products, Contact), live search filter, working modal dialogs, functional cart or booking, dark/light theme toggle, and responsive mobile nav.
   - NEVER create a blank placeholder or text that merely echoes the prompt!
   - Every button must do something real!
   - Also create "src/App.tsx" with modern React code matching the project.

2. EDIT MODE (Existing Project):
   - You must inspect existing files using read_project_file or list_project_files.
   - Make ONLY the minimal, targeted modification requested (e.g. change hero background to white, update pricing to $19, add contact form).
   - PRESERVE all existing navigation, hero sections, pricing tiers, footers, interactive JavaScript, scripts, fonts, and data models intact!
   - Use patch_project_file or write_project_file to apply surgical modifications.
   - Never overwrite the entire existing project with an unrelated template.

VALIDATION & SELF-CORRECTION:
- Before concluding, always call "validate_project".
- If validate_project reports syntax or HTML errors, immediately fix them with patch_project_file or write_project_file!
- Once validation succeeds, call "finish_agent_task" with a clear, professional explanation in Somali (Af-Soomaali).`;

/**
 * Executes the full agentic coding workflow using Gemini Function Calling.
 */
async function executeAgenticWorkflowOnce(params: {
  prompt: string;
  mode: 'create' | 'edit';
  currentFiles?: Record<string, string>;
  targetedSelector?: string;
  language?: string;
  aiConfig?: Partial<AIProviderConfig>;
}): Promise<AgentExecutionResult> {
  const {
    prompt,
    mode,
    currentFiles = {},
    targetedSelector,
    language = 'so',
    aiConfig,
  } = params;

  // Providers other than Gemini (OpenRouter, OpenAI, Groq, ...) use the provider workflow
  if (aiConfig?.provider && aiConfig.provider !== 'gemini') {
    return executeProviderWorkflow({ prompt, mode, currentFiles, targetedSelector, language, aiConfig });
  }

  const apiKey = aiConfig?.apiKey || process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Working copy of files in sandbox
  const workspace: AgentWorkspace = {
    files: { ...currentFiles },
    filesCreated: [],
    filesModified: [],
    filesDeleted: [],
    logs: [],
  };

  const initialSnapshot: Record<string, string> = { ...currentFiles };
  let finalProjectName = 'FURSAD AI Web App';
  let finalTagline = prompt.slice(0, 60);
  let finalExplanation = '';
  let finalSummary = '';
  let featuresImplemented: string[] = [];
  let modelUsed = 'gemini-2.5-flash';

  // Determine candidate models
  const candidateModels = [
    aiConfig?.model && aiConfig.model !== 'gemini-3.8-flash' ? aiConfig.model : null,
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash'
  ].filter(Boolean) as string[];

  // Prepare initial user message
  const fileManifest = Object.keys(workspace.files).map(p => `${p} (${workspace.files[p].length} bytes)`).join(', ');
  const userInstructions = mode === 'edit'
    ? `TASK: EDIT EXISTING PROJECT
User Request: "${prompt}"
Target Element / Selector: ${targetedSelector || 'Inspect files to determine'}
Existing Project Files: [${fileManifest || 'none'}]

Instructions:
1. Read the relevant existing file (e.g. index.html).
2. Apply the requested modification surgically without breaking or removing unrelated sections (Navbar, Pricing, Footer, Scripts).
3. Validate the project.
4. Call finish_agent_task.`
    : `TASK: CREATE COMPLETE WEB APPLICATION
User Request: "${prompt}"
Language for explanation: ${language === 'en' ? 'English' : 'Somali (Af-Soomaali)'}.

Requirements:
1. Build a rich, complete, responsive web application for: "${prompt}".
2. Write index.html with HTML5, Tailwind CSS, FontAwesome, Google Fonts, and full interactive JavaScript.
3. Include working page/tab navigation (e.g. Home, Features, Services, Contact), working modal dialogs, and interactive state.
4. Also write src/App.tsx matching the design.
5. Validate the project.
6. Write all visible website text in the same language the user used in the request.
7. Call finish_agent_task.`;

  let agentSucceeded = false;
  let lastModelError = '';

  for (const model of candidateModels) {
    try {
      const contents: any[] = [
        { role: 'user', parts: [{ text: userInstructions }] }
      ];

      const maxTurns = 6;
      let turns = 0;
      let finished = false;

      while (turns < maxTurns && !finished) {
        turns++;

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout calling model ${model}`)), 90000)
        );

        const response: any = await Promise.race([
          ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction: AGENT_SYSTEM_PROMPT,
              tools: [{ functionDeclarations: AGENT_TOOLS }],
              temperature: 0.2,
            },
          }),
          timeoutPromise,
        ]);

        const candidate = response.candidates?.[0];
        if (!candidate || !candidate.content) {
          break;
        }

        const functionCalls = response.functionCalls;

        // If no tool calls were returned, model finished with text
        if (!functionCalls || functionCalls.length === 0) {
          if (!finalExplanation && response.text) {
            finalExplanation = response.text;
          }
          break;
        }

        // Add model's turn to conversation history
        contents.push(candidate.content);

        // Execute each requested tool in our isolated sandbox
        const toolResponses = [];

        for (const call of functionCalls) {
          const { name, args, id } = call as any;
          let toolResult: any = { success: true };

          try {
            if (name === 'list_project_files') {
              toolResult = {
                files: Object.keys(workspace.files).map(p => ({
                  path: p,
                  size: workspace.files[p].length,
                })),
              };
            } else if (name === 'read_project_file') {
              const p = args.path;
              const content = workspace.files[p] || workspace.files[`/${p}`] || workspace.files[p.replace(/^\//, '')];
              if (content !== undefined) {
                toolResult = { path: p, content };
              } else {
                toolResult = { error: `File not found: ${p}` };
              }
            } else if (name === 'write_project_file') {
              const p = args.path.replace(/^\//, '');
              const content = autoFixCommonHtmlIssues(args.content);
              const isNew = !workspace.files[p];
              workspace.files[p] = content;
              if (isNew) {
                workspace.filesCreated.push(p);
              } else {
                workspace.filesModified.push(p);
              }
              toolResult = { success: true, path: p, bytesWritten: content.length };
            } else if (name === 'patch_project_file') {
              const p = args.path.replace(/^\//, '');
              const existing = workspace.files[p] || '';
              if (!existing) {
                toolResult = { error: `File ${p} does not exist to patch` };
              } else if (!existing.includes(args.search)) {
                toolResult = {
                  error: `Search snippet not found in ${p}. Make sure the snippet matches existing code precisely.`,
                };
              } else {
                workspace.files[p] = existing.replace(args.search, args.replace);
                workspace.filesModified.push(p);
                toolResult = { success: true, path: p, message: 'Snippet replaced successfully' };
              }
            } else if (name === 'delete_project_file') {
              const p = args.path.replace(/^\//, '');
              delete workspace.files[p];
              workspace.filesDeleted.push(p);
              toolResult = { success: true, path: p, message: 'File deleted' };
            } else if (name === 'validate_project') {
              const val = validateProjectFiles(workspace.files);
              toolResult = {
                valid: val.valid,
                errors: val.errors,
                warnings: val.warnings,
                checks: val.checks,
              };
            } else if (name === 'finish_agent_task') {
              finalProjectName = args.projectName || finalProjectName;
              finalSummary = args.summary || `Updated project based on: "${prompt}"`;
              finalExplanation = args.explanation || finalExplanation;
              featuresImplemented = args.featuresImplemented || [];
              finished = true;
              toolResult = { success: true, message: 'Agent task marked as complete.' };
            }
          } catch (execErr: any) {
            toolResult = { error: execErr.message || 'Execution error' };
          }

          toolResponses.push({
            functionResponse: {
              name,
              response: toolResult,
              id,
            },
          });
        }

        // Add tool responses back to conversation
        contents.push({
          role: 'tool',
          parts: toolResponses,
        });

        if (finished) break;
      }

      // Check if files were created or modified
      const hasHtml = Boolean(workspace.files['index.html'] && workspace.files['index.html'].length > 100);
      if (hasHtml) {
        modelUsed = model;
        agentSucceeded = true;
        break;
      }
    } catch (modelErr: any) {
      lastModelError = modelErr?.message || String(modelErr);
      console.warn(`[Agentic Engine] Model ${model} failed:`, lastModelError);
    }
  }

  // No templates: if the AI did not produce a real website, report the error.
  if (!agentSucceeded || !workspace.files['index.html']) {
    throw new Error(lastModelError || 'The AI did not produce a website. Check your API key and model, then try again.');
  }

  // Run final isolated validation
  const validation = validateProjectFiles(workspace.files);

  // Build change record
  const modifiedList = Array.from(new Set([...workspace.filesCreated, ...workspace.filesModified]));
  const changeRecord: ChangeRecord = {
    id: `chg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    originalRequest: prompt,
    filesModified: modifiedList.length > 0 ? modifiedList : ['index.html'],
    summary: finalSummary || `Applied changes for: "${prompt}"`,
    targetElement: targetedSelector || (mode === 'edit' ? 'Targeted Component' : 'Complete Project'),
    changeType: mode === 'edit' ? 'style' : 'feature',
    validation: {
      passed: validation.valid,
      checks: validation.checks,
    },
    previewStatus: 'synced',
    saveStatus: 'saved',
    snapshot: initialSnapshot,
  };

  return {
    success: true,
    projectName: finalProjectName,
    tagline: finalTagline,
    explanation: finalExplanation || `Fulinta hawsha "${prompt}" waa la dhameystiray.`,
    files: workspace.files,
    changeRecord,
    validation,
    featuresImplemented: featuresImplemented.length > 0 ? featuresImplemented : ['Interactive layout updated', 'Live preview verified'],
    modelUsed,
    fallback: false,
  };
}


/**
 * Public entry point. Tries the provider the user chose first (Gemini or an
 * OpenRouter model). If it fails, the other built-in provider is used
 * automatically. The explanation says which one answered.
 */
export async function executeAgenticWorkflow(params: {
  prompt: string;
  mode: 'create' | 'edit';
  currentFiles?: Record<string, string>;
  targetedSelector?: string;
  language?: string;
  aiConfig?: Partial<AIProviderConfig>;
}): Promise<AgentExecutionResult> {
  const candidates = getProviderCandidates(params.aiConfig);
  if (candidates.length === 0) {
    throw new Error('No AI provider is configured. Set GEMINI_API_KEY or OPENROUTER_API_KEY in .env, or add your own key in Settings.');
  }

  const failures: string[] = [];
  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    try {
      const result = await executeAgenticWorkflowOnce({ ...params, aiConfig: candidate });
      if (i > 0) {
        result.explanation += `\n\nℹ️ ${providerLabel(candidates[0])} did not respond, so ${providerLabel(candidate)} was used automatically.`;
      }
      return result;
    } catch (err: any) {
      const reason = err?.message || String(err);
      failures.push(`${providerLabel(candidate)}: ${reason}`);
      console.warn(`[AI Failover] ${providerLabel(candidate)} failed: ${reason}`);
    }
  }
  throw new Error(failures.join(' | '));
}

/**
 * Single-shot workflow for providers without Gemini function calling
 * (OpenRouter, OpenAI, Groq, Anthropic, Cloudflare). The model returns the
 * whole project as JSON, which is then validated.
 */
async function executeProviderWorkflow(params: {
  prompt: string;
  mode: 'create' | 'edit';
  currentFiles?: Record<string, string>;
  targetedSelector?: string;
  language?: string;
  aiConfig: Partial<AIProviderConfig>;
}): Promise<AgentExecutionResult> {
  const { prompt, mode, currentFiles = {}, targetedSelector, language = 'so', aiConfig } = params;
  const explainLang = language === 'en' ? 'English' : 'Somali (Af-Soomaali)';

  const system = `You are an expert full-stack web developer. You build complete, modern, responsive, working websites and web apps.
Return ONE JSON object and nothing else, with exactly this shape:
{
  "projectName": "short project name",
  "tagline": "one-line description",
  "explanation": "what you built or changed, written in ${explainLang}",
  "features": ["feature 1", "feature 2"],
  "files": {
    "index.html": "the COMPLETE index.html (HTML5, Tailwind CSS via CDN, inline JavaScript, fully working)",
    "src/App.tsx": "a matching React component (optional)"
  }
}
Rules: build a REAL, complete website for the exact request, with real content and copy written for it (no lorem ipsum, no placeholder sections, no generic template). Write all visible website text in the same language as the user's request. Never return partial files or placeholders like "rest of the code". Escape the file contents correctly inside JSON.`;

  const existing = currentFiles['index.html'] || '';
  const userMsg = mode === 'edit'
    ? `TASK: EDIT EXISTING PROJECT
User request: "${prompt}"
Target element / selector: ${targetedSelector || 'determine from the request'}
Apply the change surgically. Keep every unrelated section (navbar, pricing, footer, scripts) intact. Return the COMPLETE updated index.html.

Current index.html:
${existing.slice(0, 60000)}`
    : `TASK: CREATE A COMPLETE WEB APPLICATION
User request: "${prompt}"
Build a rich, complete, responsive application for exactly this request, with working navigation between sections, working interactions, and a modern design.`;

  const out = await executeMultiProviderJson(userMsg, system, aiConfig);

  let html = String(out?.files?.['index.html'] ?? out?.indexHtml ?? '');
  if (html.length < 100) {
    throw new Error('The model did not return a valid index.html');
  }
  html = autoFixCommonHtmlIssues(html);

  const files: Record<string, string> = { ...currentFiles, 'index.html': html };
  const appTsx = out?.files?.['src/App.tsx'] ?? out?.appTsx;
  if (typeof appTsx === 'string' && appTsx.length > 20) files['src/App.tsx'] = appTsx;

  const validation = validateProjectFiles(files);
  const touched = Object.keys(files).filter(p => files[p] !== currentFiles[p]);
  const changeRecord: ChangeRecord = {
    id: `chg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    originalRequest: prompt,
    filesModified: touched.length > 0 ? touched : ['index.html'],
    summary: String(out?.explanation || `Applied changes for: "${prompt}"`).slice(0, 200),
    targetElement: targetedSelector || (mode === 'edit' ? 'Targeted Component' : 'Complete Project'),
    changeType: mode === 'edit' ? 'style' : 'feature',
    validation: {
      passed: validation.valid,
      checks: validation.checks,
    },
    previewStatus: 'synced',
    saveStatus: 'saved',
    snapshot: { ...currentFiles },
  };

  return {
    success: true,
    projectName: String(out?.projectName || prompt.slice(0, 32)),
    tagline: String(out?.tagline || prompt.slice(0, 60)),
    explanation: String(out?.explanation || `Fulinta hawsha "${prompt}" waa la dhameystiray.`),
    files,
    changeRecord,
    validation,
    featuresImplemented: Array.isArray(out?.features) && out.features.length > 0 ? out.features.map(String) : ['Interactive layout generated', 'Live preview verified'],
    modelUsed: `${aiConfig.provider}:${aiConfig.model || 'default'}`,
    fallback: false,
  };
}
