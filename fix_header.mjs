import fs from 'fs';

const content = fs.readFileSync('src/admin/settings/HeaderSettings.tsx', 'utf-8');
const lines = content.split('\n');

const signatureRegex = /export function HeaderSettings\(\{ settings, setSettings \}: \{ settings: any, setSettings: any \}\) \{/;
const signatureIdx = lines.findIndex(line => signatureRegex.test(line));

if (signatureIdx !== -1) {
    lines[signatureIdx] = `export function HeaderSettings({ settings, setSettings, saveSettings }: { settings: any, setSettings: any, saveSettings: any }) {`;
    
    // add state for preview lang
    lines.splice(signatureIdx + 1, 0, `  const [previewLang, setPreviewLang] = useState<'th' | 'en'>('th');`);
}

// Add addCtaButton, updateCtaButton, removeCtaButton functions
const handleHeaderChangeIdx = lines.findIndex(line => line.includes('const handleHeaderChange ='));
if (handleHeaderChangeIdx !== -1) {
    const ctaFuncs = `
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
    current[index][field] = value;
    handleHeaderChange('ctaButtons', current);
  };

  const removeCtaButton = (index: number) => {
    const current = [...getCtaButtons()];
    current.splice(index, 1);
    handleHeaderChange('ctaButtons', current);
  };
`;
    lines.splice(handleHeaderChangeIdx, 0, ctaFuncs);
}

fs.writeFileSync('src/admin/settings/HeaderSettings.tsx', lines.join('\n'));
