import axios from 'axios';
import pMap from 'p-map';
import { FileCodeSchema, FilePlanSchema, RevisionResultSchema } from './schemas.ts';
import { buildFileCodeSystem, FILE_PLAN_SYSTEM, REVISE_SYSTEM } from './prompts.ts';
import { normalizeContent } from './normalizer.ts';
import { validateAndFixCode, validateRevisionContent } from './validator.ts';

const MAX_CONCURRENCY = 6;

// Generate a single file's code via server proxy
async function generateSingleFile(file: any, allFiles: any[], prompt: string, alreadyGeneratedFiles: any) {
    const system = buildFileCodeSystem(allFiles, alreadyGeneratedFiles);
    const userMsg = `Project: ${prompt}\n\nWrite the complete code for: ${file.path}\nPurpose: ${file.description}`;

    console.log(`[AI] Creating file: ${file.path}...`);
    
    const response = await axios.post('/api/ai/generate-file', {
        prompt: userMsg,
        systemPrompt: system
    });

    const data = response.data;
    const validated = FileCodeSchema.parse(data);

    let code = normalizeContent(validated.code);

    if (code.trim().length === 0) {
        throw new Error("Generated code is empty after normalization");
    }

    // Apply post-generation validation and auto-fixing
    const validation = validateAndFixCode(code, file.path, { allPlannedFiles: allFiles });
    code = validation.code;

    if (validation.warnings.length > 0) {
        console.log(`[Validator] Code adjustments for ${file.path}:\n  - ${validation.warnings.join("\n  - ")}`);
    }

    console.log(`[AI] Created file: ${file.path} (${code.length} chars)`);
    return { path: file.path, code };
}

export async function generateProject(prompt: string, callbacks?: any) {
    // Phase 1: Plan
    console.log(`[AI] Phase 1: Planning file structure...`);
    const planResponse = await axios.post('/api/ai/plan', {
        prompt: `Plan a React website for: ${prompt}`,
        systemPrompt: callbacks?.systemPrompt || FILE_PLAN_SYSTEM
    });

    const plan = FilePlanSchema.parse(planResponse.data);

    if (!plan.files.find((f) => f.path === "/App.js")) {
        plan.files.unshift({
            path: "/App.js",
            description: "Main application entry point",
            exports: "default App",
            imports: ["./styles.css"],
        });
    }

    if (!plan.files.find((f) => f.path === "/styles.css")) {
        plan.files.push({
            path: "/styles.css",
            description: "Global CSS: Google Font import, keyframe animations, utility classes",
            exports: "none",
            imports: [],
        });
    }

    if (callbacks?.onPlan) {
        await callbacks.onPlan(plan);
    }

    const files: Record<string, string> = {};
    let pendingFiles = plan.files.map((f) => ({ ...f }));

    const maxRetryRounds = 2;

    for (let round = 0; round <= maxRetryRounds; round++) {
        if (pendingFiles.length === 0) break;

        const results = await pMap(
            pendingFiles,
            async (file) => {
                try {
                    if (callbacks?.onFileStart) {
                        await callbacks.onFileStart(file.path);
                    }

                    const singleResult = await generateSingleFile(file, plan.files, prompt, files);

                    if (callbacks?.onFileComplete) {
                        await callbacks.onFileComplete(file.path, singleResult.code);
                    }
                    return { success: true, file, result: singleResult };
                } catch (err) {
                    return { success: false, file, error: err };
                }
            },
            { concurrency: MAX_CONCURRENCY },
        );

        const failedFiles = [];
        for (const entry of results) {
            if (entry.success && entry.result) {
                const { path, code } = entry.result;
                files[path.startsWith("/") ? path : "/" + path] = code;
            } else {
                console.warn(`[AI] File ${entry.file.path} failed in round ${round}`);
                failedFiles.push(entry.file);
            }
        }
        pendingFiles = failedFiles;
    }

    if (!files["/App.js"]) {
        throw new Error("AI did not generate /App.js entry point");
    }

    return { files, description: plan.projectDescription, name: plan.projectName };
}

export async function reviseProject(prompt: string, manifest: any[], relevantFiles: Record<string, string>, recentMessages: any[]) {
    const contextParts = [];

    contextParts.push("## Current Project Files (manifest)");
    contextParts.push("```");
    for (const f of manifest) {
        contextParts.push(`${f.path} (${f.hash}, ${f.size}B)`);
    }
    contextParts.push("```");

    if (Object.keys(relevantFiles).length > 0) {
        contextParts.push("\n## File Contents (for reference)");
        for (const [path, content] of Object.entries(relevantFiles)) {
            contextParts.push(`\n### ${path}\n\`\`\`\n${content}\n\`\`\``);
        }
    }

    if (recentMessages.length > 0) {
        contextParts.push("\n## Recent Conversation");
        for (const msg of recentMessages.slice(-3)) {
            contextParts.push(`${msg.role}: ${msg.content}`);
        }
    }

    contextParts.push(`\n## Revision Request\n${prompt}`);

    console.log("[AI] Revising project...");

    const response = await axios.post('/api/ai/revise', {
        prompt: contextParts.join("\n"),
        systemPrompt: REVISE_SYSTEM
    });

    const rawParsed = RevisionResultSchema.parse(response.data);

    if (rawParsed && Array.isArray(rawParsed.operations)) {
        rawParsed.operations = rawParsed.operations.map((op) => {
            if (!op || typeof op !== "object") return op;

            let opStr = String(op.op || "").trim().toLowerCase();
            if (["create", "add", "new"].includes(opStr)) op.op = "create";
            else if (["update", "edit", "modify", "patch"].includes(opStr)) op.op = "update";
            else if (["delete", "remove", "del", "rm"].includes(opStr)) op.op = "delete";

            if (op.path && typeof op.path === "string" && !op.path.startsWith("/")) {
                op.path = "/" + op.path;
            }

            if (op.content) op.content = normalizeContent(op.content);
            if (op.search) op.search = normalizeContent(op.search);
            if (op.replace) op.replace = normalizeContent(op.replace);

            if (op.op === "create" && op.content) {
                const validation = validateRevisionContent(op.content, op.path, "create");
                op.content = validation.content;
            } else if (op.op === "update" && op.replace) {
                const validation = validateRevisionContent(op.replace, op.path, "update");
                op.replace = validation.content;
            }
            return op;
        });
    }
    return rawParsed;
}
