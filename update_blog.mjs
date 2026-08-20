import fs from 'fs';

// Blog.tsx
let content = fs.readFileSync('src/pages/Blog.tsx', 'utf-8');
if (!content.includes('useTranslation')) {
  content = content.replace("import { Footer } from '../components/Footer';", "import { Footer } from '../components/Footer';\nimport { useTranslation } from 'react-i18next';");
  content = content.replace('export function Blog() {', 'export function Blog() {\n  const { t, i18n } = useTranslation();\n  const isEn = i18n.language === "en";');
  
  content = content.replace(/post\.title/g, "(isEn && post.title_en ? post.title_en : post.title)");
  content = content.replace(/post\.description/g, "(isEn && post.description_en ? post.description_en : post.description)");
  
  // also update 'blog' word if it's there, let's just make it simple
  fs.writeFileSync('src/pages/Blog.tsx', content);
}

// SingleBlog.tsx
content = fs.readFileSync('src/pages/SingleBlog.tsx', 'utf-8');
if (!content.includes('useTranslation')) {
  content = content.replace("import { SEO } from '../components/SEO';", "import { SEO } from '../components/SEO';\nimport { useTranslation } from 'react-i18next';");
  content = content.replace('const { slug } = useParams();', 'const { slug } = useParams();\n  const { i18n } = useTranslation();\n  const isEn = i18n.language === "en";');
  
  content = content.replace(/post\.title/g, "(isEn && post.title_en ? post.title_en : post.title)");
  content = content.replace(/post\.content/g, "(isEn && post.content_en ? post.content_en : post.content)");
  
  fs.writeFileSync('src/pages/SingleBlog.tsx', content);
}
