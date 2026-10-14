import React, { useState } from 'react';
import { 
  CheckCircle2, 
  RotateCcw, 
  Code2, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  FileText, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ChangeRecord } from '../../types.ts';

interface ChangeRecordCardProps {
  record: ChangeRecord;
  onUndo: (record: ChangeRecord) => void;
  isSo?: boolean;
}

export const ChangeRecordCard: React.FC<ChangeRecordCardProps> = ({
  record,
  onUndo,
  isSo = true
}) => {
  const [showDiff, setShowDiff] = useState(false);
  const [undone, setUndone] = useState(false);

  const handleUndoClick = () => {
    onUndo(record);
    setUndone(true);
  };

  return (
    <div 
      className="mt-2.5 pt-2 border-t border-slate-300 space-y-1.5 text-xs text-black"
      style={{ color: '#000000' }}
    >
      {/* Summary line directly in chat text */}
      {record.summary && (
        <div className="flex items-start gap-1.5 text-black font-bold leading-relaxed" style={{ color: '#000000' }}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span className="text-black font-bold" style={{ color: '#000000' }}>{record.summary}</span>
        </div>
      )}

      {/* Validation checklist items directly in chat with green checkmarks */}
      {record.validation?.checks && record.validation.checks.length > 0 && (
        <div className="space-y-1 pl-5">
          {record.validation.checks.map((check, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-black text-[11px] font-semibold" style={{ color: '#000000' }}>
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="text-black font-semibold" style={{ color: '#000000' }}>{check}</span>
            </div>
          ))}
        </div>
      )}

      {/* Subtle inline details (files modified & undo button) */}
      <div className="flex flex-wrap items-center gap-2 pl-5 pt-1 text-[11px] text-black font-semibold" style={{ color: '#000000' }}>
        {record.filesModified && record.filesModified.length > 0 && (
          <span className="text-black font-semibold" style={{ color: '#000000' }}>
            Faylasha:{' '}
            <span className="font-mono text-black font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300" style={{ color: '#000000' }}>
              {record.filesModified.join(', ')}
            </span>
          </span>
        )}
        
        {record.snapshot && (
          <>
            <span className="text-slate-400">•</span>
            <button
              onClick={handleUndoClick}
              disabled={undone}
              className={`inline-flex items-center gap-1 text-[11px] font-bold transition-colors ${
                undone
                  ? 'text-slate-400 cursor-not-allowed'
                  : 'text-black hover:text-rose-600 underline decoration-slate-400 hover:decoration-rose-500'
              }`}
              style={{ color: undone ? undefined : '#000000' }}
              title="Revert changes"
            >
              <RotateCcw className="w-3 h-3 text-black" />
              <span className="text-black font-bold" style={{ color: '#000000' }}>{undone ? (isSo ? 'Dib ayaa loo celiyay' : 'Restored') : (isSo ? 'Dib u celi (Undo)' : 'Undo')}</span>
            </button>
          </>
        )}

        {(record.beforeSnippet || record.afterSnippet) && (
          <>
            <span className="text-slate-400">•</span>
            <button
              onClick={() => setShowDiff(!showDiff)}
              className="text-[11px] text-black hover:text-blue-600 underline decoration-slate-400 flex items-center gap-0.5 font-bold"
              style={{ color: '#000000' }}
            >
              <Code2 className="w-3 h-3 text-black" />
              <span className="text-black font-bold" style={{ color: '#000000' }}>{showDiff ? (isSo ? 'Qari code diff' : 'Hide Diff') : (isSo ? 'Arag code diff' : 'View Diff')}</span>
            </button>
          </>
        )}
      </div>

      {/* Optional Before-and-After Code Snippet Diff */}
      {showDiff && (record.beforeSnippet || record.afterSnippet) && (
        <div className="mt-2 ml-5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[10px] space-y-2">
          {record.beforeSnippet && (
            <div>
              <span className="text-rose-600 dark:text-rose-400 font-bold block mb-0.5">- Kahor:</span>
              <pre className="text-rose-700 dark:text-rose-300 whitespace-pre-wrap bg-rose-50 dark:bg-rose-950/20 p-2 rounded-lg border border-rose-200 dark:border-rose-900/30">
                {record.beforeSnippet}
              </pre>
            </div>
          )}
          {record.afterSnippet && (
            <div>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-0.5">+ Kadib:</span>
              <pre className="text-emerald-700 dark:text-emerald-300 whitespace-pre-wrap bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900/30">
                {record.afterSnippet}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
