import { useState, useEffect } from 'react';
import { Save, Globe, Layout, AppWindow, Palette, Mail, Shield, Database, Key, CheckCircle, Clock, Users, Download, Upload, FileArchive, Trash2, RefreshCw, AlertTriangle, Check, FileText } from 'lucide-react';
import { StaffSettings } from './StaffSettings';
import { HeaderSettings } from './HeaderSettings';
import { FooterSettings } from './FooterSettings';
import { ThemeSettings } from './ThemeSettings';
import { PageContentSettings } from './PageContentSettings';
import { useTranslation } from 'react-i18next';
import { useThemeSettings } from '../../contexts/ThemeContext';

export function SettingsPage() {
  const { refreshSettings } = useThemeSettings();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>({
    general: {
      siteName: 'BIZ TOP TIER',
      logoUrl: '',
      faviconUrl: '',
      bannerRotationTime: '5',
      defaultLanguage: 'Thai (TH)',
      timezone: 'Asia/Bangkok (GMT+7)',
      currency: 'THB (฿)'
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data && data.general) {
          setSettings((prev: any) => ({
            ...prev,
            ...data
          }));
          if (data.general.siteName) {
            document.title = data.general.siteName;
          }
          if (data.general.faviconUrl) {
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
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const [isLogoSelected, setIsLogoSelected] = useState(false);
  const [isFaviconSelected, setIsFaviconSelected] = useState(false);
  const [backups, setBackups] = useState<any[]>([]);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [latestBackupResult, setLatestBackupResult] = useState<any>(null);

  const formatBackupDate = (item: any) => {
    if (item.createdAt) {
      try {
        const d = new Date(item.createdAt);
        if (!isNaN(d.getTime())) {
          const pad = (n: number) => String(n).padStart(2, '0');
          let y = d.getFullYear();
          if (y > 2500) y -= 543;
          return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${y}`;
        }
      } catch (e) {}
    }
    if (item.date) {
      let rawDate = item.date.includes(' ') ? item.date.split(' ')[0] : item.date;
      const parts = rawDate.split('/');
      if (parts.length === 3) {
        let y = parseInt(parts[2], 10);
        if (y > 2500) y -= 543;
        return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${y}`;
      }
      return rawDate;
    }
    return '-';
  };

  const formatBackupTime = (item: any) => {
    if (item.createdAt) {
      try {
        const d = new Date(item.createdAt);
        if (!isNaN(d.getTime())) {
          const pad = (n: number) => String(n).padStart(2, '0');
          return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        }
      } catch (e) {}
    }
    if (item.time) {
      const parts = item.time.split(':');
      if (parts.length === 2) {
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00`;
      }
      if (parts.length === 3) {
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:${parts[2].padStart(2, '0')}`;
      }
      return item.time;
    }
    if (item.date && item.date.includes(' ')) {
      const timePart = item.date.split(' ')[1];
      if (timePart) {
        const parts = timePart.split(':');
        if (parts.length === 2) return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00`;
        if (parts.length === 3) return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:${parts[2].padStart(2, '0')}`;
        return timePart;
      }
    }
    return '-';
  };

  const [logsList, setLogsList] = useState<any[]>([]);

  const fetchBackups = async () => {
    try {
      const res = await fetch('/api/backups', {
        headers: { 'x-admin-role': 'admin' }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const sorted = [...data].sort((a: any, b: any) => {
          const tA = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id) || 0;
          const tB = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id) || 0;
          return tB - tA;
        });
        setBackups(sorted);
      }
    } catch (error) {
      console.error('Error fetching backups:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      if (Array.isArray(data)) {
        setLogsList(data);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'backup') {
      fetchBackups();
    } else if (activeTab === 'logs') {
      fetchLogs();
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: 'Super Admin (admin)',
          action: 'เข้าชมบันทึกกิจกรรม (Activity Logs)',
          module: 'Activity Logs'
        })
      }).then(() => fetchLogs()).catch(() => {});
    }
  }, [activeTab]);

  const handleDownloadLogsCSV = () => {
    window.open('/api/logs/export-csv', '_blank');
    setTimeout(() => {
      fetchLogs();
    }, 1000);
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    try {
      const res = await fetch('/api/backups/create', { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-role': 'admin'
        }
      });
      const data = await res.json();
      if (data.success && data.backup) {
        setLatestBackupResult(data.backup);
        fetchBackups();
      } else {
        alert('เกิดข้อผิดพลาดในการสร้างสำรองข้อมูล: ' + (data.error || ''));
      }
    } catch (error: any) {
      console.error('Error creating backup:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleDeleteBackup = async (id: string, filename: string) => {
    if (!confirm(`คุณต้องการลบไฟล์สำรองข้อมูล "${filename}" หรือไม่?`)) return;
    try {
      const res = await fetch(`/api/backups/${id}`, { 
        method: 'DELETE',
        headers: { 'x-admin-role': 'admin' }
      });
      const data = await res.json();
      if (data.success) {
        if (latestBackupResult?.id === id) {
          setLatestBackupResult(null);
        }
        fetchBackups();
      }
    } catch (error) {
      console.error('Error deleting backup:', error);
    }
  };

  const handleDownloadBackup = (filename: string) => {
    window.open(`/api/backups/download/${filename}`, '_blank');
  };

  const handleRestoreBackup = async (filename: string) => {
    if (!confirm(`คุณต้องการกู้คืนข้อมูลเว็บไซต์จากไฟล์ "${filename}" หรือไม่?\nการกู้คืนจะเขียนทับข้อมูลทั้งหมดในระบบปัจจุบัน`)) return;
    try {
      const res = await fetch('/api/backups/restore', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-role': 'admin'
        },
        body: JSON.stringify({ filename })
      });
      const data = await res.json();
      if (data.success) {
        alert(`กู้คืนข้อมูลสำเร็จเรียบร้อยแล้ว!\n${data.message || ''}`);
        window.location.reload();
      } else {
        alert('กู้คืนข้อมูลไม่สำเร็จ: ' + (data.error || ''));
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      alert('เกิดข้อผิดพลาดในการกู้คืนข้อมูล');
    }
  };

  const handleUploadRestore = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!confirm(`คุณต้องการกู้คืนข้อมูลเว็บไซต์จากไฟล์อัปโหลด "${file.name}" หรือไม่?\nการกู้คืนจะเขียนทับข้อมูลทั้งหมดในระบบปัจจุบัน`)) {
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const fileData = reader.result as string;
        const res = await fetch('/api/backups/restore', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-admin-role': 'admin'
          },
          body: JSON.stringify({ fileData, filename: file.name })
        });
        const data = await res.json();
        if (data.success) {
          alert(`กู้คืนข้อมูลสำเร็จเรียบร้อยแล้ว!\n${data.message || ''}`);
          window.location.reload();
        } else {
          alert('กู้คืนข้อมูลไม่สำเร็จ: ' + (data.error || ''));
        }
      } catch (err: any) {
        alert('ไฟล์สำรองข้อมูลไม่ถูกต้อง: ' + err.message);
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGeneralChange = (e: any) => {
    const { name, value } = e.target;
    setSettings((prev: any) => ({
      ...prev,
      general: {
        ...prev.general,
        [name]: value
      }
    }));
  };

  const handleSecurityChange = (e: any) => {
    const { name, checked } = e.target;
    setSettings((prev: any) => ({
      ...prev,
      security: {
        ...prev.security,
        [name]: checked
      }
    }));
  };

  const handleEmailChange = (e: any) => {
    const { name, value } = e.target;
    setSettings((prev: any) => ({
      ...prev,
      email: {
        ...prev.email,
        [name]: value
      }
    }));
  };

  const handleApiChange = (e: any) => {
    const { name, value } = e.target;
    setSettings((prev: any) => ({
      ...prev,
      api: {
        ...prev.api,
        [name]: value
      }
    }));
  };

  const handleLogoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings((prev: any) => ({
        ...prev,
        general: {
          ...prev.general,
          logoUrl: reader.result as string
        }
      }));
      setIsLogoSelected(true);
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings((prev: any) => ({
        ...prev,
        general: {
          ...prev.general,
          faviconUrl: reader.result as string
        }
      }));
      setIsFaviconSelected(true);
    };
    reader.readAsDataURL(file);
  };

  const saveSettings = async () => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (settings.general?.siteName) {
        document.title = settings.general.siteName;
      }
      if (settings.general?.faviconUrl) {
        let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = settings.general.faviconUrl;
      }

      window.dispatchEvent(new Event('settingsUpdated'));
      refreshSettings();
      setIsLogoSelected(false);
      setIsFaviconSelected(false);
      if (settings.general?.defaultLanguage) {
        i18n.changeLanguage(settings.general.defaultLanguage === 'English (EN)' ? 'en' : 'th');
      }
      alert('บันทึกการตั้งค่าเรียบร้อยแล้ว!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า');
    }
  };


  const tabs = [
    { id: 'general', label: t('admin.general'), icon: Globe },
    { id: 'header', label: 'Header', icon: Layout },
    { id: 'footer', label: 'Footer', icon: AppWindow },
    { id: 'theme', label: 'Website Theme', icon: Palette },
    { id: 'pageContent', label: 'จัดการหน้าวีดีโอ', icon: FileText },
    { id: 'email', label: t('admin.email_smtp'), icon: Mail },
    { id: 'security', label: t('admin.security'), icon: Shield },
    { id: 'api', label: t('admin.api_integration'), icon: Key },
    { id: 'backup', label: t('admin.backup_restore'), icon: Database },
    { id: 'logs', label: t('admin.activity_logs'), icon: Clock },
    { id: 'staff', label: 'พนักงานและสิทธิ์', icon: Users },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("admin.system_settings")}</h1>
          <p className="text-sm text-slate-500 mt-1">{t("admin.settings_desc")}</p>
        </div>
        {activeTab !== 'backup' && activeTab !== 'logs' && activeTab !== 'staff' && (
          <button onClick={saveSettings} className="px-4 py-2 bg-[#0D1B3D] text-white rounded-lg text-sm font-medium hover:bg-[#0a152e] transition-colors shadow-md flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-slate-100 text-[#0D1B3D]' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#B87333]' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            
            
            {activeTab === 'header' && <HeaderSettings settings={settings} setSettings={setSettings} saveSettings={saveSettings} />}
            {activeTab === 'footer' && <FooterSettings settings={settings} setSettings={setSettings} saveSettings={saveSettings} />}
            {activeTab === 'theme' && <ThemeSettings settings={settings} setSettings={setSettings} />}
            {activeTab === 'pageContent' && <PageContentSettings settings={settings} setSettings={setSettings} onSave={saveSettings} />}
            {activeTab === 'general' && (
              <div className="p-6 space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">{t("admin.general_settings")}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Website Logo */}
                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                      <label className="block text-sm font-bold text-slate-800 mb-1">โลโก้เว็บไซต์ (Website Logo) ระบบ Admin</label>
                      <p className="text-xs text-slate-500 mb-3">แสดงที่แถบเมนูด้านซ้ายและส่วนหัวของระบบแทนข้อความ BIZ TOP TIER Enterprise CMS</p>
                      <div className="flex items-center gap-4">
                        {settings.general?.logoUrl ? (
                          <img src={settings.general.logoUrl} alt="Website Logo Preview" className="h-16 max-w-[180px] object-contain bg-white rounded-lg p-2 border border-slate-200 shadow-sm" />
                        ) : (
                          <div className="h-16 w-36 bg-white flex items-center justify-center text-slate-400 rounded-lg border border-slate-200 text-xs font-medium">ไม่มีโลโก้</div>
                        )}
                        {isLogoSelected ? (
                          <button
                            type="button"
                            onClick={saveSettings}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" /> บันทึก
                          </button>
                        ) : (
                          <label className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer shadow-sm">
                            อัปโหลดโลโก้
                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Favicon Logo */}
                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                      <label className="block text-sm font-bold text-slate-800 mb-1">โลโก้ Favicon (Favicon Logo)</label>
                      <p className="text-xs text-slate-500 mb-3">คำอธิบาย: แนะนำให้ใช้รูปภาพขนาด 90x90 px สำหรับแสดงเป็นไอคอนเบราว์เซอร์</p>
                      <div className="flex items-center gap-4">
                        {settings.general?.faviconUrl ? (
                          <img src={settings.general.faviconUrl} alt="Favicon Preview" className="h-16 w-16 object-contain bg-white rounded-lg p-2 border border-slate-200 shadow-sm" />
                        ) : (
                          <div className="h-16 w-16 bg-white flex items-center justify-center text-slate-400 rounded-lg border border-slate-200 text-xs font-medium text-center">ไม่มี<br/>Favicon</div>
                        )}
                        <div>
                          {isFaviconSelected ? (
                            <button
                              type="button"
                              onClick={saveSettings}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm flex items-center gap-2"
                            >
                              <Save className="w-4 h-4" /> บันทึก
                            </button>
                          ) : (
                            <label className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer shadow-sm inline-block">
                              อัปโหลด Favicon
                              <input type="file" className="hidden" accept="image/*" onChange={handleFaviconUpload} />
                            </label>
                          )}
                          <p className="text-xs text-slate-500 mt-2">คำอธิบาย: ใช้รูปภาพขนาด 90x90 px</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-800 mb-1">{t("admin.website_name")} (Site Title)</label>
                    <p className="text-xs text-slate-500 mb-2">ข้อความชื่อเว็บไซต์นี้จะแสดงที่ Title bar ของ Application หรือเครื่องมือที่เปิด</p>
                    <input 
                      type="text" 
                      name="siteName" 
                      value={settings.general?.siteName || ''} 
                      onChange={handleGeneralChange} 
                      placeholder="เช่น BIZ TOP TIER Enterprise CMS"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent bg-white text-slate-900" 
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">{t("admin.localization")}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.default_language")}</label>
                      <select name="defaultLanguage" value={settings.general?.defaultLanguage || ''} onChange={handleGeneralChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent bg-white">
                        <option>Thai (TH)</option>
                        <option>English (EN)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.timezone")}</label>
                      <select name="timezone" value={settings.general?.timezone || ''} onChange={handleGeneralChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent bg-white">
                        <option>Asia/Bangkok (GMT+7)</option>
                        <option>UTC</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.currency")}</label>
                      <select name="currency" value={settings.general?.currency || ''} onChange={handleGeneralChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent bg-white">
                        <option>THB (฿)</option>
                        <option>USD ($)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

            )}

            {activeTab === 'security' && (
              <div className="p-6 space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">{t("admin.security_policies")}</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900">{t("admin.two_factor")}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{t("admin.two_factor_desc")}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="twoFactor" checked={settings.security?.twoFactor ?? true} onChange={handleSecurityChange} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900">{t("admin.strong_password")}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{t("admin.strong_password_desc")}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="strongPassword" checked={settings.security?.strongPassword ?? true} onChange={handleSecurityChange} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            
            {activeTab === 'staff' && (
              <div className="p-6">
                 <StaffSettings />
              </div>
            )}
            {/* Other tabs placeholder */}
                        {activeTab === 'email' && (
              <div className="p-6 space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">ตั้งค่า Email (SMTP)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Host</label>
                      <input type="text" name="smtpHost" value={settings.email?.smtpHost || ''} onChange={handleEmailChange} placeholder="smtp.gmail.com" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Port</label>
                      <input type="text" name="smtpPort" value={settings.email?.smtpPort || ''} onChange={handleEmailChange} placeholder="587" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Username</label>
                      <input type="text" name="smtpUser" value={settings.email?.smtpUser || ''} onChange={handleEmailChange} placeholder="admin@domain.com" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Password</label>
                      <input type="password" name="smtpPass" value={settings.email?.smtpPass || ''} onChange={handleEmailChange} placeholder="********" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Sender Email</label>
                      <input type="email" name="senderEmail" value={settings.email?.senderEmail || ''} onChange={handleEmailChange} placeholder="noreply@domain.com" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Sender Name</label>
                      <input type="text" name="senderName" value={settings.email?.senderName || ''} onChange={handleEmailChange} placeholder="BIZ TOP TIER System" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">Test Connection</button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'api' && (
              <div className="p-6 space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">ตั้งค่าการเชื่อมต่อ API ภายนอก</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Google Analytics Measurement ID</label>
                      <input type="text" name="gaId" value={settings.api?.gaId || ''} onChange={handleApiChange} placeholder="G-ABC123XYZ0" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                      <p className="text-xs text-slate-500 mt-1">ตัวอย่าง: G-XXXXXXX</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Facebook Pixel ID</label>
                      <input type="text" name="fbPixel" value={settings.api?.fbPixel || ''} onChange={handleApiChange} placeholder="123456789012345" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">LINE Messaging API Channel Access Token</label>
                      <input type="password" name="lineToken" value={settings.api?.lineToken || ''} onChange={handleApiChange} placeholder="************************" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Stripe Public Key</label>
                      <input type="text" name="stripePub" value={settings.api?.stripePub || ''} onChange={handleApiChange} placeholder="pk_test_..." className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Stripe Secret Key</label>
                      <input type="password" name="stripeSec" value={settings.api?.stripeSec || ''} onChange={handleApiChange} placeholder="sk_test_..." className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'backup' && (
              <div className="p-6 space-y-8">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <FileArchive className="w-5 h-5 text-[#B87333]" /> สำรองและกู้คืนข้อมูล (Website Backup & Restore)
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      สร้างไฟล์สำรองข้อมูลเว็บไซต์ (.zip) ทั้งระบบ รวมถึง Source Code, Database, Uploaded Files และ Configuration
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer shadow-sm flex items-center gap-2">
                      <Upload className="w-4 h-4 text-slate-500" /> อัปโหลดไฟล์ Restore (.zip / .json)
                      <input type="file" accept=".zip,.json" className="hidden" onChange={handleUploadRestore} />
                    </label>
                    <button 
                      onClick={handleCreateBackup}
                      disabled={isCreatingBackup}
                      className="px-5 py-2.5 bg-[#B87333] text-white rounded-lg text-sm font-bold hover:bg-[#9e632c] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      <Database className="w-4 h-4" /> 
                      {isCreatingBackup ? 'กำลังสร้างไฟล์ Backup (.zip)...' : 'Backup เว็บไซต์'}
                    </button>
                  </div>
                </div>

                {/* Latest Backup Success Result Banner */}
                {latestBackupResult && (
                  <div className="p-5 border border-emerald-200 bg-emerald-50/60 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-sm animate-fadeIn">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span>สำรองข้อมูลเว็บไซต์สำเร็จ!</span>
                      </div>
                      <p className="text-xs text-emerald-700">
                        ไฟล์ถูกบันทึกเรียบร้อย: <strong className="font-mono bg-white/80 px-2 py-0.5 rounded border border-emerald-200">{latestBackupResult.filename}</strong>
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                        <span>🕒 {latestBackupResult.date} {latestBackupResult.time}</span>
                        <span>📦 ขนาด: {latestBackupResult.size}</span>
                        <span>📂 รูปแบบ: Zip Package (Source, Database, Uploads, Config)</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadBackup(latestBackupResult.filename)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm shadow-sm transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Download Backup
                    </button>
                  </div>
                )}

                {/* Backup Folder Structure Hint */}
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/60 text-xs text-slate-600 space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#B87333]" />
                    <span>ข้อมูลที่ถูกรวมอยู่ในไฟล์ Backup (.zip)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 pt-1 font-mono text-[11px]">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="font-bold text-[#0D1B3D] block">📁 source-code/</span>
                      <span className="text-slate-500 text-[10px]">Source code & entry points</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="font-bold text-[#0D1B3D] block">📁 database/</span>
                      <span className="text-slate-500 text-[10px]">ทุก Collection JSON Data</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="font-bold text-[#0D1B3D] block">📁 uploads/</span>
                      <span className="text-slate-500 text-[10px]">ไฟล์รูปภาพ/เอกสารอัปโหลด</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="font-bold text-[#0D1B3D] block">📁 config/</span>
                      <span className="text-slate-500 text-[10px]">package.json & templates</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="font-bold text-[#0D1B3D] block">📁 documentation/</span>
                      <span className="text-slate-500 text-[10px]">Manifest & Instructions</span>
                    </div>
                  </div>
                </div>

                {/* Backup History Table */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500" /> ประวัติการ Backup (Backup History)
                    </h3>
                    <button 
                      onClick={fetchBackups} 
                      className="text-xs text-slate-500 hover:text-[#B87333] flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> รีเฟรชรายการ
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
                    <table className="w-full text-left text-sm text-slate-600 min-w-[700px]">
                      <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3.5">วันที่ (Date)</th>
                          <th className="px-6 py-3.5">เวลา (Time)</th>
                          <th className="px-6 py-3.5">ชื่อไฟล์ (Filename)</th>
                          <th className="px-6 py-3.5">ขนาด (Size)</th>
                          <th className="px-6 py-3.5">สถานะ (Status)</th>
                          <th className="px-6 py-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {backups.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                              ยังไม่มีประวัติไฟล์สำรองข้อมูล กดปุ่ม <strong className="text-[#B87333]">"Backup เว็บไซต์"</strong> ด้านบนเพื่อสร้างไฟล์สำรองข้อมูลแรก
                            </td>
                          </tr>
                        ) : (
                          backups.map((item: any) => (
                            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800">{formatBackupDate(item)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-mono text-xs">{formatBackupTime(item)}</td>
                              <td className="px-6 py-4 font-mono text-xs font-semibold text-[#0D1B3D]">{item.filename}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-slate-600">{item.size}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                                  <Check className="w-3 h-3" /> {item.status || 'สำเร็จ'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right whitespace-nowrap">
                                <button 
                                  onClick={() => handleDownloadBackup(item.filename)}
                                  className="px-3.5 py-1.5 bg-[#B87333] hover:bg-[#9e632c] text-white rounded-lg font-bold text-xs transition-colors inline-flex items-center gap-1.5 shadow-sm"
                                  title="ดาวน์โหลดไฟล์ Backup"
                                >
                                  <Download className="w-3.5 h-3.5" /> Download
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'logs' && (
              <div className="p-6 space-y-8">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#B87333]" /> บันทึกกิจกรรม (Activity Logs)
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      ระบบบันทึกประวัติการเข้าใช้งาน และการทำรายการสำคัญในระบบแบบเรียลไทม์
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={fetchLogs} 
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> รีเฟรช
                    </button>
                    <button 
                      onClick={handleDownloadLogsCSV}
                      className="px-4 py-2 bg-[#B87333] hover:bg-[#9e632c] text-white rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> ดาวน์โหลดบันทึก (CSV)
                    </button>
                  </div>
                </div>
                
                <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
                  <table className="w-full text-left text-sm text-slate-600 min-w-[650px]">
                    <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3.5">วันที่ / เวลา</th>
                        <th className="px-6 py-3.5">ผู้ใช้</th>
                        <th className="px-6 py-3.5">การกระทำ (Action)</th>
                        <th className="px-6 py-3.5">โมดูล</th>
                        <th className="px-6 py-3.5">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {logsList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                            ยังไม่มีบันทึกกิจกรรมในระบบ
                          </td>
                        </tr>
                      ) : (
                        logsList.map((log: any) => (
                          <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-bold text-slate-800">
                              {log.datetime || `${log.date || ''} ${log.time || ''}`}
                            </td>
                            <td className="px-6 py-4 font-medium text-[#0D1B3D]">
                              {log.user || 'Super Admin (admin)'}
                            </td>
                            <td className={`px-6 py-4 font-semibold ${log.action?.includes('สำเร็จ') ? 'text-emerald-700' : log.action?.includes('ไม่สำเร็จ') ? 'text-rose-600' : 'text-slate-800'}`}>
                              {log.action}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium border border-slate-200">
                                {log.module || 'System'}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-slate-500">
                              {log.ip || '171.97.102.45'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab !== 'backup' && activeTab !== 'logs' && activeTab !== 'staff' && (
              <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end mt-auto shrink-0 rounded-b-xl">
                <button onClick={saveSettings} className="px-6 py-2.5 bg-[#0D1B3D] text-white rounded-lg text-sm font-bold hover:bg-[#0a152e] transition-colors shadow-md flex items-center gap-2">
                  <Save className="w-4 h-4" /> {i18n.language === 'th' ? 'บันทึกการตั้งค่าทั้งหมด' : 'Save All Settings'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
