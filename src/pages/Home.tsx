import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { BannerCarousel } from '../components/BannerCarousel';
import { Partners } from '../components/Partners';
import { Features } from '../components/Features';
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
        {page?.content && (
          <div dangerouslySetInnerHTML={{ __html: isEn && page.content_en ? page.content_en : page.content }} />
        )}
        <BannerCarousel />
        <Hero />
        <Partners />
        <Features />
        <ServicesSection />
        <LatestBlogs />
      </main>
      <Footer />
    </div>
  );
}
