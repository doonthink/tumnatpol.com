import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function LatestBlogs() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const [posts, setPosts] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, catsRes] = await Promise.all([
          fetch('/api/blogs'),
          fetch('/api/categories')
        ]);
        const data = await blogsRes.json();
        const catsData = await catsRes.json();
        
        // Filter out drafts, sort by date descending, and take top 3
        const published = data.filter((blog: any) => blog.status === 'Published');
        published.sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        setPosts(published.slice(0, 3));
        setCategoriesData(catsData);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    
    fetchData();
  }, []);

  const getCategoryName = (catName: string) => {
    if (!isEn) return catName;
    const cat = categoriesData.find(c => c.name === catName);
    return cat?.name_en || catName;
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#0D1B3D] mb-4">{t('latest_blogs.title')}</h2>
            <p className="text-lg text-slate-600 max-w-2xl">{t('latest_blogs.subtitle')}</p>
          </div>
          <Link to="/blog" className="shrink-0 text-sm font-semibold text-[#B87333] hover:text-[#B87333]/80 transition-colors flex items-center gap-2">
            {t('latest_blogs.view_all')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link to={`/blog/${post.slug || post.id}`} key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img src={post.image || 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=800&q=80'} alt={(isEn && post.title_en ? post.title_en : post.title)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {post.category && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#B87333]">
                    {getCategoryName(post.category)}
                  </div>
                )}
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="text-xs text-slate-500 mb-3">{new Date(post.date || Date.now()).toLocaleDateString('th-TH')}</div>
                <h3 className="text-xl font-bold text-[#0D1B3D] mb-3 group-hover:text-[#B87333] transition-colors line-clamp-2">{(isEn && post.title_en ? post.title_en : post.title)}</h3>
                <p className="text-slate-600 text-sm mt-auto mb-4 line-clamp-2">
                  {(isEn && post.description_en ? post.description_en : post.description)}
                </p>
                <div className="mt-auto flex items-center text-sm font-semibold text-[#0D1B3D] group-hover:text-[#B87333] transition-colors">
                  {t('read_more')} 
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
