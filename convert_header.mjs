import fs from 'fs';

let content = fs.readFileSync('src/components/Header.tsx', 'utf-8');

// extract the return (...) block
const match = content.match(/return \([\s\S]*?<header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm shrink-0">\s*([\s\S]+?)\s*<\/header>\s*\);/);
if (match) {
  let html = match[1];
  
  // Convert JSX to HTML
  html = html.replace(/className=/g, 'class=');
  html = html.replace(/<Link to="([^"]+)"([^>]*)>([\s\S]*?)<\/Link>/g, '<a href="$1"$2>$3</a>');
  html = html.replace(/<Logo className="([^"]+)" \/>/g, '<div class="$1 font-bold text-2xl text-[#0D1B3D]">BIZ Toptier</div>');
  html = html.replace(/<Menu size=\{24\} \/>/g, '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>');
  html = html.replace(/<X size=\{24\} \/>/g, '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>');
  html = html.replace(/onClick=\{[^}]+\}/g, '');
  
  // strip JSX comments
  html = html.replace(/{\/\*[\s\S]*?\*\/}/g, '');
  
  const pagesData = JSON.parse(fs.readFileSync('data/pages.json', 'utf-8'));
  const headerPage = pagesData.find(p => p.slug === 'header');
  if (headerPage) {
    // Also remove the dynamic conditional rendering blocks like {isMobileMenuOpen && (...)}
    // The previous header had a mobile menu. The regex for removing `{isMobileMenuOpen ? ...}`
    html = html.replace(/\{isMobileMenuOpen \? .* : (.*) \}/g, '$1');
    html = html.replace(/\{isMobileMenuOpen && \([\s\S]*?\)\}/g, '');
    
    headerPage.content = html;
    fs.writeFileSync('data/pages.json', JSON.stringify(pagesData, null, 2));
    console.log("Header updated successfully.");
  }
}
