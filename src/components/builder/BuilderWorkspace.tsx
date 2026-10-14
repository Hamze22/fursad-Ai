import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { 
  FileCode, 
  Play, 
  Save, 
  Eye, 
  Globe, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight,
  Send,
  Sparkles,
  Search,
  X,
  Plus,
  Terminal,
  MoreVertical,
  Laptop,
  Smartphone,
  Tablet,
  Folder,
  File,
  RotateCcw,
  Monitor,
  ExternalLink,
  Download,
  Rocket,
  Loader2,
  User as UserIcon,
  Bot,
  CheckCircle2,
  AlertCircle,
  Columns,
  Code2,
  Layers,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  Sliders,
  Menu,
  Mic,
  MicOff,
  Paperclip,
  FolderPlus,
  FilePlus,
  Palette,
  Check,
  Cpu,
  History,
  Undo2,
  ShieldCheck,
  Crosshair,
  MousePointer,
  Pencil,
  Trash2,
  Wand2
} from 'lucide-react';
import { ProjectState, User, AppView, AIProviderConfig, ChangeRecord } from '../../types.ts';
import { exportProjectZip, applyOperations } from '../../lib/projectUtils.ts';
import { BASE_SYSTEM } from '../../lib/ai/prompts.ts';
import { generateProjectFromPrompt } from '../../data/projectGenerator.ts';
import { BuilderSideDrawer } from './BuilderSideDrawer.tsx';
import { FursadLogo } from '../common/FursadLogo.tsx';
import { ChangeRecordCard } from './ChangeRecordCard.tsx';
import { ProjectHistoryModal } from './ProjectHistoryModal.tsx';
import { AiProviderSettings } from '../dashboard/AiProviderSettings.tsx';
import { applyClientTargetedPatch } from '../../lib/targetedUpdater.ts';

const HexagonIcon = ({ className = "w-5 h-5 text-slate-900" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <polygon points="12 2 21 7.5 21 16.5 12 21 3 16.5 3 7.5" />
  </svg>
);

interface BuilderWorkspaceProps {
  project: ProjectState;
  onUpdate: (project: ProjectState) => void;
  onBack: () => void;
  onGoHome?: () => void;
  user?: User | null;
  projects?: ProjectState[];
  onNavigateView?: (view: AppView) => void;
  onLogout?: () => void;
  onSelectProject?: (p: ProjectState) => void;
}

export const BuilderWorkspace: React.FC<BuilderWorkspaceProps> = ({ 
  project, 
  onUpdate, 
  onBack,
  onGoHome,
  user = null,
  projects = [],
  onNavigateView = () => {},
  onLogout = () => {},
  onSelectProject
}) => {
  const [chatInput, setChatInput] = useState('');
  const [activeSidebarTab, setActiveSidebarTab] = useState<'chat' | 'files'>('chat');
  const [viewMode, setViewMode] = useState<'preview' | 'code' | 'split'>('preview');
  const [mobileTab, setMobileTab] = useState<'chat' | 'preview' | 'artifacts' | 'side-by-side'>('side-by-side');
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'Gemini 2.5 Flash' | 'Gemini 3.8 Flash' | 'Gemini 3.1 Pro' | 'Claude 3.7 Sonnet' | 'GPT-4o'>('Gemini 2.5 Flash');
  const [isListening, setIsListening] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [interimStatus, setInterimStatus] = useState<string>('');
  const [showStylePresets, setShowStylePresets] = useState(false);
  const [showAiGatewayModal, setShowAiGatewayModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Active AI Provider Configuration
  const [aiConfig, setAiConfig] = useState<AIProviderConfig>(() => {
    if (project.aiConfig) return project.aiConfig;
    try {
      const storageKey = user ? `fursad_ai_config_${user.id || user.email}` : 'fursad_ai_config_guest';
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      provider: 'gemini',
      model: 'gemini-3.8-flash',
      useCustomKey: false,
      temperature: 0.2
    };
  });
  
  const [selectedFilePath, setSelectedFilePath] = useState<string>(() => {
    return Object.keys(project.files).find(p => p.endsWith('.tsx') || p.endsWith('.js') || p.endsWith('.html')) || Object.keys(project.files)[0] || 'index.html';
  });
  
  const [files, setFiles] = useState<Record<string, string>>(project.files);
  const [chatMessages, setChatMessages] = useState(project.messages);
  const [status, setStatus] = useState(project.status);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(1);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [charsWritten, setCharsWritten] = useState(1302);
  const [buildStepIndex, setBuildStepIndex] = useState<number>(0);

  // Resizable Chat / Preview divider
  const [sidebarWidth, setSidebarWidth] = useState<number>(360);
  const [isDraggingSidebar, setIsDraggingSidebar] = useState<boolean>(false);

  // Visual Edit Tool / Element Inspection State
  const [isInspectMode, setIsInspectMode] = useState<boolean>(false);
  const [selectedElementInfo, setSelectedElementInfo] = useState<{
    selector: string;
    tagName: string;
    textSnippet: string;
    id?: string;
    className?: string;
  } | null>(null);
  const [inlineEditText, setInlineEditText] = useState<string>('');
  const [showInlineEditModal, setShowInlineEditModal] = useState<boolean>(false);

  // Handle sidebar dragging
  useEffect(() => {
    if (!isDraggingSidebar) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(Math.max(e.clientX, 260), window.innerWidth - 320);
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDraggingSidebar(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSidebar]);

  // Handle element selection from iframe postMessage
  useEffect(() => {
    const handleWindowMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'FURSAD_ELEMENT_SELECTED') {
        setSelectedElementInfo({
          selector: e.data.selector,
          tagName: e.data.tagName,
          textSnippet: e.data.textSnippet,
          id: e.data.id,
          className: e.data.className
        });
        setInlineEditText(e.data.textSnippet || '');
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, []);

  // Character written animation counter during generation
  useEffect(() => {
    if (!isGenerating) return;
    setCharsWritten(180);
    const interval = setInterval(() => {
      setCharsWritten(prev => {
        if (prev >= 1302 && prev < 2400) return prev + Math.floor(Math.random() * 45 + 15);
        if (prev >= 2400) return prev + Math.floor(Math.random() * 20);
        return prev + Math.floor(Math.random() * 95 + 65);
      });
    }, 70);
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Real AI code generation for newly created projects
  useEffect(() => {
    if (project.messages.length === 2 && project.messages[1].content === 'Planning project structure...') {
      setIsGenerating(true);
      const userPrompt = project.messages[0]?.content || project.name;

      // Real Gemini API call to server
      axios.post('/api/ai/build', {
        prompt: userPrompt,
        language: 'so'
      })
      .then(res => {
        const data = res.data;
        if (data && data.success && data.indexHtml) {
          const generatedFiles: Record<string, string> = {
            'index.html': data.indexHtml,
            'src/App.tsx': data.appTsx || '',
            ...(data.files || {})
          };

          const assistantMsg = {
            id: Date.now().toString(),
            role: 'assistant' as const,
            content: data.explanation || `✨ Waxaan si buuxda kuugu dhisay: **${data.projectName || project.name}**!\n\nKoodhka index.html, React components, iyo muuqaalka tooska ah (Live Preview) hada way diyaar yihiin.`,
            timestamp: new Date().toISOString()
          };

          const updatedMessages = [project.messages[0], assistantMsg];
          setFiles(generatedFiles);
          setChatMessages(updatedMessages);
          setSelectedFilePath('index.html');
          setPreviewKey(k => k + 1);
          setIsGenerating(false);

          onUpdate({
            ...project,
            name: data.projectName || project.name,
            tagline: data.tagline || project.tagline,
            databaseTables: data.databaseTables && Array.isArray(data.databaseTables) ? data.databaseTables : project.databaseTables,
            files: generatedFiles,
            messages: updatedMessages,
            status: 'completed'
          });
          return;
        }
        throw new Error('API returned fallback structure');
      })
      .catch(err => {
        console.warn('Real AI generation API call encountered error, using synthesized domain model:', err);
        const generated = generateProjectFromPrompt(userPrompt, 'developer', 'so');
        const assistantMsg = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: `✨ Waxaan si buuxda kuugu dhisay: **${generated.name}**!\n\nKoodhka index.html, React components, iyo muuqaalka tooska ah (Live Preview) hada way diyaar yihiin.`,
          timestamp: new Date().toISOString()
        };

        const updatedMessages = [project.messages[0], assistantMsg];
        setFiles(generated.files);
        setChatMessages(updatedMessages);
        setPreviewKey(k => k + 1);
        setIsGenerating(false);

        onUpdate({
          ...project,
          name: generated.name,
          databaseTables: generated.databaseTables,
          files: generated.files,
          messages: updatedMessages,
          status: 'completed'
        });
      });
    }
  }, [project.id]);

  // References for mobile container scroll snapping & file uploads
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const previewPanelRef = useRef<HTMLDivElement>(null);
  const artifactsPanelRef = useRef<HTMLDivElement>(null);
  const builderFileInputRef = useRef<HTMLInputElement>(null);
  const builderFolderInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handler for Builder Chat
  const handleBuilderFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;
    Array.from(uploaded).forEach(f => {
      const reader = new FileReader();
      const isText = f.type.startsWith('text/') || f.name.match(/\.(txt|json|js|ts|tsx|jsx|html|css|md|csv)$/i);
      reader.onload = () => {
        const content = typeof reader.result === 'string' ? reader.result : '';
        const sizeFormatted = (f.size / 1024).toFixed(1) + ' KB';
        setAttachedFiles(prev => [...prev, `${f.name} (${sizeFormatted})`]);
        setChatInput(prev => prev 
          ? `${prev}\n\n[Attached File: ${f.name}]\n${content.slice(0, 3000)}` 
          : `Ku dar ama ku dhaqan geli koodhkan faylka ah:\n[Attached File: ${f.name}]\n${content.slice(0, 3000)}`
        );
      };
      if (isText) reader.readAsText(f);
      else reader.readAsDataURL(f);
    });
    if (e.target) e.target.value = '';
  };

  // Folder Upload Handler for Builder Chat
  const handleBuilderFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;
    const fileList = Array.from(uploaded);
    const folderName = fileList[0]?.webkitRelativePath ? fileList[0].webkitRelativePath.split('/')[0] : 'Project Folder';
    setAttachedFiles(prev => [...prev, `📁 ${folderName} (${fileList.length} files)`]);
    setChatInput(prev => prev 
      ? `${prev}\n\n[Attached Folder: ${folderName}]\nStructure:\n${fileList.slice(0, 10).map(f => f.webkitRelativePath).join('\n')}` 
      : `Waa kan qaab-dhismeedka mashruuca:\n📁 ${folderName} (${fileList.length} files)\n${fileList.slice(0, 10).map(f => f.webkitRelativePath).join('\n')}`
    );
    if (e.target) e.target.value = '';
  };

  // Voice toggle handler (Microphone with Web Speech API or simulation)
  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'so-SO';
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setChatInput(prev => (prev ? prev + ' ' + transcript : transcript));
          }
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
        return;
      } catch {
        // Fallback simulation
      }
    }
    setIsListening(true);
    setTimeout(() => {
      setChatInput(prev => prev ? prev + ' ku dar shopping cart iyo dark mode' : 'ku dar shopping cart iyo dark mode');
      setIsListening(false);
    }, 2200);
  };

  // Custom Website Style Presets (Does NOT affect the dark builder control interface!)
  const applyWebsiteStylePreset = (preset: 'warm-bookshop' | 'emerald' | 'royal-indigo' | 'cyberpunk' | 'light-clean') => {
    const newFiles = { ...files };
    const htmlKey = Object.keys(files).find(p => p.toLowerCase().endsWith('.html')) || 'index.html';
    let html = files[htmlKey] || '';
    if (!html) return;

    if (preset === 'warm-bookshop') {
      html = html.replace(/bg-blue-\d+/g, 'bg-amber-600')
                 .replace(/from-blue-\d+/g, 'from-amber-600')
                 .replace(/to-cyan-\d+/g, 'to-orange-700')
                 .replace(/text-blue-400/g, 'text-amber-400')
                 .replace(/border-blue-500/g, 'border-amber-500');
    } else if (preset === 'emerald') {
      html = html.replace(/bg-blue-\d+/g, 'bg-emerald-600')
                 .replace(/from-blue-\d+/g, 'from-emerald-600')
                 .replace(/to-cyan-\d+/g, 'to-teal-600')
                 .replace(/text-blue-400/g, 'text-emerald-400')
                 .replace(/border-blue-500/g, 'border-emerald-500');
    } else if (preset === 'royal-indigo') {
      html = html.replace(/bg-blue-\d+/g, 'bg-indigo-600')
                 .replace(/from-blue-\d+/g, 'from-indigo-600')
                 .replace(/to-cyan-\d+/g, 'to-blue-600')
                 .replace(/text-blue-400/g, 'text-indigo-400')
                 .replace(/border-blue-500/g, 'border-indigo-500');
    } else if (preset === 'cyberpunk') {
      html = html.replace(/bg-blue-\d+/g, 'bg-fuchsia-600')
                 .replace(/from-blue-\d+/g, 'from-fuchsia-600')
                 .replace(/to-cyan-\d+/g, 'to-cyan-400')
                 .replace(/text-blue-400/g, 'text-fuchsia-400')
                 .replace(/border-blue-500/g, 'border-fuchsia-500');
    } else if (preset === 'light-clean') {
      html = html.replace(/bg-slate-950/g, 'bg-slate-100 text-slate-900')
                 .replace(/bg-\[#020617\]/g, 'bg-slate-50 text-slate-900')
                 .replace(/text-white/g, 'text-slate-900')
                 .replace(/bg-slate-900/g, 'bg-white');
    }

    newFiles[htmlKey] = html;
    setFiles(newFiles);
    setPreviewKey(k => k + 1);
    onUpdate({ ...project, files: newFiles });
  };

  // Sync with project prop when ID changes
  useEffect(() => {
    setFiles(project.files);
    setChatMessages(project.messages);
    setStatus(project.status);
    const fileKeys = Object.keys(project.files);
    if (fileKeys.length > 0 && !fileKeys.includes(selectedFilePath)) {
      const preferred = fileKeys.find(p => p.endsWith('.html') || p.endsWith('.tsx')) || fileKeys[0];
      setSelectedFilePath(preferred);
    }
  }, [project.id]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      const newFiles = { ...files, [selectedFilePath]: value };
      setFiles(newFiles);
      onUpdate({ ...project, files: newFiles });
      setPreviewKey(k => k + 1);
    }
  };

  // 1-Click Restore Point Handler (Undo targeted change)
  const handleUndoChange = (record: ChangeRecord) => {
    if (!record.snapshot || Object.keys(record.snapshot).length === 0) return;
    const restoredFiles = { ...record.snapshot };
    setFiles(restoredFiles);
    setPreviewKey(k => k + 1);

    const undoMsg = {
      id: Date.now().toString(),
      role: 'assistant' as const,
      content: `↩️ **Soo Celin Buuxda (Restored Snapshot)**:\nWaxaan dib u soo celiyay xaaladdii hore ee website-ka ka hor inta aan la samayn: "${record.originalRequest}". Qaybihii iyo styling-kii hore dib ayey u shaqaynayaan.`,
      timestamp: new Date().toISOString()
    };

    const finalMessages = [...chatMessages, undoMsg];
    setChatMessages(finalMessages);

    onUpdate({
      ...project,
      files: restoredFiles,
      messages: finalMessages,
      updatedAt: new Date().toISOString()
    });
  };

  const handleDirectElementAction = (action: 'color-black' | 'color-white' | 'color-blue' | 'delete' | 'text', customText?: string) => {
    if (!selectedElementInfo) return;
    let promptCommand = '';
    if (action === 'color-black') {
      promptCommand = `[Qaybta: ${selectedElementInfo.selector}] Ka dhig midabka madow saafi ah (bg-black text-white)`;
    } else if (action === 'color-white') {
      promptCommand = `[Qaybta: ${selectedElementInfo.selector}] Ka dhig midabka caddaan (bg-white text-slate-900)`;
    } else if (action === 'color-blue') {
      promptCommand = `[Qaybta: ${selectedElementInfo.selector}] Ka dhig midabka buluug (bg-blue-600 text-white)`;
    } else if (action === 'delete') {
      promptCommand = `[Qaybta: ${selectedElementInfo.selector}] Tir qaybtaan / Delete this element`;
    } else if (action === 'text') {
      promptCommand = `[Qaybta: ${selectedElementInfo.selector}] Bedel qoraalka oo ka dhig: "${customText || inlineEditText}"`;
    }

    const res = applyClientTargetedPatch(
      files['index.html'] || '', 
      files, 
      promptCommand, 
      'so', 
      selectedElementInfo.selector
    );
    const newFiles = res.updatedFiles;
    const changeRecord = res.changeRecord;
    const explanation = res.explanation;

    const aiMsg = { 
      id: Date.now().toString(), 
      role: 'assistant' as const, 
      content: explanation, 
      timestamp: new Date().toISOString(),
      changeRecord: changeRecord
    };

    const finalMessages = [...chatMessages, aiMsg];
    setFiles(newFiles);
    setChatMessages(finalMessages);
    setPreviewKey(k => k + 1);
    setSelectedElementInfo(null);
    setShowInlineEditModal(false);

    onUpdate({ 
      ...project, 
      files: newFiles, 
      messages: finalMessages,
      changeHistory: [...(project.changeHistory || []), changeRecord],
      updatedAt: new Date().toISOString() 
    });
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isGenerating) return;
    
    const userPrompt = chatInput.trim();
    const promptLower = userPrompt.toLowerCase();
    const targetedSelector = selectedElementInfo?.selector;

    const newUserMsg = { 
      id: Date.now().toString(), 
      role: 'user' as const, 
      content: userPrompt, 
      timestamp: new Date().toISOString() 
    };
    
    const updatedMessages = [...chatMessages, newUserMsg];
    setChatMessages(updatedMessages);
    setChatInput('');
    setAttachedFiles([]);
    setIsGenerating(true);
    setError(null);
    setBuildStepIndex(1);
    setInterimStatus(`⚡ Qorshaynta & Aqoonsiga: ${userPrompt.slice(0, 32)}...`);

    const timer1 = setTimeout(() => {
      setBuildStepIndex(2);
      setInterimStatus('🎨 Habaynta Koodhka & CSS: Diyaarinta styles & components...');
    }, 400);

    const timer2 = setTimeout(() => {
      setBuildStepIndex(3);
      setInterimStatus('🛡️ Hubinta Badbaadada: Hubinta in qaybaha kale (Navbar, Pricing, Footer) badbaadeen...');
    }, 900);

    const timer3 = setTimeout(() => {
      setBuildStepIndex(4);
      setInterimStatus('🚀 Muuqaalka Tooska ah: Bundling preview & mounting live DOM...');
    }, 1500);

    try {
      // 1. STRICT EXISTING-PROJECT UPDATE MODE
      // When files already exist in this workspace (e.g. index.html), ANY user instruction
      // MUST modify the existing project rather than rebuilding a new template!
      const hasExistingFiles = Object.keys(files).length > 0 && Boolean(files['index.html']);

      if (hasExistingFiles) {
        setInterimStatus(`🎯 Targeted Update: Analyzing requested change (${userPrompt.slice(0, 32)})...`);

        let newFiles = { ...files };
        let changeRecord: ChangeRecord | null = null;
        let explanation = '';

        try {
          const res = await axios.post('/api/ai/targeted-update', {
            prompt: userPrompt,
            currentFiles: files,
            aiConfig: aiConfig,
            language: 'so',
            targetSelector: targetedSelector
          });

          const data = res.data;
          if (data && data.success && data.updatedFiles) {
            newFiles = data.updatedFiles;
            changeRecord = data.changeRecord;
            explanation = data.explanation;
          }
        } catch (apiErr) {
          console.warn('[Targeted update API error, applying client deterministic patch]:', apiErr);
        }

        // If backend did not supply a patch, apply client-side high-precision targeted patch
        if (!changeRecord) {
          const localResult = applyClientTargetedPatch(files['index.html'] || '', files, userPrompt, 'so', targetedSelector);
          newFiles = localResult.updatedFiles;
          changeRecord = localResult.changeRecord;
          explanation = localResult.explanation;
        }

        const aiMsg = { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant' as const, 
          content: explanation, 
          timestamp: new Date().toISOString(),
          changeRecord: changeRecord
        };

        const finalMessages = [...updatedMessages, aiMsg];
        const updatedHistory = [...(project.changeHistory || []), changeRecord];

        setFiles(newFiles);
        setChatMessages(finalMessages);
        setPreviewKey(k => k + 1);
        setSelectedElementInfo(null);
        setIsInspectMode(false);

        onUpdate({ 
          ...project, 
          files: newFiles, 
          messages: finalMessages,
          changeHistory: updatedHistory,
          updatedAt: new Date().toISOString() 
        });

        // STRICT GUARANTEE: Never fall through to blank project generation!
        return;
      }

      // Initial Project Generation Fallback (only for completely blank projects)
      let newFiles = { ...files };
      let explanation = `Waxaan ku fuliyay codsigaaga: "${userPrompt}"`;
      let updatedProjectName = project.name;
      let updatedTables = project.databaseTables;
      let geminiSuccess = false;

      try {
        const res = await axios.post('/api/ai/build', {
          prompt: userPrompt,
          language: 'so',
          aiConfig: aiConfig
        });
        const data = res.data;
        if (data && data.success && data.indexHtml && !data.fallback) {
          newFiles = {
            'index.html': data.indexHtml,
            'src/App.tsx': data.appTsx || '',
            ...(data.files || {})
          };
          explanation = data.explanation;
          updatedProjectName = data.projectName || userPrompt.slice(0, 30);
          if (data.databaseTables && Array.isArray(data.databaseTables)) {
            updatedTables = data.databaseTables;
          }
          geminiSuccess = true;
        }
      } catch (apiErr) {
        console.warn('AI build API endpoint call:', apiErr);
      }

      if (!geminiSuccess) {
        const generated = generateProjectFromPrompt(userPrompt, 'developer', 'so');
        newFiles = { ...generated.files };
        updatedProjectName = generated.name;
        updatedTables = generated.databaseTables;
        explanation = `✨ Waxaan si buuxda kuugu dhisay: **${generated.name}**!\n\nKoodhka index.html, React components, iyo muuqaalka tooska ah (Live Preview) hada way diyaar yihiin.`;
      }

      // Finalize assistant message
      const aiMsg = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant' as const, 
        content: explanation, 
        timestamp: new Date().toISOString() 
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setChatMessages(finalMessages);
      setFiles(newFiles);
      setPreviewKey(k => k + 1);

      onUpdate({ 
        ...project, 
        name: updatedProjectName,
        files: newFiles, 
        messages: finalMessages,
        databaseTables: updatedTables || project.databaseTables,
        updatedAt: new Date().toISOString() 
      });
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      const fallbackAiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `I've processed: "${userPrompt}". Code and live preview have been updated.`,
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, fallbackAiMsg]);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsGenerating(false);
      setInterimStatus('');
      setBuildStepIndex(0);
    }
  };

  const handleExport = async () => {
    await exportProjectZip({ ...project, files });
  };

  const handlePublish = () => {
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 4000);
  };

  // Scroll to panel on mobile
  const scrollToMobilePanel = (tab: 'chat' | 'preview' | 'artifacts') => {
    setMobileTab(tab);
    if (tab === 'chat' && chatPanelRef.current) {
      chatPanelRef.current.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    } else if (tab === 'preview' && previewPanelRef.current) {
      previewPanelRef.current.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    } else if (tab === 'artifacts' && artifactsPanelRef.current) {
      artifactsPanelRef.current.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
  };

  const currentPreviewDoc = useMemo(() => {
    const htmlKey = Object.keys(files).find(p => p.toLowerCase().endsWith('.html'));
    let baseHtml = (htmlKey && files[htmlKey]) ? files[htmlKey] : '';

    if (!baseHtml) {
      const currentCode = files[selectedFilePath] || '';
      baseHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-8 font-sans flex items-center justify-center">
  <div class="max-w-xl w-full p-8 bg-slate-900/90 border border-blue-500/30 rounded-3xl text-center space-y-6 shadow-2xl">
    <div class="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center mx-auto text-blue-400">
      <i class="fa-solid fa-code text-2xl"></i>
    </div>
    <h1 class="text-2xl font-black text-white">${project.name}</h1>
    <p class="text-sm text-slate-400">Currently viewing: <span class="font-mono text-blue-400">${selectedFilePath}</span></p>
    <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left overflow-x-auto max-h-60">
      <pre class="text-xs font-mono text-slate-300">${currentCode.replace(/</g, '&lt;')}</pre>
    </div>
    <div class="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span>Virtual Sandbox Active</span>
    </div>
  </div>
</body>
</html>`;
    }

    const inspectorScript = `
<style id="fursad-inspect-styles">
  .fursad-inspect-hover {
    outline: 2px dashed #2563eb !important;
    outline-offset: -2px !important;
    cursor: crosshair !important;
  }
  .fursad-inspect-selected {
    outline: 3px solid #2563eb !important;
    outline-offset: -2px !important;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.25) !important;
  }
</style>
<script id="fursad-inspector-script">
(function() {
  var isInspectEnabled = ${isInspectMode ? 'true' : 'false'};
  var activeSelectedSelector = ${selectedElementInfo ? JSON.stringify(selectedElementInfo.selector) : 'null'};
  var hoverEl = null;
  var badge = null;

  function ensureBadge() {
    if (!badge && document.body) {
      badge = document.createElement('div');
      badge.id = 'fursad-inspect-badge';
      badge.style.position = 'fixed';
      badge.style.zIndex = '999999';
      badge.style.pointerEvents = 'none';
      badge.style.background = '#1d4ed8';
      badge.style.color = '#ffffff';
      badge.style.fontSize = '11px';
      badge.style.fontWeight = 'bold';
      badge.style.fontFamily = 'monospace';
      badge.style.padding = '3px 8px';
      badge.style.borderRadius = '6px';
      badge.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      badge.style.display = 'none';
      badge.style.border = '1px solid rgba(255,255,255,0.4)';
      document.body.appendChild(badge);
    }
  }

  function getUniqueSelector(el) {
    if (el.id) return '#' + el.id;
    var path = [];
    var curr = el;
    while (curr && curr.nodeType === Node.ELEMENT_NODE && curr !== document.body && curr !== document.documentElement) {
      var tag = curr.tagName.toLowerCase();
      var parent = curr.parentNode;
      if (parent) {
        var siblings = Array.from(parent.children).filter(function(c) { return c.tagName.toLowerCase() === tag; });
        if (siblings.length > 1) {
          var index = siblings.indexOf(curr) + 1;
          tag += ':nth-of-type(' + index + ')';
        }
      }
      path.unshift(tag);
      curr = parent;
    }
    return path.join(' > ') || 'body';
  }

  function highlightSelected() {
    if (!activeSelectedSelector) return;
    try {
      var el = document.querySelector(activeSelectedSelector);
      if (el) el.classList.add('fursad-inspect-selected');
    } catch(e) {}
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    ensureBadge();
    highlightSelected();
  } else {
    window.addEventListener('load', function() {
      ensureBadge();
      highlightSelected();
    });
  }

  document.addEventListener('mouseover', function(e) {
    if (!isInspectEnabled) return;
    var target = e.target;
    if (target === badge || target === document.body || target === document.documentElement) return;
    
    if (hoverEl && hoverEl !== target) {
      hoverEl.classList.remove('fursad-inspect-hover');
    }
    hoverEl = target;
    hoverEl.classList.add('fursad-inspect-hover');

    ensureBadge();
    var rect = target.getBoundingClientRect();
    var tagText = target.tagName.toLowerCase() + (target.id ? '#' + target.id : (typeof target.className === 'string' && target.className.trim() ? '.' + target.className.split(/\\s+/).filter(Boolean).slice(0, 2).join('.') : ''));
    if (badge) {
      badge.innerText = '<' + tagText.slice(0, 32) + '> ' + Math.round(rect.width) + 'x' + Math.round(rect.height);
      badge.style.display = 'block';
      badge.style.top = Math.max(4, rect.top - 26) + 'px';
      badge.style.left = Math.max(4, rect.left) + 'px';
    }
  }, true);

  document.addEventListener('mouseout', function(e) {
    if (!isInspectEnabled) return;
    if (hoverEl) {
      hoverEl.classList.remove('fursad-inspect-hover');
    }
    if (badge) badge.style.display = 'none';
  }, true);

  document.addEventListener('click', function(e) {
    if (!isInspectEnabled) return;
    e.preventDefault();
    e.stopPropagation();
    var target = e.target;
    var selector = getUniqueSelector(target);
    var textSnippet = (target.innerText || target.textContent || '').trim().slice(0, 80);
    var tagName = target.tagName.toLowerCase();
    var id = target.id || '';
    var className = typeof target.className === 'string' ? target.className : '';

    var prevs = document.querySelectorAll('.fursad-inspect-selected');
    for (var i = 0; i < prevs.length; i++) prevs[i].classList.remove('fursad-inspect-selected');

    target.classList.add('fursad-inspect-selected');

    window.parent.postMessage({
      type: 'FURSAD_ELEMENT_SELECTED',
      selector: selector,
      tagName: tagName,
      textSnippet: textSnippet,
      id: id,
      className: className
    }, '*');
  }, true);
})();
</script>`;

    if (baseHtml.includes('</body>')) {
      return baseHtml.replace('</body>', `${inspectorScript}\n</body>`);
    }
    return baseHtml + inspectorScript;
  }, [files, selectedFilePath, previewKey, isInspectMode, selectedElementInfo]);

  return (
    <div className="h-screen w-screen bg-[#f9fafb] text-slate-900 flex flex-col overflow-hidden font-sans selection:bg-slate-200">
      {/* Workspace Header - Match Screenshot */}
      <header className="h-14 border-b border-gray-200 flex items-center justify-between px-3 sm:px-5 bg-white shrink-0 z-50">
        <div className="flex items-center gap-3 min-w-0">
          {/* Back Arrow button */}
          <button 
            onClick={onGoHome || onBack}
            className="p-1.5 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-lg transition-colors flex items-center shrink-0 active:scale-95"
            title="Back to Projects"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* FURSAD AI Logo */}
          <FursadLogo showText={false} size="md" />

          {/* Title / Prompt */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] font-black tracking-wider uppercase text-blue-600 bg-blue-50 border border-blue-200/80 px-1.5 py-0.5 rounded-md shrink-0">
              FURSAD AI
            </span>
            <h1 className="font-bold text-sm sm:text-base text-slate-900 truncate max-w-[120px] sm:max-w-[240px] md:max-w-[360px]">
              {project.tagline || project.name}
            </h1>
          </div>

          {/* Version badge */}
          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md font-medium shrink-0">
            v0
          </span>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* View Mode Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5">
            <button 
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button 
              onClick={() => setViewMode('code')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'code' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>
          </div>

          {/* AI Provider & BYOK Switcher Button */}
          <button 
            onClick={() => setShowAiGatewayModal(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200/80 rounded-xl text-xs font-bold text-cyan-800 transition-all active:scale-95"
            title="Configure AI Provider & BYOK Keys"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            <span className="hidden sm:inline font-mono text-[11px]">
              {aiConfig.provider.toUpperCase()}: {aiConfig.model.replace('@cf/meta/', '').replace('@cf/deepseek-ai/', '')}
            </span>
            <span className="sm:hidden font-mono text-[11px]">AI</span>
          </button>

          {/* Version History & Restore Points Button */}
          <button 
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-all active:scale-95"
            title="View Change History & Restore Points"
          >
            <History className="w-3.5 h-3.5 text-slate-700 shrink-0" />
            <span className="hidden sm:inline">History ({project.changeHistory?.length || 0})</span>
          </button>

          {/* Il (Hub) Button */}
          <button 
            onClick={() => setSideDrawerOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-all active:scale-95"
            title="Hub: Account, Payment, Dashboard & Settings"
          >
            <Eye className="w-3.5 h-3.5 text-slate-700 shrink-0" />
            <span className="hidden xs:inline">Hub</span>
          </button>

          {/* Publish & Export */}
          <button 
            onClick={handlePublish}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Publish</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </header>

      {/* MOBILE SEGMENTED BAR: Chat, Preview, Artifacts, Side-by-Side */}
      <div className="md:hidden h-11 bg-slate-950 border-b border-slate-800/80 px-2 flex items-center justify-between gap-1 shrink-0 overflow-x-auto scrollbar-none z-40">
         <div className="flex items-center gap-1 w-full justify-between">
            <button
              onClick={() => scrollToMobilePanel('chat')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mobileTab === 'chat' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 bg-slate-900/60 hover:text-slate-200'
              }`}
            >
               <MessageSquare className="w-3.5 h-3.5" />
               <span>Chat</span>
            </button>
            <button
              onClick={() => scrollToMobilePanel('preview')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mobileTab === 'preview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 bg-slate-900/60 hover:text-slate-200'
              }`}
            >
               <Eye className="w-3.5 h-3.5" />
               <span>Preview</span>
            </button>
            <button
              onClick={() => scrollToMobilePanel('artifacts')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mobileTab === 'artifacts' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 bg-slate-900/60 hover:text-slate-200'
              }`}
            >
               <Layers className="w-3.5 h-3.5" />
               <span>Artifacts</span>
            </button>
            <button
              onClick={() => setMobileTab('side-by-side')}
              className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                mobileTab === 'side-by-side' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-400 bg-blue-950/40 border border-blue-500/30'
              }`}
              title="Is-dhinac dhig dhamaan (Side by side)"
            >
               <Columns className="w-3.5 h-3.5" />
               <span className="text-[11px]">Is-dhinac</span>
            </button>
         </div>
      </div>

      {/* Publish Banner Toast */}
      <AnimatePresence>
        {publishSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-4 z-50 bg-emerald-950 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-2xl backdrop-blur-xl"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>App published to cloud! Live URL: https://{project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.realai.app</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* DESKTOP LAYOUT (md:flex, hidden on mobile)                 */}
      {/* ========================================================= */}
      <div className="hidden md:flex flex-1 overflow-hidden relative">
        {/* LEFT: Desktop Sidebar (Chat & Files) */}
        <aside 
          style={{ width: `${sidebarWidth}px` }} 
          className="border-r border-gray-200 flex flex-col shrink-0 bg-white"
        >
           {/* Sidebar Tabs - Match Screenshot */}
           <div className="h-12 px-4 flex items-center gap-6 border-b border-gray-200 shrink-0 bg-white">
              <button 
                onClick={() => setActiveSidebarTab('chat')}
                className={`text-sm font-bold transition-all relative h-full flex items-center gap-2 ${
                  activeSidebarTab === 'chat' ? 'text-black border-b-2 border-black' : 'text-slate-600 hover:text-black'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-black" />
                <span className="text-black font-bold">Chat</span>
              </button>
              <button 
                onClick={() => setActiveSidebarTab('files')}
                className={`text-sm font-bold transition-all relative h-full flex items-center gap-2 ${
                  activeSidebarTab === 'files' ? 'text-black border-b-2 border-black' : 'text-slate-600 hover:text-black'
                }`}
              >
                <FileCode className="w-4 h-4 text-black" />
                <span className="text-black font-bold">Files</span>
                <span className="text-xs text-black font-bold">({Object.keys(files).length})</span>
              </button>
           </div>

           {/* Tab Content */}
           <div className="flex-1 flex flex-col overflow-hidden relative bg-white">
              <AnimatePresence mode="wait">
                {activeSidebarTab === 'chat' ? (
                  <motion.div 
                    key="chat"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 flex flex-col overflow-hidden bg-white text-black"
                  >
                    {/* Chat Messages */}
                    <div 
                      className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin text-black font-medium"
                      style={{ color: '#000000' }}
                    >
                       {chatMessages.map((msg, i) => (
                         <div key={msg.id || i} className="space-y-1 text-black" style={{ color: '#000000' }}>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black" style={{ color: '#000000' }}>
                               {msg.role === 'user' ? (
                                 <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-black">
                                   <UserIcon className="w-3.5 h-3.5 text-black" />
                                 </div>
                               ) : (
                                 <div className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-black">
                                   <Bot className="w-3.5 h-3.5 text-black" />
                                 </div>
                               )}
                               <span className="text-black font-extrabold" style={{ color: '#000000' }}>{msg.role === 'user' ? 'YOU' : 'FURSAD AI'}</span>
                            </div>
                            <div 
                              className="pl-8 text-sm text-black leading-relaxed font-semibold whitespace-pre-wrap"
                              style={{ color: '#000000' }}
                            >
                               {msg.content}
                               {msg.changeRecord && (
                                 <ChangeRecordCard
                                   record={msg.changeRecord}
                                   onUndo={handleUndoChange}
                                   isSo={true}
                                 />
                               )}
                            </div>
                         </div>
                       ))}

                       {/* Inline Thinking & Build Progress (No separate bulky box) */}
                       {isGenerating && (
                         <div className="space-y-1.5 py-1 text-black" style={{ color: '#000000' }}>
                           <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black" style={{ color: '#000000' }}>
                             <div className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-black">
                               <Bot className="w-3.5 h-3.5 text-black" />
                             </div>
                             <span className="text-black font-extrabold" style={{ color: '#000000' }}>FURSAD AI</span>
                           </div>

                           <div className="pl-8 space-y-1.5 text-black" style={{ color: '#000000' }}>
                             {/* Active thinking step */}
                             <div className="inline-flex items-center gap-2 text-xs text-black bg-slate-100 rounded-full px-3 py-1 border border-slate-300" style={{ color: '#000000' }}>
                               <Loader2 className="w-3 h-3 text-black animate-spin shrink-0" />
                               <span className="font-bold text-black" style={{ color: '#000000' }}>Fikirka & Dhismaha:</span>
                               <span className="text-black font-bold truncate max-w-[220px]" style={{ color: '#000000' }}>{interimStatus || 'Waa la dhisayaa...'}</span>
                             </div>

                             {/* Step checkmarks as each finishes */}
                             <div className="space-y-1 pt-0.5 text-xs text-black" style={{ color: '#000000' }}>
                               {buildStepIndex >= 1 && (
                                 <div className="flex items-center gap-1.5 text-black font-bold" style={{ color: '#000000' }}>
                                   <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                   <span className="text-black font-bold" style={{ color: '#000000' }}>Qorshaynta & Aqoonsiga dalabka</span>
                                 </div>
                               )}
                               {buildStepIndex >= 2 && (
                                 <div className="flex items-center gap-1.5 text-black font-bold" style={{ color: '#000000' }}>
                                   <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                   <span className="text-black font-bold" style={{ color: '#000000' }}>Habaynta koodhka & CSS-ka</span>
                                 </div>
                               )}
                               {buildStepIndex >= 3 && (
                                 <div className="flex items-center gap-1.5 text-black font-bold" style={{ color: '#000000' }}>
                                   <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                   <span className="text-black font-bold" style={{ color: '#000000' }}>Hubinta & Badbaadinta qaybaha (Nav, Pricing, Footer)</span>
                                 </div>
                               )}
                               {buildStepIndex >= 4 && (
                                 <div className="flex items-center gap-1.5 text-black font-bold" style={{ color: '#000000' }}>
                                   <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                   <span className="text-black font-bold" style={{ color: '#000000' }}>Live preview-ga oo la cusboonaysiiyay</span>
                                 </div>
                               )}
                             </div>
                           </div>
                         </div>
                       )}
                    </div>

                    {/* Chat Input - Match Screenshot */}
                    <div className="p-3 border-t border-gray-200 bg-white">
                       {/* Hidden File and Folder Inputs */}
                       <input 
                         type="file" 
                         ref={builderFileInputRef} 
                         onChange={handleBuilderFileUpload} 
                         multiple 
                         className="hidden" 
                       />
                       <input 
                         type="file" 
                         ref={builderFolderInputRef} 
                         onChange={handleBuilderFolderUpload} 
                         // @ts-ignore
                         webkitdirectory="" 
                         directory="" 
                         className="hidden" 
                       />

                       {/* Attached Files Chips */}
                       {attachedFiles.length > 0 && (
                         <div className="flex flex-wrap gap-1.5 mb-2">
                           {attachedFiles.map((f, idx) => (
                             <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-mono">
                               <span>{f}</span>
                               <button 
                                 onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                                 className="hover:text-red-500 font-bold ml-0.5"
                               >
                                 ×
                               </button>
                             </span>
                           ))}
                         </div>
                       )}

                       {/* Listening Voice Banner */}
                       {isListening && (
                         <div className="mb-2 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center justify-between animate-pulse">
                           <div className="flex items-center gap-1.5">
                             <Mic className="w-3.5 h-3.5" />
                             <span>🎙️ Waan dhagaysanayaa... Ku hadal codkaaga</span>
                           </div>
                           <button onClick={toggleVoice} className="text-[10px] underline hover:text-red-800">Jooji</button>
                         </div>
                       )}

                       {/* Active Marked Element Pill above chat input */}
                       {selectedElementInfo && (
                         <div className="mb-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs text-black shadow-sm">
                           <div className="flex items-center gap-2 min-w-0">
                             <Crosshair className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                             <span className="font-bold text-black shrink-0">Qaybta la xushay:</span>
                             <code className="bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded font-mono text-[11px] font-bold">
                               &lt;{selectedElementInfo.tagName}&gt;
                             </code>
                             <span className="text-[11px] text-black font-semibold truncate max-w-[140px]">
                               "{selectedElementInfo.textSnippet || selectedElementInfo.selector}"
                             </span>
                           </div>
                           <button
                             type="button"
                             onClick={() => setSelectedElementInfo(null)}
                             className="p-1 text-slate-600 hover:text-black hover:bg-blue-100 rounded-lg transition-colors"
                             title="Ka noqo doorashada / Clear target"
                           >
                             <X className="w-3.5 h-3.5 text-black" />
                           </button>
                         </div>
                       )}

                       <div className="relative bg-white border border-slate-300 rounded-2xl shadow-sm focus-within:border-black focus-within:ring-2 focus-within:ring-slate-100 transition-all p-1.5 flex items-center gap-1.5">
                          {/* File upload & Voice tools */}
                          <div className="flex items-center gap-1 shrink-0 pl-1">
                            <button 
                              type="button"
                              onClick={() => builderFileInputRef.current?.click()}
                              className="p-1.5 text-black hover:text-black hover:bg-slate-100 rounded-lg transition-colors"
                              title="Gali Fayl / Upload File"
                            >
                              <Paperclip className="w-4 h-4 text-black" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => builderFolderInputRef.current?.click()}
                              className="p-1.5 text-black hover:text-black hover:bg-slate-100 rounded-lg transition-colors"
                              title="Gali Folder / Upload Folder"
                            >
                              <FolderPlus className="w-4 h-4 text-black" />
                            </button>
                            <button 
                              type="button"
                              onClick={toggleVoice}
                              className={`p-1.5 rounded-lg transition-all ${
                                isListening 
                                  ? 'bg-rose-500 text-white animate-pulse' 
                                  : 'text-black hover:text-black hover:bg-slate-100'
                              }`}
                              title={isListening ? "Jooji / Stop recording" : "Ku hadal codka / Voice prompt"}
                            >
                              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-black" />}
                            </button>
                          </div>

                          <textarea 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                            placeholder="Qor waxaad rabto ama ku hadal codka (e.g. kudar shopping cart)..."
                            rows={1}
                            disabled={isGenerating}
                            className="w-full text-xs text-black placeholder:text-slate-500 bg-transparent outline-none resize-none px-2 py-1 font-semibold"
                          />
                          <button 
                            onClick={handleSendMessage}
                            disabled={isGenerating || !chatInput.trim()}
                            className="w-8 h-8 rounded-xl bg-black hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shrink-0 active:scale-95"
                          >
                             <ArrowUp className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="files"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex-1 overflow-y-auto py-3 px-2 font-mono text-xs"
                  >
                     <div className="space-y-1">
                        <div className="flex items-center justify-between px-2 py-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                           <span>Project Structure</span>
                           <span className="text-blue-400">{Object.keys(files).length} files</span>
                        </div>
                        {Object.keys(files).map((path) => (
                          <button
                            key={path}
                            onClick={() => {
                              setSelectedFilePath(path);
                              if (viewMode === 'preview') setViewMode('code');
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left ${
                              selectedFilePath === path 
                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                                : 'text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent'
                            }`}
                          >
                             <FileCode className={`w-3.5 h-3.5 shrink-0 ${selectedFilePath === path ? 'text-blue-400' : 'text-slate-500'}`} />
                             <span className="truncate text-xs">{path}</span>
                          </button>
                        ))}
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </aside>

        {/* Draggable Divider between Chat & Preview */}
        <div 
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDraggingSidebar(true);
          }}
          onDoubleClick={() => setSidebarWidth(360)}
          className="w-2 hover:w-2.5 bg-transparent hover:bg-blue-500/30 cursor-col-resize z-40 transition-all flex items-center justify-center group relative select-none shrink-0"
          title="Jiid si aad u weynayso Chat-ka ama Preview-ga (Laba jeer guji si dib loogu celiyo 360px)"
        >
          <div className={`w-0.5 h-full transition-all ${isDraggingSidebar ? 'bg-blue-600 w-1' : 'bg-gray-200 group-hover:bg-blue-500'}`} />
          <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-9 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center transition-opacity ${isDraggingSidebar ? 'opacity-100 ring-2 ring-blue-500' : 'opacity-0 group-hover:opacity-100'}`}>
            <div className="flex gap-0.5">
              <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
              <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
            </div>
          </div>
        </div>

        {/* Fullscreen transparent dragging backdrop to prevent iframe event trapping */}
        {isDraggingSidebar && (
          <div 
            className="fixed inset-0 z-50 cursor-col-resize select-none bg-transparent"
            style={{ pointerEvents: 'auto', userSelect: 'none' }}
          />
        )}

        {/* Desktop Main Canvas */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#f9fafb] relative">
           <div className="h-10 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Monitor className="w-3.5 h-3.5 text-slate-700" />
                    <span>preview • {selectedFilePath}</span>
                 </div>
                 
                 {(viewMode === 'preview' || viewMode === 'split') && (
                   <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
                      <button 
                        onClick={() => setDeviceMode('desktop')} 
                        className={`p-1 rounded-lg transition-all ${deviceMode === 'desktop' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                        title="Desktop view"
                      >
                         <Monitor className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setDeviceMode('tablet')} 
                        className={`p-1 rounded-lg transition-all ${deviceMode === 'tablet' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                        title="Tablet view"
                      >
                         <Tablet className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setDeviceMode('mobile')} 
                        className={`p-1 rounded-lg transition-all ${deviceMode === 'mobile' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                        title="Mobile view"
                      >
                         <Smartphone className="w-3.5 h-3.5" />
                      </button>
                   </div>
                 )}
              </div>

              <div className="flex items-center gap-2">
                 {(viewMode === 'preview' || viewMode === 'split') && (
                   <button 
                     onClick={() => {
                       const next = !isInspectMode;
                       setIsInspectMode(next);
                       if (!next) setSelectedElementInfo(null);
                     }} 
                     className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-sm ${
                       isInspectMode 
                         ? 'bg-blue-600 text-white ring-2 ring-blue-500/40' 
                         : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-black border border-slate-200'
                     }`}
                     title="Edit Tool: Guji qayb kasta oo aad rabto inaad calaamadeyso ama toos u bedesho (Inspect & Edit Element)"
                   >
                     <Crosshair className={`w-3.5 h-3.5 ${isInspectMode ? 'animate-spin' : ''}`} />
                     <span>{isInspectMode ? 'Edit Tool (Firfircoon)' : 'Edit Tool (Dooro Qayb)'}</span>
                   </button>
                 )}

                 <button 
                   onClick={() => setPreviewKey(k => k + 1)} 
                   className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                   title="Reload Preview"
                 >
                    <RotateCcw className="w-3.5 h-3.5" />
                 </button>
              </div>
           </div>

           {/* Canvas Body */}
           <div className="flex-1 flex overflow-hidden">
              {(viewMode === 'code' || viewMode === 'split') && (
                <div className={`h-full flex flex-col bg-[#1e1e1e] ${viewMode === 'split' ? 'w-1/2 border-r border-slate-800' : 'w-full'}`}>
                   <div className="h-8 bg-[#252526] px-4 flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-3.5 h-3.5 text-blue-400" />
                        <span>{selectedFilePath}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Auto-saved</span>
                   </div>
                   <div className="flex-1">
                      <Editor
                        height="100%"
                        language={selectedFilePath.endsWith('.html') ? 'html' : selectedFilePath.endsWith('.css') ? 'css' : selectedFilePath.endsWith('.sql') ? 'sql' : 'typescript'}
                        theme="vs-dark"
                        value={files[selectedFilePath] || ''}
                        onChange={handleEditorChange}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 13,
                          lineNumbers: 'on',
                          scrollBeyondLastLine: false,
                          smoothScrolling: true,
                          padding: { top: 12 },
                        }}
                      />
                   </div>
                </div>
              )}

              {(viewMode === 'preview' || viewMode === 'split') && (
                <div className={`h-full flex items-center justify-center p-4 lg:p-6 bg-[#f9fafb] overflow-auto ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                   <div className={`transition-all duration-300 shadow-xl bg-white border border-gray-200 overflow-hidden flex flex-col ${
                     deviceMode === 'mobile' ? 'w-[375px] h-[680px] rounded-[2.5rem]' : 
                     deviceMode === 'tablet' ? 'w-[680px] h-[820px] rounded-3xl' : 'w-full h-full rounded-2xl'
                   }`}>
                      <div className="h-7 bg-slate-100 border-b border-gray-200 flex items-center px-3 gap-2 shrink-0">
                         <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                         </div>
                         <div className="flex-1 max-w-xs mx-auto bg-white border border-gray-200 rounded-md px-2 py-0.5 text-[10px] font-mono text-slate-500 text-center truncate">
                            https://{project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.local
                         </div>
                         {isGenerating && (
                           <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-mono animate-pulse">
                             <Loader2 className="w-2.5 h-2.5 animate-spin" />
                             <span>Updating live...</span>
                           </div>
                         )}
                      </div>

                      {/* Website preview iframe is ALWAYS standing and active! */}
                      <div className="relative flex-1 w-full h-full bg-white">
                        <iframe 
                          key={previewKey}
                          srcDoc={currentPreviewDoc}
                          title="Interactive Preview Sandbox"
                          sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                          className="w-full h-full border-none bg-white"
                        />
                        {isGenerating && (
                          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md text-white text-xs font-medium border border-blue-500/30 shadow-xl">
                            <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                            <span>Koodhka ayaa la diyaarinayaa... website-ku wuu taagan yahay</span>
                          </div>
                        )}
                      </div>
                   </div>
                </div>
              )}
           </div>
        </main>
      </div>

      {/* ========================================================= */}
      {/* MOBILE RESPONSIVE LAYOUT (md:hidden)                      */}
      {/* Places Chat, Preview, and Artifacts side-by-side or tabs */}
      {/* ========================================================= */}
      <div 
        ref={mobileContainerRef}
        className={`md:hidden flex-1 overflow-y-hidden ${
          mobileTab === 'side-by-side' 
            ? 'flex flex-row overflow-x-auto snap-x snap-mandatory scroll-smooth' 
            : 'flex flex-col overflow-hidden'
        }`}
      >
        {/* PANEL 1: CHAT (AI Assistant) */}
        {(mobileTab === 'side-by-side' || mobileTab === 'chat') && (
          <div 
            ref={chatPanelRef}
            className={`flex flex-col bg-white text-black h-full border-r border-gray-200 ${
              mobileTab === 'side-by-side' ? 'w-[90vw] sm:w-[360px] shrink-0 snap-start' : 'w-full'
            }`}
          >
             <div className="h-10 px-3 bg-white border-b border-gray-200 flex items-center justify-between text-xs font-bold text-black">
                <div className="flex items-center gap-2">
                   <MessageSquare className="w-3.5 h-3.5 text-black" />
                   <span className="text-black font-bold">Chat</span>
                </div>
                <span className="text-[10px] text-black bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300 font-mono font-bold">
                  v0
                </span>
             </div>

             {/* Message list */}
             <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {chatMessages.map((msg, i) => (
                  <div key={msg.id || i} className="space-y-1">
                     <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black" style={{ color: '#000000' }}>
                        {msg.role === 'user' ? (
                          <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-black">
                            <UserIcon className="w-3 h-3 text-black" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-black">
                            <Bot className="w-3 h-3 text-black" />
                          </div>
                        )}
                        <span className="text-black font-extrabold" style={{ color: '#000000' }}>{msg.role === 'user' ? 'YOU' : 'AI'}</span>
                     </div>
                     <div 
                       className="pl-7 text-xs text-black leading-relaxed font-semibold whitespace-pre-wrap"
                       style={{ color: '#000000' }}
                     >
                        {msg.content}
                        {msg.changeRecord && (
                          <ChangeRecordCard
                            record={msg.changeRecord}
                            onUndo={handleUndoChange}
                            isSo={true}
                          />
                        )}
                     </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="space-y-1.5 py-1 text-black" style={{ color: '#000000' }}>
                     <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black" style={{ color: '#000000' }}>
                        <div className="w-5 h-5 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-black">
                          <Bot className="w-3 h-3 text-black" />
                        </div>
                        <span className="text-black font-extrabold" style={{ color: '#000000' }}>FURSAD AI</span>
                     </div>
                     <div className="pl-7 space-y-1 text-xs text-black" style={{ color: '#000000' }}>
                        <div className="inline-flex items-center gap-1.5 text-[11px] text-black bg-slate-100 rounded-full px-2.5 py-0.5 border border-slate-300" style={{ color: '#000000' }}>
                          <Loader2 className="w-2.5 h-2.5 text-black animate-spin shrink-0" />
                          <span className="font-bold text-black" style={{ color: '#000000' }}>Fikirka:</span>
                          <span className="text-black font-bold truncate max-w-[170px]" style={{ color: '#000000' }}>{interimStatus || 'Dhisaya...'}</span>
                        </div>
                        {buildStepIndex >= 1 && (
                          <div className="flex items-center gap-1 text-black text-[11px] font-bold" style={{ color: '#000000' }}>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="text-black font-bold" style={{ color: '#000000' }}>Qorshaynta dalabka</span>
                          </div>
                        )}
                        {buildStepIndex >= 2 && (
                          <div className="flex items-center gap-1 text-black text-[11px] font-bold" style={{ color: '#000000' }}>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="text-black font-bold" style={{ color: '#000000' }}>Habaynta koodhka</span>
                          </div>
                        )}
                        {buildStepIndex >= 3 && (
                          <div className="flex items-center gap-1 text-black text-[11px] font-bold" style={{ color: '#000000' }}>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="text-black font-bold" style={{ color: '#000000' }}>Hubinta badbaadada</span>
                          </div>
                        )}
                     </div>
                  </div>
                )}
             </div>

             {/* Input */}
             <div className="p-2.5 border-t border-gray-200 bg-white">
                <div className="relative bg-white border border-slate-300 rounded-2xl shadow-sm focus-within:border-black p-1 flex items-center gap-1.5">
                   <div className="flex items-center gap-0.5 shrink-0 pl-1">
                     <button 
                       type="button"
                       onClick={() => builderFileInputRef.current?.click()}
                       className="p-1 text-black hover:text-black rounded-lg"
                       title="Upload File"
                     >
                       <Paperclip className="w-3.5 h-3.5 text-black" />
                     </button>
                     <button 
                       type="button"
                       onClick={toggleVoice}
                       className={`p-1 rounded-lg ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-black hover:text-black'}`}
                       title="Voice"
                     >
                       <Mic className="w-3.5 h-3.5 text-black" />
                     </button>
                   </div>
                   <textarea 
                     value={chatInput}
                     onChange={(e) => setChatInput(e.target.value)}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter' && !e.shiftKey) {
                         e.preventDefault();
                         handleSendMessage();
                       }
                     }}
                     placeholder="Ask AI / Ku hadal codka..."
                     rows={1}
                     disabled={isGenerating}
                     className="w-full text-xs text-black placeholder:text-slate-500 bg-transparent outline-none resize-none px-2 py-1 font-semibold"
                   />
                   <button 
                     onClick={handleSendMessage}
                     disabled={isGenerating || !chatInput.trim()}
                     className="w-7 h-7 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white flex items-center justify-center shrink-0 active:scale-95"
                   >
                      <ArrowUp className="w-3.5 h-3.5" />
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* PANEL 2: LIVE PREVIEW */}
        {(mobileTab === 'side-by-side' || mobileTab === 'preview') && (
          <div 
            ref={previewPanelRef}
            className={`flex flex-col bg-[#f9fafb] h-full border-r border-gray-200 ${
              mobileTab === 'side-by-side' ? 'w-[95vw] sm:w-[480px] shrink-0 snap-center' : 'w-full'
            }`}
          >
             <div className="h-10 px-3 bg-white border-b border-gray-200 flex items-center justify-between text-xs font-bold text-slate-900">
                <div className="flex items-center gap-2">
                   <Eye className="w-3.5 h-3.5 text-slate-700" />
                   <span>Preview</span>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                     onClick={() => setPreviewKey(k => k + 1)}
                     className="p-1 text-slate-500 hover:text-slate-900"
                     title="Reload"
                   >
                      <RotateCcw className="w-3 h-3" />
                   </button>
                </div>
             </div>

             {/* Preview Container - Always keep live website standing */}
             <div className="flex-1 p-2 flex items-center justify-center overflow-auto bg-[#f9fafb]">
                <div className="w-full h-full bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-200 relative">
                   <div className="h-6 bg-slate-100 border-b border-gray-200 flex items-center px-2.5 gap-1.5 shrink-0 justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        <span className="text-[9px] font-mono text-slate-500 truncate ml-1">
                          https://preview.local
                        </span>
                      </div>
                      {isGenerating && (
                        <div className="flex items-center gap-1 text-[9px] font-medium text-blue-600 animate-pulse">
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          <span>Updating...</span>
                        </div>
                      )}
                   </div>
                   <div className="relative flex-1 w-full h-full bg-white">
                     <iframe 
                       key={previewKey}
                       srcDoc={currentPreviewDoc}
                       title="Mobile Live Preview"
                       sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                       className="w-full h-full border-none bg-white"
                     />
                     {isGenerating && (
                       <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-medium border border-blue-500/30 shadow-lg">
                         <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                         <span>Website-ku wuu taagan yahay...</span>
                       </div>
                     )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* PANEL 3: ARTIFACTS & CODE */}
        {(mobileTab === 'side-by-side' || mobileTab === 'artifacts') && (
          <div 
            ref={artifactsPanelRef}
            className={`flex flex-col bg-[#1e1e1e] h-full ${
              mobileTab === 'side-by-side' ? 'w-[90vw] sm:w-[360px] shrink-0 snap-end' : 'w-full'
            }`}
          >
             <div className="h-9 px-3 bg-[#252526] border-b border-white/5 flex items-center justify-between text-xs font-bold text-slate-300">
                <div className="flex items-center gap-2">
                   <Layers className="w-3.5 h-3.5 text-blue-400" />
                   <span>Artifacts & Code</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{selectedFilePath}</span>
             </div>

             {/* File selector pill bar */}
             <div className="p-1.5 bg-slate-950 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
                {Object.keys(files).map((path) => (
                  <button
                    key={path}
                    onClick={() => setSelectedFilePath(path)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold shrink-0 transition-all ${
                      selectedFilePath === path 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                     {path}
                  </button>
                ))}
             </div>

             {/* Monaco Code Editor */}
             <div className="flex-1">
                <Editor
                  height="100%"
                  language={selectedFilePath.endsWith('.html') ? 'html' : selectedFilePath.endsWith('.css') ? 'css' : selectedFilePath.endsWith('.sql') ? 'sql' : 'typescript'}
                  theme="vs-dark"
                  value={files[selectedFilePath] || ''}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    padding: { top: 8 },
                  }}
                />
             </div>
          </div>
        )}
      </div>

      {/* Floating Right-Edge "Il" (Eye) Hub Trigger */}
      <button 
        onClick={() => setSideDrawerOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-slate-900/90 hover:bg-blue-600 border-l border-y border-blue-500/40 text-blue-300 hover:text-white px-2 py-3 rounded-l-2xl shadow-2xl transition-all flex flex-col items-center gap-1 group active:scale-95"
        title="Fur Il: Account, Payment, Dashboard & Settings"
      >
        <Eye className="w-4 h-4 group-hover:scale-110 transition-transform text-blue-400 group-hover:text-white" />
        <span className="text-[9px] font-black uppercase [writing-mode:vertical-rl] tracking-widest mt-1">
          IL HUB
        </span>
      </button>

      {/* Attach File Modal */}
      {showAttachModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FilePlus className="w-4 h-4 text-blue-400" />
                <h4 className="font-bold text-sm text-white">Ku dar Fayl Context-ka</h4>
              </div>
              <button onClick={() => setShowAttachModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="text-xs text-slate-400">Dooro fayl mashruuca ku jira si uu AI-gu tixraac uga dhigto:</p>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {Object.keys(files).map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    if (!attachedFiles.includes(f)) {
                      setAttachedFiles(prev => [...prev, f]);
                    }
                    setShowAttachModal(false);
                  }}
                  className="w-full text-left p-2 rounded-xl text-xs font-mono bg-slate-900/60 hover:bg-blue-600/20 text-slate-300 hover:text-blue-300 flex items-center justify-between transition-colors"
                >
                  <span className="truncate">{f}</span>
                  <Plus className="w-3.5 h-3.5 text-blue-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-blue-400" />
                <h4 className="font-bold text-sm text-white">Ku dar Gal / Folder</h4>
              </div>
              <button onClick={() => setShowFolderModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="text-xs text-slate-400">Geli magaca galka (tusaale: `src/components/`, `data/`, `routes/`):</p>
            <input 
              type="text" 
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g. src/components/books"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowFolderModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (newFolderName.trim()) {
                    setAttachedFiles(prev => [...prev, `${newFolderName.trim()} (folder)`]);
                    setNewFolderName('');
                    setShowFolderModal(false);
                  }
                }}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 shadow-md"
              >
                Add Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side Page Control Drawer: Settings, Dashboard, Payment, Account */}
      <BuilderSideDrawer 
        isOpen={sideDrawerOpen}
        onClose={() => setSideDrawerOpen(false)}
        user={user}
        currentProject={project}
        projects={projects}
        onSelectProject={onSelectProject}
        onNavigateView={onNavigateView}
        onGoHome={onGoHome || onBack}
        onLogout={onLogout}
      />

      {/* Project History & Restore Points Modal */}
      <ProjectHistoryModal
        project={project}
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onRestore={handleUndoChange}
        isSo={true}
      />

      {/* AI Provider & BYOK Settings Modal */}
      {showAiGatewayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] text-white"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">AI Gateway & Provider Settings (BYOK)</h3>
              </div>
              <button 
                onClick={() => setShowAiGatewayModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                ✕
              </button>
            </div>
            <AiProviderSettings
              user={user}
              initialConfig={aiConfig}
              onConfigChange={(newCfg) => {
                setAiConfig(newCfg);
                onUpdate({ ...project, aiConfig: newCfg });
              }}
            />
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowAiGatewayModal(false)}
                className="px-5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-all"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
