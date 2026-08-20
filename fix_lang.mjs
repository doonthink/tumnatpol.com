import fs from 'fs';

// 1. Fix DynamicPage.tsx (remove tags)
let dp = fs.readFileSync('src/pages/DynamicPage.tsx', 'utf-8');
// Translate "กำลังโหลด..." and "ไม่พบหน้าที่คุณต้องการ"
dp = dp.replace('<p className="text-slate-500">กำลังโหลด...</p>', '<p className="text-slate-500">{isEn ? "Loading..." : "กำลังโหลด..."}</p>');
dp = dp.replace('<p className="text-lg text-slate-600 mb-8">ไม่พบหน้าที่คุณต้องการ</p>', '<p className="text-lg text-slate-600 mb-8">{isEn ? "Page Not Found" : "ไม่พบหน้าที่คุณต้องการ"}</p>');
// Remove tags
dp = dp.replace(/\{page\.tags && \([\s\S]*?\}\)\}/, '');
fs.writeFileSync('src/pages/DynamicPage.tsx', dp);

// 2. Fix SingleBlog.tsx (remove tags)
let sb = fs.readFileSync('src/pages/SingleBlog.tsx', 'utf-8');
// translate "กลับไปหน้ารวมบทความ"
sb = sb.replace('กลับไปหน้ารวมบทความ', '{isEn ? "Back to Blogs" : "กลับไปหน้ารวมบทความ"}');
// remove tags entirely
sb = sb.replace(/<div className="flex items-center gap-2 flex-wrap">[\s\S]*?<\/div>\s*<div className="flex items-center gap-3">/, '<div className="flex items-center gap-3">');
// translate "แชร์บทความนี้:"
sb = sb.replace('แชร์บทความนี้:', '{isEn ? "Share this article:" : "แชร์บทความนี้:"}');
fs.writeFileSync('src/pages/SingleBlog.tsx', sb);

// 3. Fix Blog.tsx
let bl = fs.readFileSync('src/pages/Blog.tsx', 'utf-8');
bl = bl.replace('บทความล่าสุด', '{isEn ? "Latest Blogs" : "บทความล่าสุด"}');
bl = bl.replace('อัปเดตความรู้และเทรนด์ธุรกิจเพื่อก้าวสู่มาตรฐาน Top Tier', '{isEn ? "Update knowledge and business trends to reach Top Tier standards" : "อัปเดตความรู้และเทรนด์ธุรกิจเพื่อก้าวสู่มาตรฐาน Top Tier"}');
bl = bl.replace(/<span className="text-slate-400 text-sm">ไม่มีแท็ก<\/span>/g, '<span className="text-slate-400 text-sm">{isEn ? "No tags" : "ไม่มีแท็ก"}</span>');
fs.writeFileSync('src/pages/Blog.tsx', bl);

// 4. Update i18n.ts
let i18n = fs.readFileSync('src/i18n.ts', 'utf-8');
const thTranslations = `
      register: "สมัครสมาชิก",
      register_desc: "สร้างบัญชีเพื่อเริ่มต้นใช้งาน BIZ Toptier",
      email: "อีเมล",
      phone_otp: "เบอร์โทรศัพท์ (OTP)",
      password: "รหัสผ่าน",
      phone_number: "เบอร์โทรศัพท์",
      request_otp: "ขอ OTP",
      otp_code: "รหัส OTP",
      or_register_with: "หรือสมัครด้วย",
      register_with_google: "สมัครด้วย Google",
      register_with_facebook: "สมัครด้วย Facebook",
      register_with_line: "สมัครด้วย LINE",
      already_have_account: "มีบัญชีผู้ใช้งานแล้ว?",
      login_here: "เข้าสู่ระบบ",
      web_dev: "พัฒนาเว็บไซต์ (Web Dev)",
      soft_dev: "พัฒนาซอฟต์แวร์ (Software Dev)",
      ai_sol: "โซลูชัน AI (AI Solutions)",
      bus_plat: "แพลตฟอร์มธุรกิจ (Business Platform)",
      dig_mar: "การตลาดดิจิทัล (Digital Marketing)",
      faq: "คำถามที่พบบ่อย (FAQ)",
      privacy: "นโยบายความเป็นส่วนตัว (Privacy)",
      terms: "ข้อกำหนดและเงื่อนไข (Terms)",
      cookies: "นโยบายคุกกี้ (Cookies)",
      our_services_items: {
        item1_title: "1. Business Analysis",
        item1_sub: "บริการวิเคราะห์และประเมินศักยภาพธุรกิจ",
        item1_1: "วิเคราะห์ปัญหาและความต้องการขององค์กร",
        item1_2: "ประเมินความพร้อมของธุรกิจ",
        item1_3: "ค้นหา Root Cause",
        item1_4: "จัดทำแนวทางการพัฒนา (Improvement Plan)",
        item2_title: "2. Business Matching",
        item2_sub: "บริการเชื่อมต่อธุรกิจแบบรักษาความลับ",
        item2_1: "รับ Requirement จากองค์กร",
        item2_2: "วิเคราะห์ความต้องการ",
        item2_3: "คัดกรองพันธมิตรที่เหมาะสม",
        item2_4: "ไม่เปิดเผยข้อมูลของทั้งสองฝ่าย",
        item2_5: "ประสานงานจนเกิดความร่วมมือ",
        item3_title: "3. Solution Advisory",
        item3_sub: "บริการให้คำปรึกษาและออกแบบ Solution",
        item3_desc: "เมื่อวิเคราะห์ธุรกิจแล้ว BizTopTier จะช่วยกำหนดว่าองค์กรควรใช้บริการหรือโซลูชันแบบใด เช่น:",
        item3_italic: "โดยไม่ยึดติดกับผู้ให้บริการรายใดรายหนึ่ง",
        item4_title: "4. Partner Solution Management",
        item4_sub: "บริการคัดเลือกและบริหารผู้ให้บริการ",
        item4_1: "คัดเลือกผู้ให้บริการจากเครือข่าย",
        item4_2: "เปรียบเทียบความเหมาะสม",
        item4_3: "ประเมินคุณภาพ",
        item4_4: "ประสานงาน",
        item4_5: "ติดตามผลการดำเนินงาน",
        item5_title: "5. Business Growth Support",
        item5_sub: "บริการติดตามผลและสนับสนุนการเติบโต",
        item5_1: "ติดตามผลลัพธ์หลังส่งมอบ Solution",
        item5_2: "ประเมินผลการดำเนินงาน",
        item5_3: "ให้คำแนะนำเพิ่มเติม",
        item5_4: "เชื่อมต่อ Solution ใหม่เมื่อธุรกิจมีความต้องการเพิ่มเติม",
      }
`;

const enTranslations = `
      register: "Register",
      register_desc: "Create an account to get started with BIZ Toptier",
      email: "Email",
      phone_otp: "Phone Number (OTP)",
      password: "Password",
      phone_number: "Phone Number",
      request_otp: "Request OTP",
      otp_code: "OTP Code",
      or_register_with: "Or register with",
      register_with_google: "Register with Google",
      register_with_facebook: "Register with Facebook",
      register_with_line: "Register with LINE",
      already_have_account: "Already have an account?",
      login_here: "Login here",
      web_dev: "Web Development",
      soft_dev: "Software Development",
      ai_sol: "AI Solutions",
      bus_plat: "Business Platform",
      dig_mar: "Digital Marketing",
      faq: "FAQ",
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
      cookies: "Cookie Policy",
      our_services_items: {
        item1_title: "1. Business Analysis",
        item1_sub: "Business analysis and potential assessment service",
        item1_1: "Analyze organizational problems and needs",
        item1_2: "Assess business readiness",
        item1_3: "Find Root Cause",
        item1_4: "Create an Improvement Plan",
        item2_title: "2. Business Matching",
        item2_sub: "Confidential business matching service",
        item2_1: "Receive Requirements from organizations",
        item2_2: "Analyze needs",
        item2_3: "Screen suitable partners",
        item2_4: "Keep information of both parties confidential",
        item2_5: "Coordinate until cooperation occurs",
        item3_title: "3. Solution Advisory",
        item3_sub: "Consulting and Solution design service",
        item3_desc: "After business analysis, BizTopTier will help determine what services or solutions the organization should use, such as:",
        item3_italic: "Without being tied to any specific provider",
        item4_title: "4. Partner Solution Management",
        item4_sub: "Provider selection and management service",
        item4_1: "Select providers from the network",
        item4_2: "Compare suitability",
        item4_3: "Assess quality",
        item4_4: "Coordinate",
        item4_5: "Track performance",
        item5_title: "5. Business Growth Support",
        item5_sub: "Follow-up and growth support service",
        item5_1: "Track results after Solution delivery",
        item5_2: "Assess performance",
        item5_3: "Provide additional advice",
        item5_4: "Connect new Solutions when business has additional needs",
      }
`;

if (!i18n.includes('register_desc:')) {
  i18n = i18n.replace('features: {', thTranslations + ',\n      features: {');
  i18n = i18n.replace('features: {\n        our_services', enTranslations + ',\n      features: {\n        our_services');
  fs.writeFileSync('src/i18n.ts', i18n);
}

// 5. Update Register.tsx
let reg = fs.readFileSync('src/pages/Register.tsx', 'utf-8');
reg = reg.replace('สร้างบัญชีเพื่อเริ่มต้นใช้งาน BIZ Toptier', '{t("register_desc")}');
reg = reg.replace('>อีเมล<', '>{t("email")}<');
reg = reg.replace('>อีเมล<', '>{t("email")}<');
reg = reg.replace('>เบอร์โทรศัพท์ (OTP)<', '>{t("phone_otp")}<');
reg = reg.replace('>เบอร์โทรศัพท์<', '>{t("phone_number")}<');
reg = reg.replace('>รหัสผ่าน<', '>{t("password")}<');
reg = reg.replace('>ขอ OTP<', '>{t("request_otp")}<');
reg = reg.replace('>รหัส OTP<', '>{t("otp_code")}<');
reg = reg.replace('สมัครสมาชิก', '{t("register")}');
reg = reg.replace('หรือสมัครด้วย', '{t("or_register_with")}');
reg = reg.replace('สมัครด้วย Google', '{t("register_with_google")}');
reg = reg.replace('สมัครด้วย Facebook', '{t("register_with_facebook")}');
reg = reg.replace('สมัครด้วย LINE', '{t("register_with_line")}');
reg = reg.replace('มีบัญชีผู้ใช้งานแล้ว?', '{t("already_have_account")}');
reg = reg.replace('เข้าสู่ระบบ', '{t("login_here")}');
fs.writeFileSync('src/pages/Register.tsx', reg);

// 6. Update Footer.tsx
let foot = fs.readFileSync('src/components/Footer.tsx', 'utf-8');
foot = foot.replace('พัฒนาเว็บไซต์ (Web Dev)', '{t("web_dev")}');
foot = foot.replace('พัฒนาซอฟต์แวร์ (Software Dev)', '{t("soft_dev")}');
foot = foot.replace('โซลูชัน AI (AI Solutions)', '{t("ai_sol")}');
foot = foot.replace('แพลตฟอร์มธุรกิจ (Business Platform)', '{t("bus_plat")}');
foot = foot.replace('การตลาดดิจิทัล (Digital Marketing)', '{t("dig_mar")}');
foot = foot.replace('คำถามที่พบบ่อย (FAQ)', '{t("faq")}');
foot = foot.replace('นโยบายความเป็นส่วนตัว (Privacy)', '{t("privacy")}');
foot = foot.replace('ข้อกำหนดและเงื่อนไข (Terms)', '{t("terms")}');
foot = foot.replace('นโยบายคุกกี้ (Cookies)', '{t("cookies")}');
fs.writeFileSync('src/components/Footer.tsx', foot);

// 7. Update OurServices.tsx
let os = fs.readFileSync('src/components/OurServices.tsx', 'utf-8');
if (!os.includes('useTranslation')) {
  os = os.replace("import { Briefcase, Lightbulb, LineChart, ShieldCheck, TrendingUp } from 'lucide-react';", "import { Briefcase, Lightbulb, LineChart, ShieldCheck, TrendingUp } from 'lucide-react';\nimport { useTranslation } from 'react-i18next';");
  os = os.replace("export function OurServices() {", "export function OurServices() {\n  const { t } = useTranslation();");
}

// Remove the heading as requested
os = os.replace(/<div className="mx-auto max-w-2xl text-center mb-16">[\s\S]*?<\/div>/, '');

// Replace texts
os = os.replace('>1. Business Analysis<', '>{t("our_services_items.item1_title")}<');
os = os.replace('บริการวิเคราะห์และประเมินศักยภาพธุรกิจ', '{t("our_services_items.item1_sub")}');
os = os.replace('วิเคราะห์ปัญหาและความต้องการขององค์กร', '{t("our_services_items.item1_1")}');
os = os.replace('ประเมินความพร้อมของธุรกิจ', '{t("our_services_items.item1_2")}');
os = os.replace('ค้นหา Root Cause', '{t("our_services_items.item1_3")}');
os = os.replace('จัดทำแนวทางการพัฒนา (Improvement Plan)', '{t("our_services_items.item1_4")}');

os = os.replace('>2. Business Matching<', '>{t("our_services_items.item2_title")}<');
os = os.replace('บริการเชื่อมต่อธุรกิจแบบรักษาความลับ', '{t("our_services_items.item2_sub")}');
os = os.replace('รับ Requirement จากองค์กร', '{t("our_services_items.item2_1")}');
os = os.replace('วิเคราะห์ความต้องการ', '{t("our_services_items.item2_2")}');
os = os.replace('คัดกรองพันธมิตรที่เหมาะสม', '{t("our_services_items.item2_3")}');
os = os.replace('ไม่เปิดเผยข้อมูลของทั้งสองฝ่าย', '{t("our_services_items.item2_4")}');
os = os.replace('ประสานงานจนเกิดความร่วมมือ', '{t("our_services_items.item2_5")}');

os = os.replace('>3. Solution Advisory<', '>{t("our_services_items.item3_title")}<');
os = os.replace('บริการให้คำปรึกษาและออกแบบ Solution', '{t("our_services_items.item3_sub")}');
os = os.replace('เมื่อวิเคราะห์ธุรกิจแล้ว BizTopTier จะช่วยกำหนดว่าองค์กรควรใช้บริการหรือโซลูชันแบบใด เช่น:', '{t("our_services_items.item3_desc")}');
os = os.replace('โดยไม่ยึดติดกับผู้ให้บริการรายใดรายหนึ่ง', '{t("our_services_items.item3_italic")}');

os = os.replace('>4. Partner Solution Management<', '>{t("our_services_items.item4_title")}<');
os = os.replace('บริการคัดเลือกและบริหารผู้ให้บริการ', '{t("our_services_items.item4_sub")}');
os = os.replace('คัดเลือกผู้ให้บริการจากเครือข่าย', '{t("our_services_items.item4_1")}');
os = os.replace('เปรียบเทียบความเหมาะสม', '{t("our_services_items.item4_2")}');
os = os.replace('ประเมินคุณภาพ', '{t("our_services_items.item4_3")}');
os = os.replace('>ประสานงาน<', '>{t("our_services_items.item4_4")}<');
os = os.replace('ติดตามผลการดำเนินงาน', '{t("our_services_items.item4_5")}');

os = os.replace('>5. Business Growth Support<', '>{t("our_services_items.item5_title")}<');
os = os.replace('บริการติดตามผลและสนับสนุนการเติบโต', '{t("our_services_items.item5_sub")}');
os = os.replace('ติดตามผลลัพธ์หลังส่งมอบ Solution', '{t("our_services_items.item5_1")}');
os = os.replace('ประเมินผลการดำเนินงาน', '{t("our_services_items.item5_2")}');
os = os.replace('ให้คำแนะนำเพิ่มเติม', '{t("our_services_items.item5_3")}');
os = os.replace('เชื่อมต่อ Solution ใหม่เมื่อธุรกิจมีความต้องการเพิ่มเติม', '{t("our_services_items.item5_4")}');

fs.writeFileSync('src/components/OurServices.tsx', os);
