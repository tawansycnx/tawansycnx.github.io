/* =====================================================================
   site.js — shared header, footer, navigation and language for EVERY page.
   You normally don't edit this file: change scripts/site-config.js instead.
   Each page loads:  site-config.js  then  site.js  (see _page-template.html)
   Events other scripts can listen to:
     site:langchange  {lang}   site:category {id}   site:search {term}   site:chrome-ready
   ===================================================================== */
(function () {
  const C = window.SITE_CONFIG || {};
  const LANGS = ['en', 'th', 'cn'];

  // Website main folder, worked out from where this file lives (…/scripts/site.js)
  const BASE = new URL('..', (document.currentScript && document.currentScript.src) || location.href).href;
  const url = p => new URL(String(p || '').replace(/^\.?\//, ''), BASE).href;
  const samePage = (a, b) => {
    const clean = u => { const x = new URL(u, location.href); return x.pathname.replace(/\/index\.html$/, '/'); };
    return clean(a) === clean(b);
  };
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------- Language ----------
  let lang = 'en';
  (function initLang() {
    const q = (new URLSearchParams(location.search).get('lang') || '').toLowerCase();
    const fromUrl = q === 'zh' ? 'cn' : q;
    if (LANGS.includes(fromUrl)) { lang = fromUrl; try { localStorage.setItem('LANG', lang); } catch (e) {} }
    else { try { const s = (localStorage.getItem('LANG') || '').toLowerCase(); if (LANGS.includes(s)) lang = s; } catch (e) {} }
    document.documentElement.setAttribute('lang', lang);
  })();

  const pick = (v, l) => (v == null ? '' : typeof v === 'string' ? v : (v[l || lang] || v.en || ''));
  const t = key => pick((C.text || {})[key]);

  function setLang(next) {
    if (!LANGS.includes(next) || next === lang) return;
    lang = next;
    try { localStorage.setItem('LANG', lang); } catch (e) {}
    document.documentElement.setAttribute('lang', lang);
    const u = new URL(location.href); u.searchParams.set('lang', lang); history.replaceState({}, '', u);
    const sel = document.getElementById('langSelect'); if (sel) sel.value = lang;
    renderNav(); fillSiteData(); applyText(); loadCategories();
    window.dispatchEvent(new CustomEvent('site:langchange', { detail: { lang } }));
  }

  window.Site = { base: BASE, url, pick, t, setLang, get lang() { return lang; }, config: C };

  // ---------- Favicons (added only if the page has none) ----------
  if (!document.querySelector('link[rel~="icon"]')) {
    [['icon', 'image/x-icon', 'favicon.ico'], ['icon', 'image/png', 'favicon.png'], ['icon', 'image/svg+xml', 'logo.svg']]
      .forEach(([rel, type, href]) => { const l = document.createElement('link'); l.rel = rel; l.type = type; l.href = url(href); document.head.appendChild(l); });
  }

  // ---------- Header ----------
  const menuItem = () => (C.nav || []).find(n => n.submenu === 'menu-categories');
  const onMenuPage = () => { const m = menuItem(); return !!m && samePage(url(m.href), location.href); };
  const wantsSearch = () => document.body && document.body.hasAttribute('data-search');

  function headerHTML() {
    const home = (C.nav || [])[0];
    return `
<header id="siteHeader">
  <div class="header-2x2 container">
    <div class="h-left">
      <a class="logo" href="${esc(url(home ? home.href : 'index.html'))}" aria-label="Home" style="background-image:url('${esc(url('images/res/logov2-bg-320.webp'))}')"></a>
      <h1 id="siteTitle">${esc(C.name || '')}</h1>
    </div>
    <div class="h-right">
      <div class="h-right-top">
        <img src="${esc(url('images/res/lang.png'))}" alt="Language" class="lang-icon" />
        <select id="langSelect">
          <option value="en">EN</option><option value="th">ไทย</option><option value="cn">中文</option>
        </select>
        <button id="hamburger" class="hamburger" aria-controls="appDrawer" aria-expanded="false">☰</button>
      </div>
      <div id="menuSearch2x2" class="h-right-bottom" hidden>
        <div class="search" role="search"><input id="q" type="search" /></div>
      </div>
    </div>
  </div>
  <div id="appDrawer" class="drawer" aria-hidden="true">
    <div class="drawer-panel container" role="dialog" aria-modal="true" aria-label="Site menu">
      <button class="btn close" id="drawerClose" aria-label="Close">✕</button>
      <nav class="nav-vert" aria-label="Main" id="mainNav"></nav>
    </div>
  </div>
</header>`;
  }

  function footerHTML() {
    return `<footer id="siteFooter"><p>© ${new Date().getFullYear()} ${esc(C.name || '')} • <span data-site-text="footer_note"></span></p></footer>`;
  }

  function renderNav() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    nav.innerHTML = (C.nav || []).map((item, i) => {
      const href = url(item.href);
      const current = samePage(href, location.href) && !/#/.test(item.href) ? ' aria-current="page"' : '';
      if (item.submenu === 'menu-categories') {
        return `<div class="nav-group">
          <button class="nav-parent" id="menuParent" aria-expanded="false" data-href="${esc(href)}"${current}><span>${esc(pick(item.label))}</span></button>
          <div id="menuSub" class="submenu" hidden aria-label="Menu categories"></div></div>`;
      }
      return `<a href="${esc(href)}"${current}>${esc(pick(item.label))}</a>`;
    }).join('');
    const ham = document.getElementById('hamburger'); if (ham) ham.setAttribute('aria-label', t('menu_open') || 'Open menu');
    const q = document.getElementById('q'); if (q) q.placeholder = t('search') || 'Search...';
    wireMenuParent();
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer)); // closes drawer for #about / #contact on the same page
  }

  // ---------- Drawer ----------
  function openDrawer() { const d = document.getElementById('appDrawer'), h = document.getElementById('hamburger'); if (d) { d.classList.add('open'); d.setAttribute('aria-hidden', 'false'); } if (h) h.setAttribute('aria-expanded', 'true'); }
  function closeDrawer() { const d = document.getElementById('appDrawer'), h = document.getElementById('hamburger'); if (d) { d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); } if (h) h.setAttribute('aria-expanded', 'false'); }

  function wireMenuParent() {
    const parent = document.getElementById('menuParent'), sub = document.getElementById('menuSub');
    if (!parent) return;
    parent.addEventListener('click', e => {
      e.stopPropagation();
      if (!onMenuPage()) { closeDrawer(); location.assign(parent.getAttribute('data-href')); return; }
      const open = parent.getAttribute('aria-expanded') === 'true';
      parent.setAttribute('aria-expanded', String(!open));
      if (sub) sub.hidden = open;
    });
  }

  // Menu categories inside the ☰ menu (only on the menu page)
  let catCache = null;
  async function loadCategories() {
    if (!onMenuPage()) return;
    const sub = document.getElementById('menuSub'); if (!sub) return;
    try {
      if (!catCache) {
        const r = await fetch(url('menu/data/categories.json'), { cache: 'no-store' });
        if (!r.ok) throw new Error(r.status);
        const d = await r.json();
        catCache = (Array.isArray(d) ? d : (d.categories || [])).slice().sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
      }
      sub.innerHTML = catCache.map(c => {
        const label = lang === 'th' ? (c.th_name || c.en_name) : lang === 'cn' ? (c.cn_name || c.en_name) : c.en_name;
        return `<button class="subitem" data-cat="${esc(c.id)}">${esc(label || '')}</button>`;
      }).join('');
      sub.querySelectorAll('.subitem').forEach(b => b.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('site:category', { detail: { id: b.getAttribute('data-cat') } }));
        closeDrawer();
      }));
    } catch (e) { console.error('Menu categories failed to load:', e); }
  }

  // ---------- Fill site data on any page ----------
  // <span data-site="address"></span>  phone | hours | name  ·  <a data-site="map">  ·  <div data-site="social">
  function fillSiteData() {
    const c = C.contact || {};
    document.querySelectorAll('[data-site]').forEach(el => {
      const k = el.getAttribute('data-site');
      if (k === 'address') el.textContent = pick(c.address);
      else if (k === 'hours') el.textContent = pick(c.hours);
      else if (k === 'name') el.textContent = C.name || '';
      else if (k === 'phone') { el.textContent = c.phoneDisplay || c.phone || ''; if (el.tagName === 'A') el.href = 'tel:' + (c.phone || ''); }
      else if (k === 'map') el.href = c.mapLink || '#';
      else if (k === 'social') el.innerHTML = (C.social || []).map(s =>
        `<a href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.name)}"><img src="${esc(url(s.icon))}" alt="${esc(s.name)}"></a>`).join('');
    });
  }
  // <span data-site-text="footer_note"></span> -> shared words from site-config.js
  function applyText() {
    document.querySelectorAll('[data-site-text]').forEach(el => { const v = t(el.getAttribute('data-site-text')); if (v) el.textContent = v; });
  }

  // ---------- Build ----------
  function build() {
    const h = document.querySelector('[data-include="header"]'); if (h) h.outerHTML = headerHTML();
    const f = document.querySelector('[data-include="footer"]'); if (f) f.outerHTML = footerHTML();
    renderNav();
    const sel = document.getElementById('langSelect');
    if (sel) { sel.value = lang; sel.addEventListener('change', () => setLang(sel.value)); }
    const ham = document.getElementById('hamburger'); if (ham) ham.addEventListener('click', openDrawer);
    const drawer = document.getElementById('appDrawer'); if (drawer) drawer.addEventListener('click', e => { if (e.target === drawer) closeDrawer(); });
    const x = document.getElementById('drawerClose'); if (x) x.addEventListener('click', closeDrawer);
    window.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
    if (wantsSearch()) {
      const box = document.getElementById('menuSearch2x2'), q = document.getElementById('q');
      if (box) box.hidden = false;
      if (q) q.addEventListener('input', () => window.dispatchEvent(new CustomEvent('site:search', { detail: { term: q.value } })));
    }
    fillSiteData(); applyText(); loadCategories();
    window.dispatchEvent(new Event('site:chrome-ready'));
  }

  // Other scripts can wait for the header/footer:  window._includesReady.then(fn)
  window._includesReady = new Promise(resolve => {
    const go = () => { build(); resolve(); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
  });
})();
