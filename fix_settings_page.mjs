import fs from 'fs';
const content = fs.readFileSync('src/admin/settings/SettingsPage.tsx', 'utf-8');
const target = "{activeTab === 'footer' && <FooterSettings settings={settings} setSettings={setSettings} />}";
const replacement = "{activeTab === 'footer' && <FooterSettings settings={settings} setSettings={setSettings} saveSettings={saveSettings} />}";

if (content.includes(target)) {
  fs.writeFileSync('src/admin/settings/SettingsPage.tsx', content.replace(target, replacement));
  console.log("Updated SettingsPage.tsx");
} else {
  console.log("Target string not found in SettingsPage.tsx");
}
