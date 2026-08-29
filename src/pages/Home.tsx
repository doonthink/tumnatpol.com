import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { BannerCarousel } from '../components/BannerCarousel';
import { ServicesSection } from '../components/ServicesSection';
import { LatestBlogs } from '../components/LatestBlogs';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { useScriptInjector } from '../hooks/useScriptInjector';
import { useTranslation } from 'react-i18next';

export function Home() {
  const { i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const [page, setPage] = useState<any>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch('/api/pages');
        const pages = await res.json();
        const found = pages.find((p: any) => p.slug === 'home');
        if (found) setPage(found);
      } catch (error) {
        console.error('Error fetching home page:', error);
      }
    };
    fetchPage();
  }, []);

  useScriptInjector(page?.headerScript, page?.footerScript);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <SEO title={(isEn && page?.title_en ? page.title_en : page?.title) || 'BIZ Toptier'} description={(isEn && page?.seoDescription_en ? page.seoDescription_en : page?.seoDescription)} favicon={page?.favicon} />
      <Header />
      <main className="flex-grow">
        {page?.useCustomLayout ? (
          <div className="w-full">
            <div dangerouslySetInnerHTML={{ __html: isEn && page.content_en ? page.content_en : page.content }} />
          </div>
        ) : (
          <>
            <div className="relative w-full">
              <BannerCarousel fallback={<Hero />} />
            </div>
            
            {/* Show custom content if added (and not the default empty placeholder) */}
            {page?.content && page.content !== '<p>s</p>' && page.content !== '<p></p>' && (
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-7xl mx-auto" dangerouslySetInnerHTML={{ __html: isEn && page.content_en ? page.content_en : page.content }} />
              </div>
            )}

            <ServicesSection />
            <LatestBlogs />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
