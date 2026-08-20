import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

const partners = [
  { name: "APICES SOLUTION", img: "/partners/apices.png" },
  { name: "ALLTIMAGE", img: "/partners/alltimage.png" },
  { name: "CHATA - ชะตา", img: "/partners/chata.png" },
  { name: "Google Ads", img: "/partners/google-ads.png" },
  { name: "LINE", img: "/partners/line.png" }
];

export function Partners() {
  const { t } = useTranslation();

  return (
    <div className="bg-white py-16 overflow-hidden border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 mb-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-[#B87333]">
            {t('partners.trusted')}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#0D1B3D] sm:text-4xl font-display">
            {t('partners.title')}
          </p>
        </div>
      </div>
      <div className="relative flex overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 lg:w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 lg:w-32 bg-gradient-to-l from-white to-transparent z-10" />
        
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          className="flex flex-nowrap shrink-0 items-center"
        >
          {/* Multiply array to ensure seamless infinite scroll */}
          {[...partners, ...partners, ...partners, ...partners].map((partner, index) => (
            <div
              key={index}
              className="mx-8 lg:mx-16 flex shrink-0 items-center justify-center grayscale opacity-60 transition-all hover:grayscale-0 hover:opacity-100"
            >
              <img 
                src={partner.img} 
                alt={partner.name} 
                className="h-12 lg:h-16 object-contain"
                onError={(e) => {
                  // Fallback to text if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `<span class="text-xl lg:text-2xl font-bold text-slate-400 hover:text-[#0D1B3D]">${partner.name}</span>`;
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

