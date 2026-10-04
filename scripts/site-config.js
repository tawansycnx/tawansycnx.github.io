/* =====================================================================
   SITE SETTINGS — the ONE place to edit site-wide information.
   - Text in 3 languages is written as { en: "...", th: "...", cn: "..." }.
     If a language is missing, English is shown.
   - Links (href) are written from the website's main folder,
     e.g. "menu/menu.html" or "tools/qrcode.html" (no "../" needed).
   Careful: keep the commas and quotes exactly as they are.
   ===================================================================== */
window.SITE_CONFIG = {

  name: "Tawansy Restaurant & Cafe",

  // ---------- Main navigation (the ☰ menu) ----------
  // Add a page: copy one line, change the label and href.
  // Order here = order in the menu.
  nav: [
    { label: { en: "Home",       th: "หน้าหลัก",   cn: "首页" },     href: "index.html" },
    { label: { en: "About Us",   th: "เกี่ยวกับเรา", cn: "关于我们" }, href: "index.html#about" },
    { label: { en: "Menu",       th: "เมนู",       cn: "菜单" },     href: "menu/menu.html", submenu: "menu-categories" },
    { label: { en: "Contact Us", th: "ติดต่อเรา",   cn: "联系我们" }, href: "index.html#contact" },
    { label: { en: "QR Code Generator", th: "สร้าง QR Code", cn: "二维码生成器" }, href: "tools/qrcode.html" }
  ],

  // ---------- Contact details (used wherever the page asks for them) ----------
  // NOTE: if the address, phone or hours change, also update the "Restaurant details
  // for Google" block at the top of index.html.
  contact: {
    phone: "+66803913698",                 // used for the tap-to-call link
    phoneDisplay: "+66 (0)80-391-3698",    // what people see
    address: {
      en: "26/7 Huay Kaew Rd, Chang Phueak, Mueang Chiang Mai District, Chiang Mai 50300",
      th: "26/7 ถนนห้วยแก้ว ตำบลช้างเผือก อำเภอเมืองเชียงใหม่ จังหวัดเชียงใหม่ 50300"
    },
    hours: { en: "Daily 12:00 – 24:00", th: "เปิดทุกวัน 12:00 – 24:00", cn: "每日 12:00 – 24:00" },
    mapLink: "https://maps.google.com/?cid=6287539504188407124"
  },

  // ---------- Social / order links (icons in the Contact section) ----------
  // To hide one, put // at the start of its line.
  social: [
    { name: "Facebook",  url: "https://www.facebook.com/tawansyplus",  icon: "images/res/fb-64.png" },
    { name: "Instagram", url: "https://www.instagram.com/tawansycnx/", icon: "images/res/ig-64.png" },
    // { name: "LINE",   url: "https://line.me/ti/p/YourLineID",       icon: "images/res/line-64.png" },
    { name: "GrabFood",  url: "https://r.grab.com/g/6-20251109_132047_2a6c867e32e2461ab5104383fbd87946_MEXMPS-3-C7KGTXX1LRA1A2", icon: "images/res/grab-64.png" },
    { name: "WhatsApp",  url: "https://wa.me/66803913698",             icon: "images/res/wa-64.png" }
  ],

  // ---------- Shared words used on every page ----------
  text: {
    footer_note:  { en: "Not just a restaurant.", th: "มากกว่าร้านอาหารทั่วไป", cn: "不仅仅是一家餐厅" },
    search:       { en: "Search...", th: "ค้นหา...", cn: "搜索..." },
    menu_open:    { en: "Open menu", th: "เปิดเมนู", cn: "打开菜单" }
  }
};
