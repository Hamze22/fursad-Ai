import React, { useState } from 'react';
import {
  X,
  Check,
  Flame,
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { LanguageType } from '../types.ts';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageType;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedPay, setSelectedPay] = useState<'evc' | 'zaad' | 'card'>('evc');
  const isSo = language === 'so';

  if (!isOpen) return null;

  const features = isSo
    ? [
        'AI Software Engineer aan xadidnayn (Unlimited Builds)',
        'Fullstack Code Generation (Frontend, Backend, Database)',
        'Somali Mobile Money Payments API (Zaad, Sahal, EVC Plus)',
        'Live Preview Sandbox & Responsive Device Viewports',
        'Relational Database PostgreSQL Schemas & Seed Data',
        'Automated Test Suite & Self-Healing Debugger',
        'Export Source Code (HTML, CSS, JS, SQL, TS)',
        'Direct Gemini 3.1 Flash-Lite Engine',
      ]
    : [
        'Unlimited AI Software Builds & Prompts',
        'Fullstack Code Generation (Frontend, Backend, Database)',
        'Somali Mobile Money Payments (Zaad, Sahal, EVC Plus)',
        'Interactive Live Sandbox Preview on Desktop & Mobile',
        'PostgreSQL Relational Schemas & Seed Records',
        'Automated Unit Tests & Self-Healing AI Debugger',
        'One-Click Source Code Export (Full Codebase)',
        'Gemini 3.1 Flash-Lite Integration',
      ];

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setTimeout(() => {
      onClose();
      setIsSubscribed(false);
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#14181B] border border-white/10 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_40px_100px_-30px_rgba(75,57,239,0.4)] overflow-hidden text-white">
        
        {/* Glow backdrop */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-ff-blue/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold bg-ff-blue/10 text-ff-blue border border-ff-blue/20 mb-4 uppercase tracking-widest">
            <Flame className="w-3.5 h-3.5 fill-ff-blue" />
            <span>AI Builder Pro</span>
          </div>

          <h3 className="text-3xl font-black text-white tracking-tight leading-tight">
            {isSo ? 'Dhis software-kaaga maanta' : 'Scale Your Vision with Pro'}
          </h3>
        </div>

        {/* Price Tag */}
        <div className="p-8 bg-[#090913] border border-white/5 rounded-3xl flex flex-col items-center justify-center gap-2 mb-8 shadow-inner">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white tracking-tighter">$10</span>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">/ month</span>
          </div>
          <p className="text-[10px] font-bold text-ff-green uppercase tracking-widest">Best value for founders</p>
        </div>

        {/* Feature List */}
        <div className="space-y-4 mb-10 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
              <div className="w-5 h-5 rounded-full bg-ff-green/10 text-ff-green flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[4]" />
              </div>
              <span className="leading-snug">{feat}</span>
            </div>
          ))}
        </div>

        {/* Payment selector */}
        <div className="space-y-4 mb-8">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center">
            Secure Payment Methods
          </label>
          <div className="grid grid-cols-3 gap-3 text-xs">
            {[
              { id: 'evc', label: 'EVC Plus', icon: Smartphone },
              { id: 'zaad', label: 'Zaad', icon: Smartphone },
              { id: 'card', label: 'Card', icon: CreditCard },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPay(method.id as any)}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                  selectedPay === method.id
                    ? 'bg-ff-blue/10 border-ff-blue text-ff-blue shadow-lg'
                    : 'bg-[#090913] border-white/5 text-slate-500 hover:border-white/10'
                }`}
              >
                <method.icon className="w-5 h-5" />
                <span className="font-bold">{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleSubscribe}
          disabled={isSubscribed}
          className="w-full py-5 bg-ff-blue hover:bg-blue-600 text-white font-black rounded-2xl text-lg shadow-xl shadow-ff-blue/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isSubscribed ? (
            <>
              <CheckCircle2 className="w-6 h-6 text-white" />
              <span>{isSo ? 'Waad Is Diiwaangelisay!' : 'Successfully Subscribed!'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 fill-white" />
              <span>{isSo ? 'Noqo Pro Hadda' : 'Upgrade to Pro'}</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};
