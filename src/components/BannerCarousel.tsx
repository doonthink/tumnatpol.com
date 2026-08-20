import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function BannerCarousel() {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotationTime, setRotationTime] = useState(5);
  const [showBannerSection, setShowBannerSection] = useState(false);

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
    fetchSettings();
  }, []);

  useEffect(() => {
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
    fetchBanners();
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

  if (!showBannerSection) return null;
  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  const BannerContent = ({ banner }: { banner: any }) => (
    <div className="w-full h-[400px] lg:h-[500px] lg:h-[600px] relative bg-slate-900 overflow-hidden flex-shrink-0">
      {banner.image ? (
        <img src={banner.image} alt={banner.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0D1B3D] to-indigo-900 text-white">
          <h2 className="text-4xl font-bold font-display px-4 text-center">{banner.name}</h2>
        </div>
      )}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden group bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="w-full h-full"
        >
          {currentBanner.link ? (
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
