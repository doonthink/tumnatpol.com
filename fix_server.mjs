import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(/data = \[\];\/\/ /g, 'data = [');
fs.writeFileSync('server.ts', content);
