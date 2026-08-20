import fs from 'fs';

let content = `import { Logo } from "./Logo";
import { Mail, Facebook, Linkedin, Music2, Youtube, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0A1128] text-white">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-10">
        
        {/* Top Section - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">{t('quick_links')}</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-slate-300 hover:text-white transition-colors">{t('home')}</Link></li>
              <li><Link to="/about" className="text-slate-300 hover:text-white transition-colors">{t('about')}</Link></li>
              <li><Link to="/service" className="text-slate-300 hover:text-white transition-colors">{t('service')}</Link></li>
              <li><Link to="/contact" className="text-slate-300 hover:text-white transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>

          {/* Business Solutions */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">{t('business_solutions')}</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">พัฒนาเว็บไซต์ (Web Dev)</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">พัฒนาซอฟต์แวร์ (Software Dev)</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">โซลูชัน AI (AI Solutions)</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">แพลตฟอร์มธุรกิจ (Business Platform)</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">การตลาดดิจิทัล (Digital Marketing)</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">{t('resources')}</h3>
            <ul className="space-y-4">
              <li><Link to="/blog" className="text-slate-300 hover:text-white transition-colors">{t('blog')}</Link></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">คำถามที่พบบ่อย (FAQ)</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">นโยบายความเป็นส่วนตัว (Privacy)</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">ข้อกำหนดและเงื่อนไข (Terms)</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">นโยบายคุกกี้ (Cookies)</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">{t('contact')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-300">
                <Mail className="w-5 h-5 shrink-0 mt-0.5" />
                <a href="mailto:contact@biztoptier.com" className="hover:text-white transition-colors">contact@biztoptier.com</a>
              </li>
              <li className="text-slate-300">Facebook: Biz Top Tier</li>
              <li className="text-slate-300">TikTok: Biz Top Tier</li>
              <li className="text-slate-300 leading-relaxed">
                Address: 21/129 Soi Soonvijai, Rama 9 Road, Bang Kapi Subdistrict, Huai Khwang District, Bangkok 10310
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/10 mb-12"></div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          
          {/* Left Column */}
          <div>
            <div className="flex items-center gap-3 text-white mb-8">
              <Logo className="h-10 w-auto" variant="dark" />
            </div>
            
            <h4 className="text-lg font-bold text-white mb-2">{t('leading_business_forward')}</h4>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-8">
              {t('helping_business')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h5 className="font-bold text-white mb-3">{t('contact')}</h5>
                <a href="mailto:contact@biztoptier.com" className="text-slate-300 hover:text-white transition-colors">
                  contact@biztoptier.com
                </a>
              </div>
              <div>
                <h5 className="font-bold text-white mb-3">Social Media</h5>
                <div className="flex items-center gap-3">
                  <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
                    <Music2 className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            <h4 className="text-2xl font-bold text-white mb-3">{t('subscribe_newsletter')}</h4>
            <p className="text-slate-300 mb-6">
              {t('subscribe_desc')}
            </p>
            
            <form className="mb-auto">
              <div className="flex bg-[#1E2638] rounded-full p-1.5 border border-white/10">
                <input 
                  type="email" 
                  placeholder={t('enter_email')}
                  className="bg-transparent text-white px-4 py-2 w-full focus:outline-none placeholder:text-slate-500"
                  required
                />
                <button 
                  type="submit"
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2.5 rounded-full font-medium transition-colors shrink-0"
                >
                  {t('subscribe')}
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-12 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">PDPA</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Disclaimer</a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/10 mb-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Biz Top Tier Co., Ltd. {t('all_rights_reserved')}.
          </div>
          <div>
            {t('leading_business_forward')}
          </div>
        </div>

      </div>
    </footer>
  );
}
`;
fs.writeFileSync('src/components/Footer.tsx', content);
