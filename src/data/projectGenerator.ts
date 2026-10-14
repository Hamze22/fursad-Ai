import { ProjectState, PersonaType, LanguageType } from '../types.ts';
import { 
  generateGeminiAssistantHtml, 
  generateRestaurantHtml, 
  generateSchoolPortalHtml, 
  generateDynamicOperationsHtml,
  generateSaasWebsiteWithSectionsHtml 
} from './domainTemplates.ts';

export function generateProjectFromPrompt(
  prompt: string,
  persona: PersonaType = 'developer',
  language: LanguageType = 'so'
): ProjectState {
  const isSo = language === 'so';
  const promptLower = prompt.toLowerCase();

  const isGemini = promptLower.includes('gemini') || 
    promptLower.includes('assistant') || 
    promptLower.includes('caawiye') || 
    promptLower.includes('chat') || 
    promptLower.includes('bot') || 
    promptLower.includes('llm') || 
    promptLower.includes('hadn wax ka codsado') ||
    promptLower.includes('wax ka codsado') ||
    promptLower.includes('ai builder') ||
    promptLower.includes('ai app');

  const isSaasLanding = !isGemini && (
    promptLower.includes('navbar') ||
    promptLower.includes('pricing') ||
    promptLower.includes('hero section') ||
    promptLower.includes('saas') ||
    promptLower.includes('landing') ||
    promptLower.includes('custom styling') ||
    promptLower.includes('website with a navbar')
  );

  const isRestaurant = !isGemini && !isSaasLanding && (promptLower.includes('restaurant') || promptLower.includes('cunto') || promptLower.includes('maqaayad') || promptLower.includes('cafe') || promptLower.includes('food') || promptLower.includes('dalab'));
  const isSchool = !isGemini && !isSaasLanding && !isRestaurant && (promptLower.includes('school') || promptLower.includes('dugsi') || promptLower.includes('arday') || promptLower.includes('academy') || promptLower.includes('jaamacad'));
  const isBookShop = !isGemini && !isSaasLanding && !isRestaurant && !isSchool && (promptLower.includes('book') || promptLower.includes('kutub') || promptLower.includes('maktabad') || promptLower.includes('reading') || promptLower.includes('library') || promptLower.includes('author'));
  const isEcommerce = !isGemini && !isSaasLanding && !isRestaurant && !isSchool && !isBookShop && (promptLower.includes('ecommerce') || promptLower.includes('shop') || promptLower.includes('clothing') || promptLower.includes('dukaan') || promptLower.includes('dhar'));
  const isPortfolio = !isGemini && !isSaasLanding && !isRestaurant && !isSchool && !isBookShop && !isEcommerce && (promptLower.includes('portfolio') || promptLower.includes('resume') || promptLower.includes('cv'));

  let projectName = 'Real Web Application';
  let category = 'Web Application';

  if (isGemini) {
    projectName = 'Gemini 2.5 Flash • FURSAD AI Assistant';
    category = 'Artificial Intelligence Assistant';
  } else if (isSaasLanding) {
    projectName = 'NovaCloud • NextGen Web Platform';
    category = 'SaaS Web Application';
  } else if (isRestaurant) {
    projectName = 'Somali Delights • Restaurant & Food Order';
    category = 'Food & Hospitality';
  } else if (isSchool) {
    projectName = 'Iftin Academy • Portal-ka Ardayda';
    category = 'Education & School Management';
  } else if (isBookShop) {
    projectName = isSo ? 'Maktabadda Iftin & Kutubta Casriga ah' : 'Iftin Modern Book House & Store';
    category = 'E-Commerce Books';
  } else if (isEcommerce) {
    projectName = isSo ? 'Dukaanka Dharka Hiddaha & Dhaqanka' : 'Somali Heritage Clothing Boutique';
    category = 'Fashion Boutique';
  } else if (isPortfolio) {
    projectName = isSo ? 'Portfolio-ga Developer-ka' : 'Elite Developer Portfolio';
    category = 'Personal Portfolio';
  } else {
    projectName = prompt.length > 30 ? prompt.slice(0, 30) + '...' : prompt;
  }

  // Generate Interactive Live HTML Preview
  let previewHtml = '';

  if (isGemini) {
    previewHtml = generateGeminiAssistantHtml(projectName);
  } else if (isSaasLanding) {
    previewHtml = generateSaasWebsiteWithSectionsHtml(projectName);
  } else if (isRestaurant) {
    previewHtml = generateRestaurantHtml(projectName);
  } else if (isSchool) {
    previewHtml = generateSchoolPortalHtml(projectName);
  } else if (isBookShop) {
    previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-serif-book { font-family: 'Playfair Display', serif; }
  </style>
</head>
<body class="bg-[#090d16] text-slate-100 min-h-screen flex flex-col selection:bg-amber-500/30">
  <!-- Top Banner -->
  <div class="bg-gradient-to-r from-amber-700 via-orange-800 to-amber-900 text-amber-100 text-xs py-2 px-4 text-center font-semibold tracking-wide border-b border-amber-600/30">
    📚 Maktabadda Iftin • Akhrisku Waa Iftiinka Nolosha • Gaarsiin Bilaash ah (Free Shipping over $35)
  </div>

  <!-- Header -->
  <header class="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
          <i class="fa-solid fa-book-open text-lg"></i>
        </div>
        <div>
          <span class="font-extrabold text-lg text-white tracking-tight">IFTIN BOOKS</span>
          <span class="text-[10px] text-amber-400 block -mt-1 font-mono uppercase tracking-widest">Somali & Global Classics</span>
        </div>
      </div>

      <!-- Search & Nav -->
      <div class="hidden md:flex items-center gap-6">
        <div class="relative w-72">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-xs text-slate-400"></i>
          <input 
            type="text" 
            id="book-search" 
            onkeyup="searchBooks()" 
            placeholder="Raadi buug, qoraa, ama mawduuc..." 
            class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-amber-500 transition-all"
          />
        </div>
        <nav class="flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="#home" class="text-amber-400 hover:text-amber-300 transition-colors">Hoyga</a>
          <a href="#bestsellers" class="hover:text-white transition-colors">Bestsellers</a>
          <a href="#catalog" class="hover:text-white transition-colors">Katalog-ka</a>
          <a href="#about" class="hover:text-white transition-colors">Ku Saabsan</a>
        </nav>
      </div>

      <!-- Cart Button -->
      <div class="flex items-center gap-4">
        <button onclick="toggleCart()" class="relative p-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-white transition-all flex items-center gap-2">
          <i class="fa-solid fa-bag-shopping text-amber-400"></i>
          <span class="text-xs font-bold hidden sm:inline">Dambiisha</span>
          <span id="cart-badge" class="bg-amber-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">2</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section id="home" class="relative py-16 px-6 overflow-hidden border-b border-slate-900 bg-gradient-to-b from-slate-900/50 via-[#0d1322] to-transparent">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7 space-y-6">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <i class="fa-solid fa-feather"></i>
          Suugaanta, Fikirka & Casriga 2026
        </div>
        <h1 class="text-4xl sm:text-6xl font-black text-white leading-[1.1] tracking-tight font-serif-book">
          Dheeh Aqoonta, <br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
            Kutubta Asalka ah & Classic
          </span>
        </h1>
        <p class="text-slate-400 text-base leading-relaxed max-w-xl">
          Hel buugaagta ugu caansan suugaanta Soomaaliyeed, gabayada Hadraawi, sheekooyinka taariikhiga ah, iyo kutubta sayniska, tignoolajiyada iyo ganacsiga oo luuqado kala duwan ku qoran.
        </p>
        <div class="flex flex-wrap gap-4 pt-2">
          <a href="#catalog" class="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 rounded-2xl font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2">
            <span>Daawo Buugaagta</span>
            <i class="fa-solid fa-arrow-right"></i>
          </a>
          <button onclick="filterCategory('Somali Classics')" class="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-2xl font-bold text-sm transition-all flex items-center gap-2">
            <i class="fa-solid fa-bookmark text-amber-400"></i>
            <span>Suugaanta Soomaaliyeed</span>
          </button>
        </div>
      </div>

      <!-- Featured Spotlight Card -->
      <div class="lg:col-span-5 relative">
        <div class="absolute inset-0 bg-amber-600/15 rounded-3xl blur-3xl"></div>
        <div class="relative bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <span class="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">★ Buugga Bisha (Featured)</span>
            <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">Bestseller</span>
          </div>
          <div class="flex gap-4">
            <div class="w-24 h-36 rounded-xl bg-gradient-to-b from-amber-700 via-orange-900 to-slate-950 p-2.5 flex flex-col justify-between border border-amber-500/40 shadow-xl shrink-0">
              <span class="text-[8px] text-amber-300 font-bold uppercase">MURTI & MAAHMAAH</span>
              <p class="text-[11px] font-black text-white font-serif-book leading-tight">Aasaaska Suugaanta</p>
              <span class="text-[8px] text-slate-300">Hadraawi</span>
            </div>
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <h4 class="font-extrabold text-white text-base font-serif-book">Aasaaska Suugaanta Soomaaliyeed</h4>
                <p class="text-xs text-slate-400 mt-1">Xulashada maansada, miisaanka maansada iyo falsafadda suugaanta Soomaaliyeed.</p>
                <div class="flex items-center gap-1 text-amber-400 text-xs mt-2">
                  <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                  <span class="text-slate-400 text-[10px] ml-1">(142 reviews)</span>
                </div>
              </div>
              <div class="flex items-center justify-between mt-3">
                <span class="text-xl font-black text-amber-400 font-mono">$18.99</span>
                <button onclick="addToCart('Aasaaska Suugaanta', 18.99)" class="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all">
                  + Ku dar Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Product Catalog -->
  <section id="catalog" class="py-16 px-6 max-w-7xl mx-auto w-full flex-1">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl sm:text-3xl font-black text-white font-serif-book">Katalog-ka Buugaagta (Book Catalog)</h2>
        <p class="text-xs sm:text-sm text-slate-400 mt-1">Dooro qaybta aad doonayso ama raadi qoraaga aad xiisaynayso</p>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex flex-wrap gap-2">
        <button onclick="filterCategory('All')" class="cat-btn px-3.5 py-1.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold">Dhammaan</button>
        <button onclick="filterCategory('Somali Classics')" class="cat-btn px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold">Suugaanta</button>
        <button onclick="filterCategory('Tech & AI')" class="cat-btn px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold">Tech & AI</button>
        <button onclick="filterCategory('World Literature')" class="cat-btn px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold">World Classics</button>
      </div>
    </div>

    <!-- Book Grid -->
    <div id="books-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Book 1 -->
      <div class="book-card bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 transition-all group flex flex-col justify-between" data-category="Somali Classics" data-title="aasaaska suugaanta hadraawi">
        <div class="flex gap-4">
          <div class="w-24 h-36 rounded-2xl bg-gradient-to-b from-amber-700 via-orange-950 to-slate-950 p-2.5 flex flex-col justify-between border border-white/10 shadow-lg shrink-0 group-hover:scale-105 transition-transform">
            <span class="text-[8px] text-amber-300 font-bold uppercase">XULKA HADRAAWI</span>
            <p class="text-xs font-black text-white font-serif-book">Aasaaska Suugaanta</p>
            <span class="text-[8px] text-slate-400">Maanso & Murti</span>
          </div>
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <span class="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold">Bestseller</span>
              <h3 class="font-bold text-white text-sm mt-1">Aasaaska Suugaanta</h3>
              <p class="text-xs text-slate-400">Maxamed I. Hadraawi</p>
              <div class="flex items-center gap-1 text-amber-400 text-xs mt-1.5">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
              </div>
            </div>
            <div class="flex items-center justify-between pt-2">
              <span class="text-lg font-black text-amber-400 font-mono">$18.99</span>
              <button onclick="addToCart('Aasaaska Suugaanta', 18.99)" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all active:scale-95">
                + Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Book 2 -->
      <div class="book-card bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 transition-all group flex flex-col justify-between" data-category="Somali Classics" data-title="ignorance is the enemy of love faarax cawl">
        <div class="flex gap-4">
          <div class="w-24 h-36 rounded-2xl bg-gradient-to-b from-blue-700 via-indigo-950 to-slate-950 p-2.5 flex flex-col justify-between border border-white/10 shadow-lg shrink-0 group-hover:scale-105 transition-transform">
            <span class="text-[8px] text-blue-300 font-bold uppercase">CLASSIC NOVEL</span>
            <p class="text-xs font-black text-white font-serif-book">Aqoondarro Waa Nacab</p>
            <span class="text-[8px] text-slate-400">Faarax M.J. Cawl</span>
          </div>
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <span class="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold">Historic</span>
              <h3 class="font-bold text-white text-sm mt-1">Ignorance is Enemy of Love</h3>
              <p class="text-xs text-slate-400">Faarax M.J. Cawl</p>
              <div class="flex items-center gap-1 text-amber-400 text-xs mt-1.5">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i>
              </div>
            </div>
            <div class="flex items-center justify-between pt-2">
              <span class="text-lg font-black text-amber-400 font-mono">$14.50</span>
              <button onclick="addToCart('Ignorance is Enemy of Love', 14.50)" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all active:scale-95">
                + Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Book 3 -->
      <div class="book-card bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 transition-all group flex flex-col justify-between" data-category="Tech & AI" data-title="vibe coding ai modern applications builder">
        <div class="flex gap-4">
          <div class="w-24 h-36 rounded-2xl bg-gradient-to-b from-cyan-700 via-blue-950 to-slate-950 p-2.5 flex flex-col justify-between border border-white/10 shadow-lg shrink-0 group-hover:scale-105 transition-transform">
            <span class="text-[8px] text-cyan-300 font-bold uppercase">AI ARCHITECTURE</span>
            <p class="text-xs font-black text-white font-serif-book">Vibe Coding Mastery</p>
            <span class="text-[8px] text-slate-400">Full-Stack AI</span>
          </div>
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <span class="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold">New Release</span>
              <h3 class="font-bold text-white text-sm mt-1">Designing Modern AI Apps</h3>
              <p class="text-xs text-slate-400">FURSAD AI Engineering Lab</p>
              <div class="flex items-center gap-1 text-amber-400 text-xs mt-1.5">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
              </div>
            </div>
            <div class="flex items-center justify-between pt-2">
              <span class="text-lg font-black text-amber-400 font-mono">$29.99</span>
              <button onclick="addToCart('Designing Modern AI Apps', 29.99)" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all active:scale-95">
                + Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Book 4 -->
      <div class="book-card bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 transition-all group flex flex-col justify-between" data-category="Somali Classics" data-title="murti maahmaahyo shire jaamac axmed">
        <div class="flex gap-4">
          <div class="w-24 h-36 rounded-2xl bg-gradient-to-b from-emerald-800 via-teal-950 to-slate-950 p-2.5 flex flex-col justify-between border border-white/10 shadow-lg shrink-0 group-hover:scale-105 transition-transform">
            <span class="text-[8px] text-emerald-300 font-bold uppercase">MURTI & MAAHMAAH</span>
            <p class="text-xs font-black text-white font-serif-book">Hiddaha & Murtida</p>
            <span class="text-[8px] text-slate-400">Shire Jaamac</span>
          </div>
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Heritage</span>
              <h3 class="font-bold text-white text-sm mt-1">Murti & Maahmaahyo</h3>
              <p class="text-xs text-slate-400">Shire Jaamac Axmed</p>
              <div class="flex items-center gap-1 text-amber-400 text-xs mt-1.5">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
              </div>
            </div>
            <div class="flex items-center justify-between pt-2">
              <span class="text-lg font-black text-amber-400 font-mono">$16.00</span>
              <button onclick="addToCart('Murti & Maahmaahyo', 16.00)" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all active:scale-95">
                + Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Book 5 -->
      <div class="book-card bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 transition-all group flex flex-col justify-between" data-category="Tech & AI" data-title="clean code agile martin robert">
        <div class="flex gap-4">
          <div class="w-24 h-36 rounded-2xl bg-gradient-to-b from-purple-800 via-indigo-950 to-slate-950 p-2.5 flex flex-col justify-between border border-white/10 shadow-lg shrink-0 group-hover:scale-105 transition-transform">
            <span class="text-[8px] text-purple-300 font-bold uppercase">SOFTWARE CRAFT</span>
            <p class="text-xs font-black text-white font-serif-book">Clean Code</p>
            <span class="text-[8px] text-slate-400">Robert C. Martin</span>
          </div>
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <span class="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold">Essential</span>
              <h3 class="font-bold text-white text-sm mt-1">Clean Code Architecture</h3>
              <p class="text-xs text-slate-400">Robert C. Martin</p>
              <div class="flex items-center gap-1 text-amber-400 text-xs mt-1.5">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
              </div>
            </div>
            <div class="flex items-center justify-between pt-2">
              <span class="text-lg font-black text-amber-400 font-mono">$32.00</span>
              <button onclick="addToCart('Clean Code Architecture', 32.00)" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all active:scale-95">
                + Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Book 6 -->
      <div class="book-card bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 transition-all group flex flex-col justify-between" data-category="World Literature" data-title="the great gatsby fitzgerald world classics">
        <div class="flex gap-4">
          <div class="w-24 h-36 rounded-2xl bg-gradient-to-b from-amber-600 via-yellow-950 to-slate-950 p-2.5 flex flex-col justify-between border border-white/10 shadow-lg shrink-0 group-hover:scale-105 transition-transform">
            <span class="text-[8px] text-yellow-300 font-bold uppercase">WORLD NOVEL</span>
            <p class="text-xs font-black text-white font-serif-book">The Great Gatsby</p>
            <span class="text-[8px] text-slate-400">F. Scott Fitzgerald</span>
          </div>
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <span class="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-bold">Classic</span>
              <h3 class="font-bold text-white text-sm mt-1">The Great Gatsby</h3>
              <p class="text-xs text-slate-400">F. Scott Fitzgerald</p>
              <div class="flex items-center gap-1 text-amber-400 text-xs mt-1.5">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i>
              </div>
            </div>
            <div class="flex items-center justify-between pt-2">
              <span class="text-lg font-black text-amber-400 font-mono">$12.99</span>
              <button onclick="addToCart('The Great Gatsby', 12.99)" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all active:scale-95">
                + Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Slide-out Cart Drawer -->
  <div id="cart-drawer" class="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-950 border-l border-slate-800 p-6 z-50 transform translate-x-full transition-transform duration-300 flex flex-col justify-between shadow-2xl">
    <div>
      <div class="flex items-center justify-between pb-4 border-b border-slate-800">
        <h3 class="font-bold text-white text-base flex items-center gap-2">
          <i class="fa-solid fa-bag-shopping text-amber-400"></i>
          Dambiishaada (Cart)
        </h3>
        <button onclick="toggleCart()" class="text-slate-400 hover:text-white text-lg">✕</button>
      </div>
      <div id="cart-items" class="py-4 space-y-3 overflow-y-auto max-h-[60vh]">
        <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
          <div>
            <p class="text-xs font-bold text-white">Aasaaska Suugaanta</p>
            <p class="text-[10px] text-slate-500">1x Qty • Maxamed Hadraawi</p>
          </div>
          <span class="text-xs font-mono font-bold text-amber-400">$18.99</span>
        </div>
        <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
          <div>
            <p class="text-xs font-bold text-white">Ignorance is Enemy of Love</p>
            <p class="text-[10px] text-slate-500">1x Qty • Faarax Cawl</p>
          </div>
          <span class="text-xs font-mono font-bold text-amber-400">$14.50</span>
        </div>
      </div>
    </div>

    <div class="pt-4 border-t border-slate-800 space-y-3">
      <div class="flex justify-between items-center">
        <span class="text-xs text-slate-400">Wadarta Guud:</span>
        <span id="cart-total" class="text-xl font-black text-amber-400 font-mono">$33.49</span>
      </div>
      <button onclick="checkout()" class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all">
        Dalbo Buugaagta (Checkout)
      </button>
    </div>
  </div>

  <!-- Footer -->
  <footer class="border-t border-slate-900 bg-slate-950 py-10 px-6 text-center text-xs text-slate-500">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-book-open text-amber-400"></i>
        <span class="font-bold text-slate-300">Iftin Modern Book House</span>
      </div>
      <p>© 2026 Iftin Books. Built with FURSAD AI engine.</p>
    </div>
  </footer>

  <script>
    let cartCount = 2;
    let total = 33.49;

    function toggleCart() {
      const drawer = document.getElementById('cart-drawer');
      drawer.classList.toggle('translate-x-full');
    }

    function addToCart(title, price) {
      cartCount++;
      total += price;
      document.getElementById('cart-badge').innerText = cartCount;
      document.getElementById('cart-total').innerText = '$' + total.toFixed(2);

      const items = document.getElementById('cart-items');
      const itemEl = document.createElement('div');
      itemEl.className = 'p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center';
      itemEl.innerHTML = '<div><p class="text-xs font-bold text-white">' + title + '</p><p class="text-[10px] text-slate-500">1x Qty</p></div><span class="text-xs font-mono font-bold text-amber-400">$' + price.toFixed(2) + '</span>';
      items.appendChild(itemEl);

      const toast = document.createElement('div');
      toast.className = 'fixed bottom-6 right-6 bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow-2xl z-50';
      toast.innerText = 'Ku daray dambiisha: ' + title;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);
    }

    function filterCategory(cat) {
      const cards = document.querySelectorAll('.book-card');
      cards.forEach(card => {
        if (cat === 'All' || card.getAttribute('data-category') === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
      document.querySelectorAll('.cat-btn').forEach(btn => {
        if (btn.innerText.includes(cat) || (cat === 'All' && btn.innerText.includes('Dhammaan'))) {
          btn.className = 'cat-btn px-3.5 py-1.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold';
        } else {
          btn.className = 'cat-btn px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold';
        }
      });
    }

    function searchBooks() {
      const query = document.getElementById('book-search').value.toLowerCase();
      const cards = document.querySelectorAll('.book-card');
      cards.forEach(card => {
        const title = card.getAttribute('data-title') || '';
        if (title.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    function checkout() {
      alert('Mahadsanid! Dalabkaaga buugaagta si guul leh ayaa loo qabtay.');
      toggleCart();
    }
  </script>
</body>
</html>`;
  } else if (isEcommerce) {
    previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-blue-500/30">
  <!-- Top Notification -->
  <div class="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700 text-white text-xs py-2 px-4 text-center font-semibold tracking-wide">
    ✨ Dhaqanka & Hiddaha Soomaaliyeed • Gaarsiin Bilaash ah (Free Shipping over $50) • Dalbo Hada!
  </div>

  <!-- Navigation -->
  <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <i class="fa-solid fa-shirt text-lg"></i>
        </div>
        <div>
          <span class="font-extrabold text-lg text-white tracking-tight">HIDO & DHAQAN</span>
          <span class="text-[10px] text-blue-400 block -mt-1 font-mono uppercase tracking-widest">Boutique & Tailoring</span>
        </div>
      </div>

      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <a href="#home" class="text-blue-400 hover:text-blue-300 transition-colors">Hoyga</a>
        <a href="#catalog" class="hover:text-white transition-colors">Katalog-ka Dharka</a>
        <a href="#featured" class="hover:text-white transition-colors">Kuwa Cusub</a>
        <a href="#admin" class="hover:text-white transition-colors">Admin Dashboard</a>
      </nav>

      <div class="flex items-center gap-4">
        <button onclick="toggleCart()" class="relative p-2.5 bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-slate-700 text-white transition-all">
          <i class="fa-solid fa-bag-shopping"></i>
          <span id="cart-badge" class="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950">2</span>
        </button>
        <button class="hidden sm:inline-flex px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/30">
          Gal Akoonka
        </button>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section id="home" class="relative py-16 px-6 overflow-hidden border-b border-slate-900 bg-gradient-to-b from-slate-900/50 to-transparent">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div class="space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest">
          <i class="fa-solid fa-sparkles"></i>
          Xulashada Dharka Soomaaliyeed 2026
        </div>
        <h1 class="text-4xl sm:text-6xl font-black text-white leading-[1.1] tracking-tight">
          Dharka Hiddaha & Dhaqanka <br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">Ee Ugu Casrisan</span>
        </h1>
        <p class="text-slate-400 text-base leading-relaxed max-w-xl">
          Ka hel diracyo xariir ah, guntiinooyin hido leh, macawiis tayo sare leh, koofiyado baati iyo agabka aroosyada oo dhan. Dharkaaga ku hel tayo iyo qiimo jaban.
        </p>
        <div class="flex flex-wrap gap-4 pt-2">
          <a href="#catalog" class="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center gap-2">
            <span>Daawo Alaabta</span>
            <i class="fa-solid fa-arrow-right"></i>
          </a>
          <button onclick="toggleAdmin()" class="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-2xl font-bold text-sm transition-all flex items-center gap-2">
            <i class="fa-solid fa-chart-line text-blue-400"></i>
            <span>Admin Demo</span>
          </button>
        </div>
      </div>

      <!-- Hero Visual -->
      <div class="relative">
        <div class="absolute inset-0 bg-blue-600/10 rounded-3xl blur-3xl"></div>
        <div class="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-4 border-b border-slate-800">
            <div class="flex items-center gap-3">
              <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Live Orders Stream</span>
            </div>
            <span class="text-xs font-mono text-blue-400">Muqdisho & Hargeysa</span>
          </div>
          <div class="space-y-3">
            <div class="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p class="text-xs font-bold text-white">Dirac Baati Xariir ah</p>
                <p class="text-[10px] text-slate-500">Amina H. • 2 minutes ago</p>
              </div>
              <span class="text-xs font-black text-emerald-400 font-mono">$45.00</span>
            </div>
            <div class="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p class="text-xs font-bold text-white">Guntiino Hiddaha ah (Full Set)</p>
                <p class="text-[10px] text-slate-500">Sahra K. • 6 minutes ago</p>
              </div>
              <span class="text-xs font-black text-emerald-400 font-mono">$80.00</span>
            </div>
            <div class="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p class="text-xs font-bold text-white">Macawiis Alindi & Koofi</p>
                <p class="text-[10px] text-slate-500">Jaamac M. • 12 minutes ago</p>
              </div>
              <span class="text-xs font-black text-emerald-400 font-mono">$38.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Product Catalog -->
  <section id="catalog" class="py-16 px-6 max-w-7xl mx-auto w-full flex-1">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
      <div>
        <h2 class="text-2xl sm:text-3xl font-black text-white">Katalog-ka Alaabta (Featured Collection)</h2>
        <p class="text-xs sm:text-sm text-slate-400 mt-1">Dooro nooca dharka aad xiisaynayso oo ku dar dambiisha (Cart)</p>
      </div>
      <!-- Filter Badges -->
      <div class="flex flex-wrap gap-2">
        <button class="px-3.5 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold">Dhammaan</button>
        <button class="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold">Dirac</button>
        <button class="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold">Guntiino</button>
        <button class="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold">Macawiis</button>
      </div>
    </div>

    <!-- Product Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Item 1 -->
      <div class="bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 rounded-3xl p-5 transition-all group flex flex-col justify-between">
        <div class="space-y-4">
          <div class="h-48 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 border border-slate-800 flex items-center justify-center relative overflow-hidden">
             <i class="fa-solid fa-vest-patches text-6xl text-blue-500/40 group-hover:scale-110 transition-transform"></i>
             <span class="absolute top-3 left-3 bg-blue-600 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white">Aroos</span>
          </div>
          <div>
            <h3 class="font-bold text-lg text-white">Dirac Shiikhi ah (Xariir Pure)</h3>
            <p class="text-xs text-slate-400 mt-1">Dirac tayo sarre leh oo xardhan oo ku habboon munaasabadaha iyo aroosyada.</p>
          </div>
        </div>
        <div class="flex items-center justify-between pt-6 mt-4 border-t border-slate-800">
          <div>
            <span class="text-lg font-black text-white font-mono">$65.00</span>
            <span class="text-[10px] text-slate-500 block">Stock: 14 pcs</span>
          </div>
          <button onclick="addToCart('Dirac Shiikhi ah', 65)" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95">
            <i class="fa-solid fa-plus"></i> Ku dar Cart
          </button>
        </div>
      </div>

      <!-- Item 2 -->
      <div class="bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 rounded-3xl p-5 transition-all group flex flex-col justify-between">
        <div class="space-y-4">
          <div class="h-48 rounded-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950 border border-slate-800 flex items-center justify-center relative overflow-hidden">
             <i class="fa-solid fa-person-dress text-6xl text-cyan-500/40 group-hover:scale-110 transition-transform"></i>
             <span class="absolute top-3 left-3 bg-indigo-600 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white">Hido</span>
          </div>
          <div>
            <h3 class="font-bold text-lg text-white">Guntiino Hiddaha & Garbasaar</h3>
            <p class="text-xs text-slate-400 mt-1">Guntiino dhaqan oo xariir ah oo leh garbasaar midabkiisu qurux badan yahay.</p>
          </div>
        </div>
        <div class="flex items-center justify-between pt-6 mt-4 border-t border-slate-800">
          <div>
            <span class="text-lg font-black text-white font-mono">$85.00</span>
            <span class="text-[10px] text-slate-500 block">Stock: 8 pcs</span>
          </div>
          <button onclick="addToCart('Guntiino Hiddaha', 85)" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95">
            <i class="fa-solid fa-plus"></i> Ku dar Cart
          </button>
        </div>
      </div>

      <!-- Item 3 -->
      <div class="bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 rounded-3xl p-5 transition-all group flex flex-col justify-between">
        <div class="space-y-4">
          <div class="h-48 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 border border-slate-800 flex items-center justify-center relative overflow-hidden">
             <i class="fa-solid fa-shirt text-6xl text-indigo-500/40 group-hover:scale-110 transition-transform"></i>
             <span class="absolute top-3 left-3 bg-emerald-600 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white">Ragga</span>
          </div>
          <div>
            <h3 class="font-bold text-lg text-white">Macawiis Alindi Asal ah & Koofi</h3>
            <p class="text-xs text-slate-400 mt-1">Macawiis cudbi ah oo gacanta lagu tolay, jilicsan oo aan midabku ka dhicin.</p>
          </div>
        </div>
        <div class="flex items-center justify-between pt-6 mt-4 border-t border-slate-800">
          <div>
            <span class="text-lg font-black text-white font-mono">$35.00</span>
            <span class="text-[10px] text-slate-500 block">Stock: 22 pcs</span>
          </div>
          <button onclick="addToCart('Macawiis Alindi', 35)" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95">
            <i class="fa-solid fa-plus"></i> Ku dar Cart
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Admin Overlay Panel (Toggleable) -->
  <div id="admin-panel" class="hidden bg-slate-900 border-t border-blue-500/30 p-8">
     <div class="max-w-7xl mx-auto space-y-6">
        <div class="flex items-center justify-between">
           <div class="flex items-center gap-3">
              <span class="w-3 h-3 rounded-full bg-blue-500"></span>
              <h3 class="text-lg font-bold text-white">Admin Metrics Dashboard</h3>
           </div>
           <button onclick="toggleAdmin()" class="text-xs text-slate-400 hover:text-white">Close Admin View ✕</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
           <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <p class="text-xs text-slate-500 uppercase tracking-wider">Total Sales Today</p>
              <h4 class="text-2xl font-black text-emerald-400 mt-1 font-mono">$2,480.00</h4>
           </div>
           <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <p class="text-xs text-slate-500 uppercase tracking-wider">Pending Orders</p>
              <h4 class="text-2xl font-black text-blue-400 mt-1 font-mono">18 Orders</h4>
           </div>
           <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <p class="text-xs text-slate-500 uppercase tracking-wider">Low Stock Items</p>
              <h4 class="text-2xl font-black text-amber-400 mt-1 font-mono">3 Items</h4>
           </div>
           <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <p class="text-xs text-slate-500 uppercase tracking-wider">Customers</p>
              <h4 class="text-2xl font-black text-cyan-400 mt-1 font-mono">420 Active</h4>
           </div>
        </div>
     </div>
  </div>

  <!-- Shopping Cart Flyout -->
  <div id="cart-drawer" class="fixed inset-y-0 right-0 w-80 bg-slate-900 border-l border-slate-800 shadow-2xl p-6 hidden flex flex-col z-50">
     <div class="flex items-center justify-between pb-4 border-b border-slate-800">
        <h3 class="font-bold text-white">Dambiishaada (Cart)</h3>
        <button onclick="toggleCart()" class="text-slate-400 hover:text-white">✕</button>
     </div>
     <div id="cart-items" class="flex-1 py-4 space-y-3 overflow-y-auto">
        <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
           <div>
             <p class="text-xs font-bold text-white">Dirac Shiikhi ah</p>
             <p class="text-[10px] text-slate-500">1x Qty</p>
           </div>
           <span class="text-xs font-mono font-bold text-blue-400">$65.00</span>
        </div>
        <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
           <div>
             <p class="text-xs font-bold text-white">Guntiino Hiddaha</p>
             <p class="text-[10px] text-slate-500">1x Qty</p>
           </div>
           <span class="text-xs font-mono font-bold text-blue-400">$85.00</span>
        </div>
     </div>
     <div class="pt-4 border-t border-slate-800 space-y-4">
        <div class="flex justify-between font-bold text-sm">
           <span>Wadarta (Total):</span>
           <span id="cart-total" class="font-mono text-emerald-400">$150.00</span>
        </div>
        <button onclick="checkout()" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30">
           Dhameystir Dalabka (Checkout)
        </button>
     </div>
  </div>

  <!-- Footer -->
  <footer class="border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-500 bg-slate-950">
     <p>© 2026 Hido & Dhaqan Clothing Co. Built with FURSAD AI Platform.</p>
  </footer>

  <script>
    let cartCount = 2;
    let total = 150;

    function toggleCart() {
      const drawer = document.getElementById('cart-drawer');
      drawer.classList.toggle('hidden');
      drawer.classList.toggle('flex');
    }

    function toggleAdmin() {
      const panel = document.getElementById('admin-panel');
      panel.classList.toggle('hidden');
    }

    function addToCart(title, price) {
      cartCount++;
      total += price;
      document.getElementById('cart-badge').innerText = cartCount;
      document.getElementById('cart-total').innerText = '$' + total.toFixed(2);
      
      const itemEl = document.createElement('div');
      itemEl.className = 'p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between animate-fade-in';
      itemEl.innerHTML = '<div><p class="text-xs font-bold text-white">' + title + '</p><p class="text-[10px] text-slate-500">1x Qty</p></div><span class="text-xs font-mono font-bold text-blue-400">$' + price.toFixed(2) + '</span>';
      document.getElementById('cart-items').appendChild(itemEl);

      const toast = document.createElement('div');
      toast.className = 'fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-2xl z-50 transition-all';
      toast.innerText = 'Ku daray dambiisha: ' + title;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);
    }

    function checkout() {
      alert('Dalabkaaga si guul leh ayaa loo qabtay! (Order placed successfully via FURSAD AI payment pipeline).');
      toggleCart();
    }
  </script>
</body>
</html>`;
  } else if (promptLower.includes('calc') || promptLower.includes('xisaab')) {
    // 4. REAL INTERACTIVE CALCULATOR
    projectName = 'Xisaabiye Casri ah (Smart Calculator)';
    category = 'Interactive Utility';
    previewHtml = `<!DOCTYPE html>
<html lang="so">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xisaabiye Casri ah - Smart Calculator</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .calc-font { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-[#020617] text-white min-h-screen flex flex-col items-center justify-center p-4 selection:bg-blue-500/30">
  <div class="max-w-md w-full bg-slate-900/80 border border-blue-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl space-y-6">
    <div class="flex items-center justify-between border-b border-white/10 pb-4">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/30">
          <i class="fa-solid fa-calculator"></i>
        </div>
        <div>
          <h1 class="font-extrabold text-sm text-white">Xisaabiye Casri ah</h1>
          <p class="text-[10px] font-mono text-cyan-400">Fursad AI • Precision Math</p>
        </div>
      </div>
      <button onclick="clearCalc()" class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-slate-400">Clear</button>
    </div>

    <!-- Display -->
    <div class="bg-slate-950/90 border border-white/10 rounded-2xl p-5 text-right space-y-1 shadow-inner">
      <div id="history-disp" class="text-xs font-mono text-slate-500 h-4 truncate"></div>
      <div id="main-disp" class="calc-font text-3xl sm:text-4xl font-black text-cyan-300 tracking-wider truncate">0</div>
    </div>

    <!-- Keypad -->
    <div class="grid grid-cols-4 gap-2.5 font-bold">
      <button onclick="clearCalc()" class="py-3.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20 active:scale-95 transition-all text-sm">C</button>
      <button onclick="backspace()" class="py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition-all text-sm"><i class="fa-solid fa-delete-left"></i></button>
      <button onclick="appendOp('%')" class="py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition-all text-sm">%</button>
      <button onclick="appendOp('/')" class="py-3.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 active:scale-95 transition-all text-lg">÷</button>

      <button onclick="appendNum('7')" class="py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all text-base">7</button>
      <button onclick="appendNum('8')" class="py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all text-base">8</button>
      <button onclick="appendNum('9')" class="py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all text-base">9</button>
      <button onclick="appendOp('*')" class="py-3.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 active:scale-95 transition-all text-lg">×</button>

      <button onclick="appendNum('4')" class="py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all text-base">4</button>
      <button onclick="appendNum('5')" class="py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all text-base">5</button>
      <button onclick="appendNum('6')" class="py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all text-base">6</button>
      <button onclick="appendOp('-')" class="py-3.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 active:scale-95 transition-all text-lg">−</button>

      <button onclick="appendNum('1')" class="py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all text-base">1</button>
      <button onclick="appendNum('2')" class="py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all text-base">2</button>
      <button onclick="appendNum('3')" class="py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all text-base">3</button>
      <button onclick="appendOp('+')" class="py-3.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 active:scale-95 transition-all text-lg">+</button>

      <button onclick="appendNum('0')" class="col-span-2 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all text-base">0</button>
      <button onclick="appendNum('.')" class="py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all text-base">.</button>
      <button onclick="calculate()" class="py-3.5 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all text-lg">=</button>
    </div>
  </div>

  <script>
    let current = '0';
    let history = '';
    const mainDisp = document.getElementById('main-disp');
    const histDisp = document.getElementById('history-disp');

    function updateDisplay() {
      mainDisp.innerText = current;
      histDisp.innerText = history;
    }

    function appendNum(num) {
      if (current === '0' && num !== '.') {
        current = num;
      } else {
        if (num === '.' && current.includes('.')) return;
        current += num;
      }
      updateDisplay();
    }

    function appendOp(op) {
      if (history && !isNaN(current)) {
        history += ' ' + current + ' ' + op;
      } else {
        history = current + ' ' + op;
      }
      current = '0';
      updateDisplay();
    }

    function clearCalc() {
      current = '0';
      history = '';
      updateDisplay();
    }

    function backspace() {
      if (current.length > 1) {
        current = current.slice(0, -1);
      } else {
        current = '0';
      }
      updateDisplay();
    }

    function calculate() {
      try {
        const fullExpr = history + ' ' + current;
        // Clean and safely calculate
        const sanitized = fullExpr.replace(/[^0-9+\\-*\\/%.]/g, '');
        const res = Function('return ' + sanitized)();
        history = fullExpr + ' =';
        current = String(Number.isInteger(res) ? res : Number(res.toFixed(6)));
      } catch (e) {
        current = 'Error';
      }
      updateDisplay();
    }
  </script>
</body>
</html>`;
  } else if (promptLower.includes('todo') || promptLower.includes('task') || promptLower.includes('shaqo')) {
    // 5. REAL INTERACTIVE TODO & TASK MANAGER
    projectName = 'Maamulaha Hawlaha (Task Manager)';
    category = 'Productivity Platform';
    previewHtml = `<!DOCTYPE html>
<html lang="so">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Maamulaha Hawlaha - Task Manager</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style> body { font-family: 'Plus Jakarta Sans', sans-serif; } </style>
</head>
<body class="bg-[#020617] text-white min-h-screen p-6 sm:p-12 selection:bg-blue-500/30">
  <div class="max-w-3xl mx-auto space-y-8">
    <div class="flex items-center justify-between border-b border-white/10 pb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
          <i class="fa-solid fa-list-check"></i>
        </div>
        <div>
          <h1 class="text-xl font-extrabold text-white">Maamulaha Hawlaha</h1>
          <p class="text-xs text-cyan-400 font-mono">Fursad AI Task Studio</p>
        </div>
      </div>
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/20 text-xs">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span id="task-counter" class="font-bold text-cyan-300">3 Tasks</span>
      </div>
    </div>

    <!-- Input Box -->
    <div class="flex gap-2">
      <input type="text" id="task-input" onkeydown="if(event.key==='Enter') addTask()" placeholder="Qor hawl cusub... (Add a new task)" class="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-all">
      <button onclick="addTask()" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2">
        <i class="fa-solid fa-plus"></i>
        <span>Kudar</span>
      </button>
    </div>

    <!-- Filter Buttons -->
    <div class="flex gap-2 text-xs font-bold">
      <button onclick="filterTasks('all')" class="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white" id="f-all">Dhammaan</button>
      <button onclick="filterTasks('active')" class="px-3.5 py-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white" id="f-act">Firfircoon</button>
      <button onclick="filterTasks('completed')" class="px-3.5 py-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white" id="f-comp">Dhamaaday</button>
    </div>

    <!-- Task List -->
    <div id="task-list" class="space-y-3">
      <div class="task-item p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between" data-completed="false">
        <div class="flex items-center gap-3">
          <input type="checkbox" onchange="toggleTask(this)" class="w-4 h-4 rounded accent-blue-600 cursor-pointer">
          <span class="text-sm font-medium text-slate-200">Diyaari qorshaha toddobaadka cusub</span>
        </div>
        <button onclick="deleteTask(this)" class="text-slate-600 hover:text-rose-400 p-1"><i class="fa-solid fa-trash-can"></i></button>
      </div>
      <div class="task-item p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between" data-completed="false">
        <div class="flex items-center gap-3">
          <input type="checkbox" onchange="toggleTask(this)" class="w-4 h-4 rounded accent-blue-600 cursor-pointer">
          <span class="text-sm font-medium text-slate-200">Dib-u-eegis ku samee koodhka Fursad AI</span>
        </div>
        <button onclick="deleteTask(this)" class="text-slate-600 hover:text-rose-400 p-1"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    </div>
  </div>

  <script>
    let filter = 'all';

    function updateCount() {
      const items = document.querySelectorAll('.task-item');
      document.getElementById('task-counter').innerText = items.length + ' Tasks';
    }

    function addTask() {
      const input = document.getElementById('task-input');
      const val = input.value.trim();
      if (!val) return;
      const list = document.getElementById('task-list');
      const div = document.createElement('div');
      div.className = 'task-item p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between animate-fade-in';
      div.setAttribute('data-completed', 'false');
      div.innerHTML = '<div class="flex items-center gap-3"><input type="checkbox" onchange="toggleTask(this)" class="w-4 h-4 rounded accent-blue-600 cursor-pointer"><span class="text-sm font-medium text-slate-200">' + val + '</span></div><button onclick="deleteTask(this)" class="text-slate-600 hover:text-rose-400 p-1"><i class="fa-solid fa-trash-can"></i></button>';
      list.prepend(div);
      input.value = '';
      updateCount();
    }

    function toggleTask(cb) {
      const item = cb.closest('.task-item');
      const span = item.querySelector('span');
      if (cb.checked) {
        item.setAttribute('data-completed', 'true');
        span.className = 'text-sm font-medium text-slate-500 line-through';
      } else {
        item.setAttribute('data-completed', 'false');
        span.className = 'text-sm font-medium text-slate-200';
      }
      applyFilter();
    }

    function deleteTask(btn) {
      btn.closest('.task-item').remove();
      updateCount();
    }

    function filterTasks(type) {
      filter = type;
      ['all', 'act', 'comp'].forEach(id => {
        const b = document.getElementById('f-' + id);
        b.className = 'px-3.5 py-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white';
      });
      const activeBtn = document.getElementById(type === 'all' ? 'f-all' : type === 'active' ? 'f-act' : 'f-comp');
      if (activeBtn) activeBtn.className = 'px-3.5 py-1.5 rounded-xl bg-blue-600 text-white';
      applyFilter();
    }

    function applyFilter() {
      document.querySelectorAll('.task-item').forEach(item => {
        const isComp = item.getAttribute('data-completed') === 'true';
        if (filter === 'all') item.style.display = 'flex';
        else if (filter === 'active') item.style.display = isComp ? 'none' : 'flex';
        else if (filter === 'completed') item.style.display = isComp ? 'flex' : 'none';
      });
    }
  </script>
</body>
</html>`;
  } else {
    // 6. RICH FULL-STACK DYNAMIC APPLICATION (Zero generic placeholder text!)
    previewHtml = generateDynamicOperationsHtml(projectName, prompt);
  }

  const projectId = `proj-${Date.now()}`;

  return {
    id: projectId,
    _id: projectId,
    userId: 'guest',
    name: projectName,
    description: prompt,
    version: 1,
    status: 'completed',
    published: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      { 
        id: `m-${Date.now()}`,
        role: 'user', 
        content: prompt, 
        timestamp: new Date().toISOString() 
      },
      {
        id: `m-${Date.now() + 1}`,
        role: 'assistant',
        content: 'Planning project structure...',
        timestamp: new Date().toISOString()
      }
    ],
    tagline: prompt,
    files: {
      'index.html': previewHtml,
      'src/App.tsx': isGemini
        ? `import React, { useState } from 'react';

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Ku soo dhowaw Gemini 2.5 Flash & FURSAD AI Assistant! Sideen kuu caawin karaa?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput('');
    setMessages(prev => [
      ...prev,
      { role: 'user', text: userText },
      { role: 'assistant', text: 'Mahadsanid! Su\\'aashaada waan falanqaynayaa: ' + userText }
    ]);
  };

  return (
    <div className="min-h-screen bg-[#040714] text-white flex flex-col font-sans">
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-slate-950/80">
        <h1 className="font-bold text-lg text-cyan-400">Gemini 2.5 Flash Assistant</h1>
      </header>
      <main className="flex-1 max-w-3xl w-full mx-auto p-6 flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={\`p-4 rounded-2xl max-w-xl text-sm \${m.role === 'user' ? 'ml-auto bg-blue-600' : 'bg-slate-900 border border-white/10'}\`}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-4">
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Weydii wax kasta..." 
            className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
          />
          <button onClick={handleSend} className="px-5 py-3 bg-blue-600 rounded-xl font-bold text-sm">Dir</button>
        </div>
      </main>
    </div>
  );
}`
        : isBookShop 
        ? `import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Catalog } from './components/Catalog';

export default function App() {
  const [cartCount, setCartCount] = useState(2);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      <Navbar cartCount={cartCount} searchQuery={searchQuery} onSearch={setSearchQuery} />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <Catalog 
          activeCategory={activeCategory} 
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onAddToCart={() => setCartCount(c => c + 1)}
        />
      </main>
    </div>
  );
}`
        : `import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center justify-center font-sans">
      <h1 className="text-3xl font-extrabold text-blue-400 mb-4">${projectName}</h1>
      <p className="text-slate-400 mb-6">${prompt}</p>
      <button onClick={() => setCount(c => c + 1)} className="px-5 py-2.5 bg-blue-600 rounded-xl font-bold">
        Clicked {count} times
      </button>
    </div>
  );
}`,
      'src/components/Navbar.tsx': isBookShop
        ? `import React from 'react';

interface NavbarProps {
  cartCount: number;
  searchQuery: string;
  onSearch: (q: string) => void;
}

export function Navbar({ cartCount, searchQuery, onSearch }: NavbarProps) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black">
            📚
          </div>
          <div>
            <span className="font-extrabold text-lg text-white">IFTIN BOOKS</span>
            <span className="text-[10px] text-amber-400 block -mt-1 font-mono uppercase tracking-widest">Maktabadda Buugaagta</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Raadi buug, qoraa..."
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-amber-500"
          />
        </div>

        <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-xs font-bold text-white">
          <span>🛒 Dambiisha</span>
          <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black">\${cartCount}</span>
        </button>
      </div>
    </header>
  );
}`
        : `import React from 'react';

export function Navbar() {
  return (
    <nav className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/60">
      <span className="font-bold text-blue-400">\${projectName}</span>
      <div className="flex gap-4 text-xs text-slate-300 font-medium">
        <a href="#home">Home</a>
        <a href="#catalog">Catalog</a>
        <a href="#cart">Cart</a>
      </div>
    </nav>
  );
}`,
      'src/components/Catalog.tsx': isBookShop
        ? `import React from 'react';

interface CatalogProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onAddToCart: () => void;
}

const BOOKS = [
  { id: 1, title: 'Hal Ka Haleel', author: 'Hadraawi (Maxamed Ibraahim Warsame)', category: 'Suugaan & Gabayo', price: 28.00, badge: 'Classic' },
  { id: 2, title: 'Diiwaanka Maansada', author: 'Maxamed Xaashi Dhamac (Gaarriye)', category: 'Suugaan & Gabayo', price: 24.50, badge: 'Bestseller' },
  { id: 3, title: 'Halgankii Gobanimodoonka', author: 'Aw Jaamac Cumar Ciise', category: 'Taariikh & Dhaqan', price: 34.00, badge: 'Taariikh' },
  { id: 4, title: 'Aqoonta Ganacsiga Casriga', author: 'Dr. Cabdiraxmaan Maxamed', category: 'Saynis & Farsamo', price: 22.00, badge: 'Tech & Biz' },
  { id: 5, title: 'Barashada Af-Soomaaliga', author: 'Prof. Yaasiin Cismaan Keenadiid', category: 'Suugaan & Gabayo', price: 26.00, badge: 'Aqoonta Guud' },
  { id: 6, title: 'Jidka Guusha & Hadafyada', author: 'Ustaad Faarax Nuur', category: 'Diini & Horumarin', price: 18.50, badge: 'Horumarin' }
];

export function Catalog({ activeCategory, onSelectCategory, searchQuery, onAddToCart }: CatalogProps) {
  const filtered = BOOKS.filter(b => {
    const matchesCat = activeCategory === 'All' || b.category.includes(activeCategory);
    const matchesQuery = !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">Buugaagta Xulka ah (Featured Books)</h2>
        <span className="text-xs text-amber-400 font-mono font-bold">\${filtered.length} Buug oo diyaar ah</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(book => (
          <div key={book.id} className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-amber-500/40 transition-all">
            <div>
              <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">\${book.badge}</span>
              <h3 className="text-lg font-bold text-white mt-2">\${book.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">\${book.author}</p>
              <p className="text-xs text-slate-500 mt-2 font-mono">\${book.category}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-base font-black text-amber-400 font-mono">$\${book.price.toFixed(2)}</span>
              <button onClick={onAddToCart} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all">
                Ku dar Dambiisha
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}`
        : `import React from 'react';

export function Catalog() {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-6">Product Catalog</h2>
      <div className="grid grid-cols-3 gap-6">
        {/* Catalog items mapped dynamically */}
      </div>
    </section>
  );
}`,
      'src/styles.css': isBookShop
        ? `@import "tailwindcss";
body {
  background-color: #090d16;
  color: #f1f5f9;
}`
        : `@import "tailwindcss";
body {
  background-color: #020617;
  color: #f8fafc;
}`,
      'schema.sql': isBookShop
        ? `-- PostgreSQL Schema for Iftin Modern Book House & Store
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  biography TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_id INT REFERENCES authors(id),
  category_id INT REFERENCES categories(id),
  isbn VARCHAR(30) UNIQUE,
  price NUMERIC(10, 2) NOT NULL,
  stock_quantity INT DEFAULT 25,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  city VARCHAR(100) DEFAULT 'Muqdisho'
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  total_amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
        : `-- PostgreSQL Schema for ${projectName}
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (\n  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  price NUMERIC(10, 2) NOT NULL,
  stock_quantity INT DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  total_amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
      'server/api.ts': isBookShop
        ? `import express from 'express';
const router = express.Router();

// Get Books Catalog
router.get('/books', (req, res) => {
  res.json({
    books: [
      { id: 1, title: 'Hal Ka Haleel', author: 'Hadraawi', price: 28.00 },
      { id: 2, title: 'Diiwaanka Maansada', author: 'Gaarriye', price: 24.50 },
      { id: 3, title: 'Halgankii Gobanimodoonka', author: 'Aw Jaamac Cumar', price: 34.00 }
    ]
  });
});

// Process Book Order
router.post('/orders', (req, res) => {
  res.json({ success: true, orderId: 'BOOK-' + Date.now(), message: 'Dalabkaaga buugta waa la xaqiijiyay!' });
});

export default router;`
        : `import express from 'express';
const router = express.Router();

router.get('/products', (req, res) => {
  res.json({ products: [] });
});

router.post('/orders', (req, res) => {
  res.json({ success: true, orderId: Date.now() });
});

export default router;`
    },
    databaseTables: isBookShop ? [
      {
        name: 'books',
        columns: ['id', 'title', 'author', 'category', 'price', 'stock'],
        sampleRows: [
          { id: 1, title: 'Hal Ka Haleel', author: 'Hadraawi (Maxamed I. Warsame)', category: 'Suugaan & Gabayo', price: 28.0, stock: 45 },
          { id: 2, title: 'Diiwaanka Maansada', author: 'Maxamed X. Dhamac (Gaarriye)', category: 'Suugaan & Gabayo', price: 24.5, stock: 32 },
          { id: 3, title: 'Halgankii Gobanimodoonka', author: 'Aw Jaamac Cumar Ciise', category: 'Taariikh & Dhaqan', price: 34.0, stock: 20 },
          { id: 4, title: 'Aqoonta Ganacsiga Casriga', author: 'Dr. Cabdiraxmaan Maxamed', category: 'Saynis & Ganacsi', price: 22.0, stock: 50 },
        ],
      },
      {
        name: 'orders',
        columns: ['id', 'customer', 'book_count', 'total', 'status'],
        sampleRows: [
          { id: 201, customer: 'Cali Nuur (Hargeysa)', book_count: 2, total: 52.5, status: 'Gaarsiin' },
          { id: 202, customer: 'Fadumo Xuseen (Muqdisho)', book_count: 1, total: 28.0, status: 'Dhameystiran' },
          { id: 203, customer: 'Axmed Warsame (Garowe)', book_count: 3, total: 84.0, status: 'Diyaar' },
        ]
      }
    ] : [
      {
        name: 'products',
        columns: ['id', 'title', 'category', 'price', 'stock_quantity'],
        sampleRows: [
          { id: 1, title: 'Dirac Shiikhi ah', category: 'Dirac', price: 65.0, stock_quantity: 14 },
          { id: 2, title: 'Guntiino Hiddaha', category: 'Guntiino', price: 85.0, stock_quantity: 8 },
          { id: 3, title: 'Macawiis Alindi', category: 'Macawiis', price: 35.0, stock_quantity: 22 },
        ],
      },
      {
        name: 'orders',
        columns: ['id', 'customer', 'total', 'status'],
        sampleRows: [
          { id: 101, customer: 'Amina H.', total: 150.0, status: 'shipped' },
          { id: 102, customer: 'Sahra K.', total: 85.0, status: 'pending' },
        ]
      }
    ],
    steps: [
      { step: 1, title: 'Understand', titleSo: 'Fahamka Shuruudaha', description: 'Prompt analyzed.', status: 'completed' },
      { step: 2, title: 'Plan', titleSo: 'Qorshaynta', description: 'Architecture formulated.', status: 'completed' },
      { step: 3, title: 'Build', titleSo: 'Dhismaha Code', description: 'React components created.', status: 'completed' },
      { step: 4, title: 'Database', titleSo: 'Xog-kaydka', description: 'PostgreSQL tables structured.', status: 'completed' },
      { step: 5, title: 'Live Preview', titleSo: 'Muuqaalka Tooska', description: 'Sandbox mounted.', status: 'completed' },
    ],
  };
}
