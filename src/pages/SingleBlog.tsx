import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { Calendar, Eye, Tag, Share2, User } from 'lucide-react';

export function SingleBlog() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const [blogsRes, catsRes] = await Promise.all([
          fetch('/api/blogs'),
          fetch('/api/categories')
        ]);
        const data = await blogsRes.json();
        const catsData = await catsRes.json();
        setCategoriesData(catsData);
        
        const found = data.find((b: any) => b.id === id || b.slug === id);
        setPost(found || null);

        if (found) {
          // increment views
          const updatedViews = (found.views || 0) + 1;
          fetch(`/api/blogs/${found.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ views: updatedViews })
          }).catch(() => {});
          setPost({ ...found, views: updatedViews });

          // get related posts by category or random, excluding current post
          const related = data.filter((b: any) => b.status === 'Published' && b.id !== found.id && b.category === found.category).slice(0, 3);
          if (related.length < 3) {
            const more = data.filter((b: any) => b.status === 'Published' && b.id !== found.id && !related.find((r: any) => r.id === b.id)).slice(0, 3 - related.length);
            setRelatedPosts([...related, ...more]);
          } else {
            setRelatedPosts(related);
          }
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [id]);

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

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
        <SEO title="Page Not Found" />
        <Header />
        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full text-center">
          <h1 className="text-4xl font-bold text-[#0D1B3D] mb-4">404</h1>
          <p className="text-lg text-slate-600 mb-8">{isEn ? "Article not found" : "ไม่พบบทความที่คุณต้องการ"}</p>
          <Link to="/blog" className="text-[#B87333] hover:underline">{isEn ? "Back to blog" : "กลับหน้าบล็อก"}</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <SEO title={(isEn && post.title_en ? post.title_en : post.title)} description={post.seoDescription || post.description} image={post.image} />
      <Header />
      
      <main className="flex-grow pb-20">
        {/* Hero Section */}
        <div className="bg-[#0D1B3D] text-white pt-20 pb-24 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
             <img src={post.image || 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=1600&q=80'} alt="" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-[#0D1B3D] mix-blend-multiply"></div>
          </div>
          
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            {post.category && (
              <span className="inline-block px-3 py-1 bg-[#B87333] text-white text-xs font-semibold rounded-full mb-6">
                {getCategoryName(post.category)}
              </span>
            )}
            <h1 className="text-3xl lg:text-5xl font-bold leading-tight mb-6">{(isEn && post.title_en ? post.title_en : post.title)}</h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author || 'Admin'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date || Date.now()).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.views || 0} {isEn ? "views" : "ครั้ง"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 -mt-10 relative z-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 lg:p-12">
            
            {/* Description / Lead */}
            {post.description && (
              <p className="text-xl text-slate-600 leading-relaxed font-medium mb-8 border-l-4 border-[#B87333] pl-6">
                {(isEn && post.description_en ? post.description_en : post.description)}
              </p>
            )}

            {/* YouTube Embed */}
            {post.youtubeUrl && (
              <div className="mb-8 aspect-video w-full rounded-xl overflow-hidden shadow-md">
                <iframe 
                  src={post.youtubeUrl.replace('watch?v=', 'embed/').split('&')[0]} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            )}

            {/* Main Content */}
            <div 
              className="prose prose-slate prose-lg max-w-none prose-headings:text-[#0D1B3D] prose-a:text-[#B87333] hover:prose-a:text-[#B87333]/80"
              dangerouslySetInnerHTML={{ __html: (isEn && post.content_en ? post.content_en : post.content) }}
            />

            {/* Footer Tags & Share */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">{isEn ? "Share this article:" : "แชร์บทความนี้:"}</span>
                <div className="flex items-center gap-2">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                    <span className="text-xs font-bold">f</span>
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${(isEn && post.title_en ? post.title_en : post.title)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                    <span className="text-xs font-bold">X</span>
                  </a>
                  <a href={`https://social-plugins.line.me/lineit/share?url=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#06C755] flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                    <span className="text-xs font-bold">L</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-20">
            <h2 className="text-2xl font-bold text-[#0D1B3D] mb-8 text-center">{isEn ? "Related Articles" : "บทความที่เกี่ยวข้อง"}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {relatedPosts.map(related => (
                <Link key={related.id} to={`/blog/${related.slug || related.id}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={related.image || 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=800&q=80'} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    {related.category && (
                      <span className="text-xs font-semibold tracking-wider text-[#B87333] uppercase mb-2 block">{getCategoryName(related.category)}</span>
                    )}
                    <h3 className="text-lg font-bold text-[#0D1B3D] mb-2 line-clamp-2 group-hover:text-[#B87333] transition-colors">{(isEn && related.title_en ? related.title_en : related.title)}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-4">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(related.date || Date.now()).toLocaleDateString('th-TH')}</span>
                      <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {related.views || 0}</span>
                    </div>
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
