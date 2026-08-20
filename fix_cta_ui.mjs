import fs from 'fs';

const content = fs.readFileSync('src/admin/settings/HeaderSettings.tsx', 'utf-8');

const targetSection = `        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              <input 
                type="checkbox" 
                checked={settings.header?.enableCTA ?? true} 
                onChange={(e) => handleHeaderChange('enableCTA', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-slate-700">Enable CTA Button</span>
            </label>

            {settings.header?.enableCTA !== false && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">Button Text</label>
                  <input type="text" value={settings.header?.ctaText || 'Contact Us'} onChange={(e) => handleHeaderChange('ctaText', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">Button Link</label>
                  <input type="text" value={settings.header?.ctaLink || '/contact'} onChange={(e) => handleHeaderChange('ctaLink', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Header Style</label>
            <select 
              value={settings.header?.style || 'Solid'} 
              onChange={(e) => handleHeaderChange('style', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Solid">Solid</option>
              <option value="Sticky">Sticky</option>
              <option value="Transparent">Transparent</option>
            </select>
          </div>
        </div>`;

const newSection = `        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </div>`;

if (content.includes(targetSection)) {
    fs.writeFileSync('src/admin/settings/HeaderSettings.tsx', content.replace(targetSection, newSection));
    console.log("Replaced CTA Section!");
} else {
    console.log("Target section not found");
}
