import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Github, 
  Eye, 
  EyeOff,
  Zap,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { FursadLogo } from '../common/FursadLogo.tsx';

interface AuthPageProps {
  onSuccess: (user: any) => void;
  onBack: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBack }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock successful auth
    setTimeout(() => {
      onSuccess({
        id: 'user-1',
        email: 'dev@somai.dev',
        fullName: 'Somali Developer',
        credits: 50,
        plan: 'free',
        courseProgress: 0
      });
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden font-sans">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          {/* Brand Logo */}
          <div className="flex flex-col items-center mb-8">
            <FursadLogo size="xl" textSize="2xl" layout="vertical" className="mb-2" />
            <p className="text-slate-500 text-xs font-mono mt-2 uppercase tracking-widest">Secure Access Protocol</p>
          </div>

          {/* Form Card */}
          <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            {/* Top Back Button */}
            <button 
              onClick={onBack}
              className="absolute top-6 left-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="mb-8 mt-4">
              <h2 className="text-2xl font-black text-white">
                {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Join the Network' : 'Reset Access'}
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                {mode === 'login' 
                  ? 'Access your AI projects and workspace.' 
                  : mode === 'signup' 
                  ? 'Start your vibe coding journey today.' 
                  : 'Enter your email to receive a reset link.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">Full Name</label>
                    <div className="relative group">
                      <input 
                        type="text" 
                        required
                        placeholder="Ahmed Cali" 
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3.5 pl-11 text-sm outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder:text-slate-700"
                      />
                      <User className="w-4 h-4 text-slate-600 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-400 transition-colors" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">Email Address</label>
                <div className="relative group">
                  <input 
                    type="email" 
                    required
                    placeholder="name@system.com" 
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3.5 pl-11 text-sm outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder:text-slate-700"
                  />
                  <Mail className="w-4 h-4 text-slate-600 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-400 transition-colors" />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                    {mode === 'login' && (
                      <button type="button" onClick={() => setMode('forgot')} className="text-[10px] font-bold text-cyan-500 hover:text-cyan-400 uppercase tracking-widest">Forgot?</button>
                    )}
                  </div>
                  <div className="relative group">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required
                      placeholder="••••••••••••" 
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3.5 pl-11 pr-11 text-sm outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder:text-slate-700"
                    />
                    <Lock className="w-4 h-4 text-slate-600 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-400 transition-colors" />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-600 hover:text-slate-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-wider text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {mode === 'login' ? 'Authorize Session' : mode === 'signup' ? 'Create Free Account' : 'Send Reset Link'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Google Login */}
            <div className="mt-8 space-y-6">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <span className="relative px-4 bg-[#0d141e] text-[10px] font-bold text-slate-600 uppercase tracking-widest">Or Continue with</span>
              </div>

              <button 
                type="button"
                onClick={handleSubmit}
                className="w-full bg-white/5 border border-white/10 text-white py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-[0.98]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google Identity
              </button>
            </div>

            {/* Toggle Mode */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <button 
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-cyan-500 font-bold hover:text-cyan-400 transition-colors underline underline-offset-4 decoration-cyan-500/30"
                >
                  {mode === 'login' ? 'Create one now' : 'Sign in here'}
                </button>
              </p>
            </div>
          </div>

          {/* Social Proof for Auth */}
          <div className="mt-12 grid grid-cols-2 gap-4">
             <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enterprise Security</div>
             </div>
             <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                <Zap className="w-5 h-5 text-amber-400" />
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Instant Activation</div>
             </div>
          </div>
        </motion.div>
      </div>

      <footer className="py-6 text-center text-slate-600 text-[10px] font-mono uppercase tracking-[0.2em] relative z-10">
        FURSAD AI Authentication Gateway v4.0
      </footer>
    </div>
  );
};
