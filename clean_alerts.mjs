import fs from 'fs';
let m = fs.readFileSync('src/admin/media/MediaLibrary.tsx', 'utf8');
m = m.replace(/onClick=\{\(\) => alert\([^)]+\)\}/g, 'onClick={() => {}}');
fs.writeFileSync('src/admin/media/MediaLibrary.tsx', m);

let b = fs.readFileSync('src/admin/membership/MembershipList.tsx', 'utf8');
b = b.replace(/onClick=\{\(\) => alert\([^)]+\)\}/g, 'onClick={() => {}}');
fs.writeFileSync('src/admin/membership/MembershipList.tsx', b);
