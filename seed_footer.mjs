import fs from 'fs';

const footerData = {
  bgColor: '#0B1120',
  textColor: '#FFFFFF',
  topColumns: [
    {
      title: 'ลิงก์ด่วน', titleEn: 'Quick Links',
      links: [
        { text: 'หน้าหลัก', textEn: 'Home', url: '/', icon: '' },
        { text: 'เกี่ยวกับเรา', textEn: 'About Us', url: '/about', icon: '' },
        { text: 'บริการของเรา', textEn: 'Services', url: '/service', icon: '' },
        { text: 'ติดต่อเรา', textEn: 'Contact Us', url: '/contact', icon: '' }
      ]
    },
    {
      title: 'โซลูชันธุรกิจ', titleEn: 'Business Solutions',
      links: [
        { text: 'พัฒนาเว็บไซต์ (Web Dev)', textEn: 'Web Development', url: '#', icon: '' },
        { text: 'พัฒนาซอฟต์แวร์ (Software Dev)', textEn: 'Software Development', url: '#', icon: '' },
        { text: 'โซลูชัน AI (AI Solutions)', textEn: 'AI Solutions', url: '#', icon: '' },
        { text: 'แพลตฟอร์มธุรกิจ (Business Platform)', textEn: 'Business Platform', url: '#', icon: '' },
        { text: 'การตลาดดิจิทัล (Digital Marketing)', textEn: 'Digital Marketing', url: '#', icon: '' }
      ]
    },
    {
      title: 'แหล่งความรู้', titleEn: 'Resources',
      links: [
        { text: 'บทความ', textEn: 'Blog', url: '/blog', icon: '' },
        { text: 'คำถามที่พบบ่อย (FAQ)', textEn: 'FAQ', url: '#', icon: '' },
        { text: 'นโยบายความเป็นส่วนตัว (Privacy)', textEn: 'Privacy Policy', url: '/privacy', icon: '' },
        { text: 'ข้อกำหนดและเงื่อนไข (Terms)', textEn: 'Terms of Service', url: '/terms', icon: '' },
        { text: 'นโยบายคุกกี้ (Cookies)', textEn: 'Cookie Policy', url: '/cookies', icon: '' }
      ]
    },
    {
      title: 'ติดต่อเรา', titleEn: 'Contact Us',
      links: [
        { text: 'Biztoptier@outlook.co.th', textEn: 'Biztoptier@outlook.co.th', url: 'mailto:Biztoptier@outlook.co.th', icon: 'Mail' },
        { text: '0617898692', textEn: '0617898692', url: 'tel:0617898692', icon: 'Phone' },
        { text: 'Facebook: Biz Top Tier', textEn: 'Facebook: Biz Top Tier', url: '#', icon: '' },
        { text: 'TikTok: Biz Top Tier', textEn: 'TikTok: Biz Top Tier', url: '#', icon: '' },
        { text: 'ที่อยู่: 21/129 ซอยศูนย์วิจัย ถนนพระราม 9 แขวงบางกะปิ เขตห้วยขวาง กรุงเทพมหานคร 10310', textEn: 'Address: 21/129 Soi Soonvijai, Rama 9 Road, Bang Kapi, Huai Khwang, Bangkok 10310', url: '#', icon: '' }
      ]
    }
  ],
  middle: {
    logoUrl: '',
    title: 'แพลตฟอร์มธุรกิจ เพื่อต่อยอดการขายและเพิ่มประสิทธิภาพองค์กร',
    titleEn: 'Business Platform to scale sales and optimize organizational efficiency',
    description: 'ช่วยให้ธุรกิจทุกขนาดเติบโตอย่างก้าวกระโดด ด้วยเทคโนโลยี โซลูชันดิจิทัล และนวัตกรรมทางธุรกิจ',
    descriptionEn: 'Helping businesses of all sizes grow exponentially with technology, digital solutions, and business innovation.',
    contactTitle: 'ติดต่อเรา',
    contactTitleEn: 'Contact Us',
    email: 'Biztoptier@outlook.co.th',
    phone: '0617898692',
    socialTitle: 'Social Media',
    social: [
      { icon: 'Facebook', url: '#' },
      { icon: 'Music2', url: '#' }, // tiktok substitute
      { icon: 'Youtube', url: '#' },
      { icon: 'Instagram', url: '#' }
    ],
    newsletterTitle: 'สมัครรับข่าวสาร',
    newsletterTitleEn: 'Subscribe to our newsletter',
    newsletterDesc: 'ติดตามเทรนด์ธุรกิจ เทคโนโลยี และนวัตกรรมดิจิทัลก่อนใคร',
    newsletterDescEn: 'Follow business trends, technology and digital innovations before anyone else.',
    newsletterPlaceholder: 'กรอกอีเมลของคุณ',
    newsletterPlaceholderEn: 'Enter your email',
    newsletterBtn: 'ติดตาม',
    newsletterBtnEn: 'Subscribe',
    legalLinks: [
      { text: 'Privacy Policy', textEn: 'Privacy Policy', url: '/privacy' },
      { text: 'Terms of Service', textEn: 'Terms of Service', url: '/terms' },
      { text: 'Cookie Policy', textEn: 'Cookie Policy', url: '/cookies' },
      { text: 'PDPA', textEn: 'PDPA', url: '/pdpa' },
      { text: 'Disclaimer', textEn: 'Disclaimer', url: '/disclaimer' }
    ]
  },
  bottom: {
    copyright: '© 2026 Biz Top Tier Co., Ltd. สงวนลิขสิทธิ์.',
    copyrightEn: '© 2026 Biz Top Tier Co., Ltd. All rights reserved.',
    rightText: 'แพลตฟอร์มธุรกิจ เพื่อต่อยอดการขายและเพิ่มประสิทธิภาพองค์กร',
    rightTextEn: 'Business Platform to scale sales and optimize organizational efficiency'
  }
};

fs.writeFileSync('footer_data.json', JSON.stringify(footerData, null, 2));
