import fs from 'fs';

let dashboard = fs.readFileSync('src/admin/dashboard/Dashboard.tsx', 'utf8');
dashboard = dashboard.replace(/action\.link/g, '(action as any).link || "/"');
fs.writeFileSync('src/admin/dashboard/Dashboard.tsx', dashboard);
console.log("Fixed TS");
