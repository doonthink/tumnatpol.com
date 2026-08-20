import fs from 'fs';

let content = `import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, FileEdit, Settings, LogOut, Globe, FolderTree } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AdminLayout() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  
  const navigation = [
    { name: t('admin.dashboard'), href: '/admin', icon: LayoutDashboard },
    { name: t('admin.pages'), href: '/admin/pages', icon: FileText },
    { name: t('admin.blogs'), href: '/admin/blogs', icon: FileEdit },
    { name: t('admin.categories'), href: '/admin/categories', icon: FolderTree },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'th' ? 'en' : 'th';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0D1B3D] text-white flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <div className="font-bold text-xl tracking-tight">BIZ TOP TIER <span className="text-[#B87333] text-sm block tracking-widest font-normal uppercase">Admin Panel</span></div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={\`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors \${
                  isActive 
                    ? 'bg-[#B87333] text-white font-medium shadow-md shadow-[#B87333]/20' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }\`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors">
            <Globe className="w-5 h-5" />
            View Site
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
            {t('admin.logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-bold text-slate-800">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <button onClick={toggleLanguage} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors">
              <Globe size={16} />
              {i18n.language === 'th' ? 'EN' : 'TH'}
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">A</div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
`;
fs.writeFileSync('src/admin/AdminLayout.tsx', content);
