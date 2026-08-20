import fs from 'fs';

let pagesStr = fs.readFileSync('data/pages.json', 'utf8');
let pages = JSON.parse(pagesStr);

const phoneSVG = `<svg class="w-5 h-5 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`;

pages.forEach(p => {
  let updated = false;
  
  if (p.content) {
      const prev = p.content;
      // top contact block (in lists)
      const regexTop = /(<li[^>]*>\s*<svg[^>]*>.*?<\/svg>\s*<a href="mailto:contact@biztoptier\.com"[^>]*>.*?<\/a>\s*<\/li>)/gi;
      const phoneHtmlLi = `\n              <li class="flex items-start gap-3 text-slate-300">\n                ${phoneSVG}\n                <a href="tel:0617898692" class="hover:text-white transition-colors">0617898692</a>\n              </li>`;
      
      p.content = p.content.replace(regexTop, (match) => {
        if (!match.includes('tel:0617898692')) return match + phoneHtmlLi;
        return match;
      });

      // bottom contact block
      const regexBottom = /(<a href="mailto:contact@biztoptier\.com"[^>]*>\s*contact@biztoptier\.com\s*<\/a>)/gi;
      const phoneBottomLink = `\n                <a href="tel:0617898692" class="text-slate-300 hover:text-white transition-colors mt-2 block flex items-center gap-2">\n                  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> 0617898692\n                </a>`;

      p.content = p.content.replace(regexBottom, (match) => {
        if (!p.content.includes('tel:0617898692')) return match + phoneBottomLink;
        return match;
      });

      if (prev !== p.content) {
        updated = true;
      }
  }

  if (updated) {
    p.lastUpdated = new Date().toISOString();
  }
});

fs.writeFileSync('data/pages.json', JSON.stringify(pages, null, 2));
