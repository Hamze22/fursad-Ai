import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  Search, 
  Filter, 
  ArrowRight, 
  Layout, 
  ShoppingBag, 
  User, 
  Briefcase, 
  Smartphone,
  Globe,
  Database,
  ShieldCheck
} from 'lucide-react';
import { LanguageType } from '../../types.ts';

interface Template {
  id: string;
  name: string;
  nameSo: string;
  category: string;
  categorySo: string;
  description: string;
  descriptionSo: string;
  icon: any;
  color: string;
  features: string[];
}

export const TemplatesPage: React.FC<{ language: LanguageType; onUseTemplate: (t: Template) => void }> = ({ language, onUseTemplate }) => {
  const isSo = language === 'so';

  const templates: Template[] = [
    {
      id: 'ecommerce',
      name: 'Modern E-Commerce',
      nameSo: 'Bakhaar Ganacsi',
      category: 'SaaS',
      categorySo: 'SaaS',
      description: 'Full-stack store with product catalog, cart, and checkout.',
      descriptionSo: 'Dukaan dhamaystiran oo leh alaabta, gaariga dukaanka, iyo bixinta lacagta.',
      icon: ShoppingBag,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      features: ['Cart System', 'Admin Panel', 'Stripe Ready']
    },
    {
      id: 'portfolio',
      name: 'Developer Portfolio',
      nameSo: 'Portfolio-ga Developer-ka',
      category: 'Personal',
      categorySo: 'Shaqsi',
      description: 'Elegant personal website for developers and creatives.',
      descriptionSo: 'Website shaqsi ah oo qurux badan looguna talagalay horumariyayaasha.',
      icon: User,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      features: ['Project Gallery', 'Blog', 'Contact Form']
    },
    {
      id: 'dashboard',
      name: 'Analytics Dashboard',
      nameSo: 'Dashboard-ka Analytics-ka',
      category: 'Enterprise',
      categorySo: 'Ganacsi Wayn',
      description: 'Data-rich dashboard with charts and real-time metrics.',
      descriptionSo: 'Dashboard ay ka buuxaan xog iyo shaxano toos ah.',
      icon: Layout,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      features: ['Charts', 'Data Tables', 'User Management']
    },
    {
      id: 'booking',
      name: 'Booking System',
      nameSo: 'Habka Boos-qabsashada',
      category: 'Service',
      categorySo: 'Adeeg',
      description: 'Calendar-based booking system for appointments or rentals.',
      descriptionSo: 'Habka ballamaha loogu qabsado jadwalka (calendar).',
      icon: Briefcase,
      color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
      features: ['Calendar UI', 'Email Alerts', 'Database Sync']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white">{isSo ? 'Maktabadda Templates-ka' : 'Template Library'}</h1>
          <p className="text-slate-400">{isSo ? 'Ka bilow mashruucaaga template-yada diyaarka ah.' : 'Kickstart your next big idea with our production-ready templates.'}</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative group max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="text" 
                placeholder={isSo ? 'Raadi...' : 'Search templates...'} 
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/5 rounded-xl text-sm outline-none focus:border-cyan-500/30 transition-all placeholder:text-slate-600"
              />
           </div>
           <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
              <Filter className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {['All', 'SaaS', 'Personal', 'Enterprise', 'Service', 'Landing Page'].map((cat) => (
          <button key={cat} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/10 transition-all">
            {cat}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        {templates.map((template) => (
          <motion.div 
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-8 flex flex-col group hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-8">
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${template.color}`}>
                  <template.icon className="w-7 h-7" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 text-slate-500 border border-white/5">
                 {isSo ? template.categorySo : template.category}
               </span>
            </div>
            
            <h3 className="text-xl font-black text-white mb-2 group-hover:text-cyan-400 transition-colors">
              {isSo ? template.nameSo : template.name}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-8 flex-1">
              {isSo ? template.descriptionSo : template.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {template.features.map((f) => (
                <span key={f} className="text-[9px] font-mono font-bold text-slate-600 bg-white/[0.02] px-2 py-0.5 rounded-md border border-white/5">
                  {f}
                </span>
              ))}
            </div>
            
            <button 
              onClick={() => onUseTemplate(template)}
              className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-cyan-400 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95 group/btn"
            >
              Use Template
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
        
        {/* Coming Soon Card */}
        <div className="bg-slate-900/10 border border-dashed border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center">
           <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-700 mb-4">
              <Layers className="w-7 h-7" />
           </div>
           <h3 className="text-lg font-bold text-slate-600 mb-1">More Templates Incoming</h3>
           <p className="text-xs text-slate-700 font-mono uppercase tracking-widest">Stay tuned for Phase 5</p>
        </div>
      </div>
    </div>
  );
};
