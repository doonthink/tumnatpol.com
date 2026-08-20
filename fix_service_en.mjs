import fs from 'fs';
let pages = JSON.parse(fs.readFileSync('data/pages.json', 'utf8'));

pages.forEach(p => {
  if (p.slug === 'service') {
    p.content_en = p.content_en.replace(/ความเชี่ยวชาญของเรา/g, 'Our Expertise');
    p.content_en = p.content_en.replace(/บริการของเรา/g, 'Our Services');
  }
});

fs.writeFileSync('data/pages.json', JSON.stringify(pages, null, 2));
console.log("Fixed service content");
