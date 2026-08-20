import fs from 'fs';

const services = [
  {
    title: "Business Health Check",
    desc: "วิเคราะห์ธุรกิจอย่างเป็นระบบ เพื่อค้นหาโอกาสในการเติบโต",
    highlight: "เปลี่ยนข้อมูลธุรกิจ ให้กลายเป็นแผนการเติบโต",
    features: [
      "วิเคราะห์ธุรกิจแบบ 360°",
      "ค้นหาปัญหาและจุดอ่อนที่มองไม่เห็น",
      "แนะนำแนวทางเพิ่มยอดขายและลดต้นทุน",
      "วิเคราะห์คู่แข่งและโอกาสทางการตลาด",
      "จัดทำแผนพัฒนาธุรกิจที่นำไปใช้ได้จริง",
      "เหมาะสำหรับธุรกิจที่ต้องการเติบโตอย่างยั่งยืน"
    ]
  },
  {
    title: "Website Development",
    desc: "ออกแบบและพัฒนาเว็บไซต์ที่สร้างความน่าเชื่อถือและเพิ่มโอกาสทางธุรกิจ",
    highlight: "เว็บไซต์ที่ไม่ได้มีไว้แค่สวย แต่ช่วยสร้างยอดขาย",
    features: [
      "ออกแบบเฉพาะตามแบรนด์",
      "รองรับทุกอุปกรณ์ (Responsive)",
      "SEO Friendly",
      "ระบบจัดการข้อมูล (CMS)",
      "เชื่อมต่อ Google Analytics, Facebook Pixel และระบบ Marketing",
      "รองรับการขยายระบบในอนาคต",
      "ความปลอดภัยสูง พร้อมบริการดูแลหลังส่งมอบ"
    ]
  },
  {
    title: "Application Development",
    desc: "พัฒนา Web Application และ Mobile Application ตามความต้องการของธุรกิจ",
    highlight: "เปลี่ยนขั้นตอนการทำงานที่ซับซ้อน ให้เป็นระบบอัตโนมัติ",
    features: [
      "วิเคราะห์และออกแบบระบบก่อนพัฒนา",
      "พัฒนาเฉพาะสำหรับแต่ละองค์กร",
      "รองรับ Web, iOS และ Android",
      "Dashboard และระบบรายงาน",
      "เชื่อมต่อ API และระบบภายนอก",
      "รองรับการเติบโตของธุรกิจ (Scalable)",
      "ดูแลและพัฒนาต่อได้ในระยะยาว"
    ]
  },
  {
    title: "Google Ads Management",
    desc: "เพิ่มโอกาสในการเข้าถึงลูกค้าที่กำลังค้นหาสินค้าหรือบริการของคุณ",
    highlight: "ใช้งบอย่างคุ้มค่า เข้าถึงลูกค้าที่พร้อมซื้อ",
    features: [
      "วางแผนและออกแบบโครงสร้างแคมเปญ",
      "วิเคราะห์และเลือก Keyword ที่ตรงกลุ่มเป้าหมาย",
      "เขียนข้อความโฆษณา (Copywriting)",
      "ดูแลแคมเปญ Search, Display, Video (YouTube)",
      "ติดตามผล Conversion อย่างแม่นยำ",
      "ปรับแต่งแคมเปญ (Optimize) เพื่อลดต้นทุนเพิ่มยอดคลิก",
      "รายงานผลและให้คำปรึกษาประจำเดือน"
    ]
  },
  {
    title: "Social Media Marketing",
    desc: "สร้างยอดขายและการรับรู้แบรนด์ผ่านสื่อโซเชียล",
    highlight: "สร้างยอดขายด้วยคอนเทนต์ที่เข้าถึงลูกค้า",
    features: [
      "ดูแลเพจ Facebook, Instagram, TikTok",
      "วางแผน Content Strategy",
      "ออกแบบภาพและกราฟิกที่ดึงดูดใจ",
      "ยิงแอดโซเชียลมีเดีย (Facebook Ads, TikTok Ads)",
      "วิเคราะห์ข้อมูลหลังบ้านและคู่แข่ง",
      "จัดแคมเปญและโปรโมชั่น",
      "สร้างความสัมพันธ์กับลูกค้า (Community Management)"
    ]
  }
];

const svgs = [
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="PLACEHOLDER_CLASS"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>`,
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="PLACEHOLDER_CLASS"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>`,
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="PLACEHOLDER_CLASS"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>`,
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="PLACEHOLDER_CLASS"><path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"></path><path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14"></path><path d="M8 6v8"></path></svg>`,
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="PLACEHOLDER_CLASS"><path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z"></path><path d="M20.054 15.987H3.946"></path></svg>`
];

const checkCircleSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="PLACEHOLDER_CLASS"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>`;

let html = `
<div class="bg-white py-24 sm:py-32 relative overflow-hidden">
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-30">
    <div class="absolute top-20 left-0 w-72 h-72 bg-[#B87333] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
    <div class="absolute top-40 right-0 w-72 h-72 bg-[#0D1B3D] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
    <div class="absolute -bottom-8 left-20 w-72 h-72 bg-[#B87333] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
  </div>

  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 relative z-10">
    <div class="mx-auto max-w-2xl text-center mb-20">
      <h2 class="text-sm font-semibold tracking-[0.2em] uppercase text-[#B87333]">
        Our Service
      </h2>
      <p class="mt-2 text-3xl font-bold tracking-tight text-[#0D1B3D] sm:text-4xl font-display">
        บริการของเรา
      </p>
      <div class="mt-4 flex justify-center">
        <div class="h-1 w-20 bg-gradient-to-r from-[#B87333] to-transparent rounded-full"></div>
      </div>
    </div>

    <div class="space-y-24 lg:space-y-32">
`;

services.forEach((service, index) => {
  const isEven = index % 2 === 1;
  const svg = svgs[index % svgs.length];

  html += `
      <div class="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center ${isEven ? 'lg:flex-row-reverse' : ''}">
        <div class="w-full lg:w-1/2">
          <div class="group relative">
            <div class="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#B87333]/20 to-[#0D1B3D]/20 blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div class="relative bg-white p-8 md:p-12 rounded-3xl border border-slate-100 flex flex-col justify-center h-full overflow-hidden shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-[#B87333]/10 transition-all duration-500 transform group-hover:-translate-y-1">
              
              <div class="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500 transform origin-bottom-left">
                 ${svg.replace('PLACEHOLDER_CLASS', 'w-64 h-64 text-[#0D1B3D]')}
              </div>
              
              <div class="w-16 h-16 bg-gradient-to-br from-[#0D1B3D] to-[#1a2f63] shadow-lg shadow-[#0D1B3D]/20 rounded-2xl flex items-center justify-center mb-8 relative z-10 transform group-hover:rotate-6 transition-transform duration-300">
                ${svg.replace('PLACEHOLDER_CLASS', 'w-8 h-8 text-white')}
              </div>
              
              <h3 class="text-3xl font-bold text-[#0D1B3D] mb-4 relative z-10 group-hover:text-[#B87333] transition-colors">${service.title}</h3>
              <p class="text-slate-600 mb-8 text-lg leading-relaxed relative z-10">${service.desc}</p>
              
              <div class="bg-slate-50 border-l-4 border-[#B87333] p-5 rounded-r-xl mt-auto relative z-10 shadow-sm group-hover:bg-[#B87333]/5 transition-colors duration-300">
                <p class="text-[#0D1B3D] font-medium text-lg leading-snug">
                  <span class="text-[#B87333] font-bold mr-2">Highlight:</span> 
                  ${service.highlight}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="w-full lg:w-1/2 lg:py-8">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B87333]/10 text-[#B87333] font-semibold text-sm mb-8">
            ${checkCircleSVG.replace('PLACEHOLDER_CLASS', 'w-5 h-5')}
            ความเชี่ยวชาญของเรา
          </div>
          
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
`;

  service.features.forEach(feature => {
    html += `
            <li class="flex items-start gap-4 group">
              <div class="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#B87333] transition-colors duration-300">
                ${checkCircleSVG.replace('PLACEHOLDER_CLASS', 'w-4 h-4 text-[#B87333] group-hover:text-white transition-colors duration-300')}
              </div>
              <span class="text-slate-700 font-medium leading-relaxed pt-0.5">${feature}</span>
            </li>
`;
  });

  html += `
          </ul>
        </div>
      </div>
`;
});

html += `
    </div>
  </div>
</div>
`;

const pagesPath = 'data/pages.json';
const pagesStr = fs.readFileSync(pagesPath, 'utf8');
const pages = JSON.parse(pagesStr);

const servicePage = pages.find(p => p.id === 'service' || p.slug === 'service');
if (servicePage) {
  servicePage.content = html;
  // Also remove old one, I'll update it
  servicePage.lastUpdated = new Date().toISOString();
  fs.writeFileSync(pagesPath, JSON.stringify(pages, null, 2));
  console.log("Updated service page in data/pages.json");
} else {
  console.log("Service page not found");
}

