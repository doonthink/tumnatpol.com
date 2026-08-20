const fs = require('fs');

const fixValue = (file) => {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/value={formData\.headerScript}/g, "value={formData.headerScript || ''}");
  content = content.replace(/value={formData\.footerScript}/g, "value={formData.footerScript || ''}");
  content = content.replace(/value={formData\.slug}/g, "value={formData.slug || ''}");
  content = content.replace(/value={formData\.publishDate}/g, "value={formData.publishDate || ''}");
  content = content.replace(/value={formData\.tags}/g, "value={formData.tags || ''}");
  content = content.replace(/value={formData\.author}/g, "value={formData.author || ''}");
  content = content.replace(/value={formData\.category}/g, "value={formData.category || ''}");
  content = content.replace(/value={formData\.coverImage}/g, "value={formData.coverImage || ''}");
  
  // also fix setFormData
  content = content.replace(/setFormData\(data\);/g, "setFormData(prev => ({ ...prev, ...data }));");
  
  fs.writeFileSync(file, content);
};

fixValue('src/admin/pages/PageForm.tsx');
fixValue('src/admin/blogs/BlogForm.tsx');
