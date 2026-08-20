import fs from 'fs';
let content = fs.readFileSync('src/admin/AdminLayout.tsx', 'utf8');

// replace the img wrapper to make it a link
content = content.replace(
  /<div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 overflow-hidden">/g,
  '<Link to="/admin/profile" className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 overflow-hidden hover:ring-2 hover:ring-[#B87333] transition-all">'
);
content = content.replace(
  /<img src="https:\/\/i\.pravatar\.cc\/150\?u=admin" alt="Admin" className="w-full h-full object-cover" \/>\s*<\/div>/g,
  '<img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover" />\n              </Link>'
);

fs.writeFileSync('src/admin/AdminLayout.tsx', content);
console.log("AdminLayout updated");
