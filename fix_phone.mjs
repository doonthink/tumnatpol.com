import fs from 'fs';

// 1. Update Footer.tsx
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');

if (!footer.includes('0617898692')) {
  // Ensure Phone is imported
  if (!footer.includes('Phone')) {
    footer = footer.replace(/import \{ ([^}]+) \} from 'lucide-react';/, "import { $1, Phone } from 'lucide-react';");
  }

  // Add Phone to Contact section
  const contactEmailLi = `<li className="flex items-start gap-3 text-slate-300">\n                <Mail className="w-5 h-5 shrink-0 mt-0.5" />\n                <a href="mailto:contact@biztoptier.com" className="hover:text-white transition-colors">contact@biztoptier.com</a>\n              </li>`;
  const contactPhoneLi = `              <li className="flex items-start gap-3 text-slate-300">\n                <Phone className="w-5 h-5 shrink-0 mt-0.5" />\n                <a href="tel:0617898692" className="hover:text-white transition-colors">0617898692</a>\n              </li>`;

  footer = footer.replace(contactEmailLi, contactEmailLi + '\n' + contactPhoneLi);
  
  const bottomContactLink = `<a href="mailto:contact@biztoptier.com" className="text-slate-300 hover:text-white transition-colors">\n                  contact@biztoptier.com\n                </a>`;
  const bottomContactPhone = `<a href="tel:0617898692" className="text-slate-300 hover:text-white transition-colors mt-2 block flex items-center gap-2">\n                  <Phone className="w-4 h-4" /> 0617898692\n                </a>`;

  footer = footer.replace(bottomContactLink, bottomContactLink + '\n                ' + bottomContactPhone);
  
  fs.writeFileSync('src/components/Footer.tsx', footer);
  console.log("Updated Footer.tsx");
}

// 2. Update pages.json contact & home
let pagesStr = fs.readFileSync('data/pages.json', 'utf8');
let pages = JSON.parse(pagesStr);

const phoneSVG = `<svg class="w-5 h-5 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`;

pages.forEach(p => {
  let updated = false;
  if (p.slug === 'home' || p.id === 'home') {
    // Modify the hardcoded footer inside content
    const emailHtmlLi = `<li class="flex items-start gap-3 text-slate-300">\n                <svg class="w-5 h-5 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>\n                <a href="mailto:contact@biztoptier.com" class="hover:text-white transition-colors">contact@biztoptier.com</a>\n              </li>`;
    const phoneHtmlLi = `              <li class="flex items-start gap-3 text-slate-300">\n                ${phoneSVG}\n                <a href="tel:0617898692" class="hover:text-white transition-colors">0617898692</a>\n              </li>`;
    
    if (p.content && p.content.includes(emailHtmlLi) && !p.content.includes('0617898692')) {
      p.content = p.content.replace(emailHtmlLi, emailHtmlLi + '\n' + phoneHtmlLi);
      
      const emailBottomLink = `<a href="mailto:contact@biztoptier.com" class="text-slate-300 hover:text-white transition-colors">\n                  contact@biztoptier.com\n                </a>`;
      const phoneBottomLink = `<a href="tel:0617898692" class="text-slate-300 hover:text-white transition-colors mt-2 block flex items-center gap-2">\n                  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> 0617898692\n                </a>`;
      
      p.content = p.content.replace(emailBottomLink, emailBottomLink + '\n                ' + phoneBottomLink);
      updated = true;
    }
  }

  if (p.slug === 'contact' || p.id === 'contact') {
    if (p.content && !p.content.includes('0617898692')) {
      p.content = p.content.replace('อีเมล: contact@biztoptier.com<br/>', 'เบอร์โทร: 0617898692<br/>\n      อีเมล: contact@biztoptier.com<br/>');
      updated = true;
    }
  }

  if (updated) p.lastUpdated = new Date().toISOString();
});

fs.writeFileSync('data/pages.json', JSON.stringify(pages, null, 2));
console.log("Updated pages.json");

