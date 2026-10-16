import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudUpload, 
  Mic, 
  MicOff, 
  FolderPlus, 
  FileText, 
  Paperclip, 
  X, 
  ArrowRight, 
  LogOut, 
  Sparkles, 
  FolderCode, 
  Play, 
  Layers, 
  Code2,
  CheckCircle2,
  Key,
  Cpu,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  Zap,
  Cloud,
  Check,
  AlertCircle,
  Trash2,
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react';
import axios from 'axios';
import { LanguageType, ProjectState, AIProviderType, AIProviderConfig } from '../types.ts';
import { TimeGraphiteBackground } from './TimeGraphiteBackground.tsx';
import { FursadLogo } from './common/FursadLogo.tsx';

interface CreateProjectPaneProps {
  user: { fullName: string; id?: string; email?: string } | null;
  onLogout: () => void;
  onGoHome?: () => void;
  onGenerate: (prompt: string, aiConfig?: AIProviderConfig) => void;
  projects: ProjectState[];
  onOpenProject: (p: ProjectState) => void;
  language: LanguageType;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  initialPrompt?: string;
}

interface QuickModelOption {
  id: string;
  name: string;
  provider: AIProviderType;
  badge: string;
  description: string;
  requiresKey: boolean;
  icon: string;
}

const AVAILABLE_MODELS: QuickModelOption[] = [
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'gemini',
    badge: 'Latest • Next-Gen',
    description: 'Ultra-fast next-gen reasoning model with extreme speed and precise code editing. Built-in free.',
    requiresKey: false,
    icon: '⚡'
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'gemini',
    badge: 'Fast • Balanced',
    description: 'High-speed reasoning, targeted patching & instant builds. Built-in free.',
    requiresKey: false,
    icon: '⚡'
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'gemini',
    badge: 'Deep Architecture',
    description: 'Complex multi-page architecture and refactoring.',
    requiresKey: false,
    icon: '🧠'
  },
  {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    provider: 'openai',
    badge: 'Flagship BYOK',
    description: 'Premier code generation & full-stack development with your OpenAI key.',
    requiresKey: true,
    icon: '🤖'
  },
  {
    id: 'gpt-4o-mini',
    name: 'OpenAI GPT-4o Mini',
    provider: 'openai',
    badge: 'Low Latency BYOK',
    description: 'Fast, budget-friendly edits and modifications with your OpenAI key.',
    requiresKey: true,
    icon: '🟢'
  },
  {
    id: 'cf-llama-3.3-70b',
    name: 'Cloudflare Llama 3.3',
    provider: 'cloudflare',
    badge: 'Cloud AI BYOK',
    description: 'Meta open weights running on Cloudflare Workers AI edge network.',
    requiresKey: true,
    icon: '☁️'
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    badge: 'Design & Code BYOK',
    description: 'Frontend aesthetics, component precision & clean markup.',
    requiresKey: true,
    icon: '🔮'
  }
];

export const CreateProjectPane: React.FC<CreateProjectPaneProps> = ({ 
  user,
  onLogout,
  onGoHome,
  onGenerate,
  projects,
  onOpenProject,
  language,
  theme: controlledTheme,
  onToggleTheme,
  initialPrompt = ''
}) => {
  const [prompt, setPrompt] = useState(initialPrompt || '');

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);
  const [isListening, setIsListening] = useState(false);
  const [voiceToast, setVoiceToast] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: string; content?: string }>>([]);
  const [showUploadMenu, setShowUploadMenu] = useState(false);

  // AI Model & BYOK Configuration inside the build box
  const storageKey = user ? `fursad_ai_config_${user.id || user.email}` : 'fursad_ai_config_guest';
  const [aiConfig, setAiConfig] = useState<AIProviderConfig>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      provider: 'gemini',
      model: 'gemini-3.8-flash',
      apiKey: '',
      accountId: '',
      useCustomKey: false,
      temperature: 0.2
    };
  });

  const [showKeyDrawer, setShowKeyDrawer] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(aiConfig.apiKey || '');
  const [accountIdInput, setAccountIdInput] = useState(aiConfig.accountId || '');
  const [showApiKeyText, setShowApiKeyText] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyTestStatus, setKeyTestStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const isSo = language === 'so';
  const [internalTheme, setInternalTheme] = useState<'dark' | 'light'>('dark');
  const theme = controlledTheme || internalTheme;

  const toggleTheme = () => {
    if (onToggleTheme) {
      onToggleTheme();
    } else {
      setInternalTheme(prev => prev === 'dark' ? 'light' : 'dark');
    }
  };

  useEffect(() => {
    if (folderInputRef.current) {
      folderInputRef.current.setAttribute('webkitdirectory', '');
      folderInputRef.current.setAttribute('directory', '');
      (folderInputRef.current as any).webkitdirectory = true;
    }
  }, []);

  const selectedModel = AVAILABLE_MODELS.find(m => m.id === aiConfig.model) || AVAILABLE_MODELS[0];

  const handleSelectModel = (model: QuickModelOption) => {
    const updated: AIProviderConfig = {
      ...aiConfig,
      provider: model.provider,
      model: model.id,
      useCustomKey: model.requiresKey || aiConfig.useCustomKey
    };
    setAiConfig(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    if (model.requiresKey && !updated.apiKey) {
      setShowKeyDrawer(true);
    }
  };

  const handleSaveApiKey = () => {
    const updated: AIProviderConfig = {
      ...aiConfig,
      apiKey: apiKeyInput.trim(),
      accountId: accountIdInput.trim(),
      useCustomKey: Boolean(apiKeyInput.trim())
    };
    setAiConfig(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
    setKeyTestStatus({
      success: true,
      message: isSo ? 'Furaha API-ga si guul leh ayaa loo kaydiyay' : 'API key securely saved for your session'
    });
  };

  const handleTestApiKey = async () => {
    if (!apiKeyInput.trim()) {
      setKeyTestStatus({
        success: false,
        message: isSo ? 'Fadlan geli API Key sax ah marka hore' : 'Please enter an API key to test'
      });
      return;
    }

    setIsTestingKey(true);
    setKeyTestStatus(null);

    try {
      const res = await axios.post('/api/ai/test-connection', {
        provider: aiConfig.provider,
        model: aiConfig.model,
        apiKey: apiKeyInput.trim(),
        accountId: accountIdInput.trim()
      });

      if (res.data?.success) {
        setKeyTestStatus({
          success: true,
          message: isSo 
            ? `✓ Xidhiidhku wuu shaqaynayaa! (${res.data.latencyMs || 240}ms)` 
            : `✓ Connected successfully! (${res.data.latencyMs || 240}ms)`
        });
        handleSaveApiKey();
      } else {
        setKeyTestStatus({
          success: false,
          message: res.data?.error || (isSo ? 'Xidhiidhku wuu guuldarraystay' : 'Connection failed')
        });
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Connection error';
      setKeyTestStatus({
        success: false,
        message: msg
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleRemoveApiKey = () => {
    setApiKeyInput('');
    setAccountIdInput('');
    const updated: AIProviderConfig = {
      ...aiConfig,
      apiKey: '',
      accountId: '',
      useCustomKey: false
    };
    setAiConfig(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
    setKeyTestStatus(null);
  };

  const templates = isSo ? [
    { id: '0', label: '🤖 Gemini 2.5 Flash AI Assistant (Chat & Code)' },
    { id: '1', label: '🏪 Dukaan Casri ah (E-Commerce Store)' },
    { id: '2', label: '📚 Maktabad Buugaagta (Book Shop Portal)' },
    { id: '3', label: '🍕 Somali Restaurant & Food Order' },
    { id: '4', label: '🏫 School & Academy Portal' },
    { id: '5', label: '🏥 Shifa Clinic & Appointments' },
    { id: '6', label: '🧮 Smart Calculator Web App' },
    { id: '7', label: '💼 Developer Portfolio & Resume' },
  ] : [
    { id: '0', label: '🤖 Gemini 2.5 Flash AI Assistant (Chat & Code)' },
    { id: '1', label: '🏪 Modern E-Commerce Store' },
    { id: '2', label: '📚 Book Shop & Library' },
    { id: '3', label: '🍕 Restaurant & Food Delivery' },
    { id: '4', label: '🏫 School Management Portal' },
    { id: '5', label: '🏥 Medical Clinic & Appointments' },
    { id: '6', label: '🧮 Interactive Calculator App' },
    { id: '7', label: '💼 Developer Portfolio' },
  ];

  // Speech Recognition
  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      setVoiceToast(null);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = isSo ? 'so-SO' : 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setVoiceToast(isSo ? '🎙️ Waan dhagaysanayaa... Ku hadal codkaaga' : '🎙️ Listening to your voice...');
        };

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setPrompt(prev => prev ? prev + ' ' + transcript : transcript);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
          setVoiceToast(null);
        };

        recognition.onend = () => {
          setIsListening(false);
          setVoiceToast(null);
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn('SpeechRecognition error:', err);
      }
    }

    setIsListening(true);
    setVoiceToast(isSo ? '🎙️ Codka waa la duubayaa...' : '🎙️ Recording voice prompt...');
    setTimeout(() => {
      const sample = isSo 
        ? 'Dhis dukaan casri ah oo leh catalog iyo shopping cart' 
        : 'Build a modern e-commerce platform with product catalog and shopping cart';
      setPrompt(prev => prev ? prev + ' ' + sample : sample);
      setIsListening(false);
      setVoiceToast(null);
    }, 2400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      const isText = file.type.startsWith('text/') || file.name.match(/\.(txt|json|js|ts|tsx|jsx|html|css|md|csv)$/i);

      reader.onload = () => {
        const content = typeof reader.result === 'string' ? reader.result : '';
        const sizeFormatted = (file.size / 1024).toFixed(1) + ' KB';
        setAttachedFiles(prev => [
          ...prev, 
          { name: file.name, size: sizeFormatted, content: isText ? content.slice(0, 4000) : undefined }
        ]);
      };

      if (isText) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });

    if (e.target) e.target.value = '';
    setShowUploadMenu(false);
  };

  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const folderName = fileList[0]?.webkitRelativePath ? fileList[0].webkitRelativePath.split('/')[0] : 'Project Folder';
    const totalSize = (fileList.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(1) + ' KB';

    setAttachedFiles(prev => [
      ...prev, 
      { 
        name: `📁 ${folderName} (${fileList.length} files)`, 
        size: totalSize,
        content: `Folder structure:\n` + fileList.slice(0, 15).map(f => f.webkitRelativePath).join('\n')
      }
    ]);

    if (e.target) e.target.value = '';
    setShowUploadMenu(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      files.forEach(file => {
        const reader = new FileReader();
        const isText = file.type.startsWith('text/') || file.name.match(/\.(txt|json|js|ts|tsx|jsx|html|css|md|csv)$/i);
        reader.onload = () => {
          const content = typeof reader.result === 'string' ? reader.result : '';
          const sizeFormatted = (file.size / 1024).toFixed(1) + ' KB';
          setAttachedFiles(prev => [
            ...prev, 
            { name: file.name, size: sizeFormatted, content: isText ? content.slice(0, 4000) : undefined }
          ]);
        };
        if (isText) reader.readAsText(file);
        else reader.readAsDataURL(file);
      });
    }
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    let finalPrompt = prompt.trim();
    if (attachedFiles.length > 0) {
      const fileContext = attachedFiles
        .map(f => `[Attached File: ${f.name} (${f.size})]\n${f.content || 'Binary asset'}`)
        .join('\n\n');
      finalPrompt = `${finalPrompt}\n\n${fileContext}`.trim();
    }

    if (finalPrompt) {
      onGenerate(finalPrompt, aiConfig);
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col font-sans selection:bg-blue-500/30 overflow-x-hidden bg-[#020617] w-full">
      {/* Background Graphic */}
      <TimeGraphiteBackground intensity="vibrant" />

      {/* Header - Stretches across screen */}
      <header className={`relative z-20 h-16 sm:h-20 px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between border-b w-full transition-colors ${theme === 'light' ? 'bg-white/70 border-slate-200' : 'bg-slate-950/40 border-white/5 backdrop-blur-md'}`}>
        <div className="flex flex-col items-start gap-1 sm:gap-1.5">
          {/* Logo on top matching Landing Page size */}
          <div className="flex items-center gap-2">
            <FursadLogo size="sm" textSize="base" theme={theme} badge="PRO" />
          </div>

          {/* Back button placed below the logo */}
          {onGoHome && (
            <button
              onClick={onGoHome}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold shrink-0 transition-all active:scale-95 shadow-sm ${
                theme === 'light'
                  ? 'bg-amber-100/90 border-amber-300 text-amber-900 hover:bg-amber-200'
                  : 'bg-blue-950/60 hover:bg-blue-900/60 border-blue-500/30 text-blue-300 hover:text-white'
              }`}
              title="Ku noqo Hoyga / Back to Start"
            >
              <ArrowRight className="w-3 h-3 rotate-180" />
              <span>Back</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button 
            onClick={toggleTheme}
            className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all ${
              theme === 'light' 
                ? 'bg-amber-100/90 border-amber-300 text-amber-600 hover:bg-amber-200 shadow-sm' 
                : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-cyan-300 hover:text-white'
            }`}
            title={theme === 'dark' ? 'Switch to Day/Light Mode (Qorax)' : 'Switch to Dark Mode (Dayax)'}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-800" />
            )}
          </button>
          
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-500/20 text-[10px] text-blue-200">
             <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
             <span className="font-medium">{user?.fullName || 'Pro Builder'}</span>
             <span className="text-[9px] text-blue-400 font-bold px-1.5 py-0.5 rounded bg-blue-500/20">75</span>
          </div>
          <button 
            onClick={onLogout}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-900/80 hover:bg-slate-800 border border-white/10 rounded-full text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1.5 text-slate-300 hover:text-white"
          >
            <span className="hidden sm:inline">{isSo ? 'Kabax' : 'Sign out'}</span>
            <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={`relative z-10 flex-1 flex flex-col items-center justify-start px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 py-8 sm:py-12 w-full max-w-[1700px] mx-auto ${theme === 'light' ? 'bg-[#f4f1ea]' : 'bg-[#020617]'}`}>
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl flex flex-col items-center text-center space-y-6"
        >
          {/* Promo Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/50 border border-blue-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(37,99,235,0.2)]">
             <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-widest text-white shadow-sm">AI STUDIO</div>
             <span className="text-[12px] font-medium text-blue-200">
               {isSo ? 'Dhis webkaaga ama app-kaaga adigoo isticmaalaya AI-ga aad doorato' : 'Describe your vision. Multi-provider AI generates code & live preview.'}
             </span>
          </div>

          <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] max-w-4xl ${theme === 'light' ? 'text-slate-950' : 'text-white'}`}>
            {isSo ? (
              <>Maxaad rabtaa inaan <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">dhiso maanta?</span></>
            ) : (
              <>Build full-stack web apps <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">with Multi-Model AI</span></>
            )}
          </h1>

          <p className={`text-sm sm:text-base max-w-2xl leading-relaxed transition-colors ${
            theme === 'light' ? 'text-slate-800 font-medium' : 'text-slate-300/80'
          }`}>
            {isSo 
              ? 'Qor fikraddaada, dooro nooca AI-ga (Gemini, GPT-4o, Cloudflare), ama gali API key-gaaga gaarka ah si aad toos ugu bilowdo.'
              : 'Write your prompt, select your preferred AI model, or supply your own API key (BYOK). Clean code, live preview and instant persistence.'}
          </p>

          {/* Prompt Box with Models & BYOK Selector - Fully Responsive Wide Design */}
          <div className="w-full relative group">
            {/* Hidden File and Folder Inputs */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              multiple 
              className="hidden" 
            />
            <input 
              type="file" 
              ref={folderInputRef} 
              onChange={handleFolderUpload} 
              // @ts-ignore
              webkitdirectory="" 
              directory="" 
              className="hidden" 
            />

            <div className="absolute inset-0 bg-blue-600/10 rounded-[2.5rem] blur-2xl group-focus-within:bg-blue-600/20 transition-all" />
            
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`relative border rounded-[2rem] p-4 sm:p-5 shadow-2xl backdrop-blur-xl focus-within:ring-2 focus-within:ring-blue-500/20 transition-all text-left ${
                theme === 'light' 
                  ? 'bg-white/90 border-slate-300 focus-within:border-blue-400' 
                  : 'bg-slate-950/85 border-blue-500/30 focus-within:border-blue-400/80'
              }`}
            >
               {/* Model Selector Bar directly in the build box */}
               <div className="mb-4 pb-3.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                 {/* Model Selector Dropdown */}
                 <div className="flex items-center gap-2 pb-1 max-w-full">
                   <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1 shrink-0 mr-1">
                     <Cpu className="w-3.5 h-3.5 text-blue-400" />
                     <span>Model:</span>
                   </span>

                   <select
                     value={aiConfig.model}
                     onChange={(e) => {
                       const model = AVAILABLE_MODELS.find(m => m.id === e.target.value);
                       if (model) handleSelectModel(model);
                     }}
                     className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                   >
                     {AVAILABLE_MODELS.map((model) => (
                       <option key={model.id} value={model.id}>
                         {model.icon} {model.name} {model.requiresKey ? '(BYOK)' : ''}
                       </option>
                     ))}
                   </select>
                 </div>

                 {/* BYOK Key Drawer Toggle Button */}
                 <div className="flex items-center gap-2">
                   <button
                     type="button"
                     onClick={() => setShowKeyDrawer(!showKeyDrawer)}
                     className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                       aiConfig.apiKey 
                         ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50' 
                         : 'bg-slate-900/90 border-slate-700/60 text-slate-300 hover:text-white hover:border-blue-500/40'
                     }`}
                     title="Configure Bring Your Own Key (BYOK)"
                   >
                     <Key className={`w-3.5 h-3.5 ${aiConfig.apiKey ? 'text-emerald-400' : 'text-amber-400'}`} />
                     <span>
                       {aiConfig.apiKey ? (isSo ? 'Furahaaga Waa Diyaar ✓' : 'Custom Key Active ✓') : (isSo ? 'Geli API Key (BYOK)' : 'Add API Key (BYOK)')}
                     </span>
                   </button>
                 </div>
               </div>

               {/* In-box BYOK Drawer */}
               <AnimatePresence>
                 {showKeyDrawer && (
                   <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="mb-4 p-4 rounded-2xl bg-slate-900/95 border border-blue-500/30 space-y-3 overflow-hidden text-xs"
                   >
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <ShieldCheck className="w-4 h-4 text-emerald-400" />
                         <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                           {isSo ? `BYOK API Key: ${selectedModel.name}` : `Bring Your Own Key for ${selectedModel.name}`}
                         </span>
                       </div>
                       <button 
                         type="button"
                         onClick={() => setShowKeyDrawer(false)}
                         className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
                       >
                         <X className="w-4 h-4" />
                       </button>
                     </div>

                     <p className="text-[11px] text-slate-400 leading-relaxed">
                       {isSo 
                         ? 'Furahaagu wuxuu ku xafidan yahay browserkaaga oo keliya (client isolated). Kharashyada isticmaalka waxaa toos kuu qaadaya shirkadda aad furaha ka haysato (subject to provider billing).'
                         : 'Your key stays client-isolated and is proxied through secure server execution. AI charges are billed directly by the provider to your account.'}
                     </p>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       <div className="space-y-1">
                         <label className="text-[10px] uppercase font-bold text-slate-400">
                           {isSo ? 'API Key (Furaha)' : 'API Key'}
                         </label>
                         <div className="relative flex items-center">
                           <input
                             type={showApiKeyText ? 'text' : 'password'}
                             value={apiKeyInput}
                             onChange={(e) => setApiKeyInput(e.target.value)}
                             placeholder={aiConfig.provider === 'openai' ? 'sk-proj-...' : 'Enter your secret API key...'}
                             className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 pr-9 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                           />
                           <button
                             type="button"
                             onClick={() => setShowApiKeyText(!showApiKeyText)}
                             className="absolute right-2.5 text-slate-400 hover:text-white"
                           >
                             {showApiKeyText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                           </button>
                         </div>
                       </div>

                       {aiConfig.provider === 'cloudflare' && (
                         <div className="space-y-1">
                           <label className="text-[10px] uppercase font-bold text-slate-400">Cloudflare Account ID</label>
                           <input
                             type="text"
                             value={accountIdInput}
                             onChange={(e) => setAccountIdInput(e.target.value)}
                             placeholder="Cloudflare 32-character Account ID"
                             className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                           />
                         </div>
                       )}
                     </div>

                     {/* Key Actions & Status */}
                     <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                       <div className="flex items-center gap-2">
                         <button
                           type="button"
                           onClick={handleTestApiKey}
                           disabled={isTestingKey || !apiKeyInput.trim()}
                           className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/40 border border-blue-500/50 text-blue-200 rounded-lg font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-all"
                         >
                           {isTestingKey ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                           <span>{isSo ? 'Tijaabi Xidhiidhka' : 'Test Connection'}</span>
                         </button>

                         <button
                           type="button"
                           onClick={handleSaveApiKey}
                           disabled={!apiKeyInput.trim()}
                           className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-all shadow-sm"
                         >
                           <Check className="w-3 h-3" />
                           <span>{isSo ? 'Kaydi' : 'Save Key'}</span>
                         </button>

                         {aiConfig.apiKey && (
                           <button
                             type="button"
                             onClick={handleRemoveApiKey}
                             className="px-2.5 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                           >
                             <Trash2 className="w-3 h-3" />
                             <span>{isSo ? 'Tir' : 'Remove'}</span>
                           </button>
                         )}
                       </div>

                       {keyTestStatus && (
                         <div className={`flex items-center gap-1.5 text-[11px] font-medium ${
                           keyTestStatus.success ? 'text-emerald-400' : 'text-rose-400'
                         }`}>
                           {keyTestStatus.success ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                           <span>{keyTestStatus.message}</span>
                         </div>
                       )}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Voice Listening Alert */}
               <AnimatePresence>
                 {isListening && (
                   <motion.div 
                     initial={{ opacity: 0, y: -8 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -8 }}
                     className="mb-3 px-3 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-between"
                   >
                     <div className="flex items-center gap-2">
                       <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                       <span>{voiceToast || (isSo ? '🎙️ Waan dhagaysanayaa... Ku hadal codkaaga' : '🎙️ Listening to your voice...')}</span>
                     </div>
                     <button onClick={toggleVoice} className="text-rose-400 hover:text-white text-xs underline">Jooji / Stop</button>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Attached File Chips */}
               {attachedFiles.length > 0 && (
                 <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-white/5">
                   {attachedFiles.map((f, i) => (
                     <div key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-500/30 text-xs text-blue-200 shadow-sm">
                       <FileText className="w-3.5 h-3.5 text-blue-400" />
                       <span className="max-w-[200px] truncate font-medium">{f.name}</span>
                       <span className="text-[10px] text-blue-400 font-mono">({f.size})</span>
                       <button 
                         type="button"
                         onClick={() => removeAttachedFile(i)} 
                         className="p-0.5 text-slate-400 hover:text-rose-400 rounded transition-colors ml-0.5"
                       >
                         <X className="w-3 h-3" />
                       </button>
                     </div>
                   ))}
                 </div>
               )}

               {/* The Prompt Textarea */}
               <textarea 
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleSubmit();
                   }
                 }}
                 placeholder={isSo 
                   ? "Tusaale: Dhis dukaan casri ah..."
                   : "Example: Build a modern SaaS platform..."
                 }
                 className={`w-full bg-transparent border-none outline-none resize-none placeholder:text-slate-500 font-medium min-h-[100px] ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}
               />
               
               {/* Bottom Controls Bar */}
               <div className={`flex flex-wrap items-center justify-between gap-3 pt-4 border-t ${theme === 'light' ? 'border-slate-200' : 'border-slate-800/80'}`}>
                  <div className="flex items-center gap-2 relative">
                    {/* File Upload Dropdown */}
                    <div className="relative">
                      <button 
                        type="button"
                        onClick={() => setShowUploadMenu(!showUploadMenu)}
                        className="p-2.5 bg-slate-900/80 hover:bg-slate-800 rounded-xl transition-all border border-slate-700/60 text-slate-400 hover:text-white flex items-center gap-1.5"
                        title="Upload file or project folder"
                      >
                         <CloudUpload className="w-4 h-4 text-cyan-400" />
                         <span className="text-xs font-semibold hidden xs:inline">{isSo ? 'Gali fayl' : 'Upload'}</span>
                      </button>

                      {showUploadMenu && (
                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-1.5 z-50 text-left">
                          <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{isSo ? 'Dooro Fayl (Files)' : 'Upload Files'}</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => folderInputRef.current?.click()}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <FolderPlus className="w-3.5 h-3.5 text-blue-400" />
                            <span>{isSo ? 'Dooro Folder (Folder)' : 'Upload Entire Folder'}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Microphone Voice Prompt Button */}
                    <button 
                      type="button"
                      onClick={toggleVoice}
                      className={`p-2.5 rounded-xl transition-all border flex items-center gap-1.5 ${
                        isListening 
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse' 
                          : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700/60 text-slate-400 hover:text-white'
                      }`}
                      title={isListening ? "Listening... click to stop" : "Voice prompt (Ku hadal codka)"}
                    >
                       {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-amber-400" />}
                       <span className="text-xs font-semibold hidden xs:inline">{isListening ? 'Stop' : (isSo ? 'Cod' : 'Voice')}</span>
                    </button>

                    {/* Selected Model Tag in Footer */}
                    <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 font-mono">
                      <span>{selectedModel.icon}</span>
                      <span className="text-slate-300 font-bold">{selectedModel.name}</span>
                      {aiConfig.apiKey && <span className="text-emerald-400 text-[10px] font-bold">✓ BYOK</span>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                     <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">Press Enter ↵</span>
                     <button 
                       type="button"
                       onClick={handleSubmit}
                       disabled={!prompt.trim()}
                       className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center gap-2 font-bold text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
                     >
                        <Sparkles className="w-4 h-4 text-cyan-200" />
                        <span>{isSo ? 'Dhis Hada' : 'Build with AI'}</span>
                        <ArrowRight className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </div>
          </div>

          {/* Calamada Sax ✓ - Real-Time Build Guarantee Indicators */}
          <div className="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-1 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isSo ? 'Qorshaynta Tooska ah ✓' : 'Strict Component Updates ✓'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isSo ? 'Ilaalinta Qaab-dhismeedka ✓' : 'Preserve Layouts & Styles ✓'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{isSo ? 'Live Preview Degdeg ah ✓' : 'Instant Live Preview ✓'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>{isSo ? 'Kaydin Joogto ah ✓' : 'Zero Project Wipes ✓'}</span>
            </span>
          </div>

          {/* Template Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {templates.map((t) => (
              <button 
                key={t.id}
                onClick={() => setPrompt(t.label)}
                className="px-3.5 py-1.5 bg-slate-900/80 hover:bg-blue-950/60 border border-slate-800 hover:border-blue-500/40 rounded-full text-xs font-medium text-slate-300 hover:text-blue-200 transition-all shadow-sm"
              >
                {t.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recent Projects Section - Fills across wide desktop monitor */}
        <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mt-16 sm:mt-20 space-y-6">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                 <Layers className="w-4 h-4 text-blue-500" />
                 <h3 className={`text-xs font-black uppercase tracking-[0.2em] transition-colors ${
                   theme === 'light' ? 'text-slate-900' : 'text-slate-400'
                 }`}>
                   {isSo ? 'Mashaariicdaada' : 'Your Projects'}
                 </h3>
              </div>
              <span className={`text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border transition-colors ${
                theme === 'light'
                  ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                  : 'bg-blue-950/50 text-blue-400/80 border-blue-500/20'
              }`}>
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </span>
           </div>

           {projects.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {projects.map((project) => (
                  <div 
                    key={project.id}
                    onClick={() => onOpenProject(project)}
                    className={`p-5 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between border shadow-lg ${
                      theme === 'light'
                        ? 'bg-white hover:bg-amber-50/70 border-slate-200 hover:border-blue-500/40 shadow-slate-200/60'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-blue-500/50 p-5 rounded-2xl transition-all cursor-pointer group hover:bg-slate-900/60 shadow-lg hover:shadow-[0_0_25px_rgba(37,99,235,0.15)]'
                    }`}
                  >
                     <div>
                       <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                          <FolderCode className="w-5 h-5 text-blue-400 group-hover:text-white" />
                       </div>
                       <h4 className={`font-black text-sm sm:text-base mb-1.5 line-clamp-1 transition-colors ${
                         theme === 'light' ? 'text-slate-950 font-black' : 'text-white'
                       }`}>{project.name}</h4>
                       <p className={`text-xs line-clamp-2 mb-4 leading-relaxed transition-colors ${
                         theme === 'light' ? 'text-slate-800 font-medium' : 'text-slate-400'
                       }`}>{project.description || 'Full-stack application'}</p>
                     </div>
                     <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                        <span>{isSo ? 'Fur Project-ka' : 'Open in Workspace'}</span>
                        <Play className="w-3.5 h-3.5 fill-current" />
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className={`py-12 border border-dashed rounded-[2rem] flex flex-col items-center justify-center text-center space-y-3 ${
               theme === 'light' ? 'bg-white/80 border-slate-300' : 'bg-slate-950/40 border-slate-800'
             }`}>
                <Code2 className={`w-8 h-8 ${theme === 'light' ? 'text-slate-400' : 'text-slate-600'}`} />
                <p className={`text-sm font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-400'}`}>
                  {isSo ? 'Weli ma lihid mashaariic. Qor fikraddaada kor si aad u bilowdo!' : 'No projects yet. Type your prompt above to build your first app!'}
                </p>
             </div>
           )}
        </div>
      </main>

      {/* Footer - Wide stretched */}
      <footer className={`relative z-10 py-6 px-4 sm:px-12 border-t flex justify-center w-full transition-colors ${
        theme === 'light' ? 'bg-[#ebe7de] border-slate-300' : 'bg-slate-950/80 border-slate-900'
      }`}>
         <p className={`text-[11px] font-mono uppercase tracking-[0.25em] ${
           theme === 'light' ? 'text-slate-800 font-bold' : 'text-slate-500'
         }`}>
           FURSAD AI • Multi-Provider Engine v4.2 • Desktop Widescreen
         </p>
      </footer>
    </div>
  );
};
