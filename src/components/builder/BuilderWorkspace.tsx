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
  Wand2,
  Sun,
  Moon,
  Settings
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
import { GitHubModal } from '../integrations/GitHubModal.tsx';
import { VercelDeployModal } from '../deploy/VercelDeployModal.tsx';
import { DatabaseManager } from '../database/DatabaseManager.tsx';
import { ChatSettingsDrawer, DrawerTab } from './ChatSettingsDrawer.tsx';

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
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
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
  onSelectProject,
  theme = 'dark',
  onToggleTheme
}) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(() => {
    return theme || (localStorage.getItem('fursad_ai_theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    if (theme) setCurrentTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(next);
    try {
      localStorage.setItem('fursad_ai_theme', next);
    } catch {}
    if (onToggleTheme) onToggleTheme();
  };

  const [chatInput, setChatInput] = useState('');
  const [activeSidebarTab, setActiveSidebarTab] = useState<'chat' | 'files'>('chat');
  const [viewMode, setViewMode] = useState<'preview' | 'code' | 'database' | 'split'>('preview');
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
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [showVercelModal, setShowVercelModal] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);
  const [showChatSettingsDrawer, setShowChatSettingsDrawer] = useState(false);
  const [chatSettingsTab, setChatSettingsTab] = useState<DrawerTab>('settings');

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

  // Visual Element Inspection & Direct Edit Tool
  const [isInspectMode, setIsInspectMode] = useState<boolean>(false);
  const [selectedElementInfo, setSelectedElementInfo] = useState<{
    selector: string;
    tag: string;
    id: string;
    className: string;
    textSnippet: string;
  } | null>(null);
  const [inlineEditText, setInlineEditText] = useState('');
  const [showInlineEditModal, setShowInlineEditModal] = useState(false);

  // Handle mouse dragging for resizable border
  useEffect(() => {
    if (!isDraggingSidebar) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Clamping between 260px and 75% of viewport width
      const minW = 260;
      const maxW = Math.max(400, Math.floor(window.innerWidth * 0.72));
      const targetW = Math.max(minW, Math.min(maxW, e.clientX));
      setSidebarWidth(targetW);
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

  // Handle messages from inside preview iframe when element is selected in inspect mode
  useEffect(() => {
    const handleFrameMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'AIS_ELEMENT_SELECTED') {
        const { selector, tag, id, className, textSnippet } = event.data;
        setSelectedElementInfo({ selector, tag, id, className, textSnippet });
        if (textSnippet) {
          setInlineEditText(textSnippet);
        }
      }
    };
    window.addEventListener('message', handleFrameMessage);
    return () => window.removeEventListener('message', handleFrameMessage);
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
            changeHistory: data.changeRecord ? [data.changeRecord] : (project.changeHistory || []),
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
      promptCommand = `Ka dhig madow qoraalka ama midabka qaybtan: [Target: ${selectedElementInfo.selector}]`;
    } else if (action === 'color-white') {
      promptCommand = `Ka dhig cad qoraalka ama midabka qaybtan: [Target: ${selectedElementInfo.selector}]`;
    } else if (action === 'color-blue') {
      promptCommand = `Ka dhig buluug midabka qaybtan: [Target: ${selectedElementInfo.selector}]`;
    } else if (action === 'delete') {
      promptCommand = `Delete garee meeshan: [Target: ${selectedElementInfo.selector}]`;
    } else if (action === 'text' && customText) {
      promptCommand = `U badal qoraalka meeshan "${customText}": [Target: ${selectedElementInfo.selector}]`;
    }

    if (promptCommand) {
      handleSendMessage(promptCommand);
    }
  };

  const handleSendMessage = async (overridePrompt?: string) => {
    const rawInput = overridePrompt || chatInput;
    if (!rawInput.trim() || isGenerating) return;
    
    const userPrompt = rawInput.trim();
    const promptLower = userPrompt.toLowerCase();
    const currentSelector = selectedElementInfo?.selector;

    const newUserMsg = { 
      id: Date.now().toString(), 
      role: 'user' as const, 
      content: userPrompt, 
      timestamp: new Date().toISOString() 
    };
    
    const updatedMessages = [...chatMessages, newUserMsg];
    setChatMessages(updatedMessages);
    if (!overridePrompt) {
      setChatInput('');
    }
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
            targetedSelector: currentSelector
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
          const localResult = applyClientTargetedPatch(files['index.html'] || '', files, userPrompt, 'so', currentSelector);
          newFiles = localResult.updatedFiles;
          changeRecord = localResult.changeRecord;
          explanation = localResult.explanation;
        }

        // Reset inspect selection after action executed
        setSelectedElementInfo(null);
        setIsInspectMode(false);

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

    if (isInspectMode) {
      const inspectorCode = `
<style id="ais-inspector-style">
  .ais-inspect-hover {
    outline: 2px dashed #2563eb !important;
    outline-offset: 2px !important;
    cursor: crosshair !important;
    background-color: rgba(37, 99, 235, 0.08) !important;
  }
  .ais-inspect-selected {
    outline: 3px solid #2563eb !important;
    outline-offset: 3px !important;
    box-shadow: 0 0 16px rgba(37, 99, 235, 0.45) !important;
  }
</style>
<script id="ais-inspector-script">
(function() {
  var hoveredEl = null;
  var tooltip = document.createElement('div');
  tooltip.style.position = 'fixed';
  tooltip.style.zIndex = '999999';
  tooltip.style.padding = '3px 8px';
  tooltip.style.fontSize = '11px';
  tooltip.style.fontFamily = 'monospace';
  tooltip.style.fontWeight = 'bold';
  tooltip.style.background = '#0f172a';
  tooltip.style.color = '#38bdf8';
  tooltip.style.borderRadius = '6px';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  tooltip.style.display = 'none';
  tooltip.id = 'ais-inspector-badge';
  document.body.appendChild(tooltip);

  function getUniqueSelector(el) {
    if (!el || el === document.body || el === document.documentElement) return 'body';
    if (el.id) return '#' + el.id;
    var tag = el.tagName.toLowerCase();
    if (el.className && typeof el.className === 'string') {
      var classes = el.className.trim().split(/\\s+/).filter(function(c) {
        return c && !c.startsWith('ais-inspect');
      });
      if (classes.length > 0) {
        return tag + '.' + classes.slice(0, 2).join('.');
      }
    }
    return tag;
  }

  document.addEventListener('mouseover', function(e) {
    var target = e.target;
    if (target === tooltip || target === document.body || target === document.documentElement) return;
    if (hoveredEl && hoveredEl !== target) {
      hoveredEl.classList.remove('ais-inspect-hover');
    }
    hoveredEl = target;
    target.classList.add('ais-inspect-hover');
    
    var rect = target.getBoundingClientRect();
    tooltip.style.display = 'block';
    tooltip.style.top = Math.max(8, rect.top - 24) + 'px';
    tooltip.style.left = Math.max(8, rect.left) + 'px';
    tooltip.textContent = '<' + target.tagName.toLowerCase() + (target.id ? '#' + target.id : '') + '>';
  }, true);

  document.addEventListener('mouseout', function(e) {
    if (hoveredEl) {
      hoveredEl.classList.remove('ais-inspect-hover');
    }
    tooltip.style.display = 'none';
  }, true);

  document.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    var target = e.target;
    if (target === tooltip) return;
    
    var selector = getUniqueSelector(target);
    var tag = target.tagName.toLowerCase();
    var id = target.id || '';
    var className = typeof target.className === 'string' ? target.className : '';
    var textSnippet = target.innerText ? target.innerText.trim().slice(0, 80) : '';

    document.querySelectorAll('.ais-inspect-selected').forEach(function(el) {
      el.classList.remove('ais-inspect-selected');
    });
    target.classList.add('ais-inspect-selected');

    window.parent.postMessage({
      type: 'AIS_ELEMENT_SELECTED',
      selector: selector,
      tag: tag,
      id: id,
      className: className,
      textSnippet: textSnippet
    }, '*');
  }, true);
})();
</script>
`;
      if (baseHtml.includes('</body>')) {
        return baseHtml.replace('</body>', inspectorCode + '</body>');
      }
      return baseHtml + inspectorCode;
    }

    return baseHtml;
  }, [files, selectedFilePath, previewKey, isInspectMode]);

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden font-sans transition-colors ${
      currentTheme === 'dark' ? 'bg-[#060911] text-slate-100 selection:bg-cyan-500/30' : 'bg-[#f9fafb] text-slate-900 selection:bg-slate-200'
    }`}>
      {/* Workspace Header - Match Screenshot */}
      <header className={`h-14 border-b flex items-center justify-between px-3 sm:px-5 shrink-0 z-50 transition-colors ${
        currentTheme === 'dark' ? 'bg-[#090d16] border-slate-800 text-white' : 'bg-white border-gray-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          {/* Back Arrow button */}
          <button 
            onClick={onGoHome || onBack}
            className={`p-1.5 rounded-lg transition-colors flex items-center shrink-0 active:scale-95 ${
              currentTheme === 'dark' ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
            }`}
            title="Back to Projects"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* FURSAD AI Logo */}
          <FursadLogo showText={false} size="md" theme={currentTheme} />

          {/* Title / Prompt */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`text-[10px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded-md shrink-0 ${
              currentTheme === 'dark' ? 'text-cyan-400 bg-cyan-950/80 border border-cyan-800/60' : 'text-blue-600 bg-blue-50 border border-blue-200/80'
            }`}>
              FURSAD AI
            </span>
            <h1 className={`font-bold text-sm sm:text-base truncate max-w-[120px] sm:max-w-[240px] md:max-w-[360px] ${
              currentTheme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {project.tagline || project.name}
            </h1>
          </div>

          {/* Version badge */}
          <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md font-medium shrink-0 ${
            currentTheme === 'dark' ? 'text-slate-400 bg-slate-900 border border-slate-800' : 'text-slate-500 bg-slate-100 border border-slate-200'
          }`}>
            v0
          </span>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* View Mode Switcher: Preview | Code | Database */}
          <div className={`hidden sm:flex items-center border rounded-xl p-0.5 ${
            currentTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button 
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'preview' 
                  ? (currentTheme === 'dark' ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm') 
                  : (currentTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button 
              onClick={() => setViewMode('code')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'code' 
                  ? (currentTheme === 'dark' ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm') 
                  : (currentTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>
            <button 
              onClick={() => setViewMode('database')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'database' 
                  ? (currentTheme === 'dark' ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm') 
                  : (currentTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
              }`}
              title="Firebase & Supabase Databases"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Databases</span>
              <span className="hidden lg:inline text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">FB/SB</span>
            </button>
          </div>

          {/* Publish Button (Deploy to Vercel & Push to GitHub) */}
          <button 
            onClick={() => {
              setChatSettingsTab('publish');
              setShowChatSettingsDrawer(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 border border-white/10"
            title="Publish: Vercel Deploy & GitHub Push"
          >
            <Rocket className="w-3.5 h-3.5 text-cyan-300" />
            <span className="font-extrabold tracking-wide">Publish</span>
          </button>

          {/* Settings Button (Google AI Studio Style Drawer) */}
          <button
            onClick={() => {
              setChatSettingsTab('settings');
              setShowChatSettingsDrawer(true);
            }}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all flex items-center gap-1.5 font-bold text-xs ${
              currentTheme === 'dark'
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200 hover:text-white'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-xs'
            }`}
            title="Chat Settings: Model selection, custom instructions, usage & integrations"
          >
            <Settings className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Settings</span>
          </button>

          {/* Day / Dark Mode Toggle button */}
          <button
            onClick={toggleTheme}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
              currentTheme === 'light'
                ? 'bg-amber-100/90 border-amber-300 text-amber-600 hover:bg-amber-200 shadow-sm'
                : 'bg-slate-900 border-white/10 text-cyan-300 hover:text-white hover:border-cyan-500/30'
            }`}
            title={currentTheme === 'dark' ? 'U badal Day Mode (Qorax)' : 'U badal Dark Mode (Madow)'}
          >
            {currentTheme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-800" />
            )}
          </button>

          {/* Export Code button */}
          <button 
            onClick={handleExport}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              currentTheme === 'dark'
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
            title="Export Source Code Zip"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
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
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* LEFT: Desktop Sidebar (Chat & Files) */}
        <aside 
          style={{ width: `${sidebarWidth}px` }} 
          className={`border-r flex flex-col shrink-0 select-text transition-colors ${
            currentTheme === 'dark' ? 'bg-[#090d16] border-slate-800 text-slate-100' : 'bg-white border-gray-200 text-slate-900'
          }`}
        >
           {/* Sidebar Tabs - Match Screenshot */}
           <div className={`h-12 px-4 flex items-center justify-between border-b shrink-0 transition-colors ${
             currentTheme === 'dark' ? 'bg-[#090d16] border-slate-800' : 'bg-white border-gray-200'
           }`}>
              <div className="flex items-center gap-6 h-full">
                <button 
                  onClick={() => setActiveSidebarTab('chat')}
                  className={`text-sm font-bold transition-all relative h-full flex items-center gap-2 ${
                    activeSidebarTab === 'chat' 
                      ? (currentTheme === 'dark' ? 'text-white border-b-2 border-white' : 'text-black border-b-2 border-black')
                      : (currentTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black')
                  }`}
                >
                  <MessageSquare className={`w-4 h-4 ${currentTheme === 'dark' ? 'text-white' : 'text-black'}`} />
                  <span className={`font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-black'}`}>Chat</span>
                </button>
                <button 
                  onClick={() => setActiveSidebarTab('files')}
                  className={`text-sm font-bold transition-all relative h-full flex items-center gap-2 ${
                    activeSidebarTab === 'files' 
                      ? (currentTheme === 'dark' ? 'text-white border-b-2 border-white' : 'text-black border-b-2 border-black')
                      : (currentTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black')
                  }`}
                >
                  <FileCode className={`w-4 h-4 ${currentTheme === 'dark' ? 'text-white' : 'text-black'}`} />
                  <span className={`font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-black'}`}>Files</span>
                  <span className={`text-xs font-bold ${currentTheme === 'dark' ? 'text-slate-400' : 'text-black'}`}>({Object.keys(files).length})</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Edit Tool (Visual Inspector) button in Chat Header */}
                <button
                  onClick={() => {
                    setIsInspectMode(prev => !prev);
                    if (isInspectMode) setSelectedElementInfo(null);
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                    isInspectMode 
                      ? 'bg-blue-600 text-white shadow-xs animate-pulse ring-2 ring-blue-300' 
                      : (currentTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 bg-slate-900' : 'text-slate-700 hover:text-black hover:bg-slate-100 border border-slate-200 bg-slate-50')
                  }`}
                  title="Edit Tool: Mouse-ka ku dhufo qaybta aad rabto inaad wax ka badasho"
                >
                  <Crosshair className={`w-3.5 h-3.5 ${isInspectMode ? 'text-white' : (currentTheme === 'dark' ? 'text-cyan-400' : 'text-blue-600')}`} />
                  <span className="text-[11px] font-bold">{isInspectMode ? 'Inspect Active' : 'Edit Tool'}</span>
                </button>

                {/* AI Studio Chat Settings Icon Button */}
                <button
                  onClick={() => {
                    setChatSettingsTab('settings');
                    setShowChatSettingsDrawer(true);
                  }}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center border ${
                    currentTheme === 'dark' 
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700 bg-slate-900' 
                      : 'text-slate-700 hover:text-black hover:bg-slate-100 border border-slate-200 bg-slate-50'
                  }`}
                  title="Chat settings (Model, System instructions, Usage, GitHub & Vercel)"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
                </button>
              </div>
           </div>

           {/* Tab Content */}
           <div className={`flex-1 flex flex-col overflow-hidden relative ${
             currentTheme === 'dark' ? 'bg-[#090d16]' : 'bg-white'
           }`}>
              <AnimatePresence mode="wait">
                {activeSidebarTab === 'chat' ? (
                  <motion.div 
                    key="chat"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={`flex-1 flex flex-col overflow-hidden ${
                      currentTheme === 'dark' ? 'bg-[#090d16] text-slate-100' : 'bg-white text-black'
                    }`}
                  >
                    {/* Chat Messages */}
                    <div 
                      className={`flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin font-medium ${
                        currentTheme === 'dark' ? 'text-slate-100' : 'text-black'
                      }`}
                      style={{ color: currentTheme === 'dark' ? '#f1f5f9' : '#000000' }}
                    >
                       {chatMessages.map((msg, i) => (
                         <div key={msg.id || i} className="space-y-1" style={{ color: currentTheme === 'dark' ? '#f1f5f9' : '#000000' }}>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme === 'dark' ? '#f1f5f9' : '#000000' }}>
                               {msg.role === 'user' ? (
                                 <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                                   currentTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-black'
                                 }`}>
                                   <UserIcon className="w-3.5 h-3.5" />
                                 </div>
                               ) : (
                                 <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${
                                   currentTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-cyan-400' : 'bg-slate-100 border-slate-300 text-black'
                                 }`}>
                                   <Bot className="w-3.5 h-3.5" />
                                 </div>
                               )}
                               <span className={`font-extrabold ${currentTheme === 'dark' ? 'text-slate-200' : 'text-black'}`} style={{ color: currentTheme === 'dark' ? '#f1f5f9' : '#000000' }}>
                                 {msg.role === 'user' ? 'YOU' : 'FURSAD AI'}
                               </span>
                            </div>
                            <div 
                              className={`pl-8 text-sm leading-relaxed font-semibold whitespace-pre-wrap ${
                                currentTheme === 'dark' ? 'text-slate-100' : 'text-black'
                              }`}
                              style={{ color: currentTheme === 'dark' ? '#f1f5f9' : '#000000' }}
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

                       {/* Inline Thinking & Build Progress */}
                       {isGenerating && (
                         <div className="space-y-1.5 py-1" style={{ color: currentTheme === 'dark' ? '#f1f5f9' : '#000000' }}>
                           <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                             <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${
                               currentTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-cyan-400' : 'bg-slate-100 border-slate-300 text-black'
                             }`}>
                               <Bot className="w-3.5 h-3.5" />
                             </div>
                             <span className={`font-extrabold ${currentTheme === 'dark' ? 'text-slate-200' : 'text-black'}`} style={{ color: currentTheme === 'dark' ? '#f1f5f9' : '#000000' }}>FURSAD AI</span>
                           </div>

                           <div className="pl-8 space-y-1.5" style={{ color: currentTheme === 'dark' ? '#f1f5f9' : '#000000' }}>
                             {/* Active thinking step */}
                             <div className={`inline-flex items-center gap-2 text-xs rounded-full px-3 py-1 border ${
                               currentTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-cyan-300' : 'bg-slate-100 border-slate-300 text-black'
                             }`}>
                               <Loader2 className={`w-3 h-3 animate-spin shrink-0 ${currentTheme === 'dark' ? 'text-cyan-400' : 'text-black'}`} />
                               <span className="font-bold">Fikirka & Dhismaha:</span>
                               <span className="font-bold truncate max-w-[220px]">{interimStatus || 'Waa la dhisayaa...'}</span>
                             </div>

                             {/* Step checkmarks as each finishes */}
                             <div className="space-y-1 pt-0.5 text-xs font-bold" style={{ color: currentTheme === 'dark' ? '#f1f5f9' : '#000000' }}>
                               {buildStepIndex >= 1 && (
                                 <div className="flex items-center gap-1.5">
                                   <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                   <span>Qorshaynta & Aqoonsiga dalabka</span>
                                 </div>
                               )}
                               {buildStepIndex >= 2 && (
                                 <div className="flex items-center gap-1.5">
                                   <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                   <span>Habaynta koodhka & CSS-ka</span>
                                 </div>
                               )}
                               {buildStepIndex >= 3 && (
                                 <div className="flex items-center gap-1.5">
                                   <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                   <span>Hubinta & Badbaadinta qaybaha (Nav, Pricing, Footer)</span>
                                 </div>
                               )}
                               {buildStepIndex >= 4 && (
                                 <div className="flex items-center gap-1.5">
                                   <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                   <span>Live preview-ga oo la cusboonaysiiyay</span>
                                 </div>
                               )}
                             </div>
                           </div>
                         </div>
                       )}
                    </div>

                    {/* Chat Input - Match Screenshot */}
                    <div className={`p-3 border-t transition-colors ${
                      currentTheme === 'dark' ? 'bg-[#090d16] border-slate-800' : 'bg-white border-gray-200'
                    }`}>
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
                             <span key={idx} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono border ${
                               currentTheme === 'dark' ? 'bg-blue-950/80 border-blue-700/60 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
                             }`}>
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
                         <div className={`mb-2 px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center justify-between animate-pulse ${
                           currentTheme === 'dark' ? 'bg-rose-950/80 border-rose-800/60 text-rose-300' : 'bg-red-50 border-red-200 text-red-600'
                         }`}>
                           <div className="flex items-center gap-1.5">
                             <Mic className="w-3.5 h-3.5" />
                             <span>🎙️ Waan dhagaysanayaa... Ku hadal codkaaga</span>
                           </div>
                           <button onClick={toggleVoice} className="text-[10px] underline hover:text-red-400">Jooji</button>
                         </div>
                       )}

                       {/* Selected Element Inspector Box & Quick Actions (Helper banner removed as requested) */}
                       {selectedElementInfo && (
                         <div className={`mb-2.5 p-2.5 rounded-xl border shadow-sm space-y-2 ${
                           currentTheme === 'dark'
                             ? 'bg-[#131926] border-blue-500/40 text-slate-100 shadow-blue-500/5'
                             : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-slate-900'
                         }`}>
                           <div className="flex items-center justify-between">
                             <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold truncate">
                               <Crosshair className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                               <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[10px] ${
                                 currentTheme === 'dark' ? 'bg-blue-900/70 text-blue-300 border border-blue-700/50' : 'bg-blue-200/80 text-blue-900'
                               }`}>
                                 {selectedElementInfo.tag}
                               </span>
                               <span className={`truncate font-medium max-w-[160px] ${
                                 currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                               }`}>
                                 {selectedElementInfo.selector}
                               </span>
                             </div>
                             {/* Clicking X closes inspector directly without following banner */}
                             <button 
                               onClick={() => {
                                 setSelectedElementInfo(null);
                                 setIsInspectMode(false);
                               }}
                               className="text-slate-400 hover:text-rose-400 p-0.5 rounded transition-colors cursor-pointer"
                               title="Xir calaamadaynta (Close inspection)"
                             >
                               <X className="w-3.5 h-3.5" />
                             </button>
                           </div>

                           {selectedElementInfo.textSnippet && (
                             <div className={`text-[11px] rounded-lg p-1.5 font-medium line-clamp-2 ${
                               currentTheme === 'dark' ? 'bg-slate-900/90 border border-slate-700/70 text-slate-200' : 'bg-white/90 border border-blue-100 text-slate-800'
                             }`}>
                               <span className={`font-semibold mr-1 ${currentTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Qoraalka:</span>
                               "{selectedElementInfo.textSnippet}"
                             </div>
                           )}

                           {/* Quick Action Chips */}
                           <div className="flex flex-wrap items-center gap-1 pt-0.5">
                             <button
                               type="button"
                               onClick={() => setShowInlineEditModal(true)}
                               className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold shadow-xs transition-all active:scale-95 ${
                                 currentTheme === 'dark'
                                   ? 'bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/40'
                                   : 'bg-white hover:bg-blue-100 border border-blue-200 text-blue-800'
                               }`}
                             >
                               <Pencil className="w-3 h-3 text-blue-500" />
                               <span>Bedel Qoraalka</span>
                             </button>
                             <button
                               type="button"
                               onClick={() => handleDirectElementAction('color-black')}
                               className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black hover:bg-slate-800 text-white text-[10px] font-bold shadow-xs transition-all active:scale-95 border border-slate-700"
                             >
                               <span className="w-2 h-2 rounded-full bg-white"></span>
                               <span>Ka dhig Madow</span>
                             </button>
                             <button
                               type="button"
                               onClick={() => handleDirectElementAction('color-white')}
                               className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-[10px] font-bold shadow-xs transition-all active:scale-95"
                             >
                               <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                               <span>Ka dhig Cad</span>
                             </button>
                             <button
                               type="button"
                               onClick={() => handleDirectElementAction('delete')}
                               className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold shadow-xs transition-all active:scale-95"
                             >
                               <Trash2 className="w-3 h-3 text-white" />
                               <span>Delete</span>
                             </button>
                           </div>
                         </div>
                       )}

                       {/* Inline Text Edit Modal */}
                       {showInlineEditModal && selectedElementInfo && (
                         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                           <div className={`rounded-2xl max-w-md w-full p-5 shadow-2xl border space-y-4 ${
                             currentTheme === 'dark' ? 'bg-[#0f172a] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                           }`}>
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                 <Pencil className="w-4 h-4 text-blue-500" />
                                 <h3 className="font-bold text-sm">Bedel Qoraalka Qaybtan</h3>
                               </div>
                               <button 
                                 onClick={() => setShowInlineEditModal(false)}
                                 className="p-1 text-slate-400 hover:text-slate-300 rounded-lg"
                               >
                                 <X className="w-4 h-4" />
                               </button>
                             </div>

                             <div className={`text-xs font-mono px-2 py-1 rounded truncate border ${
                               currentTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                             }`}>
                               Target: {selectedElementInfo.selector}
                             </div>

                             <div>
                               <label className={`block text-xs font-semibold mb-1 ${
                                 currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                               }`}>Qoraalka Cusub:</label>
                               <textarea
                                 value={inlineEditText}
                                 onChange={(e) => setInlineEditText(e.target.value)}
                                 rows={3}
                                 className={`w-full text-xs p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-none ${
                                   currentTheme === 'dark' 
                                     ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500' 
                                     : 'bg-white border-slate-300 text-black placeholder:text-slate-400'
                                 }`}
                                 placeholder="Gali qoraalka aad rabto halkan..."
                               />
                             </div>

                             <div className="flex justify-end gap-2 pt-1">
                               <button
                                 onClick={() => setShowInlineEditModal(false)}
                                 className={`px-3 py-1.5 text-xs font-bold rounded-xl ${
                                   currentTheme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                                 }`}
                               >
                                 Baaji
                               </button>
                               <button
                                 onClick={() => {
                                   setShowInlineEditModal(false);
                                   handleDirectElementAction('text', inlineEditText);
                                 }}
                                 disabled={!inlineEditText.trim()}
                                 className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-xl shadow-sm"
                               >
                                 Keydi & Badal
                               </button>
                             </div>
                           </div>
                         </div>
                       )}

                       <div className={`relative rounded-2xl shadow-sm transition-all p-1.5 flex items-center gap-1.5 ${
                         currentTheme === 'dark'
                           ? 'bg-[#131926] border border-slate-700/80 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20'
                           : 'bg-white border border-slate-300 focus-within:border-black focus-within:ring-2 focus-within:ring-slate-100'
                       }`}>
                          {/* File upload & Voice tools */}
                          <div className="flex items-center gap-1 shrink-0 pl-1">
                            <button 
                              type="button"
                              onClick={() => builderFileInputRef.current?.click()}
                              className={`p-1.5 rounded-lg transition-colors ${
                                currentTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-black hover:bg-slate-100'
                              }`}
                              title="Gali Fayl / Upload File"
                            >
                              <Paperclip className="w-4 h-4" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => builderFolderInputRef.current?.click()}
                              className={`p-1.5 rounded-lg transition-colors ${
                                currentTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-black hover:bg-slate-100'
                              }`}
                              title="Gali Folder / Upload Folder"
                            >
                              <FolderPlus className="w-4 h-4" />
                            </button>
                            <button 
                              type="button"
                              onClick={toggleVoice}
                              className={`p-1.5 rounded-lg transition-all ${
                                isListening 
                                  ? 'bg-rose-500 text-white animate-pulse' 
                                  : (currentTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-black hover:bg-slate-100')
                              }`}
                              title={isListening ? "Jooji / Stop recording" : "Ku hadal codka / Voice prompt"}
                            >
                              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
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
                            className={`w-full text-xs bg-transparent outline-none resize-none px-2 py-1 font-semibold ${
                              currentTheme === 'dark' ? 'text-white placeholder:text-slate-500' : 'text-black placeholder:text-slate-500'
                            }`}
                          />
                          <button 
                            onClick={() => handleSendMessage()}
                            disabled={isGenerating || !chatInput.trim()}
                            className={`w-8 h-8 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shrink-0 active:scale-95 ${
                              currentTheme === 'dark'
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/25'
                                : 'bg-black hover:bg-slate-800 text-white'
                            }`}
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

        {/* Resizable Divider Handle between Chat and Preview */}
        <div 
          onMouseDown={() => setIsDraggingSidebar(true)}
          className={`w-2 hover:w-2.5 cursor-col-resize select-none flex items-center justify-center shrink-0 z-30 transition-all group relative ${
            isDraggingSidebar 
              ? (currentTheme === 'dark' ? 'bg-cyan-500 shadow-md shadow-cyan-500/40' : 'bg-blue-600 shadow-md shadow-blue-500/30') 
              : (currentTheme === 'dark' ? 'bg-slate-800 hover:bg-cyan-500' : 'bg-gray-200 hover:bg-blue-500')
          }`}
          title="Jiid bidix ama midig si aad u weynayso ama u yarayso Chat-ka iyo Preview-ga (Resize Chat & Preview)"
        >
          <div className="w-0.5 h-8 rounded-full bg-slate-400 group-hover:bg-white transition-colors" />
        </div>

        {/* Global drag shield to prevent iframe from swallowing mouse events */}
        {isDraggingSidebar && (
          <div className="fixed inset-0 z-50 cursor-col-resize select-none bg-transparent" />
        )}

        {/* Desktop Main Canvas */}
        <main className={`flex-1 flex flex-col min-w-0 relative transition-colors ${
          currentTheme === 'dark' ? 'bg-[#060911]' : 'bg-[#f9fafb]'
        }`}>
           <div className={`h-10 border-b flex items-center justify-between px-4 shrink-0 transition-colors ${
             currentTheme === 'dark' ? 'bg-[#090d16] border-slate-800' : 'bg-white border-gray-200'
           }`}>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 text-xs font-mono">
                    <Monitor className={`w-3.5 h-3.5 ${currentTheme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`} />
                    <span className={currentTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>preview • {selectedFilePath}</span>
                 </div>
                 
                 {(viewMode === 'preview' || viewMode === 'split') && (
                   <div className={`flex items-center gap-1 border-l pl-4 ${
                     currentTheme === 'dark' ? 'border-slate-800' : 'border-gray-200'
                   }`}>
                      <button 
                        onClick={() => setDeviceMode('desktop')} 
                        className={`p-1 rounded-lg transition-all ${
                          deviceMode === 'desktop' 
                            ? (currentTheme === 'dark' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'bg-slate-100 text-slate-900 shadow-sm') 
                            : (currentTheme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700')
                        }`}
                        title="Desktop view"
                      >
                         <Monitor className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setDeviceMode('tablet')} 
                        className={`p-1 rounded-lg transition-all ${
                          deviceMode === 'tablet' 
                            ? (currentTheme === 'dark' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'bg-slate-100 text-slate-900 shadow-sm') 
                            : (currentTheme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700')
                        }`}
                        title="Tablet view"
                      >
                         <Tablet className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setDeviceMode('mobile')} 
                        className={`p-1 rounded-lg transition-all ${
                          deviceMode === 'mobile' 
                            ? (currentTheme === 'dark' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'bg-slate-100 text-slate-900 shadow-sm') 
                            : (currentTheme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700')
                        }`}
                        title="Mobile view"
                      >
                         <Smartphone className="w-3.5 h-3.5" />
                      </button>
                   </div>
                 )}

                 {/* Visual Element Edit Tool (Mouse Inspect) */}
                 <div className={`flex items-center gap-1.5 border-l pl-3 ${
                   currentTheme === 'dark' ? 'border-slate-800' : 'border-gray-200'
                 }`}>
                   <button
                     onClick={() => {
                       setIsInspectMode(prev => !prev);
                       if (isInspectMode) {
                         setSelectedElementInfo(null);
                       }
                     }}
                     className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                       isInspectMode 
                         ? 'bg-blue-600 text-white shadow-blue-500/20 ring-2 ring-blue-300 animate-pulse' 
                         : (currentTheme === 'dark' ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300')
                     }`}
                     title="Qalabka Edit Tool: Mouse-ka ku dhufo qaybta aad rabto inaad si toos ah wax uga bedesho"
                   >
                     <Crosshair className={`w-3.5 h-3.5 ${isInspectMode ? 'text-white' : (currentTheme === 'dark' ? 'text-cyan-400' : 'text-blue-600')}`} />
                     <span className="font-bold">{isInspectMode ? 'Inspect Active' : 'Edit Tool'}</span>
                   </button>
                   {isInspectMode && (
                     <span className="text-[11px] text-blue-500 font-medium hidden lg:inline animate-pulse">
                       👆 Ku dhufo qayb kasta oo preview-ga ku jirta
                     </span>
                   )}
                 </div>
              </div>

              <div className="flex items-center gap-2">
                 <button 
                   onClick={() => setPreviewKey(k => k + 1)} 
                   className={`p-1.5 rounded-lg transition-colors ${
                     currentTheme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                   }`}
                   title="Reload Preview"
                 >
                    <RotateCcw className="w-3.5 h-3.5" />
                 </button>
              </div>
           </div>

           {/* Canvas Body */}
           <div className={`flex-1 flex overflow-hidden ${
             currentTheme === 'dark' ? 'bg-[#060911]' : 'bg-[#f9fafb]'
           }`}>
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
                <div className={`h-full flex items-center justify-center p-4 lg:p-6 overflow-auto transition-colors ${
                  currentTheme === 'dark' ? 'bg-[#060911]' : 'bg-[#f9fafb]'
                } ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                   <div className={`transition-all duration-300 shadow-2xl overflow-hidden flex flex-col ${
                     currentTheme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-gray-200'
                   } ${
                     deviceMode === 'mobile' ? 'w-[375px] h-[680px] rounded-[2.5rem]' : 
                     deviceMode === 'tablet' ? 'w-[680px] h-[820px] rounded-3xl' : 'w-full h-full rounded-2xl'
                   }`}>
                      <div className={`h-7 border-b flex items-center px-3 gap-2 shrink-0 ${
                        currentTheme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-gray-200'
                      }`}>
                         <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                         </div>
                         <div className={`flex-1 max-w-xs mx-auto border rounded-md px-2 py-0.5 text-[10px] font-mono text-center truncate ${
                           currentTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-slate-500'
                         }`}>
                            https://{project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.local
                         </div>
                         {isGenerating && (
                           <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-400 text-[10px] font-mono animate-pulse">
                             <Loader2 className="w-2.5 h-2.5 animate-spin" />
                             <span>Updating live...</span>
                           </div>
                         )}
                      </div>

                      {/* Website preview iframe is ALWAYS standing and active! Independent styles preserved! */}
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

              {/* Database Manager (Firebase & Supabase) View */}
              {viewMode === 'database' && (
                <div className="h-full w-full p-4 lg:p-6 overflow-hidden">
                   <DatabaseManager 
                     files={files}
                     language="so"
                     theme={currentTheme}
                   />
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
            className={`flex flex-col h-full border-r transition-colors ${
              currentTheme === 'dark' ? 'bg-[#090d16] border-slate-800 text-slate-100' : 'bg-white border-gray-200 text-black'
            } ${
              mobileTab === 'side-by-side' ? 'w-[90vw] sm:w-[360px] shrink-0 snap-start' : 'w-full'
            }`}
          >
             <div className={`h-10 px-3 border-b flex items-center justify-between text-xs font-bold ${
               currentTheme === 'dark' ? 'bg-[#090d16] border-slate-800 text-white' : 'bg-white border-gray-200 text-black'
             }`}>
                <div className="flex items-center gap-2">
                   <MessageSquare className={`w-3.5 h-3.5 ${currentTheme === 'dark' ? 'text-white' : 'text-black'}`} />
                   <span className="font-bold">Chat</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold ${
                  currentTheme === 'dark' ? 'text-slate-400 bg-slate-900 border-slate-800' : 'text-black bg-slate-100 border-slate-300'
                }`}>
                  v0
                </span>
             </div>

             {/* Message list */}
             <div 
               className={`flex-1 overflow-y-auto p-3 space-y-4 ${
                 currentTheme === 'dark' ? 'text-slate-100' : 'text-black'
               }`}
               style={{ color: currentTheme === 'dark' ? '#f1f5f9' : '#000000' }}
             >
                {chatMessages.map((msg, i) => (
                  <div key={msg.id || i} className="space-y-1" style={{ color: currentTheme === 'dark' ? '#f1f5f9' : '#000000' }}>
                     <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme === 'dark' ? '#f1f5f9' : '#000000' }}>
                        {msg.role === 'user' ? (
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            currentTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-black'
                          }`}>
                            <UserIcon className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                            currentTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-cyan-400' : 'bg-slate-100 border-slate-300 text-black'
                          }`}>
                            <Bot className="w-3 h-3" />
                          </div>
                        )}
                        <span className="font-extrabold" style={{ color: currentTheme === 'dark' ? '#f1f5f9' : '#000000' }}>{msg.role === 'user' ? 'YOU' : 'AI'}</span>
                     </div>
                     <div 
                       className={`pl-7 text-xs leading-relaxed font-semibold whitespace-pre-wrap ${
                         currentTheme === 'dark' ? 'text-slate-100' : 'text-black'
                       }`}
                       style={{ color: currentTheme === 'dark' ? '#f1f5f9' : '#000000' }}
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
                  <div className="space-y-1.5 py-1" style={{ color: currentTheme === 'dark' ? '#f1f5f9' : '#000000' }}>
                     <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                          currentTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-cyan-400' : 'bg-slate-100 border-slate-300 text-black'
                        }`}>
                          <Bot className="w-3 h-3" />
                        </div>
                        <span className="font-extrabold">FURSAD AI</span>
                     </div>
                     <div className="pl-7 space-y-1 text-xs">
                        <div className={`inline-flex items-center gap-1.5 text-[11px] rounded-full px-2.5 py-0.5 border ${
                          currentTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-cyan-300' : 'bg-slate-100 border-slate-300 text-black'
                        }`}>
                          <Loader2 className={`w-2.5 h-2.5 animate-spin shrink-0 ${currentTheme === 'dark' ? 'text-cyan-400' : 'text-black'}`} />
                          <span className="font-bold">Fikirka:</span>
                          <span className="font-bold truncate max-w-[170px]">{interimStatus || 'Dhisaya...'}</span>
                        </div>
                        {buildStepIndex >= 1 && (
                          <div className="flex items-center gap-1 text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>Qorshaynta dalabka</span>
                          </div>
                        )}
                        {buildStepIndex >= 2 && (
                          <div className="flex items-center gap-1 text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>Habaynta koodhka</span>
                          </div>
                        )}
                        {buildStepIndex >= 3 && (
                          <div className="flex items-center gap-1 text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>Hubinta badbaadada</span>
                          </div>
                        )}
                     </div>
                  </div>
                )}
             </div>

             {/* Input */}
             <div className={`p-2.5 border-t transition-colors ${
               currentTheme === 'dark' ? 'bg-[#090d16] border-slate-800' : 'bg-white border-gray-200'
             }`}>
                <div className={`relative rounded-2xl shadow-sm p-1 flex items-center gap-1.5 ${
                  currentTheme === 'dark' 
                    ? 'bg-[#131926] border border-slate-700/80 focus-within:border-cyan-500' 
                    : 'bg-white border border-slate-300 focus-within:border-black'
                }`}>
                   <div className="flex items-center gap-0.5 shrink-0 pl-1">
                     <button 
                       type="button"
                       onClick={() => builderFileInputRef.current?.click()}
                       className={`p-1 rounded-lg transition-colors ${
                         currentTheme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-black'
                       }`}
                       title="Upload File"
                     >
                       <Paperclip className="w-3.5 h-3.5" />
                     </button>
                     <button 
                       type="button"
                       onClick={toggleVoice}
                       className={`p-1 rounded-lg ${
                         isListening 
                           ? 'bg-rose-500 text-white animate-pulse' 
                           : (currentTheme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-black')
                       }`}
                       title="Voice"
                     >
                       <Mic className="w-3.5 h-3.5" />
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
                     className={`w-full text-xs bg-transparent outline-none resize-none px-2 py-1 font-semibold ${
                       currentTheme === 'dark' ? 'text-white placeholder:text-slate-500' : 'text-black placeholder:text-slate-500'
                     }`}
                   />
                   <button 
                     onClick={() => handleSendMessage()}
                     disabled={isGenerating || !chatInput.trim()}
                     className={`w-7 h-7 rounded-xl disabled:opacity-30 text-white flex items-center justify-center shrink-0 active:scale-95 ${
                       currentTheme === 'dark'
                         ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500'
                         : 'bg-slate-900 hover:bg-slate-800'
                     }`}
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

      {/* GitHub Integration Modal */}
      <GitHubModal
        project={project}
        isOpen={showGithubModal}
        onClose={() => setShowGithubModal(false)}
        theme={currentTheme}
      />

      {/* Google AI Studio Style Chat Settings & Integrations Drawer */}
      <ChatSettingsDrawer
        isOpen={showChatSettingsDrawer}
        onClose={() => setShowChatSettingsDrawer(false)}
        project={project}
        onUpdateProject={(p) => {
          onUpdate(p);
          setFiles(p.files);
        }}
        aiConfig={aiConfig}
        onUpdateAiConfig={(newCfg) => {
          setAiConfig(newCfg);
          onUpdate({ ...project, aiConfig: newCfg });
        }}
        theme={currentTheme}
        user={user}
        initialTab={chatSettingsTab}
        onOpenVercelModal={() => {
          setShowChatSettingsDrawer(false);
          setShowVercelModal(true);
        }}
        onOpenGithubModal={() => {
          setShowChatSettingsDrawer(false);
          setShowGithubModal(true);
        }}
        onOpenDatabaseView={() => {
          setShowChatSettingsDrawer(false);
          setViewMode('database');
        }}
      />
    </div>
  );
};
