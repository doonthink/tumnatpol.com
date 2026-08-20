import fs from 'fs';

let content = fs.readFileSync('src/admin/pages/PageList.tsx', 'utf8');

const targetStr = `<button onClick={() => deletePage(page.id)} className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>`;
                      
const newStr = `{!['home', 'header', 'footer'].includes(page.slug) && (
                        <button onClick={() => deletePage(page.id)} className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}`;

content = content.replace(targetStr, newStr);

fs.writeFileSync('src/admin/pages/PageList.tsx', content);
