import fs from 'fs';

const content = fs.readFileSync('src/admin/settings/HeaderSettings.tsx', 'utf-8');

const targetPreview = `      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Header Preview</h2>
        <div className="border border-slate-200 rounded-lg overflow-x-auto bg-slate-50">
          <header className={\`w-full bg-background border-b border-border shadow-sm flex items-center justify-between px-6 py-4 min-w-[800px]\`}>
             <div className="flex items-center gap-3">
               {settings.header?.logoUrl ? (
                 <img src={settings.header.logoUrl} alt="Logo" className="h-8 object-contain" />
               ) : (
                 <div className="text-xl font-bold text-primary">LOGO</div>
               )}
             </div>
             <nav className="flex items-center gap-6">
               {(settings.header?.menu || []).filter((m: any) => m.active).map((item: any, idx: number) => (
                 <span key={idx} className="text-sm font-medium text-text hover:text-primary transition-colors cursor-pointer">{item.name}</span>
               ))}
             </nav>
             <div>
               {settings.header?.enableCTA !== false && (
                 <span className="px-4 py-2 bg-primary text-primary-text text-sm font-medium rounded-lg cursor-pointer" style={{ backgroundColor: 'var(--theme-primary, #0D1B3D)', color: 'var(--theme-button-text, #fff)' }}>
                   {settings.header?.ctaText || 'Contact Us'}
                 </span>
               )}
             </div>
          </header>
        </div>
      </div>`;

const newPreview = `      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Header Preview</h2>
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button onClick={() => setPreviewLang('th')} className={\`px-3 py-1 text-sm font-medium rounded-md transition-colors \${previewLang === 'th' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}\`}>TH</button>
            <button onClick={() => setPreviewLang('en')} className={\`px-3 py-1 text-sm font-medium rounded-md transition-colors \${previewLang === 'en' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}\`}>EN</button>
          </div>
        </div>
        <div className="border border-slate-200 rounded-lg overflow-x-auto bg-slate-50">
          <header className={\`w-full bg-background border-b border-border shadow-sm flex items-center justify-between px-6 py-4 min-w-[800px]\`}>
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
      <div className="flex justify-end pt-4">
        <button onClick={saveSettings} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> บันทึกการตั้งค่า Header
        </button>
      </div>`;

if (content.includes(targetPreview)) {
    fs.writeFileSync('src/admin/settings/HeaderSettings.tsx', content.replace(targetPreview, newPreview));
    console.log("Replaced Preview and Added Save Button!");
} else {
    console.log("Target preview section not found");
}
