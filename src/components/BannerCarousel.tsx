import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function BannerCarousel({ fallback }: { fallback?: React.ReactNode }) {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotationTime, setRotationTime] = useState(5);
  const [showBannerSection, setShowBannerSection] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data && data.general) {
          if (data.general.bannerRotationTime) {
            setRotationTime(parseInt(data.general.bannerRotationTime) || 5);
          }
          if (data.general.showBannerSection !== undefined) {
            setShowBannerSection(data.general.showBannerSection);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    
    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/banners');
        const data = await res.json();
        // Filter active and sort by order
        const activeBanners = data
          .filter((b: any) => b.status === 'Active')
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        setBanners(activeBanners);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    Promise.all([fetchSettings(), fetchBanners()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, rotationTime * 1000);
      return () => clearInterval(interval);
    }
  }, [banners.length, rotationTime]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (loading) return null;
  if (!showBannerSection) return <>{fallback}</>;
  if (banners.length === 0) return <>{fallback}</>;

  const currentBanner = banners[currentIndex];

  const BannerContent = ({ banner }: { banner: any }) => {
    if (banner.layoutType === 'hero') {
      return (
        <div 
          className="w-full h-[400px] lg:h-[500px] xl:h-[600px] flex items-center p-8 md:p-16 relative overflow-hidden"
          style={{
            background: banner.background?.stops?.length > 1 
              ? `linear-gradient(${banner.background.direction}, ${banner.background.stops.map((s:any) => s.color).join(', ')})`
              : banner.background?.solidColor || '#f8fafc'
          }}
        >
          {banner.background?.patternImage && (
            <div 
              className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
              style={{ backgroundImage: `url(${banner.background.patternImage})` }}
            />
          )}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto w-full">
            <div className="space-y-6">
              {banner.badge?.text && (
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-white/90 shadow-sm ${banner.badge.font}`} style={{ color: banner.badge.color }}>
                  {banner.badge.text}
                </span>
              )}
              {banner.heading1?.text && (
                <h2 className={`${banner.heading1.size} ${banner.heading1.weight} ${banner.heading1.font} leading-tight`} style={{ color: banner.heading1.color }}>
                  {banner.heading1.text}
                </h2>
              )}
              {banner.heading2?.text && (
                <h3 className={`${banner.heading2.size} ${banner.heading2.weight} ${banner.heading2.font}`} style={{ color: banner.heading2.color }}>
                  {banner.heading2.text}
                </h3>
              )}
              {banner.description?.text && (
                <p className={`text-lg md:text-xl ${banner.description.font} opacity-90 max-w-xl`} style={{ color: banner.description.color }}>
                  {banner.description.text}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                {banner.primaryButton?.text && (
                  banner.primaryButton.link ? (
                    <a href={banner.primaryButton.link} className={`px-8 py-3.5 rounded-xl shadow-lg font-semibold transition-transform hover:scale-105 ${banner.primaryButton.font}`} style={{ backgroundColor: banner.primaryButton.bgColor, color: banner.primaryButton.textColor }}>
                      {banner.primaryButton.text}
                    </a>
                  ) : (
                    <button className={`px-8 py-3.5 rounded-xl shadow-lg font-semibold transition-transform hover:scale-105 ${banner.primaryButton.font}`} style={{ backgroundColor: banner.primaryButton.bgColor, color: banner.primaryButton.textColor }}>
                      {banner.primaryButton.text}
                    </button>
                  )
                )}
                {banner.secondaryButton?.text && (
                  banner.secondaryButton.link ? (
                    <a href={banner.secondaryButton.link} className={`px-8 py-3.5 rounded-xl shadow-md font-semibold transition-transform hover:scale-105 border border-black/10 ${banner.secondaryButton.font}`} style={{ backgroundColor: banner.secondaryButton.bgColor, color: banner.secondaryButton.textColor }}>
                      {banner.secondaryButton.text}
                    </a>
                  ) : (
                    <button className={`px-8 py-3.5 rounded-xl shadow-md font-semibold transition-transform hover:scale-105 border border-black/10 ${banner.secondaryButton.font}`} style={{ backgroundColor: banner.secondaryButton.bgColor, color: banner.secondaryButton.textColor }}>
                      {banner.secondaryButton.text}
                    </button>
                  )
                )}
              </div>
            </div>
            {banner.image && (
              <div className="relative h-64 md:h-96 lg:h-[450px] rounded-3xl overflow-hidden shadow-2xl hidden md:block">
                <img src={banner.image} alt={banner.name || 'Banner graphic'} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-[400px] lg:h-[500px] xl:h-[600px] relative bg-slate-900 overflow-hidden flex-shrink-0">
        {banner.image ? (
          <img src={banner.image} alt={banner.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0D1B3D] to-indigo-900 text-white">
            <h2 className="text-4xl font-bold font-display px-4 text-center">{banner.name}</h2>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full overflow-hidden group bg-slate-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="w-full h-full"
        >
          {currentBanner.layoutType !== 'hero' && currentBanner.link ? (
            <a href={currentBanner.link} target="_blank" rel="noreferrer" className="block w-full h-full">
              <BannerContent banner={currentBanner} />
            </a>
          ) : (
            <BannerContent banner={currentBanner} />
          )}
        </motion.div>
      </AnimatePresence>

      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
