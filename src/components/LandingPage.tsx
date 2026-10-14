import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Laptop, 
  Smartphone,
  CheckCircle2,
  Check,
  Terminal,
  Activity,
  Monitor
} from 'lucide-react';
import { TimeGraphiteBackground } from './TimeGraphiteBackground.tsx';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
  isSo: boolean;
  onToggleLanguage?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onStart, 
  onLogin, 
  isSo, 
  onToggleLanguage 
}) => {
  const [selectedExamplePrompt, setSelectedExamplePrompt] = useState(
    isSo 
      ? 'Ii dhis dashboard SaaS ah oo leh analytics, user management, iyo API integration.'
      : 'Build a custom SaaS dashboard with real-time analytics, user management, and external API integrations.'
  );

  const samplePrompts = isSo ? [
    { title: '📊 Custom Dashboard', prompt: 'Ii dhis dashboard SaaS ah oo leh analytics, user management, iyo API integration.' },
    { title: '🛠️ API System', prompt: 'Samee backend API system dhamaystiran oo leh PostgreSQL, JWT Auth, iyo documentation.' },
    { title: '📱 Mobile Ready App', prompt: 'Dhis cross-platform application leh responsive UI iyo database connectivity.' },
    { title: '🧪 Testing Suite', prompt: 'Samee software architecture leh automated unit tests iyo integration flows.' },
  ] : [
    { title: '📊 Custom Dashboard', prompt: 'Build a custom SaaS dashboard with real-time analytics, user management, and external API integrations.' },
    { title: '🛠️ API System', prompt: 'Create a robust backend API system with PostgreSQL, JWT Auth, and full documentation.' },
    { title: '📱 Mobile Ready App', prompt: 'Develop a cross-platform application with a focus on responsive UI and database connectivity.' },
    { title: '🧪 Testing Suite', prompt: 'Architect a software system with comprehensive automated testing and integration pipelines.' },
  ];

  return (
    <div className="min-h-screen text-slate-100 flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Dynamic Native Time Graphite Motion Canvas Background */}
      <TimeGraphiteBackground className="opacity-95" intensity="vibrant" interactive={true} />

      {/* Top Navbar */}
      <header className="h-20 border-b border-white/10 px-4 sm:px-8 lg:px-12 flex items-center justify-between sticky top-0 bg-[#030712]/75 backdrop-blur-2xl z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1px] shadow-[0_0_20px_rgba(0,245,255,0.4)]">
            <div className="w-full h-full bg-[#030712] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-white">REAL AI</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                BUILDER
              </span>
            </div>
            <p className="text-[9px] font-mono text-slate-400 hidden sm:block tracking-widest uppercase">
              Autonomous Software Agent
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-7">
          <a href="#devices" className="text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-cyan-400 transition-colors">
            {isSo ? 'Qalabka' : 'Devices'}
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Language Toggle Button */}
          {onToggleLanguage && (
            <button 
              onClick={onToggleLanguage}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
              title="Toggle Language (Somali / English)"
            >
              <span>{isSo ? '🇸🇴 SO' : '🇬🇧 EN'}</span>
            </button>
          )}

          {/* Login Button */}
          <button 
            onClick={onLogin}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 transition-all"
          >
            {isSo ? 'Gal' : 'Login'}
          </button>

          {/* Start CTA */}
          <button 
            onClick={onStart}
            className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-4 sm:px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-[0_0_25px_rgba(0,245,255,0.35)] transition-all active:scale-95 border border-white/20 flex items-center gap-2"
          >
            <span>{isSo ? 'Bilow Hadda' : 'Get Started'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 lg:px-12 pt-12 pb-20 max-w-7xl mx-auto w-full flex flex-col items-center text-center z-10">
        {/* Glowing Top Chip */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold mb-8 backdrop-blur-xl shadow-[0_0_25px_rgba(0,245,255,0.2)]"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>🚀 MEET YOUR AI SOFTWARE ENGINEER • POWERED BY GEMINI</span>
        </motion.div>

        {/* Massive Striking Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl leading-[1.08] mb-6"
        >
          {isSo ? (
            <>
              QOR FIKRADAADA.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                AI HA DHISO.
              </span>
            </>
          ) : (
            <>
              Describe Your Vision.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                Let AI Build It.
              </span>
            </>
          )}
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-xl text-slate-300 max-w-3xl leading-relaxed mb-10 font-normal"
        >
          {isSo 
            ? 'Ma haysataa fikrad website ama app ah, laakiin ma taqaan coding? Hadda waxaad haysataa AI Agent kuu dhisaya software-kaaga oo dhan — min qorshaynta, koodhka, xog-kaydka, amniga ilaa live deployment.'
            : 'Got an idea for a website or app, but don’t know coding? You now have an autonomous AI Software Engineer that turns your plain words into production-grade software with live preview, database, and auth.'}
        </motion.p>

        {/* Bolt.diy Style Interactive Prompt Input Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-3xl bg-[#090d16]/90 border border-cyan-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_35px_rgba(0,245,255,0.15)] backdrop-blur-2xl text-left relative group mb-8"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <span className="text-[11px] font-mono text-slate-400 ml-2">ai-builder-prompt.terminal</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded-lg border border-cyan-500/20">
              <Sparkles className="w-3 h-3 animate-spin" />
              <span>Gemini 3.1 Flash Lite</span>
            </div>
          </div>

          <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-2 font-bold">
            {isSo ? '💡 TUSAALE PROMPT (WAXAAD KU QORI KARTAA):' : '💡 EXAMPLE PROMPT (WHAT YOU CAN TYPE):'}
          </label>

          <div className="relative">
            <textarea
              value={selectedExamplePrompt}
              onChange={(e) => setSelectedExamplePrompt(e.target.value)}
              rows={3}
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-white text-base sm:text-lg font-mono focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 resize-none transition-all"
            />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedExamplePrompt(p.prompt)}
                className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/30 border border-white/10 text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{p.title}</span>
              </button>
            ))}
          </div>

          {/* Bottom Action Bar */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isSo ? 'Frontend + Backend + DB + Tests' : 'Fullstack + Database + Auth'}</span>
            </div>

            <button
              onClick={onStart}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-sm uppercase tracking-wider px-8 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all flex items-center justify-center gap-2.5 active:scale-95 border border-white/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSo ? 'Gal & Dhis Mashruucaaga' : 'Login & Build Project'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Social Proof & Value Props */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-400 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-cyan-400" />
            <span>{isSo ? 'Koodh dhab ah (TypeScript & SQL)' : 'Real TypeScript & PostgreSQL'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-purple-400" />
            <span>{isSo ? 'Live Preview toos ah' : 'Instant Interactive Preview'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{isSo ? 'Cusbooneysiin joogto ah (Edit with AI)' : 'Iterative Chat Editing'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-amber-400" />
            <span>{isSo ? '$10/Bishii Qiimo jaban' : '$10/Month Pro Plan'}</span>
          </div>
        </div>
      </section>

      {/* Laptop + Mobile Responsive Showcase Section */}
      <section id="devices" className="relative px-4 sm:px-8 lg:px-12 py-20 max-w-7xl mx-auto w-full z-10">
        <div className="bg-gradient-to-br from-[#0c1424]/90 via-[#060a12]/90 to-[#120a1f]/90 border border-cyan-500/25 rounded-[2.5rem] p-8 sm:p-14 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.7)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Description */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase">
                <Laptop className="w-4 h-4" />
                <span>💻 LAPTOP + 📱 MOBILE RESPONSIVE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                {isSo 
                  ? 'Ku Isticmaal Laptop, Tablet ama Mobile — Meel Kasta Ku Dhis'
                  : 'Build on Desktop, Tablet, or Mobile — Complete Ubiquity'}
              </h2>

              <p className="text-slate-300 text-base leading-relaxed">
                {isSo
                  ? 'Laptop-ka waxaad ka helaysaa workspace dhamaystiran oo aad ku aragto Code, Database, Live Preview, iyo Test Runner. Mobile-ka waxaad ka maamuli kartaa projects-kaaga, la hadli kartaa AI Bot-ka, oo aad ka samayn kartaa cusbooneysiin joogto ah adigoo socda.'
                  : 'On desktop, enjoy the full IDE experience with code explorer, schema visualizer, and simulated dev tools. On mobile, effortlessly chat with the AI Bot, trigger builds, and review responsive previews on the go.'}
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {isSo ? 'Laptop Workspace Dhamaystiran' : 'Full Desktop IDE Workspace'}
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      {isSo ? 'Bolt.diy split-pane layout: Chat bidixda ku yaal & Preview / Code / DB midigta.' : 'Bolt.diy side-by-side view: Chat pane on the left, live workspace tabs on the right.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {isSo ? 'Mobile Control & Live Chat' : 'Mobile Bot & Preview Control'}
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      {isSo ? 'Shaashad mobile oo sahlan, navigation toos ah, iyo bot kuugu jawaabaya farriin kasta.' : 'Optimized touch navigation, rapid bot chat prompts, and responsive touch device frames.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onStart}
                  className="bg-white hover:bg-slate-200 text-black font-black text-xs uppercase tracking-widest px-7 py-3.5 rounded-2xl shadow-xl transition-all flex items-center gap-2.5 active:scale-95"
                >
                  <span>{isSo ? 'Bilow Dhisidda Hadda' : 'Start Building Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Device Simulation Graphics */}
            <div className="relative flex items-center justify-center">
              {/* Laptop Graphic Mockup */}
              <div className="w-full max-w-md bg-[#0a0f1d] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden p-3 relative z-10">
                <div className="flex items-center gap-2 pb-2 mb-2 border-b border-white/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-mono text-slate-400 ml-2">FURSAD AI Studio / Desktop</span>
                </div>
                <div className="grid grid-cols-12 gap-2 h-44 text-[10px] font-mono">
                  {/* Left mini chat */}
                  <div className="col-span-5 bg-white/5 rounded-xl p-2.5 border border-white/5 flex flex-col justify-between">
                    <div>
                      <div className="text-cyan-400 font-bold mb-1">AI Builder</div>
                      <div className="text-[9px] text-slate-300">Software-kaaga waa diyaar! Ma rabtaa inaan ku daro habka lacag bixinta?</div>
                    </div>
                    <div className="bg-cyan-500/20 text-cyan-300 p-1 rounded text-[8px]">
                      Awoodda Gemini 3.1 Pro...
                    </div>
                  </div>
                  {/* Right preview */}
                  <div className="col-span-7 bg-[#030712] rounded-xl p-2.5 border border-cyan-500/20 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[8px] text-slate-400 border-b border-white/5 pb-1">
                      <span>PREVIEW</span>
                      <span className="text-emerald-400">● LIVE</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-3 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 rounded"></div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="h-8 bg-white/5 rounded"></div>
                        <div className="h-8 bg-white/5 rounded"></div>
                      </div>
                    </div>
                    <div className="text-[8px] text-slate-400">Neural Logic Active</div>
                  </div>
                </div>
              </div>

              {/* Floating Mobile Phone Mockup */}
              <div className="absolute -bottom-6 -right-2 sm:-right-4 w-36 sm:w-44 bg-[#0a0f1d] border-2 border-cyan-500/40 rounded-[2rem] p-2.5 shadow-2xl z-20">
                <div className="w-10 h-3 bg-white/20 rounded-full mx-auto mb-2"></div>
                <div className="bg-[#030712] rounded-2xl p-2 h-44 text-[9px] font-mono flex flex-col justify-between border border-white/10">
                  <div className="text-[8px] text-cyan-400 font-bold">Mobile App Frame</div>
                  <div className="space-y-1.5">
                    <div className="h-6 bg-cyan-500/20 rounded-lg p-1 text-[7px] text-cyan-300">
                      Real-time Sync
                    </div>
                    <div className="h-10 bg-white/5 rounded-lg"></div>
                  </div>
                  <div className="text-[7px] text-emerald-400 text-center">Touch Enabled</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
