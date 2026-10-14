import { saveAs } from "file-saver";
import JSZip from "jszip";

// Browser-compatible simple hash (non-cryptographic, just for IDs)
export function hashContent(content: string) {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
}

// Scans source files to detect npm dependencies from import statements
export function detectDependencies(files: Record<string, string>) {
    const deps: Record<string, string> = {};
    if (!files) return deps;

    const allCode = Object.values(files).join("\n");
    const filePaths = Object.keys(files);

    const isLocalFileOrFolder = (pkgName: string) => {
        const name = pkgName.startsWith("@/") ? pkgName.substring(2) : pkgName;
        return (
            pkgName.startsWith("@/") ||
            pkgName === "@" ||
            filePaths.some(p => 
                p === `/${name}` || 
                p.startsWith(`/${name}/`) || 
                p.replace(/\.[^/.]+$/, "") === `/${name}`
            )
        );
    };

    const importRegex = /from\s+['"]([^./][^'"]*)['"]/g;
    let match;
    while ((match = importRegex.exec(allCode)) !== null) {
        const rawImport = match[1];

        // Scoped packages like @scope/package, normal packages like package
        const pkg = rawImport.startsWith("@") && !rawImport.startsWith("@/")
            ? rawImport.split("/").slice(0, 2).join("/")
            : rawImport.split("/")[0];

        // Skip react (included in template), react-dom, and local modules
        if (pkg !== "react" && pkg !== "react-dom" && !isLocalFileOrFolder(pkg)) {
            deps[pkg] = "latest";
        }
    }
    return deps;
}

export async function exportProjectZip(project: any) {
    if (!project) return;
    try {
        const zip = new JSZip();

        // Normalize files and detect dependencies from import statements
        const fileMap: Record<string, string> = {};
        for (const [path, content] of Object.entries(project.files)) {
            const fileCode = typeof content === "string" ? content : (content as any)?.content || "";
            fileMap[path] = fileCode;
        }
        const detectedDeps = detectDependencies(fileMap);

        // Add package.json
        zip.file(
            "package.json",
            JSON.stringify(
                {
                    name: (project.name || "my-website").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    private: true,
                    version: "0.1.0",
                    type: "module",
                    scripts: {
                        dev: "vite",
                        build: "vite build",
                        preview: "vite preview",
                    },
                    dependencies: {
                        react: "^18.2.0",
                        "react-dom": "^18.2.0",
                        ...detectedDeps,
                    },
                    devDependencies: {
                        "@vitejs/plugin-react": "^4.2.0",
                        vite: "^5.0.0",
                        tailwindcss: "^3.4.0",
                        autoprefixer: "^10.4.0",
                        postcss: "^8.4.0",
                    },
                },
                null,
                2,
            ),
        );

        // Add vite.config.js
        zip.file(
            "vite.config.js",
            `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`,
        );

        // Add index.html
        zip.file(
            "index.html",
            `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${project.name || "My Website"}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
`,
        );

        // Add main.jsx entry
        zip.file(
            "src/main.jsx",
            `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
        );

        // Add project files
        for (const [path, content] of Object.entries(fileMap)) {
            const cleanPath = path.startsWith("/") ? path.slice(1) : path;
            zip.file(`src/${cleanPath}`, content);
        }

        const blob = await zip.generateAsync({ type: "blob" });
        const fileName = `${(project.name || "website").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.zip`;
        saveAs(blob, fileName);
    } catch (error) {
        console.error("Export project error:", error);
    }
}

// Apply AI file operations
export function applyOperations(currentFiles: any, operations: any[]) {
    const files = { ...currentFiles };
    const applied: string[] = [];
    const errors: string[] = [];

    for (const op of operations) {
        try {
            switch (op.op) {
                case "create": {
                    files[op.path] = op.content;
                    applied.push(`created ${op.path}`);
                    break;
                }
                case "update": {
                    if (op.content) {
                        files[op.path] = op.content;
                        applied.push(`updated ${op.path}`);
                        break;
                    }
                    const existing = files[op.path];
                    if (!existing) {
                        if (op.replace) {
                            files[op.path] = op.replace;
                            applied.push(`created ${op.path}`);
                            break;
                        }
                        errors.push(`update ${op.path}: file not found`);
                        break;
                    }
                    const newContent = (op.search && op.replace) ? searchReplace(existing, op.search, op.replace) : (op.replace || null);
                    if (newContent === null) {
                        if (op.replace) {
                            files[op.path] = op.replace;
                            applied.push(`updated ${op.path}`);
                            break;
                        }
                        errors.push(`update ${op.path}: search string not found`);
                        break;
                    }
                    files[op.path] = newContent;
                    applied.push(`updated ${op.path}`);
                    break;
                }
                case "delete": {
                    delete files[op.path];
                    applied.push(`deleted ${op.path}`);
                    break;
                }
            }
        } catch (err: any) {
            errors.push(`${op.op} ${op.path}: ${err.message}`);
        }
    }
    return { files, applied, errors };
}

function searchReplace(content: string, search: string, replace: string) {
    if (content.includes(search)) {
        return content.replace(search, () => replace);
    }
    return null;
}
