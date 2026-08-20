import fs from 'fs';

let pagesStr = fs.readFileSync('data/pages.json', 'utf8');
let pages = JSON.parse(pagesStr);

pages.forEach(p => {
  let updated = false;
  if (p.content) {
    const prev = p.content;
    
    // Remove LinkedIn icon "L"
    const linkedinRegex = /<a href="[^"]*" class="w-10 h-10 rounded-full border border-white\/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white\/10 transition-colors">\s*L\s*<\/a>/;
    p.content = p.content.replace(linkedinRegex, '');
    
    // Update bottom links from a to a href with correct route, dynamic page will reload or react router might not intercept, but we don't have Link component in raw HTML. We just set href="/privacy"
    p.content = p.content.replace(/<a href="#" class="hover:text-white transition-colors">Privacy Policy<\/a>/g, '<a href="/privacy" class="hover:text-white transition-colors">Privacy Policy</a>');
    p.content = p.content.replace(/<a href="#" class="hover:text-white transition-colors">Terms of Service<\/a>/g, '<a href="/terms" class="hover:text-white transition-colors">Terms of Service</a>');
    p.content = p.content.replace(/<a href="#" class="hover:text-white transition-colors">Cookie Policy<\/a>/g, '<a href="/cookies" class="hover:text-white transition-colors">Cookie Policy</a>');
    p.content = p.content.replace(/<a href="#" class="hover:text-white transition-colors">PDPA<\/a>/g, '<a href="/pdpa" class="hover:text-white transition-colors">PDPA</a>');
    p.content = p.content.replace(/<a href="#" class="hover:text-white transition-colors">Disclaimer<\/a>/g, '<a href="/disclaimer" class="hover:text-white transition-colors">Disclaimer</a>');
    
    p.content = p.content.replace(/<a href="#" class="text-slate-300 hover:text-white transition-colors">นโยบายความเป็นส่วนตัว<\/a>/g, '<a href="/privacy" class="text-slate-300 hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</a>');
    p.content = p.content.replace(/<a href="#" class="text-slate-300 hover:text-white transition-colors">ข้อกำหนดและเงื่อนไข<\/a>/g, '<a href="/terms" class="text-slate-300 hover:text-white transition-colors">ข้อกำหนดและเงื่อนไข</a>');
    p.content = p.content.replace(/<a href="#" class="text-slate-300 hover:text-white transition-colors">นโยบายคุกกี้<\/a>/g, '<a href="/cookies" class="text-slate-300 hover:text-white transition-colors">นโยบายคุกกี้</a>');
    
    if (prev !== p.content) {
      updated = true;
      p.lastUpdated = new Date().toISOString();
    }
  }
});

fs.writeFileSync('data/pages.json', JSON.stringify(pages, null, 2));
console.log("Updated pages.json");
