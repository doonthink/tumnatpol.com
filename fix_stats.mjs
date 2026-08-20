import fs from 'fs';
let content = fs.readFileSync('src/admin/membership/MembershipList.tsx', 'utf8');

content = content.replace(
  '<h3 className="text-2xl font-bold text-slate-900">{filteredMembers.length}</h3>',
  '<h3 className="text-2xl font-bold text-slate-900">{members.length}</h3>'
);

fs.writeFileSync('src/admin/membership/MembershipList.tsx', content);
