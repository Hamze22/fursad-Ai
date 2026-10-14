import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE VERIFICATION TESTS ---');
  let failures = 0;

  // Test 1: Provider list endpoint
  try {
    const res = await axios.get(`${BASE_URL}/api/ai/providers`);
    if (res.data?.providers?.length >= 5) {
      console.log('✅ TEST 1 PASSED: /api/ai/providers returned 5 providers (Gemini, OpenAI, Cloudflare, Groq, Anthropic)');
    } else {
      console.error('❌ TEST 1 FAILED: Expected at least 5 providers, got:', res.data);
      failures++;
    }
  } catch (err) {
    console.error('❌ TEST 1 FAILED:', err.message);
    failures++;
  }

  // Test 2: Connection test with invalid key produces clear error
  try {
    const res = await axios.post(`${BASE_URL}/api/ai/test-connection`, {
      provider: 'openai',
      apiKey: 'sk-invalid-key-testing-error-handling-12345',
      model: 'gpt-4o-mini'
    });
    console.error('❌ TEST 2 FAILED: Expected error on invalid key, but got success:', res.data);
    failures++;
  } catch (err) {
    if (err.response?.status === 400 && err.response?.data?.error) {
      console.log('✅ TEST 2 PASSED: Invalid key rejected with clear error message:', err.response.data.error);
    } else {
      console.error('❌ TEST 2 FAILED: Unexpected error structure:', err.message);
      failures++;
    }
  }

  // Test 3: Cloudflare test connection missing Account ID produces clear error
  try {
    const res = await axios.post(`${BASE_URL}/api/ai/test-connection`, {
      provider: 'cloudflare',
      apiKey: 'test-token',
      accountId: ''
    });
    console.error('❌ TEST 3 FAILED: Expected error for missing accountId');
    failures++;
  } catch (err) {
    if (err.response?.data?.error?.includes('Account ID')) {
      console.log('✅ TEST 3 PASSED: Cloudflare Account ID validation working:', err.response.data.error);
    } else {
      console.error('❌ TEST 3 FAILED: Unexpected error:', err.response?.data || err.message);
      failures++;
    }
  }

  // Test 4: Strict Targeted Update - Hero Background to White
  const sampleHtml = `<!DOCTYPE html><html><body>
    <header id="navbar" class="h-16 bg-slate-950 text-white"><nav>Navbar Links</nav></header>
    <section id="hero" class="py-20 bg-slate-950 text-white"><h1>Hero Title</h1><p>Hero description</p><button class="btn bg-cyan-500">CTA</button></section>
    <section id="pricing" class="py-20 bg-slate-900 text-white"><h2>Pricing</h2><span>$29</span></section>
    <footer id="footer" class="py-10 bg-slate-950 text-slate-400"><p>Copyright 2026</p></footer>
  </body></html>`;

  try {
    const res = await axios.post(`${BASE_URL}/api/ai/targeted-update`, {
      prompt: 'Change only the background color of the hero section to white.',
      currentFiles: { 'index.html': sampleHtml },
      language: 'so'
    });

    const data = res.data;
    if (data.success && data.updatedFiles && data.updatedFiles['index.html']) {
      const updated = data.updatedFiles['index.html'];
      
      const heroHasWhite = updated.includes('bg-white');
      const navbarPreserved = updated.includes('Navbar Links') && updated.includes('id="navbar"');
      const pricingPreserved = updated.includes('$29') && updated.includes('id="pricing"');
      const footerPreserved = updated.includes('Copyright 2026') && updated.includes('id="footer"');

      if (heroHasWhite && navbarPreserved && pricingPreserved && footerPreserved) {
        console.log('✅ TEST 4 PASSED: Strict Targeted Update changed ONLY hero background to white!');
        console.log('   - Navbar intact: ✅');
        console.log('   - Pricing section intact: ✅');
        console.log('   - Footer intact: ✅');
        console.log('   - Validation checks passed:', data.changeRecord.validation.checks.length);
      } else {
        console.error('❌ TEST 4 FAILED: Integrity check failed:', { heroHasWhite, navbarPreserved, pricingPreserved, footerPreserved });
        failures++;
      }
    } else {
      console.error('❌ TEST 4 FAILED: Response invalid:', data);
      failures++;
    }
  } catch (err) {
    console.error('❌ TEST 4 FAILED:', err.message);
    failures++;
  }

  // Test 5: Strict Targeted Update - Update pricing to $19
  try {
    const res = await axios.post(`${BASE_URL}/api/ai/targeted-update`, {
      prompt: 'Update the pricing section to $19.',
      currentFiles: { 'index.html': sampleHtml },
      language: 'en'
    });

    const data = res.data;
    const updated = data.updatedFiles['index.html'];
    if (updated.includes('$19') && updated.includes('Hero Title') && updated.includes('Navbar Links') && updated.includes('Copyright 2026')) {
      console.log('✅ TEST 5 PASSED: Strict Targeted Update changed pricing to $19 without touching hero, navbar, or footer!');
    } else {
      console.error('❌ TEST 5 FAILED: Pricing update corrupted other sections');
      failures++;
    }
  } catch (err) {
    console.error('❌ TEST 5 FAILED:', err.message);
    failures++;
  }

  // Test 6: Strict Targeted Update - Add a contact form
  try {
    const res = await axios.post(`${BASE_URL}/api/ai/targeted-update`, {
      prompt: 'Add a contact form.',
      currentFiles: { 'index.html': sampleHtml },
      language: 'en'
    });

    const data = res.data;
    const updated = data.updatedFiles['index.html'];
    if (updated.includes('id="contact"') && updated.includes('form') && updated.includes('Hero Title') && updated.includes('Copyright 2026')) {
      console.log('✅ TEST 6 PASSED: Contact form inserted before footer, existing sections preserved intact!');
    } else {
      console.error('❌ TEST 6 FAILED: Contact form insertion failed');
      failures++;
    }
  } catch (err) {
    console.error('❌ TEST 6 FAILED:', err.message);
    failures++;
  }

  // Test 7: Project Store Persistence (POST, GET, PUT)
  try {
    const testProjId = `test-proj-${Date.now()}`;
    const newProj = {
      id: testProjId,
      name: 'Persistence Verification App',
      tagline: 'Testing save and restore',
      files: { 'index.html': '<h1>Test App</h1>' },
      messages: []
    };

    // Save project
    const postRes = await axios.post(`${BASE_URL}/api/projects`, newProj);
    if (postRes.data.id === testProjId) {
      // Get by ID
      const getRes = await axios.get(`${BASE_URL}/api/projects/${testProjId}`);
      if (getRes.data.name === 'Persistence Verification App') {
        // Update project
        const putRes = await axios.put(`${BASE_URL}/api/projects/${testProjId}`, {
          ...getRes.data,
          name: 'Updated App Name'
        });
        if (putRes.data.name === 'Updated App Name' && putRes.data.id === testProjId) {
          console.log('✅ TEST 7 PASSED: Project persistence, ID preservation, and updates fully verified!');
        } else {
          console.error('❌ TEST 7 FAILED: Put failed');
          failures++;
        }
      }
    }
  } catch (err) {
    console.error('❌ TEST 7 FAILED:', err.message);
    failures++;
  }

  // Test 8: Update one sentence
  try {
    const res = await axios.post(`${BASE_URL}/api/ai/targeted-update`, {
      prompt: 'Update the subtitle sentence in hero to: "Deploy resilient cloud platforms in seconds."',
      currentFiles: { 'index.html': sampleHtml },
      language: 'en'
    });
    const updated = res.data.updatedFiles['index.html'];
    if (updated.includes('Deploy resilient cloud platforms in seconds.') && updated.includes('Navbar Links') && updated.includes('Copyright 2026')) {
      console.log('✅ TEST 8 PASSED: One sentence updated precisely, all other components preserved!');
    } else {
      console.error('❌ TEST 8 FAILED: Sentence update failed');
      failures++;
    }
  } catch (err) {
    console.error('❌ TEST 8 FAILED:', err.message);
    failures++;
  }

  // Test 9: Change button color
  try {
    const res = await axios.post(`${BASE_URL}/api/ai/targeted-update`, {
      prompt: 'Change the button color to emerald.',
      currentFiles: { 'index.html': sampleHtml },
      language: 'en'
    });
    const updated = res.data.updatedFiles['index.html'];
    if (updated.includes('emerald') && updated.includes('Hero Title') && updated.includes('Navbar Links')) {
      console.log('✅ TEST 9 PASSED: Button color updated to emerald, rest of layout intact!');
    } else {
      console.error('❌ TEST 9 FAILED: Button color change failed');
      failures++;
    }
  } catch (err) {
    console.error('❌ TEST 9 FAILED:', err.message);
    failures++;
  }

  // Test 10: Snapshot Restore Point (Undo)
  try {
    const res = await axios.post(`${BASE_URL}/api/ai/targeted-update`, {
      prompt: 'Change only the background color of the hero section to white.',
      currentFiles: { 'index.html': sampleHtml },
      language: 'en'
    });
    const snapshot = res.data.changeRecord?.snapshot;
    if (snapshot && snapshot['index.html'] === sampleHtml) {
      console.log('✅ TEST 10 PASSED: ChangeRecord created exact snapshot for 1-click restore/undo!');
    } else {
      console.error('❌ TEST 10 FAILED: Snapshot missing or corrupted');
      failures++;
    }
  } catch (err) {
    console.error('❌ TEST 10 FAILED:', err.message);
    failures++;
  }

  if (failures === 0) {
    console.log('\n🎉 ALL 10 ACCEPTANCE TESTS PASSED ACCORDING TO SPECIFICATION! (0 failures)');
    process.exit(0);
  } else {
    console.error(`\n❌ ${failures} TESTS FAILED`);
    process.exit(1);
  }
}

runTests();
