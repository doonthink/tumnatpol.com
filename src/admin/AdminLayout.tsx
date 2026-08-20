import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, FileEdit, Settings, LogOut, Globe, FolderTree, Users, DollarSign, BarChart, Bell, Package, Image as ImageIcon, MonitorPlay, Video, ChevronDown, ChevronRight, RefreshCw, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();

  const [siteSettings, setSiteSettings] = useState<any>(null);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data && data.general) {
        setSiteSettings(data.general);
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
      console.error('Error fetching settings in AdminLayout:', error);
    }
  };

  useEffect(() => {
    fetchSettings();

    const handleSettingsUpdated = () => {
      fetchSettings();
    };
    window.addEventListener('settingsUpdated', handleSettingsUpdated);
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdated);
    };
  }, []);

  const clearCache = () => {
    const keysToKeep = ['adminToken', 'i18nextLng'];
    const keptValues: Record<string, string> = {};
    keysToKeep.forEach(key => {
      const val = localStorage.getItem(key);
      if (val) keptValues[key] = val;
    });
    localStorage.clear();
    sessionStorage.clear();
    Object.keys(keptValues).forEach(key => {
      localStorage.setItem(key, keptValues[key]);
    });
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  
  const navigation = [
    { name: t('admin.dashboard'), href: '/admin', icon: LayoutDashboard },
    { name: 'แบนเนอร์', href: '/admin/banners', icon: MonitorPlay },
    { name: t('admin.pages'), href: '/admin/pages', icon: FileText },
    { name: t('admin.blogs'), href: '/admin/blogs', icon: FileEdit },
    { name: t('admin.categories'), href: '/admin/categories', icon: FolderTree },
    { name: 'บริการ (Services)', href: '/admin/services', icon: Briefcase },
    { name: 'หมวดหมู่บริการ', href: '/admin/service-categories', icon: FolderTree },
    { name: 'จดหมายข่าว (Newsletters)', href: '/admin/newsletters', icon: Bell },
    { name: 'วิดีโอ (Videos)', href: '/admin/videos', icon: Video, subItems: [
        { name: 'วิดีโอทั้งหมด', href: '/admin/videos' },
        { name: 'เพิ่มวิดีโอ', href: '/admin/videos/create' }
    ]},
    { name: 'หมวดหมู่วิดีโอ', href: '/admin/video-categories', icon: FolderTree },
    { name: t('admin.media'), href: '/admin/media', icon: ImageIcon },
    { name: t('admin.membership'), href: '/admin/membership', icon: Users },
    { name: 'ตรวจสอบธุรกิจ', href: '/admin/business-checks', icon: FileText },
    { name: t('admin.packages'), href: '/admin/packages', icon: Package },
    { name: t('admin.financial'), href: '/admin/financial', icon: DollarSign },
    { name: t('admin.analytics'), href: '/admin/analytics', icon: BarChart },
    { name: t('admin.settings'), href: '/admin/settings', icon: Settings },
  ];

  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleSubmenu = (name: string) => {
    setExpandedMenus(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'th' ? 'en' : 'th';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0D1B3D] text-white flex flex-col shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-white/10 shrink-0 overflow-hidden">
          <Link to="/admin" className="flex items-center gap-3 max-w-full">
            {siteSettings?.logoUrl ? (
              <img 
                src={siteSettings.logoUrl} 
                alt={siteSettings?.siteName || "Logo"} 
                className="max-h-12 max-w-[200px] object-contain"
              />
            ) : (
              <div className="font-bold text-xl tracking-tight">BIZ TOP TIER <span className="text-[#B87333] text-sm block tracking-widest font-normal uppercase">Enterprise CMS</span></div>
            )}
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[#B87333] text-white font-medium shadow-md shadow-[#B87333]/20' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/10 space-y-2 shrink-0">
          <Link to="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors">
            <Globe className="w-5 h-5" />
            {i18n.language === 'th' ? 'ดูเว็บไซต์' : 'View Site'}
          </Link>
          <button onClick={clearCache} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-colors">
            <RefreshCw className="w-5 h-5" />
            {i18n.language === 'th' ? 'เคลียร์ แคชข้อมูล' : 'Clear Cache'}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
            {t('admin.logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800">{t("admin.dashboard")}</h1>
            <span className="px-2 py-1 rounded bg-slate-100 text-xs font-semibold text-slate-500">v2.0 Enterprise</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
               <button onClick={() => alert("No new notifications")} className="relative p-2 text-slate-500 hover:text-[#0D1B3D] transition-colors rounded-full hover:bg-slate-50">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
               </button>
            </div>
            <div className="w-px h-6 bg-slate-200"></div>
            <button onClick={toggleLanguage} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200">
              <Globe size={16} />
              {i18n.language === 'th' ? 'EN' : 'TH'}
            </button>
            <div className="flex items-center gap-3">
              <Link to="/admin/profile" className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 overflow-hidden hover:ring-2 hover:ring-[#B87333] transition-all">
                <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover" />
              </Link>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-[#0D1B3D]">Super Admin</p>
                <p className="text-xs text-slate-500">admin@biztoptier.com</p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
