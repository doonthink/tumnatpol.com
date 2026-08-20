import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { Search, ChevronRight, ChevronLeft, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Services() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  
  const [services, setServices] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, catsRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/service-categories')
        ]);
        const servicesData = await servicesRes.json();
        const catsData = await catsRes.json();
        
        setServices(servicesData.filter((svc: any) => svc.status === 'Published'));
        setCategoriesData(catsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const categories = Array.from(new Set(services.map(svc => svc.category).filter(Boolean))) as string[];

  const getCategoryName = (catName: string) => {
    if (!isEn) return catName;
    const cat = categoriesData.find(c => c.name === catName);
    return cat?.name_en || catName;
  };

  const filteredServices = services
    .filter(svc => ((isEn && svc.title_en ? svc.title_en : svc.title) || '').toLowerCase().includes(searchQuery.toLowerCase()) || ((isEn && svc.subtitle_en ? svc.subtitle_en : svc.subtitle) || '').toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(svc => selectedCategory === '' || svc.category === selectedCategory)
    .sort((a, b) => {
      return new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime();
    });

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const currentItems = filteredServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <SEO title={isEn ? "Our Services - Biztoptier" : "บริการของเรา - Biztoptier"} />
      <Header />
      
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full">
        <div className="mb-12 text-center">
          <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-[#B87333] mb-2">Our Services</h2>
          <h1 className="text-4xl font-bold text-[#0D1B3D] mb-4">บริการทั้งหมด</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {isEn ? "Helping businesses of all sizes grow exponentially with technology and business innovation" : "ให้บริการวิเคราะห์ธุรกิจและนำเสนอโซลูชันเพื่อยกระดับองค์กรของคุณสู่การเป็น Top Tier"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder={isEn ? "Search services..." : "ค้นหาบริการ..."} 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent bg-white shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <Filter className="w-5 h-5 text-slate-500 hidden lg:block" />
            <select 
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="w-full lg:w-auto px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent bg-white shadow-sm"
            >
              <option value="">{isEn ? "All Categories" : "ทุกหมวดหมู่ (All)"}</option>
              {categories.map(category => (
                <option key={category} value={category}>{getCategoryName(category)}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-lg">{isEn ? "Loading services..." : "กำลังโหลดข้อมูลบริการ..."}</p>
          </div>
        ) : currentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map((svc) => (
              <Link to={`/service/${svc.slug || svc.id}`} key={svc.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col relative">
                <div className="relative h-56 overflow-hidden bg-slate-100 flex items-center justify-center">
                  {svc.coverImage ? (
                    <img src={svc.coverImage} alt={svc.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-[#0D1B3D] flex items-center justify-center text-white/20">
                      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  )}
                  {svc.category && (
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#B87333]">
                      {getCategoryName(svc.category)}
                    </div>
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h2 className="text-xl font-bold text-[#0D1B3D] mb-3 group-hover:text-[#B87333] transition-colors">{svc.title}</h2>
                  <p className="text-slate-600 text-sm mt-auto mb-6 line-clamp-3">
                    {svc.subtitle}
                  </p>
                  
                  {svc.features && svc.features.length > 0 && (
                    <ul className="mb-6 space-y-2 mt-auto">
                      {svc.features.slice(0, 3).map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-[#0D1B3D] font-medium text-sm group-hover:text-[#B87333] transition-colors flex items-center">
                      ดูรายละเอียด <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-lg">{isEn ? "No services found" : "ไม่พบข้อมูลบริการ"}</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-300 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-slate-700 mx-2">
              {isEn ? `Page ${currentPage} of ${totalPages}` : `หน้า ${currentPage} จาก ${totalPages}`}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-300 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
