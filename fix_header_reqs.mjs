import fs from 'fs';

const content = fs.readFileSync('src/admin/settings/HeaderSettings.tsx', 'utf-8');

let newContent = content.replace(
    '<h2 className="text-lg font-bold text-slate-900 mb-4">Header Logo</h2>',
    `<div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">Header Logo</h2>
          <p className="text-sm text-slate-500 mt-1">เป็น logo หน้า Frontend มุมซ้ายบน</p>
        </div>`
);

newContent = newContent.replace(
    '<h2 className="text-lg font-bold text-slate-900 mb-4">Header CTA Button & Style</h2>',
    '<h2 className="text-lg font-bold text-slate-900 mb-4">Header CTA Button & Style (รองรับ 2 ภาษา)</h2>'
);

fs.writeFileSync('src/admin/settings/HeaderSettings.tsx', newContent);
console.log("Updated labels!");
