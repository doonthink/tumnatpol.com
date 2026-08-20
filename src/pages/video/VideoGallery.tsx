import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { SEO } from '../../components/SEO';
import { useTranslation } from 'react-i18next';
import { Search, Filter, PlayCircle, Grid as GridIcon, List as ListIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function VideoGallery() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  
  const [videos, setVideos] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [pageSettings, setPageSettings] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vidRes, catRes, settingsRes] = await Promise.all([
          fetch('/api/videos'),
          fetch('/api/videoCategories'),
          fetch('/api/settings')
        ]);
        const vidData = await vidRes.json();
        const catData = await catRes.json();
        const settingsData = await settingsRes.json();
        setPageSettings(settingsData?.pages?.video || null);

        
        // Only show published videos and handle scheduled publishing
        const publishedVideos = Array.isArray(vidData) ? vidData.filter(v => {
          if (v.status !== 'Published') return false;
          if (v.publishAt) {
            return new Date(v.publishAt).getTime() <= Date.now();
          }
          return true;
        }) : [];
        
        setVideos(publishedVideos.sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
        setCategories(Array.isArray(catData) ? catData.filter(c => c.status === 'Active') : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredVideos = videos.filter(v => {
    const matchSearch = v.title?.toLowerCase().includes(searchQuery.toLowerCase()) || v.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === '' || v.categoryId === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <SEO 
        title={`${isEn ? (pageSettings?.titleEn || 'Video Clips') : (pageSettings?.title || 'วิดีโอคลิป')}`} 
        description={isEn ? (pageSettings?.descriptionEn || 'Watch our latest video clips.') : (pageSettings?.description || 'รับชมวิดีโอคลิปผลงานล่าสุดของเรา')} 
      />
      <Header />
      
      {/* Page Hero */}
      <div 
        className="py-16 px-4 text-center"
        style={{
          backgroundColor: pageSettings?.bannerBgColor || 'var(--theme-primary)',
          color: pageSettings?.bannerTextColor || 'white'
        }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {isEn ? (pageSettings?.titleEn || 'Video Clips') : (pageSettings?.title || 'วิดีโอคลิป')}
        </h1>
        <p className="text-lg opacity-80 max-w-2xl mx-auto">
          {isEn ? (pageSettings?.descriptionEn || 'Professional Event Production & Business Solutions') : (pageSettings?.description || 'ศูนย์รวมผลงานและการผลิตวิดีโอสำหรับองค์กร')}
        </p>
      </div>

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search videos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent bg-white shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2 flex-1 lg:flex-none">
              <Filter className="w-5 h-5 text-slate-500 hidden lg:block" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent bg-white shadow-sm"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{isEn && category.name_en ? category.name_en : category.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center bg-white border border-slate-300 rounded-xl p-1 shadow-sm shrink-0">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-100 text-primary' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <GridIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-slate-100 text-primary' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <ListIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Listing */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-lg">Loading videos...</p>
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'flex flex-col gap-6'}`}>
            {filteredVideos.map((video) => {
              const cat = categories.find(c => c.id === video.categoryId);
              
              if (viewMode === 'grid') {
                return (
                  <Link to={`/video/${video.slug || video.id}`} key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col">
                    <div className="relative aspect-video overflow-hidden bg-slate-900">
                      {video.thumbnail ? (
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">No Thumbnail</div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-lg" />
                      </div>
                      {cat && (
                        <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white border border-white/20">
                          {isEn && cat.name_en ? cat.name_en : cat.name}
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="text-xs text-slate-500 mb-2 font-medium">
                        {new Date(video.publishAt || video.createdAt || Date.now()).toLocaleDateString('th-TH')}
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">{video.title}</h2>
                    </div>
                  </Link>
                );
              }

              // List View
              return (
                <Link to={`/video/${video.slug || video.id}`} key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-72 md:w-96 aspect-video shrink-0 bg-slate-900 overflow-hidden">
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">No Thumbnail</div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-center flex-grow">
                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-3 font-medium">
                      <span>{new Date(video.publishAt || video.createdAt || Date.now()).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      {cat && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="text-primary">{isEn && cat.name_en ? cat.name_en : cat.name}</span>
                        </>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">{video.title}</h2>
                    <div className="flex items-center text-sm font-semibold text-primary group-hover:text-accent transition-colors mt-auto">
                      <PlayCircle className="w-5 h-5 mr-2" /> ดูวิดีโอ
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-lg">No matching videos found</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}