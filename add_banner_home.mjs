import fs from 'fs';
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

content = content.replace("import { Hero } from '../components/Hero';", "import { Hero } from '../components/Hero';\nimport { BannerCarousel } from '../components/BannerCarousel';");
content = content.replace("<Hero />", "<BannerCarousel />\n        <Hero />");

fs.writeFileSync('src/pages/Home.tsx', content);
