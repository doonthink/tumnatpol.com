import fs from 'fs';

let content = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

if (!content.includes('useTranslation')) {
  content = content.replace("import { useScriptInjector } from '../hooks/useScriptInjector';", "import { useScriptInjector } from '../hooks/useScriptInjector';\nimport { useTranslation } from 'react-i18next';");
  
  content = content.replace('export function Home() {', 'export function Home() {\n  const { i18n } = useTranslation();\n  const isEn = i18n.language === "en";');
  
  content = content.replace(/page\?\.title/g, "(isEn && page?.title_en ? page.title_en : page?.title)");
  content = content.replace(/page\?\.seoDescription/g, "(isEn && page?.seoDescription_en ? page.seoDescription_en : page?.seoDescription)");
  
  content = content.replace(
    '<div dangerouslySetInnerHTML={{ __html: page.content }} />',
    '<div dangerouslySetInnerHTML={{ __html: isEn && page.content_en ? page.content_en : page.content }} />'
  );
  
  fs.writeFileSync('src/pages/Home.tsx', content);
}
