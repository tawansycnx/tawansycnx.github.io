// ===== Config: data source for landing's signature dishes =====
const MENU_JSON_URL = "./menu/data/menu.json"; // relative to index.html

// ===== Global language state =====
const state = { lang: "en" };

// Resolve initial language from ?lang=, localStorage, or default EN
state.lang = (window.Site && Site.lang) || "en"; // language is handled by site.js

// ===== i18n strings (same keys as used by your landing page data-i18n attrs) =====
const I18N = {
  en: {
    hero_p1:"A place where good food meets genuine connection — where guests become friends, and friends become family.",
    hero_p2:'We <span class="highlight">cook</span>, we <span class="highlight">connect</span>, we <span class="highlight">care</span>.',
    hero_p3:"Every meal comes with warmth, stories, and support — a space built on kindness, food, and community.",
    tagline:"Not just a restaurant.", subtag:"A cozy modern-fusion kitchen in Chiang Mai.",
    cta_menu:"View Our Menu", cta_findus:"Find Us",
    about_title:"About Us",
    about_p1:"We blend Thai flavors with Western comfort in a cozy, home-style setting. Every dish is cooked to order using fresh ingredients.",
    about_p2:"Relax, share, and enjoy food that’s simple, warm, and welcoming—just like home.",
    sig_title:"Signature Dishes",
    contact_title:"Contact & Hours",
    address_label:"Address:",
    phone_label:"Phone:", hours_label:"Hours:",
    footer_note:"Not just a restaurant."
  },
  th: {
    hero_p1:"สถานที่ที่อาหารอร่อยมาพบกับมิตรภาพที่จริงใจ — ที่ซึ่งแขกกลายเป็นเพื่อน และเพื่อนกลายเป็นครอบครัว",
    hero_p2:'เรา<span class="highlight">ปรุง</span> เรา<span class="highlight">ผูกพัน</span> เรา<span class="highlight">ใส่ใจ</span>',
    hero_p3:"ทุกมื้อมาพร้อมความอบอุ่น เรื่องราว และกำลังใจ — พื้นที่ที่สร้างขึ้นจากน้ำใจ อาหาร และชุมชน",
    tagline:"มากกว่าร้านอาหารทั่วไป", subtag:"ครัวฟิวชันสไตล์โฮมมี่ที่เชียงใหม่",
    cta_menu:"ดูเมนู", cta_findus:"ไปที่ร้าน",
    about_title:"เกี่ยวกับเรา",
    about_p1:"เราผสมผสานรสชาติแบบไทยกับความคุ้นเคยสไตล์ตะวันตก ในบรรยากาศอบอุ่นเหมือนอยู่บ้าน ทุกจานปรุงสดใหม่",
    about_p2:"พักผ่อน แบ่งปัน และอร่อยกับอาหารที่เรียบง่าย อบอุ่น เป็นกันเอง — เหมือนอยู่บ้าน",
    sig_title:"เมนูแนะนำ",
    contact_title:"ติดต่อ & เวลาเปิดทำการ",
    address_label:"ที่อยู่:",
    phone_label:"โทร:", hours_label:"เวลา:",
    footer_note:"มากกว่าร้านอาหารทั่วไป"
  },
  cn: {
    hero_p1:"在这里，美食与真诚的情谊相遇——客人成为朋友，朋友成为家人。",
    hero_p2:'我们<span class="highlight">烹饪</span>，我们<span class="highlight">相聚</span>，我们<span class="highlight">关怀</span>。',
    hero_p3:"每一餐都伴随着温暖、故事与支持——这里是由善意、美食与社区共同构筑的空间。",
    tagline:"不仅仅是一家餐厅", subtag:"清迈的温暖现代融合小厨房",
    cta_menu:"查看菜单", cta_findus:"导航到我们",
    about_title:"关于我们",
    about_p1:"我们把泰式风味与西式家常相结合，在温馨的家常氛围中，每道菜现点现做，选用新鲜食材。",
    about_p2:"放松、分享，享受简单、温暖、亲切的美味—就像在家一样。",
    sig_title:"招牌菜",
    contact_title:"联系与营业时间",
    address_label:"地址：",
    phone_label:"电话：", hours_label:"营业：",
    footer_note:"不仅仅是一家餐厅"
  }
};

function applyI18n(){
  const dict = I18N[state.lang] || I18N.en;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  // keys that contain formatting (e.g. highlighted words)
  document.querySelectorAll("[data-i18n-html]").forEach(el=>{
    const key = el.getAttribute("data-i18n-html");
    if (dict[key]) el.innerHTML = dict[key];
  });
}

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

