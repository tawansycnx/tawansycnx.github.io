// ===== Config: data source for landing's signature dishes =====
const MENU_JSON_URL = "./menu/data/menu.json"; // relative to index.html

// ===== Global language state =====
const state = { lang: "en" };

// Resolve initial language from ?lang=, localStorage, or default EN
(function resolveInitialLang(){
  const params = new URLSearchParams(location.search);
  const q = (params.get("lang") || "").toLowerCase();
  const allowed = ["en","th","cn","zh"];
  if (allowed.includes(q)) {
    state.lang = (q === "zh" ? "cn" : q);
    try { localStorage.setItem("LANG", state.lang); } catch {}
  } else {
    try {
      const saved = (localStorage.getItem("LANG") || "").toLowerCase();
      if (["en","th","cn"].includes(saved)) state.lang = saved;
    } catch {}
  }
  document.documentElement.setAttribute("lang", state.lang);
})();

// ===== i18n strings (same keys as used by your landing page data-i18n attrs) =====
const I18N = {
  en: {
    nav_home:"Home", nav_about:"About Us", nav_menu:"Menu", nav_contact:"Contact Us",
    tagline:"Not just a restaurant.", subtag:"A cozy modern-fusion kitchen in Chiang Mai.",
    cta_menu:"View Our Menu", cta_findus:"Find Us",
    about_title:"About Us",
    about_p1:"We blend Thai flavors with Western comfort in a cozy, home-style setting. Every dish is cooked to order using fresh ingredients.",
    about_p2:"Relax, share, and enjoy food that’s simple, warm, and welcoming—just like home.",
    sig_title:"Signature Dishes",
    contact_title:"Contact & Hours",
    address_label:"Address:", address_val:"Chiang Mai, Thailand",
    phone_label:"Phone:", hours_label:"Hours:", hours_val:"Daily 12:00 – 24:00",
    footer_note:"Not just a restaurant."
  },
  th: {
    nav_home:"หน้าหลัก", nav_about:"เกี่ยวกับเรา", nav_menu:"เมนู", nav_contact:"ติดต่อเรา",
    tagline:"มากกว่าร้านอาหารทั่วไป", subtag:"ครัวฟิวชันสไตล์โฮมมี่ที่เชียงใหม่",
    cta_menu:"ดูเมนู", cta_findus:"ไปที่ร้าน",
    about_title:"เกี่ยวกับเรา",
    about_p1:"เราผสมผสานรสชาติแบบไทยกับความคุ้นเคยสไตล์ตะวันตก ในบรรยากาศอบอุ่นเหมือนอยู่บ้าน ทุกจานปรุงสดใหม่",
    about_p2:"พักผ่อน แบ่งปัน และอร่อยกับอาหารที่เรียบง่าย อบอุ่น เป็นกันเอง — เหมือนอยู่บ้าน",
    sig_title:"เมนูแนะนำ",
    contact_title:"ติดต่อ & เวลาเปิดทำการ",
    address_label:"ที่อยู่:", address_val:"เชียงใหม่ ประเทศไทย",
    phone_label:"โทร:", hours_label:"เวลา:", hours_val:"เปิดทุกวัน 12:00 – 24:00",
    footer_note:"มากกว่าร้านอาหารทั่วไป"
  },
  cn: {
    nav_home:"首页", nav_about:"关于我们", nav_menu:"菜单", nav_contact:"联系我们",
    tagline:"不仅仅是一家餐厅", subtag:"清迈的温暖现代融合小厨房",
    cta_menu:"查看菜单", cta_findus:"导航到我们",
    about_title:"关于我们",
    about_p1:"我们把泰式风味与西式家常相结合，在温馨的家常氛围中，每道菜现点现做，选用新鲜食材。",
    about_p2:"放松、分享，享受简单、温暖、亲切的美味—就像在家一样。",
    sig_title:"招牌菜",
    contact_title:"联系与营业时间",
    address_label:"地址：", address_val:"泰国清迈",
    phone_label:"电话：", hours_label:"营业：", hours_val:"每日 12:00 – 24:00",
    footer_note:"不仅仅是一家餐厅"
  }
};

function applyI18n(){
  const dict = I18N[state.lang] || I18N.en;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
}

// ===== Language buttons (in header) =====
const langBtns = {
  en: document.getElementById("lang-en"),
  th: document.getElementById("lang-th"),
  cn: document.getElementById("lang-cn")
};

function setLanguage(next){
  state.lang = next;
  try { localStorage.setItem("LANG", next); } catch {}
  document.documentElement.setAttribute("lang", next);
  Object.entries(langBtns).forEach(([k,b])=>{ if(b) b.setAttribute("aria-pressed", k===next ? "true":"false"); });
  // Update URL ?lang=
  const u = new URL(location.href);
  u.searchParams.set("lang", next);
  history.replaceState({}, "", u);
  applyI18n();
  renderSignatures(lastLoadedItems);
}

Object.entries(langBtns).forEach(([k,b])=>{
  if(!b) return;
  b.addEventListener("click", ()=>setLanguage(k));
});
Object.entries(langBtns).forEach(([k,b])=>{
  if(b) b.setAttribute("aria-pressed", k===state.lang ? "true" : "false");
});

// ===== Hamburger drawer =====
const ham = document.getElementById("hamburger");
const drawer = document.getElementById("appDrawer");
const drawerClose = document.getElementById("drawerClose");
function openDrawer(){ if(drawer){ drawer.classList.add("open"); drawer.setAttribute("aria-hidden","false"); ham.setAttribute("aria-expanded","true"); } }
function closeDrawer(){ if(drawer){ drawer.classList.remove("open"); drawer.setAttribute("aria-hidden","true"); ham.setAttribute("aria-expanded","false"); } }
if (ham) ham.addEventListener("click", openDrawer);
if (drawer) drawer.addEventListener("click", e => { if(e.target === drawer) closeDrawer(); });
if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
window.addEventListener("keydown", e => { if(e.key === "Escape") closeDrawer(); });

// ===== Signature dishes (preview from menu.json) =====
let lastLoadedItems = [];
async function loadSignatures() {
  try {
    console.log("🟢 Trying to load menu from CSV:", MENU_CSV_URL);
    const resp = await fetch(MENU_CSV_URL, { cache: "no-store" });
    if (!resp.ok) throw new Error("CSV not found");

    const text = await resp.text();
    const rows = parseCSV(text);

    // Map columns dynamically — case-insensitive.
    const items = rows.map(r => ({
      id: r.id || r.ID || "",
      prefix: r.prefix || r.Prefix || "",
      en_name: r.en_name || r.English || r.name_en || "",
      th_name: r.th_name || r.Thai || r.name_th || "",
      cn_name: r.cn_name || r.Chinese || r.name_cn || "",
      desc_en: r.desc_en || r.Description_en || r.en_desc || "",
      desc_th: r.desc_th || r.Description_th || r.th_desc || "",
      desc_cn: r.desc_cn || r.Description_cn || r.cn_desc || "",
      image_url: r.image_url || r.Image || r.image || "",
      sig: (r.sig || r.SIG || "0").trim()
    }))
    .filter(x => x.sig === "1");

    const selected = items.slice(0, 6);
    console.log(`✅ Loaded ${selected.length} signature items from CSV`);
    renderSignatures(selected);
    return;
  } catch (e) {
    console.warn("⚠️ CSV failed, falling back to JSON:", e);
  }

  try {
    console.log("🟢 Trying to load menu from JSON:", MENU_JSON_URL);
    const resp = await fetch(MENU_JSON_URL, { cache: "no-store" });
    if (!resp.ok) throw new Error("JSON not found");
    const data = await resp.json();
    const arr = Array.isArray(data) ? data : (data.items || []);
    const filtered = arr.filter(i => String(i.sig || "0") === "1");
    const selected = filtered.slice(0, 6);
    console.log(`✅ Loaded ${selected.length} signature items from JSON`);
    renderSignatures(selected);
  } catch (err) {
    console.error("❌ Both CSV and JSON failed:", err);
    renderSignatures([]);
  }
}

// Re-render landing content when the shared header changes language
window.addEventListener('site:langchange', (e) => {
  const next = e.detail?.lang;
  if (next) state.lang = next;
  applyI18n();
  renderSignatures(lastLoadedItems);
});

function pickLangItem(it){
  if (state.lang === "th") return { main: it.th_name || it.en_name || "", sub: it.en_name || "", desc: it.desc_th || "" };
  if (state.lang === "cn") return { main: it.cn_name || it.en_name || "", sub: it.en_name || "", desc: it.desc_cn || it.desc_en || "" };
  return { main: it.en_name || it.th_name || it.cn_name || "", sub: it.th_name || "", desc: it.desc_en || it.desc_th || it.desc_cn || "" };
}
function buildImageVariants(url){
  if(!url) return { thumb:"", large:"" };
  const m = String(url).match(/^(.*?)(?:-(?:320|640|1024))?\.(jpg|jpeg|png|webp)$/i);
  if(!m) return { thumb:url, large:url };
  const base=m[1];
  return { thumb:`${base}-320.webp`, large:`${base}-640.webp` };
}
function renderSignatures(list){
  const grid = document.getElementById("sigGrid");
  if(!grid) return;
  grid.innerHTML = list.map(it=>{
    const v = pickLangItem(it);
    const { thumb } = buildImageVariants(it.image_url || "");
    const name = (it.prefix ? `<span class="prefix">${String(it.prefix).trim()}</span> ` : "") + `<span class="main">${v.main}</span>`;
    return `
      <article class="card">
        <div class="img">${ thumb ? `<img src="${thumb}" alt="${v.main}" loading="lazy">` : "" }</div>
        <div class="body">
          <div class="name">${name}</div>
          <div class="desc">${v.desc || ""}</div>
        </div>
      </article>
    `;
  }).join("");
}

// Footer year + i18n + load data
document.addEventListener("DOMContentLoaded", ()=>{
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
  applyI18n();
  loadSignatures();
});

