import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  Folder, 
  User, 
  MoreVertical, 
  ArrowRight,
  ExternalLink,
  Clock,
  Settings,
  LogOut,
  Bell,
  Activity,
  Cpu
} from 'lucide-react';
import { ProjectState } from '../types.ts';

interface DashboardProps {
  onNewProject: () => void;
  onOpenProject: (p: any) => void;
  onLogout: () => void;
  isSo: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onNewProject, 
  onOpenProject, 
  onLogout,
  isSo 
}) => {
  const projects: any[] = [];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col pb-20 md:pb-0 relative overflow-hidden">
      <div className="absolute inset-0 tech-grid pointer-events-none opacity-10"></div>

      {/* Desktop Header */}
      <header className="hidden md:flex h-20 bg-brand-bg/50 border-b border-white/5 px-10 items-center justify-between sticky top-0 z-40 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary border border-brand-primary/20">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <h1 className="font-black text-sm uppercase tracking-[0.2em] text-white">Neural Hub</h1>
        </div>

        <div className="flex-1 max-w-md mx-12 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
          <input 
            type="text" 
            placeholder="SCAN PROJECTS..." 
            className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-2xl text-xs font-mono focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all placeholder:text-slate-700"
          />
        </div>

        <div className="flex items-center gap-6">
          <button className="p-2 text-slate-500 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full border-2 border-brand-bg shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
          </button>
          
          <button className="flex items-center gap-3 group px-4 py-2 bg-white/5 border border-white/5 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-black text-xs">
              AH
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-[10px] font-black text-white uppercase tracking-wider">Ahmed Hassan</div>
              <div className="text-[9px] text-slate-500 font-mono">LEVEL 5 ARCHITECT</div>
            </div>
          </button>
          <button onClick={onLogout} className="p-2 text-slate-500 hover:text-rose-500 transition-colors" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <div className="md:hidden p-6 flex items-center justify-between bg-brand-bg/50 border-b border-white/5 sticky top-0 z-40 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white shadow-lg">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-black text-white text-lg tracking-tighter">AI BUILDER</span>
        </div>
        <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <User className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <main className="flex-1 p-6 md:p-16 max-w-7xl mx-auto w-full space-y-12 relative z-10">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-brand-primary/20 via-transparent to-tech-purple/5 rounded-[3rem] p-10 md:p-16 border border-white/5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px]"></div>
          <div className="space-y-6 text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-black border border-brand-primary/20 uppercase tracking-[0.2em]">
              Ready for Input
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
              Initialize Your <br /> Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-tech-cyan">Cyber-Asset</span>
            </h2>
            <p className="text-slate-400 max-w-md font-medium text-lg">
              The AI Engine is standing by. Feed your vision into the neural network.
            </p>
            <button 
              onClick={onNewProject}
              className="bg-white hover:bg-slate-100 text-black px-10 py-5 rounded-[2rem] font-black text-lg shadow-2xl transition-all flex items-center gap-3 mx-auto md:mx-0 active:scale-95 group/btn"
            >
              <Plus className="w-6 h-6 group-hover/btn:rotate-90 transition-transform" />
              New Deployment
            </button>
          </div>
          <div className="hidden lg:flex w-64 h-64 bg-white/5 rounded-[3rem] items-center justify-center border border-white/5 backdrop-blur-2xl relative">
            <Cpu className="w-24 h-24 text-white/10 animate-pulse" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
              className="absolute inset-0 border-2 border-dashed border-brand-primary/20 rounded-[3rem]"
            />
          </div>
        </motion.div>

        {/* Recent Projects Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-4">
              Active Deployments
              <div className="h-px w-24 bg-white/5"></div>
            </h3>
            <button className="text-[10px] font-black text-brand-primary flex items-center gap-2 uppercase tracking-widest hover:text-white transition-colors">
              Expand All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                onClick={() => onOpenProject(project)}
                className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-brand-primary/30 hover:bg-white/[0.08] transition-all group cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-14 h-14 rounded-2xl ${project.color} flex items-center justify-center text-2xl border`}>
                    {project.icon}
                  </div>
                  <button className="p-2 text-slate-700 hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                <h4 className="font-black text-white text-xl mb-2 group-hover:text-brand-primary transition-colors tracking-tight">{project.name}</h4>
                <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {project.date}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md ${
                    project.status === 'Live' ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-400 bg-white/5'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between font-mono">
                  <span className="text-[10px] text-slate-700">SRID-{project.id}0{project.id}</span>
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-24 bg-brand-bg/80 border-t border-white/5 flex items-center justify-around px-8 z-50 backdrop-blur-2xl">
        <button className="flex flex-col items-center gap-2 text-brand-primary">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center border border-brand-primary/20">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Core</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-slate-500">
          <div className="w-12 h-12 rounded-2xl hover:bg-white/5 flex items-center justify-center transition-colors">
            <Folder className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Files</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-slate-500">
          <div className="w-12 h-12 rounded-2xl hover:bg-white/5 flex items-center justify-center transition-colors">
            <User className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">User</span>
        </button>
      </nav>
    </div>
  );
};


const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
  </svg>
);
