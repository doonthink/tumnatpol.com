import fs from 'fs';
let css = fs.readFileSync('src/index.css', 'utf-8');

// Add min-height to CKEditor so it looks like quill did
if (!css.includes('.ck-editor__editable_inline')) {
    css += `\n/* CKEditor Overrides */\n.ck-editor__editable_inline {\n  min-height: 300px;\n}\n`;
    fs.writeFileSync('src/index.css', css);
}

