import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { SEO } from '../../components/SEO';
import { ArrowLeft, Calendar, Eye, FolderOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function VideoDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  const [video, setVideo] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const [vidRes, catRes] = await Promise.all([
          fetch('/api/videos'),
          fetch('/api/videoCategories')
        ]);
        const vidData = await vidRes.json();
        const catData = await catRes.json();
        
        const found = Array.isArray(vidData) ? vidData.find(v => v.slug === slug || String(v.id) === slug) : null;
        
        if (found) {
          if (found.status !== 'Published' && (!found.publishAt || new Date(found.publishAt).getTime() > Date.now())) {
            // Not published yet, or draft/unpublished
            navigate('/video');
            return;
          }

          setVideo(found);
          const cat = Array.isArray(catData) ? catData.find(c => c.id === found.categoryId) : null;
          setCategory(cat);

          // Update views (simple implementation)
          fetch(`/api/videos/${found.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ views: (found.views || 0) + 1 })
          });
        } else {
          navigate('/video');
        }
      } catch (error) {
        console.error('Error fetching video:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideo();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-slate-500">Loading video...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!video) return null;

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ytId = video.sourceType === 'YouTube' && video.videoUrl ? extractYoutubeId(video.videoUrl) : null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <SEO 
        title={`${video.title} - Video`} 
        description={video.description ? video.description.replace(/<[^>]*>?/gm, '').substring(0, 160) : 'Video presentation'} 
        image={video.thumbnail} 
      />
      <Header />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-10 max-w-5xl mx-auto w-full">
        <Link to="/video" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium mb-8">
          <ArrowLeft className="w-4 h-4" />
          {i18n.language?.startsWith('en') ? 'Back to Videos' : 'กลับไปหน้ารวมวิดีโอ'}
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          {/* Video Player Section */}
          <div className="aspect-video bg-black w-full relative">
            {video.sourceType === 'YouTube' && ytId ? (
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1`} 
                title={video.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            ) : video.sourceType === 'Upload' && video.videoFile ? (
              <video 
                src={video.videoFile} 
                poster={video.thumbnail}
                controls 
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                Video format not supported or missing source.
              </div>
            )}
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6 font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(video.publishAt || video.createdAt || Date.now()).toLocaleDateString('th-TH', { 
                  year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </div>
              
              {category && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block"></span>
                  <div className="flex items-center gap-1.5 text-primary">
                    <FolderOpen className="w-4 h-4" />
                    {i18n.language?.startsWith('en') && category.name_en ? category.name_en : category.name}
                  </div>
                </>
              )}

              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block"></span>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {(video.views || 0) + 1} views
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">{video.title}</h1>
            
            {video.description && (
              <div className="prose prose-lg prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-primary hover:prose-a:text-primary/80" 
                   dangerouslySetInnerHTML={{ __html: video.description }}>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}