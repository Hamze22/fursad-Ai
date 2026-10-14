import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Code2, 
  Zap, 
  Smartphone, 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  PlayCircle,
  Layout,
  Terminal,
  Database,
  Cpu,
  Sun,
  Moon
} from 'lucide-react';

import { BookShopMotionDemo } from './BookShopMotionDemo.tsx';
import { FursadLogo, FursadEmblem } from '../common/FursadLogo.tsx';

interface LandingPageProps {
  onStart: (initialPrompt?: string) => void;
  onExploreCourse: () => void;
  onLogin: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onStart, 
  onExploreCourse, 
  onLogin,
  theme = 'dark',
  onToggleTheme 
}) => {
  return (
    <div className={`min-h-screen font-sans selection:bg-cyan-500/30 transition-colors ${
      theme === 'light' ? 'bg-[#f4f1ea] text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 h-16 border-b backdrop-blur-xl px-3 sm:px-8 flex items-center justify-between transition-colors ${
        theme === 'light' ? 'bg-[#f4f1ea]/90 border-slate-300' : 'bg-slate-950/85 border-white/5'
      }`}>
        <FursadLogo size="sm" textSize="base" theme={theme} />
        
        <nav className={`hidden md:flex items-center gap-6 text-xs font-medium ${
          theme === 'light' ? 'text-slate-600' : 'text-slate-400'
        }`}>
          <a href="#features" className={theme === 'light' ? 'hover:text-slate-950' : 'hover:text-white'}>Features</a>
          <a href="#how-it-works" className={theme === 'light' ? 'hover:text-slate-950' : 'hover:text-white'}>How it works</a>
          <button onClick={onExploreCourse} className={`text-sm font-medium ${
            theme === 'light' ? 'text-slate-600 hover:text-slate-950' : 'text-slate-400 hover:text-white'
          }`}>Course</button>
          <a href="#pricing" className={theme === 'light' ? 'hover:text-slate-950' : 'hover:text-white'}>Pricing</a>
        </nav>

        {/* Action Buttons & Day/Dark Mode Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Day / Dark Mode Toggle button (Sun / Moon) */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`p-1.5 sm:p-2 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
                theme === 'light'
                  ? 'bg-amber-100/90 border-amber-300 text-amber-600 hover:bg-amber-200 shadow-sm'
                  : 'bg-slate-900/90 border-white/10 text-cyan-300 hover:text-white hover:border-cyan-500/30'
              }`}
              title={theme === 'dark' ? 'Switch to Day/Light Mode (Qorax)' : 'Switch to Dark Mode (Dayax)'}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-800" />
              )}
            </button>
          )}

          <button 
            onClick={onLogin} 
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              theme === 'light' 
                ? 'text-slate-700 hover:text-slate-950 hover:bg-black/5' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Log in
          </button>
          <button 
            onClick={() => onStart()} 
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 shadow-md ${
              theme === 'light'
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-white text-slate-950 hover:bg-slate-200 shadow-white/10'
            }`}
          >
            Start Building
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-8 xl:px-12 max-w-7xl xl:max-w-[1540px] mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md shadow-[0_0_25px_rgba(37,99,235,0.25)]"
        >
          <FursadEmblem className="w-5 h-5 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          <span className="text-slate-200">The Rising Star of Full-Stack AI Development</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-5xl sm:text-7xl font-black tracking-tight mb-6 max-w-4xl leading-[1.05] transition-colors ${
            theme === 'light' ? 'text-slate-950' : 'text-white'
          }`}
        >
          Build Websites & Web Apps <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">With AI</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed transition-colors ${
            theme === 'light' ? 'text-slate-700' : 'text-slate-400'
          }`}
        >
          Learn Full-Stack Vibe Coding and build real websites and web applications with your own AI Builder.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 mb-16 sm:mb-20 w-full sm:w-auto px-2"
        >
          <button 
            onClick={() => onStart()} 
            className="flex-1 sm:flex-initial bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3.5 sm:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-base font-extrabold uppercase tracking-wide sm:tracking-wider flex items-center justify-center gap-1.5 sm:gap-2.5 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all active:scale-95 shadow-lg shadow-cyan-500/20 border border-white/10"
          >
            <span>Start Building</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0" />
          </button>
          <button 
            onClick={onExploreCourse} 
            className="flex-1 sm:flex-initial bg-white/5 border border-white/10 text-white px-3.5 sm:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-base font-extrabold uppercase tracking-wide sm:tracking-wider flex items-center justify-center gap-1.5 sm:gap-2.5 hover:bg-white/10 transition-all active:scale-95 backdrop-blur-xl"
          >
            <span>Explore Course</span>
            <PlayCircle className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-cyan-400 shrink-0" />
          </button>
        </motion.div>

        {/* Interactive Motion Video: Book Shop Landing Page AI Builder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="w-full relative"
        >
          <BookShopMotionDemo onStartBuilding={() => onStart('book shop landing page with bestsellers, categories and cart')} />
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section id="features" className={`py-24 px-4 sm:px-8 xl:px-12 max-w-7xl xl:max-w-[1540px] mx-auto border-t transition-colors ${
        theme === 'light' ? 'border-slate-300' : 'border-white/10'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-center sm:text-left">
          {[
            { icon: Layout, title: 'AI Website Builder', desc: 'Generate complete multi-page sites with one prompt.' },
            { icon: Code2, title: 'Full-Stack Course', desc: 'Master Vibe Coding from zero to production level.' },
            { icon: Cpu, title: 'AI Code Generation', desc: 'Clean, optimized TypeScript & React code output.' },
            { icon: PlayCircle, title: 'Live Preview', desc: 'Instant hot-reloading preview on all devices.' },
            { icon: Globe, title: 'Deploy Projects', desc: 'One-click deployment to global edge network.' },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-500 dark:text-cyan-400 mx-auto sm:mx-0 shadow-sm">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className={`text-base font-black transition-colors ${
                theme === 'light' ? 'text-slate-950 font-black' : 'text-white'
              }`}>{feature.title}</h3>
              <p className={`text-sm leading-relaxed transition-colors ${
                theme === 'light' ? 'text-slate-800 font-medium' : 'text-slate-300'
              }`}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className={`py-32 border-y relative overflow-hidden transition-colors ${
        theme === 'light' ? 'bg-[#eeeae1] border-slate-300' : 'bg-slate-900/60 border-white/10'
      }`}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl xl:max-w-[1540px] mx-auto px-4 sm:px-8 xl:px-12">
          <div className="text-center mb-20">
            <h2 className={`text-4xl font-black mb-4 uppercase tracking-tight transition-colors ${
              theme === 'light' ? 'text-slate-950' : 'text-white'
            }`}>How It Works</h2>
            <p className={`font-medium transition-colors ${
              theme === 'light' ? 'text-slate-700' : 'text-slate-300'
            }`}>The seamless journey from idea to production</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
             {/* Connector line for desktop */}
             <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent -translate-y-1/2"></div>
             
             {[
               { step: '01', title: 'Describe', desc: 'Type your requirements in natural language.' },
               { step: '02', title: 'Generate', desc: 'AI architects and writes the full-stack code.' },
               { step: '03', title: 'Edit', desc: 'Iterate and refine through interactive AI chat.' },
               { step: '04', title: 'Preview', desc: 'Verify your application in real-time.' },
               { step: '05', title: 'Deploy', desc: 'Launch your app to the world instantly.' },
             ].map((item, i) => (
               <div key={i} className={`p-6 rounded-3xl backdrop-blur-xl relative z-10 text-center transition-all group border shadow-lg ${
                 theme === 'light'
                   ? 'bg-white border-slate-200 hover:border-cyan-500 shadow-slate-200/50'
                   : 'bg-slate-950/80 border-white/10 hover:border-cyan-500/50 shadow-[0_0_20px_rgba(0,0,0,0.4)]'
               }`}>
                  <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 mb-2 font-black">{item.step}</div>
                  <h3 className={`text-lg font-black mb-2 transition-colors ${
                    theme === 'light' ? 'text-slate-950' : 'text-white'
                  }`}>{item.title}</h3>
                  <p className={`text-xs leading-relaxed transition-colors ${
                    theme === 'light' ? 'text-slate-800 font-medium' : 'text-slate-300'
                  }`}>{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-4 sm:px-8 xl:px-12 max-w-7xl xl:max-w-[1540px] mx-auto">
        <div className="text-center mb-20">
          <h2 className={`text-4xl font-black mb-4 uppercase tracking-tight tracking-widest transition-colors ${
            theme === 'light' ? 'text-slate-950' : 'text-white'
          }`}>Simple Pricing</h2>
          <p className={`font-medium transition-colors ${
            theme === 'light' ? 'text-slate-700' : 'text-slate-400'
          }`}>Join the movement and start building today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* First Access */}
          <div className={`rounded-[2.5rem] p-10 flex flex-col relative group overflow-hidden border shadow-xl transition-all ${
            theme === 'light'
              ? 'bg-white border-slate-300 shadow-slate-200/60'
              : 'bg-slate-900/60 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]'
          }`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
            <div className="mb-8">
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest bg-cyan-500/15 px-3 py-1 rounded-full border border-cyan-500/30">Starter</span>
              <div className="flex items-baseline gap-1 mt-4">
                <span className={`text-4xl font-black transition-colors ${
                  theme === 'light' ? 'text-slate-950' : 'text-white'
                }`}>$25</span>
                <span className={`font-medium text-sm transition-colors ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                }`}>One-time payment</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {[
                'Full-Stack Vibe Coding Course',
                'Access to AI Builder',
                'Starter AI Credits',
                'Project Sandbox'
              ].map((item, idx) => (
                <li key={idx} className={`flex items-center gap-3 text-sm font-semibold transition-colors ${
                  theme === 'light' ? 'text-slate-800' : 'text-slate-300'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => onStart()} 
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider text-sm transition-all active:scale-95 shadow-xl ${
                theme === 'light'
                  ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-300'
                  : 'bg-white text-slate-950 hover:bg-slate-200 shadow-white/5'
              }`}
            >
              Get Access Now
            </button>
          </div>

          {/* Pro Plan */}
          <div className={`rounded-[2.5rem] p-10 flex flex-col relative shadow-[0_0_50px_rgba(6,182,212,0.18)] group overflow-hidden border-2 transition-all ${
            theme === 'light'
              ? 'bg-amber-50/70 border-cyan-500/60 shadow-cyan-500/10'
              : 'bg-slate-900/90 border-cyan-500/60'
          }`}>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-widest bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 rounded-full shadow-sm">Pro Member</span>
                <span className="text-[10px] font-black text-cyan-500 dark:text-cyan-400 animate-pulse">RECOMMENDED</span>
              </div>
              <div className="flex items-baseline gap-1 mt-4">
                <span className={`text-4xl font-black transition-colors ${
                  theme === 'light' ? 'text-slate-950' : 'text-white'
                }`}>$10</span>
                <span className={`font-medium text-sm transition-colors ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                }`}>/month</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className={`flex items-center gap-3 text-sm font-bold transition-colors ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" /> Unlimited AI Code Generation
              </li>
              <li className={`flex items-center gap-3 text-sm font-bold transition-colors ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" /> AI Project Editing (Chat)
              </li>
              {[
                'Persistent Project Storage',
                'Custom Domain Deployment',
                'Premium App Templates',
                'Early Access Features'
              ].map((item, idx) => (
                <li key={idx} className={`flex items-center gap-3 text-sm font-semibold transition-colors ${
                  theme === 'light' ? 'text-slate-800' : 'text-slate-300'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <button onClick={() => onStart()} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-black uppercase tracking-wider text-sm hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all active:scale-95 shadow-xl shadow-cyan-500/20 border border-white/10">Upgrade to Pro</button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`py-32 px-4 sm:px-8 max-w-4xl mx-auto border-t transition-colors ${
        theme === 'light' ? 'border-slate-300' : 'border-white/10'
      }`}>
        <h2 className={`text-3xl font-black text-center mb-16 uppercase tracking-tight transition-colors ${
          theme === 'light' ? 'text-slate-950' : 'text-white'
        }`}>Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { q: 'What is Vibe Coding?', a: 'Vibe Coding is a modern approach where you focus on the "vibe" and high-level logic of your application through natural language prompts, while the AI handles the complex boilerplate and syntax.' },
            { q: 'Can I export my code?', a: 'Yes! Pro members can export their projects as a complete TypeScript/React codebase that can be run locally or on any server.' },
            { q: 'Do I need to know coding?', a: 'Not at all. Our Full-Stack Vibe Coding course is designed to take you from zero to builder. The AI Builder handles the heavy lifting while you learn the architecture.' },
          ].map((faq, i) => (
            <div key={i} className={`p-6 rounded-2xl border transition-all ${
              theme === 'light'
                ? 'bg-white border-slate-200 shadow-sm'
                : 'bg-slate-900/60 border-white/10 shadow-lg'
            }`}>
              <h3 className={`font-bold mb-3 flex items-center gap-2 transition-colors ${
                theme === 'light' ? 'text-slate-950' : 'text-white'
              }`}>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                {faq.q}
              </h3>
              <p className={`text-sm leading-relaxed transition-colors ${
                theme === 'light' ? 'text-slate-800 font-medium' : 'text-slate-300'
              }`}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t relative z-10 px-4 sm:px-8 transition-colors ${
        theme === 'light' ? 'bg-[#ebe7de] border-slate-300' : 'bg-slate-950 border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <FursadLogo size="md" textSize="lg" theme={theme} />
          
          <div className={`flex gap-8 text-xs font-mono transition-colors ${
            theme === 'light' ? 'text-slate-700 font-semibold' : 'text-slate-400'
          }`}>
            <a href="#" className="hover:text-cyan-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-cyan-500 transition-colors">Contact Support</a>
          </div>
          
          <p className={`text-xs font-mono transition-colors ${
            theme === 'light' ? 'text-slate-700 font-semibold' : 'text-slate-400'
          }`}>© 2026 FURSAD AI Inc. Built with Neural Logic.</p>
        </div>
      </footer>
    </div>
  );
};
