import fs from 'fs';

const content = fs.readFileSync('src/admin/settings/FooterSettings.tsx', 'utf-8');

const newContent = `import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, Plus, MoveUp, MoveDown, Trash2, Save, Mail, Phone, MapPin, ChevronRight, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const AVAILABLE_ICONS = ['ChevronRight', 'Mail', 'Phone', 'MapPin', 'Facebook', 'Instagram', 'Youtube', 'Twitter', 'Globe', 'Briefcase', 'MessageSquare'];

export function FooterSettings({ settings, setSettings, saveSettings }: { settings: any, setSettings: any, saveSettings?: any }) {
  const { t } = useTranslation();
  const [previewLang, setPreviewLang] = useState<'th' | 'en'>('th');

  const handleFooterChange = (field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      footer: {
        ...prev.footer,
        [field]: value
      }
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFooterChange('logoUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addColumn = () => {
    const current = settings.footer?.columns || [];
    handleFooterChange('columns', [...current, { title: 'หมวดหมู่ใหม่', titleEn: 'New Column', links: [] }]);
  };

  const removeColumn = (index: number) => {
    const current = [...(settings.footer?.columns || [])];
    current.splice(index, 1);
    handleFooterChange('columns', current);
  };

  const updateColumn = (index: number, field: string, value: any) => {
    const current = [...(settings.footer?.columns || [])];
    current[index][field] = value;
    handleFooterChange('columns', current);
  };

  const addLink = (colIndex: number) => {
    const current = [...(settings.footer?.columns || [])];
    if (!current[colIndex].links) current[colIndex].links = [];
    current[colIndex].links.push({ text: 'ลิงก์ใหม่', textEn: 'New Link', url: '/', icon: 'ChevronRight' });
    handleFooterChange('columns', current);
  };

  const removeLink = (colIndex: number, linkIndex: number) => {
    const current = [...(settings.footer?.columns || [])];
    current[colIndex].links.splice(linkIndex, 1);
    handleFooterChange('columns', current);
  };

  const updateLink = (colIndex: number, linkIndex: number, field: string, value: any) => {
    const current = [...(settings.footer?.columns || [])];
    current[colIndex].links[linkIndex][field] = value;
    handleFooterChange('columns', current);
  };

  const IconComponent = ({ name, className }: { name: string, className?: string }) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.ChevronRight;
    return <Icon className={className} />;
  };

  const columns = settings.footer?.columns || [];
  const bgColor = settings.footer?.bgColor || '#0D1B3D';
  const textColor = settings.footer?.textColor || '#FFFFFF';

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Footer Style & Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Background Color</label>
            <div className="flex gap-2">
              <input type="color" value={bgColor} onChange={e => handleFooterChange('bgColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
              <input type="text" value={bgColor} onChange={e => handleFooterChange('bgColor', e.target.value)} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary uppercase" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Text Color</label>
            <div className="flex gap-2">
              <input type="color" value={textColor} onChange={e => handleFooterChange('textColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
              <input type="text" value={textColor} onChange={e => handleFooterChange('textColor', e.target.value)} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary uppercase" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">Company Information & Logo</h2>
          <p className="text-sm text-slate-500 mt-1">ตั้งค่าโลโก้และคำอธิบายบริษัท (รองรับ 2 ภาษา)</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Footer Logo URL (or Upload)</label>
            <div className="flex gap-4 items-start">
              <div className="flex-1 space-y-2">
                <input type="text" value={settings.footer?.logoUrl || ''} onChange={e => handleFooterChange('logoUrl', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://..." />
                <div className="relative">
                  <input type="file" className="hidden" id="footer-logo-upload" accept="image/*" onChange={handleLogoUpload} />
                  <label htmlFor="footer-logo-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors text-sm font-medium">
                    <Upload className="w-4 h-4" /> Upload New Logo
                  </label>
                </div>
              </div>
              {settings.footer?.logoUrl && (
                <div className="relative p-4 border border-slate-200 rounded-lg flex items-center justify-center min-w-[120px]" style={{ backgroundColor: bgColor }}>
                  <img src={settings.footer.logoUrl} alt="Logo Preview" className="h-10 object-contain" />
                  <button onClick={() => handleFooterChange('logoUrl', '')} className="absolute -top-2 -right-2 bg-rose-100 text-rose-600 p-1 rounded-full hover:bg-rose-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Description (TH)</label>
              <textarea value={settings.footer?.description || ''} onChange={e => handleFooterChange('description', e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Description (EN)</label>
              <textarea value={settings.footer?.descriptionEn || ''} onChange={e => handleFooterChange('descriptionEn', e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Footer Columns (Links & Icons)</h2>
          <button onClick={addColumn} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Column
          </button>
        </div>
        
        <div className="space-y-6">
          {columns.map((col: any, colIdx: number) => (
            <div key={colIdx} className="border border-slate-200 rounded-lg p-4 bg-slate-50 relative">
              <button onClick={() => removeColumn(colIdx)} className="absolute top-4 right-4 text-rose-500 hover:bg-rose-100 p-1.5 rounded transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-10">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Column Title (TH)</label>
                  <input type="text" value={col.title || ''} onChange={e => updateColumn(colIdx, 'title', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Column Title (EN)</label>
                  <input type="text" value={col.titleEn || ''} onChange={e => updateColumn(colIdx, 'titleEn', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>

              <div className="space-y-3 pl-4 border-l-2 border-slate-200">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Links in this column</h4>
                {(col.links || []).map((link: any, linkIdx: number) => (
                  <div key={linkIdx} className="flex flex-wrap items-center gap-2 bg-white p-2 rounded border border-slate-200">
                    <select value={link.icon || 'ChevronRight'} onChange={e => updateLink(colIdx, linkIdx, 'icon', e.target.value)} className="w-12 px-1 py-1.5 text-sm border border-slate-300 rounded focus:outline-none">
                      {AVAILABLE_ICONS.map(icon => (
                        <option key={icon} value={icon}>{icon.substring(0, 3)}</option>
                      ))}
                    </select>
                    <input type="text" value={link.text || ''} onChange={e => updateLink(colIdx, linkIdx, 'text', e.target.value)} placeholder="Text (TH)" className="w-32 px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                    <input type="text" value={link.textEn || ''} onChange={e => updateLink(colIdx, linkIdx, 'textEn', e.target.value)} placeholder="Text (EN)" className="w-32 px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                    <input type="text" value={link.url || ''} onChange={e => updateLink(colIdx, linkIdx, 'url', e.target.value)} placeholder="URL (/path or https://)" className="flex-1 min-w-[150px] px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                    <button onClick={() => removeLink(colIdx, linkIdx)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button onClick={() => addLink(colIdx)} className="flex items-center gap-1 px-2 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors text-xs font-medium mt-2">
                  <Plus className="w-3 h-3" /> Add Link
                </button>
              </div>
            </div>
          ))}
          {columns.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 text-sm">
              ยังไม่มีคอลัมน์ใน Footer คลิกที่ปุ่ม Add Column เพื่อเพิ่ม
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Copyright</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Copyright (TH)</label>
            <input type="text" value={settings.footer?.copyright || '© 2026 Business Toptier สงวนลิขสิทธิ์'} onChange={e => handleFooterChange('copyright', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Copyright (EN)</label>
            <input type="text" value={settings.footer?.copyrightEn || '© 2026 Business Toptier. All Rights Reserved.'} onChange={e => handleFooterChange('copyrightEn', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Footer Preview</h2>
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button onClick={() => setPreviewLang('th')} className={\`px-3 py-1 text-sm font-medium rounded-md transition-colors \${previewLang === 'th' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}\`}>TH</button>
            <button onClick={() => setPreviewLang('en')} className={\`px-3 py-1 text-sm font-medium rounded-md transition-colors \${previewLang === 'en' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}\`}>EN</button>
          </div>
        </div>

        <div className="p-8 rounded-xl shadow-sm text-white space-y-6 transition-colors" style={{ backgroundColor: bgColor, color: textColor }}>
          <div className="flex flex-col md:flex-row gap-12 border-b border-current pb-8" style={{ borderColor: 'color-mix(in srgb, currentcolor 20%, transparent)' }}>
            <div className="max-w-xs space-y-4">
              {settings.footer?.logoUrl ? (
                <img src={settings.footer.logoUrl} alt="Logo" className="h-10 object-contain" />
              ) : (
                <div className="text-2xl font-bold">LOGO</div>
              )}
              <p className="text-sm opacity-80 leading-relaxed whitespace-pre-wrap">
                {previewLang === 'en' && settings.footer?.descriptionEn ? settings.footer.descriptionEn : (settings.footer?.description || 'Company description')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1">
              {columns.map((col: any, colIdx: number) => (
                <div key={colIdx} className="space-y-4">
                  <h4 className="font-semibold">{previewLang === 'en' && col.titleEn ? col.titleEn : col.title}</h4>
                  <ul className="space-y-2 text-sm opacity-80">
                    {(col.links || []).map((link: any, linkIdx: number) => (
                      <li key={linkIdx}>
                        <a href={link.url || '#'} className="flex items-start gap-2 hover:opacity-100 transition-opacity">
                          <IconComponent name={link.icon || 'ChevronRight'} className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{previewLang === 'en' && link.textEn ? link.textEn : link.text}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-60">
            <p>{previewLang === 'en' && settings.footer?.copyrightEn ? settings.footer.copyrightEn : (settings.footer?.copyright || '© 2026 Company')}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button onClick={saveSettings} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2">
          <Save className="w-4 h-4" /> บันทึกการตั้งค่า Footer
        </button>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/admin/settings/FooterSettings.tsx', newContent);
console.log("Updated FooterSettings.tsx");
