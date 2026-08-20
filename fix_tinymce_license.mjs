import fs from 'fs';

function fixTinyMCE(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add license_key to init config
    content = content.replace(/init=\{\{/g, "init={{\n                            license_key: 'gpl',");
    
    fs.writeFileSync(filePath, content);
}

fixTinyMCE('src/admin/blogs/BlogForm.tsx');
fixTinyMCE('src/admin/pages/PageForm.tsx');
