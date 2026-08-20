import fs from 'fs';
let pages = JSON.parse(fs.readFileSync('data/pages.json', 'utf8'));

pages.forEach(p => {
  if (p.slug === 'about') {
    p.content_en = p.content_en.replace(/ศูนย์รวมข้อมูลธุรกิจที่หลากหลาย/g, 'A diverse business information hub');
    p.content_en = p.content_en.replace(/สร้างเครือข่ายการแลกเปลี่ยนข้อมูลบริการและสินค้าอย่างครอบคลุม/g, 'Building a comprehensive network for exchanging service and product information');
  }
  
  if (p.slug === 'terms') {
    p.content_en = p.content_en.replace(/โปรดอ่าน/g, 'Please read');
    p.content_en = p.content_en.replace(/เหล่านี้อย่างละเอียดก่อนใช้บริการของเรา/g, 'these carefully before using our services');
  }
  
  if (p.slug === 'service') {
    p.content_en = p.content_en
      .replace(/วิเคราะห์ธุรกิจอย่างเป็นระบบ/g, 'Systematically analyze your business')
      .replace(/เพื่อค้นหาโอกาสในการเติบโต/g, 'to find growth opportunities')
      .replace(/เปลี่ยนข้อมูลธุรกิจ/g, 'Turn business data')
      .replace(/ให้กลายเป็นแผนการเติบโต/g, 'into a growth plan')
      .replace(/วิเคราะห์ธุรกิจแบบ/g, 'Business analysis')
      .replace(/ค้นหาปัญหาและจุดอ่อนที่มองไม่เห็น/g, 'Find hidden problems and weaknesses')
      .replace(/แนะนำแนวทางเพิ่มยอดขายและลดต้นทุน/g, 'Recommend ways to increase sales and reduce costs')
      .replace(/จัดทำแผนพัฒนาธุรกิจที่นำไปใช้ได้จริง/g, 'Create practical business development plans')
      .replace(/เว็บไซต์ที่ไม่ได้มีไว้แค่สวย/g, 'A website that is not just beautiful')
      .replace(/แต่ช่วยสร้างยอดขาย/g, 'but helps generate sales')
      .replace(/ออกแบบเฉพาะตามแบรนด์/g, 'Custom design tailored to your brand')
      .replace(/รองรับทุกอุปกรณ์/g, 'Supports all devices')
      .replace(/ระบบจัดการข้อมูล/g, 'Content Management System')
      .replace(/เชื่อมต่อ/g, 'Connect')
      .replace(/และระบบ/g, 'and system')
      .replace(/พัฒนา/g, 'Develop')
      .replace(/และ/g, 'and')
      .replace(/ตามความต้องการของธุรกิจ/g, 'according to business needs')
      .replace(/เปลี่ยนขั้นตอนการทำงานที่ซับซ้อน/g, 'Turn complex workflows')
      .replace(/ให้เป็นระบบอัตโนมัติ/g, 'into automated systems')
      .replace(/วางแผนและออกแบบโครงสร้างแคมเปญ/g, 'Plan and design campaign structures')
      .replace(/วิเคราะห์และเลือก/g, 'Analyze and select')
      .replace(/ที่ตรงกลุ่มเป้าหมาย/g, 'that hit the target audience')
      .replace(/เขียนข้อความโฆษณา/g, 'Write ad copy')
      .replace(/ดูแลแคมเปญ/g, 'Manage campaigns')
      .replace(/ติดตามผล/g, 'Track results')
      .replace(/อย่างแม่นยำ/g, 'accurately')
      .replace(/ปรับแต่งแคมเปญ/g, 'Optimize campaigns')
      .replace(/เพื่อลดต้นทุนเพิ่มยอดคลิก/g, 'to reduce costs and increase clicks')
      .replace(/รายงานผลและให้คำปรึกษาประจำเดือน/g, 'Monthly reporting and consultation');
  }
});

fs.writeFileSync('data/pages.json', JSON.stringify(pages, null, 2));
console.log("Fixed translations");
