import { ProjectState } from '../types.ts';

const demoWebsiteHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexus Cloud Platform • FURSAD AI</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Plus Jakarta Sans', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    }
  </script>
</head>
<body class="bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-white min-h-screen flex flex-col">

  <!-- 1. NAVIGATION BAR -->
  <header id="navbar" class="sticky top-0 z-50 h-16 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between transition-colors duration-300">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
        <i class="fa-solid fa-cube text-base"></i>
      </div>
      <span class="font-black text-lg tracking-tight text-white">NEXUS<span class="text-cyan-400">.AI</span></span>
    </div>

    <nav class="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-400">
      <a href="#hero" class="hover:text-white transition-colors">Overview</a>
      <a href="#features" class="hover:text-white transition-colors">Features</a>
      <a href="#pricing" class="hover:text-white transition-colors">Pricing</a>
      <a href="#footer" class="hover:text-white transition-colors">Company</a>
    </nav>

    <div class="flex items-center gap-3">
      <button class="text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 transition-colors">Sign in</button>
      <button class="cta-btn px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">
        Get Started
      </button>
    </div>
  </header>

  <!-- 2. HERO SECTION -->
  <section id="hero" class="py-24 sm:py-32 px-4 sm:px-8 relative overflow-hidden bg-slate-950 text-slate-100 transition-colors duration-500">
    <div class="max-w-5xl mx-auto text-center space-y-8 relative z-10">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold">
        <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>Version 4.2 • Next-Gen Autonomous Cloud Engine</span>
      </div>

      <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto">
        Build and deploy web applications <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">at lightning speed</span>
      </h1>

      <p class="hero-subtitle text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
        Nexus AI empowers teams to architect, deploy, and scale modern web applications with intelligent multi-model workflows and surgical real-time editing.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button class="primary-hero-btn px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl shadow-cyan-500/20 active:scale-95 transition-all">
          Deploy Your First App
        </button>
        <button class="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition-all">
          Explore Live Demo
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 max-w-3xl mx-auto text-center">
        <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <p class="text-2xl font-black text-white">99.99%</p>
          <p class="text-xs text-slate-500">Edge Uptime</p>
        </div>
        <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <p class="text-2xl font-black text-cyan-400">&lt; 15ms</p>
          <p class="text-xs text-slate-500">Global Latency</p>
        </div>
        <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <p class="text-2xl font-black text-white">50M+</p>
          <p class="text-xs text-slate-500">Requests/day</p>
        </div>
        <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <p class="text-2xl font-black text-teal-400">Zero-Config</p>
          <p class="text-xs text-slate-500">Deployments</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. FEATURES SECTION -->
  <section id="features" class="py-24 px-4 sm:px-8 border-t border-white/5 bg-slate-900/30">
    <div class="max-w-6xl mx-auto space-y-16">
      <div class="text-center space-y-3">
        <span class="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">Capabilities</span>
        <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">Engineered for Maximum Developer Velocity</h2>
        <p class="text-sm text-slate-400 max-w-xl mx-auto">Every component is tuned for performance, responsive design, and surgical code precision.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-8 rounded-3xl bg-slate-950/60 border border-white/5 hover:border-cyan-500/30 transition-all space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xl">
            <i class="fa-solid fa-bolt"></i>
          </div>
          <h3 class="text-lg font-black text-white">Instant Edge Preview</h3>
          <p class="text-xs text-slate-400 leading-relaxed">Preview modifications live in your sandboxed container without rebuilding or full restarts.</p>
        </div>

        <div class="p-8 rounded-3xl bg-slate-950/60 border border-white/5 hover:border-cyan-500/30 transition-all space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center text-xl">
            <i class="fa-solid fa-code-merge"></i>
          </div>
          <h3 class="text-lg font-black text-white">Targeted Surgical Updates</h3>
          <p class="text-xs text-slate-400 leading-relaxed">Update isolated components, colors, and layout sections while strictly preserving the rest of your website.</p>
        </div>

        <div class="p-8 rounded-3xl bg-slate-950/60 border border-white/5 hover:border-cyan-500/30 transition-all space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl">
            <i class="fa-solid fa-network-wired"></i>
          </div>
          <h3 class="text-lg font-black text-white">Multi-Provider AI Gateway</h3>
          <p class="text-xs text-slate-400 leading-relaxed">Seamlessly switch between Google Gemini, OpenAI GPT, and Cloudflare Workers AI with BYOK support.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 4. PRICING SECTION -->
  <section id="pricing" class="py-24 px-4 sm:px-8 border-t border-white/5 bg-slate-950">
    <div class="max-w-6xl mx-auto space-y-16">
      <div class="text-center space-y-3">
        <span class="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">Transparent Pricing</span>
        <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">Simple, Predictable Plans</h2>
        <p class="text-sm text-slate-400 max-w-md mx-auto">Choose the tier that fits your development scale. No hidden fees.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <!-- Starter Plan -->
        <div class="p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6 flex flex-col justify-between hover:border-white/20 transition-all">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Starter Tier</span>
              <span class="px-2.5 py-1 rounded-full bg-white/5 text-slate-300 text-[10px] font-bold">Free Forever</span>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="pricing-val text-4xl sm:text-5xl font-black text-white">$0</span>
              <span class="text-xs text-slate-500">/month</span>
            </div>
            <p class="text-xs text-slate-400">Perfect for prototyping, testing concepts, and personal side-projects.</p>
            <ul class="space-y-2.5 pt-4 border-t border-white/5 text-xs text-slate-300">
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Up to 3 active projects</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Live sandboxed preview</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Built-in Gemini Flash AI engine</li>
              <li class="flex items-center gap-2 text-slate-500"><i class="fa-solid fa-xmark"></i> Custom domain mapping</li>
            </ul>
          </div>
          <button class="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider transition-all">
            Get Started Free
          </button>
        </div>

        <!-- Pro Plan -->
        <div class="p-8 rounded-3xl bg-cyan-950/20 border border-cyan-500/40 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-cyan-950/40">
          <div class="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-[10px] uppercase tracking-widest shadow-lg">
            Most Popular
          </div>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">Developer Pro</span>
              <span class="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">Unlimited</span>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="pricing-val text-4xl sm:text-5xl font-black text-white">$29</span>
              <span class="text-xs text-slate-400">/month</span>
            </div>
            <p class="text-xs text-slate-300">For developers and businesses shipping full-stack production platforms.</p>
            <ul class="space-y-2.5 pt-4 border-t border-white/10 text-xs text-slate-200">
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Unlimited active projects</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Surgical Targeted Code Editor & Undo</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Multi-Provider BYOK (OpenAI, Gemini, CF)</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Full Code & Zip Export</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Custom domain and edge routing</li>
            </ul>
          </div>
          <button class="pricing-btn w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl shadow-cyan-500/20 active:scale-95 transition-all">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. FOOTER SECTION -->
  <footer id="footer" class="mt-auto border-t border-white/10 bg-slate-950 py-12 px-4 sm:px-8 text-xs text-slate-500">
    <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs">
          <i class="fa-solid fa-cube"></i>
        </div>
        <span class="font-bold text-white tracking-tight">NEXUS.AI</span>
        <span>• Powered by FURSAD AI</span>
      </div>

      <div class="flex items-center gap-6 text-slate-400">
        <a href="#hero" class="hover:text-white transition-colors">Overview</a>
        <a href="#features" class="hover:text-white transition-colors">Features</a>
        <a href="#pricing" class="hover:text-white transition-colors">Pricing</a>
        <a href="https://github.com" target="_blank" class="hover:text-white transition-colors"><i class="fa-brands fa-github text-sm"></i></a>
      </div>

      <p class="text-[11px] text-slate-600">
        &copy; 2026 NEXUS Cloud. All rights reserved. Built with FURSAD AI.
      </p>
    </div>
  </footer>

</body>
</html>`;

export const initialProject: ProjectState = {
  id: 'proj-0',
  _id: 'proj-0',
  userId: 'guest',
  name: 'Nexus Cloud Platform',
  tagline: 'Modern Cloud Application with Navbar, Hero, Features, Pricing & Footer',
  description: 'Production-ready platform containing a responsive navbar, hero section, features grid, pricing table, and footer. Ready for strict targeted updates.',
  version: 1,
  status: 'completed',
  published: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  messages: [
    { 
      id: 'm1',
      role: 'assistant', 
      content: 'Ku soo dhowaw FURSAD AI! Website-kaaga diyaar ayuu u yahay in aad wax ka bedesho.\n\nTusaalooyinka aad tijaabin karto:\n• "Change only the background color of the hero section to white."\n• "Change the navbar color to blue."\n• "Update the pricing section to $19."\n• "Add a contact form."\n• "Change button color to emerald."\n\nDhammaan qaybaha kale (Navbar, Pricing, Footer) way sii jiri doonaan oo waxba lagama bedeli doono!', 
      timestamp: new Date().toISOString() 
    }
  ],
  files: {
    'index.html': demoWebsiteHtml,
    'src/App.tsx': `import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nexus Cloud Platform Entry Point */}
      <nav className="h-16 border-b border-white/10 px-8 flex items-center justify-between">
        <div className="font-black text-lg">NEXUS<span className="text-cyan-400">.AI</span></div>
      </nav>
      <section className="py-24 text-center">
        <h1 className="text-5xl font-black">Nexus Cloud Platform</h1>
        <p className="text-slate-400 mt-4">Multi-provider architecture with targeted edits.</p>
      </section>
    </div>
  );
}`
  },
  databaseTables: [
    {
      name: 'users',
      columns: ['id', 'email', 'role', 'status'],
      sampleRows: [
        { id: 1, email: 'admin@nexus.ai', role: 'admin', status: 'Active' },
        { id: 2, email: 'developer@nexus.ai', role: 'developer', status: 'Active' }
      ]
    },
    {
      name: 'deployments',
      columns: ['id', 'environment', 'provider', 'latency_ms'],
      sampleRows: [
        { id: 101, environment: 'production', provider: 'cloudflare-edge', latency_ms: 12 },
        { id: 102, environment: 'staging', provider: 'google-cloud', latency_ms: 24 }
      ]
    }
  ],
  changeHistory: []
};
