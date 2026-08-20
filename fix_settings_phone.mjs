import fs from 'fs';
let content = fs.readFileSync('src/admin/settings/SettingsPage.tsx', 'utf8');
content = content.replace('+66 2 123 4567', '0617898692');
fs.writeFileSync('src/admin/settings/SettingsPage.tsx', content);
