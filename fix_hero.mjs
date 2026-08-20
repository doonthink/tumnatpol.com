import fs from 'fs';

let content = fs.readFileSync('src/components/Hero.tsx', 'utf-8');

content = content.replace("import { ArrowRight, Globe2, TrendingUp } from 'lucide-react';", "import { ArrowRight, Globe2, TrendingUp } from 'lucide-react';\nimport { useTranslation } from 'react-i18next';");
content = content.replace("export function Hero() {", "export function Hero() {\n  const { t } = useTranslation();");

content = content.replace("ศูนย์กลางข้อมูลธุรกิจแห่งอนาคต", "{t('hero.subtitle')}");
content = content.replace(/เชื่อมต่อทุกโอกาส <br \/>\s*<span className="text-\[\#B87333\]">\s*ขยายเครือข่ายธุรกิจ\s*<\/span>/, "{t('hero.title_1')} <br />\n              <span className=\"text-[#B87333]\">\n                {t('hero.title_2')}\n              </span>");
content = content.replace("Biz Toptier ศูนย์รวมข้อมูลสำหรับธุรกิจทุกขนาด (SME ถึง Enterprise) \n              สร้างเครือข่ายที่แข็งแกร่งเพื่อการแลกเปลี่ยนบริการและสินค้าอย่างครอบคลุม", "{t('hero.desc')}");
content = content.replace("เริ่มต้นใช้งานฟรี", "{t('hero.start_free')}");
content = content.replace("ค้นหาธุรกิจ", "{t('hero.search_business')}");
content = content.replace("ธุรกิจในระบบ", "{t('hero.businesses_in_system')}");
content = content.replace("อัปเดตล่าสุดวันนี้", "{t('hero.updated_today')}");

fs.writeFileSync('src/components/Hero.tsx', content);

let i18n = fs.readFileSync('src/i18n.ts', 'utf-8');
i18n = i18n.replace('admin: {', 'hero: {\n        subtitle: "ศูนย์กลางข้อมูลธุรกิจแห่งอนาคต",\n        title_1: "เชื่อมต่อทุกโอกาส",\n        title_2: "ขยายเครือข่ายธุรกิจ",\n        desc: "Biz Toptier ศูนย์รวมข้อมูลสำหรับธุรกิจทุกขนาด (SME ถึง Enterprise) สร้างเครือข่ายที่แข็งแกร่งเพื่อการแลกเปลี่ยนบริการและสินค้าอย่างครอบคลุม",\n        start_free: "เริ่มต้นใช้งานฟรี",\n        search_business: "ค้นหาธุรกิจ",\n        businesses_in_system: "ธุรกิจในระบบ",\n        updated_today: "อัปเดตล่าสุดวันนี้"\n      },\n      admin: {');
i18n = i18n.replace('admin: {\n        dashboard: "Dashboard",', 'hero: {\n        subtitle: "Future Business Data Hub",\n        title_1: "Connect Every Opportunity",\n        title_2: "Expand Business Network",\n        desc: "Biz Toptier is an information hub for businesses of all sizes (SME to Enterprise). Build a strong network for comprehensive service and product exchange.",\n        start_free: "Start for free",\n        search_business: "Search Business",\n        businesses_in_system: "Businesses in system",\n        updated_today: "Updated today"\n      },\n      admin: {\n        dashboard: "Dashboard",');
fs.writeFileSync('src/i18n.ts', i18n);
