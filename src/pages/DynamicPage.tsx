import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { useScriptInjector } from '../hooks/useScriptInjector';
import { useTranslation } from 'react-i18next';

export function DynamicPage({ staticSlug }: { staticSlug?: string }) {
  const { slug: paramSlug } = useParams();
  const { i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const currentSlug = staticSlug || paramSlug;
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch('/api/pages');
        const pages = await res.json();
        const foundPage = pages.find((p: any) => p.slug === `/${currentSlug}` || p.slug === currentSlug);
        setPage(foundPage || null);
      } catch (error) {
        console.error('Error fetching page:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPage();
  }, [currentSlug]);

  useScriptInjector(page?.headerScript, page?.footerScript);

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

  if (!page) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
        <SEO title="Page Not Found" />
        <Header />
        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full text-center">
          <h1 className="text-4xl font-bold text-[#0D1B3D] mb-4">404</h1>
          <p className="text-lg text-slate-600 mb-8">{isEn ? "Page Not Found" : "ไม่พบหน้าที่คุณต้องการ"}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <SEO title={(isEn && page.title_en ? page.title_en : page.title)} description={(isEn && page.seoDescription_en ? page.seoDescription_en : page.seoDescription)} favicon={page.favicon} />
      <Header />
      <main className="flex-grow max-w-full mx-auto w-full">
        <div className="w-full">
          <div className="prose prose-slate prose-lg max-w-none prose-headings:text-[#0D1B3D] prose-a:text-[#B87333] hover:prose-a:text-[#B87333]/80" dangerouslySetInnerHTML={{ __html: (isEn && page.content_en ? page.content_en : page.content) }}></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
