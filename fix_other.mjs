import fs from 'fs';

let bl = fs.readFileSync('src/pages/Blog.tsx', 'utf-8');
bl = bl.replace('อัปเดตเทรนด์ธุรกิจ เทคโนโลยีใหม่ๆ และเกร็ดความรู้ที่ช่วยยกระดับองค์กรของคุณสู่ Top Tier', '{isEn ? "Update business trends, new technologies, and knowledge to elevate your organization to Top Tier" : "อัปเดตเทรนด์ธุรกิจ เทคโนโลยีใหม่ๆ และเกร็ดความรู้ที่ช่วยยกระดับองค์กรของคุณสู่ Top Tier"}');
bl = bl.replace('ค้นหาบทความ...', '{isEn ? "Search articles..." : "ค้นหาบทความ..."}');
bl = bl.replace('ทุกหมวดหมู่ (All)', '{isEn ? "All Categories" : "ทุกหมวดหมู่ (All)"}');
bl = bl.replace('กำลังโหลดบทความ...', '{isEn ? "Loading articles..." : "กำลังโหลดบทความ..."}');
bl = bl.replace('บทความแนะนำ', '{isEn ? "Recommended Article" : "บทความแนะนำ"}');
bl = bl.replace('อ่านเพิ่มเติม', '{isEn ? "Read more" : "อ่านเพิ่มเติม"}');
bl = bl.replace('ไม่พบข้อมูลที่ค้นหา', '{isEn ? "No matching articles found" : "ไม่พบข้อมูลที่ค้นหา"}');
bl = bl.replace(/หน้า \{currentPage\} จาก \{totalPages\}/, '{isEn ? `Page ${currentPage} of ${totalPages}` : `หน้า ${currentPage} จาก ${totalPages}`}');

if (!bl.includes('useTranslation')) {
    bl = bl.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport { useTranslation } from 'react-i18next';");
    bl = bl.replace("export function Blog() {", "export function Blog() {\n  const { i18n } = useTranslation();\n  const isEn = i18n.language === 'en';");
}

fs.writeFileSync('src/pages/Blog.tsx', bl);

let sb = fs.readFileSync('src/pages/SingleBlog.tsx', 'utf-8');
sb = sb.replace('<p className="text-slate-500">กำลังโหลด...</p>', '<p className="text-slate-500">{isEn ? "Loading..." : "กำลังโหลด..."}</p>');
sb = sb.replace('<p className="text-lg text-slate-600 mb-8">ไม่พบบทความที่คุณต้องการ</p>', '<p className="text-lg text-slate-600 mb-8">{isEn ? "Article not found" : "ไม่พบบทความที่คุณต้องการ"}</p>');
sb = sb.replace('กลับหน้าบล็อก', '{isEn ? "Back to blog" : "กลับหน้าบล็อก"}');
sb = sb.replace('บทความที่เกี่ยวข้อง', '{isEn ? "Related Articles" : "บทความที่เกี่ยวข้อง"}');
sb = sb.replace(/\{post\.views \|\| 0\} ครั้ง/, '{post.views || 0} {isEn ? "views" : "ครั้ง"}');

fs.writeFileSync('src/pages/SingleBlog.tsx', sb);

let reg = fs.readFileSync('src/pages/Register.tsx', 'utf-8');
reg = reg.replace('ขอ OTP', '{t("request_otp")}'); // Fix duplicate tags replacement if any
// Also let's check for any remaining Thai text in Register.tsx
reg = reg.replace('>อีเมล<', '>{t("email")}<');
reg = reg.replace('>อีเมล<', '>{t("email")}<');
reg = reg.replace('>เบอร์โทรศัพท์ (OTP)<', '>{t("phone_otp")}<');
reg = reg.replace('>เบอร์โทรศัพท์<', '>{t("phone_number")}<');
reg = reg.replace('>รหัสผ่าน<', '>{t("password")}<');
reg = reg.replace('>รหัส OTP<', '>{t("otp_code")}<');

fs.writeFileSync('src/pages/Register.tsx', reg);

let ft = fs.readFileSync('src/components/Features.tsx', 'utf-8');
ft = ft.replace("name: 'เครือข่ายไร้รอยต่อ',", "name: 'Seamless Network',");
ft = ft.replace("description: 'เชื่อมโยงธุรกิจข้ามอุตสาหกรรม ค้นหาคู่ค้าและพันธมิตรที่เหมาะสมกับเป้าหมายของคุณได้อย่างรวดเร็ว',", "description: 'Connect businesses across industries, quickly find partners that match your goals.',");
ft = ft.replace("name: 'ข้อมูลที่เชื่อถือได้',", "name: 'Reliable Data',");
ft = ft.replace("description: 'ระบบยืนยันตัวตนและโปรไฟล์ธุรกิจที่ชัดเจน สร้างความมั่นใจในการเจรจาและทำธุรกรรม',", "description: 'Clear identity verification and business profiles, building confidence in negotiations and transactions.',");
ft = ft.replace("name: 'เจรจาธุรกิจโดยตรง',", "name: 'Direct Business Negotiation',");
ft = ft.replace("description: 'ลดตัวกลาง เพิ่มผลกำไร ด้วยช่องทางการติดต่อโดยตรงระหว่างผู้ประกอบการกับผู้ประกอบการ (B2B)',", "description: 'Reduce middlemen, increase profit with direct B2B communication channels.',");
ft = ft.replace("name: 'วิเคราะห์การเติบโต',", "name: 'Growth Analysis',");
ft = ft.replace("description: 'เข้าถึงข้อมูลเชิงลึก ภาพรวมตลาด และเทรนด์ธุรกิจเพื่อประกอบการตัดสินใจที่แม่นยำ',", "description: 'Access insights, market overview, and business trends for accurate decision making.',");
// Replace hardcoded descriptions
ft = ft.replace("เราออกแบบแพลตฟอร์มมาเพื่อตอบสนองความต้องการของธุรกิจยุคดิจิทัล", "");
ft = ft.replace("ให้การค้นหา นำเสนอ และเชื่อมต่อ เป็นเรื่องง่ายและมีประสิทธิภาพสูงสุด", "");
fs.writeFileSync('src/components/Features.tsx', ft);

