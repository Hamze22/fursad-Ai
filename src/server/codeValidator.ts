import vm from 'vm';
import * as esbuild from 'esbuild';

export interface ValidationResult {
  valid: boolean;
  passed: boolean;
  errors: string[];
  warnings: string[];
  checks: string[];
}

/**
 * Isolated syntax and structure validator for generated and edited project files.
 * Safely inspects HTML, embedded JS, CSS, and TypeScript/JSX code without running untrusted code.
 */
export function validateProjectFiles(files: Record<string, string>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const checks: string[] = [];

  const htmlKey = Object.keys(files).find(p => p.toLowerCase().endsWith('.html')) || 'index.html';
  const htmlContent = files[htmlKey] || '';

  if (!htmlContent || htmlContent.trim().length === 0) {
    errors.push(`Missing or empty main entry point: ${htmlKey}`);
  } else {
    checks.push(`Entry point found: ${htmlKey} (${htmlContent.length} bytes)`);

    // 1. Structural HTML checks
    if (!/<html/i.test(htmlContent)) {
      errors.push(`${htmlKey} is missing <html> tag.`);
    } else {
      checks.push('HTML root element present');
    }

    if (!/<body/i.test(htmlContent) || !/<\/body>/i.test(htmlContent)) {
      errors.push(`${htmlKey} is missing balanced <body> or </body> tag.`);
    } else {
      checks.push('HTML <body> tags verified');
    }

    // 2. Resource & CDN checks
    if (htmlContent.includes('cdn.tailwindcss.com')) {
      checks.push('Tailwind CSS engine included');
    } else if (htmlContent.includes('<style') || files['styles.css'] || files['src/index.css']) {
      checks.push('Custom styles provided');
    } else {
      warnings.push('Tailwind CDN or custom CSS not explicitly detected in HTML');
    }

    // 3. Isolated JavaScript syntax validation for embedded <script> tags
    const scriptRegex = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
    let scriptMatch;
    let scriptIndex = 0;

    while ((scriptMatch = scriptRegex.exec(htmlContent)) !== null) {
      scriptIndex++;
      const scriptBody = scriptMatch[1].trim();
      // Skip empty scripts or external-only scripts (e.g. src="...")
      if (!scriptBody || scriptMatch[0].includes('src=')) continue;

      try {
        // Validates syntax only using Node VM parser without executing
        new vm.Script(scriptBody, {
          filename: `${htmlKey}#script_${scriptIndex}.js`,
        });
        checks.push(`Inline JavaScript block #${scriptIndex} syntax verified`);
      } catch (syntaxErr: any) {
        errors.push(`JavaScript SyntaxError in ${htmlKey} (script block #${scriptIndex}): ${syntaxErr.message}`);
      }
    }
  }

  // 4. Validate TypeScript/React files (e.g. src/App.tsx)
  for (const [filePath, content] of Object.entries(files)) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx') || filePath.endsWith('.ts')) {
      if (!content || content.trim().length === 0) continue;
      try {
        esbuild.transformSync(content, {
          loader: filePath.endsWith('x') ? 'tsx' : 'ts',
          jsx: 'transform',
        });
        checks.push(`TypeScript/JSX syntax verified for ${filePath}`);
      } catch (tsErr: any) {
        errors.push(`TypeScript/JSX compile error in ${filePath}: ${tsErr.message}`);
      }
    }
  }

  const valid = errors.length === 0;
  return {
    valid,
    passed: valid,
    errors,
    warnings,
    checks,
  };
}

/**
 * Attempts automatic syntax and structure self-correction on HTML content.
 */
export function autoFixCommonHtmlIssues(html: string): string {
  let fixed = html.trim();

  // Ensure DOCTYPE exists
  if (!/^<!DOCTYPE\s+html>/i.test(fixed)) {
    fixed = `<!DOCTYPE html>\n${fixed}`;
  }

  // Ensure <html> exists
  if (!/<html/i.test(fixed)) {
    fixed = `<html lang="en">\n${fixed}\n</html>`;
  }

  // Ensure Tailwind CDN exists if Tailwind classes are used
  if (!fixed.includes('cdn.tailwindcss.com') && /class=["'][^"']*\b(flex|grid|bg-|text-|p-|m-)/.test(fixed)) {
    if (fixed.includes('<head>')) {
      fixed = fixed.replace('<head>', '<head>\n  <script src="https://cdn.tailwindcss.com"></script>');
    } else {
      fixed = fixed.replace('<body', '<head><script src="https://cdn.tailwindcss.com"></script></head>\n<body');
    }
  }

  // Ensure closing </body> and </html>
  if (!/<\/body>/i.test(fixed)) {
    fixed = fixed + '\n</body>';
  }
  if (!/<\/html>/i.test(fixed)) {
    fixed = fixed + '\n</html>';
  }

  return fixed;
}
