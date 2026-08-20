import fs from 'fs';

let content = fs.readFileSync('src/i18n.ts', 'utf-8');

const thServices = `      services_section: {
        subtitle: "Our Service",
        title: "บริการของเรา",
        features_title: "จุดเด่น",
        items: [
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
              "วางกลยุทธ์ก่อนเริ่มโฆษณา",
              "Keyword Research",
              "เขียนโฆษณาที่เพิ่ม Conversion",
              "ปรับแต่งแคมเปญอย่างต่อเนื่อง",
              "วิเคราะห์ข้อมูลและจัดทำรายงาน",
              "เพิ่มประสิทธิภาพงบโฆษณา (ROAS)",
              "ติดตั้ง Tracking และ Conversion"
            ]
          },
          {
            title: "IT & Business Solutions Consulting",
            desc: "ที่ปรึกษาด้านเทคโนโลยีและกลยุทธ์ธุรกิจ เพื่อยกระดับองค์กร",
            highlight: "เทคโนโลยีที่เหมาะสม คือการลงทุนที่สร้างผลตอบแทนให้ธุรกิจ",
            features: [
              "วิเคราะห์ปัญหาและกระบวนการทำงาน",
              "วางแผน Digital Transformation",
              "ให้คำปรึกษาการเลือกใช้เทคโนโลยี",
              "วางโครงสร้างระบบ IT",
              "ปรับปรุง Workflow และเพิ่มประสิทธิภาพ",
              "วาง Roadmap การพัฒนาระยะยาว",
              "ให้คำแนะนำด้าน Business Process และ Automation"
            ]
          }
        ]
      },
      latest_blogs: {`;

const enServices = `      services_section: {
        subtitle: "Our Service",
        title: "Our Services",
        features_title: "Highlights",
        items: [
          {
            title: "Business Health Check",
            desc: "Systematically analyze your business to find growth opportunities",
            highlight: "Turn business data into a growth plan",
            features: [
              "360° business analysis",
              "Find hidden problems and weaknesses",
              "Recommend ways to increase sales and reduce costs",
              "Analyze competitors and market opportunities",
              "Create practical business development plans",
              "Suitable for businesses looking for sustainable growth"
            ]
          },
          {
            title: "Website Development",
            desc: "Design and develop websites that build trust and increase business opportunities",
            highlight: "A website that is not just beautiful, but helps generate sales",
            features: [
              "Custom design tailored to your brand",
              "Supports all devices (Responsive)",
              "SEO Friendly",
              "Content Management System (CMS)",
              "Connect Google Analytics, Facebook Pixel, and marketing systems",
              "Supports future system expansion",
              "High security with post-delivery maintenance services"
            ]
          },
          {
            title: "Application Development",
            desc: "Develop Web and Mobile Applications according to business needs",
            highlight: "Turn complex workflows into automated systems",
            features: [
              "Analyze and design the system before development",
              "Custom developed for each organization",
              "Supports Web, iOS, and Android",
              "Dashboard and reporting system",
              "Connect APIs and external systems",
              "Supports business growth (Scalable)",
              "Long-term maintenance and further development"
            ]
          },
          {
            title: "Google Ads Management",
            desc: "Increase opportunities to reach customers searching for your products or services",
            highlight: "Spend budget wisely, reach ready-to-buy customers",
            features: [
              "Strategize before starting ads",
              "Keyword Research",
              "Write ads that increase conversion",
              "Continuously optimize campaigns",
              "Analyze data and create reports",
              "Optimize ad budget (ROAS)",
              "Install tracking and conversion"
            ]
          },
          {
            title: "IT & Business Solutions Consulting",
            desc: "Technology and business strategy consultant to elevate your organization",
            highlight: "The right technology is an investment that generates returns for your business",
            features: [
              "Analyze problems and workflows",
              "Plan Digital Transformation",
              "Consult on technology selection",
              "Layout IT system structure",
              "Improve workflow and increase efficiency",
              "Plan long-term development roadmap",
              "Advise on business processes and automation"
            ]
          }
        ]
      },
      latest_blogs: {`;

content = content.replace(/      latest_blogs: {/g, function(match, offset, string) {
  // First match is Thai, second match is English
  if (offset < string.length / 2) {
    return thServices;
  } else {
    return enServices;
  }
});

fs.writeFileSync('src/i18n.ts', content);
