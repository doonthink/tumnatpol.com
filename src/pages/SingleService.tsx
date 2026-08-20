import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { Calendar, Tag, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SingleService() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  
  const [service, setService] = useState<any>(null);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [relatedServices, setRelatedServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const [servicesRes, catsRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/service-categories')
        ]);
        
        const servicesData = await servicesRes.json();
        const catsData = await catsRes.json();
        setCategoriesData(catsData);
        
        // Find matching service
        const matchingService = servicesData.find((s: any) => 
          (s.slug === slug || s.id === slug) && s.status === 'Published'
        );
        
        setService(matchingService);

        // Find related services (same category)
        if (matchingService && matchingService.category) {
          const related = servicesData
            .filter((s: any) => s.category === matchingService.category && s.id !== matchingService.id && s.status === 'Published')
            .slice(0, 3);
          setRelatedServices(related);
        }
        
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchService();
  }, [slug]);

  const getCategoryName = (catName: string) => {
    if (!isEn) return catName;
    const cat = categoriesData.find(c => c.name === catName);
    return cat?.name_en || catName;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
        <Header />
        <main className="flex-grow py-12 px-4 flex items-center justify-center">
          <p className="text-slate-500">{isEn ? "Loading..." : "กำลังโหลด..."}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
        <SEO title="Service Not Found" />
        <Header />
        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full text-center">
          <h1 className="text-4xl font-bold text-[#0D1B3D] mb-4">404</h1>
          <p className="text-lg text-slate-600 mb-8">{isEn ? "Service not found" : "ไม่พบบริการที่คุณต้องการ"}</p>
          <Link to="/services" className="text-[#B87333] hover:underline">{isEn ? "Back to services" : "กลับหน้ารวมบริการ"}</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <SEO title={isEn && service.title_en ? service.title_en : service.title} description={service.subtitle} image={service.coverImage} />
      <Header />
      
      <main className="flex-grow pb-20">
        {/* Hero Section */}
        <div className="bg-[#0D1B3D] text-white pt-20 pb-24 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
          {service.coverImage && (
            <div className="absolute inset-0 opacity-20">
              <img src={service.coverImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#0D1B3D] mix-blend-multiply"></div>
            </div>
          )}
          
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            {service.category && (
              <span className="inline-block px-3 py-1 bg-[#B87333] text-white text-xs font-semibold rounded-full mb-6">
                {getCategoryName(service.category)}
              </span>
            )}
            <h1 className="text-3xl lg:text-5xl font-bold leading-tight mb-6">{(isEn && service.title_en ? service.title_en : service.title)}</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
              {(isEn && service.subtitle_en ? service.subtitle_en : service.subtitle)}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 -mt-10 relative z-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 lg:p-12">
            
            {/* Features Highlight */}
            {service.features && service.features.length > 0 && (
              <div className="mb-10 bg-slate-50 rounded-xl p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-[#0D1B3D] mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#B87333]" />
                  {isEn ? "Service Highlights" : "จุดเด่นของบริการ"}
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main Content */}
            {service.content ? (
              <div 
                className="prose prose-slate prose-lg max-w-none prose-headings:text-[#0D1B3D] prose-a:text-[#B87333] hover:prose-a:text-[#B87333]/80"
                dangerouslySetInnerHTML={{ __html: (isEn && service.content_en ? service.content_en : service.content) }}
              />
            ) : (
              <div className="text-center py-10 text-slate-500">
                ไม่มีรายละเอียดเพิ่มเติม
              </div>
            )}
            
            {/* Contact Action */}
            <div className="mt-12 pt-8 border-t border-slate-100 text-center">
              <h3 className="text-xl font-bold text-[#0D1B3D] mb-4">
                {isEn ? "Interested in this service?" : "สนใจบริการนี้?"}
              </h3>
              <Link 
                to="/business-help-check" 
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#B87333] text-white rounded-lg font-medium hover:bg-[#9d622b] transition-colors"
              >
                {isEn ? "Contact Us for Consultation" : "ติดต่อเราเพื่อรับคำปรึกษา"}
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-20">
            <h2 className="text-2xl font-bold text-[#0D1B3D] mb-8 text-center">{isEn ? "Other Services in this Category" : "บริการอื่นๆ ในหมวดหมู่นี้"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedServices.map(related => (
                <Link key={related.id} to={`/service/${related.slug || related.id}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300">
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    {related.coverImage ? (
                      <img src={related.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-[#0D1B3D] flex items-center justify-center text-white/20">
                         <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                         </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#0D1B3D] mb-2 line-clamp-2 group-hover:text-[#B87333] transition-colors">{(isEn && related.title_en ? related.title_en : related.title)}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{(isEn && related.subtitle_en ? related.subtitle_en : related.subtitle)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
