import fs from 'fs';

const homeContent = `
<div class="bg-white py-24 sm:py-32 relative overflow-hidden">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 relative z-10 text-center">
    <h1 class="text-4xl font-bold tracking-tight text-[#0D1B3D] sm:text-6xl mb-6">
      Welcome to BIZ Toptier
    </h1>
    <p class="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
      แพลตฟอร์มธุรกิจเพื่อเพิ่มยอดขายและเพิ่มประสิทธิภาพให้องค์กร
    </p>
  </div>
</div>
`;

const aboutContent = `
<div class="bg-white py-24 sm:py-32 relative overflow-hidden">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 relative z-10 text-center">
    <h1 class="text-4xl font-bold tracking-tight text-[#0D1B3D] sm:text-6xl mb-6">
      เกี่ยวกับเรา
    </h1>
    <p class="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
      ศูนย์รวมข้อมูลธุรกิจที่หลากหลาย สร้างเครือข่ายการแลกเปลี่ยนข้อมูลบริการและสินค้าอย่างครอบคลุม
    </p>
  </div>
</div>
`;

const serviceContent = `
<div class="bg-white py-24 sm:py-32 relative overflow-hidden">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 relative z-10 text-center">
    <h1 class="text-4xl font-bold tracking-tight text-[#0D1B3D] sm:text-6xl mb-6">
      บริการของเรา
    </h1>
    <p class="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
      Business Health Check, Trusted Business Connection, Solution Advisory
    </p>
  </div>
</div>
`;

const contactContent = `
<div class="bg-white py-24 sm:py-32 relative overflow-hidden">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 relative z-10 text-center">
    <h1 class="text-4xl font-bold tracking-tight text-[#0D1B3D] sm:text-6xl mb-6">
      ติดต่อเรา
    </h1>
    <p class="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
      อีเมล: contact@biztoptier.com<br/>
      ที่อยู่: 21/129 Soi Soonvijai, Rama 9 Road, Bang Kapi Subdistrict, Huai Khwang District, Bangkok 10310
    </p>
  </div>
</div>
`;

const headerContent = `
<div class="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
  <div class="flex items-center gap-3">
    <a href="/" class="flex items-center gap-3">
      <div class="font-bold text-2xl text-[#0D1B3D]">BIZ Toptier</div>
    </a>
  </div>
  <nav class="hidden md:flex items-center gap-8">
    <a href="/" class="text-sm font-medium text-[#0D1B3D] border-b-2 border-[#B87333] pb-1">หน้าหลัก</a>
    <a href="/about" class="text-sm font-medium text-slate-500 hover:text-[#0D1B3D] transition-colors">เกี่ยวกับเรา</a>
    <a href="/service" class="text-sm font-medium text-slate-500 hover:text-[#0D1B3D] transition-colors">บริการของเรา</a>
    <a href="/blog" class="text-sm font-medium text-slate-500 hover:text-[#0D1B3D] transition-colors">บทความ</a>
    <a href="/contact" class="text-sm font-medium text-slate-500 hover:text-[#0D1B3D] transition-colors">ติดต่อเรา</a>
  </nav>
</div>
`;

const footerContent = `
<div class="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-10 text-white">
  <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
    <div>
      <h3 class="font-bold mb-4">Quick Links</h3>
      <ul class="space-y-2 text-slate-300">
        <li><a href="/">หน้าหลัก</a></li>
        <li><a href="/about">เกี่ยวกับเรา</a></li>
        <li><a href="/service">บริการของเรา</a></li>
      </ul>
    </div>
    <div>
      <h3 class="font-bold mb-4">Contact</h3>
      <p class="text-slate-300">contact@biztoptier.com</p>
    </div>
  </div>
</div>
`;

const pages = [
  { id: "home", title: "หน้าหลัก (Home)", slug: "home", content: homeContent, status: "Published", seoDescription: "หน้าหลักของ BIZ Toptier", tags: "home", headerScript: "", footerScript: "" },
  { id: "header", title: "ส่วนหัวเว็บ (Header)", slug: "header", content: headerContent, status: "Published", seoDescription: "", tags: "", headerScript: "", footerScript: "" },
  { id: "footer", title: "ส่วนท้ายเว็บ (Footer)", slug: "footer", content: footerContent, status: "Published", seoDescription: "", tags: "", headerScript: "", footerScript: "" },
  { id: "about", title: "เกี่ยวกับเรา (About)", slug: "about", content: aboutContent, status: "Published", seoDescription: "เกี่ยวกับ BIZ Toptier", tags: "about", headerScript: "", footerScript: "" },
  { id: "service", title: "บริการของเรา (Service)", slug: "service", content: serviceContent, status: "Published", seoDescription: "บริการของ BIZ Toptier", tags: "service", headerScript: "", footerScript: "" },
  { id: "contact", title: "ติดต่อเรา (Contact)", slug: "contact", content: contactContent, status: "Published", seoDescription: "ติดต่อ BIZ Toptier", tags: "contact", headerScript: "", footerScript: "" }
];

fs.writeFileSync('data/pages.json', JSON.stringify(pages, null, 2));
