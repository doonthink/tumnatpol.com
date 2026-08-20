import fs from 'fs';

let settingsContent = fs.readFileSync('src/admin/settings/SettingsPage.tsx', 'utf8');

// Remove bannerRotationTime from SettingsPage
settingsContent = settingsContent.replace(
  /<\s*div[^>]*>\s*<label[^>]*>ระยะเวลาหมุนรูปภาพ Banner \(วินาที\)<\/label>\s*<input[^>]*name="bannerRotationTime"[^>]*\/>\s*<\/div>/,
  ""
);

// We need to fix the grid layout that might have broken in SettingsPage
settingsContent = settingsContent.replace(
  /<div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">\s*<div>\s*<label className="block text-sm font-medium text-slate-700 mb-1">โลโก้เว็บไซต์ \(Logo\)<\/label>[\s\S]*?<\/label>\s*<\/div>\s*<\/div>\s*<\/div>/,
  `<div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-1">โลโก้เว็บไซต์ (Logo)</label>
                    <div className="mt-1 flex items-center gap-4">
                      {settings.general?.logoUrl ? (
                        <img src={settings.general.logoUrl} alt="Logo Preview" className="h-16 object-contain bg-slate-100 rounded-lg p-2 border border-slate-200" />
                      ) : (
                        <div className="h-16 w-32 bg-slate-100 flex items-center justify-center text-slate-400 rounded-lg border border-slate-200 text-xs">No Logo</div>
                      )}
                      <label className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer">
                        อัปโหลดโลโก้
                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                      </label>
                    </div>
                  </div>`
);


fs.writeFileSync('src/admin/settings/SettingsPage.tsx', settingsContent);
console.log("Removed rotation time from SettingsPage");


// Add to BannerList.tsx
let bannerContent = fs.readFileSync('src/admin/banners/BannerList.tsx', 'utf8');

// Inject rotation time state and fetch logic
const stateInjection = `
  const [rotationTime, setRotationTime] = useState(5);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data && data.general && data.general.bannerRotationTime) {
          setRotationTime(parseInt(data.general.bannerRotationTime));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const saveRotationTime = async (newTime: number) => {
    try {
      const res = await fetch('/api/settings');
      let data = await res.json();
      data = {
        ...data,
        general: {
          ...data.general,
          bannerRotationTime: newTime.toString()
        }
      };
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      alert('บันทึกเวลาหมุนแบนเนอร์เรียบร้อย');
    } catch(err) {
      console.error(err);
    }
  };
`;

bannerContent = bannerContent.replace(/useEffect\(\(\) => \{\s*fetchBanners\(\);\s*\}, \[\]\);/, "useEffect(() => { fetchBanners(); }, []);\n" + stateInjection);

// Add to UI
const uiInjection = `
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">จัดการแบนเนอร์ (Banners)</h1>
          <p className="text-sm text-slate-500 mt-1">จัดการแบนเนอร์ที่แสดงในหน้าแรกของเว็บไซต์</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
            <label className="text-sm font-medium text-slate-700">เวลาหมุนภาพ (วินาที):</label>
            <input 
              type="number" 
              value={rotationTime} 
              onChange={(e) => setRotationTime(parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 border border-slate-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-[#B87333]"
            />
            <button 
              onClick={() => saveRotationTime(rotationTime)}
              className="text-xs bg-[#0D1B3D] text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              บันทึก
            </button>
          </div>
          <button onClick={handleNew} className="px-4 py-2 bg-[#B87333] text-white rounded-lg text-sm font-medium hover:bg-[#a0632b] transition-colors shadow-md flex items-center gap-2">
            <Plus className="w-4 h-4" /> เพิ่มแบนเนอร์
          </button>
        </div>
      </div>
`;

bannerContent = bannerContent.replace(
  /<div className="flex justify-between items-center mb-6">[\s\S]*?<button onClick=\{handleNew\}[\s\S]*?เพิ่มแบนเนอร์\s*<\/button>\s*<\/div>/,
  uiInjection.trim()
);

fs.writeFileSync('src/admin/banners/BannerList.tsx', bannerContent);
console.log("Added rotation time to BannerList");

