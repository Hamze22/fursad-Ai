import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause,
  CheckCircle2, 
  Lock, 
  Clock, 
  BookOpen, 
  FileCode, 
  Award,
  ChevronRight,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Code2,
  Terminal,
  HelpCircle,
  Download,
  Share2,
  ExternalLink,
  Volume2,
  Maximize2,
  X
} from 'lucide-react';
import { User, LanguageType } from '../../types.ts';
import { FursadLogo, FursadEmblem } from '../common/FursadLogo.tsx';

interface Lesson {
  id: string;
  title: string;
  titleSo: string;
  duration: string;
  type: 'video' | 'coding' | 'theory';
  status: 'locked' | 'current' | 'completed';
  summarySo: string;
  summaryEn: string;
  codeSnippet?: string;
  quiz?: {
    question: string;
    questionSo: string;
    options: string[];
    correctIndex: number;
    explanationSo: string;
  };
}

interface Section {
  title: string;
  titleSo: string;
  trackId: string;
  lessons: Lesson[];
}

interface CoursePageProps {
  user: User;
  language: LanguageType;
  onBack?: () => void;
  onStartBuilding?: () => void;
}

export const CoursePage: React.FC<CoursePageProps> = ({ 
  user, 
  language, 
  onBack,
  onStartBuilding 
}) => {
  const isSo = language === 'so';

  const [sections, setSections] = useState<Section[]>([
    {
      title: 'Track 1: Foundation & Vibe Coding Basics',
      titleSo: 'Qaybta 1: Aasaaska & Barashada Vibe Coding',
      trackId: 'foundation',
      lessons: [
        { 
          id: '1', 
          title: 'Introduction to Vibe Coding with FURSAD AI', 
          titleSo: 'Hordhaca Vibe Coding & Matoorka FURSAD AI', 
          duration: '35m', 
          type: 'video', 
          status: 'completed',
          summarySo: 'Baro sida loogu fikiro sida AI Architect, sida prompts sax ah loogu qoro FURSAD AI, iyo sida fikrad loogu rogo software buuxa.',
          summaryEn: 'Learn how to think like an AI Architect, structure natural language prompts, and translate vision into working software.',
          codeSnippet: `// Tusaale: Prompt Architecture ee FURSAD AI
{
  "project": "E-Commerce Store",
  "features": ["Category Filter", "Interactive Cart", "Order Modal"],
  "designSystem": "Tailwind CSS Modern Dark"
}`,
          quiz: {
            question: "What is the primary role of a Vibe Coder?",
            questionSo: "Waa maxay doorka ugu muhiimsan ee Vibe Coder-ka?",
            options: [
              "Writing every CSS line manually without AI",
              "Directing AI architecture, evaluating UX, and guiding iterative builds",
              "Only copying and pasting random code without testing",
              "Disabling all developer tools"
            ],
            correctIndex: 1,
            explanationSo: "Vibe Coder-ku waa architect-ka jiheeya AI-ga, qiimeeya hab-dhismeedka, una gacan-geliya macaamiisha software tayo leh."
          }
        },
        { 
          id: '2', 
          title: 'HTML5, Modern CSS & Tailwind utility system', 
          titleSo: 'Dhismaha HTML5 & Naqshadda Casriga ah ee Tailwind', 
          duration: '50m', 
          type: 'video', 
          status: 'completed',
          summarySo: 'Fahamka qaab-dhismeedka DOM-ka, Tailwind CSS 4 utility classes, flexbox, CSS grid, iyo habaynta animations-ka.',
          summaryEn: 'Deep dive into semantic HTML5, Tailwind CSS 4 layout utilities, responsive design principles, and micro-interactions.',
          codeSnippet: `<div class="p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl flex items-center justify-between">
  <h2 class="text-xl font-black text-white">FURSAD AI Component</h2>
  <button class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition-all">
    Tijaabi
  </button>
</div>`,
          quiz: {
            question: "Which Tailwind utility makes a container flex with items centered?",
            questionSo: "Koodhka Tailwind kee baa samaynaya flexbox bartanka ku toosan?",
            options: ["display-block", "flex items-center justify-center", "grid-cols-1", "float-left"],
            correctIndex: 1,
            explanationSo: "'flex items-center justify-center' ayaa toosinaya walxaha xagga toosan iyo xagga jiifka labadaba."
          }
        },
        { 
          id: '3', 
          title: 'Modern JavaScript (ES6+), DOM & State', 
          titleSo: 'JavaScript-ka Casriga ah (ES6+) & Maamulka State-ka', 
          duration: '1h 15m', 
          type: 'coding', 
          status: 'completed',
          summarySo: 'Baro Arrow Functions, Destructuring, Promises, Async/Await, iyo sida DOM elements loola falgalo.',
          summaryEn: 'Master modern ES6+ syntax, asynchronous programming with Async/Await, and dynamic DOM manipulation.',
          codeSnippet: `// Modern Async State Handler
async function fetchAppData(endpoint) {
  try {
    const res = await fetch('/api/' + endpoint);
    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    console.error('Data error:', err);
    return { success: false, err };
  }
}`
        }
      ]
    },
    {
      title: 'Track 2: React 19 & Frontend Architecture',
      titleSo: 'Qaybta 2: Dhismaha React 19 & TypeScript',
      trackId: 'react',
      lessons: [
        { 
          id: '4', 
          title: 'React 19 Components, State & Hooks', 
          titleSo: 'Aasaaska React 19: Components, useState & useEffect', 
          duration: '1h 10m', 
          type: 'video', 
          status: 'current',
          summarySo: 'Sida loo dhiso components dib loo isticmaali karo, maamulka xogta useState, iyo lifecycle events-ka.',
          summaryEn: 'Building modular functional components, managing local reactive state, and understanding side-effects.',
          codeSnippet: `import React, { useState } from 'react';

export function CartWidget() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)} className="px-4 py-2 bg-blue-600 rounded-xl text-white">
      Cart: {count} alaab
    </button>
  );
}`
        },
        { 
          id: '5', 
          title: 'TypeScript for Production Web Apps', 
          titleSo: 'TypeScript: Qorista Koodh Sugan & Types', 
          duration: '55m', 
          type: 'coding', 
          status: 'locked',
          summarySo: 'Baro Types, Interfaces, Generics, iyo sida TypeScript loogu ilaaliyo koodhka khaladaadka (Zero Bugs).',
          summaryEn: 'Type safety, interfaces, generic types, and building bulletproof web applications with TypeScript.'
        },
        { 
          id: '6', 
          title: 'Responsive & Interactive Web Application Design', 
          titleSo: 'Naqshadaynta Mobile-First & Animations', 
          duration: '45m', 
          type: 'theory', 
          status: 'locked',
          summarySo: 'Habaynta muraayadaha kala duwan (Desktop, Tablet, Mobile) adoo adeegsanaya Tailwind breakpoints iyo Framer Motion.',
          summaryEn: 'Master responsive layouts across devices using mobile-first breakpoints and smooth motion transitions.'
        }
      ]
    },
    {
      title: 'Track 3: AI Integration & Gemini Engine',
      titleSo: 'Qaybta 3: Isku-xirka AI-ga & Matoorka Gemini',
      trackId: 'ai',
      lessons: [
        { 
          id: '7', 
          title: 'Google GenAI SDK & Gemini 2.5 Flash Integration', 
          titleSo: 'Ku xirida Google GenAI SDK & Gemini 2.5 Flash', 
          duration: '1h 30m', 
          type: 'video', 
          status: 'locked',
          summarySo: 'Fahamka moodallada casriga ah: gemini-2.5-flash, prompt engineering, system instructions, iyo structured JSON output.',
          summaryEn: 'Integrating modern Gemini models via @google/genai SDK, structured JSON output mode, and prompt tuning.'
        },
        { 
          id: '8', 
          title: 'Autonomous Code Generation & Live Sandbox', 
          titleSo: 'Soosaarista Koodhka Tooska ah & Live Sandbox', 
          duration: '1h 20m', 
          type: 'coding', 
          status: 'locked',
          summarySo: 'Sida loo dhiso nidaam AI-gu koodh dhab ah ku soo saaro oo iframe live sandbox loogu muujiyo si interactive ah.',
          summaryEn: 'How to build end-to-end AI code synthesizer pipelines that render live executable preview sandboxes.'
        }
      ]
    },
    {
      title: 'Track 4: Full-Stack, Database & Cloud Deployment',
      titleSo: 'Qaybta 4: Backend, Database & Cloud Deployment',
      trackId: 'fullstack',
      lessons: [
        { 
          id: '9', 
          title: 'Node.js, Express & RESTful APIs', 
          titleSo: 'Server-ka Node.js, Express & REST APIs', 
          duration: '1h 15m', 
          type: 'video', 
          status: 'locked',
          summarySo: 'Dhismaha server-ka Express, maamulka proxy endpoints, CORS, iyo ammaan gelinta furayaasha API.',
          summaryEn: 'Creating resilient Express backend servers, routing, rate-limiting, and proxying external APIs safely.'
        },
        { 
          id: '10', 
          title: 'One-Click Cloud Deployment to Global Edge', 
          titleSo: 'Daabacaadda Cloud-ka & Launching Live Website', 
          duration: '40m', 
          type: 'video', 
          status: 'locked',
          summarySo: 'Sida website-kaaga loogu daabaco adduunka oo dhan hal gujin (One-Click Deploy to Edge).',
          summaryEn: 'Deploying full-stack applications to global production edge hosting with custom domains and SSL.'
        }
      ]
    }
  ]);

  const [activeLesson, setActiveLesson] = useState<Lesson>(sections[1].lessons[0]);
  const [activeTab, setActiveTab] = useState<'video' | 'exercise' | 'notes' | 'quiz'>('video');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<string>('1.0x');
  const [progressPercent, setProgressPercent] = useState(user.courseProgress || 45);
  const [showCertModal, setShowCertModal] = useState(false);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Mark lesson as complete
  const handleMarkComplete = () => {
    const updated = sections.map(sec => ({
      ...sec,
      lessons: sec.lessons.map(l => {
        if (l.id === activeLesson.id) {
          return { ...l, status: 'completed' as const };
        }
        return l;
      })
    }));

    // Unlock next lesson
    let foundCurrent = false;
    let nextLesson: Lesson | null = null;
    updated.forEach(sec => {
      sec.lessons.forEach(l => {
        if (foundCurrent && l.status === 'locked' && !nextLesson) {
          l.status = 'current';
          nextLesson = l;
        }
        if (l.id === activeLesson.id) {
          foundCurrent = true;
        }
      });
    });

    setSections(updated);
    setProgressPercent(prev => Math.min(100, prev + 12));
    if (nextLesson) {
      setActiveLesson(nextLesson);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 text-slate-100 font-sans">
      {/* Top Banner & Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack || (() => window.history.back())}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 border border-slate-700 text-xs font-bold text-white transition-all flex items-center gap-2 active:scale-95 shadow-md shadow-black/40 group cursor-pointer"
            title="Ku noqo Hoyga ama Landing-ka / Back to Home"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>{isSo ? '← Ku noqo Hoyga (Home)' : '← Back to Home / Landing'}</span>
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-bold">
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span>FURSAD AI ACADEMY</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onStartBuilding && (
            <button 
              onClick={onStartBuilding}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isSo ? 'Tag AI Builder-ka' : 'Open AI Builder'}</span>
            </button>
          )}

          <button 
            onClick={() => setShowCertModal(true)}
            className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <Award className="w-3.5 h-3.5" />
            <span>{isSo ? 'Shahaadada (Certificate)' : 'Claim Certificate'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-indigo-950/40 border border-blue-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            ★ Full-Stack Vibe Coding Mastery 2026
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {isSo ? (
              <>Baro Dhismaha Apps-ka AI-ga ah <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-amber-300">laga bilaabo Zero ilaa Pro</span></>
            ) : (
              <>Master Full-Stack Vibe Coding <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-amber-300">from Scratch to Production</span></>
            )}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            {isSo 
              ? 'Koorsadani waxay si faahfaahsan kuugu baraysaa sida loo noqdo Injineer casri ah oo adeegsada FURSAD AI Builder iyo moodallada Gemini si aad u dhisto website-yo, dukaamo, portals, iyo nidaamyo xog-ururin leh.'
              : 'Comprehensive curriculum teaching modern developers to architect, prompt, and launch real full-stack web applications with FURSAD AI Builder and Google Gemini.'}
          </p>
        </div>

        {/* Progress Card */}
        <div className="lg:col-span-4 bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Horumarkaaga (Progress)</span>
            <span className="text-xs font-mono font-bold text-amber-400">Level 3 Architect</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{progressPercent}%</span>
            <span className="text-xs text-slate-500">Dhameystiran</span>
          </div>

          <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-amber-400 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="bg-white/5 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-slate-500 block">Casharro</span>
              <span className="font-bold text-white">10 Cashar</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-slate-500 block">Dhibco (XP)</span>
              <span className="font-bold text-cyan-400">2,850</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-slate-500 block">Shahaado</span>
              <span className="font-bold text-amber-400">Diyaar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Player/Tabs Left (8 cols) + Curriculum Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Lesson Player and Interactive Sandbox */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Player Box */}
          <div className="rounded-3xl bg-slate-950 border border-white/10 overflow-hidden shadow-2xl relative group">
            {/* Aspect Video Container */}
            <div className="aspect-video bg-gradient-to-br from-slate-950 via-blue-950/40 to-slate-900 relative flex flex-col justify-between p-6">
              {/* Top Bar inside player */}
              <div className="flex items-center justify-between relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                  <FursadEmblem className="w-4 h-4" />
                  <span>FURSAD Studio Live</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-blue-600/40 border border-blue-500/30 text-[10px] font-mono text-blue-200">
                    HD 1080p
                  </span>
                  <button 
                    onClick={() => setPlaybackSpeed(s => s === '1.0x' ? '1.25x' : s === '1.25x' ? '1.5x' : '1.0x')}
                    className="px-2.5 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-mono text-slate-300 hover:text-white"
                  >
                    {playbackSpeed}
                  </button>
                </div>
              </div>

              {/* Center Play Button & Graphic */}
              <div className="flex flex-col items-center justify-center my-auto relative z-10 space-y-4">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-2xl shadow-blue-500/40 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white ml-1" />}
                </button>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white shadow-sm">
                    {isSo ? activeLesson.titleSo : activeLesson.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {isPlaying ? '▶️ Casharku hada wuu socdaa...' : 'Guji badhanka si aad casharka u daawato'}
                  </p>
                </div>
              </div>

              {/* Player Bottom Scrubber Bar */}
              <div className="relative z-10 space-y-2">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer">
                  <div className="h-full bg-blue-500 rounded-full w-2/5"></div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>14:20 / {activeLesson.duration}</span>
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                    <Maximize2 className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-radial-gradient from-blue-600/10 to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* Lesson Tabs: Overview, Code Exercise, Notes, Quiz */}
          <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'video' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white bg-slate-950/60'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isSo ? 'Faahfaahin' : 'Overview'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('exercise')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'exercise' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white bg-slate-950/60'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{isSo ? 'Koodhka (Code Snippet)' : 'Exercise Code'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'notes' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white bg-slate-950/60'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{isSo ? 'Qoraalka Casharka' : 'Lesson Notes'}</span>
                </button>

                {activeLesson.quiz && (
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      activeTab === 'quiz' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-400 hover:text-amber-200 bg-amber-500/10 border border-amber-500/20'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{isSo ? 'Imtixaan (Quiz)' : 'Take Quiz'}</span>
                  </button>
                )}
              </div>

              {/* Complete Lesson Button */}
              <button 
                onClick={handleMarkComplete}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSo ? 'Dhammaystir Casharkan' : 'Mark as Complete'}</span>
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'video' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">
                  {isSo ? activeLesson.titleSo : activeLesson.title}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {isSo ? activeLesson.summarySo : activeLesson.summaryEn}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {isSo ? 'Waxa aad baranayso:' : 'What you will learn:'}
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                      <li>{isSo ? 'Habka Vibe Coding loogu qoro FURSAD AI Builder' : 'Prompting structure for FURSAD AI'}</li>
                      <li>{isSo ? 'Isku xirka components iyo state-ka firfircoon' : 'Interactive state management and hooks'}</li>
                      <li>{isSo ? 'Tijaabinta Live Preview-ga degdegga ah' : 'Live sandbox testing workflows'}</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      {isSo ? 'Qalabka la isticmaalayo:' : 'Tools & Technologies:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['React 19', 'TypeScript', 'Tailwind CSS', 'Gemini 2.5 Flash', 'Node.js', 'Vite'].map(tech => (
                        <span key={tech} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-mono text-slate-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Code Snippet */}
            {activeTab === 'exercise' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>{isSo ? 'Koodhka Tusaalaha ah ee Casharkan:' : 'Interactive Code Example:'}</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">TypeScript / React 19</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#0b0f19] border border-white/10 font-mono text-xs text-emerald-400 overflow-x-auto">
                  <pre>{activeLesson.codeSnippet || `// FURSAD AI Starter Component\nimport React from 'react';\n\nexport default function App() {\n  return (\n    <div className="min-h-screen bg-slate-950 text-white p-8">\n      <h1 className="text-2xl font-bold">Ku soo dhowaw FURSAD AI</h1>\n    </div>\n  );\n}`}</pre>
                </div>
              </div>
            )}

            {/* Tab 3: Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">{isSo ? 'Qoraalka & Talooyinka Casharka' : 'Lesson Key Takeaways'}</h3>
                <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                  <p>
                    {isSo 
                      ? 'Markaad wax ka dhisayso FURSAD AI Builder, had iyo jeer qor shuruudaha si cad: sheeg nooca website-ka, waxa badhannadu qabanayaan, qaybaha shaashadda, iyo midabada aad doonayso.' 
                      : 'When directing the AI builder, specify exact functional boundaries: state requirements, cart interactions, modal popups, and design palette.'}
                  </p>
                  <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/20 text-xs text-blue-200">
                    💡 <strong>Tip:</strong> {isSo ? 'Isticmaal badhanka Codka (Mic) haddii aadan rabin inaad wax qorto!' : 'Use the Voice button to dictate your prompts directly in natural language!'}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Quiz */}
            {activeTab === 'quiz' && activeLesson.quiz && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>{isSo ? activeLesson.quiz.questionSo : activeLesson.quiz.question}</span>
                </h3>

                <div className="space-y-2 pt-2">
                  {activeLesson.quiz.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setQuizSelected(idx); setQuizSubmitted(false); }}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                        quizSelected === idx 
                          ? 'bg-blue-600/20 border-blue-500 text-white' 
                          : 'bg-slate-950/60 border-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={quizSelected === null}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    {isSo ? 'Hubi Jawaabta' : 'Submit Answer'}
                  </button>

                  {quizSubmitted && (
                    <div className="text-xs font-bold">
                      {quizSelected === activeLesson.quiz.correctIndex ? (
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          {isSo ? 'Sax! Aad baad u fiican tahay (+50 XP)' : 'Correct! Great job (+50 XP)'}
                        </span>
                      ) : (
                        <span className="text-rose-400">
                          {isSo ? 'Khalad. Dib u fiiri casharka.' : 'Incorrect. Try reviewing the lesson.'}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {quizSubmitted && (
                  <p className="p-3 rounded-xl bg-white/5 text-xs text-slate-400">
                    {activeLesson.quiz.explanationSo}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Curriculum Navigation */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              {isSo ? 'Qorshaha Koorsada (Curriculum)' : 'Course Curriculum'}
            </h3>
            <span className="text-xs font-mono text-cyan-400 font-bold">4 Tracks</span>
          </div>

          <div className="space-y-4">
            {sections.map((section, sIdx) => (
              <div key={section.trackId || sIdx} className="bg-slate-900/50 border border-white/5 rounded-3xl p-3">
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                    {isSo ? section.titleSo : section.title}
                  </span>
                  <span className="text-[10px] text-slate-500">{section.lessons.length}</span>
                </div>

                <div className="space-y-1.5 mt-2">
                  {section.lessons.map(lesson => {
                    const isSelected = activeLesson.id === lesson.id;
                    const isCompleted = lesson.status === 'completed';
                    const isLocked = lesson.status === 'locked';

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          if (!isLocked) {
                            setActiveLesson(lesson);
                            setIsPlaying(false);
                            setQuizSelected(null);
                            setQuizSubmitted(false);
                          }
                        }}
                        disabled={isLocked}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all text-left ${
                          isSelected 
                            ? 'bg-blue-600/20 border border-blue-500/40 text-white' 
                            : isLocked 
                            ? 'opacity-40 cursor-not-allowed text-slate-500' 
                            : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isCompleted ? 'bg-emerald-500/20 text-emerald-400' :
                          isSelected ? 'bg-blue-600 text-white' :
                          isLocked ? 'bg-white/5 text-slate-600' : 'bg-white/5 text-slate-400'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                           isLocked ? <Lock className="w-3.5 h-3.5" /> :
                           <Play className="w-3.5 h-3.5 fill-current" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">
                            {isSo ? lesson.titleSo : lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>{lesson.duration}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Certification Card Promo */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/20 via-orange-600/20 to-slate-950 border border-amber-500/30 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-300">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-white text-base">
              {isSo ? 'Shahaadada Rasmiga ah ee FURSAD AI' : 'Official FURSAD AI Certification'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isSo 
                ? 'Dhameystir koorsada oo qaado shahaadada Full-Stack Vibe Coding & AI Engineer oo leh QR-Code iyo aqoonsi caalami ah.'
                : 'Complete lessons and quizzes to earn verified certification in Full-Stack Vibe Coding & AI Engineering.'}
            </p>
            <button
              onClick={() => setShowCertModal(true)}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95"
            >
              {isSo ? 'Fiiri Shahaadadaada' : 'View Your Certificate'}
            </button>
          </div>
        </div>
      </div>

      {/* Official Certificate Modal */}
      <AnimatePresence>
        {showCertModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-950 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 relative text-center"
            >
              <button 
                onClick={() => setShowCertModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center space-y-3">
                <FursadEmblem className="w-16 h-16 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-400">
                  FURSAD AI ACADEMY • GLOBAL CREDENTIAL
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Certificate of Achievement
                </h3>
                <p className="text-xs text-slate-400">This certifies that</p>
                <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200">
                  {user.fullName || 'Ahmed Hassan'}
                </p>
                <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                  has successfully mastered Full-Stack Vibe Coding, Autonomous AI Web Architecture, and Gemini Engine Integration with distinction.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Issue Date: October 2026</span>
                <span className="text-amber-400">ID: FURSAD-VIBE-8924</span>
                <span>Verified: Yes ✓</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:from-amber-400 hover:to-orange-400 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{isSo ? 'Soo Dejiso / Daabaco' : 'Download / Print Certificate'}</span>
                </button>
                <button 
                  onClick={() => setShowCertModal(false)}
                  className="px-6 py-3 bg-white/5 text-slate-300 hover:text-white rounded-xl text-xs font-bold"
                >
                  {isSo ? 'Xidh' : 'Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
