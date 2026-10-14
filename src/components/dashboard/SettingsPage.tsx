import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Globe, 
  Smartphone,
  CheckCircle2,
  Lock,
  Camera,
  Trash2,
  ChevronRight,
  Database,
  Cpu
} from 'lucide-react';
import { User as UserType, LanguageType } from '../../types.ts';
import { AiProviderSettings } from './AiProviderSettings.tsx';

export const SettingsPage: React.FC<{ user: UserType; language: LanguageType }> = ({ user, language }) => {
  const isSo = language === 'so';
  const [tab, setTab] = React.useState<'ai' | 'profile' | 'security'>('ai');

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white">{isSo ? 'Habaynta & AI Gateway' : 'Settings & AI Gateway'}</h1>
          <p className="text-slate-400">{isSo ? 'Maamul furayaashaada AI (BYOK), providers-ka, iyo amniga account-ka.' : 'Manage your multi-provider AI keys (BYOK), preferences, and account credentials.'}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
          <button
            onClick={() => setTab('ai')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              tab === 'ai'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            {isSo ? 'AI Providers & BYOK' : 'AI Providers & BYOK Keys'}
          </button>
          <button
            onClick={() => setTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              tab === 'profile'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            {isSo ? 'Profile & Account' : 'Profile & Account'}
          </button>
          <button
            onClick={() => setTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              tab === 'security'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            {isSo ? 'Amniga (Security)' : 'Security & Privacy'}
          </button>
        </div>
      </div>

      {tab === 'ai' && (
        <section className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-6 sm:p-8 space-y-6">
          <AiProviderSettings user={user} language={language} />
        </section>
      )}

      {tab === 'profile' && (
        <div className="grid grid-cols-1 gap-8">
        {/* Profile Section */}
        <section className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-8 space-y-8">
           <div className="flex items-center gap-6">
              <div className="relative group">
                 <div className="w-24 h-24 rounded-3xl bg-slate-800 flex items-center justify-center text-3xl font-black text-slate-500 overflow-hidden border border-white/10 group-hover:border-cyan-500/50 transition-all shadow-2xl">
                    {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : user.fullName.charAt(0)}
                 </div>
                 <button className="absolute -bottom-2 -right-2 p-2 bg-cyan-500 text-white rounded-xl shadow-xl hover:bg-cyan-400 transition-all border border-slate-950">
                    <Camera className="w-4 h-4" />
                 </button>
              </div>
              <div>
                 <h3 className="text-xl font-black text-white">{user.fullName}</h3>
                 <p className="text-sm text-slate-500">{user.email}</p>
                 <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Active Account</span>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/5 text-slate-600 border border-white/10">{user.plan}</span>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                 <input 
                   type="text" 
                   defaultValue={user.fullName}
                   className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/30 transition-all"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                 <input 
                   type="email" 
                   defaultValue={user.email}
                   className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/30 transition-all"
                 />
              </div>
           </div>
           
           <div className="flex justify-end pt-4 border-t border-white/5">
              <button className="bg-white text-slate-950 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-cyan-400 hover:text-white transition-all shadow-xl active:scale-95">Save Changes</button>
           </div>
        </section>
      </div>
      )}

      {tab === 'security' && (
        <div className="grid grid-cols-1 gap-8">
          {/* Security Section */}
          <section className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
             <h3 className="text-xl font-black text-white flex items-center gap-3">
                <Shield className="w-5 h-5 text-indigo-400" />
                Security & Privacy
             </h3>
             
             <div className="space-y-4">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                         <Lock className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                         <p className="text-[10px] text-slate-500">Secure your account with 2FA.</p>
                      </div>
                   </div>
                   <button className="text-xs font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Enable</button>
                </div>
                
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                         <Database className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-white">Data Privacy & Logs</p>
                         <p className="text-[10px] text-slate-500">Manage your stored AI training data.</p>
                      </div>
                   </div>
                   <button className="text-xs font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest">Manage</button>
                </div>
             </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] p-8 space-y-6">
             <h3 className="text-xl font-black text-rose-500 flex items-center gap-3">
                <Trash2 className="w-5 h-5" />
                Danger Zone
             </h3>
             <p className="text-sm text-slate-500 leading-relaxed">
               Deleting your account is permanent and will remove all your projects, credits, and course progress. This action cannot be undone.
             </p>
             <button className="px-6 py-3 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-500 hover:text-white transition-all active:scale-95">
               Delete Account Permanentally
             </button>
          </section>
        </div>
      )}
    </div>
  );
};
