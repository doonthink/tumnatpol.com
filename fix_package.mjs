import fs from 'fs';
let content = fs.readFileSync('src/admin/packages/PackageList.tsx', 'utf8');

// Filter button mock
content = content.replace(/<button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">\s*<Filter className="w-4 h-4" \/> Filter\s*<\/button>/, 
`<button onClick={() => alert("Filter functionality coming soon")} className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
              <Filter className="w-4 h-4" /> Filter
            </button>`);

// Edit button mock
content = content.replace(/<button className="p-1\.5 text-slate-400 hover:text-\[#0D1B3D\] transition-colors rounded-lg hover:bg-slate-100" title="Edit">/g, '<button onClick={() => alert("Edit package functionality coming soon")} className="p-1.5 text-slate-400 hover:text-[#0D1B3D] transition-colors rounded-lg hover:bg-slate-100" title="Edit">');

fs.writeFileSync('src/admin/packages/PackageList.tsx', content);
