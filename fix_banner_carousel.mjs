import fs from 'fs';

let content = fs.readFileSync('src/components/BannerCarousel.tsx', 'utf8');

const stateInjection = `
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotationTime, setRotationTime] = useState(5);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data && data.general && data.general.bannerRotationTime) {
          setRotationTime(parseInt(data.general.bannerRotationTime) || 5);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);
`;

content = content.replace(/const \[banners, setBanners\] = useState<any\[\]>\(\[\]\);\n  const \[currentIndex, setCurrentIndex\] = useState\(0\);/, stateInjection.trim());

// We need to replace the setInterval delay with rotationTime * 1000
content = content.replace(/5000\); \/\/ 5 seconds/, "rotationTime * 1000);");
// also we need to add rotationTime to dependency array of the useEffect
content = content.replace(/}, \[banners\.length\]\);/, "}, [banners.length, rotationTime]);");

fs.writeFileSync('src/components/BannerCarousel.tsx', content);
console.log("BannerCarousel updated");
