import fs from 'fs';

let content = `import { Logo } from "./Logo";
import { Menu, X, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScriptInjector } from '../hooks/useScriptInjector';
import { useTranslation } from 'react-i18next';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'th' ? 'en' : 'th';
    i18n.changeLanguage(nextLang);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm shrink-0">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <Logo className="h-10 w-auto" />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-[#0D1B3D] border-b-2 border-[#B87333] pb-1">{t('home')}</Link>
          <Link to="/about" className="text-sm font-medium text-slate-500 hover:text-[#0D1B3D] transition-colors">{t('about')}</Link>
          <Link to="/service" className="text-sm font-medium text-slate-500 hover:text-[#0D1B3D] transition-colors">{t('service')}</Link>
          <Link to="/blog" className="text-sm font-medium text-slate-500 hover:text-[#0D1B3D] transition-colors">{t('blog')}</Link>
          <Link to="/contact" className="text-sm font-medium text-slate-500 hover:text-[#0D1B3D] transition-colors">{t('contact')}</Link>
          
          <div className="h-6 w-px bg-slate-200 mx-2"></div>
          
          <button onClick={toggleLanguage} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0D1B3D] transition-colors">
            <Globe size={16} />
            {i18n.language === 'th' ? 'EN' : 'TH'}
          </button>
          
          <button className="text-sm font-semibold text-[#0D1B3D] px-4 py-2 hover:opacity-80 transition-opacity">
            {t('login')}
          </button>
          <button className="rounded-full bg-[#0D1B3D] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#081025]">
            {t('register')}
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={toggleLanguage} className="flex items-center gap-1 text-sm font-medium text-slate-600">
            <Globe size={16} />
            {i18n.language === 'th' ? 'EN' : 'TH'}
          </button>
          <button
            className="p-2 text-slate-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 shadow-lg">
          <nav className="flex flex-col gap-4">
            <Link to="/" className="text-base font-medium text-[#0D1B3D]">{t('home')}</Link>
            <Link to="/about" className="text-base font-medium text-slate-500">{t('about')}</Link>
            <Link to="/service" className="text-base font-medium text-slate-500">{t('service')}</Link>
            <Link to="/blog" className="text-base font-medium text-slate-500">{t('blog')}</Link>
            <Link to="/contact" className="text-base font-medium text-slate-500">{t('contact')}</Link>
            <hr className="my-2 border-slate-100" />
            <button className="text-left text-base font-medium text-[#0D1B3D]">{t('login')}</button>
            <button className="w-full rounded-lg bg-[#0D1B3D] px-5 py-3 text-center font-medium text-white">
              {t('register')}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
`;
fs.writeFileSync('src/components/Header.tsx', content);
