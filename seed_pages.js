const fs = require('fs');

const pages = [
  { 
    id: "home", 
    title: "หน้าหลัก (Home)", 
    slug: "home", 
    content: "<p>เนื้อหาหน้าแรก คุณสามารถปรับแต่งได้ที่นี่</p>", 
    status: "Published", 
    seoDescription: "หน้าหลักของ BIZ Toptier", 
    tags: "home, business", 
    headerScript: "", 
    footerScript: "" 
  },
  { 
    id: "about", 
    title: "เกี่ยวกับเรา (About)", 
    slug: "about", 
    content: "<p>ข้อมูลเกี่ยวกับเรา</p>", 
    status: "Published", 
    seoDescription: "เกี่ยวกับ BIZ Toptier", 
    tags: "about", 
    headerScript: "", 
    footerScript: "" 
  },
  { 
    id: "service", 
    title: "บริการของเรา (Service)", 
    slug: "service", 
    content: "<p>บริการของเรา ได้แก่ Business Health Check และอื่นๆ</p>", 
    status: "Published", 
    seoDescription: "บริการของ BIZ Toptier", 
    tags: "service", 
    headerScript: "", 
    footerScript: "" 
  },
  { 
    id: "contact", 
    title: "ติดต่อเรา (Contact)", 
    slug: "contact", 
    content: "<p>ติดต่อเราที่ contact@biztoptier.com</p>", 
    status: "Published", 
    seoDescription: "ติดต่อ BIZ Toptier", 
    tags: "contact", 
    headerScript: "", 
    footerScript: "" 
  },
  { 
    id: "header", 
    title: "ส่วนหัวเว็บ (Header)", 
    slug: "header", 
    content: "<p>ข้อมูลส่วนหัวเว็บ (เช่น เบอร์โทร, อีเมล, ประกาศ)</p>", 
    status: "Published", 
    seoDescription: "", 
    tags: "", 
    headerScript: "", 
    footerScript: "" 
  },
  { 
    id: "footer", 
    title: "ส่วนท้ายเว็บ (Footer)", 
    slug: "footer", 
    content: "<p>ข้อมูลส่วนท้ายเว็บ</p>", 
    status: "Published", 
    seoDescription: "", 
    tags: "", 
    headerScript: "", 
    footerScript: "" 
  }
];

fs.writeFileSync('data/pages.json', JSON.stringify(pages, null, 2));
