import fs from 'fs';

let content = fs.readFileSync('src/index.css', 'utf8');

// Remove Quill specific CSS
content = content.replace(/\.ql-font-noto-sans-thai[\s\S]*?\/\* CKEditor Overrides \*\//g, '');
content = content.replace(/\.ck-editor__editable_inline[\s\S]*?\}/g, '');

fs.writeFileSync('src/index.css', content);
