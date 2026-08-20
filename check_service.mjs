import fs from 'fs';
const pages = JSON.parse(fs.readFileSync('data/pages.json', 'utf8'));
const service = pages.find(p => p.slug === 'service');
console.log(service.content_en);
