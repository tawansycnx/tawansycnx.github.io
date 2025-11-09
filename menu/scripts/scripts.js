function whenChromeReady(fn){
  if (window._includesReady && typeof window._includesReady.then === 'function') {
    window._includesReady.then(fn);
  } else {
    fn();
  }
}

// Lightbox elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

// Run only after header/footer are included
function whenChromeReady(fn){
  if (window._includesReady && typeof window._includesReady.then === 'function') {
    window._includesReady.then(fn);
  } else {
    // includes not used (fallback)
    fn();
  }
}

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
function getItemOptionsForLang(it, lang) {
  if (lang === 'th') return it.options_th || it.options_en || it.options || '';
  if (lang === 'cn') return it.options_cn || it.options_en || it.options || '';
  return it.options_en || it.options || '';
}

// Track collapsed categories in ALL view
const collapsedCats = new Set();

// Get localized category label (you already have these helpers; keep them or use yours)
function getCatLabel(catIdOrName) {
  const cat = findCategoryByKey(catIdOrName, state.categories || []);
  return categoryLabel(cat, state.lang) || String(catIdOrName);
}

function findCategoryByKey(key, categories){
  if (!key || !Array.isArray(categories)) return null;
  const k = String(key).trim().toLowerCase();
  return categories.find(c=>{
    const id = String(c.id ?? '').trim().toLowerCase();
    const en = String(c.en_name ?? c.en ?? c.name_en ?? '').trim().toLowerCase();
    const th = String(c.th_name ?? c.th ?? c.name_th ?? '').trim().toLowerCase();
    const cn = String(c.cn_name ?? c.zh_name ?? c.cn ?? c.name_cn ?? '').trim().toLowerCase();
    return k === id || k === en || k === th || k === cn;
  }) || null;
}

function categoryLabel(cat, lang){
  if (!cat) return '';
  if (lang === 'th') return cat.th_name || cat.en_name || cat.name || '';
  if (lang === 'cn') return cat.cn_name || cat.en_name || cat.name || '';
  return cat.en_name || cat.name || '';
}

// Localized labels for the description toggle
function moreLessLabels(lang){
  const map = {
    en: { more: '… more',     less: ' less' },
    th: { more: '… เพิ่มเติม', less: ' ย่อ'  },
    cn: { more: '… 更多',      less: ' 收起'  }
  };
  return map[lang] || map.en;
}

/*
function setupDescToggles(){
  const isMobile = window.matchMedia('(max-width: 900px)').matches;

  document.querySelectorAll('#grid .desc').forEach(d => {
    const textEl = d.querySelector('.desc-text');
    const btn = d.querySelector('.more-toggle');
    if (!textEl || !btn) return;

    // Default: collapsed on mobile, expanded on desktop
    d.setAttribute('data-collapsed', isMobile ? 'true' : 'false');
    btn.setAttribute('aria-expanded', isMobile ? 'false' : 'true');
    btn.textContent = '… more';

    // Measure overflow after layout is applied
    requestAnimationFrame(() => {
      if (!isMobile) { btn.style.display = 'none'; return; }

      // Force a reflow to get correct heights
      const overflow = textEl.scrollHeight > (textEl.clientHeight + 1);
      btn.style.display = overflow ? 'inline' : 'none';
    });

    btn.onclick = () => {
      const collapsed = d.getAttribute('data-collapsed') !== 'false';
      d.setAttribute('data-collapsed', collapsed ? 'false' : 'true');
      btn.textContent = collapsed ? ' less' : '… more';
      btn.setAttribute('aria-expanded', String(!collapsed));
    };
  });
}
*/
function setupDescToggles(){
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const { more, less } = moreLessLabels(state.lang);

  document.querySelectorAll('#grid .desc').forEach(d => {
    const textEl = d.querySelector('.desc-text');
    const btn = d.querySelector('.more-toggle');
    if (!textEl || !btn) return;

    // Default state: collapsed on mobile, expanded on desktop
    d.setAttribute('data-collapsed', isMobile ? 'true' : 'false');
    btn.setAttribute('aria-expanded', isMobile ? 'false' : 'true');
    btn.textContent = more;

    if (!isMobile) {
      // Desktop: no toggle
      btn.style.display = 'none';
      return;
    }

    // --- Clamp-aware overflow detection ---
    // 1) Ensure collapsed, measure collapsed height
    d.setAttribute('data-collapsed', 'true');
    // Force layout now
    const collapsedH = textEl.getBoundingClientRect().height;

    // 2) Temporarily un-collapse, measure full height, then restore collapsed
    d.setAttribute('data-collapsed', 'false');
    requestAnimationFrame(() => {
      const expandedH = textEl.getBoundingClientRect().height;
      // Restore collapsed for initial view
      d.setAttribute('data-collapsed', 'true');

      const overflow = expandedH > collapsedH + 1; // tolerate 1px rounding
      btn.style.display = overflow ? 'inline' : 'none';
    });

    // Toggle behavior
    btn.onclick = () => {
      const collapsed = d.getAttribute('data-collapsed') !== 'false';
      d.setAttribute('data-collapsed', collapsed ? 'false' : 'true');
      btn.textContent = collapsed ? less : more;
      btn.setAttribute('aria-expanded', String(!collapsed));
    };
  });
}


// Make sure render() calls this after injecting cards:
 // setupDescToggles();


// Call this at the end of render()

let _descResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(_descResizeTimer);
  _descResizeTimer = setTimeout(() => {
    // Re-run after layout changes
    setupDescToggles();
  }, 150);
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

  const items = Array.isArray(state.items) ? state.items : [];
  // --- Selection + term (safe, normalized) ---
  const selected = String((state && state.cat) ? state.cat : 'all').trim().toLowerCase();
  const term = (state && state.q ? String(state.q) : '').trim().toLowerCase();

  const filtered = items.filter(it => {
    const opts = parseOptions(getItemOptionsForLang(it, state.lang));
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

  // ===== build grid (grouped “ALL” or single category) =====
  const grid = document.getElementById('grid');
  if (!grid) return;

  // local helpers
  function itemCatKey(it){
    const fromId = String(it.category_id ?? '').trim();
    if (fromId) return fromId;
    try {
      const derived = getItemCategoryId(it, state.categories);
      if (derived) return String(derived).trim();
    } catch {}
    return String(it.category || 'Uncategorized').trim();
  }
  function findCategoryByKey(key, categories){
    if (!key || !Array.isArray(categories)) return null;
    const k = String(key).trim().toLowerCase();
    return categories.find(c=>{
      const id = String(c.id ?? '').trim().toLowerCase();
      const en = String(c.en_name ?? c.en ?? c.name_en ?? '').trim().toLowerCase();
      const th = String(c.th_name ?? c.th ?? c.name_th ?? '').trim().toLowerCase();
      const cn = String(c.cn_name ?? c.zh_name ?? c.cn ?? c.name_cn ?? '').trim().toLowerCase();
      return k === id || k === en || k === th || k === cn;
    }) || null;
  }
  function categoryLabel(cat, lang){
    if (!cat) return '';
    if (lang === 'th') return cat.th_name || cat.en_name || cat.name || '';
    if (lang === 'cn') return cat.cn_name || cat.en_name || cat.name || '';
    return cat.en_name || cat.name || '';
  }
  function getCatLabel(catKey){
    const catObj = findCategoryByKey(catKey, state.categories || []);
    return categoryLabel(catObj, state.lang) || catKey;
  }
  const safeId = (k)=>`cat-${String(k).replace(/[^a-z0-9_-]/gi,'_')}`;

  // group by category
  const grouped = {};
  filtered.forEach(it=>{
    const k = itemCatKey(it);
    (grouped[k] ??= []).push(it);
  });

  // remember collapsed state between renders
  window._collapsedCats = window._collapsedCats || new Set();

  let html = '';

  // === ALL view: collapsible categories, each with header ===
  if (selected === 'all') {
    for (const catKey of Object.keys(grouped)) {
      const itemsInCat = grouped[catKey];
      const catLabel   = getCatLabel(catKey);
      const isCollapsed = window._collapsedCats.has(catKey);
      const bodyId     = safeId(catKey);

      html += `
        <section class="cat-section" data-cat="${catKey}">
          <div class="cat-head">
            <button class="cat-toggle" type="button"
                    aria-expanded="${isCollapsed ? 'false' : 'true'}"
                    aria-controls="${bodyId}">
              <span class="label">${catLabel}</span>
              <span class="chev">▸</span>
            </button>
          </div>
          <div id="${bodyId}" class="cat-body" ${isCollapsed ? 'hidden' : ''}>
            ${itemsInCat.map(renderItemCard).join('')}
          </div>
        </section>
      `;
    }

    grid.innerHTML = html;

    // delegate toggles (bind once)
    if (!grid._catDelegated) {
      grid.addEventListener('click', (e)=>{
        const btn  = e.target.closest('.cat-toggle');
        if (!btn) return;
        const sec  = btn.closest('.cat-section');
        const body = sec?.querySelector('.cat-body');
        if (!sec || !body) return;

        const was = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!was));
        body.hidden = was;

        const key = sec.getAttribute('data-cat');
        if (key) {
          if (was) window._collapsedCats.add(key);
          else window._collapsedCats.delete(key);
        }
      });
      grid._catDelegated = true;
    }

  // === Single-category view: one header + items ===
  } else {
    const label = getCatLabel(selected);
    html = `<h2 class="category-title">${label}</h2>` +
          filtered.map(renderItemCard).join('');
    grid.innerHTML = html;
  }

  // If you still have a static <h2 id="categoryTitle">All</h2> in the DOM, hide it for ALL:
  const staticTitle = document.getElementById('categoryTitle');
  if (staticTitle) {
    staticTitle.style.display = (selected === 'all') ? 'none' : 'block';
    if (selected !== 'all') staticTitle.textContent = getCatLabel(selected);
  }


  // If you have an old static <h2 id="categoryTitle">All</h2> in HTML, hide it in ALL view:
  const catTitleEl = document.getElementById('categoryTitle');
  if (catTitleEl) {
    catTitleEl.style.display = (selected === 'all') ? 'none' : 'block';
    if (selected !== 'all') catTitleEl.textContent = getCatLabel(selected);
  }
  
  // Nothing to show
  if (!filtered.length) {
    grid.innerHTML = '';
    return;
  }

  // Card builder (shared)
  const cardHTML = (it) => {
    const view = pickLang(it, state.lang);
    const nameHTML = `${it.prefix ? `<span class="prefix">${String(it.prefix).trim()}</span>` : ''}<span class="main">${view.main}</span>`;
    const { thumb, large } = buildImageVariants(it.image_url);
    const opts = parseOptions(getItemOptionsForLang(it, state.lang));
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
            <div class="line">${nameHTML}<span class="sub">${view.sub}</span></div>
          </div>
          <div class="desc" data-collapsed="true">
            <span class="desc-text">${view.desc || ''}</span>
            <button class="more-toggle" type="button" aria-expanded="false">…more</button>
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

function renderItemCard(it){
  const view = pickLang(it, state.lang);
  const opts = parseOptions(getItemOptionsForLang(it, state.lang));
  const hasVariants = opts.length > 0;
  const variantsHTML = hasVariants
    ? `<div class="variants" role="list" aria-label="Price options">
         ${opts.map(o=>`<span class="var-item">${o.label}${Number.isFinite(o.price)?` — ${formatPrice(o.price)}`:''}</span>`).join('')}
       </div>`
    : '';
  const singlePriceHTML = !hasVariants ? `<div class="single-price">${formatPrice(it.price)}</div>` : '';
  const badgesHTML = (parseBadges(it.badges)||[]).map(b=>`<span class="badge ${b}">${b}</span>`).join('');
  const prefixHTML = it.prefix ? `<span class="prefix">${String(it.prefix).trim()}</span>` : '';

  return `
    <article class="card" tabindex="0" aria-label="${view.main}">
      <div class="imgwrap">${it.image_url ? `<img src="${it.image_url}" alt="${view.main}" loading="lazy">` : ''}</div>
      <div class="content">
        <div class="names">
          <div class="line">
            ${prefixHTML}<span class="main">${view.main}</span>
            <span class="sub">${view.sub}</span>
          </div>
        </div>
        <div class="desc">${view.desc || ''}</div>
        <div class="meta">
          ${variantsHTML}
          ${singlePriceHTML}
          <div class="badges">${badgesHTML}</div>
        </div>
      </div>
    </article>`;
}

// ====== EVENTS ======
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
    // inside loadItems() JSON mapping
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

      // ✳️ NEW: language-specific options (plus legacy)
      options_en: r.options_en || r.Options_en || '',
      options_th: r.options_th || r.Options_th || '',
      options_cn: r.options_cn || r.Options_cn || '',
      options:    r.options    || r.Variants   || r.variant || '' // legacy fallback
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
    // inside loadItems() CSV mapping
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

      // ✳️ NEW: language-specific options (plus legacy)
      options_en: r.options_en || r.Options_en || '',
      options_th: r.options_th || r.Options_th || '',
      options_cn: r.options_cn || r.Options_cn || '',
      options:    r.options    || r.Variants   || r.variant || '' // legacy fallback
    }));
    console.log(`✅ Loaded ${state.items.length} items from CSV`);
  } catch (err) {
    console.error('❌ Failed to load menu from JSON or CSV:', err);
    showNotice('Failed to load menu data. Check console for details.');
  }
}
async function loadCategories() {
  state.categories = [];
  try {
    console.log('🟢 Trying to load categories from JSON:', CATEGORY_JSON_URL);
    const resp = await fetch(new URL(CATEGORY_JSON_URL, location.href).toString(), { cache: 'no-store' });
    if (!resp.ok) throw new Error(`Category JSON fetch failed (${resp.status})`);
    const json = await resp.json();
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

    console.log(`✅ Loaded ${state.categories.length} categories from JSON`);
    return;
  } catch (err) {
    console.warn('⚠️ JSON failed, falling back to CSV:', err.message);
  }

  // ---- CSV fallback ----
  try {
    console.log('🟡 Trying to load categories from CSV:', CATEGORY_CSV_URL);
    const resp = await fetch(new URL(CATEGORY_CSV_URL, location.href).toString(), { cache: 'no-store' });
    if (!resp.ok) throw new Error(`Category CSV fetch failed (${resp.status})`);
    const text = await resp.text();
    const rows = parseCSV(text);
    const cats = rows.map(r => ({
      id: String(r.id || r.ID || r.cat_id || '').trim() || 'all',
      en_name: String(r.en_name || r.English || r.name_en || '').trim(),
      th_name: String(r.th_name || r.Thai    || r.name_th || '').trim(),
      cn_name: String(r.cn_name || r.Chinese || r.name_cn || '').trim(),
      order: Number(r.order || r.sort || r.idx || 999)
    }));

    console.log(`✅ Loaded ${state.categories.length} categories from CSV`);
  } catch (err) {
    console.error('❌ Failed to load categories from JSON or CSV:', err);
    showNotice('Failed to load categories data. Check console for details.');
  }
}

// ====== INIT ======
whenChromeReady(() => {
  (async function init(){
    try {
      // ✅ correct data paths from /menu/menu.html
      window.MENU_JSON_URL = "./data/menu.json";
      window.CATEGORY_JSON_URL = "./data/categories.json";
      // (If you still keep CSV fallback)
      window.MENU_CSV_URL = "./data/menu.csv";
      window.CATEGORY_CSV_URL = "./data/categories.csv";

      // Load data AFTER header/footer are in the DOM
      await Promise.all([ loadCategories(), loadItems() ]);

      if (typeof renderSections === 'function') renderSections();
      render();

      console.log('✅ Menu initialized successfully');
    } catch (err) {
      console.error('❌ Menu init failed:', err);
    }
  })();
});

// Submenu category selection from hamburger drawer
window.addEventListener('site:category', (e) => {
  const id = e.detail?.id;
  if (!id) return;
  state.cat = String(id);
  if (typeof renderSections === 'function') renderSections();
  render();
});

// Header search forwarding
window.addEventListener('site:search', (e) => {
  const term = e.detail?.term || '';
  state.q = term;
  render();
});

function refreshDescToggleLabels(){
  const { more, less } = moreLessLabels(state.lang);
  document.querySelectorAll('#grid .desc').forEach(d => {
    const btn = d.querySelector('.more-toggle');
    if (!btn) return;
    const collapsed = d.getAttribute('data-collapsed') !== 'false';
    btn.textContent = collapsed ? more : less;
  });
}
// Optional: react to language changes if you keep i18n in menu page
window.addEventListener('site:langchange', (e) => {
  state.lang = e.detail?.lang || state.lang;
  if (typeof renderSections === 'function') renderSections();
  render();
  refreshDescToggleLabels();   // <-- harmless extra; ensures labels match if not rebuilt
});

