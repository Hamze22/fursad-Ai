import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Sparkles, 
  Code2, 
  Database, 
  Terminal, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Laptop, 
  Compass, 
  Lock, 
  Loader2,
  FileCode,
  ArrowRight,
  Check
} from 'lucide-react';
import { LanguageType, ProjectState } from '../types.ts';
import { TimeGraphiteBackground } from './TimeGraphiteBackground.tsx';

interface BuildProcessProps {
  project: ProjectState;
  language: LanguageType;
  onComplete: () => void;
}

export const BuildProcess: React.FC<BuildProcessProps> = ({ 
  project,
  language, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const isSo = language === 'so';

  const steps = [
    { 
      step: 1, 
      conditionName: 'Condition 1: Intent & Prompt Verification',
      title: 'Analyze Prompt & Scope', 
      titleSo: 'Fahamka Shuruudaha & Prompt-ka', 
      icon: Cpu, 
      details: 'Parsing user prompt semantics and component hierarchy...',
      conditionPass: 'Pass: Prompt valid & UI architecture defined.'
    },
    { 
      step: 2, 
      conditionName: 'Condition 2: Architecture & Dependency Resolution',
      title: 'Plan Architecture', 
      titleSo: 'Qorshaynta Architecture-ka', 
      icon: Compass, 
      details: 'Structuring React components, Tailwind styling, and navigation flow...',
      conditionPass: 'Pass: Full-stack responsive layout planned.'
    },
    { 
      step: 3, 
      conditionName: 'Condition 3: Database & State Matrix',
      title: 'Database & Data Models', 
      titleSo: 'Qaabeynta Xog-kaydka & Schema', 
      icon: Database, 
      details: 'Configuring relational models, seed catalog, and reactive state stores...',
      conditionPass: 'Pass: Data schemas validated & ready.'
    },
    { 
      step: 4, 
      conditionName: 'Condition 4: Component Code Synthesis',
      title: 'Generate Files & Code', 
      titleSo: 'Dhismaha Faylasha & Koodhka', 
      icon: Code2, 
      details: 'Writing App.tsx, Navbar.tsx, Hero.tsx, Catalog.tsx, styles.css...',
      conditionPass: 'Pass: File modules synthesized without errors.'
    },
    { 
      step: 5, 
      conditionName: 'Condition 5: Syntax & Security Audit',
      title: 'Validate & Test Code', 
      titleSo: 'Tijaabinta & Xaqiijinta Amniga', 
      icon: ShieldCheck, 
      details: 'Running AST checks, type safety verification, and RBAC rules...',
      conditionPass: 'Pass: Zero errors found. Safe execution verified.'
    },
    { 
      step: 6, 
      conditionName: 'Condition 6: Virtual Sandbox Deployment',
      title: 'Mount Live Preview', 
      titleSo: 'Daarista Muuqaalka Tooska (Live Preview)', 
      icon: Laptop, 
      details: 'Booting interactive virtual iframe and loading responsive viewports...',
      conditionPass: 'Pass: Sandbox active. Launching preview...'
    },
  ];

  useEffect(() => {
    // Initial log
    setLogs([`[AI Engine] Initializing build for "${project.name}"...`]);

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next < steps.length) {
          const currentLog = `[${steps[next].conditionName}] ${steps[next].details}`;
          setLogs((prevLogs) => [...prevLogs.slice(-4), currentLog]);
          return next;
        } else {
          clearInterval(interval);
          setLogs((prevLogs) => [
            ...prevLogs.slice(-4),
            `[COMPLETE] All conditions satisfied! Opening Live Preview...`
          ]);
          setTimeout(() => {
            onComplete();
          }, 900);
          return prev;
        }
      });
    }, 1100);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(100, Math.round(((currentStep + 1) / steps.length) * 100));

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative selection:bg-blue-500/30 font-sans overflow-hidden">
      {/* Native Blue & Black Ambient Background */}
      <TimeGraphiteBackground intensity="vibrant" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-slate-950/85 border border-blue-500/30 p-6 sm:p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(37,99,235,0.2)] relative z-10 backdrop-blur-2xl"
      >
        {/* Header with Native Blue Spinner */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-[0_0_25px_rgba(37,99,235,0.35)] shrink-0">
             <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div className="text-center sm:text-left flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
              <Activity className="w-3.5 h-3.5 animate-pulse text-blue-400" />
              <span>AI CONDITION PIPELINE • STEP {currentStep + 1} OF {steps.length}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white truncate">
              {isSo ? 'AI-gu Wuxuu Dhisayaa Mashruucaaga' : 'Building Your Application'}
            </h2>
            <p className="text-xs text-blue-200/70 font-mono truncate">
              "{project.name}"
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-3xl font-black text-blue-400 font-mono">{progressPercent}%</span>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Progress</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-blue-500/20 mb-6">
           <motion.div 
             className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500"
             initial={{ width: '0%' }}
             animate={{ width: `${progressPercent}%` }}
             transition={{ duration: 0.6 }}
           />
        </div>

        {/* Preliminary Working Info HUD (Xogta Hordhaca ah ee Dhismaha) */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 border border-blue-500/30 shadow-lg text-left">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-blue-500/20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-wider text-blue-300">
                {isSo ? 'Xogta Hordhaca ah (Live Interim Activity)' : 'Preliminary Build Status'}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold animate-pulse">
              {currentStep <= 1 ? 'Styling & Architecture Working' : currentStep <= 3 ? 'Components & State Working' : 'Sandbox Verification Working'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className={`p-2.5 rounded-xl border transition-all ${
              currentStep === 1 || currentStep === 3 
                ? 'bg-blue-600/20 border-blue-400 text-blue-200' 
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Styling Working</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-tight">Tailwind CSS utility classes, glassmorphism, responsive breakpoints</p>
            </div>

            <div className={`p-2.5 rounded-xl border transition-all ${
              currentStep === 2 || currentStep === 3 
                ? 'bg-blue-600/20 border-blue-400 text-blue-200' 
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>Components Working</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-tight">Navbar, Hero Banner, Catalog Grid, Cart Drawer, Search Filtering</p>
            </div>

            <div className={`p-2.5 rounded-xl border transition-all ${
              currentStep >= 4 
                ? 'bg-emerald-600/20 border-emerald-400 text-emerald-200' 
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Preview Mounting</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-tight">Interactive sandbox ready, state event listeners attached</p>
            </div>
          </div>
        </div>

        {/* Conditions Checklist */}
        <div className="space-y-2.5 mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
             <span>{isSo ? 'Shuruudaha & Marxaladaha Dhismaha (Conditions)' : 'System Conditions & Build Stages'}</span>
             <span className="text-blue-400 font-mono">{currentStep + 1} / {steps.length} Active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {steps.map((s, i) => {
              const isCompleted = i < currentStep;
              const isCurrent = i === currentStep;

              return (
                <div 
                  key={s.step} 
                  className={`flex items-start gap-3 p-3 rounded-2xl border transition-all text-left ${
                    isCurrent 
                      ? 'bg-blue-950/40 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                      : isCompleted 
                        ? 'bg-slate-900/60 border-slate-800' 
                        : 'bg-slate-950/30 border-slate-900 opacity-50'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-5 h-5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-700 bg-slate-900" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isCurrent ? 'text-blue-300' : isCompleted ? 'text-slate-200' : 'text-slate-400'}`}>
                        {isSo ? s.titleSo : s.title}
                      </span>
                      {isCompleted && (
                        <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase">PASS</span>
                      )}
                      {isCurrent && (
                        <span className="text-[9px] font-mono font-bold text-blue-400 uppercase animate-pulse">EVALUATING</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {isCompleted ? s.conditionPass : s.details}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Terminal & Logs Stream */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left font-mono">
           <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-900 text-[10px] text-slate-500 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                 <Terminal className="w-3.5 h-3.5 text-blue-400" />
                 <span>Neural Build Terminal</span>
              </div>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE
              </span>
           </div>
           <div className="space-y-1 text-[11px] text-slate-300 min-h-[70px]">
              {logs.map((log, index) => (
                <div key={index} className="truncate flex items-center gap-2">
                   <span className="text-blue-400">›</span>
                   <span className={index === logs.length - 1 ? 'text-blue-200 font-semibold' : 'text-slate-400'}>
                     {log}
                   </span>
                </div>
              ))}
           </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 flex items-center justify-between text-[11px] font-mono text-slate-500">
           <span>Engine: Google Gemini 2.5 • Virtual Sandbox</span>
           <span className="text-blue-400 animate-pulse">Switching to Live Preview on completion...</span>
        </div>
      </motion.div>
    </div>
  );
};
