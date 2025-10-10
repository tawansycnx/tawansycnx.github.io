    // ====== CONFIG (SET THESE) ======
    // Use Google Sheets “Publish to the web” CSV links:
    const MENU_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5NTS1_pewr_dMUaUafyIaEAqdevTSp556N06eI_cJzCVh2YoYP79gVPUBMPNVc6tSObFKyU9NApEy/pub?gid=0&single=true&output=csv"; // publish-to-web CSV link; leave empty to use SAMPLE_DATA
    const CATEGORY_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSoqCiw-U0_Lc_7WHp3iNI4_pOwoTqs3nnzs4MyXIUICEh0lmekApWg1beEmf7lNSYI46EvmqBNu_pN/pub?gid=0&single=true&output=csv"; // Categories CSV publish-to-web link (optional)
    const CURRENCY = '฿';

   // ====== FALLBACK SAMPLES (only used if URLs empty or fail) ======
    const SAMPLE_ITEMS = [
      { id:"001", prefix:"1-1", category:"Soups", category_id:"1", en_name:"Tom Yum Soup", th_name:"ต้มยำ", zh_name:"冬阴功汤", desc_en:"Hot & sour lemongrass soup.", desc_th:"ซุปสมุนไพร เปรี้ยวเผ็ด", desc_zh:"香茅酸辣汤", price:"", options:"Chicken=129|Prawn=149|Tofu=119", image_url:"images/tomyum.jpg", badges:"spicy,new" },
      { id:"002", prefix:"5-1", category:"Spaghetti", category_id:"5", en_name:"Carbonara", th_name:"คาโบนารา", zh_name:"培根蛋意面", desc_en:"Creamy egg sauce with bacon.", desc_th:"ซอสครีมไข่กับเบคอน", desc_zh:"奶香培根蛋酱", price:159, options:"", image_url:"images/carbonara.jpg", badges:"" },
      { id:"003", prefix:"6-1", category:"Som Tum", category_id:"6", en_name:"Som Tum Thai", th_name:"ส้มตำไทย", zh_name:"泰式青木瓜沙拉", desc_en:"Green papaya salad.", desc_th:"ส้มตำรสกลมกล่อม", desc_zh:"酸辣爽脆", price:79, options:"", image_url:"images/somtum.jpg", badges:"spicy" }
    ];

    const SAMPLE_CATEGORIES = [
      { id: "all", en_name: "All", th_name: "ทั้งหมด", zh_name: "全部", order: 0 },
      { id: 1, en_name: "Soups", th_name: "ซุป", zh_name: "汤类", order: 1 },
      { id: 2, en_name: "Salads", th_name: "สลัด", zh_name: "沙拉", order: 2 },
      { id: 3, en_name: "Appetizers", th_name: "อาหารทานเล่น", zh_name: "前菜", order: 3 },
      { id: 4, en_name: "Burgers", th_name: "เบอร์เกอร์", zh_name: "汉堡", order: 4 },
      { id: 5, en_name: "Spaghetti", th_name: "สปาเก็ตตี้", zh_name: "意面", order: 5 },
      { id: 6, en_name: "Som Tum", th_name: "ส้มตำ", zh_name: "青木瓜沙拉", order: 6 },
      { id: 7, en_name: "Curries", th_name: "แกง", zh_name: "咖喱", order: 7 },
      { id: 8, en_name: "One Dish", th_name: "จานเดียว", zh_name: "盖饭/单盘", order: 8 },
      { id: 9, en_name: "Fried Grills", th_name: "ทอด/ย่าง", zh_name: "炸/烤", order: 9 },
      { id:10, en_name: "Stir-fries", th_name: "ผัด", zh_name: "炒菜", order: 10 }
    ];

