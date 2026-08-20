import fs from 'fs';
let content = fs.readFileSync('src/index.css', 'utf-8');

if (!content.includes('letter-spacing: -0.015em;')) {
  content = content.replace(/body\s*\{\s*@apply[^;]+;/, match => match + "\n  letter-spacing: -0.015em;");
  fs.writeFileSync('src/index.css', content);
}
