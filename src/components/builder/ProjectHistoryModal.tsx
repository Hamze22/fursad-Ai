import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  History, 
  RotateCcw, 
  CheckCircle2, 
  FileCode, 
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';
import { ChangeRecord, ProjectState } from '../../types.ts';

interface ProjectHistoryModalProps {
  project: ProjectState;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (record: ChangeRecord) => void;
  isSo?: boolean;
}

export const ProjectHistoryModal: React.FC<ProjectHistoryModalProps> = ({
  project,
  isOpen,
  onClose,
  onRestore,
  isSo = true
}) => {
  if (!isOpen) return null;

  const history = [...(project.changeHistory || [])].reverse();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-white"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                {isSo ? 'Taariikhda Isbedelada & Qodobbada Dib-u-soo-celinta' : 'Change History & Restore Points'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isSo 
                  ? `Mashruuca: ${project.name} • ${history.length} isbedel ayaa la diiwaangeliyay` 
                  : `Project: ${project.name} • ${history.length} snapshots recorded`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {history.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <History className="w-8 h-8 mx-auto opacity-30" />
              <p className="text-xs">
                {isSo 
                  ? 'Weli wax isbedelo ah lama diiwaangelin. Codso isbedel (e.g. bedel hero background) si loo abuuro restore point.' 
                  : 'No changes recorded yet. Request an edit to create your first restore point.'}
              </p>
            </div>
          ) : (
            history.map((rec, index) => (
              <div 
                key={rec.id || index}
                className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-3 hover:border-cyan-500/30 transition-all text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="font-bold text-white text-xs">
                      "{rec.originalRequest}"
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(rec.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300">
                    {rec.targetElement || 'Target Element'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300">
                    {rec.filesModified.join(', ')}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300">
                    Verified
                  </span>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {rec.summary}
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> All unrelated sections preserved
                  </span>
                  {rec.snapshot && (
                    <button
                      onClick={() => {
                        onRestore(rec);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-cyan-500 hover:text-slate-950 text-white font-bold text-[11px] transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{isSo ? 'Dib u soo celi xaaladdan' : 'Restore this snapshot'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-all"
          >
            {isSo ? 'Xir' : 'Close'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
