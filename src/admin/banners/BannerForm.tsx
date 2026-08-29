import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Image as ImageIcon, Eye, Plus, X, Type, Pointer, Layout, Palette, Check, Trash2, RefreshCw } from 'lucide-react';

const FONTS = [
  { label: 'พร้อม (Promt) - ตัวโมเดิร์น', value: 'font-prompt' },
  { label: 'โนโตซาน (Noto Sans) - ทางการ', value: 'font-noto' },
];

const PRESET_BANNERS = [
  { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200', label: 'Office' },
  { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200', label: 'Meeting' },
  { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200', label: 'Team' },
];

const PRESET_GRADIENTS = [
  { label: 'Dark Navy Classic', stops: [{ color: '#0f172a' }, { color: '#1e293b' }], direction: '90deg' },
  { label: 'Gold Luxury', stops: [{ color: '#b87333' }, { color: '#d4af37' }], direction: '90deg' },
  { label: 'Light Clean', stops: [{ color: '#ffffff' }, { color: '#f1f5f9' }], direction: '90deg' },
];

const SIZES = [
  { label: '2XL (24px)', value: 'text-2xl' },
  { label: '3XL (30px)', value: 'text-3xl' },
  { label: '4XL (36px)', value: 'text-4xl' },
  { label: '5XL (48px)', value: 'text-5xl' },
];

const WEIGHTS = [
  { label: 'ปกติ (Regular 400)', value: 'font-normal' },
  { label: 'หนาปานกลาง (Medium 500)', value: 'font-medium' },
  { label: 'หนา (Bold 700)', value: 'font-bold' },
  { label: 'หนาพิเศษ (Extra Bold 800)', value: 'font-extrabold' },
];

const COLOR_SWATCHES = ['#FFFFFF', '#000000', '#F8FAFC', '#E2E8F0', '#94A3B8', '#475569', '#1E293B', '#0F172A', '#B87333', '#D4AF37', '#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6'];

export function BannerForm({ initialData, onSave, onCancel }: any) {
  const defaultState = {
    name: '', link: '', order: 0, status: 'Active',
    layoutType: 'hero',
    badge: { text: '', font: 'font-prompt', color: '#B87333' },
    heading1: { text: '', font: 'font-prompt', color: '#1E293B', size: 'text-4xl', weight: 'font-bold' },
    heading2: { text: '', font: 'font-prompt', color: '#475569', size: 'text-2xl', weight: 'font-medium' },
    description: { text: '', font: 'font-noto', color: '#64748B' },
    primaryButton: { text: '', link: '', bgColor: '#B87333', textColor: '#FFFFFF', font: 'font-prompt' },
    secondaryButton: { text: '', link: '', bgColor: '#F1F5F9', textColor: '#475569', font: 'font-prompt' },
    image: '',
    background: {
      stops: [{ color: '#ffffff' }, { color: '#f8fafc' }],
      direction: '90deg',
      solidColor: '#ffffff',
      patternImage: ''
    }
  };

  const [formData, setFormData] = useState<any>(defaultState);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({ ...defaultState, ...initialData });
    }
  }, [initialData]);

  const updateField = (path: string[], value: any) => {
    setFormData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  const handleImageUpload = (e: any, fieldPath: string[]) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200; // Limit size for banners
        
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          updateField(fieldPath, compressedBase64);
        } else {
          updateField(fieldPath, event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const renderColorPicker = (label: string, path: string[], value: string) => (
    <div className="space-y-2">
      <label className="text-xs font-medium text-slate-700 flex items-center gap-1"><Palette className="w-3 h-3"/> {label}</label>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input 
            type="color" 
            value={value || '#000000'} 
            onChange={(e) => updateField(path, e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-slate-200"
          />
          <input 
            type="text" 
            value={value || ''} 
            onChange={(e) => updateField(path, e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#B87333] outline-none uppercase"
            placeholder="#FFFFFF"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {COLOR_SWATCHES.map(c => (
            <button
              key={c}
              onClick={() => updateField(path, c)}
              className={`w-5 h-5 rounded-full border ${value === c ? 'ring-2 ring-offset-1 ring-[#B87333] border-transparent' : 'border-slate-200'}`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-6xl mx-auto bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-40">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">{formData.id ? 'แก้ไขแบนเนอร์' : 'เพิ่มแบนเนอร์ใหม่'}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setFormData(defaultState)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> รีเซ็ต
          </button>
          <button onClick={() => onSave(formData)} className="px-5 py-2 bg-[#0D1B3D] text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-md inline-flex items-center gap-2">
            <Save className="w-4 h-4" /> บันทึกแบนเนอร์
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-slate-900 rounded-xl p-1 shadow-lg overflow-hidden border border-slate-800">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
          <span className="text-xs font-semibold tracking-wider text-slate-300 flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#B87333]"/> LIVE INTERACTIVE PREVIEW
          </span>
        </div>
        <div className="bg-white w-full overflow-hidden relative" style={{ minHeight: '300px' }}>
          {formData.layoutType === 'hero' ? (
            <div 
              className="w-full h-full min-h-[400px] flex items-center p-8 relative"
              style={{
                background: formData.background?.stops?.length > 1 
                  ? `linear-gradient(${formData.background.direction}, ${formData.background.stops.map((s:any) => s.color).join(', ')})`
                  : formData.background?.solidColor || '#fff'
              }}
            >
              {formData.background?.patternImage && (
                <div 
                  className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
                  style={{ backgroundImage: `url(${formData.background.patternImage})` }}
                />
              )}
              <div className="relative z-10 grid grid-cols-2 gap-8 items-center max-w-5xl mx-auto w-full">
                <div className="space-y-4">
                  {formData.badge?.text && (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/80 shadow-sm ${formData.badge.font}`} style={{ color: formData.badge.color }}>
                      {formData.badge.text}
                    </span>
                  )}
                  {formData.heading1?.text && (
                    <h2 className={`${formData.heading1.size} ${formData.heading1.weight} ${formData.heading1.font} leading-tight`} style={{ color: formData.heading1.color }}>
                      {formData.heading1.text}
                    </h2>
                  )}
                  {formData.heading2?.text && (
                    <h3 className={`${formData.heading2.size} ${formData.heading2.weight} ${formData.heading2.font}`} style={{ color: formData.heading2.color }}>
                      {formData.heading2.text}
                    </h3>
                  )}
                  {formData.description?.text && (
                    <p className={`text-base ${formData.description.font} opacity-90`} style={{ color: formData.description.color }}>
                      {formData.description.text}
                    </p>
                  )}
                  <div className="flex items-center gap-3 pt-2">
                    {formData.primaryButton?.text && (
                      <button className={`px-6 py-2.5 rounded-lg shadow-md font-medium transition-transform hover:scale-105 ${formData.primaryButton.font}`} style={{ backgroundColor: formData.primaryButton.bgColor, color: formData.primaryButton.textColor }}>
                        {formData.primaryButton.text}
                      </button>
                    )}
                    {formData.secondaryButton?.text && (
                      <button className={`px-6 py-2.5 rounded-lg shadow-sm font-medium transition-transform hover:scale-105 border border-black/10 ${formData.secondaryButton.font}`} style={{ backgroundColor: formData.secondaryButton.bgColor, color: formData.secondaryButton.textColor }}>
                        {formData.secondaryButton.text}
                      </button>
                    )}
                  </div>
                </div>
                {formData.image && (
                  <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
                    <img src={formData.image} alt="Banner graphic" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full h-full min-h-[300px]">
              {formData.image ? (
                <img src={formData.image} alt="Full Banner" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-64 bg-slate-100 flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                  <p>กรุณาอัปโหลดรูปภาพเต็มความกว้าง</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Section 1 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
            <Layout className="w-5 h-5 text-[#B87333]" />
            <h2 className="text-base font-bold text-slate-800">ข้อมูลหลัก & การตอบสนอง</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="text-sm font-semibold text-slate-800 mb-3 block">รูปแบบแบนเนอร์ (Layout Type)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.layoutType === 'hero' ? 'border-[#B87333] bg-[#B87333]/5' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="layoutType" checked={formData.layoutType === 'hero'} onChange={() => updateField(['layoutType'], 'hero')} className="mt-1 text-[#B87333] focus:ring-[#B87333]" />
                  <div>
                    <span className="block font-semibold text-slate-800">เค้าโครงฮีโร่ (ปรับแต่งตัวอักษร & ได้ครบชุด)</span>
                    <span className="block text-xs text-slate-500 mt-1">หน้าแรกที่ต้องการข้อความคมชัดมองเห็นได้อิสระ สามารถเลือกตัวอักษรได้ทุกบรรทัดพร้อมปุ่ม Call to Action</span>
                  </div>
                </label>
                <label className={`relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.layoutType === 'full_graphic' ? 'border-[#B87333] bg-[#B87333]/5' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="layoutType" checked={formData.layoutType === 'full_graphic'} onChange={() => updateField(['layoutType'], 'full_graphic')} className="mt-1 text-[#B87333] focus:ring-[#B87333]" />
                  <div>
                    <span className="block font-semibold text-slate-800">กราฟิกแบบเต็มความกว้าง (ภาพกราฟิกเต็มรูปแบบ)</span>
                    <span className="block text-xs text-slate-500 mt-1">รูปภาพแบนเนอร์สำเร็จรูป (เช่น ภาพกราฟิกโปรโมชั่นจาก Photoshop/Canva) ภาพเต็ม 100%</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-slate-800 mb-1 block">ชื่อรายงาน (สำหรับข้อมูลของ Admin)</label>
                <input type="text" value={formData.name || ''} onChange={(e) => updateField(['name'], e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#B87333]" placeholder="แบนเนอร์โปรโมชั่น..." />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-800 mb-1 block">ลิงก์ปลายทางเมื่อคลิก (URL ลิงก์)</label>
                <input type="text" value={formData.link || ''} onChange={(e) => updateField(['link'], e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#B87333]" placeholder="https://" />
              </div>
            </div>
          </div>
        </div>

        {formData.layoutType === 'hero' && (
          <>
            {/* Section 2: Typography */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                <Type className="w-5 h-5 text-[#B87333]" />
                <h2 className="text-base font-bold text-slate-800">ตัวอักษรแต่ละบรรทัด (ตัวพิมพ์ & ไม่จำกัดสี)</h2>
              </div>
              <div className="p-6 space-y-8">
                
                {/* Badge */}
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-4 items-start pb-6 border-b border-slate-100">
                  <div>
                    <label className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#B87333]"></span> บรรทัดที่ 1: ป้ายข้อความบนสุด (BADGE)</label>
                    <input type="text" value={formData.badge?.text || ''} onChange={(e) => updateField(['badge', 'text'], e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#B87333]" placeholder="เช่น แนะนำ, โปรโมชั่น..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">เลือกฟอนต์ป้าย</label>
                    <select value={formData.badge?.font || ''} onChange={(e) => updateField(['badge', 'font'], e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#B87333]">
                      {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  {renderColorPicker('เลือกสีข้อความ', ['badge', 'color'], formData.badge?.color)}
                </div>

                {/* Heading 1 */}
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-4 items-start pb-6 border-b border-slate-100">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> หัวข้อหลักที่ 1</label>
                      <input type="text" value={formData.heading1?.text || ''} onChange={(e) => updateField(['heading1', 'text'], e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#B87333]" placeholder="หัวข้อหลัก..." />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium text-slate-600 mb-1 block">ขนาด</label>
                        <select value={formData.heading1?.size || ''} onChange={(e) => updateField(['heading1', 'size'], e.target.value)} className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm">
                          {SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600 mb-1 block">ความหนา</label>
                        <select value={formData.heading1?.weight || ''} onChange={(e) => updateField(['heading1', 'weight'], e.target.value)} className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm">
                          {WEIGHTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">เลือกฟอนต์</label>
                    <select value={formData.heading1?.font || ''} onChange={(e) => updateField(['heading1', 'font'], e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#B87333]">
                      {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  {renderColorPicker('เลือกสีข้อความ', ['heading1', 'color'], formData.heading1?.color)}
                </div>

                {/* Heading 2 */}
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-4 items-start pb-6 border-b border-slate-100">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> หัวข้อหลักที่ 2 (ไฮไลต์)</label>
                      <input type="text" value={formData.heading2?.text || ''} onChange={(e) => updateField(['heading2', 'text'], e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#B87333]" placeholder="ข้อความรอง..." />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium text-slate-600 mb-1 block">ขนาด</label>
                        <select value={formData.heading2?.size || ''} onChange={(e) => updateField(['heading2', 'size'], e.target.value)} className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm">
                          {SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600 mb-1 block">ความหนา</label>
                        <select value={formData.heading2?.weight || ''} onChange={(e) => updateField(['heading2', 'weight'], e.target.value)} className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm">
                          {WEIGHTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">เลือกฟอนต์</label>
                    <select value={formData.heading2?.font || ''} onChange={(e) => updateField(['heading2', 'font'], e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#B87333]">
                      {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  {renderColorPicker('เลือกสีข้อความ', ['heading2', 'color'], formData.heading2?.color)}
                </div>

                {/* Description */}
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-4 items-start">
                  <div>
                    <label className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> คำอธิบายรายละเอียด</label>
                    <textarea value={formData.description?.text || ''} onChange={(e) => updateField(['description', 'text'], e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#B87333] min-h-[80px]" placeholder="พิมพ์คำอธิบาย..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">เลือกฟอนต์</label>
                    <select value={formData.description?.font || ''} onChange={(e) => updateField(['description', 'font'], e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#B87333]">
                      {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  {renderColorPicker('เลือกสีข้อความ', ['description', 'color'], formData.description?.color)}
                </div>

              </div>
            </div>

            {/* Section 3: Buttons */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                <Pointer className="w-5 h-5 text-[#B87333]" />
                <h2 className="text-base font-bold text-slate-800">ปุ่มกดดำเนินการ (Call to Action)</h2>
              </div>
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <div className="p-4 border border-slate-200 rounded-xl space-y-4">
                  <label className="text-sm font-semibold text-slate-800 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#B87333]"></span> ปุ่มหลัก (Primary)</label>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">ข้อความบนปุ่ม</label>
                    <input type="text" value={formData.primaryButton?.text || ''} onChange={(e) => updateField(['primaryButton', 'text'], e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#B87333]" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">ลิงก์ปลายทาง (URL)</label>
                    <input type="text" value={formData.primaryButton?.link || ''} onChange={(e) => updateField(['primaryButton', 'link'], e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#B87333]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    {renderColorPicker('สีพื้นหลังปุ่ม', ['primaryButton', 'bgColor'], formData.primaryButton?.bgColor)}
                    {renderColorPicker('สีตัวอักษร', ['primaryButton', 'textColor'], formData.primaryButton?.textColor)}
                  </div>
                </div>

                <div className="p-4 border border-slate-200 rounded-xl space-y-4 bg-slate-50">
                  <label className="text-sm font-semibold text-slate-800 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-400"></span> ปุ่มรอง (Secondary)</label>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">ข้อความบนปุ่ม</label>
                    <input type="text" value={formData.secondaryButton?.text || ''} onChange={(e) => updateField(['secondaryButton', 'text'], e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#B87333]" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">ลิงก์ปลายทาง (URL)</label>
                    <input type="text" value={formData.secondaryButton?.link || ''} onChange={(e) => updateField(['secondaryButton', 'link'], e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#B87333]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    {renderColorPicker('สีพื้นหลังปุ่ม', ['secondaryButton', 'bgColor'], formData.secondaryButton?.bgColor)}
                    {renderColorPicker('สีตัวอักษร', ['secondaryButton', 'textColor'], formData.secondaryButton?.textColor)}
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

        {/* Section 4: Image */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#B87333]" />
            <h2 className="text-base font-bold text-slate-800">
              {formData.layoutType === 'hero' ? 'รูปภาพประกอบด้านข้าง' : 'รูปภาพกราฟิกเต็มผืน (100%)'}
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-800 block">อัปโหลดรูปภาพ</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-[#B87333] transition-all">
                  <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs font-medium text-[#B87333]">คลิกเพื่อเลือกไฟล์</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, ['image'])} />
                </label>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-800 block mb-1">หรือระบุ URL รูปภาพ (URL/Base64)</label>
                  <input type="text" value={formData.image || ''} onChange={(e) => updateField(['image'], e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#B87333] text-sm" placeholder="https://..." />
                </div>
                {formData.image && (
                  <div className="relative inline-block border border-slate-200 rounded-lg overflow-hidden shadow-sm p-1">
                    <img src={formData.image} alt="Preview" className="h-24 w-auto object-cover rounded" />
                    <button onClick={() => updateField(['image'], '')} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow"><X className="w-3 h-3"/></button>
                  </div>
                )}
              </div>
            </div>
            
            {formData.layoutType === 'hero' && (
              <div>
                <label className="text-sm font-semibold text-slate-800 block mb-3">รูปภาพพรีเซ็ตแนะนำ (Preset Graphics)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {PRESET_BANNERS.map((preset, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => updateField(['image'], preset.url)}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${formData.image === preset.url ? 'border-[#B87333] shadow-md scale-105' : 'border-transparent hover:border-slate-300'}`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-16 object-cover" />
                      <div className="text-[10px] text-center p-1 bg-slate-100 font-medium text-slate-600">{preset.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5: Background */}
        {formData.layoutType === 'hero' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#B87333]" />
              <h2 className="text-base font-bold text-slate-800">ชุดสีและรูปภาพพื้นหลัง (Custom Background)</h2>
            </div>
            <div className="p-6 space-y-8">
              
              <div>
                <label className="text-sm font-semibold text-slate-800 block mb-3">1. ธีมสีสำเร็จรูป (Preset Palettes)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {PRESET_GRADIENTS.map((preset, idx) => {
                    const isSelected = JSON.stringify(formData.background?.stops) === JSON.stringify(preset.stops);
                    return (
                      <div 
                        key={idx}
                        onClick={() => updateField(['background', 'stops'], preset.stops)}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all h-16 relative flex items-end p-2 ${isSelected ? 'border-[#B87333] shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
                        style={{ background: `linear-gradient(${preset.direction}, ${preset.stops.map(s => s.color).join(', ')})` }}
                      >
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/90 text-slate-900 shadow-sm ${isSelected ? 'block' : 'hidden'}`}><Check className="w-3 h-3 inline mr-1"/>{preset.label}</span>
                        {!isSelected && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/70 text-slate-800">{preset.label}</span>}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-slate-800">2. กำหนดสีพื้นหลังเอง (Custom Gradient)</label>
                  <button 
                    onClick={() => {
                      const stops = [...(formData.background?.stops || [])];
                      if (stops.length < 8) {
                        stops.push({ color: '#ffffff' });
                        updateField(['background', 'stops'], stops);
                      }
                    }}
                    className="text-xs bg-[#0D1B3D] text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-1 disabled:opacity-50"
                    disabled={formData.background?.stops?.length >= 8}
                  >
                    <Plus className="w-3 h-3" /> เพิ่มสี ({formData.background?.stops?.length || 0}/8)
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {formData.background?.stops?.map((stop: any, index: number) => (
                    <div key={index} className="flex flex-col gap-2 p-3 bg-white border border-slate-200 rounded-lg relative group">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500">จุดสีที่ {index + 1}</span>
                        {formData.background?.stops?.length > 1 && (
                          <button onClick={() => {
                            const stops = [...formData.background.stops];
                            stops.splice(index, 1);
                            updateField(['background', 'stops'], stops);
                          }} className="text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="color" value={stop.color} onChange={(e) => {
                          const stops = [...formData.background.stops];
                          stops[index].color = e.target.value;
                          updateField(['background', 'stops'], stops);
                        }} className="w-8 h-8 rounded cursor-pointer border border-slate-200" />
                        <input type="text" value={stop.color} onChange={(e) => {
                          const stops = [...formData.background.stops];
                          stops[index].color = e.target.value;
                          updateField(['background', 'stops'], stops);
                        }} className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded outline-none focus:ring-1 focus:ring-[#B87333] uppercase" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">ทิศทางการไล่สี</label>
                    <select value={formData.background?.direction || '90deg'} onChange={(e) => updateField(['background', 'direction'], e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#B87333]">
                      <option value="90deg">ซ้ายไปขวา</option>
                      <option value="180deg">บนลงล่าง</option>
                      <option value="45deg">ทแยงมุม</option>
                      <option value="circle">วงกลมศูนย์กลาง</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">สีสำรอง (Fallback)</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={formData.background?.solidColor || '#ffffff'} onChange={(e) => updateField(['background', 'solidColor'], e.target.value)} className="w-8 h-8 rounded cursor-pointer border border-slate-200" />
                      <input type="text" value={formData.background?.solidColor || '#ffffff'} onChange={(e) => updateField(['background', 'solidColor'], e.target.value)} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none uppercase" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <label className="text-sm font-semibold text-slate-800 block mb-3">3. รูปภาพพื้นหลังเสริม (Pattern Overlay)</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input type="text" value={formData.background?.patternImage || ''} onChange={(e) => updateField(['background', 'patternImage'], e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#B87333] text-sm" placeholder="URL รูปภาพแพทเทิร์น..." />
                  </div>
                  <label className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors cursor-pointer inline-flex items-center gap-2 border border-slate-300">
                    <ImageIcon className="w-4 h-4"/> เลือกไฟล์
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, ['background', 'patternImage'])} />
                  </label>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-wrap gap-8 items-center">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">ลำดับการแสดงผล (Order)</label>
            <input type="number" value={formData.order || 0} onChange={(e) => updateField(['order'], parseInt(e.target.value))} className="w-32 px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#B87333]" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">สถานะการใช้งาน</label>
            <label className="relative inline-flex items-center cursor-pointer mt-2">
              <input type="checkbox" checked={formData.status === 'Active'} onChange={(e) => updateField(['status'], e.target.checked ? 'Active' : 'Inactive')} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#B87333]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B87333]"></div>
              <span className="ml-3 text-sm font-medium text-slate-700">{formData.status === 'Active' ? 'เปิดใช้งานแบนเนอร์นี้' : 'ปิดใช้งาน'}</span>
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
