// Lightbox elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, alt){
  if(!src) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || 'Dish photo';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
  lightboxClose.focus();
}

function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden','true');
  lightboxImg.src = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e)=>{ if(e.target===lightbox) closeLightbox(); });
window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeLightbox(); });

// ====== HELPERS ======
function setupDescToggles(){
  // Mobile-only behavior: if you want it strictly on small screens
  const isMobile = window.matchMedia('(max-width: 900px)').matches;

  document.querySelectorAll('#grid .desc').forEach(d => {
    const textEl = d.querySelector('.desc-text');
    const btn = d.querySelector('.more-toggle');
    if (!textEl || !btn) return;

    // Default: collapsed on mobile, expanded on desktop
    d.setAttribute('data-collapsed', isMobile ? 'true' : 'false');
    btn.setAttribute('aria-expanded', isMobile ? 'false' : 'true');

    // Measure overflow only on mobile; hide toggle if single line
    // Force a reflow so clientHeight is measured correctly after render()
    if (isMobile) {
      // brief trick to ensure styles applied before measurement
      requestAnimationFrame(() => {
        const overflow = textEl.scrollHeight - textEl.clientHeight > 1;
        btn.style.display = overflow ? 'inline' : 'none';
      });
    } else {
      btn.style.display = 'none';
    }

    // Toggle handler
    btn.onclick = () => {
      const collapsed = d.getAttribute('data-collapsed') !== 'false';
      d.setAttribute('data-collapsed', collapsed ? 'false' : 'true');
      btn.textContent = collapsed ? ' less' : '… more';
      btn.setAttribute('aria-expanded', String(!collapsed));
    };
  });
}

// (Optional) re-check on resize so clamping stays correct when viewport changes
let _descResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(_descResizeTimer);
  _descResizeTimer = setTimeout(() => setupDescToggles(), 150);
});

function parseCSV(text){
  const rows=[]; let row=[]; let field=''; let i=0; let inQuotes=false; const s=String(text||'');
  while(i<s.length){
    const c=s[i];
    if(inQuotes){
      if(c==='"'){
        if(s[i+1]==='"'){ field+='"'; i+=2; continue; }
        inQuotes=false; i++; continue;
      }
      field+=c; i++; continue;
    } else {
      if(c==='"'){ inQuotes=true; i++; continue; }
      if(c===','){ row.push(field); field=''; i++; continue; }
      if(c==='\n'){ row.push(field); rows.push(row); row=[]; field=''; i++; continue; }
      if(c==='\r'){ i++; continue; }
      field+=c; i++;
    }
  }
  if(field!=='' || row.length){ row.push(field); rows.push(row); }
  if(!rows.length) return [];
  const headers = rows.shift().map(h=>String(h||'').trim());
  return rows.filter(r=>r.some(x=>String(x).trim()!==''))
              .map(cols=>{ const obj={}; headers.forEach((h,idx)=> obj[h] = (cols[idx]!==undefined? String(cols[idx]).trim(): '')); return obj; });
}

function parseOptions(v){
  if(!v) return [];
  try{ if(/^\s*\[/.test(v)){ const a=JSON.parse(v); return (Array.isArray(a)?a:[])
    .map(x=>({label:String(x.label||'').trim(), price:(x.price!==undefined? Number(x.price): NaN)}))
    .filter(x=>x.label); } }
  catch(e){}
  return String(v).split(/[|;]+/).map(p=>{ const m=p.split(/[:=]/); const label=(m[0]||'').trim(); const pr=(m[1]||'').trim(); const num=pr===''? NaN : Number(pr); return {label, price:num}; }).filter(x=>x.label);
}

function parseBadges(v){ 
  if(!v) return []; 
  const s=String(v).replace(/^\s*\"|\"\\s*$/g,''); 
  return s.split(/\\s*,\\s*|\\s*[|;]+\\s*/).map(x=>x.trim()).filter(Boolean); 
}

function formatPrice(v){ 
  if(v===undefined||v===null||v==='') return ''; 
  const n=Number(v); 
  return CURRENCY+(isNaN(n)?v:n.toLocaleString()); 
}

// Language display rules
function pickLang(it, lang){
  if(lang==='th') return { main: it.th_name||it.en_name||'', sub: it.en_name||'', desc: it.desc_th||'' };
  if(lang==='cn') return { main: it.cn_name||it.en_name||'', sub: it.en_name||'', desc: it.desc_cn||it.desc_en||'' };
  return { main: it.en_name||it.th_name||'', sub: it.th_name||'', desc: it.desc_en||'' }; // default EN
}

function updateURLLangParam(lang) {
  if (!history.replaceState) return; // fallback safe
  const url = new URL(window.location);
  url.searchParams.set("lang", lang);
  history.replaceState({}, "", url);
}


function catLabel(cat, lang){
  if(!cat) return '';
  if(lang==='th') return cat.th_name || cat.en_name || '';
  if(lang==='cn') return cat.cn_name || cat.en_name || '';
  return cat.en_name || '';
}

function getItemCategoryId(it, categories){
  if(it.category_id && String(it.category_id).trim()!=='') return String(it.category_id);
  const names = [it.category, it.category_en, it.category_th, it.category_cn].filter(Boolean).map(s=>String(s).trim().toLowerCase());
  for(const c of categories){
    if(String(c.id)==='all') continue;
    const cands=[c.en_name,c.th_name,c.cn_name].filter(Boolean).map(s=>s.toLowerCase());
    if(names.some(n=>cands.includes(n))) return String(c.id);
  }
  return '';
}

// Return 320/640 variants for a given image url.
// Accepts original like "img/dish.jpg" or already-sized "img/dish-1024.webp".
// Falls back to the given url if pattern doesn't match.
function buildImageVariants(url) {
  if (!url) return { thumb: '', large: '' };
  const m = String(url).match(/^(.*?)(?:-(?:320|640|1024))?\.(jpg|jpeg|png|webp)$/i);
  if (!m) return { thumb: url, large: url };
  const base = m[1];
  return {
    thumb: `${base}-320.webp`,
    large: `${base}-640.webp`
  };
}

// Open a lightweight preview (re-use your lightbox if already present)
function openImagePreview(src, alt) {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbClose = document.getElementById('lightboxClose');
  if (lb && lbImg) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('open');
    lb.style.display = 'flex'; 
    lb.setAttribute('aria-hidden', 'false');
    if (lbClose) lbClose.focus();
    return;
  }
  // Fallback: open in a new tab if no lightbox exists
  window.open(src, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
  const lb = document.getElementById('lightbox');
  const lbClose = document.getElementById('lightboxClose');
  if (!lb) return;

  function closeLightbox() {
    lb.classList.remove('open');
    lb.style.display = 'none';
    lb.setAttribute('aria-hidden', 'true');
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => {
    if (e.target === lb) closeLightbox(); // click outside image
  });
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
});

// ====== STATE ======
const state={items:[],categories:[],lang:'en',q:'',cat:'all'};

// ====== UI NODES ======
const grid=document.getElementById('grid');
const q=document.getElementById('q');
const sectionPills=document.getElementById('sectionPills');
const drawerList=document.getElementById('drawerList');
const hamburger=document.getElementById('hamburger');
const catDrawer=document.getElementById('catDrawer');
const langBtns = {
    en: document.getElementById('lang-en'),
    th: document.getElementById('lang-th'),
    cn: document.getElementById('lang-cn')
};
const notice=document.getElementById('notice');

const ham = document.getElementById('hamburger');
const drawer = document.getElementById('catDrawer');

if (ham && drawer) {
  ham.addEventListener('click', () => {
    // Only open if there are category buttons rendered inside the drawer
    const hasCats = drawer.querySelector('[data-cat]') !== null;
    if (hasCats) {
      drawer.classList.add('open');
    }
  });

  // Close on backdrop click or a close button
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) drawer.classList.remove('open');
  });
}


// Mobile language cycler
const langCycleBtn = document.getElementById('lang-cycle');
if (langCycleBtn) {
    const order = ['en', 'th', 'cn'];
    function labelFor(lang) {
        if (lang === 'th') return 'ไทย';
        if (lang === 'cn') return '中文';
        return 'EN';
    }
    function cycleLang() {
        const idx = order.indexOf(state.lang);
        const next = order[(idx + 1) % order.length];
        state.lang = next;

        // sync desktop buttons if present
        const map = { en: 'lang-en', th: 'lang-th', cn: 'lang-cn' };
        Object.values(map).forEach(id => { 
            const el = document.getElementById(id); 
            if (el) el.setAttribute('aria-pressed','false'); 
        });
        const active = document.getElementById(map[next]); 
        if (active) 
            active.setAttribute('aria-pressed','true');

        langCycleBtn.textContent = labelFor(next);
        if (typeof renderSections === 'function') 
            renderSections();
        render();
        updateURLLangParam(state.lang);
        try { 
            localStorage.setItem('LANG', state.lang); 
        } catch {}
        document.documentElement.setAttribute('lang', state.lang);
    }
    langCycleBtn.textContent = labelFor(state.lang || 'en');
    langCycleBtn.addEventListener('click', cycleLang);
}


function showNotice(msg){ 
  notice.textContent = msg; 
  notice.style.display='block'; 
}

function closeDrawer(){ 
  catDrawer.classList.remove('open'); 
  catDrawer.setAttribute('aria-hidden','true'); 
  hamburger.setAttribute('aria-expanded','false'); 
}

function openDrawer(){ 
  catDrawer.classList.add('open'); 
  catDrawer.setAttribute('aria-hidden','false'); 
  hamburger.setAttribute('aria-expanded','true'); 
}

hamburger.addEventListener('click',()=>{
  const expanded = hamburger.getAttribute('aria-expanded')==='true';
  if(expanded) closeDrawer(); else openDrawer();
});
catDrawer.addEventListener('click',(e)=>{ 
  if(e.target===catDrawer) closeDrawer(); 
});

// ====== RENDER SECTIONS (pills + drawer) ======
function renderSections(){
  const wrap = document.getElementById('sectionPills');
  if (!wrap) 
    return;

  // Use only the loaded categories in state; never SAMPLE_CATEGORIES
  const cats = Array.isArray(state.categories) ? state.categories.slice() : [];

  // If nothing loaded yet, show a minimal placeholder (or leave empty)
  if (!cats.length) {
    wrap.innerHTML = ''; // or: wrap.innerHTML = '<span class="pill disabled">…</span>'
    return;
  }

  // Sort by 'order' if present
  cats.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  // Resolve label per language
  const labelFor = (c) => {
    if (state.lang === 'th') return c.th_name || c.en_name || '';
    if (state.lang === 'cn') return c.cn_name || c.en_name || '';
    return c.en_name || '';
  };

  wrap.innerHTML = cats.map(c => `
    <button class="pill" data-cat="${String(c.id)}"
            aria-pressed="${state.cat === String(c.id) ? 'true' : 'false'}">
      ${labelFor(c)}
    </button>
  `).join('');

  // Also render into the drawer list if present (mobile menu)
  const drawerList = document.getElementById('drawerList');
  if (drawerList) {
    drawerList.innerHTML = cats.map(c => `
      <button class="pill" data-cat="${String(c.id)}"
              aria-pressed="${state.cat === String(c.id) ? 'true' : 'false'}">
        ${labelFor(c)}
      </button>
    `).join('');

    // Bind clicks inside drawer too
    drawerList.querySelectorAll('.pill').forEach(b => {
      b.addEventListener('click', () => {
        state.cat = b.dataset.cat;
        if (drawer) drawer.classList.remove('open');
        renderSections(); // to refresh aria-pressed in both places
        render();
      });
    });
  }

  // Bind click handlers
  wrap.querySelectorAll('.pill').forEach(b => {
    b.addEventListener('click', () => {
      wrap.querySelectorAll('.pill').forEach(x => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', 'true');
      state.cat = b.dataset.cat;
      render();
    });
  });
}

// ====== RENDER MENU ======
function render(){
  console.log('Render running, items:', state.items?.length);
  const grid = document.getElementById('grid');
  if (!grid) return;

  const items = Array.isArray(state.items) ? state.items : [];
  const term = (state.q || '').toLowerCase();
  const selected = String(state.cat || 'all').trim().toLowerCase();

  const filtered = items.filter(it => {
    const opts = parseOptions(it.options);
    const hay = [
      it.en_name, it.th_name, it.cn_name,
      it.desc_en, it.desc_th, it.desc_cn,
      opts.map(o => o.label).join(' ')
    ].join(' ').toLowerCase();

    // --- Category match (id or name, with derived fallback) ---
    if (selected !== 'all') {
      const sel = selected; // already lowercased above
      const catId   = String(it.category_id ?? '').trim().toLowerCase();
      const catName = String(it.category    ?? '').trim().toLowerCase();

      // derive id from the category name against loaded categories (helper already in your file)
      let derivedId = '';
      try {
        derivedId = String(getItemCategoryId(it, state.categories) || '').trim().toLowerCase();
      } catch {}

      const matchesCategory =
        (sel === catId) ||
        (sel === catName) ||
        (derivedId && sel === derivedId);

      if (!matchesCategory) return false;
    }

    // --- Search filter ---
    if (term && !hay.includes(term)) return false;

    return true;
  });

  // Nothing to show
  if (!filtered.length) {
    grid.innerHTML = '';
    return;
  }

  // Card builder (shared)
  const cardHTML = (it) => {
    const view = pickLang(it, state.lang);
    const { thumb, large } = buildImageVariants(it.image_url);
    const opts = parseOptions(it.options);
    const hasVariants = opts.length > 0;

    const variantsHTML = hasVariants
      ? `<div class="variants" role="list" aria-label="Price options">
           ${opts.map(o => `<span class="var-item" role="listitem">${o.label}${Number.isFinite(o.price) ? ` — ${formatPrice(o.price)}` : ''}</span>`).join('')}
         </div>`
      : '';

    const singlePriceHTML = !hasVariants
      ? `<div class="single-price" aria-label="Price">${formatPrice(it.price)}</div>`
      : '';

    const badgesHTML = (parseBadges(it.badges) || []).map(b => `<span class="badge ${b}">${b}</span>`).join('');
    const mainTitle = (it.prefix ? `${String(it.prefix).trim()} ` : '') + (view.main || '');

    // Note: image is a button so it's keyboard-activatable; data-full points to 640 variant
    const imgHTML = thumb
      ? `<button class="imgwrap" data-full="${large}" aria-label="View ${view.main}">
           <img src="${thumb}" alt="${view.main || ''}" loading="lazy">
         </button>`
      : `<div class="imgwrap"></div>`;

    return `
      <article class="card" tabindex="0" aria-label="${view.main || ''}">
        ${imgHTML}
        <div class="content">
          <div class="names">
            <div class="line">
              <span class="main">${mainTitle}</span>
              <span class="sub">${view.sub || ''}</span>
            </div>
          </div>
          <div class="desc" data-collapsed="true">
            <span class="desc-text">${view.desc || ''}</span>
            <button class="more-toggle" type="button" aria-expanded="false">… more</button>
          </div>
          <div class="meta">
            ${variantsHTML}
            ${singlePriceHTML}
            <div class="badges">${badgesHTML}</div>
          </div>
        </div>
      </article>`;
  };

  // If ALL: group by category (using state.categories order), else: single grid
  if (selected === 'all' && Array.isArray(state.categories) && state.categories.length) {
    // --- robust grouping by id or name (any language), with fallback ---
    const key = v => String(v || '').trim().toLowerCase();

    // Index filtered items by both their category_id and category name
    const groups = new Map();
    filtered.forEach(it => {
      const idKey   = key(it.category_id);
      const nameKey = key(it.category);
      const primary = idKey || nameKey || 'uncat';

      if (!groups.has(primary)) groups.set(primary, []);
      groups.get(primary).push(it);

      // also index under id and name separately so we can match either
      if (idKey && !groups.has(idKey)) groups.set(idKey, groups.get(primary));
      if (nameKey && !groups.has(nameKey)) groups.set(nameKey, groups.get(primary));
    });

    // Order categories and build sections. If none match, we'll fall back to flat grid.
    const orderedCats = state.categories
      .slice()
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

    const labelFor = (c) => {
      if (state.lang === 'th') return c.th_name || c.en_name || '';
      if (state.lang === 'cn') return c.cn_name || c.en_name || '';
      return c.en_name || '';
    };

    let sectionsHTML = '';
    orderedCats.forEach(c => {
      const catId   = key(c.id);
      const catEn   = key(c.en_name);
      const catTh   = key(c.th_name);
      const catCn   = key(c.cn_name);

      const list =
        groups.get(catId) ||
        groups.get(catEn) ||
        groups.get(catTh) ||
        groups.get(catCn) ||
        [];

      if (list.length) {
        sectionsHTML += `
          <section class="cat-section" data-cat="${String(c.id)}">
            <h2 class="cat-title">${labelFor(c)}</h2>
            <div class="grid-tiles">
              ${list.map(cardHTML).join('')}
            </div>
          </section>
        `;
      }
    });

    // Fallback: if no category matched (e.g., ids vs names mismatch), show a flat grid
    grid.innerHTML = sectionsHTML.trim()
      ? sectionsHTML
      : `<div class="grid-tiles">${filtered.map(cardHTML).join('')}</div>`;

  } else {
    // Single-category view (unchanged)
    grid.innerHTML = `
      <div class="grid-tiles">
        ${filtered.map(cardHTML).join('')}
      </div>
    `;
  }

  // Bind image click (open 640 variant)
  grid.querySelectorAll('.imgwrap').forEach(btn => {
    btn.addEventListener('click', () => {
      const img = btn.querySelector('img');
      const src = btn.getAttribute('data-full') || (img ? img.src : '');
      const alt = img ? img.alt : '';
      if (src) openImagePreview(src, alt);
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
  // After binding image handlers…
  setupDescToggles();
}

// ====== EVENTS ======
document.getElementById('q').addEventListener('input',()=>{
  state.q=q.value;
  render();
});

Object.entries(langBtns).forEach(([k, b]) => {
  if (!b) 
    return;
  b.addEventListener('click', () => {
    state.lang = k;
    Object.values(langBtns).forEach(x => x && x.setAttribute('aria-pressed','false'));
    b.setAttribute('aria-pressed','true');
    if (typeof renderSections === 'function') 
        renderSections();
    render();
    updateURLLangParam(state.lang);

    // persist global language so menu page uses the same
    try { 
      localStorage.setItem('LANG', state.lang); 
    } 
    catch {}
    document.documentElement.setAttribute('lang', state.lang);
  });
});


    // ====== LOADERS ======
async function loadItems() {
  state.items = [];
  try {
    //console.log('🟢 Trying to load menu from JSON:', MENU_JSON_URL);
    const resp = await fetch(new URL(MENU_JSON_URL, location.href).toString(), { cache: 'no-store' });
    if (!resp.ok) throw new Error(`Menu JSON fetch failed (${resp.status})`);
    const json = await resp.json();
    const rows = Array.isArray(json) ? json : (Array.isArray(json.items) ? json.items : []);
    state.items = rows.map(r => ({
      id: r.id || r.ID || '',
      prefix: r.prefix || r.item_prefix || r.Prefix || '',
      category: r.category || r.Category || '',
      category_id: r.category_id || r.Category_id || '',
      en_name: r.en_name || r.English || r.en || '',
      th_name: r.th_name || r.Thai || r.th || '',
      cn_name: r.cn_name || r.Chinese || r.cn || '',
      price: r.price || r.Price || '',
      desc_en: r.desc_en || r.Description_en || r.en_desc || '',
      desc_th: r.desc_th || r.Description_th || r.th_desc || '',
      desc_cn: r.desc_cn || r.Description_cn || r.cn_desc || '',
      image_url: r.image_url || r.Image || r.image || '',
      badges: r.badges || r.Badges || '',
      options: r.options || r.Variants || r.variant || ''
    }));
    //console.log(`✅ Loaded ${state.items.length} items from JSON`);
    return;
  } 
  catch (err) {
    //console.warn('⚠️ JSON failed, falling back to CSV:', err.message);
  }

  // ---- CSV fallback ----
  try {
    //console.log('🟡 Trying to load menu from CSV:', MENU_CSV_URL);
    const resp = await fetch(new URL(MENU_CSV_URL, location.href).toString(), { cache: 'no-store' });
    if (!resp.ok) throw new Error(`Menu CSV fetch failed (${resp.status})`);
    const text = await resp.text();
    const rows = parseCSV(text);
    state.items = rows.map(r => ({
      id: r.id || r.ID || '',
      prefix: r.prefix || r.item_prefix || r.Prefix || '',
      category: r.category || r.Category || '',
      category_id: r.category_id || r.Category_id || '',
      en_name: r.en_name || r.English || r.en || '',
      th_name: r.th_name || r.Thai || r.th || '',
      cn_name: r.cn_name || r.Chinese || r.cn || '',
      price: r.price || r.Price || '',
      desc_en: r.desc_en || r.Description_en || r.en_desc || '',
      desc_th: r.desc_th || r.Description_th || r.th_desc || '',
      desc_cn: r.desc_cn || r.Description_cn || r.cn_desc || '',
      image_url: r.image_url || r.Image || r.image || '',
      badges: r.badges || r.Badges || '',
      options: r.options || r.Variants || r.variant || ''
    }));
    //console.log(`✅ Loaded ${state.items.length} items from CSV`);
  } catch (err) {
    //console.error('❌ Failed to load menu from JSON or CSV:', err);
    showNotice('Failed to load menu data. Check console for details.');
  }
}
async function loadCategories() {
  state.categories = [];
  try {
    //console.log('🟢 Trying to load categories from JSON:', CATEGORY_JSON_URL);
    const resp = await fetch(new URL(CATEGORY_JSON_URL, location.href).toString(), { cache: 'no-store' });
    if (!resp.ok) throw new Error(`Category JSON fetch failed (${resp.status})`);
    const json = await resp.json();
    /*const rows = Array.isArray(json) ? json : (Array.isArray(json.categories) ? json.categories : []);
    const cats = rows.map(r => ({
      id: String(r.id || r.ID || '').trim() || 'all',
      en_name: r.en_name || r.English || r.name_en || '',
      th_name: r.th_name || r.Thai || r.name_th || '',
      cn_name: r.cn_name || r.Chinese || r.name_cn || '',
      order: Number(r.order || r.sort || r.idx || 999)
    }));
    const hasAll = cats.some(c => String(c.id) === 'all');
    state.categories = hasAll ? cats : [{ id:'all', en_name:'All', th_name:'ทั้งหมด', cn_name:'全部', order:0 }, ...cats];
    */
    const rows = Array.isArray(json) ? json : (Array.isArray(json.categories) ? json.categories : []);
    const cats = rows.map(r => ({
      id: String(r.id || r.ID || r.cat_id || '').trim() || 'all',
      en_name: String(r.en_name || r.English || r.name_en || '').trim(),
      th_name: String(r.th_name || r.Thai    || r.name_th || '').trim(),
      cn_name: String(r.cn_name || r.Chinese || r.name_cn || '').trim(),
      order: Number(r.order || r.sort || r.idx || 999)
    }));
    const hasAll = cats.some(c => String(c.id) === 'all');
    state.categories = hasAll
      ? cats
      : [{ id:'all', en_name:'All', th_name:'ทั้งหมด', cn_name:'全部', order:0 }, ...cats];

    //console.log(`✅ Loaded ${state.categories.length} categories from JSON`);
    return;
  } catch (err) {
    //console.warn('⚠️ JSON failed, falling back to CSV:', err.message);
  }

  // ---- CSV fallback ----
  try {
    //console.log('🟡 Trying to load categories from CSV:', CATEGORY_CSV_URL);
    const resp = await fetch(new URL(CATEGORY_CSV_URL, location.href).toString(), { cache: 'no-store' });
    if (!resp.ok) throw new Error(`Category CSV fetch failed (${resp.status})`);
    const text = await resp.text();
    /*const rows = parseCSV(text);
    const cats = rows.map(r => ({
      id: (r.id || r.ID || '').trim() || 'all',
      en_name: r.en_name || r.English || r.name_en || '',
      th_name: r.th_name || r.Thai || r.name_th || '',
      cn_name: r.cn_name || r.Chinese || r.name_cn || '',
      order: Number(r.order || r.sort || r.idx || 999)
    }));
    const hasAll = cats.some(c => String(c.id) === 'all');
    state.categories = hasAll ? cats : [{ id:'all', en_name:'All', th_name:'ทั้งหมด', cn_name:'全部', order:0 }, ...cats];
    */
    const rows = parseCSV(text);
    const cats = rows.map(r => ({
      id: String(r.id || r.ID || r.cat_id || '').trim() || 'all',
      en_name: String(r.en_name || r.English || r.name_en || '').trim(),
      th_name: String(r.th_name || r.Thai    || r.name_th || '').trim(),
      cn_name: String(r.cn_name || r.Chinese || r.name_cn || '').trim(),
      order: Number(r.order || r.sort || r.idx || 999)
    }));

    //console.log(`✅ Loaded ${state.categories.length} categories from CSV`);
  } catch (err) {
    console.error('❌ Failed to load categories from JSON or CSV:', err);
    showNotice('Failed to load categories data. Check console for details.');
  }
}

// ====== INIT ======
(async function init() {
  try {
    // --- 1. Detect language from URL before data loads ---
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get("lang");
    const allowedLangs = ["en", "th", "cn"];
    if (langParam && allowedLangs.includes(langParam.toLowerCase())) {
      state.lang = langParam.toLowerCase();
      //console.log(`🌐 Language set from URL param: ${state.lang}`);
    }

    // --- 2. Load both menu & categories in parallel ---
    await Promise.all([loadCategories(), loadItems()]);
  } catch (e) {
    //console.error("❌ Init load failed:", e);
  }

  // --- 3. Render everything once data is ready ---
  if (typeof renderSections === "function") renderSections();
  render();

  // --- 4. Sync the language controls after first render ---
  const labelMap = { en: "EN", th: "ไทย", cn: "中文" };
  Object.entries(langBtns || {}).forEach(([k, b]) => {
    if (b) b.setAttribute("aria-pressed", k === state.lang ? "true" : "false");
  });

  const cycleBtn = document.getElementById("lang-cycle");
  if (cycleBtn) cycleBtn.textContent = labelMap[state.lang] || "EN";

  //console.log("✅ Initialization complete: data loaded and UI rendered");
})();
