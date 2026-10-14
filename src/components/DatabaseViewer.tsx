import React, { useState, useMemo } from 'react';
import { Database, Table, Grid3X3, Download, Layers } from 'lucide-react';
import { DbTable, LanguageType } from '../types.ts';

interface DatabaseViewerProps {
  files: Record<string, string>;
  language: LanguageType;
}

export const DatabaseViewer: React.FC<DatabaseViewerProps> = ({
  files,
  language,
}) => {
  const isSo = language === 'so';

  const tables: DbTable[] = useMemo(() => {
    // In a real app, we might parse schema.sql or api.ts to find tables
    // For now, we mock some based on the project content or common patterns
    return [
      {
        name: 'users',
        columns: ['id', 'email', 'full_name', 'created_at'],
        sampleRows: [
          { id: '1', email: 'admin@realai.dev', full_name: 'Admin User', created_at: '2026-10-01' },
          { id: '2', email: 'guest@example.com', full_name: 'Guest Tester', created_at: '2026-10-02' }
        ]
      },
      {
        name: 'projects',
        columns: ['id', 'user_id', 'title', 'status'],
        sampleRows: [
          { id: '101', user_id: '1', title: 'Analytics Dashboard', status: 'active' },
          { id: '102', user_id: '1', title: 'API Gateway', status: 'pending' }
        ]
      }
    ];
  }, [files]);

  const [selectedTable, setSelectedTable] = useState<string>(tables[0]?.name || '');
  const current = tables.find((t) => t.name === selectedTable) || tables[0];

  return (
    <div className="flex-1 flex h-full bg-[#090913] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
      {/* Sidebar */}
      <div className="w-60 bg-[#14181B] border-r border-white/5 flex flex-col shrink-0">
        <div className="h-12 px-4 flex items-center gap-2 border-b border-white/5">
          <Database className="w-4 h-4 text-cyan-400" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300 font-mono">PostgreSQL Explorer</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {tables.map((tbl) => (
            <button
              key={tbl.name}
              onClick={() => setSelectedTable(tbl.name)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono flex items-center gap-2.5 transition-all ${
                selectedTable === tbl.name
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Table className="w-4 h-4 opacity-70" />
              <span className="truncate">{tbl.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col bg-[#030712]">
        <div className="h-12 border-b border-white/5 px-6 flex items-center justify-between bg-[#14181B]/30 shrink-0">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-white font-bold uppercase">
              Table: <span className="text-cyan-400">{selectedTable}</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono ml-2 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
              {current?.sampleRows?.length || 0} rows
            </span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-slate-300 transition-all font-mono">
            <Download className="w-3.5 h-3.5" />
            SQL Export
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {current ? (
            <div className="rounded-2xl border border-white/5 overflow-hidden shadow-2xl bg-black/40">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-[#14181B]/80 text-slate-400 font-mono text-[10px] uppercase tracking-widest border-b border-white/10">
                    {current.columns.map((col: string) => (
                      <th key={col} className="px-5 py-4 font-bold">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-xs font-mono text-slate-300">
                  {current.sampleRows?.map((row: any, idx: number) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                      {current.columns.map((col: string) => (
                        <td key={col} className="px-5 py-4 font-normal text-slate-300">
                          {String(row[col] || '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 font-mono text-xs">
              <Layers className="w-12 h-12 mb-4 opacity-10" />
              <span>{isSo ? 'Fadlan dooro miis (table)...' : 'Select a table to view records.'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
