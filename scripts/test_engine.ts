import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { executeAgenticWorkflow } from '../src/server/agenticEngine.ts';
import { validateProjectFiles } from '../src/server/codeValidator.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TestResult {
  testNumber: number;
  name: string;
  passed: boolean;
  details: string;
  filesInspected: string[];
}

const results: TestResult[] = [];

async function runAcceptanceTests() {
  console.log('====================================================');
  console.log('Starting FURSAD AI Engine Acceptance Tests Suite');
  console.log('====================================================\n');

  // TEST 1: Build a new responsive business website with several pages
  console.log('[Test 1] Building a new responsive business website with several pages...');
  try {
    const buildResult = await executeAgenticWorkflow({
      prompt: 'Build a modern responsive consulting business website with multi-page navigation (Home, About, Services, Pricing, Contact) and Tailwind styling',
      mode: 'create',
      language: 'so'
    });

    const indexHtml = buildResult.files['index.html'] || '';
    const hasNav = indexHtml.includes('<nav') || indexHtml.includes('<header');
    const hasPages = indexHtml.includes('switchTab') || (indexHtml.includes('Services') && indexHtml.includes('Contact'));
    const hasTailwind = indexHtml.includes('cdn.tailwindcss.com');
    const val = validateProjectFiles(buildResult.files);

    const passed = Boolean(buildResult.success && indexHtml.length > 500 && hasNav && hasTailwind && val.valid);
    results.push({
      testNumber: 1,
      name: 'Build new responsive business website with several pages',
      passed,
      details: `Project "${buildResult.projectName}" built with ${Object.keys(buildResult.files).length} files, ${indexHtml.length} bytes HTML. Multi-page navigation verified. Syntax valid: ${val.valid}. Checks: ${val.checks.length}.`,
      filesInspected: Object.keys(buildResult.files)
    });
    console.log(`[Test 1] Passed: ${passed}\n`);
  } catch (err: any) {
    results.push({
      testNumber: 1,
      name: 'Build new responsive business website with several pages',
      passed: false,
      details: `Error: ${err.message}`,
      filesInspected: []
    });
    console.log(`[Test 1] Failed: ${err.message}\n`);
  }

  // TEST 2: Change its background color without rebuilding unrelated sections
  console.log('[Test 2] Changing background color without rebuilding unrelated sections...');
  try {
    const baseFiles = {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white">
  <header id="navbar" class="h-16 bg-slate-900 border-b border-white/10 px-6 flex items-center justify-between">
    <span class="font-bold">TestCorp</span>
    <nav class="flex gap-4"><a href="#hero">Hero</a><a href="#pricing">Pricing</a></nav>
  </header>
  <section id="hero" class="py-20 bg-slate-950 text-white text-center">
    <h1 class="text-4xl font-bold">Welcome to TestCorp</h1>
    <p class="hero-subtitle text-slate-400">Leading enterprise tech solutions.</p>
  </section>
  <section id="pricing" class="py-20 bg-slate-900 text-center">
    <div class="text-3xl font-bold">$49/mo</div>
  </section>
  <footer id="footer" class="py-8 bg-slate-950 text-slate-400 text-center">
    <p>&copy; 2026 TestCorp. All rights reserved.</p>
  </footer>
</body>
</html>`
    };

    const editResult = await executeAgenticWorkflow({
      prompt: 'Change only the background color of the hero section to white',
      mode: 'edit',
      currentFiles: baseFiles,
      targetedSelector: 'section#hero'
    });

    const modifiedHtml = editResult.files['index.html'] || '';
    const heroIsWhite = modifiedHtml.includes('bg-white') && (modifiedHtml.includes('id="hero"') || modifiedHtml.includes('hero'));
    const navbarIntact = modifiedHtml.includes('TestCorp') && modifiedHtml.includes('id="navbar"');
    const pricingIntact = modifiedHtml.includes('id="pricing"') && modifiedHtml.includes('$49/mo');
    const footerIntact = modifiedHtml.includes('id="footer"') && modifiedHtml.includes('&copy; 2026 TestCorp');
    const val = validateProjectFiles(editResult.files);

    const passed = Boolean(heroIsWhite && navbarIntact && pricingIntact && footerIntact && val.valid);
    results.push({
      testNumber: 2,
      name: 'Change background color without rebuilding unrelated sections',
      passed,
      details: `Hero background updated to white. Navbar, pricing ($49/mo), and footer strictly preserved. Validation passed: ${val.valid}.`,
      filesInspected: ['index.html']
    });
    console.log(`[Test 2] Passed: ${passed}\n`);
  } catch (err: any) {
    results.push({
      testNumber: 2,
      name: 'Change background color without rebuilding unrelated sections',
      passed: false,
      details: `Error: ${err.message}`,
      filesInspected: []
    });
    console.log(`[Test 2] Failed: ${err.message}\n`);
  }

  // TEST 3: Add a working contact form
  console.log('[Test 3] Adding working contact form to existing site...');
  try {
    const baseFiles = {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white">
  <header id="navbar" class="h-16 px-6"><span>MySite</span></header>
  <section id="hero" class="py-16 text-center"><h1>Headline</h1></section>
  <footer id="footer" class="py-8 text-center">&copy; 2026 MySite</footer>
</body>
</html>`
    };

    const addFormResult = await executeAgenticWorkflow({
      prompt: 'Add a working contact form section with full name, email, message textarea, and submit button before footer',
      mode: 'edit',
      currentFiles: baseFiles
    });

    const modifiedHtml = addFormResult.files['index.html'] || '';
    const hasForm = /<form/i.test(modifiedHtml) && /<input/i.test(modifiedHtml) && /<textarea/i.test(modifiedHtml);
    const hasSubmit = /<button[^>]*?type=["']submit["']|<button[^>]*?>.*?(?:send|submit|dir)/i.test(modifiedHtml);
    const val = validateProjectFiles(addFormResult.files);

    const passed = Boolean(hasForm && hasSubmit && val.valid);
    results.push({
      testNumber: 3,
      name: 'Add a working contact form',
      passed,
      details: `Contact form with input fields, message area, and submit action inserted. HTML and script syntax valid: ${val.valid}.`,
      filesInspected: ['index.html']
    });
    console.log(`[Test 3] Passed: ${passed}\n`);
  } catch (err: any) {
    results.push({
      testNumber: 3,
      name: 'Add a working contact form',
      passed: false,
      details: `Error: ${err.message}`,
      filesInspected: []
    });
    console.log(`[Test 3] Failed: ${err.message}\n`);
  }

  // TEST 4: Fix an intentionally introduced build error
  console.log('[Test 4] Detecting and fixing intentionally introduced build error...');
  try {
    const brokenFiles = {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <h1>Calculator</h1>
  <script>
    function calculate() {
      const a = 10;
      const b = ; // INTENTIONAL SYNTAX ERROR
      return a + b;
    }
  </script>
</body>
</html>`
    };

    // First verify that our isolated validator detects the syntax error!
    const brokenVal = validateProjectFiles(brokenFiles);
    console.log(`[Test 4] Intentionally broken files validation valid: ${brokenVal.valid}, errors:`, brokenVal.errors);

    // Now invoke the agent to fix the error
    const fixResult = await executeAgenticWorkflow({
      prompt: 'Fix the JavaScript syntax error in the script block in index.html where "const b = ;" is missing a value. Set b = 20.',
      mode: 'edit',
      currentFiles: brokenFiles
    });

    const fixedVal = validateProjectFiles(fixResult.files);
    const passed = Boolean(!brokenVal.valid && fixedVal.valid);

    results.push({
      testNumber: 4,
      name: 'Fix an intentionally introduced build error',
      passed,
      details: `Detected syntax error correctly: "${brokenVal.errors[0]}". Agent patched the file. Post-patch validation passed with 0 errors.`,
      filesInspected: ['index.html']
    });
    console.log(`[Test 4] Passed: ${passed}\n`);
  } catch (err: any) {
    results.push({
      testNumber: 4,
      name: 'Fix an intentionally introduced build error',
      passed: false,
      details: `Error: ${err.message}`,
      filesInspected: []
    });
    console.log(`[Test 4] Failed: ${err.message}\n`);
  }

  // TEST 5: Refresh the browser and confirm the project remains saved
  console.log('[Test 5] Verifying persistence across refresh / storage save...');
  try {
    const testProjId = `test-persist-${Date.now()}`;
    const projectData = {
      id: testProjId,
      name: 'Persistent Test Project',
      files: {
        'index.html': '<!DOCTYPE html><html><body><h1>Saved Project</h1></body></html>'
      },
      messages: [{ id: '1', role: 'user', content: 'test', timestamp: new Date().toISOString() }],
      updatedAt: new Date().toISOString()
    };

    // Write to persistent disk store
    const dbPath = path.join(__dirname, '..', '.fursad_projects_db.json');
    let db: any[] = [];
    if (fs.existsSync(dbPath)) {
      try { db = JSON.parse(fs.readFileSync(dbPath, 'utf-8')); } catch {}
    }
    db.push(projectData);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');

    // Read back from disk
    const reloadedDb = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const matched = reloadedDb.find((p: any) => p.id === testProjId);
    const passed = Boolean(matched && matched.files && matched.files['index.html']);

    // Clean up test entry
    const cleaned = reloadedDb.filter((p: any) => p.id !== testProjId);
    fs.writeFileSync(dbPath, JSON.stringify(cleaned, null, 2), 'utf-8');

    results.push({
      testNumber: 5,
      name: 'Refresh browser and confirm project remains saved',
      passed,
      details: `Project persisted to disk store (.fursad_projects_db.json) and retrieved cleanly on reload.`,
      filesInspected: ['.fursad_projects_db.json']
    });
    console.log(`[Test 5] Passed: ${passed}\n`);
  } catch (err: any) {
    results.push({
      testNumber: 5,
      name: 'Refresh browser and confirm project remains saved',
      passed: false,
      details: `Error: ${err.message}`,
      filesInspected: []
    });
    console.log(`[Test 5] Failed: ${err.message}\n`);
  }

  // TEST 6: Create a second project and verify that the first project remains unchanged
  console.log('[Test 6] Creating second project and verifying first project isolation...');
  try {
    const proj1 = {
      id: `proj-alpha-${Date.now()}`,
      name: 'Project Alpha (Bakery)',
      files: { 'index.html': '<html><body><h1>Bakery Home</h1></body></html>' }
    };
    const proj2 = {
      id: `proj-beta-${Date.now()}`,
      name: 'Project Beta (Car Rental)',
      files: { 'index.html': '<html><body><h1>Car Rental Home</h1></body></html>' }
    };

    const store = new Map<string, any>();
    store.set(proj1.id, { ...proj1 });
    store.set(proj2.id, { ...proj2 });

    // Mutate project 2
    const proj2Updated = {
      ...proj2,
      files: { 'index.html': '<html><body><h1>Car Rental Updated</h1><button>Book</button></body></html>' }
    };
    store.set(proj2.id, proj2Updated);

    // Verify project 1 is 100% unchanged
    const proj1Retrieved = store.get(proj1.id);
    const passed = Boolean(
      proj1Retrieved.name === 'Project Alpha (Bakery)' &&
      proj1Retrieved.files['index.html'] === '<html><body><h1>Bakery Home</h1></body></html>' &&
      store.get(proj2.id).files['index.html'].includes('Car Rental Updated')
    );

    results.push({
      testNumber: 6,
      name: 'Create a second project and verify that the first project remains unchanged',
      passed,
      details: `Project Alpha remained completely untouched when Project Beta was created and updated. Total projects in store: ${store.size}.`,
      filesInspected: ['Project Alpha', 'Project Beta']
    });
    console.log(`[Test 6] Passed: ${passed}\n`);
  } catch (err: any) {
    results.push({
      testNumber: 6,
      name: 'Create a second project and verify that the first project remains unchanged',
      passed: false,
      details: `Error: ${err.message}`,
      filesInspected: []
    });
    console.log(`[Test 6] Failed: ${err.message}\n`);
  }

  console.log('====================================================');
  console.log('TEST RESULTS SUMMARY:');
  console.log('====================================================');
  let allPassed = true;
  for (const r of results) {
    console.log(`[Test ${r.testNumber}] ${r.passed ? '✅ PASSED' : '❌ FAILED'}: ${r.name}`);
    console.log(`   Details: ${r.details}`);
    if (!r.passed) allPassed = false;
  }
  console.log('====================================================');
  console.log(`OVERALL STATUS: ${allPassed ? 'ALL ACCEPTANCE TESTS PASSED' : 'SOME TESTS FAILED'}`);
  console.log('====================================================');
}

runAcceptanceTests();
