import fs from 'fs';

const pages = [
  { id: "home", title: "หน้าหลัก (Home)", slug: "home", content: "<div class=\"text-center py-20\"><h1 class=\"text-4xl font-bold\">Welcome to BIZ Toptier</h1><p class=\"mt-4 text-xl\">Connecting businesses for a better future.</p></div>", status: "Published", seoDescription: "หน้าหลัก", tags: "", headerScript: "", footerScript: "" },
  { id: "header", title: "ส่วนหัวเว็บ (Header)", slug: "header", content: "<div class=\"flex items-center justify-between p-4 bg-white shadow\"><div class=\"font-bold text-xl\">BIZ Toptier</div><div class=\"flex gap-4\"><a href=\"/\">หน้าหลัก</a><a href=\"/about\">เกี่ยวกับเรา</a><a href=\"/service\">บริการของเรา</a><a href=\"/contact\">ติดต่อเรา</a></div></div>", status: "Published", seoDescription: "", tags: "", headerScript: "", footerScript: "" },
  { id: "footer", title: "ส่วนท้ายเว็บ (Footer)", slug: "footer", content: "<div class=\"p-8 bg-[#0A1128] text-white text-center\"><p>© 2026 Biz Top Tier Co., Ltd. All Rights Reserved.</p></div>", status: "Published", seoDescription: "", tags: "", headerScript: "", footerScript: "" },
  { id: "about", title: "เกี่ยวกับเรา (About)", slug: "about", content: "<div class=\"py-20 text-center\"><h1 class=\"text-4xl font-bold mb-6\">เกี่ยวกับเรา</h1><p>แพลตฟอร์มธุรกิจเพื่อเพิ่มยอดขายและเพิ่มประสิทธิภาพให้องค์กร</p></div>", status: "Published", seoDescription: "เกี่ยวกับเรา", tags: "", headerScript: "", footerScript: "" },
  { id: "service", title: "บริการของเรา (Service)", slug: "service", content: "<div class=\"py-20 text-center\"><h1 class=\"text-4xl font-bold mb-6\">บริการของเรา</h1><p>Business Health Check, Solution Advisory, Business Growth Support</p></div>", status: "Published", seoDescription: "บริการของเรา", tags: "", headerScript: "", footerScript: "" },
  { id: "contact", title: "ติดต่อเรา (Contact)", slug: "contact", content: "<div class=\"py-20 text-center\"><h1 class=\"text-4xl font-bold mb-6\">ติดต่อเรา</h1><p>Email: contact@biztoptier.com</p></div>", status: "Published", seoDescription: "ติดต่อเรา", tags: "", headerScript: "", footerScript: "" }
];

fs.writeFileSync('data/pages.json', JSON.stringify(pages, null, 2));
