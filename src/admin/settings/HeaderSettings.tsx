import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, Plus, MoveUp, MoveDown, Trash2 } from 'lucide-react';

export function HeaderSettings({ settings, setSettings, saveSettings }: { settings: any, setSettings: any, saveSettings: any }) {
  const [previewLang, setPreviewLang] = useState<'th' | 'en'>('th');
  const { t } = useTranslation();
  

  const getCtaButtons = () => {
    if (settings.header?.ctaButtons) return settings.header.ctaButtons;
    if (settings.header?.enableCTA !== false) {
      return [{
        text: settings.header?.ctaText || 'ติดต่อเรา',
        textEn: 'Contact Us',
        link: settings.header?.ctaLink || '/contact',
        bgColor: settings.theme?.buttonColor || '#0D1B3D',
        textColor: settings.theme?.buttonTextColor || '#FFFFFF'
      }];
    }
    return [];
  };

  const addCtaButton = () => {
    const current = getCtaButtons();
    if (current.length >= 2) return;
    const newButtons = [...current, { text: 'ปุ่มใหม่', textEn: 'New Button', link: '/', bgColor: settings.theme?.buttonColor || '#0D1B3D', textColor: settings.theme?.buttonTextColor || '#FFFFFF' }];
    handleHeaderChange('ctaButtons', newButtons);
    handleHeaderChange('enableCTA', true); // ensure backward compat logic
  };

  const updateCtaButton = (index: number, field: string, value: any) => {
    const current = [...getCtaButtons()];
    current[index] = { ...current[index], [field]: value };
    handleHeaderChange('ctaButtons', current);
  };

  const removeCtaButton = (index: number) => {
    const current = [...getCtaButtons()];
    current.splice(index, 1);
    handleHeaderChange('ctaButtons', current);
  };

  const handleHeaderChange = (field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      header: {
        ...prev.header,
        [field]: value
      }
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleHeaderChange('logoUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addMenuItem = () => {
    const newMenu = [...(settings.header?.menu || []), { name: 'เมนูใหม่', nameEn: 'New Menu', url: '/', openNewTab: false, active: true }];
    handleHeaderChange('menu', newMenu);
  };

  const updateMenuItem = (index: number, field: string, value: any) => {
    const newMenu = [...(settings.header?.menu || [])];
    newMenu[index] = { ...newMenu[index], [field]: value };
    handleHeaderChange('menu', newMenu);
  };

  const removeMenuItem = (index: number) => {
    const newMenu = [...(settings.header?.menu || [])];
    newMenu.splice(index, 1);
    handleHeaderChange('menu', newMenu);
  };

  const moveMenuItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === (settings.header?.menu || []).length - 1) return;
    const newMenu = [...(settings.header?.menu || [])];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newMenu[index];
    newMenu[index] = newMenu[swapIndex];
    newMenu[swapIndex] = temp;
    handleHeaderChange('menu', newMenu);
  };

  const loadDefaultMenu = () => {
    if (window.confirm('คุณต้องการโหลดเมนูจากหน้าบ้านมาแทนที่เมนูปัจจุบันหรือไม่?')) {
      const defaultMenu = [
        { name: t('home') || 'หน้าแรก', nameEn: 'Home', url: '/', openNewTab: false, active: true },
        { name: t('about') || 'เกี่ยวกับเรา', nameEn: 'About Us', url: '/about', openNewTab: false, active: true },
        { name: t('service') || 'บริการ', nameEn: 'Services', url: '/service', openNewTab: false, active: true },
        { name: t('blog') || 'บทความ', nameEn: 'Blog', url: '/blog', openNewTab: false, active: true },
        { name: t('contact') || 'ติดต่อเรา', nameEn: 'Contact Us', url: '/contact', openNewTab: false, active: true }
      ];
      handleHeaderChange('menu', defaultMenu);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">Header Logo</h2>
          <p className="text-sm text-slate-500 mt-1">เป็น logo หน้า Frontend มุมซ้ายบน</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Logo URL (or Upload)</label>
            <div className="flex gap-4 items-start">
              <div className="flex-1 space-y-2">
                <input 
                  type="text" 
                  value={settings.header?.logoUrl || ''} 
                  onChange={(e) => handleHeaderChange('logoUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://..."
                />
                <div className="relative">
                  <input type="file" className="hidden" id="header-logo-upload" accept="image/*" onChange={handleLogoUpload} />
                  <label htmlFor="header-logo-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors text-sm font-medium">
                    <Upload className="w-4 h-4" /> Upload New Logo
                  </label>
                </div>
              </div>
              {settings.header?.logoUrl && (
                <div className="relative p-4 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-center min-w-[150px]">
                  <img src={settings.header.logoUrl} alt="Logo Preview" className="h-10 object-contain" />
                  <button onClick={() => handleHeaderChange('logoUrl', '')} className="absolute -top-2 -right-2 bg-rose-100 text-rose-600 p-1 rounded-full hover:bg-rose-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Navigation Menu</h2>
          <div className="flex items-center gap-3">
            <button onClick={loadDefaultMenu} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
              ดึงข้อมูลจากหน้าบ้าน
            </button>
            <button onClick={addMenuItem} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium">
              <Plus className="w-4 h-4" /> Add Menu Item
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {(settings.header?.menu || []).map((item: any, idx: number) => (
            <div key={idx} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveMenuItem(idx, 'up')} disabled={idx === 0} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"><MoveUp className="w-3 h-3" /></button>
                <button onClick={() => moveMenuItem(idx, 'down')} disabled={idx === (settings.header?.menu || []).length - 1} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"><MoveDown className="w-3 h-3" /></button>
              </div>
              <div className="grid grid-cols-12 gap-3 flex-1">
                <div className="col-span-3">
                  <input type="text" value={item.name || ''} onChange={e => updateMenuItem(idx, 'name', e.target.value)} placeholder="ชื่อเมนู (TH)" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div className="col-span-3">
                  <input type="text" value={item.nameEn || ''} onChange={e => updateMenuItem(idx, 'nameEn', e.target.value)} placeholder="Menu Name (EN)" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div className="col-span-3">
                  <input type="text" value={item.url || ''} onChange={e => updateMenuItem(idx, 'url', e.target.value)} placeholder="/url" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div className="col-span-3 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={item.openNewTab} onChange={e => updateMenuItem(idx, 'openNewTab', e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
                    Open in New Tab
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={item.active} onChange={e => updateMenuItem(idx, 'active', e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
                    Active
                  </label>
                </div>
              </div>
              <button onClick={() => removeMenuItem(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {(!settings.header?.menu || settings.header.menu.length === 0) && (
            <p className="text-sm text-slate-500 text-center py-4">No menu items added.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Header CTA Button & Style (รองรับ 2 ภาษา)</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.header?.enableCTA ?? true} 
                  onChange={(e) => handleHeaderChange('enableCTA', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-slate-700">Enable CTA Buttons</span>
              </label>
              {(settings.header?.enableCTA !== false && getCtaButtons().length < 2) && (
                <button onClick={addCtaButton} className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium">
                  <Plus className="w-4 h-4" /> Add Button
                </button>
              )}
            </div>

            {settings.header?.enableCTA !== false && (
              <div className="space-y-4">
                {getCtaButtons().map((btn: any, idx: number) => (
                  <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative">
                    <button onClick={() => removeCtaButton(idx)} className="absolute top-2 right-2 text-rose-500 hover:bg-rose-100 p-1 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-3 mb-3 pr-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Text (TH)</label>
                        <input type="text" value={btn.text || ''} onChange={(e) => updateCtaButton(idx, 'text', e.target.value)} className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Text (EN)</label>
                        <input type="text" value={btn.textEn || ''} onChange={(e) => updateCtaButton(idx, 'textEn', e.target.value)} className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-800 mb-1">Link URL</label>
                        <input type="text" value={btn.link || ''} onChange={(e) => updateCtaButton(idx, 'link', e.target.value)} className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Background Color</label>
                        <div className="flex gap-2">
                          <input type="color" value={btn.bgColor || '#0D1B3D'} onChange={(e) => updateCtaButton(idx, 'bgColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                          <input type="text" value={btn.bgColor || '#0D1B3D'} onChange={(e) => updateCtaButton(idx, 'bgColor', e.target.value)} className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Text Color</label>
                        <div className="flex gap-2">
                          <input type="color" value={btn.textColor || '#FFFFFF'} onChange={(e) => updateCtaButton(idx, 'textColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                          <input type="text" value={btn.textColor || '#FFFFFF'} onChange={(e) => updateCtaButton(idx, 'textColor', e.target.value)} className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Header Style</label>
            <select 
              value={settings.header?.style || 'Solid'} 
              onChange={(e) => handleHeaderChange('style', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Solid">Solid</option>
              <option value="Sticky">Sticky</option>
              <option value="Transparent">Transparent</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Header Preview</h2>
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button onClick={() => setPreviewLang('th')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${previewLang === 'th' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}>TH</button>
            <button onClick={() => setPreviewLang('en')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${previewLang === 'en' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}>EN</button>
          </div>
        </div>
        <div className="border border-slate-200 rounded-lg overflow-x-auto bg-slate-50">
          <header className={`w-full bg-background border-b border-border shadow-sm flex items-center justify-between px-6 py-4 min-w-[800px]`}>
             <div className="flex items-center gap-3">
               {settings.header?.logoUrl ? (
                 <img src={settings.header.logoUrl} alt="Logo" className="h-8 object-contain" />
               ) : (
                 <div className="text-xl font-bold text-primary">LOGO</div>
               )}
             </div>
             <nav className="flex items-center gap-6">
               {(settings.header?.menu || []).filter((m: any) => m.active).map((item: any, idx: number) => (
                 <span key={idx} className="text-sm font-medium text-text hover:text-primary transition-colors cursor-pointer">
                   {previewLang === 'en' && item.nameEn ? item.nameEn : item.name}
                 </span>
               ))}
             </nav>
             <div className="flex items-center gap-3">
               {settings.header?.enableCTA !== false && getCtaButtons().map((btn: any, idx: number) => (
                 <span key={idx} className="px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-opacity hover:opacity-90" style={{ backgroundColor: btn.bgColor || '#0D1B3D', color: btn.textColor || '#fff' }}>
                   {previewLang === 'en' && btn.textEn ? btn.textEn : btn.text}
                 </span>
               ))}
             </div>
          </header>
        </div>
      </div>
    </div>
  );
}