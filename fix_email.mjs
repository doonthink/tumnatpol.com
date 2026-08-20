import fs from 'fs';

// 1. Update Footer.tsx
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(/contact@biztoptier\.com/g, 'Biztoptier@outlook.co.th');
fs.writeFileSync('src/components/Footer.tsx', footer);

// 2. Update pages.json (home page footer and contact page content)
let pagesStr = fs.readFileSync('data/pages.json', 'utf8');
let pages = JSON.parse(pagesStr);

pages.forEach(p => {
  let updated = false;
  if (p.content) {
    const prev = p.content;
    
    // Replace email everywhere
    p.content = p.content.replace(/contact@biztoptier\.com/g, 'Biztoptier@outlook.co.th');
    
    if (prev !== p.content) {
      updated = true;
      p.lastUpdated = new Date().toISOString();
    }
  }
});

fs.writeFileSync('data/pages.json', JSON.stringify(pages, null, 2));
console.log("Updated email");
