import React, { useState, useEffect, useRef } from 'react';
import { Save, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function BlogBannerSettings() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [settings, setSettings] = useState<any>({
    pages: {
      blog: {
        title_th: 'บทความ',
        title_color: '#0D1B3D',
        title_en: 'Blog',
        subtitle_th: 'ติดตามบทความและสาระดีจาก Business toptier',
        subtitle_color: '#0D1B3D',
        subtitle_en: 'Follow insightful articles and valuable content from Business toptier',
        home_title_th: 'บทความของเรา',
        home_subtitle_th: 'ติดตามข้อมูลข่าวสารของเรา',
        home_title_en: 'Latest Blogs',
        home_subtitle_en: 'Update your knowledge and business trends...',
        bg_type: 'solid',
        bg_color1: '#FDFAF6',
        bg_color2: '#FFFFFF',
        bg_color3: '',
        bg_image: ''
      }
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data) {
        setSettings((prev: any) => ({
          ...prev,
          ...data,
          pages: {
            ...prev.pages,
            ...(data.pages || {}),
            blog: {
              ...prev.pages?.blog,
              ...(data.pages?.blog || {})
            }
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert('บันทึกการตั้งค่าเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      pages: {
        ...(prev.pages || {}),
        blog: {
          ...(prev.pages?.blog || {}),
          [field]: value
        }
      }
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { compressImage } = await import('../../lib/imageUtils');
      const base64 = await compressImage(file, 1600, 0.8);
      handleChange('bg_image', base64);
    } catch (err) {
      console.error('Failed to compress image', err);
      alert('Failed to upload image');
    }
  };

  const blogData = settings.pages?.blog || {};

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-1">ปรับแต่งแบนเนอร์หน้าบทความ</h2>
        <p className="text-sm text-slate-500 mb-8">กำหนดข้อความ, สีตัวอักษร, คำบรรยายใต้ภาพ และรูปแบบพื้นหลังด้านบนสุดในหน้า "บทความ (Blog)"</p>

        {/* 1. Text Settings */}
        <div className="space-y-6 mb-10">
          <h3 className="text-sm font-bold text-slate-900">1. การตั้งค่าข้อความ (Text Settings)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">หัวข้อแบนเนอร์ (TH)</label>
              <input 
                type="text" 
                value={blogData.title_th || ''}
                onChange={(e) => handleChange('title_th', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B87333]" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">สีคำแรกเน้นคำ</label>
              <div className="flex gap-2">
                <div className="relative w-10 h-10 rounded-lg border border-slate-300 overflow-hidden shrink-0 cursor-pointer shadow-sm">
                  <input 
                    type="color" 
                    value={blogData.title_color || '#0D1B3D'}
                    onChange={(e) => handleChange('title_color', e.target.value)}
                    className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer" 
                  />
                </div>
                <input 
                  type="text" 
                  value={blogData.title_color || '#0D1B3D'}
                  onChange={(e) => handleChange('title_color', e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B87333] uppercase font-mono" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">หัวข้อแบนเนอร์ (EN)</label>
              <input 
                type="text" 
                value={blogData.title_en || ''}
                onChange={(e) => handleChange('title_en', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B87333]" 
              />
            </div>
            <div></div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">คำบรรยายใต้หัวข้อ (TH)</label>
              <input 
                type="text" 
                value={blogData.subtitle_th || ''}
                onChange={(e) => handleChange('subtitle_th', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B87333]" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">สีคำบรรยาย</label>
              <div className="flex gap-2">
                <div className="relative w-10 h-10 rounded-lg border border-slate-300 overflow-hidden shrink-0 cursor-pointer shadow-sm">
                  <input 
                    type="color" 
                    value={blogData.subtitle_color || '#0D1B3D'}
                    onChange={(e) => handleChange('subtitle_color', e.target.value)}
                    className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer" 
                  />
                </div>
                <input 
                  type="text" 
                  value={blogData.subtitle_color || '#0D1B3D'}
                  onChange={(e) => handleChange('subtitle_color', e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B87333] uppercase font-mono" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">คำบรรยายใต้หัวข้อ (EN)</label>
              <input 
                type="text" 
                value={blogData.subtitle_en || ''}
                onChange={(e) => handleChange('subtitle_en', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B87333]" 
              />
            </div>
          </div>
        </div>

        {/* 2. Home Page Settings */}
        <div className="space-y-6 mb-10">
          <h3 className="text-sm font-bold text-slate-900">2. การตั้งค่าข้อความหน้าแรก (Home Page Settings)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">หัวข้อหน้าแรก (TH)</label>
              <input 
                type="text" 
                value={blogData.home_title_th || ''}
                onChange={(e) => handleChange('home_title_th', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B87333]" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">คำบรรยายหน้าแรก (TH)</label>
              <input 
                type="text" 
                value={blogData.home_subtitle_th || ''}
                onChange={(e) => handleChange('home_subtitle_th', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B87333]" 
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">หัวข้อหน้าแรก (EN)</label>
              <input 
                type="text" 
                value={blogData.home_title_en || ''}
                onChange={(e) => handleChange('home_title_en', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B87333]" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">คำบรรยายหน้าแรก (EN)</label>
              <input 
                type="text" 
                value={blogData.home_subtitle_en || ''}
                onChange={(e) => handleChange('home_subtitle_en', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B87333]" 
              />
            </div>
          </div>
        </div>

        {/* 3. Background Settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-900">3. การตั้งค่าพื้นหลัง (Background Settings)</h3>
          
          <div className="flex border-b border-slate-200">
            <button 
              className={`px-4 py-2 text-sm font-medium ${blogData.bg_type === 'solid' ? 'text-[#0D1B3D] border-b-2 border-[#0D1B3D]' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => handleChange('bg_type', 'solid')}
            >
              สีเดียว (Solid)
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${blogData.bg_type === 'gradient' ? 'text-[#0D1B3D] border-b-2 border-[#0D1B3D]' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => handleChange('bg_type', 'gradient')}
            >
              ไล่สี (Gradient)
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${blogData.bg_type === 'image' ? 'text-[#0D1B3D] border-b-2 border-[#0D1B3D]' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => handleChange('bg_type', 'image')}
            >
              รูปภาพ (Image)
            </button>
          </div>

          <div className="pt-4">
            {blogData.bg_type !== 'image' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">สีหลัก (Color 1)</label>
                  <div className="flex gap-2">
                    <div className="relative w-8 h-8 rounded border border-slate-300 overflow-hidden shrink-0 cursor-pointer shadow-sm">
                      <input 
                        type="color" 
                        value={blogData.bg_color1 || '#FDFAF6'}
                        onChange={(e) => handleChange('bg_color1', e.target.value)}
                        className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer" 
                      />
                    </div>
                    <input 
                      type="text" 
                      value={blogData.bg_color1 || '#FDFAF6'}
                      onChange={(e) => handleChange('bg_color1', e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#B87333] uppercase font-mono text-sm" 
                    />
                  </div>
                </div>

                {blogData.bg_type === 'gradient' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">สีที่สอง (Color 2)</label>
                      <div className="flex gap-2">
                        <div className="relative w-8 h-8 rounded border border-slate-300 overflow-hidden shrink-0 cursor-pointer shadow-sm">
                          <input 
                            type="color" 
                            value={blogData.bg_color2 || '#FFFFFF'}
                            onChange={(e) => handleChange('bg_color2', e.target.value)}
                            className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer" 
                          />
                        </div>
                        <input 
                          type="text" 
                          value={blogData.bg_color2 || '#FFFFFF'}
                          onChange={(e) => handleChange('bg_color2', e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#B87333] uppercase font-mono text-sm" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">สีที่สาม (Color 3 - ถ้ามี)</label>
                      <div className="flex gap-2">
                        <div className="relative w-8 h-8 rounded border border-slate-300 overflow-hidden shrink-0 cursor-pointer shadow-sm">
                          <input 
                            type="color" 
                            value={blogData.bg_color3 || '#FFFFFF'}
                            onChange={(e) => handleChange('bg_color3', e.target.value)}
                            className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer" 
                          />
                        </div>
                        <input 
                          type="text" 
                          value={blogData.bg_color3 || ''}
                          onChange={(e) => handleChange('bg_color3', e.target.value)}
                          placeholder="(ตัวเลือก)"
                          className="flex-1 px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#B87333] uppercase font-mono text-sm" 
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {blogData.bg_type === 'image' && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-700 mb-2">รูปภาพแบนเนอร์ (Banner Image)</label>
                {blogData.bg_image ? (
                  <div className="relative w-full max-w-2xl h-48 rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={blogData.bg_image} alt="Banner Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium">เปลี่ยนรูปภาพ</button>
                      <button type="button" onClick={() => handleChange('bg_image', '')} className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 text-white text-sm font-medium">ลบ</button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full max-w-2xl border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <span className="text-sm text-slate-500">คลิกเพื่ออัปโหลดรูปภาพ</span>
                    <p className="text-xs text-slate-400 mt-1">แนะนำขนาด 1920x400 px</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
              </div>
            )}
          </div>
        </div>

      </div>
      <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
        <button 
          onClick={saveSettings} 
          disabled={saving}
          className="px-6 py-2 bg-[#B87333] text-white rounded-lg font-medium hover:bg-[#a0632a] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> 
          {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่าแบนเนอร์'}
        </button>
      </div>
    </div>
  );
}
