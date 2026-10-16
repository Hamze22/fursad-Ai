export type PersonaType = 'developer' | 'learner' | 'founder' | 'agency';
export type LanguageType = 'so' | 'en';
export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  credits: number;
  plan: 'free' | 'first-access' | 'pro';
  courseProgress: number;
}

export interface ProjectFile {
  id: string;
  path: string;
  name: string;
  language: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  changeRecord?: ChangeRecord;
}

export interface DbTable {
  name: string;
  columns: string[];
  rows?: any[];
  sampleRows?: any[];
}

export type AIProviderType = 'gemini' | 'openai' | 'cloudflare' | 'groq' | 'anthropic';

export interface AIProviderConfig {
  provider: AIProviderType;
  model: string;
  apiKey?: string; // BYOK (stored securely)
  accountId?: string; // Cloudflare Account ID
  useCustomKey: boolean;
  temperature?: number;
}

export interface AIModelInfo {
  id: string;
  name: string;
  provider: AIProviderType;
  description: string;
  contextWindow: string;
  recommendedFor: 'fast-edits' | 'full-builds' | 'code-refactor' | 'balanced';
  isDefault?: boolean;
  requiresByok?: boolean;
}

export interface ChangeRecord {
  id: string;
  timestamp: string;
  originalRequest: string;
  filesModified: string[];
  summary: string;
  targetElement?: string;
  beforeSnippet?: string;
  afterSnippet?: string;
  changeType?: 'style' | 'content' | 'feature' | 'layout' | 'refactor';
  validation: {
    passed: boolean;
    checks: string[];
  };
  previewStatus: 'synced' | 'pending';
  saveStatus: 'saved' | 'pending';
  snapshot: Record<string, string>; // Files snapshot prior to this change for 1-click restore
}

export interface ProjectState {
  id: string;
  _id?: string; // Support both id and _id for now
  userId: string;
  name: string;
  description: string;
  version?: number;
  status: 'draft' | 'building' | 'deployed' | 'completed';
  published?: boolean;
  createdAt: string;
  updatedAt: string;
  previewUrl?: string;
  dbSchema?: DbTable[];
  tagline?: string;
  steps?: any[];
  files: Record<string, string>;
  messages: ChatMessage[];
  databaseTables?: DbTable[];
  changeHistory?: ChangeRecord[];
  aiConfig?: AIProviderConfig;
  customInstructions?: string;
}

export type AppView = 'landing' | 'auth' | 'dashboard' | 'builder' | 'course' | 'billing' | 'settings' | 'projects' | 'templates' | 'deployments';

export interface UIState {
  view: AppView;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  activeProjectId?: string;
  activeFilePath?: string;
  language: LanguageType;
}

