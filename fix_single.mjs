import fs from 'fs';
let sb = fs.readFileSync('src/pages/SingleBlog.tsx', 'utf-8');
sb = sb.replace(/<span className="text-sm font-medium text-slate-700">.*?<\/span>/, '<span className="text-sm font-medium text-slate-700">{isEn ? "Share this article:" : "แชร์บทความนี้:"}</span>');
fs.writeFileSync('src/pages/SingleBlog.tsx', sb);
