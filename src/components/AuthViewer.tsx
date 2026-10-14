import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Key, Lock, Users, ShieldAlert, Check, Fingerprint } from 'lucide-react';
import { LanguageType } from '../types.ts';

interface AuthViewerProps {
  language: LanguageType;
}

export const AuthViewer: React.FC<AuthViewerProps> = ({ language }) => {
  const [activeRole, setActiveRole] = useState<'admin' | 'customer' | 'guest'>('admin');
  const isSo = language === 'so';

  return (
    <div className="flex-1 flex flex-col bg-[#090913] h-full overflow-hidden">
      <div className="h-10 border-b border-white/5 px-4 flex items-center justify-between bg-[#14181B]/50 shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-mono text-white">Auth Inspector (RBAC)</span>
        </div>
        <div className="flex items-center bg-[#090913] border border-white/10 rounded-lg p-0.5">
          {['admin', 'customer', 'guest'].map(role => (
            <button
              key={role}
              onClick={() => setActiveRole(role as any)}
              className={`px-3 py-1 rounded-md text-[10px] font-bold capitalize transition ${
                activeRole === role ? 'bg-ff-blue text-white shadow-sm' : 'text-slate-500 hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity */}
          <div className="p-5 bg-[#14181B] border border-white/10 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Fingerprint className="w-3 h-3" /> Identity Profile
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500 font-medium">Username</span>
                <span className="text-white font-bold">{activeRole === 'admin' ? 'Admin Root' : 'Guest User'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500 font-medium">Role Claim</span>
                <span className="text-ff-blue font-black uppercase">{activeRole}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500 font-medium">Hashing</span>
                <span className="text-ff-green font-mono italic">argon2id</span>
              </div>
            </div>
          </div>

          {/* JWT */}
          <div className="p-5 bg-[#14181B] border border-white/10 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Key className="w-3 h-3" /> JWT Bearer
            </h3>
            <div className="bg-[#0d0d0d] p-3 rounded-xl border border-white/5 font-mono text-[10px] text-amber-300 break-all leading-relaxed">
              eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="p-5 bg-[#14181B] border border-white/10 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Lock className="w-3 h-3" /> Access Control Matrix
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: 'Write Production Data', allowed: activeRole === 'admin' },
              { label: 'Access System Logs', allowed: activeRole === 'admin' },
              { label: 'View Analytics', allowed: activeRole === 'admin' },
              { label: 'Place Orders', allowed: activeRole !== 'guest' },
              { label: 'Update Profile', allowed: activeRole !== 'guest' },
              { label: 'Browse Public API', allowed: true },
            ].map((p, idx) => (
              <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                p.allowed ? 'bg-ff-green/5 border-ff-green/20 text-white' : 'bg-rose-500/5 border-white/5 text-slate-500'
              }`}>
                <span className="font-medium">{p.label}</span>
                {p.allowed ? <Check className="w-3.5 h-3.5 text-ff-green" /> : <ShieldAlert className="w-3.5 h-3.5 text-rose-500/40" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
