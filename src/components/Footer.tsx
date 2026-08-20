import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { useThemeSettings } from '../contexts/ThemeContext';
import footerDataDefault from '../../footer_data.json';

export function Footer() {
  const { t, i18n } = useTranslation();
  const { settings } = useThemeSettings();
  
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const footerSettings = (settings?.footer?.topColumns ? settings.footer : footerDataDefault) || {};
  const isEn = i18n.language === 'en';
  
  const bgColor = footerSettings.bgColor || '#0B1120';
  const textColor = footerSettings.textColor || '#FFFFFF';
  const headingColor = footerSettings.headingColor || '#FFFFFF';

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setSubscribeStatus('loading');
    try {
      const res = await fetch('/api/newsletters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (res.ok) {
        setSubscribeStatus('success');
        setEmail('');
        setTimeout(() => setSubscribeStatus('idle'), 3000);
      } else {
        setSubscribeStatus('error');
        setTimeout(() => setSubscribeStatus('idle'), 3000);
      }
    } catch (err) {
      console.error(err);
      setSubscribeStatus('error');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    }
  };

  const IconComponent = ({ name, className }: { name: string, className?: string }) => {
    const Icon = (LucideIcons as any)[name];
    if (!Icon) return null;
    return <Icon className={className} />;
  };

  return (
    <footer className="pt-16 pb-8 transition-colors text-sm" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="container mx-auto px-6">
        
        {/* Top Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 border-b pb-12" style={{ borderColor: 'color-mix(in srgb, currentcolor 10%, transparent)' }}>
          {(footerSettings.topColumns || []).map((col: any, colIdx: number) => {
            const colTitle = isEn && col.titleEn ? col.titleEn : col.title;
            return (
              <div key={colIdx}>
                <h4 className="font-bold mb-6 text-base" style={{ color: headingColor }}>{colTitle}</h4>
                <ul className="space-y-4 opacity-80">
                  {(col.links || []).map((link: any, linkIdx: number) => {
                    const linkText = isEn && link.textEn ? link.textEn : link.text;
                    const isExternal = link.url?.startsWith('http') || link.url?.startsWith('mailto') || link.url?.startsWith('tel') || link.url === '#';
                    const LinkContent = (
                      <div className="flex items-start gap-3 hover:opacity-100 transition-opacity">
                        {link.icon && <IconComponent name={link.icon} className="w-4 h-4 shrink-0 mt-0.5" />}
                        <span>{linkText}</span>
                      </div>
                    );
                    return (
                      <li key={linkIdx}>
                        {isExternal ? (
                          <a href={link.url} target={link.url.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
                            {LinkContent}
                          </a>
                        ) : (
                          <Link to={link.url || '/'}>
                            {LinkContent}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Middle Section */}
        <div className="flex flex-col lg:flex-row gap-12 mb-12 border-b pb-12" style={{ borderColor: 'color-mix(in srgb, currentcolor 10%, transparent)' }}>
          <div className="lg:w-1/2 space-y-8">
            <div>
              {footerSettings.middle?.logoUrl ? (
                <img src={footerSettings.middle.logoUrl} alt="Logo" className="h-10 object-contain mb-4" />
              ) : (
                <div className="flex items-center gap-2 mb-4" style={{ color: headingColor }}>
                  <svg width="60" height="24" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0H20C30 0 35 5 35 15C35 25 30 30 20 30H0V0ZM10 10V20H20C22 20 25 18 25 15C25 12 22 10 20 10H10Z" fill="currentColor"/>
                    <path d="M40 0H50V40H40V0Z" fill="currentColor"/>
                    <path d="M60 0H100V10H70V40H60V0Z" fill="currentColor"/>
                  </svg>
                </div>
              )}
              <h3 className="text-xl font-bold mb-2" style={{ color: headingColor }}>{isEn && footerSettings.middle?.titleEn ? footerSettings.middle.titleEn : footerSettings.middle?.title}</h3>
              <p className="opacity-70 leading-relaxed text-sm max-w-md">
                {isEn && footerSettings.middle?.descriptionEn ? footerSettings.middle.descriptionEn : footerSettings.middle?.description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-12">
              <div>
                <h4 className="font-bold mb-4" style={{ color: headingColor }}>{isEn && footerSettings.middle?.contactTitleEn ? footerSettings.middle.contactTitleEn : footerSettings.middle?.contactTitle}</h4>
                <ul className="space-y-2 opacity-80">
                  <li className="flex items-center gap-2">
                    <LucideIcons.Mail className="w-4 h-4" /> 
                    <a href={`mailto:${footerSettings.middle?.email}`} className="hover:opacity-100">{footerSettings.middle?.email}</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <LucideIcons.Phone className="w-4 h-4" /> 
                    <a href={`tel:${footerSettings.middle?.phone}`} className="hover:opacity-100">{footerSettings.middle?.phone}</a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4" style={{ color: headingColor }}>{footerSettings.middle?.socialTitle || 'Social Media'}</h4>
                <div className="flex gap-3">
                  {(footerSettings.middle?.social || []).map((soc: any, idx: number) => (
                    <a key={idx} href={soc.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-white/10 transition-colors" style={{ borderColor: 'color-mix(in srgb, currentcolor 20%, transparent)' }}>
                       <IconComponent name={soc.icon || 'Facebook'} className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col">
            <h3 className="text-2xl font-bold mb-3" style={{ color: headingColor }}>{isEn && footerSettings.middle?.newsletterTitleEn ? footerSettings.middle.newsletterTitleEn : footerSettings.middle?.newsletterTitle}</h3>
            <p className="opacity-70 mb-6">{isEn && footerSettings.middle?.newsletterDescEn ? footerSettings.middle.newsletterDescEn : footerSettings.middle?.newsletterDesc}</p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mb-auto max-w-md">
              <div className="flex rounded-full p-1 border" style={{ backgroundColor: 'color-mix(in srgb, currentcolor 5%, transparent)', borderColor: 'color-mix(in srgb, currentcolor 10%, transparent)' }}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isEn && footerSettings.middle?.newsletterPlaceholderEn ? footerSettings.middle.newsletterPlaceholderEn : (footerSettings.middle?.newsletterPlaceholder || 'Email')} 
                  className="bg-transparent px-4 py-2 w-full focus:outline-none placeholder-white/50" 
                  style={{ color: textColor }} 
                  required
                />
                <button 
                  type="submit"
                  disabled={subscribeStatus === 'loading'}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium transition-colors shrink-0 disabled:opacity-50"
                >
                  {subscribeStatus === 'loading' ? (isEn ? 'Subscribing...' : 'กำลังติดตาม...') : (isEn && footerSettings.middle?.newsletterBtnEn ? footerSettings.middle.newsletterBtnEn : (footerSettings.middle?.newsletterBtn || 'Subscribe'))}
                </button>
              </div>
              {subscribeStatus === 'success' && <p className="text-emerald-400 text-sm px-4">{isEn ? 'Subscribed successfully!' : 'สมัครรับข่าวสารสำเร็จแล้ว!'}</p>}
              {subscribeStatus === 'error' && <p className="text-rose-400 text-sm px-4">{isEn ? 'Failed to subscribe. Please try again.' : 'เกิดข้อผิดพลาด โปรดลองอีกครั้ง'}</p>}
            </form>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-12 text-sm opacity-60">
              {(footerSettings.middle?.legalLinks || []).map((link: any, idx: number) => (
                <React.Fragment key={idx}>
                  <Link to={link.url} className="hover:opacity-100">{isEn && link.textEn ? link.textEn : link.text}</Link>
                  {idx < (footerSettings.middle?.legalLinks?.length || 0) - 1 && <span>|</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
          <p>{isEn && footerSettings.bottom?.copyrightEn ? footerSettings.bottom.copyrightEn : footerSettings.bottom?.copyright}</p>
          <p>{isEn && footerSettings.bottom?.rightTextEn ? footerSettings.bottom.rightTextEn : footerSettings.bottom?.rightText}</p>
        </div>
      </div>
    </footer>
  );
}
