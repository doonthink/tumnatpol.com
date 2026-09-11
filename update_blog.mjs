import fs from 'fs';

let content = fs.readFileSync('src/pages/Blog.tsx', 'utf8');

const importSettingsStr = `import { useState, useEffect } from 'react';
import { Header } from '../components/Header';`;

content = content.replace(importSettingsStr, importSettingsStr); // No change yet.

// We need to fetch settings
const fetchCode = `        const [blogsRes, catsRes, settingsRes] = await Promise.all([
          fetch('/api/blogs'),
          fetch('/api/categories'),
          fetch('/api/settings')
        ]);
        const blogsData = await blogsRes.json();
        const catsData = await catsRes.json();
        const settingsData = await settingsRes.json();
        setPosts(blogsData.filter((blog: any) => blog.status === 'Published'));
        setCategoriesData(catsData);
        if (settingsData && settingsData.pages && settingsData.pages.blog) {
          setBlogSettings(settingsData.pages.blog);
        }`;

content = content.replace(/const \[blogsRes, catsRes\] = await Promise\.all\(\[\s+fetch\('\/api\/blogs'\),\s+fetch\('\/api\/categories'\)\s+\]\);\s+const blogsData = await blogsRes\.json\(\);\s+const catsData = await catsRes\.json\(\);\s+setPosts\(blogsData\.filter\(\(blog: any\) => blog\.status === 'Published'\)\);\s+setCategoriesData\(catsData\);/, fetchCode);

if (!content.includes('setBlogSettings')) {
  console.error("Failed to inject fetchCode");
} else {
  // Add state for blogSettings
  content = content.replace(/const \[categoriesData, setCategoriesData\] = useState<any\[\]>\(\[\]\);/, `const [categoriesData, setCategoriesData] = useState<any[]>([]);\n  const [blogSettings, setBlogSettings] = useState<any>({});`);
  
  // Update rendering
  const renderOld = `<div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[#0D1B3D] mb-4">Biztoptier Articles</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {isEn ? "Update business trends, new technologies, and knowledge to elevate your organization to Top Tier" : "อัปเดตเทรนด์ธุรกิจ เทคโนโลยีใหม่ๆ และเกร็ดความรู้ที่ช่วยยกระดับองค์กรของคุณสู่ Top Tier"}
          </p>
        </div>`;
        
  const renderNew = `{/* Dynamic Banner from Settings */}
        {blogSettings.bg_type === 'image' && blogSettings.bg_image ? (
          <div className="relative w-full h-[400px] mb-12 rounded-2xl overflow-hidden flex items-center justify-center text-center px-4" style={{ backgroundImage: \`url('\${blogSettings.bg_image}')\`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: blogSettings.title_color || '#FFFFFF' }}>
                {isEn ? (blogSettings.title_en || 'Blog') : (blogSettings.title_th || 'บทความ')}
              </h1>
              <p className="text-lg md:text-xl" style={{ color: blogSettings.subtitle_color || '#FFFFFF' }}>
                {isEn ? (blogSettings.subtitle_en || 'Follow insightful articles') : (blogSettings.subtitle_th || 'ติดตามบทความและสาระดีจาก Business toptier')}
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-12 text-center p-12 rounded-2xl" style={{
            background: blogSettings.bg_type === 'gradient' 
              ? \`linear-gradient(135deg, \${blogSettings.bg_color1 || '#FDFAF6'} 0%, \${blogSettings.bg_color2 || '#FFFFFF'} \${blogSettings.bg_color3 ? '50%, ' + blogSettings.bg_color3 + ' 100%' : '100%'}) \`
              : (blogSettings.bg_color1 || 'transparent')
          }}>
            <h1 className="text-4xl font-bold mb-4" style={{ color: blogSettings.title_color || '#0D1B3D' }}>
              {isEn ? (blogSettings.title_en || 'Blog') : (blogSettings.title_th || 'บทความ')}
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: blogSettings.subtitle_color || '#64748B' }}>
              {isEn ? (blogSettings.subtitle_en || 'Follow insightful articles and valuable content from Business toptier') : (blogSettings.subtitle_th || 'ติดตามบทความและสาระดีจาก Business toptier')}
            </p>
          </div>
        )}`;

  content = content.replace(renderOld, renderNew);
  
  // also add negative margin or adjust main if needed, but the original was just inside main, so replacing the div is fine.
  
  fs.writeFileSync('src/pages/Blog.tsx', content);
  console.log("Updated Blog.tsx");
}

