import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Trash2, 
  RefreshCw, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Sliders,
  DollarSign,
  Cloud
} from 'lucide-react';
import axios from 'axios';
import { AIProviderType, AIProviderConfig, AIModelInfo, User, LanguageType } from '../../types.ts';

interface AiProviderSettingsProps {
  user?: User | null;
  language?: LanguageType;
  onConfigChange?: (config: AIProviderConfig) => void;
  initialConfig?: AIProviderConfig;
  compact?: boolean;
}

interface ProviderMeta {
  id: AIProviderType;
  name: string;
  description: string;
  requiresKey: boolean;
  hasServerDefault: boolean;
  models: AIModelInfo[];
}

export const AiProviderSettings: React.FC<AiProviderSettingsProps> = ({
  user,
  language = 'en',
  onConfigChange,
  initialConfig,
  compact = false
}) => {
  const isSo = language === 'so';
  const storageKey = user ? `fursad_ai_config_${user.id || user.email}` : 'fursad_ai_config_guest';

  // Load saved config
  const [config, setConfig] = useState<AIProviderConfig>(() => {
    if (initialConfig) return initialConfig;
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

  const [providers, setProviders] = useState<ProviderMeta[]>([]);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs?: number;
    message?: string;
    error?: string;
  } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [orModels, setOrModels] = useState<AIModelInfo[]>([]);
  const [orQuery, setOrQuery] = useState('');
  const [orLoading, setOrLoading] = useState(false);
  const [orServerKey, setOrServerKey] = useState(false);

  // Fetch available providers from server
  useEffect(() => {
    axios.get('/api/ai/providers')
      .then(res => {
        if (res.data?.providers) {
          setProviders(res.data.providers);
        }
        setOrServerKey(Boolean(res.data?.openrouter?.hasServerKey));
      })
      .catch(err => {
        console.warn('Failed to fetch provider list from server:', err);
      });
  }, []);

  // OpenRouter: load every available model once the provider is selected
  useEffect(() => {
    if (config.provider !== 'openrouter' || orModels.length > 0) return;
    setOrLoading(true);
    axios.get('/api/ai/openrouter/models')
      .then(res => {
        const list: AIModelInfo[] = (res.data?.models || []).map((m: any) => ({
          id: m.id,
          name: m.name,
          provider: 'openrouter' as AIProviderType,
          description: m.free
            ? 'Free'
            : `$${(m.promptPrice * 1e6).toFixed(2)} in / $${(m.completionPrice * 1e6).toFixed(2)} out per 1M tokens`,
          contextWindow: m.contextLength ? `${Math.round(m.contextLength / 1000)}K tokens` : 'n/a',
          recommendedFor: 'balanced' as const,
          requiresByok: true
        }));
        setOrModels(list);
      })
      .catch(() => {})
      .finally(() => setOrLoading(false));
  }, [config.provider]);

  const currentProvider = providers.find(p => p.id === config.provider) || providers[0];
  const availableModels: AIModelInfo[] = config.provider === 'openrouter' && orModels.length > 0
    ? orModels.filter(m => !orQuery.trim() || `${m.id} ${m.name}`.toLowerCase().includes(orQuery.trim().toLowerCase()))
    : (currentProvider?.models || []);

  const handleProviderSelect = (provId: AIProviderType) => {
    const prov = providers.find(p => p.id === provId);
    const defaultModel = prov?.models[0]?.id || 'default';
    const newConfig: AIProviderConfig = {
      ...config,
      provider: provId,
      model: defaultModel,
      useCustomKey: provId !== 'gemini' || Boolean(config.apiKey)
    };
    setConfig(newConfig);
    setTestResult(null);
    if (onConfigChange) onConfigChange(newConfig);
  };

  const handleModelSelect = (modelId: string) => {
    const newConfig = { ...config, model: modelId };
    setConfig(newConfig);
    setTestResult(null);
    if (onConfigChange) onConfigChange(newConfig);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(config));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      if (onConfigChange) onConfigChange(config);
    } catch (e) {
      console.error('Failed to save config:', e);
    }
  };

  const handleRemoveKey = () => {
    const newConfig = {
      ...config,
      apiKey: '',
      accountId: '',
      useCustomKey: false
    };
    setConfig(newConfig);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newConfig));
    } catch {}
    setTestResult(null);
    if (onConfigChange) onConfigChange(newConfig);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await axios.post('/api/ai/test-connection', {
        provider: config.provider,
        model: config.model,
        apiKey: config.apiKey,
        accountId: config.accountId
      });
      setTestResult({
        success: true,
        latencyMs: res.data.latencyMs,
        message: res.data.message || 'Connection successful!'
      });
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Connection failed';
      setTestResult({
        success: false,
        error: msg
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className={`space-y-6 text-slate-200 ${compact ? 'text-xs' : ''}`}>
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-black text-white">
              {isSo ? 'Nidaamka AI Providers & BYOK' : 'AI Provider & BYOK Gateway'}
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest font-bold">
              Multi-Model
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isSo 
              ? 'Dooro provider-ka aad doonayso (Gemini, OpenAI, Cloudflare, Groq, Anthropic) oo ku shubo furahaaga gaarka ah (BYOK).' 
              : 'Switch between leading AI engines or bring your own API key (BYOK) for autonomous builds and surgical edits.'}
          </p>
        </div>

        {/* Current Active Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-300 capitalize">
            {config.provider}: <span className="text-cyan-400">{config.model}</span>
          </span>
        </div>
      </div>

      {/* 1. Provider Selection Cards */}
      <div className="space-y-3">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          {isSo ? '1. Dooro AI Provider-ka' : '1. Select AI Provider'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {providers.map((p) => {
            const isSelected = config.provider === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleProviderSelect(p.id)}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30' 
                    : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/[0.08]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white capitalize">{p.name}</span>
                    {p.hasServerDefault && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        Built-in
                      </span>
                    )}
                    {p.requiresKey && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                        BYOK
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{p.models.length} models</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Model Selection */}
      <div className="space-y-3">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          {isSo ? '2. Dooro Nooca Model-ka (Model Selection)' : '2. Select Model for Code Generation & Edits'}
        </label>
        <p className="text-[11px] text-emerald-300/80">
          {isSo
            ? 'Haddii moodelka aad dooratay uusan shaqayn, Gemini ama OpenRouter (kan kale) ayaa si toos ah loo isticmaalayaa.'
            : 'If the model you choose does not respond, the other provider (Gemini or OpenRouter) is used automatically.'}
        </p>
        {config.provider === 'openrouter' && (
          <div className="space-y-1.5">
            <input
              type="text"
              value={orQuery}
              onChange={(e) => setOrQuery(e.target.value)}
              placeholder={isSo ? 'Raadi model (tusaale: claude, gpt, llama, free)...' : 'Search models (e.g. claude, gpt, llama, free)...'}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-400">
              {orLoading
                ? (isSo ? 'Waxaa la soo rarayaa moodellada OpenRouter...' : 'Loading OpenRouter models...')
                : `${availableModels.length} / ${orModels.length || 1} models`}
            </p>
          </div>
        )}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 ${config.provider === 'openrouter' ? 'max-h-[26rem] overflow-y-auto pr-1' : ''}`}>
          {availableModels.map((m) => {
            const isSelected = config.model === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleModelSelect(m.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-500/15 border-indigo-500/50 ring-1 ring-indigo-500/40 text-white'
                    : 'bg-white/5 border-white/5 hover:border-white/15 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-white">{m.name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                    {m.contextWindow}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">{m.description}</p>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                    m.recommendedFor === 'fast-edits' 
                      ? 'bg-cyan-500/20 text-cyan-300' 
                      : m.recommendedFor === 'code-refactor'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {m.recommendedFor === 'fast-edits' ? '⚡ Fast Edits' : m.recommendedFor === 'code-refactor' ? '🧠 Complex Refactor' : '🚀 Full Builds'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Bring Your Own Key (BYOK) Credentials */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              {isSo ? 'Furahaaga Gaarka Ah (BYOK API Key)' : 'Bring Your Own API Key (BYOK)'}
            </h4>
          </div>
          {currentProvider?.id === 'gemini' && (
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {isSo ? 'Platform default key diyaar ayuu yahay (Optional BYOK)' : 'Platform default active (BYOK optional)'}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          {isSo
            ? 'Furahaaga sirta ah waxaa loo diraa si ammaan ah server-ka proxy-giisa. Weligiis lama kashifo browser-ka dadka kale ama logs-ka dadweynaha. Kharashka isticmaalka waxaa toos uga goosanaya provider-ka adiga qandaraaska kula jira.'
            : 'Your credentials are kept isolated per user, never exposed in client URLs or public logs, and proxied through our secure backend. Provider charges are billed directly by that provider to your account.'}
        </p>

        {/* Cloudflare Account ID Field if Cloudflare chosen */}
        {config.provider === 'cloudflare' && (
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Cloudflare Account ID
            </label>
            <input
              type="text"
              placeholder="e.g. 023e105f4ecef8ad9ca31a8372d0c353"
              value={config.accountId || ''}
              onChange={(e) => setConfig({ ...config, accountId: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        )}

        {/* API Key Input */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            {config.provider === 'openai' 
              ? 'OpenAI API Key (sk-...)' 
              : config.provider === 'groq' 
              ? 'Groq API Key (gsk_...)' 
              : config.provider === 'anthropic'
              ? 'Anthropic API Key (sk-ant-...)'
              : config.provider === 'openrouter'
              ? 'OpenRouter API Key (sk-or-v1-...)'
              : config.provider === 'cloudflare'
              ? 'Cloudflare API Token'
              : 'Google Gemini API Key (Optional)'}
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              placeholder={config.provider === 'gemini' ? 'Optional (Built-in active)' : (config.provider === 'openrouter' && orServerKey) ? 'Optional (server key active)' : 'Enter API key...'}
              value={config.apiKey || ''}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-24 py-2.5 text-xs text-white outline-none focus:border-cyan-500 font-mono"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              {config.apiKey && (
                <button
                  type="button"
                  onClick={handleRemoveKey}
                  className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10 transition-colors"
                  title="Remove saved key"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls & Testing */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={testing || (config.provider !== 'gemini' && !config.apiKey && !(config.provider === 'openrouter' && orServerKey))}
              className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              {isSo ? 'Tijaabi Xiriirka (Test Connection)' : 'Test Connection'}
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-white text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-cyan-400 hover:text-white transition-all shadow-md active:scale-95"
            >
              {saveSuccess ? 'Saved ✓' : isSo ? 'Kaydi Habaynta' : 'Save Config'}
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isSo ? 'Xogtaadu waa mid gooni ah' : 'Isolated client session'}</span>
          </div>
        </div>

        {/* Test Result Message Banner */}
        <AnimatePresence>
          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                testResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              )}
              <div className="space-y-0.5">
                <p className="font-bold">
                  {testResult.success 
                    ? `Connection Verified (${testResult.latencyMs}ms)` 
                    : 'Connection Failed'}
                </p>
                <p className="text-[11px] opacity-90 leading-relaxed">
                  {testResult.message || testResult.error}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
