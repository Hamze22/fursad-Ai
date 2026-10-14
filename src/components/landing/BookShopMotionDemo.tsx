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
  Volume2
} from 'lucide-react';

interface BookShopMotionDemoProps {
  onStartBuilding?: () => void;
}

export const BookShopMotionDemo: React.FC<BookShopMotionDemoProps> = ({ onStartBuilding }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0); // 0 to 18 seconds
  const [viewMode, setViewMode] = useState<'motion' | 'code' | 'preview'>('motion');
  const [cartCount, setCartCount] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedBookId, setAddedBookId] = useState<number | null>(null);

  const fullPrompt = "book shop landing page with bestsellers, categories and cart";
  const [typedText, setTypedText] = useState('');

  // Video timer simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= 18) return 0; // loop motion video
        return +(prev + 0.2).toFixed(1);
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Synchronize typed prompt with current video time
  useEffect(() => {
    if (currentTime < 4) {
      const progress = currentTime / 4;
      const chars = Math.floor(progress * fullPrompt.length);
      setTypedText(fullPrompt.slice(0, chars));
    } else {
      setTypedText(fullPrompt);
    }
  }, [currentTime]);

  const books = [
    {
      id: 1,
      title: "Aasaaska Suugaanta",
      author: "Maxamed I. Hadraawi",
      category: "Somali Classics",
      price: 18.99,
      rating: 5.0,
      badge: "Bestseller",
      color: "from-amber-700 to-orange-950",
      tag: "Gabayo & Murti"
    },
    {
      id: 2,
      title: "Ignorance is the Enemy of Love",
      author: "Faarax M.J. Cawl",
      category: "Somali Classics",
      price: 14.50,
      rating: 4.9,
      badge: "Classic",
      color: "from-blue-700 to-slate-950",
      tag: "Sheeko Dhaqan"
    },
    {
      id: 3,
      title: "Vibe Coding & AI Mastery",
      author: "FURSAD AI Lab",
      category: "Tech & AI",
      price: 29.99,
      rating: 5.0,
      badge: "New Release",
      color: "from-cyan-700 to-blue-950",
      tag: "Full-Stack AI"
    },
    {
      id: 4,
      title: "Murti & Maahmaahyo Soomaali",
      author: "Shire Jaamac Axmed",
      category: "Somali Classics",
      price: 16.00,
      rating: 4.8,
      badge: "Heritage",
      color: "from-emerald-800 to-teal-950",
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
    setTimeout(() => setAddedBookId(null), 1800);
  };

  const progressPercent = Math.min(100, Math.round((currentTime / 18) * 100));

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl bg-slate-950 border border-blue-500/30 shadow-[0_0_60px_rgba(37,99,235,0.2)] overflow-hidden flex flex-col text-left">
      {/* Motion Video Bar Controls */}
      <div className="h-12 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between gap-3 text-xs font-mono">
        {/* Left: Window Dots & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
          </div>
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-slate-300">
            <span className="flex items-center gap-1.5 text-blue-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Motion Video AI Demo
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-[11px] text-slate-400 truncate">
              prompt: &quot;book shop landing page&quot;
            </span>
          </div>
        </div>

        {/* Center: Video Mode Switcher */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5">
          <button
            onClick={() => setViewMode('motion')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
              viewMode === 'motion' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3 h-3" />
            <span>Split Demo</span>
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
              viewMode === 'code' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span className="hidden xs:inline">Code</span>
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
              viewMode === 'preview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span className="hidden xs:inline">Live Preview</span>
          </button>
        </div>

        {/* Right: Video Playback controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 transition-colors"
            title={isPlaying ? "Pause Video" : "Play Video"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              setCurrentTime(0);
              setIsPlaying(true);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Restart Motion Video"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
            00:{Math.floor(currentTime).toString().padStart(2, '0')} / 00:18
          </span>
        </div>
      </div>

      {/* Video Progress Scrubber Bar */}
      <div className="h-1 w-full bg-slate-900 relative">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-200" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Video Stage */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col gap-4 bg-[#020617] min-h-[500px] lg:min-h-[560px]">
        {/* Step 1 Prompt Box (Always visible at the top as the driving input) */}
        <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Chat Prompt</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 font-mono">Gemini 2.5 Flash</span>
              </div>
              <div className="font-mono text-xs sm:text-sm text-slate-200 truncate flex items-center mt-0.5">
                <span className="text-blue-400 mr-1.5">&gt;</span>
                <span className="text-white font-semibold">{typedText}</span>
                {currentTime < 4 && isPlaying && (
                  <span className="w-2 h-4 bg-blue-400 ml-1 inline-block animate-pulse"></span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {currentTime >= 4 ? (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>Generated &amp; Live</span>
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-xl bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <Cpu className="w-3.5 h-3.5" />
                <span>AI Typing Prompt...</span>
              </span>
            )}

            {onStartBuilding && (
              <button
                onClick={onStartBuilding}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 active:scale-95"
              >
                <span>Try This Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Interim Build Progress Notification if currentTime is between 4 and 6 */}
        {currentTime >= 4 && currentTime < 7 && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl text-xs text-blue-300 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              <span className="font-bold">AI Preliminary Engine:</span>
              <span className="text-slate-300">Styling working... Rendering Tailwind cards, typography, cart state</span>
            </div>
            <span className="text-[10px] font-mono text-blue-400">920ms</span>
          </motion.div>
        )}

        {/* Center Split Screen / Code / Live Preview Display */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[380px]">
          {/* CODE EDITOR SIDE (visible in motion split or code view) */}
          {(viewMode === 'motion' || viewMode === 'code') && (
            <div className={`${viewMode === 'code' ? 'lg:col-span-12' : 'lg:col-span-5'} bg-[#0f172a] rounded-2xl border border-slate-800 p-4 font-mono text-xs flex flex-col overflow-hidden shadow-inner`}>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-white font-bold">src/BookShopLanding.tsx</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">TSX / Tailwind</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 text-slate-400 text-[11px] leading-relaxed select-none">
                <p><span className="text-purple-400">import</span> React, &#123; useState &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">&apos;react&apos;</span>;</p>
                <p><span className="text-purple-400">import</span> &#123; ShoppingBag, Star, BookOpen &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">&apos;lucide-react&apos;</span>;</p>
                <br />
                <p><span className="text-blue-400">export default function</span> <span className="text-amber-300">BookShopLanding</span>() &#123;</p>
                <p className="pl-4"><span className="text-blue-400">const</span> [cart, setCart] = <span className="text-amber-400">useState</span>([{cartCount}]);</p>
                <p className="pl-4"><span className="text-blue-400">const</span> bestsellers = [</p>
                <p className="pl-8 text-emerald-300">&#123; title: <span className="text-emerald-400">&quot;Aasaaska Suugaanta&quot;</span>, price: <span className="text-orange-400">18.99</span> &#125;,</p>
                <p className="pl-8 text-emerald-300">&#123; title: <span className="text-emerald-400">&quot;Ignorance is Enemy of Love&quot;</span>, price: <span className="text-orange-400">14.50</span> &#125;</p>
                <p className="pl-4">];</p>
                <br />
                <p className="pl-4"><span className="text-purple-400">return</span> (</p>
                <p className="pl-8 text-slate-300">&lt;<span className="text-cyan-400">div</span> <span className="text-amber-400">className</span>=<span className="text-emerald-400">&quot;min-h-screen bg-slate-950 font-sans&quot;</span>&gt;</p>
                <p className="pl-12 text-slate-300">&lt;<span className="text-cyan-400">BookNavbar</span> <span className="text-amber-400">cartCount</span>=&#123;cart.length&#125; /&gt;</p>
                <p className="pl-12 text-slate-300">&lt;<span className="text-cyan-400">BestsellerGrid</span> <span className="text-amber-400">items</span>=&#123;bestsellers&#125; /&gt;</p>
                <p className="pl-8 text-slate-300">&lt;/<span className="text-cyan-400">div</span>&gt;</p>
                <p className="pl-4">);</p>
                <p>&#125;</p>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                <span>Auto-saved via FURSAD AI</span>
                <span className="text-emerald-400 font-bold">● Compiled (0 errors)</span>
              </div>
            </div>
          )}

          {/* LIVE BOOK SHOP PREVIEW SIDE */}
          {(viewMode === 'motion' || viewMode === 'preview') && (
            <div className={`${viewMode === 'preview' ? 'lg:col-span-12' : 'lg:col-span-7'} bg-[#020617] rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl relative`}>
              {/* Mock Browser Header */}
              <div className="h-9 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                  <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                  <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                </div>
                <div className="bg-slate-950 px-3 py-0.5 rounded text-[10px] font-mono text-slate-400 border border-slate-800">
                  https://iftin-books.local
                </div>
                <div className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Active Sandbox</span>
                </div>
              </div>

              {/* Book Shop Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-slate-950 text-white font-sans space-y-5">
                {/* Book Shop Store Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
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
                    <button className="relative p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-white transition-all">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Hero Banner in Book Shop */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-blue-950/40 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all shrink-0 active:scale-95"
                  >
                    Dalbo Hada ($18.99)
                  </button>
                </div>

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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredBooks.map((book) => (
                    <div 
                      key={book.id} 
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
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

                      {/* Add Button */}
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
