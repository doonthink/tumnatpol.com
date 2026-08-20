import fs from 'fs';

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove license_key from init
    content = content.replace(/license_key: 'gpl',\s*/g, '');
    
    // Add licenseKey="gpl" to Editor props
    content = content.replace(/<Editor/g, '<Editor\n                        licenseKey="gpl"');
    
    fs.writeFileSync(filePath, content);
}

fixFile('src/admin/blogs/BlogForm.tsx');
fixFile('src/admin/pages/PageForm.tsx');
