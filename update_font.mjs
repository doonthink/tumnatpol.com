import fs from 'fs';

function updateFont(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(/UID Awakat=UID Awakat, sans-serif;/g, 'UID อวกาศ="UID อวกาศ", sans-serif; UID Awakat=UID Awakat, sans-serif;');
    
    fs.writeFileSync(filePath, content);
}

updateFont('src/admin/blogs/BlogForm.tsx');
updateFont('src/admin/pages/PageForm.tsx');
