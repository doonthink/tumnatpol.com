import fs from 'fs';

let content = fs.readFileSync('src/pages/SingleBlog.tsx', 'utf-8');

content = content.replace(
  'const { id } = useParams();',
  'const { id } = useParams();\n  const { i18n } = useTranslation();\n  const isEn = i18n.language === "en";'
);

fs.writeFileSync('src/pages/SingleBlog.tsx', content);
