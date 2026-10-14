import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Github, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Cpu
} from 'lucide-react';
import { TimeGraphiteBackground } from './TimeGraphiteBackground.tsx';

interface AuthScreenProps {
  type: 'login' | 'signup' | 'welcome';
  onSwitch: (type: 'login' | 'signup' | 'welcome') => void;
  onSuccess: () => void;
  onBackToHome?: () => void;
  isSo: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ 
  type, 
  onSwitch, 
  onSuccess, 
  onBackToHome,
  isSo 
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(
    type === 'signup' ? 'signup' : 'login'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  const handleInstantGuestAccess = () => {
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-[#090913] text-white flex flex-col items-center justify-center p-4 sm:p-8 relative selection:bg-ff-blue/30">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-ff-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-ff-green/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Main Glassmorphic Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-[#14181B] border border-white/10 p-6 sm:p-10 rounded-[2.5rem] shadow-2xl relative z-10"
      >
        {/* Top Header & Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button 
            type="button"
            onClick={onBackToHome}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all border border-white/10 flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isSo ? 'Bogga Hore' : 'Home'}</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-ff-green animate-ping"></div>
            <span className="text-[10px] font-mono text-ff-green font-bold uppercase tracking-wider">
              {isSo ? 'Gelitaanka Nidaamka' : 'Secure System'}
            </span>
          </div>
        </div>

        {/* Brand Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-ff-blue mx-auto mb-4 shadow-lg shadow-ff-blue/20 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {activeTab === 'login' 
              ? (isSo ? 'Gal Akoonkaaga' : 'Welcome Back')
              : (isSo ? 'Sameyso Akoon Cusub' : 'Create Free Account')}
          </h2>

          <p className="text-xs text-slate-500 font-mono mt-1 font-bold">
            {isSo 
              ? 'Ku dhis software-kaaga awoodda AI Agent-ka' 
              : 'Access your autonomous AI Software Engineer'}
          </p>
        </div>

        {/* Tab Switcher: Login / Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-[#090913] rounded-2xl border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'login'
                ? 'bg-ff-blue text-white shadow-lg'
                : 'text-slate-500 hover:text-white'
            }`}
          >
            {isSo ? 'Gal (Login)' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'signup'
                ? 'bg-ff-blue text-white shadow-lg'
                : 'text-slate-500 hover:text-white'
            }`}
          >
            {isSo ? 'Is-diiwaangeli' : 'Register'}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'signup' && (
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1.5 font-bold">
                {isSo ? 'Magacaaga oo dhan' : 'Full Name'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isSo ? 'Tusaale: Axmed Cali' : 'e.g. Alex Johnson'}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1.5 font-bold">
              {isSo ? 'Email Address' : 'Email Address'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1.5 font-bold">
              {isSo ? 'Furaha Sirta ah (Password)' : 'Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 pr-11 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            className="w-full bg-ff-blue hover:bg-blue-600 text-white font-black text-sm uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-ff-blue/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
          >
            <span>
              {activeTab === 'login' 
                ? (isSo ? 'Gal & Tag Qaybta Bot-ka' : 'Sign In & Open Bot') 
                : (isSo ? 'Is-diiwaangeli & Tag Qaybta Bot-ka' : 'Register & Open Bot')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute w-full h-px bg-white/10"></div>
          <span className="relative px-4 bg-[#090d16] text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            {isSo ? 'Ama Ku Bilow' : 'Or Continue With'}
          </span>
        </div>

        {/* Quick Instant Access Button */}
        <button
          type="button"
          onClick={handleInstantGuestAccess}
          className="w-full bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/40 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono font-bold text-cyan-300 hover:text-cyan-200 transition-all flex items-center justify-center gap-2 mb-3 active:scale-[0.98]"
        >
          <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{isSo ? '🚀 Gal Toos ah (Instant Demo Access)' : '🚀 Instant Demo Access'}</span>
        </button>

        {/* Social Auth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onSuccess}
            className="flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-slate-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={onSuccess}
            className="flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-slate-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
