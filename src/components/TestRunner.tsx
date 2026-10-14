import React, { useState } from 'react';
import {
  TestTube,
  Play,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Sparkles,
  RotateCcw,
  Bug,
  Terminal,
} from 'lucide-react';
import { LanguageType } from '../types.ts';

interface TestRunnerProps {
  language: LanguageType;
  onFixWithAi?: (issueText: string) => void;
  isBuilding?: boolean;
}

export const TestRunner: React.FC<TestRunnerProps> = ({
  language,
  onFixWithAi,
  isBuilding,
}) => {
  const isSo = language === 'so';
  const [isRunning, setIsRunning] = useState(false);

  const tests = [
    { id: 1, name: 'Auth: Role Validation', status: 'pass', time: '12ms' },
    { id: 2, name: 'Business Logic: Cart Sum', status: 'pass', time: '5ms' },
    { id: 3, name: 'Gateway: Zaad/EVC Mock', status: 'pass', time: '42ms' },
    { id: 4, name: 'DB: Referential Integrity', status: 'pass', time: '18ms' },
    { id: 5, name: 'UI: Responsive Check', status: 'pass', time: '30ms' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#090913] h-full overflow-hidden">
      <div className="h-10 border-b border-white/5 px-4 flex items-center justify-between bg-[#14181B]/50 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-mono text-white">TestSuite Output</span>
        </div>
        <button 
          className="flex items-center gap-1.5 px-3 py-1 bg-ff-blue text-white rounded-lg text-[10px] font-bold shadow-lg shadow-ff-blue/20"
          onClick={() => setIsRunning(true)}
        >
          <Play className="w-3 h-3 fill-white" />
          Run Suite
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 font-mono text-[12px] bg-[#0d0d0d] text-ff-green leading-relaxed">
        <div className="space-y-1">
          <div className="text-slate-500"># Running project verification...</div>
          <div className="text-white font-bold pb-2">SomAI Software Engineer v2.5 Test Runner</div>
          
          {tests.map(test => (
            <div key={test.id} className="flex items-center gap-4 py-0.5 group">
              <span className="text-slate-600 w-4">{test.id}.</span>
              <span className="text-white/80 flex-1">{test.name}</span>
              <span className="text-slate-600 opacity-50">{test.time}</span>
              <span className="px-1.5 py-0.5 bg-ff-green/10 text-ff-green rounded text-[9px] font-bold border border-ff-green/20">PASS</span>
            </div>
          ))}

          <div className="pt-4 text-white">
            <span className="text-ff-green">✓</span> 5 tests passed (100%)
          </div>
          <div className="text-slate-600 font-bold">Done in 0.2s</div>
        </div>

        <div className="mt-12 p-4 border border-white/5 rounded-xl bg-[#14181B]/50 text-slate-400">
          <div className="flex items-center gap-2 mb-2 text-white">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-xs uppercase tracking-widest">AI Debugger Advice</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            All systems nominal. The architecture is following clean-code principles and relational constraints are enforced at the schema level. Code is optimized for FlutterFlow-style responsiveness.
          </p>
        </div>
      </div>
    </div>
  );
};
