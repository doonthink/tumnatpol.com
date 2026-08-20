import fs from 'fs';
let m = fs.readFileSync('src/admin/dashboard/Dashboard.tsx', 'utf8');

// Replace mock stats
m = m.replace(/value: '14,295'/g, "value: '0'");
m = m.replace(/value: '3,842'/g, "value: '0'");
m = m.replace(/value: '฿1\.2M'/g, "value: '฿0'");
m = m.replace(/value: '842\.5K'/g, "value: '0'");

// Empty recent activities
m = m.replace(/const recentActivities = \[[\s\S]*?\];/, 'const recentActivities: any[] = [];');

// Empty charts
m = m.replace(/const revenueData = \[[\s\S]*?\];/, 'const revenueData: any[] = [];');
m = m.replace(/const visitorData = \[[\s\S]*?\];/, 'const visitorData: any[] = [];');


fs.writeFileSync('src/admin/dashboard/Dashboard.tsx', m);
console.log("Updated Dashboard.tsx");
