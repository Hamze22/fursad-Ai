import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Download,
  Database,
  Server,
  FileCheck,
  FolderTree,
  ChevronRight
} from 'lucide-react';
import { LanguageType } from '../types.ts';

interface CodeViewerProps {
  files: Record<string, string>;
  language: LanguageType;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ files, language }) => {
  const [activeFile, setActiveFile] = useState<string>('App.html');
  const [copied, setCopied] = useState(false);
  const isSo = language === 'so';

  const fileKeys = Object.keys(files);
  const currentContent = files[activeFile] || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.sql')) return <Database className="w-3.5 h-3.5 text-amber-500" />;
    if (fileName.endsWith('.ts')) return <Server className="w-3.5 h-3.5 text-ff-blue" />;
    if (fileName.includes('test')) return <FileCheck className="w-3.5 h-3.5 text-ff-green" />;
    return <FileCode className="w-3.5 h-3.5 text-blue-400" />;
  };

  return (
    <div className="flex-1 flex h-full bg-[#090913] overflow-hidden">
      {/* File Tree */}
      <div className="w-64 bg-[#14181B] border-r border-white/5 flex flex-col shrink-0">
        <div className="h-10 px-4 flex items-center gap-2 border-b border-white/5">
          <FolderTree className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Explorer</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {fileKeys.map((file) => (
            <button
              key={file}
              onClick={() => setActiveFile(file)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition ${
                activeFile === file
                  ? 'bg-ff-blue/10 text-ff-blue border border-ff-blue/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {getFileIcon(file)}
              <span className="truncate">{file}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Pane */}
      <div className="flex-1 flex flex-col bg-[#090913]">
        <div className="h-10 border-b border-white/5 px-4 flex items-center justify-between bg-[#14181B]/50">
          <div className="flex items-center gap-2">
            {getFileIcon(activeFile)}
            <span className="text-xs font-mono text-white">{activeFile}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-white/5 transition text-slate-500 hover:text-white"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-ff-green" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              className="p-1.5 rounded-lg hover:bg-white/5 transition text-slate-500 hover:text-white"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 font-mono text-[13px] leading-relaxed text-slate-300 bg-[#0d0d0d]">
          <pre className="whitespace-pre-wrap break-all">
            {currentContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
