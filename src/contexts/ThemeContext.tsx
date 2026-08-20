import React, { createContext, useContext, useEffect, useState } from 'react';

type Settings = any;

interface ThemeContextType {
  settings: Settings;
  refreshSettings: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    general: {
      siteName: 'BIZ TOP TIER',
      logoUrl: '',
      faviconUrl: '',
    },
    header: {
      logoUrl: '',
      enableCTA: true,
      ctaText: 'ติดต่อเรา',
      ctaLink: '/contact',
      style: 'Solid',
      menu: []
    },
    footer: {
      companyName: 'BIZ Top Tier',
      description: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      logoUrl: '',
      copyright: '© 2026 Business Toptier. All Rights Reserved.',
      columns: [],
      socialMedia: []
    },
    theme: {
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
    }
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data) {
        setSettings((prev: any) => ({
          ...prev,
          ...data
        }));
        applyTheme(data.theme);
        
        if (data.general?.siteName) {
          document.title = data.general.siteName;
        }
        if (data.general?.faviconUrl) {
          let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
          }
          link.href = data.general.faviconUrl;
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const applyTheme = (themeData: any) => {
    if (!themeData) return;
    const root = document.documentElement;
    if (themeData.primaryColor) root.style.setProperty('--theme-primary', themeData.primaryColor);
    if (themeData.secondaryColor) root.style.setProperty('--theme-secondary', themeData.secondaryColor);
    if (themeData.accentColor) root.style.setProperty('--theme-accent', themeData.accentColor);
    if (themeData.backgroundColor) root.style.setProperty('--theme-background', themeData.backgroundColor);
    if (themeData.textColor) root.style.setProperty('--theme-text', themeData.textColor);
    if (themeData.headingColor) root.style.setProperty('--theme-heading', themeData.headingColor);
    if (themeData.buttonColor) root.style.setProperty('--theme-button', themeData.buttonColor);
    if (themeData.buttonTextColor) root.style.setProperty('--theme-button-text', themeData.buttonTextColor);
    if (themeData.linkColor) root.style.setProperty('--theme-link', themeData.linkColor);
    if (themeData.borderColor) root.style.setProperty('--theme-border', themeData.borderColor);
    
    if (themeData.bodyFont) root.style.setProperty('--font-body', `"${themeData.bodyFont}"`);
    if (themeData.headingFont) root.style.setProperty('--font-heading', `"${themeData.headingFont}"`);
    
    // For primary/accent dark variants, we can slightly darken the color or just use the same for simplicity
    // A better approach is color manipulation, but for now we'll just set them directly if provided, or default
    root.style.setProperty('--theme-primary-dark', themeData.primaryColor);
    root.style.setProperty('--theme-accent-dark', themeData.accentColor);
  };

  useEffect(() => {
    fetchSettings();
    const handleSettingsUpdated = () => fetchSettings();
    window.addEventListener('settingsUpdated', handleSettingsUpdated);
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdated);
  }, []);

  return (
    <ThemeContext.Provider value={{ settings, refreshSettings: fetchSettings }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeSettings() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeSettings must be used within a ThemeProvider');
  }
  return context;
}