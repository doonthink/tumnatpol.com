import fs from 'fs';

let content = fs.readFileSync('src/components/LatestBlogs.tsx', 'utf-8');

if (!content.includes('useTranslation')) {
  content = content.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport { useTranslation } from 'react-i18next';");
  content = content.replace("export function LatestBlogs() {", "export function LatestBlogs() {\n  const { t, i18n } = useTranslation();\n  const isEn = i18n.language === 'en';");
  
  content = content.replace("บทความล่าสุด", "{t('latest_blogs.title')}");
  content = content.replace("อัปเดตความรู้และเทรนด์ธุรกิจเพื่อก้าวสู่มาตรฐาน Top Tier", "{t('latest_blogs.subtitle')}");
  content = content.replace("ดูบทความทั้งหมด", "{t('latest_blogs.view_all')}");
  content = content.replace("อ่านเพิ่มเติม", "{t('read_more')}");
  
  content = content.replace(/post\.title/g, "(isEn && post.title_en ? post.title_en : post.title)");
  content = content.replace(/post\.description/g, "(isEn && post.description_en ? post.description_en : post.description)");
  
  fs.writeFileSync('src/components/LatestBlogs.tsx', content);

  let i18n = fs.readFileSync('src/i18n.ts', 'utf-8');
  i18n = i18n.replace('admin: {', 'latest_blogs: {\n        title: "บทความล่าสุด",\n        subtitle: "อัปเดตความรู้และเทรนด์ธุรกิจเพื่อก้าวสู่มาตรฐาน Top Tier",\n        view_all: "ดูบทความทั้งหมด"\n      },\n      admin: {');
  i18n = i18n.replace('admin: {\n        dashboard: "Dashboard",', 'latest_blogs: {\n        title: "Latest Blogs",\n        subtitle: "Update knowledge and business trends to reach Top Tier standards",\n        view_all: "View all blogs"\n      },\n      admin: {\n        dashboard: "Dashboard",');
  fs.writeFileSync('src/i18n.ts', i18n);
}
