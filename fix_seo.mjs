import fs from 'fs';

let content = `import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  favicon?: string;
  image?: string;
}

export function SEO({
  title = 'BIZ Toptier',
  description,
  favicon,
  image
}: SEOProps) {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const defaultDesc = isEn ? 'Business Data Centers connecting and elevating organizational potential to Top Tier for sustainable growth in the digital age' : 'ศูนย์กลางข้อมูลธุรกิจ (Business Data Centers) เชื่อมโยงและยกระดับศักยภาพขององค์กรทุกระดับสู่มาตรฐานสูงสุด (Top Tier) เพื่อการเติบโตอย่างยั่งยืนในยุคดิจิทัล';
  const finalDesc = description || defaultDesc;

  useEffect(() => {
    document.title = title !== 'BIZ Toptier' ? \`\${title} | BIZ Toptier\` : title;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', finalDesc);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', finalDesc);
      document.head.appendChild(metaDescription);
    }

    if (favicon) {
      let linkFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (linkFavicon) {
        linkFavicon.href = favicon;
      } else {
        linkFavicon = document.createElement('link');
        linkFavicon.rel = 'icon';
        linkFavicon.href = favicon;
        document.head.appendChild(linkFavicon);
      }
    }
  }, [title, finalDesc, favicon, image]);

  return null;
}
`;

fs.writeFileSync('src/components/SEO.tsx', content);
