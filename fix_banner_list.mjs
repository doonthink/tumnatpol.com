import fs from 'fs';
let content = fs.readFileSync('src/admin/banners/BannerList.tsx', 'utf8');

content = content.replace(/className=\{\\`inline-flex/g, "className={`inline-flex");
content = content.replace(/\\`\}/g, "`}");

fs.writeFileSync('src/admin/banners/BannerList.tsx', content);
