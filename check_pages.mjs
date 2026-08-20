import fs from 'fs';
const pages = JSON.parse(fs.readFileSync('data/pages.json', 'utf8'));
const home = pages.find(p => p.slug === 'home');
const service = pages.find(p => p.slug === 'service');

console.log("Home keys:", Object.keys(home));
console.log("Home content length:", home.content?.length);
console.log("Home content_en length:", home.content_en?.length);
console.log("Service keys:", Object.keys(service));
console.log("Service content length:", service.content?.length);
console.log("Service content_en length:", service.content_en?.length);
