import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Rocket, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  GitBranch, 
  Database, 
  Server, 
  Flame, 
  Zap, 
  RefreshCw, 
  Copy, 
  Check, 
  ArrowUpRight,
  ShieldCheck,
  Terminal,
  Activity,
  Plus
} from 'lucide-react';
import { User, ProjectState } from '../../types.ts';
import { VercelDeployModal } from '../deploy/VercelDeployModal.tsx';
import { GitHubModal } from '../integrations/GitHubModal.tsx';
import { DatabaseManager } from '../database/DatabaseManager.tsx';

interface DeploymentsPageProps {
  user?: User | null;
  projects?: ProjectState[];
  onOpenProject?: (p: ProjectState) => void;
  language?: string;
  theme?: 'light' | 'dark';
}

export const DeploymentsPage: React.FC<DeploymentsPageProps> = ({
  user,
  projects = [],
  onOpenProject,
  language = 'so',
  theme = 'dark'
}) => {
  const activeProj = projects[0] || {
    id: 'proj_default',
    name: 'Iftin Book House',
    files: {},
    messages: []
  } as any;

  const [showVercelModal, setShowVercelModal] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-slate-950 flex items-center justify-center font-black shadow-lg">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 76 65" fill="none">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Deployments & Cloud Infrastructure
              </h1>
              <p className="text-sm text-slate-400 font-medium">
                Vercel Global Edge Deployments, GitHub sync, and Firebase/Supabase Databases
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowGithubModal(true)}
            className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-2 transition-all"
          >
            {/* GitHub Octocat */}
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub Sync</span>
          </button>

          <button
            onClick={() => setShowDbModal(true)}
            className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Databases (Firebase & Supabase)</span>
          </button>

          <button
            onClick={() => setShowVercelModal(true)}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-white/10 active:scale-95"
          >
            <Rocket className="w-4 h-4 text-slate-950 fill-current" />
            <span>Deploy to Vercel</span>
          </button>
        </div>
      </div>

      {/* Cloud Infrastructure Status Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Vercel Status',
            value: 'Operational (Ready)',
            sub: '100% Edge Network Uptime',
            icon: Globe,
            accent: 'text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/20'
          },
          {
            title: 'GitHub Repository',
            value: 'somfxstore/iftin-book-house',
            sub: 'Branch: main (Clean)',
            icon: GitBranch,
            accent: 'text-blue-400',
            bg: 'bg-blue-500/10 border-blue-500/20'
          },
          {
            title: 'Firebase Database',
            value: 'Firestore & Auth',
            sub: '3 Collections, 4 Rules',
            icon: Flame,
            accent: 'text-amber-400',
            bg: 'bg-amber-500/10 border-amber-500/20'
          },
          {
            title: 'Supabase PostgreSQL',
            value: 'Active (4 Tables)',
            sub: 'Row Level Security Active',
            icon: Zap,
            accent: 'text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/20'
          }
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                {stat.title}
              </span>
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.accent}`} />
              </div>
            </div>
            <div className="text-sm font-bold text-white truncate">{stat.value}</div>
            <p className="text-xs text-slate-400 font-mono">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Active Production Deployment Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Production Deployment</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  READY
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Assigned to: <strong className="text-cyan-400">iftin-book-house.vercel.app</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy('https://iftin-book-house.vercel.app')}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-all"
            >
              {copiedUrl === 'https://iftin-book-house.vercel.app' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedUrl === 'https://iftin-book-house.vercel.app' ? 'Copied' : 'Copy URL'}</span>
            </button>

            <a
              href="https://iftin-book-house.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <span>Visit Production</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Deployment Meta Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Environment</span>
            <span className="font-bold text-white">Production (Edge)</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Git Commit</span>
            <span className="font-bold text-blue-400 truncate block">a7f920e (main)</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Build Duration</span>
            <span className="font-bold text-emerald-400">1.4s (Zero Cold Start)</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">SSL Certificate</span>
            <span className="font-bold text-slate-300">Valid (Let's Encrypt)</span>
          </div>
        </div>
      </div>

      {/* Deployment History Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Vercel Deployment History</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">Auto-deploy on git push</span>
        </div>

        <div className="rounded-2xl border border-white/10 overflow-hidden bg-slate-900/60 shadow-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 uppercase text-[10px] text-slate-400">
                <th className="p-4">Deployment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Branch</th>
                <th className="p-4">Commit Message</th>
                <th className="p-4">Time</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                {
                  id: 'dpl_prod_01',
                  url: 'iftin-book-house.vercel.app',
                  status: 'READY',
                  branch: 'main',
                  commit: 'feat: add Somali book catalog and responsive bookstore',
                  time: '10 min ago',
                  dur: '1.4s'
                },
                {
                  id: 'dpl_prev_02',
                  url: 'iftin-book-house-dev.vercel.app',
                  status: 'READY',
                  branch: 'dev',
                  commit: 'fix: optimize bookstore responsive styling on mobile',
                  time: '45 min ago',
                  dur: '1.2s'
                },
                {
                  id: 'dpl_init_03',
                  url: 'iftin-book-house-preview.vercel.app',
                  status: 'READY',
                  branch: 'main',
                  commit: 'init: bootstrap AI vibe-coding project',
                  time: '2 hours ago',
                  dur: '1.8s'
                }
              ].map((item, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <a
                      href={`https://${item.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline text-cyan-300"
                    >
                      {item.url}
                    </a>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {item.branch}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 max-w-xs truncate">{item.commit}</td>
                  <td className="p-4 text-slate-500">{item.time}</td>
                  <td className="p-4 text-right">
                    <a
                      href={`https://${item.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-slate-300 hover:text-white p-1"
                    >
                      <span>Visit</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <VercelDeployModal
        project={activeProj}
        isOpen={showVercelModal}
        onClose={() => setShowVercelModal(false)}
        theme={theme}
      />

      <GitHubModal
        project={activeProj}
        isOpen={showGithubModal}
        onClose={() => setShowGithubModal(false)}
        theme={theme}
      />

      {showDbModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl">
            <DatabaseManager
              files={activeProj.files}
              language="so"
              theme={theme}
              onClose={() => setShowDbModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
