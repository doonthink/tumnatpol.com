import fs from 'fs';

let content = fs.readFileSync('src/admin/media/MediaLibrary.tsx', 'utf8');

content = content.replace(
  "setMediaItems(data);",
  "setMediaItems(data.reverse());"
);

content = content.replace(
  '<button onClick={() => {}} className="w-8 h-8 rounded-full bg-white text-slate-700 flex items-center justify-center hover:text-[#B87333]">\n                          <Download className="w-4 h-4" />\n                        </button>',
  `<a href={item.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white text-slate-700 flex items-center justify-center hover:text-[#B87333]">\n                          <Download className="w-4 h-4" />\n                        </a>`
);

content = content.replace(
  '<button onClick={() => {}} className="text-slate-400 hover:text-[#B87333] transition-colors">\n                            <Download className="w-4 h-4" />\n                          </button>',
  `<a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#B87333] transition-colors inline-flex items-center justify-center">\n                            <Download className="w-4 h-4" />\n                          </a>`
);

content = content.replace(
  'onClick={() => {}} className="px-4 py-2 bg-white border border-slate-200 text-slate-600',
  `onClick={() => alert('New folder created! (Demo)')} className="px-4 py-2 bg-white border border-slate-200 text-slate-600`
);

fs.writeFileSync('src/admin/media/MediaLibrary.tsx', content);
