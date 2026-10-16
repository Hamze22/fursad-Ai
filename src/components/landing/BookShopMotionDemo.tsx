import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Code2, 
  Eye, 
  Columns, 
  BookOpen, 
  ShoppingBag, 
  Search, 
  Star, 
  Plus, 
  Check, 
  Terminal, 
  Cpu, 
  ArrowRight,
  Maximize2,
  Minimize2,
  Copy,
  Laptop,
  Tablet,
  Smartphone,
  Bot,
  User,
  CheckCircle2,
  X,
  FileCode,
  Layers,
  Info,
  Clock,
  Sparkle
} from 'lucide-react';
import { FursadEmblem, FursadLogo } from '../common/FursadLogo.tsx';

interface BookShopMotionDemoProps {
  onStartBuilding?: (prompt?: string) => void;
  theme?: 'light' | 'dark';
}

export const BookShopMotionDemo: React.FC<BookShopMotionDemoProps> = ({ 
  onStartBuilding,
  theme = 'dark' 
}) => {
  // Playback timer (0 to 18 seconds loop)
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [viewMode, setViewMode] = useState<'split' | 'code' | 'preview'>('split');
  const [deviceViewport, setDeviceViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'BookShop.tsx' | 'catalog.ts' | 'CartDrawer.tsx'>('BookShop.tsx');
  
  // Interactive Simulation state (purely client-side demo, non-functional / no real APIs)
  const [cartCount, setCartCount] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedBookId, setAddedBookId] = useState<number | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  // Target texts for the 3-stage sequence
  const targetPrompt = "book shop landing page promote bestsellers, classic Somali literature, search and cart";
  const aiFullResponse = "Waa hagaag! Waxaan hadda diyaarinayaa Book Shop landing page casri ah. Waxaan u dhisayaa IFTIN BOOK HOUSE oo leh Bestseller collection, buugaagta Hadraawi & suugaanta Soomaaliyeed, search filter degdeg ah, iyo gaadhiga wax iibsiga (cart).";

  // Animation cycle: 18 seconds loop
  // Stage 1: 0.0s - 3.4s -> Prompt typing in input
  // Stage 2: 3.5s - 6.8s -> AI thinking & streamed response text with build checklist
  // Stage 3: 6.9s - 18.0s -> Website emerges into view on preview pane!
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= 18) return 0; // loop back smoothly
        return +(prev + 0.1).toFixed(1);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Derived timeline stages
  const isPromptTypingStage = currentTime < 3.5;
  const isAiThinkingStage = currentTime >= 3.5 && currentTime < 7.0;
  const isWebsiteReadyStage = currentTime >= 7.0;

  // Streamed Prompt characters (0s to 3.2s)
  const promptProgress = Math.min(1, Math.max(0, (currentTime - 0.2) / 3.0));
  const promptChars = Math.floor(promptProgress * targetPrompt.length);
  const currentTypedPrompt = targetPrompt.slice(0, promptChars);

  // Streamed AI response characters (3.6s to 6.6s)
  const aiProgress = Math.min(1, Math.max(0, (currentTime - 3.6) / 3.0));
  const aiChars = Math.floor(aiProgress * aiFullResponse.length);
  const currentAiResponse = aiFullResponse.slice(0, aiChars);

  // Checklist progression
  const step1Done = currentTime >= 4.3;
  const step2Done = currentTime >= 5.3;
  const step3Done = currentTime >= 6.3;

  // Percentage progress for the timeline bar
  const timelinePercent = Math.min(100, Math.round((currentTime / 18) * 100));

  // Sample Somali & world books dataset for the mock bookstore
  const books = [
    {
      id: 1,
      title: "Aasaaska Suugaanta",
      author: "Maxamed I. Hadraawi",
      category: "Somali Classics",
      price: 18.99,
      rating: 5.0,
      badge: "Bestseller",
      color: "from-amber-700 via-orange-800 to-amber-950",
      tag: "Gabayo & Murti"
    },
    {
      id: 2,
      title: "Aqoondarro waa u nacab jacayl",
      author: "Faarax M.J. Cawl",
      category: "Somali Classics",
      price: 14.50,
      rating: 4.9,
      badge: "Classic Tale",
      color: "from-blue-700 via-indigo-900 to-slate-950",
      tag: "Sheeko Dhaqan"
    },
    {
      id: 3,
      title: "Vibe Coding & Full-Stack AI",
      author: "FURSAD AI Lab",
      category: "Tech & AI",
      price: 29.99,
      rating: 5.0,
      badge: "New Release",
      color: "from-cyan-700 via-teal-900 to-slate-950",
      tag: "AI Engineering"
    },
    {
      id: 4,
      title: "Murti & Maahmaahyo Soomaali",
      author: "Shire Jaamac Axmed",
      category: "Somali Classics",
      price: 16.00,
      rating: 4.8,
      badge: "Heritage",
      color: "from-emerald-700 via-green-900 to-teal-950",
      tag: "Dhaqan Asal ah"
    }
  ];

  const filteredBooks = books.filter(b => {
    const matchCat = selectedCategory === 'All' || b.category === selectedCategory;
    const matchQuery = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleAddToCart = (id: number) => {
    setCartCount(prev => prev + 1);
    setAddedBookId(id);
    showNotice("Tusaale: Buugga waxa lagu daray gaadhiga (Cart +1)");
    setTimeout(() => setAddedBookId(null), 1800);
  };

  const showNotice = (msg: string) => {
    setDemoNotice(msg);
    setTimeout(() => setDemoNotice(null), 3000);
  };

  const copyCodeToClipboard = () => {
    const sampleCode = `// src/components/BookShopLanding.tsx
import React, { useState } from 'react';
import { ShoppingBag, Star, BookOpen, Search } from 'lucide-react';

export default function BookShopLanding() {
  const [cart, setCart] = useState(${cartCount});
  const [search, setSearch] = useState("${searchQuery}");
  const [category, setCategory] = useState("${selectedCategory}");

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-black text-amber-400">IFTIN BOOK HOUSE</h1>
        <button className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl font-bold">
          Cart ({cart})
        </button>
      </header>

      {/* Hero Promotion */}
      <section className="p-8 bg-gradient-to-r from-amber-950/40 to-slate-900 border-b border-slate-800">
        <span className="text-amber-400 text-xs font-bold uppercase">Bestsellers 2026</span>
        <h2 className="text-3xl font-extrabold mt-1">Discover Somali & World Literature</h2>
      </section>

      {/* Book Catalog */}
      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Book items rendered with Tailwind CSS */}
      </main>
    </div>
  );
}`;
    navigator.clipboard?.writeText(sampleCode);
    setCopiedCode(true);
    showNotice("Code-ka waxa lagu koobiyeeyay clipboard-ka!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const resetToStart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <div 
      className={`w-full max-w-7xl xl:max-w-[1520px] mx-auto rounded-3xl transition-all duration-300 overflow-hidden flex flex-col text-left border ${
        isFullscreen 
          ? 'fixed inset-0 z-50 rounded-none max-w-none bg-slate-950 border-none' 
          : 'relative bg-slate-950 border-blue-500/30 shadow-[0_0_60px_rgba(37,99,235,0.22)]'
      }`}
    >
      {/* Toast Notice for Demo actions */}
      <AnimatePresence>
        {demoNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2 border border-blue-400/30 backdrop-blur-md"
          >
            <Info className="w-3.5 h-3.5 text-cyan-200" />
            <span>{demoNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Workspace Header Bar */}
      <div className="h-13 bg-slate-900/95 border-b border-slate-800 px-3 sm:px-5 flex items-center justify-between gap-3 text-xs font-mono shrink-0">
        {/* Left: Window Dots & App Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
          </div>
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
            <FursadEmblem className="w-5 h-5 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <div className="flex items-baseline gap-1 leading-none font-sans font-black tracking-tight text-xs sm:text-sm select-none">
              <span className="text-white">FURSAD</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]">
                AI
              </span>
              <span className="ml-1 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                Builder
              </span>
            </div>
            <span className="text-slate-600 hidden md:inline">•</span>
            {/* Non-functional / Example Badge */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
              <span>Tusaale Demo ah (No API)</span>
            </span>
          </div>
        </div>

        {/* Center: View Switcher (Split, Code, Preview) */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5">
          <button
            onClick={() => setViewMode('split')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'split' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Chat & Live Preview side-by-side"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split</span>
          </button>
          
          <button
            onClick={() => setViewMode('code')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'code' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Open generated Code view"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
          
          <button
            onClick={() => setViewMode('preview')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'preview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Full Live Preview"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {/* Right: Responsive Devices & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Viewport switch for preview */}
          <div className="hidden lg:flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-slate-400">
            <button
              onClick={() => setDeviceViewport('desktop')}
              className={`p-1 rounded ${deviceViewport === 'desktop' ? 'bg-slate-800 text-cyan-400' : 'hover:text-white'}`}
              title="Laptop / PC View"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceViewport('tablet')}
              className={`p-1 rounded ${deviceViewport === 'tablet' ? 'bg-slate-800 text-cyan-400' : 'hover:text-white'}`}
              title="Tablet View"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceViewport('mobile')}
              className={`p-1 rounded ${deviceViewport === 'mobile' ? 'bg-slate-800 text-cyan-400' : 'hover:text-white'}`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cloud Integrations Badges in Demo */}
          <div className="hidden xl:flex items-center gap-1.5 font-mono text-[10px]">
            <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1" title="Git version control connected">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
              <span>GitHub</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center gap-1" title="Firebase Firestore DB Active">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Firebase</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-1" title="Supabase Postgres DB Active">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Supabase</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-white flex items-center gap-1" title="Vercel Edge Deployment Ready">
              <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 76 65"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z" /></svg>
              <span>Vercel</span>
            </span>
          </div>

          {/* Quick Open Code button */}
          <button
            onClick={() => setIsCodeModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-all border border-slate-700 shadow-xs"
            title="Open Code in Modal Inspector"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Open Code</span>
          </button>

          {/* Playback Controls */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 transition-colors"
            title={isPlaying ? "Pause Demo" : "Play Demo"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={resetToStart}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Replay sequence from start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen PC/Laptop Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen for Laptop/PC"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Progress Timeline Scrubber & 3-Step Indicator Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-[10px] font-mono gap-2 shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none">
          {/* Step 1 badge */}
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
            isPromptTypingStage ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-500'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>1. Prompt Typing</span>
          </div>

          <span className="text-slate-700">→</span>

          {/* Step 2 badge */}
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
            isAiThinkingStage ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30' : 'text-slate-500'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isAiThinkingStage ? 'bg-blue-400 animate-pulse' : 'bg-slate-600'}`}></span>
            <span>2. AI Response</span>
          </div>

          <span className="text-slate-700">→</span>

          {/* Step 3 badge */}
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
            isWebsiteReadyStage ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'text-slate-500'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isWebsiteReadyStage ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            <span>3. Website Ready</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400 shrink-0">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>{currentTime.toFixed(1)}s / 18.0s</span>
        </div>
      </div>

      {/* Scrubber line */}
      <div className="h-1 w-full bg-slate-900 relative">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 transition-all duration-100" 
          style={{ width: `${timelinePercent}%` }}
        />
      </div>

      {/* Main Workspace Stage: PC & Laptop Responsive Layout */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col gap-4 bg-[#030712] min-h-[560px] lg:h-[640px] xl:h-[680px]">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-0">
          
          {/* LEFT COLUMN: AI CHAT BUILDER (Visible in 'split' mode) */}
          {(viewMode === 'split' || viewMode === 'code') && (
            <div className={`${
              viewMode === 'code' ? 'hidden' : 'lg:col-span-5'
            } flex flex-col h-full bg-[#0b0f19] border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl`}>
              
              {/* Chat Header */}
              <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center p-1 shadow-md shadow-blue-500/20">
                    <FursadEmblem className="w-6 h-6 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1 font-sans">
                      <span className="font-black text-white tracking-tight">FURSAD</span>
                      <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 tracking-tight">AI</span>
                      <span className="text-slate-300 text-[11px] font-medium ml-1">Builder Chat</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">Visual Demo Simulation (Non-functional)</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {isPromptTypingStage ? 'Typing Prompt...' : isAiThinkingStage ? 'AI Thinking...' : 'Ready'}
                </span>
              </div>

              {/* Chat Conversation Scroll Area */}
              <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 font-sans text-xs">
                {/* User Message Bubble */}
                {currentTime >= 1.0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2.5 items-start"
                  >
                    <div className="w-6 h-6 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 text-[10px] font-bold shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 bg-purple-950/30 border border-purple-500/30 rounded-2xl rounded-tl-sm p-3 text-slate-200 leading-relaxed shadow-sm">
                      <div className="flex items-center justify-between text-[10px] text-purple-300 font-mono font-bold mb-1">
                        <span>User Prompt</span>
                        {isPromptTypingStage && (
                          <span className="text-cyan-400 font-normal animate-pulse">qorayaa...</span>
                        )}
                      </div>
                      <p className="font-medium text-white">
                        {currentTypedPrompt}
                        {isPromptTypingStage && (
                          <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-1 animate-pulse"></span>
                        )}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* AI Assistant Response Bubble (appears in Stage 2 & 3) */}
                {currentTime >= 3.5 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2.5 items-start"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-950/80 border border-blue-500/30 flex items-center justify-center p-1 shrink-0 mt-0.5 shadow-sm">
                      <FursadEmblem className="w-5 h-5 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]" />
                    </div>
                    <div className="flex-1 bg-slate-900/90 border border-blue-500/25 rounded-2xl rounded-tl-sm p-3 text-slate-300 leading-relaxed space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-sans">
                          <span className="text-xs font-black text-white tracking-tight">FURSAD</span>
                          <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400 tracking-tight">AI</span>
                          <span className="text-[10px] text-blue-400 font-mono font-bold ml-1">Architect</span>
                        </div>
                        <span className={`text-[10px] font-mono font-bold flex items-center gap-1 ${
                          isWebsiteReadyStage ? 'text-emerald-400' : 'text-amber-400 animate-pulse'
                        }`}>
                          {isWebsiteReadyStage ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Preview Built</span>
                            </>
                          ) : (
                            <>
                              <Cpu className="w-3 h-3 animate-spin text-amber-400" />
                              <span>Qoraya jawaabta...</span>
                            </>
                          )}
                        </span>
                      </div>

                      {/* Streamed AI Text */}
                      <p className="text-[11px] text-slate-200">
                        {currentAiResponse}
                        {isAiThinkingStage && (
                          <span className="inline-block w-1.5 h-3.5 bg-blue-400 ml-1 animate-pulse"></span>
                        )}
                      </p>

                      {/* AI Tasks Checklist */}
                      <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800 space-y-1.5 font-mono text-[10px]">
                        <div className={`flex items-center gap-2 transition-colors ${step1Done ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {step1Done ? <Check className="w-3 h-3 text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-slate-600" />}
                          <span>Qaab-dhismeedka &amp; Bestseller Hero Banner</span>
                        </div>
                        <div className={`flex items-center gap-2 transition-colors ${step2Done ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {step2Done ? <Check className="w-3 h-3 text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-slate-600" />}
                          <span>Kutubta Hadraawi &amp; Suugaanta Soomaaliyeed</span>
                        </div>
                        <div className={`flex items-center gap-2 transition-colors ${step3Done ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {step3Done ? <Check className="w-3 h-3 text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-slate-600" />}
                          <span>Search-ka buugaagta &amp; Gaadhiga wax iibsiga</span>
                        </div>
                      </div>

                      {isWebsiteReadyStage && (
                        <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[10px] text-emerald-300 flex items-center justify-between">
                          <span>✨ Website-kii wuu soo baxay (Preview)</span>
                          <button
                            onClick={() => setViewMode('code')}
                            className="text-cyan-400 hover:underline font-bold flex items-center gap-1"
                          >
                            <span>Eeg Code-ka</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Chat Input Bar (Step 1: Typing prompt) */}
              <div className="p-3 bg-slate-900/95 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-mono">Tusaale Prompt:</span>
                  <span className="text-amber-400/90 font-medium">Non-functional example demo</span>
                </div>

                <div className="relative flex items-center bg-slate-950 border border-blue-500/40 rounded-xl px-3 py-2 shadow-inner">
                  <Terminal className="w-4 h-4 text-blue-400 mr-2 shrink-0" />
                  <div className="flex-1 font-mono text-xs text-slate-200 truncate flex items-center">
                    <span className="text-white font-medium">
                      {currentTypedPrompt || "book shop landing page promote..."}
                    </span>
                    {isPromptTypingStage && (
                      <span className="w-1.5 h-4 bg-cyan-400 ml-1 inline-block animate-pulse"></span>
                    )}
                  </div>
                  
                  {/* Replay / Simulate trigger */}
                  <button
                    onClick={resetToStart}
                    className="ml-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1 shrink-0 active:scale-95"
                    title="Dib u celi tusaalaha (Replay simulation)"
                  >
                    <span>Simulate</span>
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT COLUMN / FULL WIDTH: CODE EDITOR OR LIVE PREVIEW */}
          <div className={`${
            viewMode === 'split' ? 'lg:col-span-7' : 'lg:col-span-12'
          } flex flex-col h-full bg-[#020617] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative`}>
            
            {/* View Mode: FULL CODE VIEW */}
            {viewMode === 'code' ? (
              <div className="flex-1 flex flex-col h-full bg-[#0a0f1d] font-mono text-xs">
                {/* Code tabs */}
                <div className="h-10 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1">
                    {(['BookShop.tsx', 'catalog.ts', 'CartDrawer.tsx'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveCodeTab(tab)}
                        className={`px-3 py-1.5 rounded-t-lg font-bold transition-colors flex items-center gap-1.5 ${
                          activeCodeTab === tab 
                            ? 'bg-[#0a0f1d] text-cyan-400 border-t-2 border-cyan-400' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>{tab}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyCodeToClipboard}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 transition-all"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                    <button
                      onClick={() => setViewMode('preview')}
                      className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold flex items-center gap-1 transition-all"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Back to Preview</span>
                    </button>
                  </div>
                </div>

                {/* Code Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1 text-slate-300 text-[11px] leading-relaxed">
                  <div className="flex gap-4">
                    <div className="text-slate-600 select-none text-right w-6">
                      {Array.from({ length: 22 }).map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    <div className="flex-1">
                      <p><span className="text-purple-400">import</span> React, &#123; useState &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">&apos;react&apos;</span>;</p>
                      <p><span className="text-purple-400">import</span> &#123; ShoppingBag, BookOpen, Star, Search &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">&apos;lucide-react&apos;</span>;</p>
                      <br />
                      <p className="text-slate-500">// Bestsellers promoting Hadraawi &amp; Somali classic literature (Example Component)</p>
                      <p><span className="text-blue-400">export default function</span> <span className="text-amber-300">BookShopLanding</span>() &#123;</p>
                      <p className="pl-4"><span className="text-blue-400">const</span> [cart, setCart] = <span className="text-amber-400">useState</span>({cartCount});</p>
                      <p className="pl-4"><span className="text-blue-400">const</span> [search, setSearch] = <span className="text-amber-400">useState</span>(<span className="text-emerald-400">&quot;{searchQuery}&quot;</span>);</p>
                      <br />
                      <p className="pl-4"><span className="text-purple-400">return</span> (</p>
                      <p className="pl-8 text-slate-200">&lt;<span className="text-cyan-400">div</span> <span className="text-amber-400">className</span>=<span className="text-emerald-400">&quot;min-h-screen bg-slate-950 font-sans&quot;</span>&gt;</p>
                      <p className="pl-12 text-slate-200">&lt;<span className="text-cyan-400">BookShopHeader</span> <span className="text-amber-400">title</span>=<span className="text-emerald-400">&quot;IFTIN BOOK HOUSE&quot;</span> <span className="text-amber-400">cartCount</span>=&#123;cart&#125; /&gt;</p>
                      <p className="pl-12 text-slate-200">&lt;<span className="text-cyan-400">PromoHero</span> <span className="text-amber-400">badge</span>=<span className="text-emerald-400">&quot;Bestseller Collection 2026&quot;</span> /&gt;</p>
                      <p className="pl-12 text-slate-200">&lt;<span className="text-cyan-400">BestsellerGrid</span> <span className="text-amber-400">onAddToCart</span>=&#123;() =&gt; setCart(c =&gt; c + 1)&#125; /&gt;</p>
                      <p className="pl-8 text-slate-200">&lt;/<span className="text-cyan-400">div</span>&gt;</p>
                      <p className="pl-4">);</p>
                      <p>&#125;</p>
                    </div>
                  </div>
                </div>

                <div className="h-8 bg-slate-950 border-t border-slate-800 px-4 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-emerald-400 font-bold">● TypeScript Simulation Code (Ready to view &amp; copy)</span>
                  <span>Non-functional Educational Example</span>
                </div>
              </div>
            ) : (
              /* LIVE PREVIEW VIEW */
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mock Browser URL Bar */}
                <div className="h-10 bg-slate-900 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 max-w-[280px] sm:max-w-sm truncate">
                    <span className={`w-2 h-2 rounded-full ${isWebsiteReadyStage ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`}></span>
                    <span>https://iftin-bookshop.demo/landing-promote</span>
                  </div>

                  {/* Open Code Button inside Preview Header */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setViewMode('code')}
                      className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/30 text-[10px] font-bold flex items-center gap-1 transition-all"
                      title="Open Code for this Preview"
                    >
                      <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Open Code</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsCartOpen(!isCartOpen);
                        showNotice(`Tusaale: Gaadhiga waxa ku jira ${cartCount} buug`);
                      }}
                      className="relative p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-all"
                      title="View Cart Drawer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Device viewport frame wrapper */}
                <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-950 via-[#090d18] to-slate-950 flex flex-col items-center p-2 sm:p-3">
                  <div className={`w-full h-full transition-all duration-300 ${
                    deviceViewport === 'tablet' ? 'max-w-2xl border-x border-slate-800 shadow-2xl' : 
                    deviceViewport === 'mobile' ? 'max-w-sm border-x border-slate-800 shadow-2xl' : 'max-w-full'
                  }`}>
                    
                    {/* STAGE 1 & 2: SKELETON / BLUEPRINT & AI GENERATING ANIMATION */}
                    {!isWebsiteReadyStage ? (
                      <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
                        {isPromptTypingStage ? (
                          /* Stage 1 Blueprint waiting for prompt */
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="max-w-md w-full bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl p-6 space-y-4"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                              <Terminal className="w-6 h-6 animate-pulse" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-sm font-bold text-white">Tallaabada 1: Qoritaanka Prompt-ka</h4>
                              <p className="text-xs text-slate-400">
                                AI-gu wuxuu hadda helayaa prompt-ka dhismaha bogga buugaagta:
                              </p>
                              <p className="text-xs font-mono text-cyan-300 bg-slate-950 p-2 rounded-lg border border-slate-800 mt-2 truncate">
                                &quot;{currentTypedPrompt}&quot;
                              </p>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-cyan-400 transition-all duration-150"
                                style={{ width: `${Math.round(promptProgress * 100)}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono">
                              Awaiting prompt completion...
                            </p>
                          </motion.div>
                        ) : (
                          /* Stage 2 AI generating & building */
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-md w-full bg-slate-900/80 border border-blue-500/30 rounded-2xl p-6 space-y-4 shadow-xl"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto">
                              <Sparkles className="w-6 h-6 animate-spin text-cyan-400" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-sm font-bold text-white">Tallaabada 2: AI-ga oo jawaabaya &amp; dhisaya</h4>
                              <p className="text-xs text-slate-300">
                                Qaabaynta bogga IFTIN BOOK HOUSE, khaanadaha buugaagta, iyo koodhka Tailwind...
                              </p>
                            </div>

                            {/* Simulated build progress */}
                            <div className="space-y-1.5 font-mono text-[10px] text-left bg-slate-950 p-3 rounded-xl border border-slate-800">
                              <div className="flex items-center justify-between text-blue-300">
                                <span>Generating Layout &amp; Catalog</span>
                                <span>{Math.round(aiProgress * 100)}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-150"
                                  style={{ width: `${Math.round(aiProgress * 100)}%` }}
                                />
                              </div>
                              <p className="text-emerald-400 pt-1 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Wax yar kadib website-ku wuu soo baxayaa...</span>
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      /* STAGE 3: THE WEBSITE EMERGES (Website ku soo baxo!) */
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="p-3 sm:p-5 space-y-4 sm:space-y-5 text-white font-sans text-left"
                      >
                        {/* Store Navbar */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-sm text-white tracking-tight">IFTIN BOOK HOUSE</h4>
                              <p className="text-[9px] text-amber-400 font-mono uppercase tracking-widest">Kutubta &amp; Suugaanta</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2" />
                              <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Raadi buug..."
                                className="bg-slate-900 border border-slate-800 rounded-lg pl-7 pr-2 py-1 text-[11px] text-white w-28 sm:w-36 outline-none focus:border-amber-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Hero Promotion Banner in Book Shop */}
                        <motion.div 
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-blue-950/40 border border-amber-500/25 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg"
                        >
                          <div className="space-y-1 text-center sm:text-left">
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-bold uppercase tracking-wider">
                              ✨ Bestseller Collection 2026
                            </span>
                            <h5 className="text-base sm:text-lg font-black text-white">
                              Discover Somali &amp; World Classics
                            </h5>
                            <p className="text-[11px] text-slate-400 max-w-sm">
                              Ka hel buugaagta suugaanta, aqoonta casriga ah, iyo taariikhda oo leh gaarsiin degdeg ah.
                            </p>
                          </div>

                          <button 
                            onClick={() => handleAddToCart(1)}
                            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all shrink-0 active:scale-95 flex items-center gap-1.5"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Dalbo Hada ($18.99)</span>
                          </button>
                        </motion.div>

                        {/* Category Filter Chips */}
                        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                          {['All', 'Somali Classics', 'Tech & AI'].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 ${
                                selectedCategory === cat 
                                  ? 'bg-amber-500 text-slate-950 shadow-sm' 
                                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        {/* Book Catalog Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
                          {filteredBooks.map((book, idx) => (
                            <motion.div 
                              key={book.id} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.15 + idx * 0.08 }}
                              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-amber-500/40 transition-all flex flex-col justify-between group shadow-sm"
                            >
                              <div className="flex gap-3">
                                {/* Book Spine / Cover Mockup */}
                                <div className={`w-14 h-20 rounded-lg bg-gradient-to-b ${book.color} border border-white/10 flex flex-col justify-between p-1.5 shadow-md shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform`}>
                                  <span className="text-[7px] text-amber-300 font-bold uppercase">{book.tag}</span>
                                  <span className="text-[8px] font-extrabold text-white leading-tight line-clamp-2">{book.title}</span>
                                  <div className="h-0.5 w-full bg-white/20"></div>
                                </div>

                                {/* Book Details */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-bold">
                                      {book.badge}
                                    </span>
                                    <div className="flex items-center text-[10px] text-amber-400">
                                      <Star className="w-2.5 h-2.5 fill-amber-400 mr-0.5" />
                                      <span>{book.rating}</span>
                                    </div>
                                  </div>
                                  <h6 className="font-bold text-xs text-white truncate mt-1">{book.title}</h6>
                                  <p className="text-[10px] text-slate-400 truncate">{book.author}</p>
                                  <p className="text-xs font-black text-amber-400 font-mono mt-1">${book.price.toFixed(2)}</p>
                                </div>
                              </div>

                              {/* Add Button (Mock) */}
                              <button
                                onClick={() => handleAddToCart(book.id)}
                                className={`mt-2.5 w-full py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 active:scale-95 ${
                                  addedBookId === book.id 
                                    ? 'bg-emerald-500 text-slate-950 font-black' 
                                    : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200'
                                }`}
                              >
                                {addedBookId === book.id ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>Added to Cart!</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3" />
                                    <span>Ku dar Cart</span>
                                  </>
                                )}
                              </button>
                            </motion.div>
                          ))}
                        </div>

                        {/* Visual Simulation Disclaimer & FURSAD AI attribution at bottom */}
                        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                          <p>
                            Tusaale muuqda (Example simulation only • Unfunctional mock • No API)
                          </p>
                          <div className="flex items-center gap-1.5 font-sans">
                            <span className="text-slate-400">Powered by</span>
                            <FursadEmblem className="w-3.5 h-3.5" />
                            <span className="font-black text-white">FURSAD</span>
                            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400">AI</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CODE INSPECTOR MODAL */}
      <AnimatePresence>
        {isCodeModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-4xl bg-[#0b0f19] border border-blue-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="h-14 bg-slate-900 border-b border-slate-800 px-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center p-1 shadow-md shadow-blue-500/20">
                    <FursadEmblem className="w-6 h-6 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-sans">
                      <span className="font-black text-white tracking-tight">FURSAD</span>
                      <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 tracking-tight">AI</span>
                      <span className="text-slate-300 font-semibold ml-1">Source Code</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">React 18 • TypeScript • Tailwind CSS (Simulation Example)</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyCodeToClipboard}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                  <button
                    onClick={() => setIsCodeModalOpen(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 font-mono text-xs text-slate-300 bg-[#070b14] leading-relaxed">
                <pre className="overflow-x-auto">
{`// src/components/BookShopLanding.tsx
import React, { useState } from 'react';
import { ShoppingBag, Star, BookOpen, Search, Check } from 'lucide-react';

export const BookShopLanding = () => {
  const [cart, setCart] = useState(${cartCount});
  const [selectedCategory, setSelectedCategory] = useState('${selectedCategory}');
  const [searchQuery, setSearchQuery] = useState('${searchQuery}');

  const books = [
    { id: 1, title: "Aasaaska Suugaanta", author: "Hadraawi", price: 18.99, rating: 5.0 },
    { id: 2, title: "Aqoondarro waa u nacab jacayl", author: "Faarax Cawl", price: 14.50, rating: 4.9 },
    { id: 3, title: "Vibe Coding & AI Mastery", author: "FURSAD Lab", price: 29.99, rating: 5.0 },
    { id: 4, title: "Murti & Maahmaahyo", author: "Shire Jaamac", price: 16.00, rating: 4.8 }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Promotional Store Header */}
      <header className="border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-amber-400" />
          <h1 className="text-lg font-black text-white">IFTIN BOOK HOUSE</h1>
        </div>
        <button className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          <span>Cart ({cart})</span>
        </button>
      </header>

      {/* Hero Promo Section */}
      <section className="p-8 bg-gradient-to-r from-amber-950/40 to-slate-900 border-b border-slate-800 text-center sm:text-left">
        <h2 className="text-2xl font-black mb-2">Promoted Bestsellers Collection 2026</h2>
        <p className="text-slate-400 text-sm">Somali literature, poems, and modern AI development guides.</p>
      </section>

      {/* Catalog Grid */}
      <section className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {books.map(book => (
          <div key={book.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
            <div>
              <h3 className="font-bold text-white">{book.title}</h3>
              <p className="text-xs text-slate-400">{book.author}</p>
              <p className="text-amber-400 font-bold mt-2">$ {book.price.toFixed(2)}</p>
            </div>
            <button 
              onClick={() => setCart(c => c + 1)}
              className="self-end px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};`}
                </pre>
              </div>

              <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Tusaalahan koodhka waxaad si toos ah uga koobiyeysan kartaa Copy Code</span>
                <button
                  onClick={() => setIsCodeModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Xidh Daaqadda
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
