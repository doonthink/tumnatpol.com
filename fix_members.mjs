import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  /else if \(resource === 'members'\) \{\s*data = \[\s*\{ id: 'M-001'[\s\S]*?\s*\];\s*\}/,
  "else if (resource === 'members') {\n          data = [];\n        }"
);
fs.writeFileSync('server.ts', content);
