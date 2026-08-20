import fs from 'fs';

const addPadding = (filePath, regex, replacement) => {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(filePath, content);
};

addPadding('src/admin/pages/PageList.tsx', /<div className="space-y-6">/, '<div className="p-8 space-y-6">');
addPadding('src/admin/blogs/BlogList.tsx', /<div className="space-y-6">/, '<div className="p-8 space-y-6">');
addPadding('src/admin/categories/CategoryList.tsx', /<div className="space-y-6">/, '<div className="p-8 space-y-6">');

addPadding('src/admin/pages/PageForm.tsx', /<div className="space-y-6 max-w-5xl mx-auto pb-12">/, '<div className="p-8 space-y-6 max-w-5xl mx-auto pb-12">');
addPadding('src/admin/blogs/BlogForm.tsx', /<div className="space-y-6 max-w-5xl mx-auto pb-12">/, '<div className="p-8 space-y-6 max-w-5xl mx-auto pb-12">');

