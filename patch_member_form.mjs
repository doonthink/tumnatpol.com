import fs from 'fs';
let content = fs.readFileSync('src/admin/membership/MembershipForm.tsx', 'utf8');

content = content.replace(
  "if (id) {",
  "if (id === 'new') {\n      setMember({ name: '', email: '', package: 'Basic', status: 'Active', login: 'Just now', joined: new Date().toISOString().split('T')[0] });\n    } else if (id) {"
);

content = content.replace(
  /await fetch\('\/api\/members\/' \+ id, \{\s*method: 'PUT',\s*headers: \{ 'Content-Type': 'application\/json' \},\s*body: JSON\.stringify\(member\)\s*\}\);/,
  `if (id === 'new') {
        await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(member)
        });
      } else {
        await fetch('/api/members/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(member)
        });
      }`
);

content = content.replace(
  '<h1 className="text-2xl font-bold text-slate-900">Manage Member: {member.name}</h1>',
  '<h1 className="text-2xl font-bold text-slate-900">{id === "new" ? "Add New Member" : `Manage Member: ${member.name}`}</h1>'
);

fs.writeFileSync('src/admin/membership/MembershipForm.tsx', content);
