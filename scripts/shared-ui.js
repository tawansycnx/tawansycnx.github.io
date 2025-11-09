(function(){
  const state = { lang: 'en' };
  const allowed = ['en','th','cn','zh'];

  // STRICT: Only true on /menu/* pages
  function isMenuPage(){ return location.pathname.includes('/menu/'); }

  // BROAD: True on any subfolder page that needs "../" paths
  function isSubPage(){ return /\/(menu|tools)\//.test(location.pathname); }

  function baseHref(){
    // for href building from any subfolder page
    return isSubPage() ? '..' : '.';
  }

  // Resolve initial language
  function initLang(){
    const params = new URLSearchParams(location.search);
    const q = (params.get('lang') || '').toLowerCase();
    if (allowed.includes(q)) {
      state.lang = (q === 'zh' ? 'cn' : q);
      try { localStorage.setItem('LANG', state.lang); } catch {}
    } else {
      try {
        const saved = (localStorage.getItem('LANG') || '').toLowerCase();
        if (['en','th','cn'].includes(saved)) state.lang = saved;
      } catch {}
    }
    document.documentElement.setAttribute('lang', state.lang);
    const sel = document.getElementById('langSelect');
    if (sel) sel.value = state.lang;
  }

  // Update language
  function setLanguage(next){
    state.lang = next;
    try { localStorage.setItem('LANG', next); } catch {}
    document.documentElement.setAttribute('lang', next);
    const u = new URL(location.href);
    u.searchParams.set('lang', next);
    history.replaceState({}, '', u);
    window.dispatchEvent(new CustomEvent('site:langchange', {detail:{lang: next}}));
  }

  // Build internal links
  function wireLinks(){
    const base = baseHref();
    document.querySelectorAll('[data-link]').forEach(a=>{
      const key = a.getAttribute('data-link');
      if (key === 'home')    a.setAttribute('href', base + '/');
      if (key === 'about')   a.setAttribute('href', base + '/#about');
      if (key === 'menu')    a.setAttribute('href', base + '/menu/menu.html');
      if (key === 'contact') a.setAttribute('href', base + '/#contact');
      // inside wireLinks()
      if (key === 'tools-qrcode') a.setAttribute('href', base + '/tools/qrcode.html');
    });
  }

  // Drawer
  function wireDrawer(){
    const ham = document.getElementById('hamburger');
    const drawer = document.getElementById('appDrawer');
    const closeBtn = document.getElementById('drawerClose');
    function open(){ if(drawer){ drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); if(ham) ham.setAttribute('aria-expanded','true'); } }
    function close(){ if(drawer){ drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); if(ham) ham.setAttribute('aria-expanded','false'); } }
    if (ham) ham.addEventListener('click', open);
    if (drawer) drawer.addEventListener('click', e=>{ if(e.target === drawer) close(); });
    if (closeBtn) closeBtn.addEventListener('click', close);
    window.addEventListener('keydown', e=>{ if(e.key === 'Escape') close(); });

    // Expandable "Menu" submenu only on the /menu/ page.
    // On landing (or any non-/menu/ page), clicking "Menu" navigates.
    const parent = document.getElementById('menuParent');
    const sub = document.getElementById('menuSub');

    if (parent) {
      // Always start collapsed; drawer open should NOT auto-expand
      parent.setAttribute('aria-expanded', 'false');
      if (sub) sub.hidden = true;

      parent.onclick = null; // clear any prior handlers
      parent.addEventListener('click', (e) => {
        e.stopPropagation();

        if (!isMenuPage()) {
          // Navigate to menu page (preserve lang in URL)
          const base = baseHref();                  // '.' on landing, '..' under /menu/
          const u = new URL(base + '/menu/menu.html', location.href);
          if (state?.lang) u.searchParams.set('lang', state.lang);
          // Close drawer before navigating for a smooth UX
          const drawer = document.getElementById('appDrawer');
          if (drawer) { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); }
          const ham = document.getElementById('hamburger');
          if (ham) ham.setAttribute('aria-expanded','false');

          location.assign(u.toString());
          return;
        }

        // On /menu/: toggle submenu visibility
        const isOpen = parent.getAttribute('aria-expanded') === 'true';
        parent.setAttribute('aria-expanded', String(!isOpen));
        if (sub) sub.hidden = isOpen;
      });
    }
  }

  // Load categories into submenu on /menu/
  async function populateMenuSub(){
    if (!isMenuPage()) return;
    const sub = document.getElementById('menuSub');
    const parent = document.getElementById('menuParent');
    if (!sub || !parent) return;

    // categories.json path relative to current page
    const url = new URL('./data/categories.json', location.href).toString();
    try{
      const resp = await fetch(url, {cache:'no-store'});
      if (!resp.ok) throw new Error(resp.status);
      const data = await resp.json();
      const rows = Array.isArray(data) ? data : (data.categories || []);
      const cats = rows.slice().sort((a,b)=>(a.order??999)-(b.order??999));
      sub.innerHTML = cats.map(c=>{
        const id = String(c.id);
        // show label per current language
        const label = (state.lang==='th') ? (c.th_name || c.en_name || '') :
                      (state.lang==='cn') ? (c.cn_name || c.en_name || '') :
                                            (c.en_name || '');
        return `<button class="subitem" data-cat="${id}">${label}</button>`;
      }).join('');

      // Keep submenu collapsed by default
      if (parent) parent.setAttribute('aria-expanded', 'false');
      if (sub) sub.hidden = true;

      // Wire each category button to notify the menu page
      sub.querySelectorAll('.subitem').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-cat');
          window.dispatchEvent(new CustomEvent('site:category', { detail: { id } }));
          // Close the drawer
          const drawer = document.getElementById('appDrawer');
          if (drawer) { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); }
          const ham = document.getElementById('hamburger');
          if (ham) ham.setAttribute('aria-expanded','false');
        });
      });

      // If language changes, just re-run to refresh labels (stay collapsed)
      window.addEventListener('site:langchange', () => {
        populateMenuSub();
      }, { once: true });

    }catch(e){
      // If categories fail to load, keep the main Menu link as-is.
      console.error('Menu submenu load failed:', e);
    }
  }

  // Wire language select + search bar behavior
  function wireLangAndSearch(){
    const sel = document.getElementById('langSelect');
    if (sel) {
      sel.addEventListener('change', ()=> setLanguage(sel.value));
    }

  // Show search only on /menu/ and forward term to the menu page
  const sb = document.getElementById('menuSearch2x2');
  if (isMenuPage() && sb) {
    sb.hidden = false;
    const q = document.getElementById('q');
    if (q) {
      q.addEventListener('input', () => {
        window.dispatchEvent(new CustomEvent('site:search', { detail: { term: q.value } }));
      });
    }
  }
}

  // Init after includes are inserted
  (async function(){
    await (window._includesReady || Promise.resolve());
    initLang();
    wireLinks();
    wireDrawer();
    wireLangAndSearch();
    populateMenuSub();
    window.dispatchEvent(new Event('site:chrome-ready'));
  })();

  (function setHeaderLogo(){
    const logo = document.querySelector('.h-left .logo');
    if (!logo) return;
    // Use correct relative path depending on current page
    const imgPath = isSubPage() ///\/(menu|tools)\//.test(location.pathname)
      ? '../images/res/logo.webp'
      : './images/res/logo.webp';
    logo.style.backgroundImage = `url("${imgPath}")`;
  })();
})();

// Show search only on /menu/ and forward term to the menu page
const sb = document.getElementById('menuSearch2x2');
if (isMenuPage() && sb) {
  sb.hidden = false;
  const q = document.getElementById('q');
  if (q) {
    q.addEventListener('input', () => {
      window.dispatchEvent(new CustomEvent('site:search', { detail: { term: q.value } }));
    });
  }
}

