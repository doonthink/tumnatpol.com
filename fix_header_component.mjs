import fs from 'fs';

const content = fs.readFileSync('src/components/Header.tsx', 'utf-8');

const targetCtaDesktop = `{settings?.header?.enableCTA !== false && (
            <Link to={settings?.header?.ctaLink || '/contact'} className="rounded-full px-6 py-2.5 text-sm font-semibold shadow-md transition-opacity hover:opacity-90 inline-flex items-center" style={{ backgroundColor: 'var(--theme-button, #0D1B3D)', color: 'var(--theme-button-text, #fff)' }}>
              {settings?.header?.ctaText || 'Contact Us'}
            </Link>
          )}`;

const newCtaDesktop = `{settings?.header?.enableCTA !== false && (
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
          )}`;

const targetCtaMobile = `{settings?.header?.enableCTA !== false && (
              <Link onClick={() => setIsMobileMenuOpen(false)} to={settings?.header?.ctaLink || '/contact'} className="w-full rounded-lg px-5 py-3 text-center font-medium block" style={{ backgroundColor: 'var(--theme-button, #0D1B3D)', color: 'var(--theme-button-text, #fff)' }}>
                {settings?.header?.ctaText || 'Contact Us'}
              </Link>
            )}`;

const newCtaMobile = `{settings?.header?.enableCTA !== false && (
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
            )}`;

let newContent = content.replace(targetCtaDesktop, newCtaDesktop);
newContent = newContent.replace(targetCtaMobile, newCtaMobile);

fs.writeFileSync('src/components/Header.tsx', newContent);
console.log("Replaced CTA in Header component");
