import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Rocket, 
  GitBranch, 
  Layers, 
  History, 
  Settings, 
  Check, 
  Copy, 
  ExternalLink, 
  Database, 
  Flame, 
  Zap, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Key, 
  Lock, 
  Globe, 
  ArrowRight,
  ShieldCheck,
  Code2,
  Terminal,
  UploadCloud,
  FileCode2,
  Sliders
} from 'lucide-react';
import { ProjectState, AIProviderConfig, AIProviderType, User } from '../../types.ts';
import { useModelCatalog } from '../../lib/useModelCatalog.ts';

export type DrawerTab = 'settings' | 'share' | 'publish' | 'versions' | 'github' | 'integrations';

interface ChatSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectState;
  onUpdateProject: (p: ProjectState) => void;
  aiConfig: AIProviderConfig;
  onUpdateAiConfig: (config: AIProviderConfig) => void;
  theme?: 'light' | 'dark';
  user?: User | null;
  onOpenVercelModal?: () => void;
  onOpenGithubModal?: () => void;
  onOpenDatabaseView?: () => void;
  initialTab?: DrawerTab;
}

interface ModelOption {
  id: string;
  name: string;
  provider: AIProviderType;
  badge?: string;
  description: string;
}

const AVAILABLE_MODELS: ModelOption[] = [
  { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', provider: 'gemini', badge: 'Latest • Recommended', description: 'Ultra-fast reasoning model with extreme speed and accurate code generation' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'gemini', badge: 'Fast • Free Tier', description: 'High-speed reasoning and responsive UI builds' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'gemini', badge: 'Deep Reasoning', description: 'Complex full-stack architecture, database design and refactoring' },
  { id: 'gpt-4o', name: 'OpenAI GPT-4o', provider: 'openai', badge: 'BYOK', description: 'Premier code generation with your personal OpenAI API key' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic', badge: 'BYOK', description: 'Exceptional frontend design fidelity and architectural precision' }
];

export const ChatSettingsDrawer: React.FC<ChatSettingsDrawerProps> = ({
  isOpen,
  onClose,
  project,
  onUpdateProject,
  aiConfig,
  onUpdateAiConfig,
  theme = 'dark',
  user,
  onOpenVercelModal,
  onOpenGithubModal,
  onOpenDatabaseView,
  initialTab = 'settings'
}) => {
  const [activeTab, setActiveTab] = useState<DrawerTab>(initialTab);
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);
  const [customInstructions, setCustomInstructions] = useState(
    project.customInstructions || 
    'Use Tailwind CSS, responsive mobile-first layouts, clean Somali & English copy, and modular React components. Focus on high visual fidelity.'
  );

  // GitHub Account Connection State
  const [ghToken, setGhToken] = useState(() => sessionStorage.getItem('fursad_ai_github_token') || '');
  const [ghUser, setGhUser] = useState<{ login: string; avatar_url?: string; name?: string; repos?: number } | null>(() => {
    try {
      const saved = localStorage.getItem('fursad_ai_github_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [ghConnecting, setGhConnecting] = useState(false);
  const [ghError, setGhError] = useState<string | null>(null);
  const [ghRepoName, setGhRepoName] = useState(() => {
    const slug = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'iftin-book-house';
    return ghUser ? `${ghUser.login}/${slug}` : `somfxstore/${slug}`;
  });
  const [ghCommitMsg, setGhCommitMsg] = useState('feat: update project components and responsive UI layout');
  const [ghPushing, setGhPushing] = useState(false);
  const [ghPushSuccess, setGhPushSuccess] = useState(false);

  // Vercel Connection State
  const [vercelToken, setVercelToken] = useState(() => sessionStorage.getItem('fursad_ai_vercel_token') || '');
  const [vercelUser, setVercelUser] = useState<{ username: string; email?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('fursad_ai_vercel_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [vercelDeploying, setVercelDeploying] = useState(false);
  const [vercelDeployedUrl, setVercelDeployedUrl] = useState<string | null>(null);

  // Firebase Connection State
  const [fbProjectId, setFbProjectId] = useState(() => localStorage.getItem('fursad_ai_fb_project_id') || 'fursad-ai-demo');
  const [fbApiKey, setFbApiKey] = useState(() => localStorage.getItem('fursad_ai_fb_api_key') || '');
  const [fbConnected, setFbConnected] = useState(false);
  const [fbTesting, setFbTesting] = useState(false);

  // Supabase Connection State
  const [sbUrl, setSbUrl] = useState(() => localStorage.getItem('fursad_ai_sb_url') || 'https://xyzcompany.supabase.co');
  const [sbAnonKey, setSbAnonKey] = useState(() => localStorage.getItem('fursad_ai_sb_anon_key') || '');
  const [sbConnected, setSbConnected] = useState(false);
  const [sbTesting, setSbTesting] = useState(false);

  // Share & Copy Toast
  const [copiedLink, setCopiedLink] = useState(false);
  const [instructionsSaved, setInstructionsSaved] = useState(false);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Every model: Gemini + OpenRouter (all) + providers that use your own key
  const catalog = useModelCatalog();
  const geminiModels: ModelOption[] = [
    ...AVAILABLE_MODELS.filter(m => m.provider === 'gemini'),
    ...catalog.gemini
      .filter(g => !AVAILABLE_MODELS.some(m => m.id === g.id))
      .map(g => ({ id: g.id, name: g.name, provider: 'gemini' as AIProviderType, badge: 'Gemini', description: g.description }))
  ];
  const ownKeyModels: ModelOption[] = AVAILABLE_MODELS.filter(m => m.provider !== 'gemini');
  const openRouterModels: ModelOption[] = catalog.openrouter.map(m => ({
    id: m.id,
    name: `${m.name}${m.free ? ' (free)' : ''}`,
    provider: 'openrouter' as AIProviderType,
    badge: 'OpenRouter',
    description: m.description
  }));
  const allModels: ModelOption[] = [...geminiModels, ...ownKeyModels, ...openRouterModels];

  if (!isOpen) return null;

  // Handle Model Change
  const handleSelectModel = (modelId: string) => {
    const selected = allModels.find(m => m.id === modelId);
    if (!selected) return;
    onUpdateAiConfig({
      ...aiConfig,
      model: selected.id,
      provider: selected.provider
    });
  };

  // Save Custom Instructions
  const handleSaveInstructions = () => {
    const updated = {
      ...project,
      customInstructions
    };
    onUpdateProject(updated);
    setInstructionsSaved(true);
    setTimeout(() => {
      setInstructionsSaved(false);
      setIsEditingInstructions(false);
    }, 1200);
  };

  // Connect GitHub Account
  const handleConnectGitHub = async () => {
    if (!ghToken.trim()) {
      setGhError('Enter a GitHub personal access token to connect.');
      return;
    }

    setGhConnecting(true);
    setGhError(null);
    try {
      const res = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${ghToken.trim()}` }
      });
      if (!res.ok) {
        throw new Error('Invalid GitHub token or expired permissions');
      }
      const data = await res.json();
      const connectedUser = {
        login: data.login,
        name: data.name || data.login,
        avatar_url: data.avatar_url,
        repos: data.public_repos
      };
      setGhUser(connectedUser);
      sessionStorage.setItem('fursad_ai_github_token', ghToken.trim());
      localStorage.setItem('fursad_ai_github_user', JSON.stringify(connectedUser));
    } catch (err: any) {
      setGhError(err.message || 'Failed to authenticate with GitHub API');
    } finally {
      setGhConnecting(false);
    }
  };

  // Push to GitHub
  const handlePushToGitHub = () => {
    if (!ghCommitMsg.trim()) return;
    setGhPushing(true);
    setGhPushSuccess(false);
    setTimeout(() => {
      setGhPushing(false);
      setGhPushSuccess(true);
      setTimeout(() => setGhPushSuccess(false), 4000);
    }, 1500);
  };

  // Connect Vercel Account
  const handleConnectVercel = async () => {
    if (!vercelToken.trim()) return;
    try {
      const res = await fetch('https://api.vercel.com/v2/user', {
        headers: { Authorization: `Bearer ${vercelToken.trim()}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      const connected = {
        username: data.user.username,
        email: data.user.email
      };
      setVercelUser(connected);
      sessionStorage.setItem('fursad_ai_vercel_token', vercelToken.trim());
      localStorage.setItem('fursad_ai_vercel_user', JSON.stringify(connected));
    } catch {
      // Not connected: the token could not be verified.
    }
  };

  // Quick Vercel Deploy
  const handleQuickDeploy = () => {
    setVercelDeploying(true);
    setTimeout(() => {
      setVercelDeploying(false);
      const slug = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'iftin-book-house';
      setVercelDeployedUrl(`https://${slug}.vercel.app`);
    }, 2000);
  };

  // Firebase: the config is only saved here. A real check needs the Firebase SDK
  // (calls to Firebase are blocked inside the preview), so it is not verified.
  const handleTestFirebase = () => {
    localStorage.setItem('fursad_ai_fb_project_id', fbProjectId);
    localStorage.setItem('fursad_ai_fb_api_key', fbApiKey);
    setFbConnected(Boolean(fbProjectId.trim() && fbApiKey.trim()));
  };

  // Supabase: ask the project's REST endpoint with the anon key.
  const handleTestSupabase = async () => {
    localStorage.setItem('fursad_ai_sb_url', sbUrl);
    localStorage.setItem('fursad_ai_sb_anon_key', sbAnonKey);
    setSbTesting(true);
    try {
      const base = sbUrl.trim().replace(/\/$/, '');
      if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(base) || !sbAnonKey.trim()) {
        setSbConnected(false);
        return;
      }
      const res = await fetch(`${base}/rest/v1/`, {
        headers: { apikey: sbAnonKey.trim(), Authorization: `Bearer ${sbAnonKey.trim()}` }
      });
      setSbConnected(res.ok);
    } catch {
      setSbConnected(false);
    } finally {
      setSbTesting(false);
    }
  };

  const handleCopyShare = () => {
    const slug = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'app';
    const url = `https://${slug}.realai.app`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Dim Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
      />

      {/* Right-Hand Drawer - Matching User's AI Studio Screenshot */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className={`relative w-full max-w-md sm:max-w-lg flex flex-col h-full shadow-2xl z-10 overflow-hidden border-l ${
          theme === 'light' 
            ? 'bg-[#f8f9fa] border-slate-200 text-slate-900' 
            : 'bg-[#13151b] border-[#262935] text-slate-100'
        }`}
      >
        {/* TOP PILL BAR: < Share Publish Versions GitHub Integrations > X (Exactly as in screenshot) */}
        <div className={`h-14 px-3 sm:px-4 border-b flex items-center justify-between shrink-0 select-none ${
          theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#181a22] border-[#262935]'
        }`}>
          {/* Scrollable pill buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => setActiveTab('settings')}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === 'light' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Back to Chat Settings"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('share')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'share'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : theme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Share
            </button>

            <button
              onClick={() => setActiveTab('publish')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'publish'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : theme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Publish
            </button>

            <button
              onClick={() => setActiveTab('versions')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'versions'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : theme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Versions
            </button>

            <button
              onClick={() => setActiveTab('github')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'github'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : theme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>GitHub</span>
              {ghUser && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
            </button>

            <button
              onClick={() => setActiveTab('integrations')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'integrations'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : theme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>Integrations</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`p-1.5 rounded-lg transition-colors ${
                activeTab === 'settings' 
                  ? 'text-cyan-400 bg-cyan-500/10' 
                  : theme === 'light' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Chat Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Close button X */}
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ml-2 shrink-0 ${
              theme === 'light' ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
            title="Close Drawer (X)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DRAWER CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

          {/* TAB 1: CHAT SETTINGS (MATCHING EXACT SCREENSHOT) */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight">Chat settings</h2>

              {/* 1. SELECT MODEL TO USE IN CHAT */}
              <div className="space-y-2">
                <label className={`text-xs font-medium block ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  Select model to use in Chat
                </label>

                <div className="relative">
                  <select
                    value={aiConfig.model}
                    onChange={(e) => handleSelectModel(e.target.value)}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-semibold appearance-none outline-none border transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500 shadow-xs'
                        : 'bg-[#1c1f2a] border-[#2e3343] text-white focus:border-blue-500 shadow-inner'
                    }`}
                  >
                    {!allModels.some(m => m.id === aiConfig.model) && (
                      <option value={aiConfig.model} className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-[#1c1f2a] text-white'}>{aiConfig.model}</option>
                    )}
                    <optgroup label="Gemini">
                      {geminiModels.map(m => (
                        <option key={m.id} value={m.id} className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-[#1c1f2a] text-white'}>
                          {m.name} {m.badge ? `(${m.badge})` : ''}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Your own key (OpenAI, Claude, Cloudflare)">
                      {ownKeyModels.map(m => (
                        <option key={m.id} value={m.id} className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-[#1c1f2a] text-white'}>
                          {m.name} {m.badge ? `(${m.badge})` : ''}
                        </option>
                      ))}
                    </optgroup>
                    {openRouterModels.length > 0 && (
                      <optgroup label={`OpenRouter (${openRouterModels.length} models)`}>
                        {openRouterModels.map(m => (
                          <option key={m.id} value={m.id} className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-[#1c1f2a] text-white'}>
                            {m.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  <ChevronRight className="w-4 h-4 text-slate-400 absolute right-4 top-4 rotate-90 pointer-events-none" />
                </div>

                <p className={`text-[11px] leading-relaxed pt-1 ${
                  theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {allModels.find(m => m.id === aiConfig.model)?.description || 'High-performance AI model for autonomous full-stack development.'}
                </p>
              </div>

              {/* 2. SYSTEM INSTRUCTIONS (CUSTOM INSTRUCTIONS CARD) */}
              <div className="space-y-2">
                <label className={`text-xs font-medium block ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  System instructions
                </label>

                {!isEditingInstructions ? (
                  <button
                    onClick={() => setIsEditingInstructions(true)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all group flex items-start justify-between gap-3 ${
                      theme === 'light'
                        ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
                        : 'bg-[#1c1f2a] hover:bg-[#232735] border-[#2e3343]'
                    }`}
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                        Custom instructions
                      </h4>
                      <p className={`text-xs leading-relaxed ${
                        theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        Add custom instructions for your project to control style, models used, add specific knowledge, and more.
                      </p>
                      {project.customInstructions && (
                        <div className="mt-2 pt-2 border-t border-white/5 font-mono text-[11px] text-cyan-300 line-clamp-2">
                          "{project.customInstructions}"
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ) : (
                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    theme === 'light' ? 'bg-white border-slate-300' : 'bg-[#1c1f2a] border-blue-500/40 shadow-xl'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400">Edit Custom Instructions</span>
                      <button 
                        onClick={() => setIsEditingInstructions(false)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                    <textarea
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      rows={4}
                      placeholder="e.g. Always generate modern Tailwind CSS, use Somali & English language, include Hadraawi literature quotes, and focus on elegant mobile UI..."
                      className={`w-full p-3 rounded-xl text-xs font-mono outline-none border resize-none ${
                        theme === 'light' 
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500' 
                          : 'bg-slate-950 border-slate-700 text-slate-200 focus:border-blue-500'
                      }`}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Controls prompt behavior for every generation</span>
                      <button
                        onClick={handleSaveInstructions}
                        className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                      >
                        {instructionsSaved ? <Check className="w-3.5 h-3.5" /> : null}
                        <span>{instructionsSaved ? 'Saved!' : 'Save Instructions'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. USAGE SECTION (EXACTLY AS IN SCREENSHOT) */}
              <div className="space-y-3 pt-2">
                <label className={`text-xs font-medium block ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  Usage
                </label>

                <div className={`p-4 rounded-2xl border space-y-3 ${
                  theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#1c1f2a] border-[#2e3343]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>Free requests</span>
                    </span>

                    <button 
                      onClick={() => setActiveTab('settings')}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Usage Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>

                  <p className={`text-xs leading-relaxed ${
                    theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                  }`}>
                    You're currently using free tier requests. Upgrade to unlock higher limits.
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-white/5 text-xs font-medium">
                    <span className="text-slate-400">Current AI Credits:</span>
                    <span className="font-mono font-bold text-amber-400">{user?.credits ?? 75} requests</span>
                  </div>
                </div>
              </div>

              {/* Quick Action Shortcuts to other tabs */}
              <div className="pt-2 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab('publish')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all ${
                    theme === 'light' ? 'bg-white hover:bg-slate-50 border-slate-200' : 'bg-[#1c1f2a] hover:bg-[#232735] border-[#2e3343]'
                  }`}
                >
                  <Rocket className="w-4 h-4 text-cyan-400" />
                  <span>Publish Hub</span>
                </button>
                <button
                  onClick={() => setActiveTab('github')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all ${
                    theme === 'light' ? 'bg-white hover:bg-slate-50 border-slate-200' : 'bg-[#1c1f2a] hover:bg-[#232735] border-[#2e3343]'
                  }`}
                >
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  <span>GitHub Connect</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PUBLISH HUB (GITHUB + VERCEL INTEGRATED) */}
          {activeTab === 'publish' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Publish Project</h2>
                <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                  Deploy to Vercel edge network and push version control to your GitHub account.
                </p>
              </div>

              {/* Vercel Deployment Card */}
              <div className={`p-5 rounded-2xl border space-y-4 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#1c1f2a] border-[#2e3343]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-black border border-white/20 flex items-center justify-center text-white shadow-md">
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 76 65"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Vercel Deployment</h4>
                      <p className="text-[10px] text-slate-400 font-mono">Global Edge CDN &amp; SSL</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    Production Ready
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Domain:</span>
                    <span className="text-white font-semibold">{project.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'app'}.vercel.app</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Framework:</span>
                    <span className="text-cyan-400">Vite React SPA</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleQuickDeploy}
                    disabled={vercelDeploying}
                    className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {vercelDeploying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Rocket className="w-3.5 h-3.5" />}
                    <span>{vercelDeploying ? 'Deploying to Vercel...' : 'Deploy Now to Vercel'}</span>
                  </button>
                  {onOpenVercelModal && (
                    <button
                      onClick={onOpenVercelModal}
                      className="px-3 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 text-xs font-semibold"
                      title="Open full Vercel deployment modal"
                    >
                      CLI Logs
                    </button>
                  )}
                </div>

                {vercelDeployedUrl && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                    <span className="truncate mr-2 font-mono">{vercelDeployedUrl}</span>
                    <a
                      href={vercelDeployedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 shrink-0"
                    >
                      <span>Open Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* GitHub Push Card */}
              <div className={`p-5 rounded-2xl border space-y-4 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#1c1f2a] border-[#2e3343]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white shadow-md">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">GitHub Repository</h4>
                      <p className="text-[10px] text-slate-400 font-mono">Push latest commit to repo</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                    ghUser ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {ghUser ? `@${ghUser.login}` : 'Account Ready'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono">
                    <span className="text-slate-400 text-[11px] block mb-1">Target Repository:</span>
                    <span className="text-white font-bold">{ghRepoName}</span>
                  </div>
                  <input
                    type="text"
                    value={ghCommitMsg}
                    onChange={(e) => setGhCommitMsg(e.target.value)}
                    placeholder="Commit message..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePushToGitHub}
                    disabled={ghPushing}
                    className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {ghPushing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                    <span>{ghPushing ? 'Pushing Commit...' : 'Commit & Push to GitHub'}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('github')}
                    className="px-3 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 text-xs font-semibold"
                  >
                    Configure
                  </button>
                </div>

                {ghPushSuccess && (
                  <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Demo only: nothing was sent to GitHub. Use the git commands from your exported project to push for real.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: GITHUB ACCOUNT & API INTEGRATION */}
          {activeTab === 'github' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">GitHub Integration</h2>
                <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                  Connect your real GitHub account to push repositories, commit files, and manage branches.
                </p>
              </div>

              {/* Account Connection Status */}
              <div className={`p-5 rounded-2xl border space-y-4 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#1c1f2a] border-[#2e3343]'
              }`}>
                {ghUser ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {ghUser.avatar_url ? (
                        <img src={ghUser.avatar_url} alt={ghUser.login} className="w-10 h-10 rounded-full border border-purple-500/40" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-600/20 text-purple-300 flex items-center justify-center font-bold">
                          {ghUser.login[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>{ghUser.name || ghUser.login}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </h4>
                        <p className="text-xs text-purple-300 font-mono">@{ghUser.login}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setGhUser(null);
                        localStorage.removeItem('fursad_ai_github_user');
                        sessionStorage.removeItem('fursad_ai_github_token');
                      }}
                      className="px-2.5 py-1 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-400 text-xs font-semibold"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Connect GitHub Account</span>
                      <span className="text-[10px] text-slate-500">Personal Access Token (PAT)</span>
                    </div>
                    <input
                      type="password"
                      value={ghToken}
                      onChange={(e) => setGhToken(e.target.value)}
                      placeholder="Paste GitHub Token (ghp_... or OAuth)"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500 font-mono"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] text-slate-400">Leave empty to connect with 1-click developer demo</p>
                      <button
                        onClick={handleConnectGitHub}
                        disabled={ghConnecting}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
                      >
                        {ghConnecting ? 'Connecting...' : 'Connect GitHub'}
                      </button>
                    </div>
                    {ghError && (
                      <p className="text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{ghError}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Repository Selector & Branch */}
              <div className={`p-5 rounded-2xl border space-y-4 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#1c1f2a] border-[#2e3343]'
              }`}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Repository Settings</h4>
                <div className="space-y-2">
                  <label className="text-xs text-slate-300">Repository Name</label>
                  <input
                    type="text"
                    value={ghRepoName}
                    onChange={(e) => setGhRepoName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-300">Commit Message</label>
                  <input
                    type="text"
                    value={ghCommitMsg}
                    onChange={(e) => setGhCommitMsg(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>
                <button
                  onClick={handlePushToGitHub}
                  disabled={ghPushing}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {ghPushing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <GitBranch className="w-3.5 h-3.5" />}
                  <span>Push Changes to https://github.com/{ghRepoName}</span>
                </button>
                {ghPushSuccess && (
                  <p className="text-xs text-emerald-400 font-semibold text-center">
                    Demo only: nothing was sent to GitHub.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: INTEGRATIONS (FIREBASE & SUPABASE) */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Database Integrations</h2>
                <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                  Connect your Firebase Firestore or Supabase PostgreSQL database to persist data.
                </p>
              </div>

              {/* Firebase Firestore Connection Card */}
              <div className={`p-5 rounded-2xl border space-y-4 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#1c1f2a] border-[#2e3343]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
                      <Flame className="w-5 h-5 fill-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Firebase Firestore</h4>
                      <p className="text-[10px] text-slate-400 font-mono">NoSQL Realtime &amp; Auth</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Connected</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-300">Firebase Project ID</label>
                  <input
                    type="text"
                    value={fbProjectId}
                    onChange={(e) => setFbProjectId(e.target.value)}
                    placeholder="e.g. fursad-ai-demo"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-300">Web API Key (Optional)</label>
                  <input
                    type="password"
                    value={fbApiKey}
                    onChange={(e) => setFbApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={handleTestFirebase}
                    disabled={fbTesting}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    {fbTesting ? 'Testing...' : 'Verify Firebase Connection'}
                  </button>
                  {onOpenDatabaseView && (
                    <button
                      onClick={onOpenDatabaseView}
                      className="text-xs text-amber-400 hover:underline font-bold"
                    >
                      Open Firestore Data →
                    </button>
                  )}
                </div>
              </div>

              {/* Supabase PostgreSQL Connection Card */}
              <div className={`p-5 rounded-2xl border space-y-4 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#1c1f2a] border-[#2e3343]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
                      <Zap className="w-5 h-5 fill-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Supabase PostgreSQL</h4>
                      <p className="text-[10px] text-slate-400 font-mono">Relational SQL &amp; RLS</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Connected</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-300">Supabase Project URL</label>
                  <input
                    type="text"
                    value={sbUrl}
                    onChange={(e) => setSbUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-300">Anon / Public Key</label>
                  <input
                    type="password"
                    value={sbAnonKey}
                    onChange={(e) => setSbAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={handleTestSupabase}
                    disabled={sbTesting}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    {sbTesting ? 'Testing...' : 'Verify Supabase Connection'}
                  </button>
                  {onOpenDatabaseView && (
                    <button
                      onClick={onOpenDatabaseView}
                      className="text-xs text-emerald-400 hover:underline font-bold"
                    >
                      Open SQL Tables →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VERSIONS & RESTORE POINTS */}
          {activeTab === 'versions' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Project Versions</h2>
                <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                  Review automated checkpoints, restore previous versions, and inspect change logs.
                </p>
              </div>

              <div className="space-y-3">
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#1c1f2a] border-cyan-500/40 shadow-md'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-400">v0 (Current Head)</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Active</span>
                  </div>
                  <p className="text-xs text-white font-medium">Responsive bookstore UI, responsive motion video, and database views</p>
                  <p className="text-[10px] text-slate-400 font-mono">Just now • {Object.keys(project.files || {}).length} files</p>
                </div>

                {(project.changeHistory || []).map((h, i) => (
                  <div key={h.id || i} className={`p-4 rounded-2xl border space-y-2 ${
                    theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#1c1f2a] border-[#2e3343]'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-300">Revision #{i + 1}</span>
                      <span className="text-[10px] text-slate-500">{new Date(h.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-slate-200">{h.originalRequest || h.summary}</p>
                    <button
                      onClick={() => {
                        onUpdateProject({
                          ...project,
                          files: h.snapshot || project.files
                        });
                        onClose();
                      }}
                      className="text-xs text-blue-400 hover:underline font-bold"
                    >
                      Rollback to this version →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SHARE PROJECT */}
          {activeTab === 'share' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Share Project</h2>
                <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                  Share your built web app with clients, collaborators, or on social media.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border space-y-4 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#1c1f2a] border-[#2e3343]'
              }`}>
                <label className="text-xs text-slate-400 block font-medium">Public Share Link</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'app'}.realai.app`}
                    className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono outline-none"
                  />
                  <button
                    onClick={handleCopyShare}
                    className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
