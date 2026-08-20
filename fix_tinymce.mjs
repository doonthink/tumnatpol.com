import fs from 'fs';

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(/licenseKey="gpl"/g, 'licenseKey="gpl"\n                        tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@7.3.0/tinymce.min.js"');
    content = content.replace(/apiKey="no-api-key"\s*/g, '');
    
    fs.writeFileSync(filePath, content);
}

fixFile('src/admin/blogs/BlogForm.tsx');
fixFile('src/admin/pages/PageForm.tsx');
