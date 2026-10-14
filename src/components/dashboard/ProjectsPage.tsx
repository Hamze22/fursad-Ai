import React from 'react';
import { motion } from 'framer-motion';
import { 
  FolderCode, 
  MoreVertical, 
  ExternalLink, 
  Clock, 
  Plus, 
  Search,
  LayoutGrid,
  Trash2,
  Share2,
  Play
} from 'lucide-react';
import { ProjectState, LanguageType } from '../../types.ts';

export const ProjectsPage: React.FC<{ 
  projects: ProjectState[]; 
  language: LanguageType;
  onNewProject: () => void;
  onOpenProject: (p: ProjectState) => void;
}> = ({ projects, language, onNewProject, onOpenProject }) => {
  const isSo = language === 'so';

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white">{isSo ? 'Mashaariicdayda' : 'My Projects'}</h1>
          <p className="text-slate-400">{isSo ? 'Maamul oo tafatir mashaariicdaada AI.' : 'Manage and refine your AI-generated applications.'}</p>
        </div>
        
        <button 
          onClick={onNewProject}
          className="bg-cyan-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-cyan-400 transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-5 h-5" />
          {isSo ? 'Mashruuc Cusub' : 'New Project'}
        </button>
      </div>

      {/* Filter/Search Bar */}
      <div className="flex items-center gap-4 bg-slate-900/30 border border-white/5 p-2 rounded-2xl backdrop-blur-xl">
        <div className="relative flex-1 group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
           <input 
             type="text" 
             placeholder={isSo ? 'Raadi mashaariicda...' : 'Search projects...'} 
             className="w-full pl-12 pr-4 py-2 bg-transparent border-none text-sm outline-none placeholder:text-slate-600"
           />
        </div>
        <div className="w-px h-6 bg-white/10 hidden md:block"></div>
        <div className="flex items-center gap-1 p-1 bg-black/20 rounded-xl hidden md:flex">
           <button className="p-2 bg-white/5 text-white rounded-lg shadow-sm"><LayoutGrid className="w-4 h-4" /></button>
           <button className="p-2 text-slate-500 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {projects.map((project, idx) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onOpenProject(project)}
              className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-8 flex flex-col group hover:border-cyan-500/30 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-cyan-400 transition-colors">
                  <FolderCode className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1">
                   <button className="p-2 text-slate-600 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); /* share logic */ }}><Share2 className="w-4 h-4" /></button>
                   <button className="p-2 text-slate-600 hover:text-rose-500 transition-colors" onClick={(e) => { e.stopPropagation(); /* delete logic */ }}><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              
              <h3 className="text-xl font-black text-white mb-2 group-hover:text-cyan-400 transition-colors truncate">
                {project.name}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-1 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                 <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-500 transition-all">
                    <Play className="w-3.5 h-3.5 fill-current" />
                 </div>
              </div>
              
              {/* Status Indicator */}
              <div className="absolute top-0 right-0 p-4">
                 <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                    project.status === 'deployed' || project.status === 'completed'
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                 }`}>
                    {project.status}
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-40 flex flex-col items-center justify-center text-center space-y-6">
           <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 border border-white/5 flex items-center justify-center text-slate-700">
              <FolderCode className="w-10 h-10" />
           </div>
           <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">{isSo ? 'Ma jiraan mashaariic' : 'No projects yet'}</h3>
              <p className="text-slate-500 max-w-xs">{isSo ? 'Bilow dhismaha mashruucaagii ugu horeeyay adoo isticmaalaya AI-ga.' : 'Start your first project and watch the AI bring your vision to life.'}</p>
           </div>
           <button 
             onClick={onNewProject}
             className="px-8 py-3 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-cyan-400 hover:text-white transition-all shadow-xl shadow-white/5"
           >
             {isSo ? 'Dhis Mashruucii Koowaad' : 'Create First Project'}
           </button>
        </div>
      )}
    </div>
  );
};
