import fs from 'fs';

let content = fs.readFileSync('src/components/LatestBlogs.tsx', 'utf8');

const fetchCode = `        const [blogsRes, catsRes, settingsRes] = await Promise.all([
          fetch('/api/blogs'),
          fetch('/api/categories'),
          fetch('/api/settings')
        ]);
        const data = await blogsRes.json();
        const catsData = await catsRes.json();
        const settingsData = await settingsRes.json();
        
        if (settingsData && settingsData.pages && settingsData.pages.blog) {
          setBlogSettings(settingsData.pages.blog);
        }`;

content = content.replace(/const \[blogsRes, catsRes\] = await Promise\.all\(\[\s+fetch\('\/api\/blogs'\),\s+fetch\('\/api\/categories'\)\s+\]\);\s+const data = await blogsRes\.json\(\);\s+const catsData = await catsRes\.json\(\);/, fetchCode);

if (!content.includes('setBlogSettings')) {
  console.error("Failed to inject fetchCode");
} else {
  // Add state for blogSettings
  content = content.replace(/const \[categoriesData, setCategoriesData\] = useState<any\[\]>\(\[\]\);/, `const [categoriesData, setCategoriesData] = useState<any[]>([]);\n  const [blogSettings, setBlogSettings] = useState<any>({});`);
  
  // Update rendering
  const renderOld = `<div>
            <h2 className="text-3xl font-bold text-[#0D1B3D] mb-4">{t('latest_blogs.title')}</h2>
            <p className="text-lg text-slate-600 max-w-2xl">{t('latest_blogs.subtitle')}</p>
          </div>`;
        
  const renderNew = `<div>
            <h2 className="text-3xl font-bold text-[#0D1B3D] mb-4">
              {isEn ? (blogSettings.home_title_en || t('latest_blogs.title')) : (blogSettings.home_title_th || t('latest_blogs.title'))}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              {isEn ? (blogSettings.home_subtitle_en || t('latest_blogs.subtitle')) : (blogSettings.home_subtitle_th || t('latest_blogs.subtitle'))}
            </p>
          </div>`;

  content = content.replace(renderOld, renderNew);
  
  fs.writeFileSync('src/components/LatestBlogs.tsx', content);
  console.log("Updated LatestBlogs.tsx");
}

