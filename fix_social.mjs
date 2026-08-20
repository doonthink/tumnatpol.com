import fs from 'fs';

// 1. Update Footer.tsx
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');

footer = footer.replace(
  /<a href="[^"]*" className="w-10 h-10 rounded-full border border-white\/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white\/10 transition-colors">\s*<Facebook className="w-4 h-4" \/>\s*<\/a>/,
  '<a href="https://www.facebook.com/@biztoptierr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">\n                    <Facebook className="w-4 h-4" />\n                  </a>'
);

footer = footer.replace(
  /<a href="[^"]*" className="w-10 h-10 rounded-full border border-white\/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white\/10 transition-colors">\s*<Instagram className="w-4 h-4" \/>\s*<\/a>/,
  '<a href="https://www.instagram.com/biztoptier" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">\n                    <Instagram className="w-4 h-4" />\n                  </a>'
);

fs.writeFileSync('src/components/Footer.tsx', footer);
console.log("Updated Footer.tsx");

// 2. Update data/pages.json (home page content)
let pagesStr = fs.readFileSync('data/pages.json', 'utf8');
let pages = JSON.parse(pagesStr);

pages.forEach(p => {
  let updated = false;
  if (p.content) {
    // Replace F (Facebook)
    const prev = p.content;
    const fbRegex = /<a href="[^"]*" class="w-10 h-10 rounded-full border border-white\/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white\/10 transition-colors">\s*F\s*<\/a>/;
    p.content = p.content.replace(fbRegex, '<a href="https://www.facebook.com/@biztoptierr" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">\n                    F\n                  </a>');
    
    // Replace I (Instagram)
    const igRegex = /<a href="[^"]*" class="w-10 h-10 rounded-full border border-white\/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white\/10 transition-colors">\s*I\s*<\/a>/;
    p.content = p.content.replace(igRegex, '<a href="https://www.instagram.com/biztoptier" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">\n                    I\n                  </a>');
    
    // If we used SVG in JSON (for facebook in header/footer?), check if there's any.
    // Replace FB/IG links everywhere else just in case.
    
    if (prev !== p.content) {
      updated = true;
      p.lastUpdated = new Date().toISOString();
    }
  }
});

fs.writeFileSync('data/pages.json', JSON.stringify(pages, null, 2));
console.log("Updated data/pages.json");
