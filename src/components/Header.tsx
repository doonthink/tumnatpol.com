import { Logo } from "./Logo";
import { Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScriptInjector } from '../hooks/useScriptInjector';
import { useTranslation } from 'react-i18next';
import { useThemeSettings } from '../contexts/ThemeContext';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings } = useThemeSettings();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  useScriptInjector(); // Assuming this is needed

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'th' ? 'en' : 'th';
    i18n.changeLanguage(nextLang);
  };

  const menuItems = settings?.header?.menu?.length > 0 
    ? settings.header.menu.filter((m: any) => m.active) 
    : [
        { name: t('home') || 'หน้าแรก', nameEn: 'Home', url: '/', active: true },
        { name: t('about') || 'เกี่ยวกับเรา', nameEn: 'About Us', url: '/about', active: true },
        { name: t('service') || 'บริการ', nameEn: 'Services', url: '/services', active: true },
        { name: 'วิดีโอ', nameEn: 'Videos', url: '/video', active: true },
        { name: t('blog') || 'บทความ', nameEn: 'Blog', url: '/blog', active: true },
        { name: t('contact') || 'ติดต่อเรา', nameEn: 'Contact Us', url: '/contact', active: true }
      ];

  const headerStyle = settings?.header?.style === 'Transparent' 
    ? 'bg-transparent border-transparent absolute text-white' 
    : 'bg-background border-border text-text sticky shadow-sm';

  return (
    <header className={`top-0 z-50 w-full border-b shrink-0 transition-colors ${headerStyle}`}>
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            {settings?.header?.logoUrl ? (
              <img src={settings.header.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
            ) : (
              <Logo className="h-10 w-auto" />
            )}
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {menuItems.map((item: any, idx: number) => {
            const isActive = location.pathname === item.url || (item.url !== '/' && location.pathname.startsWith(item.url));
            return (
              <Link 
                key={idx} 
                to={item.url} 
                target={item.openNewTab ? "_blank" : "_self"}
                className={`text-sm font-medium transition-colors ${isActive ? 'text-primary border-b-2 border-accent pb-1' : 'opacity-80 hover:opacity-100 hover:text-primary'}`}
              >
                {i18n.language === 'en' && item.nameEn ? item.nameEn : item.name}
              </Link>
            )
          })}
          
          <div className="h-6 w-px bg-border mx-2"></div>
          
          <button onClick={toggleLanguage} className="flex items-center gap-2 text-sm font-medium opacity-80 hover:opacity-100 hover:text-primary transition-colors">
            <Globe size={16} />
            {i18n.language === 'th' ? 'EN' : 'TH'}
          </button>
          
          {settings?.header?.enableCTA !== false && (
            <div className="flex items-center gap-3">
              {(settings?.header?.ctaButtons?.length > 0 
                ? settings.header.ctaButtons 
                : [{ text: settings?.header?.ctaText || 'ติดต่อเรา', textEn: 'Contact Us', link: settings?.header?.ctaLink || '/contact', bgColor: 'var(--theme-button, #0D1B3D)', textColor: 'var(--theme-button-text, #fff)' }]
              ).map((btn: any, idx: number) => (
                <Link key={idx} to={btn.link || '/'} className="rounded-full px-6 py-2.5 text-sm font-semibold shadow-md transition-opacity hover:opacity-90 inline-flex items-center" style={{ backgroundColor: btn.bgColor || 'var(--theme-button, #0D1B3D)', color: btn.textColor || 'var(--theme-button-text, #fff)' }}>
                  {i18n.language === 'en' && btn.textEn ? btn.textEn : (btn.text || 'Contact Us')}
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <button onClick={toggleLanguage} className="flex items-center gap-1 text-sm font-medium">
            <Globe size={16} />
            {i18n.language === 'th' ? 'EN' : 'TH'}
          </button>
          <button
            className="p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background px-4 py-4 shadow-lg absolute w-full top-20 left-0">
          <nav className="flex flex-col gap-4 text-text">
            {menuItems.map((item: any, idx: number) => {
              const isActive = location.pathname === item.url || (item.url !== '/' && location.pathname.startsWith(item.url));
              return (
                <Link 
                  key={idx} 
                  to={item.url} 
                  target={item.openNewTab ? "_blank" : "_self"}
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={`text-base font-medium ${isActive ? 'text-accent' : 'opacity-80'}`}
                >
                  {i18n.language === 'en' && item.nameEn ? item.nameEn : item.name}
                </Link>
              )
            })}
            <hr className="my-2 border-border" />
            {settings?.header?.enableCTA !== false && (
              <div className="flex flex-col gap-3">
                {(settings?.header?.ctaButtons?.length > 0 
                  ? settings.header.ctaButtons 
                  : [{ text: settings?.header?.ctaText || 'ติดต่อเรา', textEn: 'Contact Us', link: settings?.header?.ctaLink || '/contact', bgColor: 'var(--theme-button, #0D1B3D)', textColor: 'var(--theme-button-text, #fff)' }]
                ).map((btn: any, idx: number) => (
                  <Link key={idx} onClick={() => setIsMobileMenuOpen(false)} to={btn.link || '/'} className="w-full rounded-lg px-5 py-3 text-center font-medium block shadow-sm" style={{ backgroundColor: btn.bgColor || 'var(--theme-button, #0D1B3D)', color: btn.textColor || 'var(--theme-button-text, #fff)' }}>
                    {i18n.language === 'en' && btn.textEn ? btn.textEn : (btn.text || 'Contact Us')}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}