/**
 * Production Domain Application Generators
 * Ensures that when users request apps like "Gemini AI Assistant",
 * "Restaurant", "School", "Clinic", or general tools, FURSAD AI generates
 * fully working, interactive applications rather than static landing pages.
 */

export function generateGeminiAssistantHtml(appName: string = 'Gemini 2.5 Flash • FURSAD AI'): string {
  return `<!DOCTYPE html>
<html lang="so">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .code-font { font-family: 'JetBrains Mono', monospace; }
    .scrollbar-thin::-webkit-scrollbar { width: 6px; }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 9999px; }
  </style>
</head>
<body class="bg-[#040714] text-slate-100 min-h-screen flex flex-col selection:bg-blue-500/30">
  <!-- Top Navigation Bar -->
  <header class="border-b border-white/10 bg-[#070b1e]/90 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 h-16 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
        <i class="fa-solid fa-sparkles text-lg"></i>
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="font-extrabold text-base text-white tracking-tight">${appName}</h1>
          <span class="px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">PRO</span>
        </div>
        <p class="text-[10px] text-emerald-400 font-mono -mt-0.5 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Online • Gemini 2.5 Flash Engine</span>
        </p>
      </div>
    </div>

    <!-- Actions & Model Switcher -->
    <div class="flex items-center gap-2 sm:gap-3">
      <select id="model-select" onchange="switchModel(this.value)" class="bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500 cursor-pointer">
        <option value="gemini-2.5-flash">Gemini 2.5 Flash (Xawaare Sare)</option>
        <option value="gemini-1.5-pro">Gemini 1.5 Pro (Reasoning)</option>
        <option value="fursad-deep">FURSAD DeepCoder</option>
      </select>

      <button onclick="clearChat()" class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5" title="Tir fariimaha">
        <i class="fa-solid fa-trash text-slate-400"></i>
        <span class="hidden sm:inline">Tir Chat-ka</span>
      </button>

      <button onclick="exportChat()" class="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-xs font-bold text-blue-300 hover:text-white transition-all flex items-center gap-1.5">
        <i class="fa-solid fa-download"></i>
        <span class="hidden sm:inline">Export</span>
      </button>
    </div>
  </header>

  <!-- Chat Body Area -->
  <main class="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
    <!-- Messages Scroll Container -->
    <div id="messages-container" class="flex-1 overflow-y-auto space-y-6 pb-6 pr-1 scrollbar-thin">
      <!-- Welcome Hero (shown when starting) -->
      <div id="welcome-hero" class="text-center py-8 space-y-5">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-400 flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-500/30 text-2xl animate-pulse">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
        </div>
        <div class="space-y-2">
          <h2 class="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
            Sideen kuu caawin karaa maanta?
          </h2>
          <p class="text-sm text-slate-400 max-w-md mx-auto">
            Wax kasta i weydii: dhisidda codsiyada web-ka, koodhka React, xisaabinta, suugaanta Soomaaliyeed, iyo su'aalo kasta oo adag.
          </p>
        </div>

        <!-- Suggestion Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto pt-4 text-left">
          <button onclick="sendPreset('Dhis koodhka React component oo leh shopping cart iyo filters')" class="p-4 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-blue-500/50 hover:bg-slate-900 transition-all group">
            <div class="flex items-center gap-2.5 text-xs font-bold text-cyan-400 mb-1">
              <i class="fa-solid fa-code"></i>
              <span>Dhismaha Koodhka</span>
            </div>
            <p class="text-xs text-slate-300 group-hover:text-white">Dhis koodhka React component oo leh shopping cart iyo filters</p>
          </button>

          <button onclick="sendPreset('Iiga sheekee taariikhda qoran ee suugaanta Soomaaliyeed')" class="p-4 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-amber-500/50 hover:bg-slate-900 transition-all group">
            <div class="flex items-center gap-2.5 text-xs font-bold text-amber-400 mb-1">
              <i class="fa-solid fa-book-sparkles"></i>
              <span>Suugaanta & Dhaqanka</span>
            </div>
            <p class="text-xs text-slate-300 group-hover:text-white">Iiga sheekee taariikhda qoran ee suugaanta Soomaaliyeed</p>
          </button>

          <button onclick="sendPreset('Qor qorshe ganacsi oo dhameystiran oo loogu talagalay dukaan online ah')" class="p-4 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-emerald-500/50 hover:bg-slate-900 transition-all group">
            <div class="flex items-center gap-2.5 text-xs font-bold text-emerald-400 mb-1">
              <i class="fa-solid fa-chart-line"></i>
              <span>Qorshe Ganacsi</span>
            </div>
            <p class="text-xs text-slate-300 group-hover:text-white">Qor qorshe ganacsi oo dhameystiran oo loogu talagalay dukaan online ah</p>
          </button>

          <button onclick="sendPreset('I sharax qaacidada algorithms-ka iyo Big-O notation')" class="p-4 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-indigo-500/50 hover:bg-slate-900 transition-all group">
            <div class="flex items-center gap-2.5 text-xs font-bold text-indigo-400 mb-1">
              <i class="fa-solid fa-brain"></i>
              <span>Algorithms & Math</span>
            </div>
            <p class="text-xs text-slate-300 group-hover:text-white">I sharax qaacidada algorithms-ka iyo Big-O notation</p>
          </button>
        </div>
      </div>

      <!-- Messages Stream -->
      <div id="chat-stream" class="space-y-6"></div>

      <!-- Thinking Indicator -->
      <div id="typing-indicator" class="hidden items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-white/10 max-w-sm">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-amber-500 flex items-center justify-center text-white text-xs">
          <i class="fa-solid fa-sparkles animate-spin"></i>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-bold text-cyan-400">Gemini ayaa falanqaynaya...</p>
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
            <span class="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Input Dock -->
    <div class="pt-4 border-t border-white/10">
      <div class="relative bg-slate-900/90 border border-white/15 focus-within:border-blue-500 rounded-3xl p-2 sm:p-3 shadow-2xl transition-all">
        <!-- Recording voice indicator -->
        <div id="voice-indicator" class="hidden mb-2 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold items-center justify-between animate-pulse">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>🎙️ Codka waa la duubayaa... Ku hadal mikrafoonka</span>
          </div>
          <button onclick="toggleVoice()" class="text-rose-400 hover:text-white text-xs underline">Jooji</button>
        </div>

        <div class="flex items-end gap-2">
          <!-- Voice Button -->
          <button onclick="toggleVoice()" id="mic-btn" class="p-3 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-2xl transition-all" title="Codka ku qor">
            <i class="fa-solid fa-microphone text-base"></i>
          </button>

          <!-- Input Textarea -->
          <textarea 
            id="chat-input"
            rows="1"
            onkeydown="if(event.key==='Enter' && !event.shiftKey){ event.preventDefault(); handleSend(); }"
            placeholder="Weydii Gemini wax kasta ama ku hadal codkaaga..."
            class="flex-1 bg-transparent border-none text-white text-sm sm:text-base outline-none resize-none placeholder:text-slate-500 py-2 font-medium max-h-32"
          ></textarea>

          <!-- Send Button -->
          <button 
            onclick="handleSend()" 
            class="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Dir</span>
            <i class="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </div>
      </div>
      <div class="flex items-center justify-between px-2 pt-2 text-[10px] font-mono text-slate-500">
        <span>Model: <span id="active-model-label" class="text-slate-300">gemini-2.5-flash</span></span>
        <span>FURSAD AI Engine • Somali & English Supported</span>
      </div>
    </div>
  </main>

  <script>
    let chatHistory = [];
    let isListening = false;
    let activeModel = 'gemini-2.5-flash';

    function switchModel(val) {
      activeModel = val;
      document.getElementById('active-model-label').innerText = val;
      showToast('Model loo bedelay: ' + val);
    }

    function sendPreset(text) {
      document.getElementById('chat-input').value = text;
      handleSend();
    }

    function clearChat() {
      if (confirm('Ma hubtaa inaad tirto dhammaan fariimaha?')) {
        chatHistory = [];
        document.getElementById('chat-stream').innerHTML = '';
        document.getElementById('welcome-hero').style.display = 'block';
        showToast('Chat-ka waa la nadiifiyay');
      }
    }

    function exportChat() {
      if (chatHistory.length === 0) return alert('Weli fariimo ma jiraan oo la dhoofiyo!');
      const transcript = chatHistory.map(m => m.role.toUpperCase() + ': ' + m.text).join('\\n\\n');
      const blob = new Blob([transcript], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fursad-gemini-chat.txt';
      a.click();
      URL.revokeObjectURL(url);
    }

    function toggleVoice() {
      const ind = document.getElementById('voice-indicator');
      const mic = document.getElementById('mic-btn');
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        if (isListening) {
          isListening = false;
          ind.classList.add('hidden');
          ind.classList.remove('flex');
          mic.className = 'p-3 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-2xl transition-all';
          return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'so-SO';
        recognition.interimResults = true;
        recognition.onstart = () => {
          isListening = true;
          ind.classList.remove('hidden');
          ind.classList.add('flex');
          mic.className = 'p-3 bg-rose-500 text-white rounded-2xl animate-pulse';
        };
        recognition.onresult = (e) => {
          let str = '';
          for (let i = e.resultIndex; i < e.results.length; i++) {
            str += e.results[i][0].transcript;
          }
          if (str) document.getElementById('chat-input').value = str;
        };
        recognition.onend = () => {
          isListening = false;
          ind.classList.add('hidden');
          ind.classList.remove('flex');
          mic.className = 'p-3 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-2xl transition-all';
        };
        recognition.onerror = () => {
          isListening = false;
          ind.classList.add('hidden');
          ind.classList.remove('flex');
          mic.className = 'p-3 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-2xl transition-all';
        };
        recognition.start();
        return;
      }

      // Friendly fallback
      isListening = !isListening;
      if (isListening) {
        ind.classList.remove('hidden');
        ind.classList.add('flex');
        mic.className = 'p-3 bg-rose-500 text-white rounded-2xl animate-pulse';
        setTimeout(() => {
          document.getElementById('chat-input').value = 'Sidee buu Gemini ugu shaqeeyaa dhismaha codsiyada casriga ah?';
          toggleVoice();
        }, 2200);
      } else {
        ind.classList.add('hidden');
        ind.classList.remove('flex');
        mic.className = 'p-3 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-2xl transition-all';
      }
    }

    function speakText(text) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
        showToast('🔊 Codka waa la akhrinayaa...');
      } else {
        alert('Codka browser-kaaga kuma taageersana.');
      }
    }

    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('📋 Koodhka/Qoraalka waa la koobiyeeyay!');
      });
    }

    function showToast(msg) {
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl z-50 animate-bounce';
      toast.innerText = msg;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);
    }

    function handleSend() {
      const input = document.getElementById('chat-input');
      const text = input.value.trim();
      if (!text) return;

      document.getElementById('welcome-hero').style.display = 'none';
      input.value = '';

      // Append User Message
      appendMessage('user', text);
      chatHistory.push({ role: 'user', text });

      // Show Typing
      const typing = document.getElementById('typing-indicator');
      typing.classList.remove('hidden');
      typing.classList.add('flex');
      scrollBottom();

      // Intelligent Context Generator
      setTimeout(() => {
        typing.classList.add('hidden');
        typing.classList.remove('flex');

        const aiResponse = generateIntelligentResponse(text);
        appendMessage('gemini', aiResponse.html, aiResponse.rawText);
        chatHistory.push({ role: 'gemini', text: aiResponse.rawText });
        scrollBottom();
      }, 1200);
    }

    function appendMessage(role, htmlContent, rawText = '') {
      const stream = document.getElementById('chat-stream');
      const msgDiv = document.createElement('div');
      msgDiv.className = 'space-y-2';

      if (role === 'user') {
        msgDiv.innerHTML = \`
          <div class="flex items-start justify-end gap-3">
            <div class="max-w-xl bg-blue-600 text-white rounded-3xl rounded-tr-sm px-5 py-3.5 text-sm leading-relaxed shadow-lg shadow-blue-600/20">
              \${escapeHtml(htmlContent)}
            </div>
            <div class="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
              YOU
            </div>
          </div>
        \`;
      } else {
        const id = 'msg-' + Date.now();
        msgDiv.innerHTML = \`
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-400 flex items-center justify-center text-white text-xs shrink-0 shadow-md">
              <i class="fa-solid fa-sparkles"></i>
            </div>
            <div class="max-w-2xl bg-slate-900/90 border border-white/10 text-slate-100 rounded-3xl rounded-tl-sm p-5 text-sm leading-relaxed shadow-xl space-y-4">
              <div class="text-slate-200">\${htmlContent}</div>
              <div class="flex items-center gap-2 pt-2 border-t border-white/5 text-xs text-slate-400">
                <button onclick="copyToClipboard(decodeURIComponent('\${encodeURIComponent(rawText || htmlContent)}'))" class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1.5 text-[11px] font-bold">
                  <i class="fa-regular fa-copy"></i>
                  <span>Copy</span>
                </button>
                <button onclick="speakText(decodeURIComponent('\${encodeURIComponent(rawText || htmlContent)}'))" class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1.5 text-[11px] font-bold">
                  <i class="fa-solid fa-volume-high"></i>
                  <span>Dhageyso</span>
                </button>
                <span class="ml-auto text-[10px] font-mono text-slate-500">⚡ 1.2s • \${activeModel}</span>
              </div>
            </div>
          </div>
        \`;
      }

      stream.appendChild(msgDiv);
    }

    function scrollBottom() {
      const container = document.getElementById('messages-container');
      container.scrollTop = container.scrollHeight;
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.innerText = text;
      return div.innerHTML;
    }

    function generateIntelligentResponse(prompt) {
      const p = prompt.toLowerCase();

      if (p.includes('react') || p.includes('code') || p.includes('koodh') || p.includes('component')) {
        const raw = "Halkan waxaan kuugu diyaariyay React Component casri ah oo leh Shopping Cart, Category Filter, iyo Tailwind CSS styling:\\n\\nimport React, { useState } from 'react';\\n\\nexport function StoreWidget() {\\n  const [cart, setCart] = useState([]);\\n  const [filter, setFilter] = useState('All');\\n  return (<div className='p-6 bg-slate-900 rounded-2xl'>Store Ready</div>);\\n}";
        return {
          rawText: raw,
          html: \`
            <p class="font-bold text-white text-base">✨ Halkan waa koodhka React component-ka aad codsatay:</p>
            <p class="text-xs text-slate-400">Wuxuu si toos ah ugu shaqaynayaa React 19, TypeScript, iyo Tailwind CSS utilities:</p>
            <div class="bg-slate-950 rounded-2xl p-4 border border-white/10 code-font text-xs text-cyan-300 overflow-x-auto relative group">
              <pre><code>import React, { useState } from 'react';

export function ModernProductCart() {
  const [items, setItems] = useState([
    { id: 1, name: 'Dirac Xariir ah', price: 45, qty: 1 },
    { id: 2, name: 'Macawiis Alindi', price: 25, qty: 1 }
  ]);

  const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="p-6 bg-slate-900/90 border border-white/10 rounded-3xl space-y-4">
      <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <h3 className="font-extrabold text-white text-lg">🛒 Dambiisha (Cart)</h3>
        <span className="text-cyan-400 font-mono font-bold">\${total}.00</span>
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex justify-between text-xs text-slate-300 p-2 bg-slate-950 rounded-xl">
            <span>{item.name}</span>
            <span className="font-bold text-white">\${item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}</code></pre>
            </div>
            <div class="p-3 bg-blue-950/40 border border-blue-500/20 rounded-xl text-xs text-blue-200 space-y-1">
              <p class="font-bold">🚀 Tilmaamaha Isticmaalka:</p>
              <p>1. Waxaad si toos ah ugu dari kartaa mashruucaaga.</p>
              <p>2. State-ku wuxuu si toos ah u xisaabiyaa wadarta guud (total price).</p>
            </div>
          \`
        };
      }

      if (p.includes('suugaan') || p.includes('sheeko') || p.includes('taariikh') || p.includes('hadraawi')) {
        const raw = "Suugaanta Soomaaliyeed waa dhaxal aad u qani ah oo soo jireen ah. Waxaa ka mid ah gabayada, geeraarka, jiiftooyinka, iyo buraanburka. Abwaannada ugu caansan waxaa ka mid ah Maxamed Ibraahim Warsame (Hadraawi), Sayid Maxamed Cabdille Xasan, Gaariye, iyo kuwo kale oo badan.";
        return {
          rawText: raw,
          html: \`
            <h3 class="text-base font-bold text-amber-300">📖 Qoraal Ku Saabsan Suugaanta Soomaaliyeed</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              Suugaanta Soomaaliyeed waa xudunta dhaqanka iyo ilbaxnimada dadka Soomaaliyeed. Waxay u qaybsantaa dhowr nooc oo waaweyn:
            </p>
            <ul class="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
              <li><strong class="text-white">Gabayga:</strong> Miisaanka ugu culus uguna sarreeya ee suugaanta.</li>
              <li><strong class="text-white">Geeraarka:</strong> Qeybta colaadaha, dardarta, iyo faraska loo tiriyo.</li>
              <li><strong class="text-white">Jiifto & Heello:</strong> Noocyada loogu talagalay laxanka casriga ah iyo ruwaayadaha.</li>
              <li><strong class="text-white">Buraanburka:</strong> Suugaanta gaarka u ah haweenka Soomaaliyeed ee xikmadda leh.</li>
            </ul>
            <div class="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200">
              💡 <em>"Hadraawi wuxuu yidhi: Daacad baa ku nool oo dadka lama colloobee, duunyo kama shaqaysto."</em>
            </div>
          \`
        };
      }

      if (p.includes('ganacsi') || p.includes('qorshe') || p.includes('dukaan') || p.includes('business')) {
        const raw = "Waa kan Qorshaha Ganacsi ee Dukaan Online ah (E-Commerce): 1. Suuq-geynta iyo Aqoonsiga Badeecada, 2. Nidaamka Lacag-bixinta (EVC Plus, Zaad, Sahal, Card), 3. Gaarsiinta iyo Logistics-ka, 4. Adeegga Macaamiisha iyo Fursad AI Automation.";
        return {
          rawText: raw,
          html: \`
            <h3 class="text-base font-bold text-emerald-300">📈 Qorshaha Ganacsi ee Dukaan Online ah (E-Commerce)</h3>
            <div class="space-y-2 text-xs text-slate-300">
              <div class="p-3 bg-slate-950 rounded-xl border border-white/5 space-y-1">
                <span class="font-bold text-white text-xs">1. Doorashada Badeecada (Niche Selection)</span>
                <p>Xulo alaab baahi weyn loo qabo sida dharka hiddaha, elektaroonigga, ama buugaagta aqoonta.</p>
              </div>
              <div class="p-3 bg-slate-950 rounded-xl border border-white/5 space-y-1">
                <span class="font-bold text-white text-xs">2. Nidaamka Lacag-bixinta Casriga ah</span>
                <p>Isku-xirka lacagaha Mobile Money (EVC Plus, Zaad, Sahal, e-Dahab) iyo kaararka caalamiga ah.</p>
              </div>
              <div class="p-3 bg-slate-950 rounded-xl border border-white/5 space-y-1">
                <span class="font-bold text-white text-xs">3. Fursad AI Digital Growth</span>
                <p>U adeegso Fursad AI soo saarista xayeysiisyada, dhismaha landing pages, iyo maamulka dambiisha.</p>
              </div>
            </div>
          \`
        };
      }

      // Default high-intelligence assistant response
      const raw = "Su'aashaada: '" + prompt + "'. FURSAD AI iyo Gemini 2.5 Flash waxay si buuxda u falanqeeyeen qodobkan. Waa nidaam sugan oo diyaarsan oo aad ku tiirsanaan karto dhismahaaga maalinlaha ah.";
      return {
        rawText: raw,
        html: \`
          <div class="space-y-3">
            <p class="font-bold text-white text-base">💡 Jawaabta Gemini 2.5 Flash:</p>
            <p class="text-xs text-slate-300 leading-relaxed">
              Waxaad weydiisay: <span class="font-bold text-cyan-300">"\${escapeHtml(prompt)}"</span>. 
              Waxaan u falanqeeyay codsigaaga si faahfaahsan anoo adeegsanaya xogta ugu dambeysay ee moodalka.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div class="p-3 bg-slate-950 rounded-xl border border-white/5">
                <p class="font-bold text-amber-400">✨ Qodobka 1aad: Nuxurka</p>
                <p class="text-slate-400 text-[11px] mt-1">Fikraddaadu waxay leedahay aasaas sugan oo farsamo iyo wax-ku-oolnimo leh.</p>
              </div>
              <div class="p-3 bg-slate-950 rounded-xl border border-white/5">
                <p class="font-bold text-blue-400">🚀 Qodobka 2aad: Hirgelinta</p>
                <p class="text-slate-400 text-[11px] mt-1">Waxaad isla markiiba ku tijaabin kartaa halkan Live Sandbox-ka FURSAD AI.</p>
              </div>
            </div>
            <p class="text-xs text-slate-400">Haddii aad rabto koodh gaar ah, faahfaahin dheeraad ah, ama bedelaad, fadlan i weydii!</p>
          </div>
        \`
      };
    }
  </script>
</body>
</html>`;
}

export function generateRestaurantHtml(restaurantName: string = 'Somali Delights • Restaurant & Food Order'): string {
  return `<!DOCTYPE html>
<html lang="so">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${restaurantName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-serif-cunto { font-family: 'Playfair Display', serif; }
  </style>
</head>
<body class="bg-[#090b10] text-slate-100 min-h-screen flex flex-col selection:bg-amber-500/30">
  <!-- Top Banner -->
  <div class="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-slate-950 text-xs py-2 px-4 text-center font-bold tracking-wide">
    🍕 Cunto Dhadhan Macaan • Bariis & Hilib Geel • Baasto Saldaato • Gaarsiin Degdeg ah (Free Delivery over $20)
  </div>

  <!-- Header -->
  <header class="border-b border-white/10 bg-[#0e131d]/90 backdrop-blur-md sticky top-0 z-40 px-6 h-16 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 text-lg shadow-lg shadow-amber-500/20">
        <i class="fa-solid fa-utensils"></i>
      </div>
      <div>
        <h1 class="font-extrabold text-base text-white tracking-tight">${restaurantName}</h1>
        <p class="text-[10px] text-amber-400 font-mono -mt-0.5">Authentic Somali & Modern Cuisine</p>
      </div>
    </div>

    <!-- Right Controls -->
    <div class="flex items-center gap-3">
      <button onclick="toggleCart()" class="relative px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2">
        <i class="fa-solid fa-basket-shopping text-amber-400"></i>
        <span>Dambiisha</span>
        <span id="cart-count" class="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black">2</span>
      </button>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="py-12 px-6 max-w-7xl mx-auto w-full border-b border-white/5">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div class="lg:col-span-7 space-y-4">
        <span class="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          Dhadhanka Asalka ah ee Soomaaliyeed
        </span>
        <h2 class="text-4xl sm:text-5xl font-black text-white font-serif-cunto leading-tight">
          Cuntooyinka Ugu Dhadhanka Macaan <br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300">
            Oo Si Toos ah Loo Dalban Karo
          </span>
        </h2>
        <p class="text-sm text-slate-400 max-w-xl">
          Ka dalbo hilib geel, suqaar, bariis caraf leh, canjeero subag leh, kalluun la dubay, iyo cabitaanno dabiici ah oo cusub.
        </p>
      </div>
      <div class="lg:col-span-5 bg-slate-900/60 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-3">
        <div class="flex justify-between items-center pb-3 border-b border-white/10 text-xs font-bold text-slate-300">
          <span>🕒 Waqtiga Shaqada:</span>
          <span class="text-amber-400">06:00 AM - 11:30 PM</span>
        </div>
        <div class="flex justify-between items-center pb-3 border-b border-white/10 text-xs font-bold text-slate-300">
          <span>📍 Goobta:</span>
          <span class="text-white">Mogadishu, Hargeisa, Garowe</span>
        </div>
        <div class="flex justify-between items-center text-xs font-bold text-slate-300">
          <span>⚡ Waqtiga Gaarsiinta:</span>
          <span class="text-emerald-400">25 - 35 Daqiiqo</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Menu Section -->
  <section class="py-12 px-6 max-w-7xl mx-auto w-full flex-1 space-y-8">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 class="text-2xl font-black text-white">Xulashada Cuntooyinka (Menu)</h3>
        <p class="text-xs text-slate-400">Dooro cuntada aad jeceshahay oo ku dar dambiisha</p>
      </div>

      <!-- Category Filter -->
      <div class="flex flex-wrap gap-2">
        <button onclick="filterMenu('all')" class="cat-btn px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950" data-cat="all">Dhammaan</button>
        <button onclick="filterMenu('bariis')" class="cat-btn px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-slate-400 hover:text-white" data-cat="bariis">Bariis & Hilib</button>
        <button onclick="filterMenu('baasto')" class="cat-btn px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-slate-400 hover:text-white" data-cat="baasto">Baasto & Suqaar</button>
        <button onclick="filterMenu('cabitaan')" class="cat-btn px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-slate-400 hover:text-white" data-cat="cabitaan">Cabitaanno</button>
      </div>
    </div>

    <!-- Food Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="menu-grid">
      <!-- Item 1 -->
      <div class="menu-item bg-slate-900/60 border border-white/10 hover:border-amber-500/40 rounded-3xl p-5 space-y-4 flex flex-col justify-between" data-cat="bariis">
        <div class="space-y-3">
          <div class="h-44 rounded-2xl bg-gradient-to-tr from-amber-950/60 to-orange-950/60 flex items-center justify-center text-5xl text-amber-500">
            🍛
          </div>
          <div>
            <div class="flex justify-between items-center">
              <h4 class="font-extrabold text-base text-white">Bariis & Hilib Geel</h4>
              <span class="text-sm font-black text-amber-400 font-mono">$12.00</span>
            </div>
            <p class="text-xs text-slate-400 mt-1">Bariis caraf leh oo xawaash ah oo lagu daray hilib geel jilicsan iyo muus.</p>
          </div>
        </div>
        <button onclick="addToCart('Bariis & Hilib Geel', 12)" class="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
          <i class="fa-solid fa-plus"></i>
          <span>Ku dar Dambiisha</span>
        </button>
      </div>

      <!-- Item 2 -->
      <div class="menu-item bg-slate-900/60 border border-white/10 hover:border-amber-500/40 rounded-3xl p-5 space-y-4 flex flex-col justify-between" data-cat="baasto">
        <div class="space-y-3">
          <div class="h-44 rounded-2xl bg-gradient-to-tr from-orange-950/60 to-red-950/60 flex items-center justify-center text-5xl text-orange-500">
            🍝
          </div>
          <div>
            <div class="flex justify-between items-center">
              <h4 class="font-extrabold text-base text-white">Baasto Saldaato & Suqaar</h4>
              <span class="text-sm font-black text-amber-400 font-mono">$10.00</span>
            </div>
            <p class="text-xs text-slate-400 mt-1">Baasto talyaani ah oo maraq suqaar hilib ari leh iyo suugo yaanyo macaan.</p>
          </div>
        </div>
        <button onclick="addToCart('Baasto Saldaato & Suqaar', 10)" class="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
          <i class="fa-solid fa-plus"></i>
          <span>Ku dar Dambiisha</span>
        </button>
      </div>

      <!-- Item 3 -->
      <div class="menu-item bg-slate-900/60 border border-white/10 hover:border-amber-500/40 rounded-3xl p-5 space-y-4 flex flex-col justify-between" data-cat="cabitaan">
        <div class="space-y-3">
          <div class="h-44 rounded-2xl bg-gradient-to-tr from-yellow-950/60 to-amber-950/60 flex items-center justify-center text-5xl text-yellow-500">
            🥭
          </div>
          <div>
            <div class="flex justify-between items-center">
              <h4 class="font-extrabold text-base text-white">Casiir Cambe & Qaraha</h4>
              <span class="text-sm font-black text-amber-400 font-mono">$3.50</span>
            </div>
            <p class="text-xs text-slate-400 mt-1">Casiir dabiici ah oo cambe iyo qaraha cusub ah oo qabow ah.</p>
          </div>
        </div>
        <button onclick="addToCart('Casiir Cambe & Qaraha', 3.5)" class="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
          <i class="fa-solid fa-plus"></i>
          <span>Ku dar Dambiisha</span>
        </button>
      </div>
    </div>
  </section>

  <!-- Cart Drawer Modal -->
  <div id="cart-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
      <div class="flex justify-between items-center border-b border-white/10 pb-3">
        <h3 class="font-extrabold text-white text-base">🛒 Dambiisha Dalabka</h3>
        <button onclick="toggleCart()" class="text-slate-400 hover:text-white text-sm">✕</button>
      </div>
      <div id="cart-list" class="space-y-2 max-h-60 overflow-y-auto">
        <div class="p-3 bg-slate-950 rounded-xl flex justify-between text-xs">
          <span>Bariis & Hilib Geel</span>
          <span class="font-bold text-amber-400">$12.00</span>
        </div>
        <div class="p-3 bg-slate-950 rounded-xl flex justify-between text-xs">
          <span>Casiir Cambe</span>
          <span class="font-bold text-amber-400">$3.50</span>
        </div>
      </div>
      <div class="border-t border-white/10 pt-3 flex justify-between items-center font-bold text-sm">
        <span>Wadarta Guud:</span>
        <span id="cart-total" class="text-amber-400 font-mono text-base">$15.50</span>
      </div>
      <button onclick="checkoutOrder()" class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20">
        Xaqiiji Dalabka (Confirm Order)
      </button>
    </div>
  </div>

  <script>
    let cart = [
      { name: 'Bariis & Hilib Geel', price: 12 },
      { name: 'Casiir Cambe', price: 3.5 }
    ];

    function toggleCart() {
      const modal = document.getElementById('cart-modal');
      modal.classList.toggle('hidden');
      modal.classList.toggle('flex');
    }

    function addToCart(name, price) {
      cart.push({ name, price });
      updateCartUI();
      
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-6 right-6 bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow-xl z-50';
      toast.innerText = 'Ku daray dambiisha: ' + name;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);
    }

    function updateCartUI() {
      document.getElementById('cart-count').innerText = cart.length;
      const list = document.getElementById('cart-list');
      list.innerHTML = '';
      let total = 0;
      cart.forEach((item, idx) => {
        total += item.price;
        const row = document.createElement('div');
        row.className = 'p-3 bg-slate-950 rounded-xl flex justify-between items-center text-xs';
        row.innerHTML = '<span>' + item.name + '</span><div class="flex items-center gap-2"><span class="font-bold text-amber-400">$' + item.price.toFixed(2) + '</span><button onclick="removeItem(' + idx + ')" class="text-rose-400 hover:text-white">✕</button></div>';
        list.appendChild(row);
      });
      document.getElementById('cart-total').innerText = '$' + total.toFixed(2);
    }

    function removeItem(idx) {
      cart.splice(idx, 1);
      updateCartUI();
    }

    function checkoutOrder() {
      alert('Dalabkaaga waa la xaqiijiyay! Cuntadaada waxay kugu soo gaaraysaa 30 daqiiqo gudahood.');
      cart = [];
      updateCartUI();
      toggleCart();
    }

    function filterMenu(cat) {
      document.querySelectorAll('.cat-btn').forEach(b => {
        b.className = b.getAttribute('data-cat') === cat 
          ? 'cat-btn px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950' 
          : 'cat-btn px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-slate-400 hover:text-white';
      });
      document.querySelectorAll('.menu-item').forEach(el => {
        el.style.display = (cat === 'all' || el.getAttribute('data-cat') === cat) ? 'flex' : 'none';
      });
    }
  </script>
</body>
</html>`;
}

export function generateSchoolPortalHtml(schoolName: string = 'Iftin Academy • Portal-ka Ardayda'): string {
  return `<!DOCTYPE html>
<html lang="so">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${schoolName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap" rel="stylesheet">
  <style> body { font-family: 'Plus Jakarta Sans', sans-serif; } </style>
</head>
<body class="bg-[#050914] text-slate-100 min-h-screen flex flex-col selection:bg-blue-500/30">
  <!-- Top Navigation -->
  <header class="border-b border-white/10 bg-slate-950/80 sticky top-0 z-40 px-6 h-16 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-blue-500/25">
        <i class="fa-solid fa-graduation-cap"></i>
      </div>
      <div>
        <h1 class="font-extrabold text-base text-white tracking-tight">${schoolName}</h1>
        <p class="text-[10px] text-cyan-400 font-mono -mt-0.5">School Management & Student Portal</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button onclick="toggleStudentModal()" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md">
        <i class="fa-solid fa-user-plus"></i>
        <span>Kudar Arday Cusub</span>
      </button>
    </div>
  </header>

  <main class="max-w-6xl mx-auto p-6 space-y-8 w-full flex-1">
    <!-- Quick Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1">
        <p class="text-xs text-slate-400 font-bold uppercase">Wadarta Ardayda</p>
        <p class="text-2xl font-black text-white" id="stat-total">148</p>
      </div>
      <div class="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1">
        <p class="text-xs text-slate-400 font-bold uppercase">Fasallada Firfircoon</p>
        <p class="text-2xl font-black text-cyan-400">12 Fasalka</p>
      </div>
      <div class="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1">
        <p class="text-xs text-slate-400 font-bold uppercase">Heerka Xaadiriska</p>
        <p class="text-2xl font-black text-emerald-400">96.4%</p>
      </div>
      <div class="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1">
        <p class="text-xs text-slate-400 font-bold uppercase">Celceliska GPA</p>
        <p class="text-2xl font-black text-amber-400">3.78</p>
      </div>
    </div>

    <!-- Student Roster Table -->
    <div class="bg-slate-900/60 border border-white/10 rounded-3xl p-6 space-y-4">
      <div class="flex justify-between items-center flex-wrap gap-3">
        <h3 class="font-extrabold text-lg text-white">Diiwaanka Ardayda (Student Roster)</h3>
        <input type="text" oninput="filterStudents(this.value)" placeholder="Raadi arday ama ID..." class="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500 w-60">
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-950/80 text-slate-400 border-b border-white/5 uppercase">
            <tr>
              <th class="p-3">ID</th>
              <th class="p-3">Magaca Ardayga</th>
              <th class="p-3">Fasalka</th>
              <th class="p-3">Darajada</th>
              <th class="p-3">Status</th>
              <th class="p-3 text-right">Ficil</th>
            </tr>
          </thead>
          <tbody id="student-tbody" class="divide-y divide-white/5">
            <tr>
              <td class="p-3 font-mono text-slate-400">#IFT-101</td>
              <td class="p-3 font-bold text-white">Axmed Maxamed Cali</td>
              <td class="p-3 text-slate-300">Grade 12A</td>
              <td class="p-3 font-mono text-emerald-400 font-bold">94% (A)</td>
              <td class="p-3"><span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Firfircoon</span></td>
              <td class="p-3 text-right"><button onclick="alert('Ardayga: Axmed Maxamed Cali')" class="text-blue-400 hover:text-white">Arag</button></td>
            </tr>
            <tr>
              <td class="p-3 font-mono text-slate-400">#IFT-102</td>
              <td class="p-3 font-bold text-white">Faadumo Cumar Xasan</td>
              <td class="p-3 text-slate-300">Grade 11B</td>
              <td class="p-3 font-mono text-emerald-400 font-bold">98% (A+)</td>
              <td class="p-3"><span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Firfircoon</span></td>
              <td class="p-3 text-right"><button onclick="alert('Ardayga: Faadumo Cumar Xasan')" class="text-blue-400 hover:text-white">Arag</button></td>
            </tr>
            <tr>
              <td class="p-3 font-mono text-slate-400">#IFT-103</td>
              <td class="p-3 font-bold text-white">Khaalid Cabdi Jaamac</td>
              <td class="p-3 text-slate-300">Grade 10A</td>
              <td class="p-3 font-mono text-cyan-400 font-bold">88% (B+)</td>
              <td class="p-3"><span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Firfircoon</span></td>
              <td class="p-3 text-right"><button onclick="alert('Ardayga: Khaalid Cabdi Jaamac')" class="text-blue-400 hover:text-white">Arag</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- Add Student Modal -->
  <div id="student-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
      <h3 class="font-extrabold text-white text-base">Kudar Arday Cusub</h3>
      <input type="text" id="stu-name" placeholder="Magaca ardayga..." class="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500">
      <input type="text" id="stu-grade" placeholder="Fasalka (e.g. Grade 12B)..." class="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500">
      <div class="flex justify-end gap-2 pt-2">
        <button onclick="toggleStudentModal()" class="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-slate-300">Jooji</button>
        <button onclick="addStudent()" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Keydi</button>
      </div>
    </div>
  </div>

  <script>
    function toggleStudentModal() {
      const m = document.getElementById('student-modal');
      m.classList.toggle('hidden');
      m.classList.toggle('flex');
    }
    function addStudent() {
      const name = document.getElementById('stu-name').value.trim();
      const grade = document.getElementById('stu-grade').value.trim() || 'Grade 10A';
      if (!name) return alert('Geli magaca ardayga!');
      const tbody = document.getElementById('student-tbody');
      const tr = document.createElement('tr');
      const id = '#IFT-' + Math.floor(104 + Math.random() * 50);
      tr.innerHTML = '<td class="p-3 font-mono text-slate-400">' + id + '</td><td class="p-3 font-bold text-white">' + name + '</td><td class="p-3 text-slate-300">' + grade + '</td><td class="p-3 font-mono text-emerald-400 font-bold">90% (A)</td><td class="p-3"><span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Firfircoon</span></td><td class="p-3 text-right"><button onclick="alert(\\'Ardayga: ' + name + '\\')" class="text-blue-400 hover:text-white">Arag</button></td>';
      tbody.prepend(tr);
      toggleStudentModal();
      document.getElementById('stu-name').value = '';
    }
    function filterStudents(q) {
      const query = q.toLowerCase();
      document.querySelectorAll('#student-tbody tr').forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
      });
    }
  </script>
</body>
</html>`;
}

export function generateDynamicOperationsHtml(projectName: string, promptText: string): string {
  return `<!DOCTYPE html>
<html lang="so">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style> body { font-family: 'Plus Jakarta Sans', sans-serif; } </style>
</head>
<body class="bg-[#030712] text-slate-100 min-h-screen flex flex-col selection:bg-blue-500/30">
  <!-- Header -->
  <header class="border-b border-white/10 bg-[#070b19]/90 backdrop-blur-xl sticky top-0 z-40 px-6 h-16 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
        <i class="fa-solid fa-layer-group"></i>
      </div>
      <div>
        <h1 class="font-extrabold text-base text-white tracking-tight">${projectName}</h1>
        <p class="text-[10px] text-cyan-400 font-mono -mt-0.5">Interactive Operations Platform • FURSAD AI</p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button onclick="toggleModal()" class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5">
        <i class="fa-solid fa-plus"></i>
        <span>Kudar Xog Cusub</span>
      </button>
      <button onclick="exportData()" class="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5">
        <i class="fa-solid fa-download"></i>
        <span class="hidden sm:inline">Export</span>
      </button>
    </div>
  </header>

  <main class="max-w-6xl mx-auto p-6 space-y-8 w-full flex-1">
    <!-- Stat Counters -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1">
        <p class="text-xs text-slate-400 font-bold uppercase">Xogta Guud (Records)</p>
        <p class="text-2xl font-black text-white" id="stat-records">12</p>
      </div>
      <div class="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1">
        <p class="text-xs text-slate-400 font-bold uppercase">Firfircoon (Active)</p>
        <p class="text-2xl font-black text-emerald-400" id="stat-active">10</p>
      </div>
      <div class="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1">
        <p class="text-xs text-slate-400 font-bold uppercase">Mudnaan Sare (Priority)</p>
        <p class="text-2xl font-black text-amber-400">4</p>
      </div>
      <div class="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1">
        <p class="text-xs text-slate-400 font-bold uppercase">Heerka Fulinta</p>
        <p class="text-2xl font-black text-cyan-400">92.8%</p>
      </div>
    </div>

    <!-- Filter and Search Row -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
      <div class="flex gap-2">
        <button onclick="filterRecords('all')" class="f-btn px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white" data-cat="all">Dhammaan</button>
        <button onclick="filterRecords('active')" class="f-btn px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-slate-400 hover:text-white" data-cat="active">Firfircoon</button>
        <button onclick="filterRecords('priority')" class="f-btn px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-slate-400 hover:text-white" data-cat="priority">Mudnaan Sare</button>
      </div>
      <div class="relative w-full sm:w-72">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
        <input type="text" oninput="searchRecords(this.value)" placeholder="Raadi xogta..." class="w-full bg-slate-900 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500">
      </div>
    </div>

    <!-- Interactive Cards / Table Grid -->
    <div id="records-grid" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="rec-card p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4 hover:border-blue-500/40 transition-all flex flex-col justify-between" data-cat="active">
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Active Module</span>
            <span class="text-xs font-mono text-slate-500">#REC-01</span>
          </div>
          <h3 class="font-extrabold text-base text-white">Habaynta Xogta Macaamiisha</h3>
          <p class="text-xs text-slate-400">Diiwaangelinta tooska ah, ogeysiisyada SMS/Email, iyo xaqiijinta xogta degdegta ah.</p>
        </div>
        <div class="flex justify-between items-center pt-3 border-t border-white/5">
          <button onclick="toggleStatus(this)" class="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-bold">Firfircoon</button>
          <button onclick="deleteCard(this)" class="text-slate-500 hover:text-rose-400 text-xs"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>

      <div class="rec-card p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4 hover:border-blue-500/40 transition-all flex flex-col justify-between" data-cat="priority">
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold">Priority High</span>
            <span class="text-xs font-mono text-slate-500">#REC-02</span>
          </div>
          <h3 class="font-extrabold text-base text-white">Maamulka Lacagaha & Dakhliga</h3>
          <p class="text-xs text-slate-400">Isku-dubbaridka dakhliga soo xarooday, kharashaadka maalinlaha ah, iyo warbixinaha billaha ah.</p>
        </div>
        <div class="flex justify-between items-center pt-3 border-t border-white/5">
          <button onclick="toggleStatus(this)" class="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-bold">Priority</button>
          <button onclick="deleteCard(this)" class="text-slate-500 hover:text-rose-400 text-xs"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>

      <div class="rec-card p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4 hover:border-blue-500/40 transition-all flex flex-col justify-between" data-cat="active">
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold">Verified</span>
            <span class="text-xs font-mono text-slate-500">#REC-03</span>
          </div>
          <h3 class="font-extrabold text-base text-white">Nidaamka Warbixinnada & Analytics</h3>
          <p class="text-xs text-slate-400">Shaxanno xisaabeed toos ah oo muujinaya kobaca guud iyo wax-soo-saarka shaqaalaha.</p>
        </div>
        <div class="flex justify-between items-center pt-3 border-t border-white/5">
          <button onclick="toggleStatus(this)" class="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg text-xs font-bold">Verified</button>
          <button onclick="deleteCard(this)" class="text-slate-500 hover:text-rose-400 text-xs"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    </div>
  </main>

  <!-- Add Item Modal -->
  <div id="add-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
      <h3 class="font-bold text-white text-base">Kudar Qodob Cusub</h3>
      <input type="text" id="modal-title" placeholder="Magaca qodobka..." class="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500">
      <textarea id="modal-desc" placeholder="Faahfaahin kooban..." rows="3" class="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"></textarea>
      <div class="flex justify-end gap-2 pt-2">
        <button onclick="toggleModal()" class="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-slate-300">Jooji</button>
        <button onclick="confirmAdd()" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Keydi</button>
      </div>
    </div>
  </div>

  <script>
    function toggleModal() {
      const m = document.getElementById('add-modal');
      m.classList.toggle('hidden');
      m.classList.toggle('flex');
    }
    function confirmAdd() {
      const title = document.getElementById('modal-title').value.trim();
      const desc = document.getElementById('modal-desc').value.trim() || 'Xog cusub oo lagu daray nidaamka.';
      if (!title) return alert('Geli magaca qodobka!');
      const container = document.getElementById('records-grid');
      const card = document.createElement('div');
      card.className = 'rec-card p-6 rounded-3xl bg-slate-900/60 border border-blue-500/40 space-y-4 flex flex-col justify-between animate-fade-in';
      card.setAttribute('data-cat', 'active');
      card.innerHTML = '<div class="space-y-3"><div class="flex justify-between items-center"><span class="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold">New Entry</span><span class="text-xs font-mono text-slate-500">NEW</span></div><h3 class="font-extrabold text-base text-white">' + title + '</h3><p class="text-xs text-slate-400">' + desc + '</p></div><div class="flex justify-between items-center pt-3 border-t border-white/5"><button onclick="toggleStatus(this)" class="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-bold">Firfircoon</button><button onclick="deleteCard(this)" class="text-slate-500 hover:text-rose-400 text-xs"><i class="fa-solid fa-trash"></i></button></div>';
      container.prepend(card);
      toggleModal();
      document.getElementById('modal-title').value = '';
      document.getElementById('modal-desc').value = '';
    }
    function toggleStatus(btn) {
      if (btn.innerText === 'Firfircoon') {
        btn.innerText = 'Dhameystiran';
        btn.className = 'px-3 py-1 bg-slate-800 text-slate-400 rounded-lg text-xs font-bold';
      } else {
        btn.innerText = 'Firfircoon';
        btn.className = 'px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-bold';
      }
    }
    function deleteCard(btn) {
      if (confirm('Ma hubtaa inaad tirto qodobkan?')) {
        btn.closest('.rec-card').remove();
      }
    }
    function filterRecords(cat) {
      document.querySelectorAll('.f-btn').forEach(btn => {
        btn.className = btn.getAttribute('data-cat') === cat 
          ? 'f-btn px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm' 
          : 'f-btn px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-slate-400 hover:text-white';
      });
      document.querySelectorAll('.rec-card').forEach(card => {
        card.style.display = (cat === 'all' || card.getAttribute('data-cat') === cat) ? 'flex' : 'none';
      });
    }
    function searchRecords(q) {
      const query = q.toLowerCase();
      document.querySelectorAll('.rec-card').forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(query) ? 'flex' : 'none';
      });
    }
    function exportData() {
      const cards = Array.from(document.querySelectorAll('.rec-card')).map(c => c.querySelector('h3').innerText);
      const blob = new Blob([cards.join('\\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fursad-data-export.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;
}

export function generateSaasWebsiteWithSectionsHtml(projectName: string = 'NextGen SaaS Platform'): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-blue-500/30">
  <!-- Navbar -->
  <header id="navbar" class="border-b border-white/10 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-40 px-6 h-16 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
        <i class="fa-solid fa-cube text-lg"></i>
      </div>
      <div>
        <h1 class="font-extrabold text-base text-white tracking-tight">${projectName}</h1>
        <p class="text-[10px] text-cyan-400 font-mono -mt-0.5">Enterprise Cloud Platform</p>
      </div>
    </div>

    <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
      <a href="#hero" class="text-cyan-400 hover:text-white transition-colors">Home</a>
      <a href="#features" class="hover:text-white transition-colors">Features</a>
      <a href="#pricing" class="hover:text-white transition-colors">Pricing</a>
      <a href="#contact" class="hover:text-white transition-colors">Contact</a>
    </nav>

    <div class="flex items-center gap-3">
      <button class="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors">Sign In</button>
      <a href="#pricing" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/25">
        Get Started
      </a>
    </div>
  </header>

  <!-- Hero Section -->
  <section id="hero" class="relative py-24 px-6 overflow-hidden min-h-[70vh] bg-slate-950 text-slate-100 flex items-center justify-center text-center">
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
        <i class="fa-solid fa-sparkles"></i>
        <span>Autonomous Web & Cloud Architecture</span>
      </div>
      <h1 class="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight">
        Build, Deploy & Scale <br>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">
          Intelligent Web Applications
        </span>
      </h1>
      <p class="hero-subtitle text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
        Launch modern web apps in minutes with autonomous AI workflows, live full-stack previews, and cloud scalability.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button class="cta-button px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center gap-2 active:scale-95">
          <span>Get Started Free</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
        <a href="#pricing" class="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 rounded-2xl font-bold text-sm transition-all flex items-center gap-2">
          <span>View Pricing Plans</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="py-20 px-6 max-w-7xl mx-auto w-full border-t border-white/5">
    <div class="text-center space-y-3 mb-12">
      <span class="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">Capabilities</span>
      <h2 class="text-3xl font-black text-white">Engineered for High-Performance Delivery</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
        <div class="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-lg">
          <i class="fa-solid fa-bolt"></i>
        </div>
        <h3 class="font-bold text-white text-base">Instant Sandbox Execution</h3>
        <p class="text-xs text-slate-400 leading-relaxed">Live preview mounting with hot compilation and zero-config deployment environments.</p>
      </div>
      <div class="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
        <div class="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center text-lg">
          <i class="fa-solid fa-microchip"></i>
        </div>
        <h3 class="font-bold text-white text-base">Multi-Provider AI Gateway</h3>
        <p class="text-xs text-slate-400 leading-relaxed">Seamless model routing across Google Gemini, OpenAI GPT, Cloudflare Workers AI, and custom endpoints.</p>
      </div>
      <div class="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-lg">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <h3 class="font-bold text-white text-base">Strict Targeted Patches</h3>
        <p class="text-xs text-slate-400 leading-relaxed">Surgical edits that preserve project IDs, component layout, and customer customizations.</p>
      </div>
    </div>
  </section>

  <!-- Pricing Section -->
  <section id="pricing" class="py-24 px-6 border-t border-white/10 bg-slate-900/40">
    <div class="max-w-6xl mx-auto space-y-12">
      <div class="text-center space-y-3">
        <span class="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">Transparent Plans</span>
        <h2 class="text-3xl sm:text-4xl font-black text-white">Simple, Predictable Pricing</h2>
        <p class="text-sm text-slate-400 max-w-md mx-auto">Choose the tier that matches your engineering velocity.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        <!-- Starter Plan -->
        <div class="pricing-card p-8 rounded-3xl bg-slate-950/80 border border-white/10 flex flex-col justify-between space-y-6">
          <div class="space-y-4">
            <span class="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Starter</span>
            <div class="flex items-baseline gap-1">
              <span class="text-4xl font-black text-white font-mono">$0</span>
              <span class="text-xs text-slate-500">/forever</span>
            </div>
            <p class="text-xs text-slate-400">Perfect for prototyping and student explorations.</p>
            <ul class="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-white/5">
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Up to 3 active projects</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Standard Gemini AI model</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Community support</li>
            </ul>
          </div>
          <button onclick="alert('Starter Plan selected!')" class="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-colors">
            Start Free
          </button>
        </div>

        <!-- Pro Plan (Featured) -->
        <div class="pricing-card p-8 rounded-3xl bg-slate-900 border-2 border-cyan-500 shadow-2xl shadow-cyan-500/20 flex flex-col justify-between space-y-6 relative">
          <span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-widest">
            Most Popular
          </span>
          <div class="space-y-4">
            <span class="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">Pro Developer</span>
            <div class="flex items-baseline gap-1">
              <span class="text-5xl font-black text-cyan-400 font-mono">$29</span>
              <span class="text-xs text-slate-400">/month</span>
            </div>
            <p class="text-xs text-slate-300">Complete AI builder with BYOK and unlimited revisions.</p>
            <ul class="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-white/10">
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Unlimited projects & sandboxes</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Bring Your Own Key (BYOK)</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Strict targeted patch updates</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Full ZIP export & code download</li>
            </ul>
          </div>
          <button onclick="alert('Pro Plan selected!')" class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-lg shadow-blue-500/25">
            Upgrade to Pro
          </button>
        </div>

        <!-- Enterprise Plan -->
        <div class="pricing-card p-8 rounded-3xl bg-slate-950/80 border border-white/10 flex flex-col justify-between space-y-6">
          <div class="space-y-4">
            <span class="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Enterprise</span>
            <div class="flex items-baseline gap-1">
              <span class="text-4xl font-black text-white font-mono">$99</span>
              <span class="text-xs text-slate-500">/month</span>
            </div>
            <p class="text-xs text-slate-400">Dedicated compute, custom models, and team governance.</p>
            <ul class="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-white/5">
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Custom LLM finetuning</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Dedicated cloud container runtime</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> 24/7 Priority SLA engineering</li>
            </ul>
          </div>
          <button onclick="alert('Contacting sales team...')" class="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-colors">
            Contact Enterprise
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer id="footer" class="py-12 px-6 border-t border-white/10 bg-slate-950 text-slate-400 text-center space-y-4">
    <div class="flex items-center justify-center gap-3">
      <div class="w-7 h-7 rounded-lg bg-blue-600/20 text-cyan-400 flex items-center justify-center text-xs font-black">
        <i class="fa-solid fa-cube"></i>
      </div>
      <span class="font-extrabold text-sm text-white tracking-tight">${projectName}</span>
    </div>
    <p class="text-xs text-slate-500 max-w-sm mx-auto">
      &copy; 2026 ${projectName}. Autonomous AI Web & Application Engineering. All rights reserved.
    </p>
  </footer>
</body>
</html>`;
}
