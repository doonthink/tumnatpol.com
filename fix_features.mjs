import fs from 'fs';

let content = fs.readFileSync('src/components/Features.tsx', 'utf-8');

if (!content.includes('useTranslation')) {
  content = content.replace(
    "import { BarChart3, Handshake, Network, ShieldCheck } from 'lucide-react';",
    "import { BarChart3, Handshake, Network, ShieldCheck } from 'lucide-react';\nimport { useTranslation } from 'react-i18next';"
  );
  
  content = content.replace("export function Features() {", "export function Features() {\n  const { t } = useTranslation();");
  
  content = content.replace("บริการของเรา (Our Services)", "{t('features.our_services')}");
  content = content.replace("ทำไมต้อง Biz Toptier?", "{t('features.why')}");
  content = content.replace(
    "เราออกแบบแพลตฟอร์มมาเพื่อตอบสนองความต้องการของธุรกิจยุคดิจิทัล             ให้การค้นหา นำเสนอ และเชื่อมต่อ เป็นเรื่องง่ายและมีประสิทธิภาพสูงสุด",
    "{t('features.desc')}"
  );

  content = content.replace(
    /\{feature\.name\}/g,
    "{t(`features.list.\${index}.name`, { defaultValue: feature.name })}"
  );
  content = content.replace(
    /\{feature\.description\}/g,
    "{t(`features.list.\${index}.desc`, { defaultValue: feature.description })}"
  );
  
  fs.writeFileSync('src/components/Features.tsx', content);

  let i18n = fs.readFileSync('src/i18n.ts', 'utf-8');
  i18n = i18n.replace('admin: {', 'features: {\n        our_services: "บริการของเรา (Our Services)",\n        why: "ทำไมต้อง Biz Toptier?",\n        desc: "เราออกแบบแพลตฟอร์มมาเพื่อตอบสนองความต้องการของธุรกิจยุคดิจิทัล ให้การค้นหา นำเสนอ และเชื่อมต่อ เป็นเรื่องง่ายและมีประสิทธิภาพสูงสุด",\n        list: [\n          { name: "เครือข่ายไร้รอยต่อ", desc: "เชื่อมโยงธุรกิจข้ามอุตสาหกรรม ค้นหาคู่ค้าและพันธมิตรที่เหมาะสมกับเป้าหมายของคุณได้อย่างรวดเร็ว" },\n          { name: "ข้อมูลที่เชื่อถือได้", desc: "ระบบยืนยันตัวตนและโปรไฟล์ธุรกิจที่ชัดเจน สร้างความมั่นใจในการเจรจาและทำธุรกรรม" },\n          { name: "เจรจาธุรกิจโดยตรง", desc: "ลดตัวกลาง เพิ่มผลกำไร ด้วยช่องทางการติดต่อโดยตรงระหว่างผู้ประกอบการกับผู้ประกอบการ (B2B)" },\n          { name: "วิเคราะห์การเติบโต", desc: "เข้าถึงข้อมูลเชิงลึก ภาพรวมตลาด และเทรนด์ธุรกิจเพื่อประกอบการตัดสินใจที่แม่นยำ" }\n        ]\n      },\n      admin: {');
  i18n = i18n.replace('admin: {\n        dashboard: "Dashboard",', 'features: {\n        our_services: "Our Services",\n        why: "Why Biz Toptier?",\n        desc: "We designed a platform to meet the needs of digital businesses, making searching, presenting, and connecting easy and highly efficient.",\n        list: [\n          { name: "Seamless Network", desc: "Connect businesses across industries, quickly find partners that match your goals." },\n          { name: "Reliable Data", desc: "Clear identity verification and business profiles, building confidence in negotiations and transactions." },\n          { name: "Direct Business Negotiation", desc: "Reduce middlemen, increase profit with direct B2B communication channels." },\n          { name: "Growth Analysis", desc: "Access insights, market overview, and business trends for accurate decision making." }\n        ]\n      },\n      admin: {\n        dashboard: "Dashboard",');
  fs.writeFileSync('src/i18n.ts', i18n);
}
