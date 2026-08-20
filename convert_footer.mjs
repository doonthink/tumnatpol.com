import fs from 'fs';

let content = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

// extract the return (...) block
const match = content.match(/return \([\s\S]*?<footer className="bg-\[#0A1128\] text-white">\s*([\s\S]+?)\s*<\/footer>\s*\);/);
if (match) {
  let html = match[1];
  
  // Convert JSX to HTML
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
  // strip JSX comments
  html = html.replace(/{\/\*[\s\S]*?\*\/}/g, '');
  
  const pagesData = JSON.parse(fs.readFileSync('data/pages.json', 'utf-8'));
  const footerPage = pagesData.find(p => p.slug === 'footer');
  if (footerPage) {
    footerPage.content = html;
    fs.writeFileSync('data/pages.json', JSON.stringify(pagesData, null, 2));
    console.log("Footer updated successfully.");
  }
}
