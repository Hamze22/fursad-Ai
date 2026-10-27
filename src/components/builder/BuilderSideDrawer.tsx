import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Settings, 
  LayoutDashboard, 
  CreditCard, 
  User as UserIcon, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  FolderCode, 
  ExternalLink, 
  Moon, 
  Sun, 
  ShieldCheck, 
  LogOut, 
  ChevronRight,
  Plus,
  Play,
  GraduationCap,
  Layers,
  Sliders,
  DollarSign,
  Cpu,
  Eye
} from 'lucide-react';
import { User, AppView, ProjectState } from '../../types.ts';

interface BuilderSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  currentProject: ProjectState;
  projects?: ProjectState[];
  onSelectProject?: (p: ProjectState) => void;
  onNavigateView: (view: AppView) => void;
  onGoHome: () => void;
  onLogout: () => void;
}

export const BuilderSideDrawer: React.FC<BuilderSideDrawerProps> = ({
  isOpen,
  onClose,
  user,
  currentProject,
  projects = [],
  onNavigateView,
  onGoHome,
  onLogout,
  onSelectProject
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'payment' | 'account'>('dashboard');
  const [credits, setCredits] = useState(user?.credits || 75);
  const [showTopUpToast, setShowTopUpToast] = useState(false);
  const [fontSize, setFontSize] = useState<'12' | '13' | '14'>('13');
  const [autoSave, setAutoSave] = useState(true);
  const [aiModel, setAiModel] = useState('Gemini 2.5 Flash');

  const handleTopUp = () => {
    setCredits(prev => Math.min(100, prev + 25));
    setShowTopUpToast(true);
    setTimeout(() => setShowTopUpToast(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end font-sans">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Side Page Drawer */}
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-md sm:max-w-lg bg-slate-950 border-l border-slate-800/90 text-white flex flex-col h-full shadow-2xl z-10 overflow-hidden"
        >
          {/* Drawer Top Header */}
          <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Il Control Hub</h3>
                <p className="text-[10px] font-mono text-slate-400">System, Account &amp; Payments</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={onGoHome}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-bold transition-all"
                title="Back to start / Home"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <button 
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User mini badge */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-slate-950 border-b border-slate-800/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-blue-500/20">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">{user?.fullName || 'Ahmed Hassan'}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-blue-400 font-mono font-bold uppercase tracking-wider">
                    {user?.plan === 'pro' ? '★ Pro Builder Plan' : 'First Access Member'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold font-mono text-blue-400">{credits}/100</div>
              <div className="text-[9px] text-slate-400 uppercase tracking-widest">AI Credits</div>
            </div>
          </div>

          {/* Drawer Navigation Tabs */}
          <div className="h-12 px-4 border-b border-slate-800/80 bg-slate-950 flex items-center gap-1.5 shrink-0 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('payment')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'payment'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payment</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('account')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'account'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Account</span>
            </button>
          </div>

          {/* Toast Notification */}
          <AnimatePresence>
            {showTopUpToast && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-6 mt-3 p-3 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>+25 AI Credits added to your account!</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Drawer Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            
            {/* TAB 1: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Projects</p>
                    <h5 className="text-xl font-black text-white mt-1 font-mono">{projects.length || 1}</h5>
                  </div>
                  <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Generations</p>
                    <h5 className="text-xl font-black text-blue-400 mt-1 font-mono">14</h5>
                  </div>
                  <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vibe Coding Course</p>
                    <h5 className="text-xl font-black text-emerald-400 mt-1 font-mono">{user?.courseProgress || 25}%</h5>
                  </div>
                  <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sandbox Engine</p>
                    <h5 className="text-xs font-bold text-slate-200 mt-2 font-mono flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Active Live
                    </h5>
                  </div>
                </div>

                {/* Current Project Info */}
                <div className="p-4 bg-blue-950/30 border border-blue-500/30 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Active Workspace Project</span>
                    <span className="text-[10px] font-mono text-slate-400">{Object.keys(currentProject.files).length} files</span>
                  </div>
                  <h4 className="font-bold text-base text-white">{currentProject.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{currentProject.description}</p>
                </div>

                {/* Quick Navigation into Main App Views */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Navigation</h5>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateView('projects');
                      }}
                      className="w-full flex items-center justify-between p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <FolderCode className="w-4 h-4 text-blue-400" />
                        <span>All My Projects</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onNavigateView('course');
                      }}
                      className="w-full flex items-center justify-between p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <GraduationCap className="w-4 h-4 text-blue-400" />
                        <span>Full-Stack Vibe Coding Course</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                    </button>

                  </div>
                </div>

                {/* Switch to other projects if any */}
                {projects.length > 1 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Switch Project</h5>
                    <div className="space-y-1.5">
                      {projects.filter(p => p.id !== currentProject.id).slice(0, 3).map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            if (onSelectProject) onSelectProject(p);
                            onClose();
                          }}
                          className="w-full p-2.5 bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 rounded-xl text-left flex items-center justify-between transition-all"
                        >
                          <span className="text-xs font-medium text-slate-300 truncate max-w-[240px]">{p.name}</span>
                          <Play className="w-3 h-3 text-blue-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PAYMENT & BILLING */}
            {activeTab === 'payment' && (
              <div className="space-y-6 animate-fade-in">
                {/* Active Plan Card */}
                <div className="p-5 bg-gradient-to-br from-blue-950/60 via-slate-900 to-indigo-950/40 border border-blue-500/40 rounded-3xl relative overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                      Active Subscription
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">Auto-renews</span>
                  </div>
                  <h4 className="text-2xl font-black text-white">$10<span className="text-sm text-slate-400 font-normal">/month Pro</span></h4>
                  <p className="text-xs text-slate-300 mt-1">Unlimited AI generations, Monaco code editor, cloud deployments & full project storage.</p>
                  
                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-400">First Access License:</span>
                    <span className="text-blue-300 font-bold">$25 Lifetime Active</span>
                  </div>
                </div>

                {/* AI Credits Balance & Top-up */}
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-sm text-white">AI Credits Balance</h5>
                      <p className="text-xs text-slate-400 font-mono">Used for smart code generations</p>
                    </div>
                    <span className="text-xl font-black text-blue-400 font-mono">{credits} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400" style={{ width: `${credits}%` }}></div>
                  </div>
                  <button 
                    onClick={handleTopUp}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Top-up +25 AI Credits ($5.00)</span>
                  </button>
                </div>

                {/* Payment Abstraction & Method */}
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      <span className="font-bold text-xs text-white">Payment Method</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">CONNECTED</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-mono">
                      <span>•••• •••• •••• 4242</span>
                      <span className="text-slate-500 text-[10px]">VISA</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Expires 12/28</span>
                  </div>
                </div>

                {/* Open full billing page */}
                <button
                  onClick={() => {
                    onClose();
                    onNavigateView('billing');
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <span>Open Full Billing & Invoices Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* TAB 3: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fade-in">
                {/* Theme Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Application Theme</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      <span>Native Dark Blue</span>
                    </button>
                    <button className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs font-medium flex items-center gap-2 cursor-not-allowed opacity-50">
                      <Sun className="w-4 h-4" />
                      <span>Light Theme (Pro)</span>
                    </button>
                  </div>
                </div>

                {/* Editor Font Size */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Monaco Editor Font Size</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['12', '13', '14'] as const).map(size => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                          fontSize === size
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-900 border border-slate-800 text-slate-400'
                        }`}
                      >
                        {size}px
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Model Preference */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">AI Synthesis Engine</label>
                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-blue-400" />
                        Google Gemini 3.8 Flash
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">~350ms Ultra-Fast</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Next-generation Gemini 3.8 Flash engine optimized for real-time surgical updates, instant code generation, and low latency.
                    </p>
                  </div>
                </div>

                {/* Auto-save Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                  <div>
                    <h5 className="font-bold text-xs text-white">Live Auto-save</h5>
                    <p className="text-[10px] text-slate-400">Persist code changes immediately to preview</p>
                  </div>
                  <button 
                    onClick={() => setAutoSave(!autoSave)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-1 ${autoSave ? 'bg-blue-600' : 'bg-slate-800'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${autoSave ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Full settings link */}
                <button
                  onClick={() => {
                    onClose();
                    onNavigateView('settings');
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <span>Open Full Settings Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* TAB 4: ACCOUNT */}
            {activeTab === 'account' && (
              <div className="space-y-6 animate-fade-in">
                {/* Account Details Box */}
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Full Name</span>
                    <span className="text-xs font-bold text-white">{user?.fullName || 'Ahmed Hassan'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Email Address</span>
                    <span className="text-xs font-bold text-white font-mono">{user?.email || 'somfxstore@gmail.com'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Role</span>
                    <span className="text-xs font-bold text-blue-400">Full-Stack Architect</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Joined</span>
                    <span className="text-xs font-mono text-slate-300">2026 Access Cohort</span>
                  </div>
                </div>

                {/* Security Status */}
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Two-Factor Authentication Active</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Your account is verified and protected with encrypted session tokens.</p>
                </div>

                {/* Sign Out Action */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onLogout();
                    }}
                    className="w-full py-3 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of Account</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Bottom Bar: Back to Start / Home */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950 shrink-0 flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                onGoHome();
              }}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Start / Home (Hoyga)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
