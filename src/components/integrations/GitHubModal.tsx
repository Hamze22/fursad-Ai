import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  UploadCloud, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Clock, 
  FolderGit2, 
  FileCode2,
  AlertCircle,
  RefreshCw,
  Terminal
} from 'lucide-react';
import { ProjectState } from '../../types.ts';

interface GitHubModalProps {
  project: ProjectState;
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

interface CommitItem {
  id: string;
  hash: string;
  message: string;
  author: string;
  date: string;
  branch: string;
  filesCount: number;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({
  project,
  isOpen,
  onClose,
  theme = 'dark'
}) => {
  const [repoName, setRepoName] = useState(() => {
    const safeName = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `somfxstore/${safeName || 'iftin-book-house'}`;
  });
  const [selectedBranch, setSelectedBranch] = useState<'main' | 'dev' | 'staging'>('main');
  const [commitMessage, setCommitMessage] = useState('feat: update project layout and responsive bookstore components');
  const [isPushing, setIsPushing] = useState(false);
  const [pushSuccess, setPushSuccess] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);
  const [activeTab, setActiveTab] = useState<'push' | 'history' | 'settings'>('push');

  const [commits, setCommits] = useState<CommitItem[]>([
    {
      id: 'c1',
      hash: 'a7f920e',
      message: 'feat: add Somali book catalog and responsive bookstore motion preview',
      author: 'You (demo)',
      date: '5 minutes ago',
      branch: 'main',
      filesCount: Object.keys(project.files).length || 8
    },
    {
      id: 'c2',
      hash: 'd3c411b',
      message: 'init: bootstrap AI vibe-coding project with Tailwind & Lucide icons',
      author: 'FURSAD AI Engine',
      date: '30 minutes ago',
      branch: 'main',
      filesCount: 6
    }
  ]);

  if (!isOpen) return null;

  const repoUrl = `https://github.com/${repoName}`;
  const cloneCommand = `git clone ${repoUrl}.git`;

  const handleCopyClone = () => {
    navigator.clipboard.writeText(cloneCommand).catch(() => {});
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const handlePush = () => {
    if (!commitMessage.trim()) return;
    setIsPushing(true);
    setPushSuccess(false);

    setTimeout(() => {
      const newHash = Math.random().toString(16).substring(2, 9);
      const newCommit: CommitItem = {
        id: `c_${Date.now()}`,
        hash: newHash,
        message: commitMessage.trim(),
        author: 'You (demo)',
        date: 'Just now',
        branch: selectedBranch,
        filesCount: Object.keys(project.files).length
      };

      setCommits([newCommit, ...commits]);
      setIsPushing(false);
      setPushSuccess(true);
      setCommitMessage('');
      setTimeout(() => setPushSuccess(false), 4000);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden ${
          theme === 'light' 
            ? 'bg-white border-slate-300 text-slate-900 shadow-slate-300/60' 
            : 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9] shadow-2xl'
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
          theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#161b22] border-[#30363d]'
        }`}>
          <div className="flex items-center gap-3">
            {/* GitHub Octocat SVG */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              theme === 'light' ? 'bg-slate-900 text-white' : 'bg-white text-slate-950'
            }`}>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">GitHub Integration</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  Connected
                </span>
              </div>
              <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-[#8b949e]'}`}>
                Version control and continuous sync for <span className="font-mono font-semibold">{project.name}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              theme === 'light' ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-[#30363d] text-[#8b949e]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={`px-6 pt-3 flex gap-4 border-b shrink-0 ${
          theme === 'light' ? 'border-slate-200 bg-slate-100/60' : 'border-[#30363d] bg-[#161b22]/50'
        }`}>
          <button
            onClick={() => setActiveTab('push')}
            className={`pb-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'push'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Commit & Push</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitCommit className="w-4 h-4" />
            <span>Commit Log ({commits.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>Repository Info</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: PUSH */}
          {activeTab === 'push' && (
            <div className="space-y-4">
              {/* Repository bar */}
              <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#161b22] border-[#30363d]'
              }`}>
                <div className="flex items-center gap-2.5">
                  <FolderGit2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="truncate font-mono text-xs">
                    <span className="text-slate-400">repo:</span>{' '}
                    <span className="font-bold text-blue-400">{repoName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Branch:</span>
                  <select 
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value as any)}
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                      theme === 'light'
                        ? 'bg-white border-slate-300 text-slate-800'
                        : 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9]'
                    }`}
                  >
                    <option value="main">main (production)</option>
                    <option value="dev">dev</option>
                    <option value="staging">staging</option>
                  </select>
                </div>
              </div>

              {/* Status info */}
              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                theme === 'light' ? 'bg-blue-50/70 border-blue-200 text-blue-900' : 'bg-blue-950/30 border-blue-800/40 text-blue-300'
              }`}>
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>
                    <strong>{Object.keys(project.files).length} files</strong> in project ready for version tracking.
                  </span>
                </div>
                <span className="font-mono text-[11px] opacity-80">HEAD -&gt; {selectedBranch}</span>
              </div>

              {/* Commit Message Box */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                  Commit Message:
                </label>
                <textarea
                  rows={3}
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="e.g. feat: add new bookstore UI with search and cart"
                  className={`w-full p-3 rounded-xl border text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                    theme === 'light'
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9]'
                  }`}
                />
              </div>

              {/* Push Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePush}
                  disabled={isPushing || !commitMessage.trim()}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                    isPushing
                      ? 'bg-blue-500/50 text-white cursor-wait'
                      : 'bg-[#238636] hover:bg-[#2ea043] text-white'
                  }`}
                >
                  {isPushing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Pushing to GitHub...</span>
                    </>
                  ) : (
                    <>
                      <GitPullRequest className="w-4 h-4" />
                      <span>Commit & Push to {selectedBranch}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2 text-xs">
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-400 hover:underline font-mono"
                  >
                    <span>Open GitHub Repo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Success Notification */}
              <AnimatePresence>
                {pushSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Demo only: nothing was sent to <strong>{repoName}</strong>. Push your exported project with git to publish it for real.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* TAB 2: COMMIT LOG */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                <span>Recent Commits</span>
                <span className="font-mono">{commits.length} commits</span>
              </div>

              <div className="space-y-2.5">
                {commits.map((c) => (
                  <div 
                    key={c.id}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors ${
                      theme === 'light' ? 'bg-slate-50 border-slate-200 hover:border-blue-400' : 'bg-[#161b22] border-[#30363d] hover:border-slate-500'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-400 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                          {c.hash}
                        </span>
                        <span className="text-xs font-semibold">{c.message}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                        <span>{c.author}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {c.date}
                        </span>
                        <span>•</span>
                        <span className="text-slate-500">{c.filesCount} files</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {c.branch}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS & CLONE */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                  GitHub Repository:
                </label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                    theme === 'light'
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9]'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                  Clone URL:
                </label>
                <div className="flex items-center gap-2">
                  <div className={`flex-1 p-2.5 rounded-xl border font-mono text-xs truncate ${
                    theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-[#0d1117] border-[#30363d] text-[#8b949e]'
                  }`}>
                    {cloneCommand}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyClone}
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shrink-0"
                    title="Copy clone command"
                  >
                    {copiedClone ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className={`p-4 rounded-xl border space-y-2 text-xs ${
                theme === 'light' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-950/30 border-amber-800/40 text-amber-200'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  <span>Local Development Sync</span>
                </div>
                <p className="leading-relaxed opacity-90">
                  You can clone this repository locally, install dependencies via <code>npm install</code>, and run <code>npm run dev</code>. Any commits pushed to <code>main</code> will trigger auto-deployments to Vercel.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex items-center justify-between shrink-0 text-xs ${
          theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#161b22] border-[#30363d]'
        }`}>
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>GitHub Webhook Active (Auto-sync to Vercel)</span>
          </div>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              theme === 'light' ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9]'
            }`}
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
