import { Package, Users, FileText, ShoppingCart, DollarSign, TrendingUp, TrendingDown, Eye, Clock, Activity, ArrowRight, Download, Search, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const revenueData: any[] = [];

const visitorData: any[] = [];

const recentActivities: any[] = [];

export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [businessChecks, setBusinessChecks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(console.error);

    fetch('/api/videos')
      .then(res => res.json())
      .then(data => setVideos(Array.isArray(data) ? data : []))
      .catch(console.error);
      
    fetch('/api/members')
      .then(res => res.json())
      .then(data => setMembers(Array.isArray(data) ? data : []))
      .catch(console.error);
      
    fetch('/api/businessChecks')
      .then(res => res.json())
      .then(data => setBusinessChecks(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const totalArticles = blogs.length;
  const totalViews = blogs.reduce((acc, blog) => acc + (blog.views || 0), 0) + videos.reduce((acc, vid) => acc + (vid.views || 0), 0);

  const stats = [
    { title: 'แบบฟอร์มตรวจสอบธุรกิจ', value: businessChecks.length.toString(), change: '+100%', trend: 'up', icon: FileText, color: 'bg-emerald-500' },
    { title: t('admin.total_members'), value: members.length.toString(), change: '+12%', trend: 'up', icon: Users, color: 'bg-blue-500' },
    { title: 'วิดีโอทั้งหมด', value: videos.length.toString(), change: '0%', trend: 'up', icon: Video, color: 'bg-indigo-500' },
    { title: 'ยอดบทความทั้งหมด', value: totalArticles.toString(), change: '0%', trend: 'up', icon: FileText, color: 'bg-[#B87333]' },
  ];

  const exportToCSV = () => {
    const csvContent = [
      ['Title', 'Value', 'Change', 'Trend'],
      ...stats.map(s => [s.title, s.value, s.change, s.trend])
    ].map(e => e.join(",")).join("\n");
    
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' }); // Add BOM for excel support
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "dashboard_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('admin.enterprise_dashboard')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('admin.welcome_back')}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportToCSV} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> {t('admin.export_report')}
          </button>
          
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} text-white shadow-sm`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`flex items-center font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {stat.change}
              </span>
              <span className="text-slate-500 ml-2">{t('admin.vs_last_month')}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
        <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-sm">
          <p className="text-slate-500 text-xs font-medium">Published Videos</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{videos.filter(v => v.status === 'Published').length}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-sm">
          <p className="text-slate-500 text-xs font-medium">Draft Videos</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{videos.filter(v => v.status === 'Draft').length}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-sm">
          <p className="text-slate-500 text-xs font-medium">Unpublished</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{videos.filter(v => v.status === 'Unpublished').length}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-sm">
          <p className="text-slate-500 text-xs font-medium">YouTube Videos</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{videos.filter(v => v.sourceType === 'YouTube').length}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-sm">
          <p className="text-slate-500 text-xs font-medium">Uploaded Videos</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{videos.filter(v => v.sourceType === 'Upload').length}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-sm">
          <p className="text-slate-500 text-xs font-medium">Video Views</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{videos.reduce((a, b) => a + (b.views || 0), 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">{t('admin.revenue_overview')}</h2>
            <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#B87333]">
              <option>{t('admin.last_12_months')}</option>
              <option>{t('admin.this_year')}</option>
              <option>{t('admin.last_year')}</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D1B3D" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0D1B3D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0D1B3D', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="value" stroke="#0D1B3D" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visitors Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">{t('admin.visitors_7_days')}</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#B87333" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-500" />
              Recent Activity
            </h2>
            <button onClick={() => navigate("/admin/analytics")} className="text-sm font-medium text-[#B87333] hover:text-[#8a5626] flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-emerald-500' : 
                    activity.type === 'danger' ? 'bg-rose-500' : 
                    activity.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{activity.user} • {activity.details}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">{t('admin.quick_actions')}</h2>
          <div className="space-y-3">
            {[
              { label: t('admin.create_article'), icon: FileText, color: 'text-blue-600 bg-blue-50', link: '/admin/blogs/new' },
              { label: 'ดูรายการ Business Check', icon: FileText, color: 'text-emerald-600 bg-emerald-50', link: '/admin/business-checks' },
              { label: t('admin.add_member'), icon: Users, color: 'text-emerald-600 bg-emerald-50', link: '/admin/membership' },
              { label: t('admin.create_invoice'), icon: DollarSign, color: 'text-[#B87333] bg-[#B87333]/10', link: '/admin/financial' },
              { label: t('admin.manage_packages'), icon: Package, color: 'text-indigo-600 bg-indigo-50', link: '/admin/packages' },
            ].map((action, idx) => (
              <button key={idx} onClick={() => navigate((action as any).link || "/")} className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all text-left">
                <div className={`p-2 rounded-md ${action.color}`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-700">{action.label}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 ml-auto" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
