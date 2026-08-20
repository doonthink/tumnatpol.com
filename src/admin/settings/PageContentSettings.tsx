import React from 'react';
import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';

export function PageContentSettings({ settings, setSettings, onSave }: { settings: any, setSettings: any, onSave: () => void }) {
  const { t } = useTranslation();

  const handlePageChange = (field: string, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      pages: {
        ...(prev.pages || {}),
        video: {
          ...(prev.pages?.video || {}),
          [field]: value
        }
      }
    }));
  };

  const pagesData = settings.pages || {};
  const videoData = pagesData.video || {};

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">จัดการหน้าวีดีโอ (Video Page Management)</h2>
          <p className="text-xs text-slate-500 mt-1">ตั้งค่าข้อความสำหรับหน้าแสดงผลวิดีโอ</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800">ส่วนหัวข้อ (Header)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-700 border-b pb-2">ภาษาไทย (TH)</h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">หัวข้อ (Title)</label>
                <input 
                  type="text" 
                  value={videoData.title || 'Video Clips'} 
                  onChange={e => handlePageChange('title', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">คำบรรยาย (Description)</label>
                <textarea 
                  rows={3}
                  value={videoData.description || 'Professional Event Production & Business Solutions'} 
                  onChange={e => handlePageChange('description', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-slate-700 border-b pb-2">English (EN)</h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title (EN)</label>
                <input 
                  type="text" 
                  value={videoData.titleEn || 'Video Clips'} 
                  onChange={e => handlePageChange('titleEn', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description (EN)</label>
                <textarea 
                  rows={3}
                  value={videoData.descriptionEn || 'Professional Event Production & Business Solutions'} 
                  onChange={e => handlePageChange('descriptionEn', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 mt-8 pt-8 border-t border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">สีของแบนเนอร์ (Banner Colors)</h3>
          <p className="text-sm text-slate-500 mb-4">ตั้งค่าสีเหล่านี้จะถูกนำไปใช้งานเฉพาะในหน้าวีดีโอเท่านั้น (ตั้งแยกจากสีหลักของเว็บไซต์)</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Background Color (สีพื้นหลังแบนเนอร์)</label>
              <div className="flex gap-2">
                <div className="relative w-10 h-10 rounded-lg border border-slate-300 overflow-hidden shrink-0 cursor-pointer shadow-sm">
                  <input 
                    type="color" 
                    value={videoData.bannerBgColor || '#0D1B3D'} 
                    onChange={e => handlePageChange('bannerBgColor', e.target.value)}
                    className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                  />
                </div>
                <input 
                  type="text" 
                  value={videoData.bannerBgColor || '#0D1B3D'} 
                  onChange={e => handlePageChange('bannerBgColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary uppercase font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Text Color (สีตัวอักษรแบนเนอร์)</label>
              <div className="flex gap-2">
                <div className="relative w-10 h-10 rounded-lg border border-slate-300 overflow-hidden shrink-0 cursor-pointer shadow-sm">
                  <input 
                    type="color" 
                    value={videoData.bannerTextColor || '#FFFFFF'} 
                    onChange={e => handlePageChange('bannerTextColor', e.target.value)}
                    className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                  />
                </div>
                <input 
                  type="text" 
                  value={videoData.bannerTextColor || '#FFFFFF'} 
                  onChange={e => handlePageChange('bannerTextColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary uppercase font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
