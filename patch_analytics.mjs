import fs from 'fs';

let content = fs.readFileSync('src/admin/analytics/AnalyticsDashboard.tsx', 'utf8');

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

  const totalViews = blogs.reduce((acc, blog) => acc + (blog.views || 0), 0);

  const stats = [
    { title: t('admin.total_page_views'), value: totalViews.toString(), change: '+12.5%', trend: 'up', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: t('admin.unique_visitors'), value: '18,412', change: '+5.2%', trend: 'up', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: t('admin.avg_session'), value: '03:42', change: '-1.4%', trend: 'down', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: t('admin.bounce_rate'), value: '42.3%', change: '-2.1%', trend: 'up', icon: MousePointerClick, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];
`;

content = content.replace(/\{\[\s*\{\s*title:\s*t\('admin\.total_page_views'\)[\s\S]*?\n\s*\]\.map\(\(stat,\s*idx\)\s*=>/g, (match) => {
  return statsReplace.trim() + '\n        {stats.map((stat, idx) =>';
});

fs.writeFileSync('src/admin/analytics/AnalyticsDashboard.tsx', content);
