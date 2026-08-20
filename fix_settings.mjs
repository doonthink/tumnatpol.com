import fs from 'fs';

let content = fs.readFileSync('src/admin/settings/SettingsPage.tsx', 'utf8');

// We need to add state for settings
const stateInjection = `
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>({
    general: {
      siteName: 'BIZ TOP TIER',
      companyName: 'Biz Top Tier Co., Ltd.',
      contactEmail: 'contact@biztoptier.com',
      phoneNumber: '0617898692',
      logoUrl: '',
      bannerRotationTime: '5',
      defaultLanguage: 'Thai (TH)',
      timezone: 'Asia/Bangkok (GMT+7)',
      currency: 'THB (฿)'
    }
  });

  import { useEffect } from 'react';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data && data.general) {
          setSettings({
            ...settings,
            ...data
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleGeneralChange = (e: any) => {
    const { name, value } = e.target;
    setSettings((prev: any) => ({
      ...prev,
      general: {
        ...prev.general,
        [name]: value
      }
    }));
  };

  const handleLogoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings((prev: any) => ({
        ...prev,
        general: {
          ...prev.general,
          logoUrl: reader.result as string
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const saveSettings = async () => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };
`;

// Replace the start of SettingsPage
content = content.replace(/const \{ t \} = useTranslation\(\);\n  const \[activeTab, setActiveTab\] = useState\('general'\);/, stateInjection.replace(/import \{ useEffect \} from 'react';/, ''));

// Add useEffect import to top
content = content.replace(/import \{ useState \} from 'react';/, "import { useState, useEffect } from 'react';");

// Use saveSettings for save button
content = content.replace(/onClick=\{\(\) => alert\("Settings saved successfully!"\)\}/, 'onClick={saveSettings}');

// Now update the general tab content
const newGeneralTab = `
            {activeTab === 'general' && (
              <div className="p-6 space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">{t("admin.general_settings")}</h2>
                  
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
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
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ระยะเวลาหมุนรูปภาพ Banner (วินาที)</label>
                      <input type="number" name="bannerRotationTime" value={settings.general?.bannerRotationTime || '5'} onChange={handleGeneralChange} min="1" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.website_name")}</label>
                      <input type="text" name="siteName" value={settings.general?.siteName || ''} onChange={handleGeneralChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.company_name")}</label>
                      <input type="text" name="companyName" value={settings.general?.companyName || ''} onChange={handleGeneralChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.contact_email")}</label>
                      <input type="email" name="contactEmail" value={settings.general?.contactEmail || ''} onChange={handleGeneralChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.phone_number")}</label>
                      <input type="text" name="phoneNumber" value={settings.general?.phoneNumber || ''} onChange={handleGeneralChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">{t("admin.localization")}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.default_language")}</label>
                      <select name="defaultLanguage" value={settings.general?.defaultLanguage || ''} onChange={handleGeneralChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent bg-white">
                        <option>Thai (TH)</option>
                        <option>English (EN)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.timezone")}</label>
                      <select name="timezone" value={settings.general?.timezone || ''} onChange={handleGeneralChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent bg-white">
                        <option>Asia/Bangkok (GMT+7)</option>
                        <option>UTC</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.currency")}</label>
                      <select name="currency" value={settings.general?.currency || ''} onChange={handleGeneralChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent bg-white">
                        <option>THB (฿)</option>
                        <option>USD ($)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
`;

content = content.replace(/\{activeTab === 'general' && \([\s\S]*?<\/div>\s*<\/div>\s*\)\}/, newGeneralTab + '\n            )}');

fs.writeFileSync('src/admin/settings/SettingsPage.tsx', content);
console.log("SettingsPage updated");
