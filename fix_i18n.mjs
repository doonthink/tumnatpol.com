import fs from 'fs';
let content = fs.readFileSync('src/i18n.ts', 'utf8');

content = content.replace(/features_title:\s*"ความเชี่ยวชาญของเรา",,/, 'features_title: "ความเชี่ยวชาญของเรา",');
content = content.replace(/subtitle:\s*"บริการของเรา",\s*title:\s*"บริการของเรา"/, 'subtitle: "Our Service",\n        title: "บริการของเรา"');

fs.writeFileSync('src/i18n.ts', content);
