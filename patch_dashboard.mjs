import fs from 'fs';

let content = fs.readFileSync('src/admin/dashboard/Dashboard.tsx', 'utf8');

// Add useState, useEffect if not there
if (!content.includes('useState')) {
  content = content.replace("import { useTranslation } from 'react-i18next';", "import { useTranslation } from 'react-i18next';\nimport { useState, useEffect } from 'react';");
}

const statsReplace = `
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(console.error);
  }, []);

  const totalArticles = blogs.length;
  const totalViews = blogs.reduce((acc, blog) => acc + (blog.views || 0), 0);

  const stats = [
    { title: t('admin.total_members'), value: '0', change: '0%', trend: 'up', icon: Users, color: 'bg-blue-500' },
    { title: t('admin.active_packages'), value: '0', change: '0%', trend: 'up', icon: ShoppingCart, color: 'bg-indigo-500' },
    { title: 'ยอดบทความทั้งหมด', value: totalArticles.toString(), change: '0%', trend: 'up', icon: FileText, color: 'bg-emerald-500' },
    { title: 'ยอดเข้าชม', value: totalViews.toString(), change: '0%', trend: 'up', icon: Eye, color: 'bg-[#B87333]' },
  ];
`;

content = content.replace(/const stats = \[[\s\S]*?\];/, statsReplace.trim());

fs.writeFileSync('src/admin/dashboard/Dashboard.tsx', content);
