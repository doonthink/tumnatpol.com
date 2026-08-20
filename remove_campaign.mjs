import fs from 'fs';
let content = fs.readFileSync('src/admin/dashboard/Dashboard.tsx', 'utf8');

content = content.replace(/<button onClick=\{\(\) => navigate\("\/admin\/banners"\)\} className="px-4 py-2 bg-\[#0D1B3D\] text-white rounded-lg text-sm font-medium hover:bg-\[#0a152e\] transition-colors shadow-md">\s*New Campaign\s*<\/button>/, '');

fs.writeFileSync('src/admin/dashboard/Dashboard.tsx', content);
console.log("Removed New Campaign button");
