import fs from 'fs';
let content = fs.readFileSync('src/admin/settings/StaffSettings.tsx', 'utf8');
content = content.replace(/handleDelete\(staff.id\)/g, 'handleDeleteClick(staff.id)');
fs.writeFileSync('src/admin/settings/StaffSettings.tsx', content);
