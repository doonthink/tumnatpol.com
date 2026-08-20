import fs from 'fs';
let content = fs.readFileSync('src/index.css', 'utf-8');

const importRegex = /@import url\('https:\/\/fonts.googleapis.com[^']*'\);/;
const newImport = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Anuphan:wght@300;400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&family=Prompt:wght@300;400;500;600;700&display=swap');`;

if (importRegex.test(content)) {
  content = content.replace(importRegex, newImport);
} else {
  content = newImport + "\n" + content;
}

const quillFontsCss = `
.ql-font-noto-sans-thai {
  font-family: 'Noto Sans Thai', sans-serif;
}
.ql-font-prompt {
  font-family: 'Prompt', sans-serif;
}
.ql-font-anuphan {
  font-family: 'Anuphan', sans-serif;
}
`;

if (!content.includes('.ql-font-noto-sans-thai')) {
  content += quillFontsCss;
}

fs.writeFileSync('src/index.css', content);
