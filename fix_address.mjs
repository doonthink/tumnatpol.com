import fs from 'fs';

// 1. Update Footer.tsx
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(
  /Address: 21\/129 Soi Soonvijai, Rama 9 Road, Bang Kapi Subdistrict, Huai Khwang District, Bangkok 10310/g,
  'ที่อยู่: 21/129 ซอยศูนย์วิจัย ถนนพระราม 9 แขวงบางกะปิ เขตห้วยขวาง กรุงเทพมหานคร 10310'
);
fs.writeFileSync('src/components/Footer.tsx', footer);

// 2. Update pages.json (home page footer and contact page content)
let pagesStr = fs.readFileSync('data/pages.json', 'utf8');
let pages = JSON.parse(pagesStr);

pages.forEach(p => {
  let updated = false;
  if (p.content) {
    const prev = p.content;
    
    // Replace address in English with Thai
    p.content = p.content.replace(
      /Address: 21\/129 Soi Soonvijai, Rama 9 Road, Bang Kapi Subdistrict, Huai Khwang District, Bangkok 10310/g,
      'ที่อยู่: 21/129 ซอยศูนย์วิจัย ถนนพระราม 9 แขวงบางกะปิ เขตห้วยขวาง กรุงเทพมหานคร 10310'
    );

    // Replace contact page text format if different
    p.content = p.content.replace(
      /ที่อยู่: 21\/129 Soi Soonvijai, Rama 9 Road, Bang Kapi Subdistrict, Huai Khwang District, Bangkok 10310/g,
      'ที่อยู่: 21/129 ซอยศูนย์วิจัย ถนนพระราม 9 แขวงบางกะปิ เขตห้วยขวาง กรุงเทพมหานคร 10310'
    );
    
    if (prev !== p.content) {
      updated = true;
      p.lastUpdated = new Date().toISOString();
    }
  }
});

fs.writeFileSync('data/pages.json', JSON.stringify(pages, null, 2));
console.log("Updated address");
