import { ArrowRight, Globe2, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeSettings } from '../contexts/ThemeContext';

export function Hero() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const { settings } = useThemeSettings();
  
  const homeSettings = settings?.pages?.home || {};
  
  const subtitle = isEn 
    ? (homeSettings.heroSubtitleEn || t('hero.subtitle')) 
    : (homeSettings.heroSubtitle || t('hero.subtitle'));
    
  return (
    <div className="relative overflow-hidden bg-primary min-h-[480px] shrink-0">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute -right-20 -top-20 w-[600px] h-[600px] border-[40px] border-accent rounded-full hidden lg:block"></div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10 lg:py-24 relative z-10 flex h-full items-center">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center w-full">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
              <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">{subtitle}</span>
            </div>
            
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6 leading-tight">
              {t('hero.title_1')} <br />
              <span className="text-accent">
                {t('hero.title_2')}
              </span>
            </h1>
            
            <p className="mt-4 text-lg text-white/70 max-w-lg leading-relaxed mb-8">
              {t('hero.desc')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="inline-flex items-center justify-center gap-2 bg-accent text-primary px-8 py-4 rounded-xl font-bold shadow-xl transition-transform hover:-translate-y-0.5">
                {t('hero.start_free')}
                <ArrowRight size={20} />
              </button>
              <button className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-xl font-bold transition-colors hover:bg-white/20">
                {t('hero.search_business')}
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative mx-auto w-full max-w-lg lg:max-w-none">
            {/* Hero Card Graphic */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl relative">
              <div className="flex justify-between items-center mb-6">
                <div className="text-white/60 text-xs font-mono">B-DATA SYNC 2.4.0</div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-12 bg-white/10 rounded-lg flex items-center px-4 gap-3">
                  <div className="w-6 h-6 bg-accent/30 rounded flex items-center justify-center"><Globe2 size={12} className="text-accent"/></div>
                  <div className="h-3 w-32 bg-white/20 rounded"></div>
                </div>
                <div className="h-12 bg-white/10 rounded-lg flex items-center px-4 gap-3">
                  <div className="w-6 h-6 bg-blue-400/30 rounded flex items-center justify-center"><TrendingUp size={12} className="text-blue-400"/></div>
                  <div className="h-3 w-48 bg-white/20 rounded"></div>
                </div>
                <div className="h-32 bg-gradient-to-br from-[#B87333]/20 to-transparent border border-accent/30 rounded-xl p-4">
                  <div className="text-accent font-bold text-2xl">10k+</div>
                  <div className="text-white/50 text-xs uppercase mt-1">Verified Enterprises Linked</div>
                  <div className="mt-4 flex gap-2">
                    <div className="h-8 w-1/4 bg-white/10 rounded"></div>
                    <div className="h-8 w-1/2 bg-white/10 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating Badges */}
            <div className="absolute -bottom-6 -left-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-4 shadow-xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-400/20 text-green-400">
                <span className="font-bold text-sm">10k+</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t('hero.businesses_in_system')}</p>
                <p className="text-xs text-white/60">{t('hero.updated_today')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
