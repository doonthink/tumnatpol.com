import fs from 'fs';

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/<CKEditor\s+editor=\{ ClassicEditor \}\s+data=/g, '<CKEditor\n                        editor={ ClassicEditor }\n                        config={{ licenseKey: \'GPL\' }}\n                        data=');
    fs.writeFileSync(filePath, content);
}

fixFile('src/admin/blogs/BlogForm.tsx');
fixFile('src/admin/pages/PageForm.tsx');
