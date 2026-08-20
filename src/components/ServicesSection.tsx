import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Activity, Globe, Smartphone, Megaphone, Laptop, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const icons = [Activity, Globe, Smartphone, Megaphone, Laptop];

export function ServicesSection() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        setServices(data.filter((svc: any) => svc.status === 'Published').slice(0, 5));
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  if (services.length === 0) return null;

  return (
    <div className="bg-white py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-30">
        <div className="absolute top-20 left-0 w-72 h-72 bg-[#B87333] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-40 right-0 w-72 h-72 bg-[#0D1B3D] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#B87333] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-20"
        >
          <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-[#B87333]">
            {t('services_section.subtitle')}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#0D1B3D] sm:text-4xl font-display">
            {t('services_section.title')}
          </p>
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-20 bg-gradient-to-r from-[#B87333] to-transparent rounded-full"></div>
          </div>
        </motion.div>

        <div className="space-y-24 lg:space-y-32">
          {services.map((service, index) => {
            const Icon = icons[index % icons.length];
            const isEven = index % 2 === 1;
            
            return (
              <div key={service.id} className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="w-full lg:w-1/2"
                >
                  <div className="group relative">
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#B87333]/20 to-[#0D1B3D]/20 blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white p-8 lg:p-12 rounded-3xl border border-slate-100 flex flex-col justify-center h-full overflow-hidden shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-[#B87333]/10 transition-all duration-500 transform group-hover:-translate-y-1">
                      
                      {service.coverImage ? (
                        <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500">
                          <img src={service.coverImage} className="w-full h-full object-cover" alt="" />
                        </div>
                      ) : (
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500 transform origin-bottom-left">
                           <Icon className="w-64 h-64 text-[#0D1B3D]" />
                        </div>
                      )}

                      <div className="w-16 h-16 bg-gradient-to-br from-[#0D1B3D] to-[#1a2f63] shadow-lg shadow-[#0D1B3D]/20 rounded-2xl flex items-center justify-center mb-8 relative z-10 transform group-hover:rotate-6 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-3xl font-bold text-[#0D1B3D] mb-4 relative z-10 group-hover:text-[#B87333] transition-colors">
                        {(isEn && service.title_en ? service.title_en : service.title)}
                      </h3>
                      <p className="text-slate-600 mb-8 text-lg leading-relaxed relative z-10">
                        {(isEn && service.subtitle_en ? service.subtitle_en : service.subtitle)}
                      </p>
                      
                      <Link to={`/service/${service.slug || service.id}`} className="mt-auto relative z-10 inline-flex items-center gap-2 text-[#B87333] font-semibold group/link">
                        {isEn ? "Learn More" : "ดูรายละเอียดเพิ่มเติม"}
                        <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                  className="w-full lg:w-1/2 lg:py-8"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B87333]/10 text-[#B87333] font-semibold text-sm mb-8">
                    <CheckCircle2 className="w-5 h-5" />
                    {t('services_section.features_title')}
                  </div>
                  
                  {service.features && service.features.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                      {service.features.map((feature: string, fIndex: number) => (
                        <motion.li 
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.3 + (fIndex * 0.1) }}
                          key={fIndex} 
                          className="flex items-start gap-4 group"
                        >
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#B87333] group-hover:text-white transition-colors duration-300">
                            <CheckCircle2 className="w-4 h-4 text-[#B87333] group-hover:text-white transition-colors duration-300" />
                          </div>
                          <span className="text-slate-700 font-medium leading-relaxed pt-0.5">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 italic">{isEn ? "No features listed." : "ไม่มีข้อมูลฟีเจอร์"}</p>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-20 text-center">
          <Link to="/services" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0D1B3D] text-white rounded-xl font-semibold hover:bg-[#1a2f63] transition-colors shadow-lg shadow-[#0D1B3D]/20">
            {isEn ? "View All Services" : "ดูบริการทั้งหมดของเรา"}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
