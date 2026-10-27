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
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (mode === 'forgot') {
      setNotice('Password reset by email is not available yet. Please contact support to reset your password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(mode === 'signup' ? '/api/auth/register' : '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.user) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }
      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        autoComplete="name"
                        maxLength={80}

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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"

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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      minLength={mode === 'signup' ? 8 : undefined}
                      maxLength={128}

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

              {error && (
                <div role="alert" className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">{error}</div>
              )}
              {notice && (
                <div role="status" className="text-sm text-cyan-200 bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-4 py-3">{notice}</div>
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
