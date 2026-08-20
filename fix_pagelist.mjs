import fs from 'fs';
let content = fs.readFileSync('src/admin/pages/PageList.tsx', 'utf8');

content = content.replace(/<button className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">\s*<MoreVertical className="w-4 h-4" \/>\s*<\/button>/g, 
`<button onClick={() => alert("More options coming soon")} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>`);

fs.writeFileSync('src/admin/pages/PageList.tsx', content);
