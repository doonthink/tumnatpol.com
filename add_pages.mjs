import fs from 'fs';

let pagesStr = fs.readFileSync('data/pages.json', 'utf8');
let pages = JSON.parse(pagesStr);

const newPages = [
  {
    id: "privacy",
    title: "นโยบายความเป็นส่วนตัว (Privacy Policy)",
    slug: "privacy",
    content: "<div class=\"not-prose\">\n<div class=\"bg-white py-24 sm:py-32 relative overflow-hidden\">\n  <div class=\"mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 relative z-10 text-center\">\n    <h1 class=\"text-4xl font-bold tracking-tight text-[#0D1B3D] sm:text-5xl mb-6\">\n      นโยบายความเป็นส่วนตัว (Privacy Policy)\n    </h1>\n    <p class=\"mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto\">\n      เราให้ความสำคัญกับความเป็นส่วนตัวของคุณและมุ่งมั่นที่จะปกป้องข้อมูลส่วนบุคคลของคุณ...<br><br>(เนื้อหากำลังปรับปรุง)\n    </p>\n  </div>\n</div>\n</div>",
    status: "Published",
    seoDescription: "นโยบายความเป็นส่วนตัวของ BIZ Toptier",
    tags: "privacy, policy",
    headerScript: "",
    footerScript: "",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "terms",
    title: "ข้อกำหนดและเงื่อนไข (Terms of Service)",
    slug: "terms",
    content: "<div class=\"not-prose\">\n<div class=\"bg-white py-24 sm:py-32 relative overflow-hidden\">\n  <div class=\"mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 relative z-10 text-center\">\n    <h1 class=\"text-4xl font-bold tracking-tight text-[#0D1B3D] sm:text-5xl mb-6\">\n      ข้อกำหนดและเงื่อนไข (Terms of Service)\n    </h1>\n    <p class=\"mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto\">\n      โปรดอ่านข้อกำหนดและเงื่อนไขเหล่านี้อย่างละเอียดก่อนใช้บริการของเรา...<br><br>(เนื้อหากำลังปรับปรุง)\n    </p>\n  </div>\n</div>\n</div>",
    status: "Published",
    seoDescription: "ข้อกำหนดและเงื่อนไขของ BIZ Toptier",
    tags: "terms, condition",
    headerScript: "",
    footerScript: "",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "cookies",
    title: "นโยบายคุกกี้ (Cookie Policy)",
    slug: "cookies",
    content: "<div class=\"not-prose\">\n<div class=\"bg-white py-24 sm:py-32 relative overflow-hidden\">\n  <div class=\"mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 relative z-10 text-center\">\n    <h1 class=\"text-4xl font-bold tracking-tight text-[#0D1B3D] sm:text-5xl mb-6\">\n      นโยบายคุกกี้ (Cookie Policy)\n    </h1>\n    <p class=\"mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto\">\n      เว็บไซต์ของเรามีการใช้งานคุกกี้เพื่อมอบประสบการณ์การใช้งานที่ดีที่สุดแก่คุณ...<br><br>(เนื้อหากำลังปรับปรุง)\n    </p>\n  </div>\n</div>\n</div>",
    status: "Published",
    seoDescription: "นโยบายคุกกี้ของ BIZ Toptier",
    tags: "cookies, policy",
    headerScript: "",
    footerScript: "",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "pdpa",
    title: "นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)",
    slug: "pdpa",
    content: "<div class=\"not-prose\">\n<div class=\"bg-white py-24 sm:py-32 relative overflow-hidden\">\n  <div class=\"mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 relative z-10 text-center\">\n    <h1 class=\"text-4xl font-bold tracking-tight text-[#0D1B3D] sm:text-5xl mb-6\">\n      นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)\n    </h1>\n    <p class=\"mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto\">\n      เราเคารพในสิทธิความเป็นส่วนตัวของคุณและปฏิบัติตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)...<br><br>(เนื้อหากำลังปรับปรุง)\n    </p>\n  </div>\n</div>\n</div>",
    status: "Published",
    seoDescription: "นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA) ของ BIZ Toptier",
    tags: "pdpa, privacy",
    headerScript: "",
    footerScript: "",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "disclaimer",
    title: "ข้อสงวนสิทธิ์ (Disclaimer)",
    slug: "disclaimer",
    content: "<div class=\"not-prose\">\n<div class=\"bg-white py-24 sm:py-32 relative overflow-hidden\">\n  <div class=\"mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 relative z-10 text-center\">\n    <h1 class=\"text-4xl font-bold tracking-tight text-[#0D1B3D] sm:text-5xl mb-6\">\n      ข้อสงวนสิทธิ์ (Disclaimer)\n    </h1>\n    <p class=\"mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto\">\n      ข้อมูลที่ปรากฏบนเว็บไซต์นี้มีวัตถุประสงค์เพื่อให้ข้อมูลทั่วไปเท่านั้น...<br><br>(เนื้อหากำลังปรับปรุง)\n    </p>\n  </div>\n</div>\n</div>",
    status: "Published",
    seoDescription: "ข้อสงวนสิทธิ์ของ BIZ Toptier",
    tags: "disclaimer, terms",
    headerScript: "",
    footerScript: "",
    lastUpdated: new Date().toISOString()
  }
];

newPages.forEach(np => {
  const existingIndex = pages.findIndex(p => p.slug === np.slug);
  if (existingIndex > -1) {
    pages[existingIndex] = np;
  } else {
    pages.push(np);
  }
});

fs.writeFileSync('data/pages.json', JSON.stringify(pages, null, 2));
console.log("Added legal pages");
