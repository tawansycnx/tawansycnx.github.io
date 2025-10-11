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

    function parseBadges(v){ if(!v) return []; const s=String(v).replace(/^\s*\"|\"\\s*$/g,''); return s.split(/\\s*,\\s*|\\s*[|;]+\\s*/).map(x=>x.trim()).filter(Boolean); }

    function formatPrice(v){ if(v===undefined||v===null||v==='') return ''; const n=Number(v); return CURRENCY+(isNaN(n)?v:n.toLocaleString()); }

    // Language display rules
    function pickLang(it, lang){
      if(lang==='th') return { main: it.th_name||it.en_name||'', sub: it.en_name||'', desc: it.desc_th||'' };
      if(lang==='cn') return { main: it.cn_name||it.en_name||'', sub: it.en_name||'', desc: it.desc_cn||it.desc_en||'' };
      return { main: it.en_name||it.th_name||'', sub: it.th_name||'', desc: it.desc_en||'' }; // default EN
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

    // Mobile language cycler
    const langCycleBtn = document.getElementById('lang-cycle');
    if (langCycleBtn) {
        const order = ['en', 'th', 'cn'];
        function labelFor(lang) {
            if (lang === 'th') return 'LANG: ไทย';
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
            try { 
                localStorage.setItem('LANG', state.lang); 
            } catch {}
            document.documentElement.setAttribute('lang', state.lang);
        }
        langCycleBtn.textContent = labelFor(state.lang || 'en');
        langCycleBtn.addEventListener('click', cycleLang);
    }

    
    function showNotice(msg){ notice.textContent = msg; notice.style.display='block'; }

    function closeDrawer(){ catDrawer.classList.remove('open'); catDrawer.setAttribute('aria-hidden','true'); hamburger.setAttribute('aria-expanded','false'); }
    function openDrawer(){ catDrawer.classList.add('open'); catDrawer.setAttribute('aria-hidden','false'); hamburger.setAttribute('aria-expanded','true'); }

    hamburger.addEventListener('click',()=>{
      const expanded = hamburger.getAttribute('aria-expanded')==='true';
      if(expanded) closeDrawer(); else openDrawer();
    });
    catDrawer.addEventListener('click',(e)=>{ if(e.target===catDrawer) closeDrawer(); });

    // ====== RENDER SECTIONS (pills + drawer) ======
    function renderSections(){
      const cats = (state.categories && state.categories.length) ? state.categories : SAMPLE_CATEGORIES;
      const all = cats.find(c=>String(c.id)==='all') || {id:'all', en_name:'All', th_name:'ทั้งหมด', cn_name:'全部', order:0};
      const rest = cats.filter(c=>String(c.id)!=='all').slice().sort((a,b)=> (Number(a.order||999)-Number(b.order||999)) || String(a.en_name||'').localeCompare(String(b.en_name||'')));
      const full = [all, ...rest];

      // Header pills (desktop)
      sectionPills.innerHTML = full.map(c=>{
        const pressed = String(state.cat)===String(c.id) || (state.cat==='all' && String(c.id)==='all');
        return `<button class="pill" data-cat-id="${c.id}" aria-pressed="${pressed? 'true':'false'}">${catLabel(c, state.lang)}</button>`;
      }).join('');

      // Drawer list (mobile)
      drawerList.innerHTML = full.map(c=>{
        const pressed = String(state.cat)===String(c.id) || (state.cat==='all' && String(c.id)==='all');
        return `<button class="pill" role="menuitem" data-cat-id="${c.id}" aria-pressed="${pressed? 'true':'false'}">${catLabel(c, state.lang)}</button>`;
      }).join('');

      const bind = (root)=>[...root.querySelectorAll('.pill')].forEach(btn=>{
        btn.addEventListener('click', ()=>{
          // toggle pressed states in both places
          [...document.querySelectorAll('#sectionPills .pill, #drawerList .pill')].forEach(x=>x.setAttribute('aria-pressed','false'));
          const id=btn.dataset.catId; state.cat = id;
          [...document.querySelectorAll(`#sectionPills .pill[data-cat-id="${id}"] , #drawerList .pill[data-cat-id="${id}"]`)].forEach(x=>x.setAttribute('aria-pressed','true'));
          closeDrawer();
          render();
        });
      });
      bind(sectionPills); bind(drawerList);
    }

    // ====== RENDER MENU ======
    function render(){
      const term=state.q.toLowerCase();
      const cats = (state.categories && state.categories.length) ? state.categories : SAMPLE_CATEGORIES;

      const filtered=state.items.filter(it=>{
        const opts=parseOptions(it.options);
        const itemCatId = getItemCategoryId(it, cats);
        const catOK = state.cat==='all' || String(itemCatId)===String(state.cat);
        const hay=[it.prefix,it.en_name,it.th_name,it.cn_name,it.desc_en,it.desc_th,it.desc_cn,opts.map(o=>o.label).join(' ')].join(' ').toLowerCase();
        return catOK && (!term || hay.includes(term));
      });

      grid.innerHTML = filtered.map(it=>{
        const view = pickLang(it, state.lang);
        const prefix = (it.prefix || it.item_prefix || '').trim();
        const title = `${prefix? prefix+' ' : ''}${view.main}`;
        const opts = parseOptions(it.options);
        const hasVariants = opts.length>0;
        const variantsHTML = hasVariants ? (
          `<div class="variants" role="list" aria-label="Price options">${opts.map(o=>`<span class="var-item" role="listitem">${o.label}${Number.isFinite(o.price)?` — ${formatPrice(o.price)}`:''}</span>`).join('')}</div>`
        ) : '';
        const singlePriceHTML = !hasVariants ? `<div class="single-price" aria-label="Price">${formatPrice(it.price)}</div>` : '';
        const badgesArr = parseBadges(it.badges);
        const badgesHTML = badgesArr.map(b=>`<span class="badge ${b}">${b}</span>`).join('');

        // Build the image HTML (thumbnail uses same URL; browsers will size it down)
        const imgHTML = it.image_url
          ? `<img src="${it.image_url}" loading="lazy" alt="${view.main}" data-full="${it.image_url}">`
          : '';

        return `
          <article class="card" tabindex="0" aria-label="${view.main}">
            <button class="imgwrap" data-open-lightbox="true" aria-label="View photo of ${view.main}">${imgHTML}</button>
            <div class="content">
              <div class="names">
                <div class="line"><span class="main">${title}</span><span class="sub">${view.sub}</span></div>
              </div>
            <div class="desc">${view.desc||''}</div>
            <div class="meta">
              ${variantsHTML}
              ${singlePriceHTML}
              <div class="badges">${badgesHTML}</div>
            </div>
          </div>
        </article>`;
      }).join('');
      // Bind lightbox triggers after render
      grid.querySelectorAll('[data-open-lightbox] img').forEach(img=>{
        const wrapper = img.closest('[data-open-lightbox]');
        wrapper.addEventListener('click', ()=> openLightbox(img.dataset.full || img.src, img.alt));
        wrapper.addEventListener('keydown', (e)=>{
          if(e.key==='Enter' || e.key===' '){
            e.preventDefault();
            openLightbox(img.dataset.full || img.src, img.alt);
          }
        });
      });
    }

    // ====== EVENTS ======
    document.getElementById('q').addEventListener('input',()=>{state.q=q.value;render();});

    Object.entries(langBtns).forEach(([k, b]) => {
    if (!b) return;
    b.addEventListener('click', () => {
        state.lang = k;
        Object.values(langBtns).forEach(x => x && x.setAttribute('aria-pressed','false'));
        b.setAttribute('aria-pressed','true');
        if (typeof renderSections === 'function') 
            renderSections();
        render();
        // persist global language so menu page uses the same
        try { localStorage.setItem('LANG', state.lang); } catch {}
        document.documentElement.setAttribute('lang', state.lang);
    });
    });    

    // ====== LOADERS ======
    async function loadItems(){
      try{
        if(MENU_CSV_URL){
          if(location.protocol==='file:'){
            showNotice('Opening from file:// blocks Google Sheets CSV by CORS. Serve over HTTP (Netlify/GitHub Pages/local server).');
          }
          const resp = await fetch(MENU_CSV_URL, {mode:'cors'});
          if(!resp.ok) throw new Error('Menu fetch failed');
          const text = await resp.text();
          const rows = parseCSV(text);
          state.items = rows.map(r=>({
            id:r.id||r.ID||'',
            prefix:r.prefix||r.item_prefix||r.Prefix||r.Item_prefix||'',
            category:r.category||r.Category||'',
            category_id:r.category_id||r.Category_id||r.cat_id||'',
            en_name:r.en_name||r.English||r.en||r.name_en||'',
            th_name:r.th_name||r.Thai||r.th||r.name_th||'',
            cn_name:r.cn_name||r.Chinese||r.cn||r.name_cn||'',
            price:r.price||r.Price||'',
            desc_en:r.desc_en||r.Description_en||r.en_desc||r.Description||'',
            desc_th:r.desc_th||r.Description_th||r.th_desc||'',
            desc_cn:r.desc_cn||r.Description_cn||r.cn_desc||'',
            image_url:r.image_url||r.Image||r.image||'',
            badges:r.badges||r.Badges||'',
            options:r.options||r.Variants||r.variant||r.variant_options||''
          }));
          if(!state.items.length) showNotice('Menu sheet loaded but no rows found. Check the tab & headers.');
        } else {
          state.items = SAMPLE_ITEMS;
        }
      }catch(e){
        console.error(e);
        showNotice('Could not load menu from Google Sheets (CORS or URL). Using fallback sample items.');
        if(!state.items.length){ state.items = SAMPLE_ITEMS; }
      }
    }

    async function loadCategories(){
      try{
        if(CATEGORY_CSV_URL){
          if(location.protocol==='file:'){
            showNotice('Opening from file:// blocks Google Sheets CSV by CORS. Serve over HTTP (Netlify/GitHub Pages/local server).');
          }
          const resp = await fetch(CATEGORY_CSV_URL, {mode:'cors'});
          if(!resp.ok) throw new Error('Category fetch failed');
          const text = await resp.text();
          const rows = parseCSV(text);
          const cats = rows.map(r=>({
            id: (r.id||r.ID||r.cat_id||'').trim() || 'all',
            en_name: r.en_name||r.English||r.name_en||r.label_en||'',
            th_name: r.th_name||r.Thai||r.name_th||r.label_th||'',
            cn_name: r.cn_name||r.Chinese||r.name_cn||r.label_cn||'',
            order: Number(r.order||r.sort||r.idx||999)
          }));
          const hasAll = cats.some(c=>String(c.id)==='all');
          state.categories = hasAll ? cats : [{id:'all', en_name:'All', th_name:'ทั้งหมด', cn_name:'全部', order:0}, ...cats];
        } else {
          state.categories = SAMPLE_CATEGORIES;
        }
      }catch(e){
        console.error(e);
        showNotice('Could not load categories from Google Sheets. Using fallback sample categories.');
        state.categories = SAMPLE_CATEGORIES;
      }
    }

    // ====== INIT ======
    (async function init(){
      await Promise.all([loadItems(), loadCategories()]);
      renderSections();
      render();
    })();
