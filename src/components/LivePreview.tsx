import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { DeviceMode, LanguageType } from '../types.ts';

interface LivePreviewProps {
  files: Record<string, string>;
  deviceMode: DeviceMode;
  language: LanguageType;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  files,
  deviceMode,
  language,
}) => {
  const [iframeKey, setIframeKey] = useState(0);
  const isSo = language === 'so';

  const htmlContent = useMemo(() => {
    const appJs = files['/App.js'] || files['App.js'] || '';
    const stylesCss = files['/styles.css'] || files['styles.css'] || '';
    
    // Simple regex to remove imports from App.js for the preview
    const cleanAppJs = appJs.replace(/import.*?;/g, '');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <style>
          body { margin: 0; padding: 0; background: white; min-height: 100vh; }
          ${stylesCss}
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          // Minimal mock React-like behavior
          document.getElementById('root').innerHTML = \`${cleanAppJs}\`;
        </script>
      </body>
      </html>
    `;
  }, [files]);

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const getContainerDimensions = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'w-[375px] h-[667px] rounded-[40px] border-[10px] border-[#14181B] shadow-2xl';
      case 'tablet':
        return 'w-[768px] h-[90%] rounded-[24px] border-[10px] border-[#14181B] shadow-2xl';
      default:
        return 'w-full h-full border-0';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090913] overflow-hidden relative rounded-2xl border border-white/10 shadow-2xl">
      {/* Browser Nav */}
      <div className="h-10 bg-[#14181B] border-b border-white/5 px-4 flex items-center justify-between gap-3 text-[11px] text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg hover:bg-white/5 transition cursor-pointer"
            title="Refresh"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 max-w-md bg-[#090913] border border-white/10 rounded-lg px-3 py-1 flex items-center justify-center gap-2 text-slate-500">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span className="font-mono truncate uppercase tracking-tighter text-[9px]">sandbox.realai.dev</span>
        </div>

        <div className="flex items-center gap-1 opacity-0 pointer-events-none">
          {/* Controls are in App.tsx now, but we keep the space for layout balance */}
          <div className="w-10"></div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-6 flex items-center justify-center overflow-auto bg-neutral-900/40">
        <div className={`transition-all duration-300 relative flex flex-col bg-white overflow-hidden ${getContainerDimensions()}`}>
          <iframe
            key={iframeKey}
            srcDoc={htmlContent}
            title="Preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-forms allow-modals allow-same-origin"
          />
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-[#14181B] border border-white/10 rounded-xl text-[10px] text-white font-medium shadow-2xl">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        {isSo ? 'Sandbox Toos ah' : 'Live Preview Active'}
      </div>
    </div>
  );
};
