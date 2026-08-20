import fs from 'fs';
let pages = JSON.parse(fs.readFileSync('data/pages.json', 'utf8'));

pages.forEach(p => {
  if (p.slug === 'service') {
    p.content_en = p.content_en
      .replace(/วางแผน/g, 'Plan')
      .replace(/ออกแบบโครงสร้างแคมเปญ/g, 'design campaign structures')
      .replace(/วิเคราะห์/g, 'Analyze')
      .replace(/เลือก/g, 'Select')
      .replace(/รายงานผล/g, 'Report results')
      .replace(/ให้คำปรึกษาประจำเดือน/g, 'monthly consultation');
  }
});

fs.writeFileSync('data/pages.json', JSON.stringify(pages, null, 2));
console.log("Fixed more translations");
