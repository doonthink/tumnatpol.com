import React from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw } from 'lucide-react';
import { useThemeSettings } from '../../contexts/ThemeContext';

export function ThemeSettings({ settings, setSettings }: { settings: any, setSettings: any }) {
  const { t } = useTranslation();
  
  const handleThemeChange = (field: string, value: any) => {
    setSettings((prev: any) => {
      const newSettings = {
        ...prev,
        theme: {
          ...prev.theme,
          [field]: value
        }
      };
      
      // Update preview by applying to document root temporarily
      const root = document.documentElement;
      const cssVarMap: Record<string, string> = {
        primaryColor: '--theme-primary',
        secondaryColor: '--theme-secondary',
        accentColor: '--theme-accent',
        backgroundColor: '--theme-background',
        textColor: '--theme-text',
        headingColor: '--theme-heading',
        buttonColor: '--theme-button',
        buttonTextColor: '--theme-button-text',
        linkColor: '--theme-link',
        borderColor: '--theme-border',
        bodyFont: '--font-body',
        headingFont: '--font-heading'
      };
      
      if (cssVarMap[field]) {
        root.style.setProperty(cssVarMap[field], field.includes('Font') ? `"${value}"` : value);
      }
      
      return newSettings;
    });
  };

  const fonts = [
    'Prompt',
    'Noto Sans Thai',
    'IBM Plex Sans Thai',
    'Kanit',
    'Sarabun',
    'Inter',
    'Roboto',
    'Anuphan'
  ];

  const colors = [
    { id: 'primaryColor', label: 'Primary Color' },
    { id: 'secondaryColor', label: 'Secondary Color' },
    { id: 'accentColor', label: 'Accent Color' },
    { id: 'backgroundColor', label: 'Background Color' },
    { id: 'headingColor', label: 'Heading Text Color' },
    { id: 'textColor', label: 'Body Text Color' },
    { id: 'buttonColor', label: 'Button Color' },
    { id: 'buttonTextColor', label: 'Button Text Color' },
    { id: 'linkColor', label: 'Link Color' },
    { id: 'borderColor', label: 'Border Color' },
  ];
  
  const defaultTheme = {
    primaryColor: '#0D1B3D',
    secondaryColor: '#1E3A8A',
    accentColor: '#B87333',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    headingColor: '#111827',
    buttonColor: '#0D1B3D',
    buttonTextColor: '#FFFFFF',
    linkColor: '#B87333',
    borderColor: '#E5E7EB',
    bodyFont: 'Noto Sans Thai',
    headingFont: 'Noto Sans Thai',
    fontWeight: '400'
  };

  const restoreDefault = () => {
    if (window.confirm('คุณต้องการคืนค่าการตั้งค่าเป็นค่าเริ่มต้นหรือไม่?\nการดำเนินการนี้จะคืนค่าข้อมูลที่ตั้งไว้กลับเป็นค่า Default')) {
      setSettings((prev: any) => ({
        ...prev,
        theme: defaultTheme
      }));
      // Apply default to root
      const root = document.documentElement;
      root.style.setProperty('--theme-primary', defaultTheme.primaryColor);
      root.style.setProperty('--theme-secondary', defaultTheme.secondaryColor);
      root.style.setProperty('--theme-accent', defaultTheme.accentColor);
      root.style.setProperty('--theme-background', defaultTheme.backgroundColor);
      root.style.setProperty('--theme-text', defaultTheme.textColor);
      root.style.setProperty('--theme-heading', defaultTheme.headingColor);
      root.style.setProperty('--theme-button', defaultTheme.buttonColor);
      root.style.setProperty('--theme-button-text', defaultTheme.buttonTextColor);
      root.style.setProperty('--theme-link', defaultTheme.linkColor);
      root.style.setProperty('--theme-border', defaultTheme.borderColor);
      root.style.setProperty('--font-body', `"${defaultTheme.bodyFont}"`);
      root.style.setProperty('--font-heading', `"${defaultTheme.headingFont}"`);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Settings Panel */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Website Theme Customizer</h2>
          <button onClick={restoreDefault} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
            <RotateCcw className="w-4 h-4" /> Restore Default
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Brand / CI Colors</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {colors.map((color) => (
              <div key={color.id} className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">{color.label}</label>
                <div className="flex gap-2">
                  <div className="relative w-10 h-10 rounded-lg border border-slate-300 overflow-hidden shrink-0 cursor-pointer shadow-sm">
                    <input 
                      type="color" 
                      value={settings.theme?.[color.id] || defaultTheme[color.id as keyof typeof defaultTheme]} 
                      onChange={(e) => handleThemeChange(color.id, e.target.value)}
                      className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                    />
                  </div>
                  <input 
                    type="text" 
                    value={settings.theme?.[color.id] || defaultTheme[color.id as keyof typeof defaultTheme]} 
                    onChange={(e) => handleThemeChange(color.id, e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary uppercase font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Typography</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Body Font</label>
              <select 
                value={settings.theme?.bodyFont || defaultTheme.bodyFont}
                onChange={(e) => handleThemeChange('bodyFont', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {fonts.map(font => <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Heading Font</label>
              <select 
                value={settings.theme?.headingFont || defaultTheme.headingFont}
                onChange={(e) => handleThemeChange('headingFont', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {fonts.map(font => <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="bg-slate-100 rounded-2xl p-4 xl:p-8 flex flex-col gap-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Live Preview</h3>
        
        {/* Preview Header */}
        <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--theme-background)', borderColor: 'var(--theme-border)' }}>
          <div className="flex items-center justify-between p-4 border-b border-border" style={{ borderColor: 'var(--theme-border)' }}>
            <div className="font-display font-bold text-lg" style={{ color: 'var(--theme-primary)', fontFamily: 'var(--font-heading)' }}>
              Logo
            </div>
            <div className="flex gap-4">
              <span className="font-sans text-sm font-medium" style={{ color: 'var(--theme-primary)', fontFamily: 'var(--font-body)' }}>Home</span>
              <span className="font-sans text-sm font-medium" style={{ color: 'var(--theme-text)', fontFamily: 'var(--font-body)' }}>About</span>
              <span className="font-sans text-sm font-medium" style={{ color: 'var(--theme-text)', fontFamily: 'var(--font-body)' }}>Services</span>
            </div>
          </div>
          
          {/* Preview Hero */}
          <div className="p-8 text-center bg-slate-50 flex flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold font-display" style={{ color: 'var(--theme-heading)', fontFamily: 'var(--font-heading)' }}>
              Welcome to our Website
            </h1>
            <p className="text-base font-sans max-w-md mx-auto" style={{ color: 'var(--theme-text)', fontFamily: 'var(--font-body)' }}>
              This is a live preview of how your theme colors and typography will look across the platform.
            </p>
            <div className="flex gap-4 mt-2">
              <button className="px-6 py-2.5 rounded-lg font-sans font-medium text-sm transition-opacity hover:opacity-90 shadow-sm" style={{ backgroundColor: 'var(--theme-button)', color: 'var(--theme-button-text)', fontFamily: 'var(--font-body)' }}>
                Primary Action
              </button>
              <button className="px-6 py-2.5 rounded-lg font-sans font-medium text-sm border bg-transparent hover:bg-slate-50 transition-colors shadow-sm" style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-text)', fontFamily: 'var(--font-body)' }}>
                Secondary
              </button>
            </div>
          </div>
          
          {/* Preview Cards */}
          <div className="p-6 grid grid-cols-2 gap-4 bg-background" style={{ backgroundColor: 'var(--theme-background)' }}>
            <div className="p-4 rounded-xl border shadow-sm flex flex-col gap-2" style={{ borderColor: 'var(--theme-border)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: 'var(--theme-secondary)' }}>1</div>
              <h4 className="font-display font-semibold" style={{ color: 'var(--theme-heading)', fontFamily: 'var(--font-heading)' }}>Feature One</h4>
              <p className="text-sm font-sans opacity-80" style={{ color: 'var(--theme-text)', fontFamily: 'var(--font-body)' }}>Short description goes here.</p>
              <span className="text-sm font-medium mt-1" style={{ color: 'var(--theme-link)' }}>Read more →</span>
            </div>
            <div className="p-4 rounded-xl border shadow-sm flex flex-col gap-2" style={{ borderColor: 'var(--theme-border)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: 'var(--theme-accent)' }}>2</div>
              <h4 className="font-display font-semibold" style={{ color: 'var(--theme-heading)', fontFamily: 'var(--font-heading)' }}>Feature Two</h4>
              <p className="text-sm font-sans opacity-80" style={{ color: 'var(--theme-text)', fontFamily: 'var(--font-body)' }}>Short description goes here.</p>
              <span className="text-sm font-medium mt-1" style={{ color: 'var(--theme-link)' }}>Read more →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}