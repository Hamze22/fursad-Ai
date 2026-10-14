import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Zap, 
  Sparkles, 
  CreditCard, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  History
} from 'lucide-react';
import { User, LanguageType } from '../../types.ts';

export const BillingPage: React.FC<{ user: User; language: LanguageType }> = ({ user, language }) => {
  const isSo = language === 'so';

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Test the waters of AI building.',
      features: ['1 Project', '10 AI Credits', 'Standard Preview', 'Community Support'],
      active: user.plan === 'free'
    },
    {
      name: 'First Access',
      price: '$25',
      period: 'once',
      description: 'Lifetime access to the course and builder.',
      features: ['5 Projects', '100 AI Credits', 'Full-Stack Course', 'Priority Support', 'Custom Domains'],
      active: user.plan === 'first-access',
      highlight: true
    },
    {
      name: 'Pro',
      price: '$10',
      period: 'month',
      description: 'The ultimate tool for creators.',
      features: ['Unlimited Projects', '500 AI Credits/mo', 'Advance AI Models', 'Team Collaboration', 'White-label Exports'],
      active: user.plan === 'pro'
    }
  ];

  const transactions = [
    { id: 'TX-901', date: '2026-10-01', amount: '$25.00', status: 'Success', method: '•••• 4242' },
    { id: 'TX-882', date: '2026-09-01', amount: '$10.00', status: 'Success', method: '•••• 4242' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">{isSo ? 'Lacag-bixinta' : 'Billing & Subscription'}</h1>
        <p className="text-slate-400">{isSo ? 'Maamul qorshahaaga iyo bixinta lacagaha.' : 'Manage your current plan, payment methods, and billing history.'}</p>
      </div>

      {/* Current Plan Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] group-hover:bg-cyan-500/10 transition-colors"></div>
            <div className="relative z-10 text-center md:text-left flex-1">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black border border-cyan-500/20 uppercase tracking-widest mb-4">
                  Current Status
               </div>
               <h2 className="text-2xl font-black text-white mb-2">You are on the <span className="text-cyan-400 uppercase">{user.plan}</span> Plan</h2>
               <p className="text-slate-500 text-sm max-w-sm">Your next billing cycle starts on November 1st, 2026. Enjoy unlimited AI potential.</p>
            </div>
            <div className="w-full md:w-auto space-y-3 shrink-0">
               <button className="w-full md:w-auto px-8 py-3 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-cyan-400 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95">Upgrade Plan</button>
               <button className="w-full md:w-auto px-8 py-3 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:text-white transition-all block text-center">Cancel Plan</button>
            </div>
         </div>

         <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4">
               <Zap className="w-7 h-7 fill-current" />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available Credits</p>
            <h3 className="text-3xl font-black text-white mt-1">{user.credits}</h3>
            <p className="text-[10px] text-slate-700 font-mono mt-2">RESETS IN 24 DAYS</p>
         </div>
      </div>

      {/* Pricing Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`bg-slate-900/50 border rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden transition-all ${
              plan.highlight ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/10' : 'border-white/5'
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-0 p-6">
                 <div className="bg-cyan-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">Recommended</div>
              </div>
            )}
            
            <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
               <span className="text-4xl font-black text-white">{plan.price}</span>
               {plan.period && <span className="text-xs text-slate-500 font-bold uppercase">/ {plan.period}</span>}
            </div>
            <p className="text-xs text-slate-400 mb-8 leading-relaxed">{plan.description}</p>
            
            <div className="space-y-4 mb-10 flex-1">
               {plan.features.map((feature) => (
                 <div key={feature} className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                       <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-xs text-slate-300 font-medium">{feature}</span>
                 </div>
               ))}
            </div>
            
            <button 
              disabled={plan.active}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                plan.active 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default'
                : plan.highlight
                ? 'bg-cyan-500 text-white hover:bg-cyan-400 shadow-lg shadow-cyan-500/20 active:scale-95'
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95'
              }`}
            >
              {plan.active ? 'Current Plan' : `Get ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      {/* Billing History */}
      <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden">
         <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-3">
               <History className="w-5 h-5 text-slate-500" />
               Transaction History
            </h3>
            <button className="text-[10px] font-bold text-cyan-500 hover:text-white transition-colors uppercase tracking-widest">Download All</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
               <thead>
                  <tr className="bg-white/5 text-slate-500 font-bold uppercase tracking-widest border-b border-white/10">
                     <th className="px-8 py-4">Transaction ID</th>
                     <th className="px-8 py-4">Date</th>
                     <th className="px-8 py-4">Amount</th>
                     <th className="px-8 py-4">Method</th>
                     <th className="px-8 py-4">Status</th>
                  </tr>
               </thead>
               <tbody className="text-slate-300">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                       <td className="px-8 py-5 font-bold text-white">{tx.id}</td>
                       <td className="px-8 py-5 text-slate-500">{tx.date}</td>
                       <td className="px-8 py-5 font-bold">{tx.amount}</td>
                       <td className="px-8 py-5 text-slate-500 flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          {tx.method}
                       </td>
                       <td className="px-8 py-5">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-black text-[9px]">
                             {tx.status}
                          </span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
