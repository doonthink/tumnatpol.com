import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { Search, Filter, Pin, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Blog() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, catsRes] = await Promise.all([
          fetch('/api/blogs'),
          fetch('/api/categories')
        ]);
        const blogsData = await blogsRes.json();
        const catsData = await catsRes.json();
        setPosts(blogsData.filter((blog: any) => blog.status === 'Published'));
        setCategoriesData(catsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const categories = Array.from(new Set(posts.map(post => post.category).filter(Boolean))) as string[];

  const getCategoryName = (catName: string) => {
    if (!isEn) return catName;
    const cat = categoriesData.find(c => c.name === catName);
    return cat?.name_en || catName;
  };

  const filteredPosts = posts
    .filter(post => ((isEn && post.title_en ? post.title_en : post.title) || '').toLowerCase().includes(searchQuery.toLowerCase()) || ((isEn && post.description_en ? post.description_en : post.description) || '').toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(post => selectedCategory === '' || post.category === selectedCategory)
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });

  const postsPerPage = 6;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <SEO title="Biztoptier Articles" />
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[#0D1B3D] mb-4">Biztoptier Articles</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {isEn ? "Update business trends, new technologies, and knowledge to elevate your organization to Top Tier" : "อัปเดตเทรนด์ธุรกิจ เทคโนโลยีใหม่ๆ และเกร็ดความรู้ที่ช่วยยกระดับองค์กรของคุณสู่ Top Tier"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder={isEn ? "Search articles..." : "ค้นหาบทความ..."} 
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
            <p className="text-slate-500 text-lg">{isEn ? "Loading articles..." : "กำลังโหลดบทความ..."}</p>
          </div>
        ) : currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {currentPosts.map((post) => (
              <Link to={`/blog/${post.slug || post.id}`} key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col relative">
                {post.isPinned && (
                  <div className="absolute top-4 right-4 z-10 bg-[#B87333] text-white p-1.5 rounded-full shadow-md" title={isEn ? "Recommended Article" : "บทความแนะนำ"}>
                    <Pin className="w-4 h-4" />
                  </div>
                )}
                <div className="relative h-48 overflow-hidden">
                  <img src={post.image || 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=800&q=80'} alt={(isEn && post.title_en ? post.title_en : post.title)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {post.category && (
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#B87333]">
                      {getCategoryName(post.category)}
                    </div>
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span>{new Date(post.date || Date.now()).toLocaleDateString('th-TH')}</span>
                    <span>{post.views || 0} views</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#0D1B3D] mb-3 group-hover:text-[#B87333] transition-colors">{(isEn && post.title_en ? post.title_en : post.title)}</h2>
                  <p className="text-slate-600 line-clamp-2 text-sm mt-auto mb-4">
                    {(isEn && post.description_en ? post.description_en : post.description)}
                  </p>
                  <div className="mt-auto flex items-center text-sm font-semibold text-[#0D1B3D] group-hover:text-[#B87333] transition-colors">
                    {isEn ? "Read more" : "อ่านเพิ่มเติม"} 
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-lg">{isEn ? "No matching articles found" : "ไม่พบข้อมูลที่ค้นหา"}</p>
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
