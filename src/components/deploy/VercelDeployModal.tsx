import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Globe, 
  ExternalLink, 
  CheckCircle2, 
  Terminal, 
  Clock, 
  Copy, 
  Check, 
  X, 
  RotateCcw, 
  AlertCircle, 
  Cpu, 
  GitBranch, 
  Layers, 
  Server,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { ProjectState } from '../../types.ts';

interface VercelDeployModalProps {
  project: ProjectState;
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

interface DeploymentRecord {
  id: string;
  url: string;
  branch: string;
  status: 'ready' | 'building' | 'queued' | 'error';
  commit: string;
  duration: string;
  timestamp: string;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({
  project,
  isOpen,
  onClose,
  theme = 'dark'
}) => {
  const safeProjectSlug = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/^-+|-+$/g, '') || 'iftin-book-house';
  const [projectName, setProjectName] = useState(safeProjectSlug);
  const [isDeploying, setIsDeploying] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [deployStep, setDeployStep] = useState<'idle' | 'building' | 'success'>('idle');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'deploy' | 'history' | 'env'>('deploy');

  const logsEndRef = useRef<HTMLDivElement>(null);

  const [deployments, setDeployments] = useState<DeploymentRecord[]>([
    {
      id: 'dpl_prod_01',
      url: `https://${safeProjectSlug}.vercel.app`,
      branch: 'main',
      status: 'ready',
      commit: 'feat: add Somali book catalog and responsive bookstore',
      duration: '1.4s',
      timestamp: '10 minutes ago'
    },
    {
      id: 'dpl_prev_02',
      url: `https://${safeProjectSlug}-git-dev.vercel.app`,
      branch: 'dev',
      status: 'ready',
      commit: 'init: bootstrap AI vibe-coding project with Tailwind',
      duration: '1.8s',
      timestamp: '1 hour ago'
    }
  ]);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  if (!isOpen) return null;

  const currentLiveUrl = `https://${projectName}.vercel.app`;

  const handleStartDeploy = () => {
    setIsDeploying(true);
    setDeployStep('building');
    setLogs([]);

    const logSequence = [
      '▲ Vercel CLI 34.2.0 (production deployment)',
      `Retrieving project settings for "${projectName}"...`,
      'Connecting to GitHub repository: somfxstore/' + projectName + ' (main)...',
      'Cloning HEAD commit into build environment...',
      'Analyzing package.json dependencies (react, lucide-react, tailwindcss)...',
      'Running build command: "npm run build"...',
      'vite v6.2.0 building for production...',
      '✓ 48 modules transformed in 420ms.',
      'dist/index.html                     1.84 kB │ gzip: 0.76 kB',
      'dist/assets/index-D8f21.css        24.12 kB │ gzip: 5.60 kB',
      'dist/assets/index-A4910.js        186.40 kB │ gzip: 52.80 kB',
      '✓ Build succeeded in 1.12s',
      'Deploying serverless functions & global edge assets...',
      'Configuring headers, caching & SSL certificate...',
      `Assigning production domain: ${currentLiveUrl}`,
      '🚀 Status: READY in 1.4s (Global Edge Network)'
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logSequence.length) {
        const nextLog = logSequence[currentLogIndex];
        setLogs(prev => [...prev, nextLog]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsDeploying(false);
        setDeployStep('success');

        const newDeployment: DeploymentRecord = {
          id: `dpl_${Date.now()}`,
          url: currentLiveUrl,
          branch: 'main',
          status: 'ready',
          commit: `Deploy ${projectName} latest updates`,
          duration: '1.4s',
          timestamp: 'Just now'
        };
        setDeployments(prev => [newDeployment, ...prev]);
      }
    }, 180);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentLiveUrl).catch(() => {});
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col max-h-[92vh] overflow-hidden ${
          theme === 'light'
            ? 'bg-white border-slate-300 text-slate-900 shadow-slate-300/60'
            : 'bg-[#000000] border-[#333333] text-[#ffffff] shadow-2xl'
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
          theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#0a0a0a] border-[#222222]'
        }`}>
          <div className="flex items-center gap-3">
            {/* Vercel Triangle Logo */}
            <div className="w-8 h-8 rounded-xl bg-black text-white border border-white/20 flex items-center justify-center shadow-md">
              <svg className="w-4 h-4 fill-white" viewBox="0 0 76 65" fill="none">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Vercel Deployment</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  Global Edge
                </span>
              </div>
              <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                Deploy instant, zero-configuration web applications to Vercel
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              theme === 'light' ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className={`px-6 pt-3 flex gap-4 border-b shrink-0 ${
          theme === 'light' ? 'border-slate-200 bg-slate-100/50' : 'border-[#222222] bg-[#0c0c0c]'
        }`}>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`pb-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'deploy'
                ? 'border-white text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Rocket className="w-4 h-4 text-cyan-400" />
            <span>Deploy App</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'history'
                ? 'border-white text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Deployments ({deployments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`pb-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'env'
                ? 'border-white text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4 text-amber-400" />
            <span>Environment Variables</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: DEPLOY */}
          {activeTab === 'deploy' && (
            <div className="space-y-5">
              {/* Target Domain Input */}
              <div className="space-y-1.5">
                <label className={`block text-xs font-bold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                  Vercel Project & Production Domain:
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      disabled={isDeploying}
                      className={`w-full p-2.5 pr-28 rounded-xl border text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-white/40 ${
                        theme === 'light'
                          ? 'bg-white border-slate-300 text-slate-900'
                          : 'bg-[#111111] border-[#333333] text-white'
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 font-medium">
                      .vercel.app
                    </span>
                  </div>
                </div>
              </div>

              {/* Framework & Git status */}
              <div className={`p-3.5 rounded-xl border grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs ${
                theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#0f0f0f] border-[#222222]'
              }`}>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Framework</span>
                  <span className="font-mono font-bold text-cyan-400">Vite / React SPA</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Source Branch</span>
                  <span className="font-mono font-bold text-emerald-400">main (production)</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Edge Region</span>
                  <span className="font-mono font-bold text-amber-400">iad1 (Washington D.C.)</span>
                </div>
              </div>

              {/* Deploy Action Button */}
              {deployStep !== 'success' && (
                <button
                  type="button"
                  onClick={handleStartDeploy}
                  disabled={isDeploying || !projectName.trim()}
                  className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                    isDeploying
                      ? 'bg-white/20 text-white cursor-wait'
                      : 'bg-white hover:bg-slate-200 text-slate-950 shadow-white/10 font-black'
                  }`}
                >
                  {isDeploying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>Deploying to Vercel Global Edge...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 text-black fill-black" />
                      <span>Deploy to Vercel</span>
                    </>
                  )}
                </button>
              )}

              {/* Build Logs Terminal */}
              {(isDeploying || logs.length > 0) && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      Vercel Build Logs
                    </span>
                    {isDeploying && (
                      <span className="text-[11px] text-cyan-400 animate-pulse font-bold">
                        Streaming logs...
                      </span>
                    )}
                  </div>
                  <div className="p-4 rounded-xl bg-[#050505] border border-[#222222] font-mono text-[11px] leading-relaxed max-h-52 overflow-y-auto space-y-1 text-slate-300">
                    {logs.map((log, index) => (
                      <div 
                        key={index} 
                        className={
                          log.startsWith('🚀') ? 'text-emerald-400 font-bold' :
                          log.startsWith('✓') ? 'text-emerald-300 font-semibold' :
                          log.startsWith('▲') ? 'text-white font-bold' :
                          'text-slate-400'
                        }
                      >
                        {log}
                      </div>
                    ))}
                    <div ref={logsEndRef} />
                  </div>
                </div>
              )}

              {/* Success Result Box */}
              {deployStep === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-300">
                        Deployment Live & Ready!
                      </h4>
                      <p className="text-xs text-slate-300">
                        Your application has been deployed to the Vercel Edge Network.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="flex-1 w-full p-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-cyan-300 truncate">
                      {currentLiveUrl}
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={handleCopy}
                        className="flex-1 sm:flex-initial px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all"
                      >
                        {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                      </button>
                      <a
                        href={currentLiveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        <span>Visit Site</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>SSL: Active (Let's Encrypt)</span>
                    <button
                      onClick={() => setDeployStep('idle')}
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Deploy New Update</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* TAB 2: DEPLOYMENT HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                <span>Recent Deployments</span>
                <span className="font-mono">{deployments.length} deployments</span>
              </div>

              <div className="space-y-2.5">
                {deployments.map((d) => (
                  <div
                    key={d.id}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#0f0f0f] border-[#222222]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <a
                          href={d.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-xs font-bold text-white hover:underline flex items-center gap-1"
                        >
                          <span>{d.url.replace('https://', '')}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      </div>
                      <div className="text-xs text-slate-400 font-medium">{d.commit}</div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <GitBranch className="w-3 h-3" /> {d.branch}
                        </span>
                        <span>•</span>
                        <span>Built in {d.duration}</span>
                        <span>•</span>
                        <span>{d.timestamp}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                        Ready
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ENVIRONMENT VARIABLES */}
          {activeTab === 'env' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 leading-relaxed">
                These environment variables are automatically loaded into your Vercel deployment and available in the browser via <code>import.meta.env</code>:
              </div>

              <div className="space-y-2 font-mono text-xs">
                {[
                  { key: 'VITE_FIREBASE_API_KEY', val: 'AIzaSyD-FURSAD-BOOKSTORE-API-KEY' },
                  { key: 'VITE_FIREBASE_PROJECT_ID', val: 'fursad-bookhouse-prod' },
                  { key: 'VITE_SUPABASE_URL', val: 'https://xyqptnmwlbdf.supabase.co' },
                  { key: 'VITE_SUPABASE_ANON_KEY', val: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fursad-anon-key' },
                  { key: 'DATABASE_URL', val: 'postgres://postgres:fursad@db.xyqptnmwlbdf.supabase.co:5432/postgres' },
                ].map((env, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                      theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#0f0f0f] border-[#222222]'
                    }`}
                  >
                    <span className="text-cyan-400 font-bold truncate">{env.key}</span>
                    <span className="text-slate-400 truncate max-w-[200px] sm:max-w-xs">{env.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex items-center justify-between shrink-0 text-xs ${
          theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#0a0a0a] border-[#222222]'
        }`}>
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>Automatic SSL & CDN Edge Routing</span>
          </div>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              theme === 'light' ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-[#222222] hover:bg-[#333333] text-white'
            }`}
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
