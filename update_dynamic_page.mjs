import fs from 'fs';

let content = fs.readFileSync('src/pages/DynamicPage.tsx', 'utf-8');

if (!content.includes('useTranslation')) {
  content = content.replace("import { useScriptInjector } from '../hooks/useScriptInjector';", "import { useScriptInjector } from '../hooks/useScriptInjector';\nimport { useTranslation } from 'react-i18next';");
  
  content = content.replace(
    'const { slug: paramSlug } = useParams();',
    'const { slug: paramSlug } = useParams();\n  const { i18n } = useTranslation();\n  const isEn = i18n.language === "en";'
  );

  content = content.replace(/page\.title/g, "(isEn && page.title_en ? page.title_en : page.title)");
  content = content.replace(/page\.description/g, "(isEn && page.description_en ? page.description_en : page.description)");
  content = content.replace(/page\.content/g, "(isEn && page.content_en ? page.content_en : page.content)");
  content = content.replace(/page\.seoDescription/g, "(isEn && page.seoDescription_en ? page.seoDescription_en : page.seoDescription)");

  fs.writeFileSync('src/pages/DynamicPage.tsx', content);
}
