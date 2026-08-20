import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Handshake, Lightbulb, Briefcase, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function OurServices() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        setServices(data.filter((svc: any) => svc.status === 'Published').slice(0, 6)); // Show top 6
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  return (
    <div className="bg-slate-50 py-24 sm:py-32" id="services">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-[#B87333] mb-2">{t("our_services.subtitle")}</h2>
          <h1 className="text-4xl font-bold text-[#0D1B3D] sm:text-5xl font-display">{t("our_services.title")}</h1>
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-20 bg-[#B87333] rounded-full"></div>
          </div>
          <p className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto">
            {isEn ? "Explore our comprehensive suite of services designed to elevate your business" : "บริการทั้งหมดของเราที่ออกแบบมาเพื่อยกระดับธุรกิจของคุณ"}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500 text-lg">{isEn ? "Loading services..." : "กำลังโหลดข้อมูลบริการ..."}</p>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc) => (
              <Link to={`/service/${svc.slug || svc.id}`} key={svc.id} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 hover:border-[#B87333] transition-all duration-300 flex flex-col h-full">
                {svc.coverImage && (
                  <div className="w-full h-40 mb-6 rounded-xl overflow-hidden bg-slate-100">
                    <img src={svc.coverImage} alt={svc.title} className="w-full h-full object-cover" />
                  </div>
                )}
                {!svc.coverImage && (
                   <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D1B3D]/5 mb-6 text-[#0D1B3D]">
                     <Briefcase className="h-8 w-8" />
                   </div>
                )}
                
                <h3 className="text-xl font-display font-bold text-[#0D1B3D] mb-2">{(isEn && svc.title_en ? svc.title_en : svc.title)}</h3>
                <p className="text-[#B87333] font-medium text-sm mb-4">{(isEn && svc.subtitle_en ? svc.subtitle_en : svc.subtitle)}</p>
                
                {svc.features && svc.features.length > 0 && (
                  <ul className="space-y-3 text-slate-600 text-sm mt-auto">
                    {svc.features.slice(0, 4).map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B87333] mt-1.5 shrink-0"></span>
                        <span className="line-clamp-2">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500 text-lg">{isEn ? "No services available at the moment." : "ยังไม่มีข้อมูลบริการในขณะนี้"}</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <Link to="/services" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-[#0D1B3D] border border-slate-200 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
            {isEn ? "View All Services" : "ดูบริการทั้งหมด"}
          </Link>
        </div>
      </div>
    </div>
  );
}
