import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderCode, 
  Sparkles, 
  GraduationCap, 
  Layers, 
  Globe, 
  CreditCard, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import { User, AppView } from '../../types.ts';
import { FursadLogo } from '../common/FursadLogo.tsx';

interface DashboardLayoutProps {
  user: User;
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  user, 
  activeView, 
  onViewChange, 
  onLogout,
  children 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'projects', icon: FolderCode, label: 'My Projects' },
    { id: 'builder', icon: Sparkles, label: 'AI Builder', accent: true },
    { id: 'course', icon: GraduationCap, label: 'Course' },
    { id: 'templates', icon: Layers, label: 'Templates' },
    { id: 'deployments', icon: Globe, label: 'Deployments' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleNavClick = (view: AppView) => {
    onViewChange(view);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex w-64 border-r border-white/5 flex-col shrink-0 bg-slate-900/30 backdrop-blur-3xl sticky top-0 h-screen">
        <div className="p-6">
          <div className="mb-8">
            <FursadLogo size="lg" textSize="2xl" />
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as AppView)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  activeView === item.id
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon className={`w-4 h-4 ${activeView === item.id ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                {item.label}
                {item.accent && (
                   <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 space-y-4">
          {/* Credits Mini-Widget */}
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Credits</span>
              <span className="text-[10px] font-bold text-blue-400">{user.credits}/100</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 w-[75%] rounded-full"></div>
            </div>
            <button onClick={() => handleNavClick('billing')} className="w-full py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all text-slate-300 hover:text-white">Upgrade Plan</button>
          </div>

          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-blue-400 hover:bg-blue-500/5 transition-all group"
          >
            <LogOut className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Drawer (visible when menu opened on mobile) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md md:hidden flex"
          >
            <motion.div 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="w-72 bg-slate-950 border-r border-slate-800 p-6 flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <FursadLogo size="md" textSize="lg" />
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5 flex-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as AppView)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeView === item.id
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>AI Credits:</span>
                  <span className="text-blue-400 font-bold">{user.credits}/100</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-full py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header - Mobile Responsive */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 sm:px-8 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3 flex-1 min-w-0">
             {/* Hamburger button on mobile */}
             <button 
               onClick={() => setMobileMenuOpen(true)}
               className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 shrink-0"
               title="Open Menu"
             >
                <Menu className="w-4 h-4" />
             </button>

             <div className="md:hidden shrink-0">
               <FursadLogo showText={false} size="sm" />
             </div>

             <div className="relative group max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search projects..." 
                  className="w-full bg-slate-900/60 border border-white/5 rounded-xl pl-9 pr-3 py-1.5 text-xs sm:text-sm outline-none focus:border-blue-500/40 transition-all placeholder:text-slate-600"
                />
             </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
               <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-950"></span>
            </button>
            
            <div className="flex items-center gap-2.5 sm:gap-3 pl-3 sm:pl-6 border-l border-white/5">
               <div className="text-right hidden sm:block">
                  <p className="text-xs sm:text-sm font-bold text-white">{user.fullName}</p>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{user.plan} plan</p>
               </div>
               <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-800 border border-blue-500/30 flex items-center justify-center font-bold text-white text-xs">
                  {user.fullName.charAt(0)}
               </div>
            </div>
          </div>
        </header>

        {/* Child Pages */}
        <div className="p-4 sm:p-8 flex-1 overflow-auto">
           {children}
        </div>
      </main>
    </div>
  );
};
