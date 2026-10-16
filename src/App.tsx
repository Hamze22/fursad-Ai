import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LandingPage } from './components/landing/LandingPage.tsx';
import { AuthPage } from './components/auth/AuthPage.tsx';
import { DashboardLayout } from './components/dashboard/DashboardLayout.tsx';
import { BuilderWorkspace } from './components/builder/BuilderWorkspace.tsx';
import { CoursePage } from './components/dashboard/CoursePage.tsx';
import { TemplatesPage } from './components/dashboard/TemplatesPage.tsx';
import { ProjectsPage } from './components/dashboard/ProjectsPage.tsx';
import { BillingPage } from './components/dashboard/BillingPage.tsx';
import { SettingsPage } from './components/dashboard/SettingsPage.tsx';
import { DeploymentsPage } from './components/dashboard/DeploymentsPage.tsx';
import { UIState, User, ProjectState, AppView, AIProviderConfig } from './types.ts';
import { initialProject } from './data/initialProject.ts';
import { generateProjectFromPrompt } from './data/projectGenerator.ts';
import { CreateProjectPane } from './components/CreateProjectPane.tsx';

const STORAGE_PROJECTS_KEY = 'fursad_ai_saved_projects';
const STORAGE_ACTIVE_PROJ_KEY = 'fursad_ai_active_project_id';
const STORAGE_USER_KEY = 'fursad_ai_user_session';

export default function App() {
  // Global UI State
  const [ui, setUi] = useState<UIState>(() => {
    const savedTheme = (localStorage.getItem('fursad_ai_theme') as 'light' | 'dark') || 'dark';
    return {
      view: 'landing', // Always open landing page when app starts/reloads
      theme: savedTheme,
      sidebarOpen: true,
      language: 'en'
    };
  });

  // User State
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_USER_KEY);
      if (savedUser) return JSON.parse(savedUser);
    } catch {}
    return null;
  });

  // Projects State
  const [projects, setProjects] = useState<ProjectState[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [initialProject];
  });

  const [activeProject, setActiveProject] = useState<ProjectState | null>(() => {
    try {
      const savedActiveId = localStorage.getItem(STORAGE_ACTIVE_PROJ_KEY);
      const savedList = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (savedList) {
        const parsed: ProjectState[] = JSON.parse(savedList);
        if (savedActiveId) {
          const match = parsed.find(p => p.id === savedActiveId);
          if (match) return match;
        }
        if (parsed.length > 0 && savedActiveId) return parsed[0];
      }
    } catch {}
    return null;
  });

  const [promptForPane, setPromptForPane] = useState<string>('');

  // Hydrate from and sync with server store
  useEffect(() => {
    axios.get('/api/projects')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProjects(prev => {
            const combined = [...res.data];
            // Add any local projects not on server
            for (const p of prev) {
              if (!combined.some(c => c.id === p.id)) {
                combined.push(p);
                axios.post('/api/projects', p).catch(() => {});
              }
            }
            try {
              localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(combined));
            } catch {}
            return combined;
          });
        }
      })
      .catch(() => {});
  }, []);

  // Save projects to localStorage whenever updated
  const saveProjectsToStorage = (updatedProjects: ProjectState[]) => {
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(updatedProjects));
    } catch (e) {
      console.warn('Storage quota exceeded, preserving active project in session:', e);
    }
  };

  // --- Handlers ---

  const handleAuthSuccess = (userData: User) => {
    const fullUser = {
      ...userData,
      fullName: userData.fullName || 'Ahmed Hassan',
      credits: 75,
      plan: 'pro' as const,
      courseProgress: 25
    };
    setUser(fullUser);
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(fullUser));
    } catch {}
    setUi(prev => ({ ...prev, view: 'builder' }));
  };

  const handleStartBuilding = (initialPrompt?: string) => {
    // When Start Building is clicked, do not directly jump into an existing project.
    // Open the first prompt section (CreateProjectPane) as standard so user can prompt freely.
    setActiveProject(null);
    localStorage.removeItem(STORAGE_ACTIVE_PROJ_KEY);
    setPromptForPane(initialPrompt || '');
    setUi(prev => ({ ...prev, view: 'builder' }));
  };

  const handleCreateProjectFromPrompt = (prompt: string, initialAiConfig?: AIProviderConfig) => {
    const newProj = generateProjectFromPrompt(prompt, 'developer', ui.language);
    if (initialAiConfig) {
      newProj.aiConfig = initialAiConfig;
    }
    const updatedList = [newProj, ...projects.filter(p => p.id !== newProj.id)];
    setProjects(updatedList);
    setActiveProject(newProj);
    saveProjectsToStorage(updatedList);
    localStorage.setItem(STORAGE_ACTIVE_PROJ_KEY, newProj.id);
    axios.post('/api/projects', newProj).catch(() => {});
    setUi(prev => ({ ...prev, view: 'builder' }));
  };

  const handleOpenProject = (project: ProjectState) => {
    setActiveProject(project);
    localStorage.setItem(STORAGE_ACTIVE_PROJ_KEY, project.id);
    setUi(prev => ({ ...prev, view: 'builder' }));
  };

  const handleUpdateProject = (updatedProject: ProjectState) => {
    // Preserve existing project ID strictly!
    const updatedList = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    if (!updatedList.some(p => p.id === updatedProject.id)) {
      updatedList.unshift(updatedProject);
    }
    setProjects(updatedList);
    setActiveProject(updatedProject);
    saveProjectsToStorage(updatedList);
    localStorage.setItem(STORAGE_ACTIVE_PROJ_KEY, updatedProject.id);
    // Persist to server
    axios.put(`/api/projects/${updatedProject.id}`, updatedProject)
      .catch(() => axios.post('/api/projects', updatedProject).catch(() => {}));
  };

  const handleLogout = () => {
    setUser(null);
    setActiveProject(null);
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_ACTIVE_PROJ_KEY);
    setUi(prev => ({ ...prev, view: 'landing' }));
  };

  const handleUseTemplate = (template: any) => {
    const prompt = `Template: ${template.name}. Description: ${template.description}`;
    handleCreateProjectFromPrompt(prompt);
  };

  const handleToggleTheme = () => {
    setUi(prev => {
      const nextTheme = prev.theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('fursad_ai_theme', nextTheme);
      } catch {}
      return { ...prev, theme: nextTheme };
    });
  };

  // --- Render Orchestration ---

  // Landing View
  if (ui.view === 'landing') {
    return (
      <LandingPage 
        onStart={handleStartBuilding}
        onExploreCourse={() => setUi(prev => ({ ...prev, view: 'course' }))}
        onLogin={() => setUi(prev => ({ ...prev, view: 'auth' }))}
        theme={ui.theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  // Course View (Directly accessible to all users & students)
  if (ui.view === 'course' && !user) {
    const demoStudent: User = {
      id: 'student-demo',
      email: 'student@fursad.ai',
      fullName: 'Arday FURSAD (Student)',
      plan: 'pro',
      credits: 75,
      courseProgress: 45
    };

    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
        <CoursePage 
          user={demoStudent}
          language={ui.language}
          onBack={() => setUi(prev => ({ ...prev, view: 'landing' }))}
          onStartBuilding={() => handleStartBuilding()}
        />
      </div>
    );
  }

  // Auth View
  if (ui.view === 'auth') {
    return (
      <AuthPage 
        onSuccess={handleAuthSuccess}
        onBack={() => setUi(prev => ({ ...prev, view: 'landing' }))}
      />
    );
  }

  // Builder Workspace (Full Screen)
  if (ui.view === 'builder') {
    if (!activeProject) {
      return (
        <CreateProjectPane 
          user={user}
          initialPrompt={promptForPane}
          onLogout={handleLogout}
          onGoHome={() => setUi(prev => ({ ...prev, view: 'landing' }))}
          onGenerate={handleCreateProjectFromPrompt}
          projects={projects}
          onOpenProject={handleOpenProject}
          language={ui.language}
          theme={ui.theme}
          onToggleTheme={handleToggleTheme}
        />
      );
    }
    return (
      <BuilderWorkspace 
        project={activeProject}
        user={user}
        projects={projects}
        onUpdate={handleUpdateProject}
        onBack={() => setActiveProject(null)}
        onGoHome={() => {
          setActiveProject(null);
          setUi(prev => ({ ...prev, view: 'landing' }));
        }}
        onNavigateView={(v) => {
          setActiveProject(null);
          setUi(prev => ({ ...prev, view: v }));
        }}
        onLogout={handleLogout}
        onSelectProject={handleOpenProject}
        theme={ui.theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  // Dashboard Layout Views (Sidebar based)
  if (user) {
    return (
      <DashboardLayout
        user={user}
        activeView={ui.view}
        onViewChange={(v) => setUi(prev => ({ ...prev, view: v }))}
        onLogout={handleLogout}
      >
        {(ui.view === 'dashboard' || ui.view === 'projects') && (
          <ProjectsPage 
            projects={projects}
            language={ui.language}
            onNewProject={() => setUi(prev => ({ ...prev, view: 'builder' }))}
            onOpenProject={handleOpenProject}
          />
        )}

        {ui.view === 'course' && (
          <CoursePage 
            user={user}
            language={ui.language}
            onBack={() => setUi(prev => ({ ...prev, view: 'landing' }))}
            onStartBuilding={() => handleStartBuilding()}
          />
        )}

        {ui.view === 'templates' && (
          <TemplatesPage 
            language={ui.language}
            onUseTemplate={handleUseTemplate}
          />
        )}

        {ui.view === 'billing' && (
          <BillingPage 
            user={user}
            language={ui.language}
          />
        )}

        {ui.view === 'settings' && (
          <SettingsPage 
            user={user}
            language={ui.language}
          />
        )}

        {ui.view === 'deployments' && (
          <DeploymentsPage 
            user={user}
            projects={projects}
            onOpenProject={handleOpenProject}
            language={ui.language}
            theme={ui.theme}
          />
        )}
      </DashboardLayout>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 font-mono text-xs uppercase tracking-widest">
       Initializing Neural Logic...
    </div>
  );
}

// Missing icon for deployment view
const Globe = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);
