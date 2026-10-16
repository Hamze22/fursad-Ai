import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Table, 
  Layers, 
  Key, 
  ShieldCheck, 
  Code2, 
  Plus, 
  Search, 
  Play, 
  CheckCircle2, 
  Copy, 
  Check, 
  Users, 
  FolderTree, 
  Terminal, 
  Download, 
  Trash2, 
  Eye, 
  RefreshCw,
  Sparkles,
  ExternalLink,
  Lock,
  Flame,
  Zap,
  ArrowRight
} from 'lucide-react';
import { LanguageType } from '../../types.ts';

interface DatabaseManagerProps {
  files?: Record<string, string>;
  language?: LanguageType;
  theme?: 'light' | 'dark';
  onClose?: () => void;
}

export const DatabaseManager: React.FC<DatabaseManagerProps> = ({
  files = {},
  language = 'so',
  theme = 'dark',
  onClose
}) => {
  const [activeEngine, setActiveEngine] = useState<'firebase' | 'supabase'>('firebase');
  const [firebaseTab, setFirebaseTab] = useState<'firestore' | 'auth' | 'rules' | 'config'>('firestore');
  const [supabaseTab, setSupabaseTab] = useState<'tables' | 'sql' | 'rls' | 'api'>('tables');

  // ==========================================
  // FIREBASE DATA STATE (Firestore & Auth)
  // ==========================================
  const [selectedCollection, setSelectedCollection] = useState<string>('books');
  const [copiedKey, setCopiedKey] = useState(false);
  const [firestoreFilter, setFirestoreFilter] = useState('');
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDocData, setNewDocData] = useState({
    title: '',
    author: '',
    category: 'Somali Classics',
    price: 19.99,
    stock: 25
  });

  const [firestoreData, setFirestoreData] = useState<Record<string, any[]>>({
    books: [
      {
        id: 'book_hadraawi_01',
        title: 'Aasaaska Suugaanta',
        author: 'Maxamed I. Hadraawi',
        category: 'Somali Classics',
        price: 18.99,
        stock: 45,
        rating: 5.0,
        publishedYear: 1978,
        inStock: true
      },
      {
        id: 'book_cawl_02',
        title: 'Aqoondarro waa u nacab jacayl',
        author: 'Faarax M.J. Cawl',
        category: 'Somali Classics',
        price: 14.50,
        stock: 30,
        rating: 4.9,
        publishedYear: 1974,
        inStock: true
      },
      {
        id: 'book_vibecoding_03',
        title: 'Vibe Coding & Full-Stack AI',
        author: 'FURSAD AI Lab',
        category: 'Tech & AI',
        price: 29.99,
        stock: 120,
        rating: 5.0,
        publishedYear: 2026,
        inStock: true
      },
      {
        id: 'book_qaamuus_04',
        title: 'Qaamuuska Af-Soomaaliga',
        author: 'Yaasiin C. Keenadiid',
        category: 'Reference & Dictionary',
        price: 24.00,
        stock: 18,
        rating: 4.8,
        publishedYear: 1976,
        inStock: true
      }
    ],
    orders: [
      {
        id: 'ord_98214',
        customer: 'somfxstore@gmail.com',
        total: 48.98,
        itemsCount: 2,
        status: 'completed',
        paymentMethod: 'Zaad / Sahal / Stripe',
        createdAt: '2026-10-14 14:20'
      },
      {
        id: 'ord_98215',
        customer: 'guled.hassan@example.com',
        total: 29.99,
        itemsCount: 1,
        status: 'processing',
        paymentMethod: 'Credit Card',
        createdAt: '2026-10-15 08:12'
      }
    ],
    users: [
      {
        id: 'usr_ahmed_1',
        email: 'somfxstore@gmail.com',
        displayName: 'Ahmed Hassan',
        role: 'admin',
        createdAt: '2026-10-01'
      },
      {
        id: 'usr_amina_2',
        email: 'amina.booklover@gmail.com',
        displayName: 'Amina Cali',
        role: 'customer',
        createdAt: '2026-10-05'
      }
    ],
    categories: [
      { id: 'cat_1', name: 'Somali Classics', count: 18 },
      { id: 'cat_2', name: 'Tech & AI Coding', count: 12 },
      { id: 'cat_3', name: 'History & Culture', count: 9 },
      { id: 'cat_4', name: 'Poetry & Suugaan', count: 24 }
    ]
  });

  const [firebaseUsers, setFirebaseUsers] = useState([
    {
      uid: 'fb_usr_991823',
      email: 'somfxstore@gmail.com',
      provider: 'google.com',
      created: 'Oct 01, 2026',
      lastLogin: 'Oct 15, 2026 (Active)',
      status: 'Verified'
    },
    {
      uid: 'fb_usr_441290',
      email: 'student@fursad.ai',
      provider: 'password',
      created: 'Oct 08, 2026',
      lastLogin: 'Oct 14, 2026',
      status: 'Verified'
    },
    {
      uid: 'fb_usr_882012',
      email: 'hassan.reader@gmail.com',
      provider: 'password',
      created: 'Oct 12, 2026',
      lastLogin: 'Oct 13, 2026',
      status: 'Verified'
    }
  ]);

  const [rulesTestResult, setRulesTestResult] = useState<string | null>(null);

  // ==========================================
  // SUPABASE DATA STATE (PostgreSQL & SQL)
  // ==========================================
  const [selectedTable, setSelectedTable] = useState<string>('books');
  const [sqlQuery, setSqlQuery] = useState<string>(
    'SELECT id, title, author, category, price, stock\nFROM books\nWHERE stock > 10\nORDER BY price DESC;'
  );
  const [isExecutingSql, setIsExecutingSql] = useState(false);
  const [sqlResults, setSqlResults] = useState<{
    columns: string[];
    rows: any[];
    executionTime: string;
    rowCount: number;
  }>({
    columns: ['id', 'title', 'author', 'category', 'price', 'stock'],
    rows: [
      { id: 3, title: 'Vibe Coding & Full-Stack AI', author: 'FURSAD AI Lab', category: 'Tech & AI', price: '$29.99', stock: 120 },
      { id: 4, title: 'Qaamuuska Af-Soomaaliga', author: 'Yaasiin C. Keenadiid', category: 'Reference', price: '$24.00', stock: 18 },
      { id: 1, title: 'Aasaaska Suugaanta', author: 'Maxamed I. Hadraawi', category: 'Somali Classics', price: '$18.99', stock: 45 },
      { id: 2, title: 'Aqoondarro waa u nacab jacayl', author: 'Faarax M.J. Cawl', category: 'Somali Classics', price: '$14.50', stock: 30 }
    ],
    executionTime: '12ms',
    rowCount: 4
  });

  const supabaseTables = [
    { name: 'books', rows: 4, description: 'Bookstore inventory & pricing' },
    { name: 'orders', rows: 2, description: 'Customer checkouts & receipts' },
    { name: 'profiles', rows: 2, description: 'User metadata and preferences' },
    { name: 'categories', rows: 4, description: 'Book genre taxonomy' }
  ];

  // Handlers for Firestore
  const handleAddDocument = () => {
    if (!newDocData.title) return;
    const newDoc = {
      id: `book_${Date.now().toString(36)}`,
      title: newDocData.title,
      author: newDocData.author || 'Anonymous',
      category: newDocData.category,
      price: Number(newDocData.price) || 19.99,
      stock: Number(newDocData.stock) || 10,
      rating: 5.0,
      publishedYear: 2026,
      inStock: true
    };

    setFirestoreData(prev => ({
      ...prev,
      books: [newDoc, ...(prev.books || [])]
    }));

    setNewDocData({ title: '', author: '', category: 'Somali Classics', price: 19.99, stock: 25 });
    setShowAddDocModal(false);
  };

  const handleDeleteFirestoreDoc = (col: string, id: string) => {
    setFirestoreData(prev => ({
      ...prev,
      [col]: (prev[col] || []).filter(item => item.id !== id)
    }));
  };

  const handleTestRules = () => {
    setRulesTestResult('Validating request against firestore.rules...');
    setTimeout(() => {
      setRulesTestResult('✅ Simulation Passed: Authenticated user read/write permitted under match /databases/{database}/documents rules.');
    }, 600);
  };

  // Handler for SQL execution
  const handleRunSql = () => {
    setIsExecutingSql(true);
    setTimeout(() => {
      setIsExecutingSql(false);
      const queryLower = sqlQuery.toLowerCase();
      if (queryLower.includes('from orders')) {
        setSqlResults({
          columns: ['id', 'customer', 'total', 'status', 'createdAt'],
          rows: [
            { id: 'ord_98214', customer: 'somfxstore@gmail.com', total: '$48.98', status: 'completed', createdAt: '2026-10-14' },
            { id: 'ord_98215', customer: 'guled.hassan@example.com', total: '$29.99', status: 'processing', createdAt: '2026-10-15' }
          ],
          executionTime: `${Math.floor(Math.random() * 8 + 6)}ms`,
          rowCount: 2
        });
      } else {
        setSqlResults({
          columns: ['id', 'title', 'author', 'category', 'price', 'stock'],
          rows: [
            { id: 3, title: 'Vibe Coding & Full-Stack AI', author: 'FURSAD AI Lab', category: 'Tech & AI', price: '$29.99', stock: 120 },
            { id: 4, title: 'Qaamuuska Af-Soomaaliga', author: 'Yaasiin C. Keenadiid', category: 'Reference', price: '$24.00', stock: 18 },
            { id: 1, title: 'Aasaaska Suugaanta', author: 'Maxamed I. Hadraawi', category: 'Somali Classics', price: '$18.99', stock: 45 },
            { id: 2, title: 'Aqoondarro waa u nacab jacayl', author: 'Faarax M.J. Cawl', category: 'Somali Classics', price: '$14.50', stock: 30 }
          ],
          executionTime: `${Math.floor(Math.random() * 9 + 8)}ms`,
          rowCount: 4
        });
      }
    }, 450);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden rounded-2xl border shadow-2xl transition-colors ${
      theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#090d16] border-slate-800 text-slate-100'
    }`}>
      {/* Top Header with Engine Switcher (Firebase vs Supabase) */}
      <div className={`px-4 sm:px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
        theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#0c1220] border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-white shadow-md">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight">Databases & Cloud Storage</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Connected
              </span>
            </div>
            <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
              Manage Firebase Firestore & Supabase PostgreSQL for your application
            </p>
          </div>
        </div>

        {/* Engine Switcher Badges */}
        <div className={`flex items-center rounded-xl p-1 border ${
          theme === 'light' ? 'bg-slate-200/80 border-slate-300' : 'bg-slate-900 border-slate-700/80'
        }`}>
          <button
            onClick={() => setActiveEngine('firebase')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeEngine === 'firebase'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                : (theme === 'light' ? 'text-slate-700 hover:text-black' : 'text-slate-400 hover:text-white')
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-950 fill-amber-950" />
            <span>Firebase</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/40 text-amber-950 font-mono">Firestore</span>
          </button>
          
          <button
            onClick={() => setActiveEngine('supabase')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeEngine === 'supabase'
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-black'
                : (theme === 'light' ? 'text-slate-700 hover:text-black' : 'text-slate-400 hover:text-white')
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-950 fill-emerald-950" />
            <span>Supabase</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-400/40 text-emerald-950 font-mono">Postgres</span>
          </button>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-lg text-xs font-semibold ${
              theme === 'light' ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            Close
          </button>
        )}
      </div>

      {/* Sub-navigation depending on active engine */}
      <div className={`px-4 sm:px-6 pt-2 flex items-center justify-between border-b shrink-0 ${
        theme === 'light' ? 'bg-slate-100/60 border-slate-200' : 'bg-[#0f172a]/60 border-slate-800'
      }`}>
        {activeEngine === 'firebase' ? (
          <div className="flex gap-4">
            {[
              { id: 'firestore', label: 'Firestore Collections', icon: Layers },
              { id: 'auth', label: 'Authentication', icon: Users },
              { id: 'rules', label: 'Security Rules', icon: ShieldCheck },
              { id: 'config', label: 'SDK Config', icon: Code2 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFirebaseTab(tab.id as any)}
                className={`pb-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                  firebaseTab === tab.id
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex gap-4">
            {[
              { id: 'tables', label: 'Tables & Records', icon: Table },
              { id: 'sql', label: 'SQL Query Console', icon: Terminal },
              { id: 'rls', label: 'Row Level Security (RLS)', icon: ShieldCheck },
              { id: 'api', label: 'API Keys & URL', icon: Key },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSupabaseTab(tab.id as any)}
                className={`pb-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                  supabaseTab === tab.id
                    ? 'border-emerald-500 text-emerald-500'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="hidden sm:flex items-center gap-2 pb-2 text-[11px] font-mono text-slate-400">
          <span>Project:</span>
          <span className="font-bold text-cyan-400">fursad-prod-bookhouse</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* ========================================================= */}
        {/* ENGINE 1: FIREBASE                                       */}
        {/* ========================================================= */}
        {activeEngine === 'firebase' && (
          <div className="flex-1 flex overflow-hidden">
            {/* FIRESTORE COLLECTIONS TAB */}
            {firebaseTab === 'firestore' && (
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Collections List Sidebar */}
                <div className={`w-full md:w-56 border-r flex flex-col shrink-0 ${
                  theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#0b101c] border-slate-800'
                }`}>
                  <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
                      <FolderTree className="w-3.5 h-3.5 text-amber-500" />
                      Collections
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                      {Object.keys(firestoreData).length}
                    </span>
                  </div>
                  <div className="p-2 space-y-1 overflow-y-auto flex-1">
                    {Object.keys(firestoreData).map(col => (
                      <button
                        key={col}
                        onClick={() => setSelectedCollection(col)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-between transition-all ${
                          selectedCollection === col
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : (theme === 'light' ? 'text-slate-700 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-800 hover:text-white')
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <Layers className="w-3.5 h-3.5 opacity-70" />
                          <span>{col}</span>
                        </span>
                        <span className="text-[10px] font-mono opacity-60">
                          {firestoreData[col]?.length || 0}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collection Documents View */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
                    theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0f172a]/40 border-slate-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-500" />
                      <span className="font-mono text-xs font-bold uppercase">
                        Collection: <span className="text-amber-400">{selectedCollection}</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                        {firestoreData[selectedCollection]?.length || 0} docs
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedCollection === 'books' && (
                        <button
                          onClick={() => setShowAddDocModal(true)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Document</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Documents Grid / List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {(firestoreData[selectedCollection] || []).map((doc, idx) => (
                      <div
                        key={doc.id || idx}
                        className={`p-4 rounded-xl border transition-all ${
                          theme === 'light'
                            ? 'bg-slate-50 border-slate-200 hover:border-amber-400'
                            : 'bg-[#0b101c] border-slate-800/80 hover:border-amber-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              doc: {doc.id}
                            </span>
                            {doc.category && (
                              <span className="text-[10px] font-semibold text-slate-400">
                                {doc.category}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteFirestoreDoc(selectedCollection, doc.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* JSON Data Viewer */}
                        <div className={`p-3 rounded-lg font-mono text-xs overflow-x-auto ${
                          theme === 'light' ? 'bg-white border border-slate-200 text-slate-800' : 'bg-black/50 border border-white/5 text-amber-100/90'
                        }`}>
                          <pre className="whitespace-pre-wrap">{JSON.stringify(doc, null, 2)}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* FIREBASE AUTH TAB */}
            {firebaseTab === 'auth' && (
              <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-500" />
                      <span>Firebase Authentication Users</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Managed users registered through Google Auth & Email/Password
                    </p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    Auth Status: Active
                  </span>
                </div>

                <div className={`rounded-xl border overflow-hidden shadow-sm ${
                  theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0b101c] border-slate-800'
                }`}>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={`border-b font-mono uppercase text-[10px] ${
                        theme === 'light' ? 'bg-slate-100 text-slate-700' : 'bg-slate-900 text-slate-400'
                      }`}>
                        <th className="p-3">UID</th>
                        <th className="p-3">Email Address</th>
                        <th className="p-3">Provider</th>
                        <th className="p-3">Created</th>
                        <th className="p-3">Last Sign-in</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 font-mono">
                      {firebaseUsers.map(u => (
                        <tr key={u.uid} className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}>
                          <td className="p-3 font-bold text-amber-400">{u.uid}</td>
                          <td className="p-3 font-semibold">{u.email}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px]">
                              {u.provider}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">{u.created}</td>
                          <td className="p-3 text-slate-300">{u.lastLogin}</td>
                          <td className="p-3">
                            <span className="text-emerald-400 flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3 h-3" /> {u.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FIREBASE RULES TAB */}
            {firebaseTab === 'rules' && (
              <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-500" />
                      <span>firestore.rules (Security Rules)</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Rule definitions protecting books, orders, and customer accounts
                    </p>
                  </div>
                  <button
                    onClick={handleTestRules}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Security Rule Simulator</span>
                  </button>
                </div>

                {rulesTestResult && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                    {rulesTestResult}
                  </div>
                )}

                <div className={`p-4 rounded-xl border font-mono text-xs leading-relaxed overflow-x-auto ${
                  theme === 'light' ? 'bg-slate-900 text-emerald-300' : 'bg-black/70 border-slate-800 text-amber-100/90'
                }`}>
                  <pre>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Books collection: Public can read, authenticated admin can write
    match /books/{bookId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Orders: Authenticated user can create, only owner or admin can read
    match /orders/{orderId} {
      allow create: if true;
      allow read, update: if request.auth != null && 
        (request.auth.token.email == resource.data.customer || request.auth.token.role == 'admin');
    }

    // Default deny all other paths
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}`}</pre>
                </div>
              </div>
            )}

            {/* FIREBASE CONFIG TAB */}
            {firebaseTab === 'config' && (
              <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-amber-500" />
                      <span>Firebase SDK Initialization</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Include this in your app to connect directly to Firebase Firestore
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(`import { initializeApp } from "firebase/app";\nimport { getFirestore } from "firebase/firestore";\nimport { getAuth } from "firebase/auth";\n\nconst firebaseConfig = {\n  apiKey: "AIzaSyD-FURSAD-BOOKSTORE-API-KEY",\n  authDomain: "fursad-bookhouse.firebaseapp.com",\n  projectId: "fursad-bookhouse-prod",\n  storageBucket: "fursad-bookhouse.appspot.com",\n  messagingSenderId: "221043921390",\n  appId: "1:221043921390:web:8ade3c45e69c4fc2"\n};\n\nexport const app = initializeApp(firebaseConfig);\nexport const db = getFirestore(app);\nexport const auth = getAuth(app);`)}
                    className="px-3 py-1.5 rounded-xl border bg-white/5 hover:bg-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                <div className={`p-4 rounded-xl border font-mono text-xs leading-relaxed overflow-x-auto ${
                  theme === 'light' ? 'bg-slate-900 text-cyan-300' : 'bg-black/70 border-slate-800 text-cyan-200'
                }`}>
                  <pre>{`import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-FURSAD-BOOKSTORE-API-KEY",
  authDomain: "fursad-bookhouse.firebaseapp.com",
  projectId: "fursad-bookhouse-prod",
  storageBucket: "fursad-bookhouse.appspot.com",
  messagingSenderId: "221043921390",
  appId: "1:221043921390:web:8ade3c45e69c4fc2"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);`}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* ENGINE 2: SUPABASE (PostgreSQL & SQL Editor)             */}
        {/* ========================================================= */}
        {activeEngine === 'supabase' && (
          <div className="flex-1 flex overflow-hidden">
            {/* SUPABASE TABLES TAB */}
            {supabaseTab === 'tables' && (
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Tables Sidebar */}
                <div className={`w-full md:w-56 border-r flex flex-col shrink-0 ${
                  theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#0b101c] border-slate-800'
                }`}>
                  <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
                      <Table className="w-3.5 h-3.5 text-emerald-500" />
                      PostgreSQL Tables
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {supabaseTables.length}
                    </span>
                  </div>
                  <div className="p-2 space-y-1 overflow-y-auto flex-1">
                    {supabaseTables.map(tbl => (
                      <button
                        key={tbl.name}
                        onClick={() => setSelectedTable(tbl.name)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-between transition-all ${
                          selectedTable === tbl.name
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : (theme === 'light' ? 'text-slate-700 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-800 hover:text-white')
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <Table className="w-3.5 h-3.5 opacity-70" />
                          <span>public.{tbl.name}</span>
                        </span>
                        <span className="text-[10px] font-mono opacity-60">
                          {tbl.rows}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table Data Grid */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
                    theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0f172a]/40 border-slate-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Table className="w-4 h-4 text-emerald-500" />
                      <span className="font-mono text-xs font-bold uppercase">
                        Table: <span className="text-emerald-400">public.{selectedTable}</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        RLS Active
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSupabaseTab('sql')}
                        className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all font-mono"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Query in SQL Editor</span>
                      </button>
                    </div>
                  </div>

                  {/* Table Grid Component */}
                  <div className="flex-1 overflow-auto p-4">
                    <div className={`rounded-xl border overflow-hidden shadow-sm ${
                      theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0b101c] border-slate-800'
                    }`}>
                      <table className="w-full text-left text-xs font-mono">
                        <thead>
                          <tr className={`border-b uppercase text-[10px] ${
                            theme === 'light' ? 'bg-slate-100 text-slate-700' : 'bg-slate-900 text-slate-400'
                          }`}>
                            <th className="p-3">id (int8)</th>
                            <th className="p-3">title (text)</th>
                            <th className="p-3">author (text)</th>
                            <th className="p-3">category (text)</th>
                            <th className="p-3">price (numeric)</th>
                            <th className="p-3">stock (int4)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                          {sqlResults.rows.map((row, i) => (
                            <tr key={i} className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}>
                              <td className="p-3 font-bold text-emerald-400">{row.id}</td>
                              <td className="p-3 font-semibold text-slate-200">{row.title}</td>
                              <td className="p-3 text-slate-400">{row.author}</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                                  {row.category}
                                </span>
                              </td>
                              <td className="p-3 font-bold text-slate-300">{row.price}</td>
                              <td className="p-3 font-mono text-slate-400">{row.stock}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUPABASE SQL QUERY CONSOLE */}
            {supabaseTab === 'sql' && (
              <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-500" />
                      <span>Supabase SQL Query Console</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Execute PostgreSQL queries directly against your cloud database
                    </p>
                  </div>

                  <button
                    onClick={handleRunSql}
                    disabled={isExecutingSql}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    {isExecutingSql ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Running Query...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run SQL (Ctrl + Enter)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Pre-made query pills */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-[11px] font-bold text-slate-400 py-1">Quick SQL:</span>
                  {[
                    { label: 'Books with Stock > 10', query: 'SELECT id, title, author, category, price, stock\nFROM books\nWHERE stock > 10\nORDER BY price DESC;' },
                    { label: 'Recent Orders', query: 'SELECT id, customer, total, status, createdAt\nFROM orders\nORDER BY createdAt DESC;' },
                    { label: 'Count by Category', query: 'SELECT category, COUNT(*) as count\nFROM books\nGROUP BY category;' },
                  ].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => setSqlQuery(preset.query)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-400 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* SQL Editor Area */}
                <div className="relative">
                  <textarea
                    rows={4}
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    className={`w-full p-4 rounded-xl border text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                      theme === 'light'
                        ? 'bg-slate-900 text-emerald-300 border-slate-700'
                        : 'bg-[#060a12] border-slate-800 text-emerald-300'
                    }`}
                  />
                </div>

                {/* Query Results */}
                <div className="flex-1 flex flex-col overflow-hidden space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="font-bold text-slate-300">Results: {sqlResults.rowCount} rows</span>
                    <span className="text-emerald-400">Execution time: {sqlResults.executionTime}</span>
                  </div>

                  <div className={`flex-1 overflow-auto rounded-xl border shadow-sm ${
                    theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0b101c] border-slate-800'
                  }`}>
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className={`border-b uppercase text-[10px] ${
                          theme === 'light' ? 'bg-slate-100 text-slate-700' : 'bg-slate-900 text-slate-400'
                        }`}>
                          {sqlResults.columns.map(col => (
                            <th key={col} className="p-3">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {sqlResults.rows.map((row, i) => (
                          <tr key={i} className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}>
                            {sqlResults.columns.map(col => (
                              <td key={col} className="p-3">{String(row[col] ?? '')}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUPABASE RLS TAB */}
            {supabaseTab === 'rls' && (
              <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Row Level Security (RLS) Policies</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      PostgreSQL database-level row filtering protecting table privacy
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                    RLS Enabled on All Tables
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      table: 'books',
                      policy: 'Public Read Access',
                      action: 'SELECT',
                      command: 'CREATE POLICY "Allow public read on books" ON books FOR SELECT USING (true);'
                    },
                    {
                      table: 'orders',
                      policy: 'Owner Access Only',
                      action: 'SELECT, INSERT',
                      command: 'CREATE POLICY "Allow users to view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);'
                    },
                    {
                      table: 'profiles',
                      policy: 'Self Profile Update',
                      action: 'UPDATE',
                      command: 'CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);'
                    }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border space-y-2 ${
                        theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#0b101c] border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs font-bold">{item.policy}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            table: public.{item.table}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.action}
                        </span>
                      </div>
                      <div className="p-2.5 rounded bg-black/60 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                        <code>{item.command}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUPABASE API CREDENTIALS TAB */}
            {supabaseTab === 'api' && (
              <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Key className="w-4 h-4 text-emerald-500" />
                      <span>Supabase Project API Keys & Client</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Connect your frontend code via <code>@supabase/supabase-js</code>
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(`import { createClient } from '@supabase/supabase-js';\n\nconst supabaseUrl = 'https://xyqptnmwlbdf.supabase.co';\nconst supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fursad-anon-key-simulation';\n\nexport const supabase = createClient(supabaseUrl, supabaseAnonKey);`)}
                    className="px-3 py-1.5 rounded-xl border bg-white/5 hover:bg-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                <div className={`p-4 rounded-xl border font-mono text-xs leading-relaxed overflow-x-auto ${
                  theme === 'light' ? 'bg-slate-900 text-emerald-300' : 'bg-black/70 border-slate-800 text-emerald-200'
                }`}>
                  <pre>{`import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xyqptnmwlbdf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fursad-anon-key-simulation';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example: Fetch books
export async function getBooks() {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('price', { ascending: false });
  return data;
}`}</pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Document Modal for Firestore */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border space-y-4 shadow-2xl ${
            theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-slate-700 text-slate-100'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-500" />
                <span>Add New Book to Firestore</span>
              </h3>
              <button onClick={() => setShowAddDocModal(false)} className="text-slate-400 hover:text-slate-200 text-xs">
                Cancel
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-400">Book Title:</label>
                <input
                  type="text"
                  value={newDocData.title}
                  onChange={(e) => setNewDocData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Diiwaanka Gabayada"
                  className={`w-full p-2.5 rounded-xl border font-medium focus:outline-none ${
                    theme === 'light' ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-800 text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-400">Author:</label>
                <input
                  type="text"
                  value={newDocData.author}
                  onChange={(e) => setNewDocData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="e.g. Sayid Maxamed Cabdille Xasan"
                  className={`w-full p-2.5 rounded-xl border font-medium focus:outline-none ${
                    theme === 'light' ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-800 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-400">Price ($):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newDocData.price}
                    onChange={(e) => setNewDocData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className={`w-full p-2.5 rounded-xl border font-medium focus:outline-none ${
                      theme === 'light' ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-800 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-400">Stock Count:</label>
                  <input
                    type="number"
                    value={newDocData.stock}
                    onChange={(e) => setNewDocData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    className={`w-full p-2.5 rounded-xl border font-medium focus:outline-none ${
                      theme === 'light' ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-800 text-white'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddDocModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-800 text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddDocument}
                disabled={!newDocData.title}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md"
              >
                Save Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
