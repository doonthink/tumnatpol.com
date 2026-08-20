import fs from 'fs';
let ft = fs.readFileSync('src/components/Features.tsx', 'utf-8');
ft = ft.replace('<p className="mt-6 text-lg leading-8 text-slate-500">\n                                   \n          </p>', '<p className="mt-6 text-lg leading-8 text-slate-500">\n            {t(\'features.desc\')}\n          </p>');
fs.writeFileSync('src/components/Features.tsx', ft);
