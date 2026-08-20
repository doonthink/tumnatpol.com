import fs from 'fs';

let footerContent = fs.readFileSync('src/components/Footer.tsx', 'utf-8');
const footerMatch = footerContent.match(/return \(\s*<footer className="bg-\[#0A1128\] text-white">\s*([\s\S]+?)\s*<\/footer>\s*\);\s*\}\s*$/);
if (footerMatch) {
  let html = footerMatch[1];
  html = html.replace(/className=/g, 'class=');
  html = html.replace(/<Link to="([^"]+)"([^>]*)>([\s\S]*?)<\/Link>/g, '<a href="$1"$2>$3</a>');
  html = html.replace(/\{new Date\(\)\.getFullYear\(\)\}/g, '2026');
  html = html.replace(/<Mail className="([^"]+)" \/>/g, '<svg class="$1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>');
  html = html.replace(/<Logo className="([^"]+)" variant="dark" \/>/g, '<div class="$1 font-bold text-2xl">BIZ Toptier</div>');
  html = html.replace(/<Facebook className="([^"]+)" \/>/g, 'F');
  html = html.replace(/<Linkedin className="([^"]+)" \/>/g, 'L');
  html = html.replace(/<Music2 className="([^"]+)" \/>/g, 'T');
  html = html.replace(/<Youtube className="([^"]+)" \/>/g, 'Y');
  html = html.replace(/<Instagram className="([^"]+)" \/>/g, 'I');
  html = html.replace(/{\/\*[\s\S]*?\*\/}/g, '');

  const pagesData = JSON.parse(fs.readFileSync('data/pages.json', 'utf-8'));
  const footerPage = pagesData.find(p => p.slug === 'footer');
  if (footerPage) {
    footerPage.content = html;
    fs.writeFileSync('data/pages.json', JSON.stringify(pagesData, null, 2));
    console.log("Footer fixed.");
  }
}

let headerContent = fs.readFileSync('src/components/Header.tsx', 'utf-8');
const headerMatch = headerContent.match(/return \(\s*<header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm shrink-0">\s*([\s\S]+?)\s*<\/header>\s*\);\s*\}\s*$/);
if (headerMatch) {
  let html = headerMatch[1];
  html = html.replace(/className=/g, 'class=');
  html = html.replace(/<Link to="([^"]+)"([^>]*)>([\s\S]*?)<\/Link>/g, '<a href="$1"$2>$3</a>');
  html = html.replace(/<Logo className="([^"]+)" \/>/g, '<div class="$1 font-bold text-2xl text-[#0D1B3D]">BIZ Toptier</div>');
  html = html.replace(/<Menu size=\{24\} \/>/g, '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>');
  html = html.replace(/<X size=\{24\} \/>/g, '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>');
  html = html.replace(/onClick=\{[^}]+\}/g, '');
  html = html.replace(/{\/\*[\s\S]*?\*\/}/g, '');
  html = html.replace(/\{isMobileMenuOpen \? .* : (.*) \}/g, '$1');
  html = html.replace(/\{isMobileMenuOpen && \([\s\S]*?\)\}/g, '');

  const pagesData = JSON.parse(fs.readFileSync('data/pages.json', 'utf-8'));
  const headerPage = pagesData.find(p => p.slug === 'header');
  if (headerPage) {
    headerPage.content = html;
    fs.writeFileSync('data/pages.json', JSON.stringify(pagesData, null, 2));
    console.log("Header fixed.");
  }
}
