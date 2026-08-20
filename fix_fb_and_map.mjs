import fs from 'fs';

// 1. Update Footer.tsx Facebook links
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(/https:\/\/www\.facebook\.com\/@biztoptierr/g, 'https://www.facebook.com/@biztoptier');
fs.writeFileSync('src/components/Footer.tsx', footer);

// 2. Update pages.json (home page facebook link and contact page map)
let pagesStr = fs.readFileSync('data/pages.json', 'utf8');
let pages = JSON.parse(pagesStr);

pages.forEach(p => {
  let updated = false;
  if (p.content) {
    const prev = p.content;
    
    // Facebook link
    p.content = p.content.replace(/https:\/\/www\.facebook\.com\/@biztoptierr/g, 'https://www.facebook.com/@biztoptier');
    
    // Map for contact page
    if (p.slug === 'contact') {
      const mapIframe = `\n    <div class="mt-12 rounded-2xl overflow-hidden shadow-lg">\n      <iframe src="https://www.google.com/maps?q=Major+Property+Service,+Rama+9,+Bangkok&output=embed" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>\n    </div>`;
      
      if (!p.content.includes('<iframe')) {
        p.content = p.content.replace('</p>\n  </div>\n</div>', `</p>${mapIframe}\n  </div>\n</div>`);
      }
    }
    
    if (prev !== p.content) {
      updated = true;
      p.lastUpdated = new Date().toISOString();
    }
  }
});

fs.writeFileSync('data/pages.json', JSON.stringify(pages, null, 2));
console.log("Updated files");
