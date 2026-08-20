import fs from 'fs';

const content = `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  th: {
    translation: {
      home: "หน้าหลัก",
      about: "เกี่ยวกับเรา",
      service: "บริการของเรา",
      blog: "บทความ",
      contact: "ติดต่อเรา",
      login: "เข้าสู่ระบบ",
      register: "สมัครสมาชิก",
      read_more: "อ่านเพิ่มเติม",
      quick_links: "ลิงก์ด่วน",
      business_solutions: "โซลูชันธุรกิจ",
      resources: "แหล่งความรู้",
      subscribe_newsletter: "สมัครรับข่าวสาร",
      subscribe_desc: "ติดตามเทรนด์ธุรกิจ เทคโนโลยี และนวัตกรรมดิจิทัลก่อนใคร",
      enter_email: "กรอกอีเมลของคุณ",
      subscribe: "ติดตาม",
      all_rights_reserved: "สงวนลิขสิทธิ์",
      leading_business_forward: "แพลตฟอร์มธุรกิจ เพื่อต่อยอดการขายและเพิ่มประสิทธิภาพองค์กร",
      helping_business: "ช่วยให้ธุรกิจทุกขนาดเติบโตอย่างก้าวกระโดด ด้วยเทคโนโลยี โซลูชันดิจิทัล และนวัตกรรมทางธุรกิจ",
      
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
        item5_4: "เชื่อมต่อ Solution ใหม่เมื่อธุรกิจมีความต้องการเพิ่มเติม"
      },
      hero: {
        subtitle: "Future Business Data Hub",
        title_1: "เชื่อมต่อทุกโอกาส",
        title_2: "ขยายเครือข่ายธุรกิจ",
        desc: "Biz Toptier คือศูนย์กลางข้อมูลสำหรับธุรกิจทุกขนาด (SME ถึง Enterprise) สร้างเครือข่ายที่แข็งแกร่ง เพื่อการแลกเปลี่ยนบริการและสินค้าแบบครบวงจร",
        start_free: "เริ่มต้นใช้งานฟรี",
        search_business: "ค้นหาธุรกิจ",
        businesses_in_system: "ธุรกิจในระบบ",
        updated_today: "อัปเดตวันนี้"
      },
      features: {
        our_services: "บริการของเรา (Our Services)",
        why: "ทำไมต้อง Biz Toptier?",
        desc: "เราออกแบบแพลตฟอร์มมาเพื่อตอบสนองความต้องการของธุรกิจยุคดิจิทัล ให้การค้นหา นำเสนอ และเชื่อมต่อ เป็นเรื่องง่ายและมีประสิทธิภาพสูงสุด",
        list: [
          { name: "เครือข่ายไร้รอยต่อ", desc: "เชื่อมโยงธุรกิจข้ามอุตสาหกรรม ค้นหาคู่ค้าและพันธมิตรที่เหมาะสมกับเป้าหมายของคุณได้อย่างรวดเร็ว" },
          { name: "ข้อมูลที่เชื่อถือได้", desc: "ระบบยืนยันตัวตนและโปรไฟล์ธุรกิจที่ชัดเจน สร้างความมั่นใจในการเจรจาและทำธุรกรรม" },
          { name: "เจรจาธุรกิจโดยตรง", desc: "ลดตัวกลาง เพิ่มผลกำไร ด้วยช่องทางการติดต่อโดยตรงระหว่างผู้ประกอบการกับผู้ประกอบการ (B2B)" },
          { name: "วิเคราะห์การเติบโต", desc: "เข้าถึงข้อมูลเชิงลึก ภาพรวมตลาด และเทรนด์ธุรกิจเพื่อประกอบการตัดสินใจที่แม่นยำ" }
        ]
      },
      latest_blogs: {
        title: "บทความล่าสุด",
        subtitle: "อัปเดตความรู้และเทรนด์ธุรกิจเพื่อก้าวสู่มาตรฐาน Top Tier",
        view_all: "ดูบทความทั้งหมด"
      },
      admin: {
        dashboard: "แผงควบคุม",
        pages: "จัดการหน้าเพจ",
        blogs: "บทความทั้งหมด",
        add_blog: "เขียนบทความใหม่",
        categories: "หมวดหมู่บทความ",
        logout: "ออกจากระบบ"
      }
    }
  },
  en: {
    translation: {
      home: "Home",
      about: "About",
      service: "Service",
      blog: "Blog",
      contact: "Contact",
      login: "Login",
      register: "Register",
      read_more: "Read More",
      quick_links: "Quick Links",
      business_solutions: "Business Solutions",
      resources: "Resources",
      subscribe_newsletter: "Subscribe Newsletter",
      subscribe_desc: "Stay updated with business trends, technology, and digital innovation.",
      enter_email: "Enter your email",
      subscribe: "Subscribe",
      all_rights_reserved: "All Rights Reserved",
      leading_business_forward: "Business Platform to boost sales and enhance organizational efficiency",
      helping_business: "Helping businesses of every size grow through technology, digital solutions, and business innovation.",
      
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
        item5_4: "Connect new Solutions when business has additional needs"
      },
      hero: {
        subtitle: "Future Business Data Hub",
        title_1: "Connect Every Opportunity",
        title_2: "Expand Business Network",
        desc: "Biz Toptier is an information hub for businesses of all sizes (SME to Enterprise). Build a strong network for comprehensive service and product exchange.",
        start_free: "Start for free",
        search_business: "Search Business",
        businesses_in_system: "Businesses in system",
        updated_today: "Updated today"
      },
      features: {
        our_services: "Our Services",
        why: "Why Biz Toptier?",
        desc: "We designed a platform to meet the needs of digital businesses, making searching, presenting, and connecting easy and highly efficient.",
        list: [
          { name: "Seamless Network", desc: "Connect businesses across industries, quickly find partners that match your goals." },
          { name: "Reliable Data", desc: "Clear identity verification and business profiles, building confidence in negotiations and transactions." },
          { name: "Direct Business Negotiation", desc: "Reduce middlemen, increase profit with direct B2B communication channels." },
          { name: "Growth Analysis", desc: "Access insights, market overview, and business trends for accurate decision making." }
        ]
      },
      latest_blogs: {
        title: "Latest Blogs",
        subtitle: "Update knowledge and business trends to reach Top Tier standards",
        view_all: "View all blogs"
      },
      admin: {
        dashboard: "Dashboard",
        pages: "Pages",        
        blogs: "All Blogs",
        add_blog: "Add Blog",
        categories: "Categories",
        logout: "Logout"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'th',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
`

fs.writeFileSync('src/i18n.ts', content);
