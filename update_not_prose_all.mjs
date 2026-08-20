import fs from 'fs';

const pagesPath = 'data/pages.json';
const pagesStr = fs.readFileSync(pagesPath, 'utf8');
const pages = JSON.parse(pagesStr);

pages.forEach(p => {
  if (p.content.includes('bg-white py-24') && !p.content.includes('not-prose')) {
     p.content = `<div class="not-prose">\n${p.content}\n</div>`;
  }
});

fs.writeFileSync(pagesPath, JSON.stringify(pages, null, 2));
console.log("Updated all relevant pages");
