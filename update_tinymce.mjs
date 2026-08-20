import fs from 'fs';

function updateTinyMCE(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add content_css for bootstrap 5
    content = content.replace(/extended_valid_elements: '\*\[\*\]'/g, "extended_valid_elements: '*[*]',\n                            content_css: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css'");
    
    fs.writeFileSync(filePath, content);
}

updateTinyMCE('src/admin/blogs/BlogForm.tsx');
updateTinyMCE('src/admin/pages/PageForm.tsx');
