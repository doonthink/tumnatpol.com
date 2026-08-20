import { Eye, Users, Clock, MousePointerClick, TrendingUp, TrendingDown, Calendar, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0D1B3D', '#3b82f6', '#B87333'];

const initialTrafficData = [
  { name: 'Mon', views: 0, visitors: 0 },
  { name: 'Tue', views: 0, visitors: 0 },
  { name: 'Wed', views: 0, visitors: 0 },
  { name: 'Thu', views: 0, visitors: 0 },
  { name: 'Fri', views: 0, visitors: 0 },
  { name: 'Sat', views: 0, visitors: 0 },
  { name: 'Sun', views: 0, visitors: 0 },
];

const initialDeviceData = [
  { name: 'Desktop', value: 0 },
  { name: 'Mobile', value: 0 },
  { name: 'Tablet', value: 0 },
];

export function AnalyticsDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [resAnalytics, resBlogs, resPages] = await Promise.all([
        fetch('/api/analytics').then(r => r.json()).catch(() => null),
        fetch('/api/blogs').then(r => r.json()).catch(() => []),
        fetch('/api/pages').then(r => r.json()).catch(() => [])
      ]);

      if (resAnalytics && !Array.isArray(resAnalytics) && Object.keys(resAnalytics).length > 0) {
        setAnalyticsData(resAnalytics);
      } else {
        setAnalyticsData(null);
      }
      setBlogs(Array.isArray(resBlogs) ? resBlogs : []);
      setPages(Array.isArray(resPages) ? resPages : []);
    } catch (err) {
      console.error(err);
    }
  };

  // Dynamic calculations from actual blogs & pages
  const blogViews = blogs.reduce((acc, blog) => acc + (Number(blog.views) || 0), 0);
  const pageViews = pages.reduce((acc, page) => acc + (Number(page.views) || 0), 0);
  const realTotalViews = (analyticsData?.totalViews || 0) + blogViews + pageViews;

  const realVisitors = analyticsData?.uniqueVisitors || 0;
  const realAvgSession = analyticsData?.avgSession || '00:00';
  const realBounceRate = analyticsData?.bounceRate || '0%';

  const trafficData = analyticsData?.trafficData || initialTrafficData;
  const deviceData = analyticsData?.deviceData || initialDeviceData;

  // Build top pages from real pages & blogs if available
  const realTopPages: any[] = analyticsData?.topPages && analyticsData.topPages.length > 0
    ? analyticsData.topPages
    : [
        ...pages.map(p => ({
          path: p.slug ? `/${p.slug}` : `/${p.title || p.name || 'page'}`,
          views: p.views || 0,
          bounce: '0%',
          time: '00:00'
        })),
        ...blogs.map(b => ({
          path: `/blog/${b.id || b.title}`,
          views: b.views || 0,
          bounce: '0%',
          time: '00:00'
        }))
      ].filter(p => p.views > 0);

  const stats = [
    { title: t('admin.total_page_views'), value: realTotalViews.toLocaleString(), change: '0%', trend: 'up', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: t('admin.unique_visitors'), value: realVisitors.toLocaleString(), change: '0%', trend: 'up', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: t('admin.avg_session'), value: realAvgSession, change: '0%', trend: 'up', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: t('admin.bounce_rate'), value: realBounceRate, change: '0%', trend: 'up', icon: MousePointerClick, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("admin.traffic_analytics")}</h1>
          <p className="text-sm text-slate-500 mt-1">{t("admin.traffic_desc")}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => alert("Calendar Filter")} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Last 7 Days
          </button>
          <button onClick={() => alert("Exporting report...")} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Report
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
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} shadow-sm`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="flex items-center font-medium text-slate-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                {stat.change}
              </span>
              <span className="text-slate-400 ml-2">{t("admin.vs_previous")}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Overview Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">{t("admin.traffic_overview")}</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D1B3D" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0D1B3D" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="views" name={t("admin.total_page_views")} stroke="#0D1B3D" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="visitors" name={t("admin.unique_visitors")} stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">{t("admin.sessions_device")}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {deviceData.map((device: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="text-sm text-slate-600">{device.name}</span>
                </div>
                <span className="text-sm font-medium text-slate-900">{device.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">{t("admin.top_pages")}</h2>
          <button onClick={() => navigate("/admin/pages")} className="text-sm font-medium text-[#B87333] hover:text-[#8a5626]">{t("admin.view_all")}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">{t("admin.page_path")}</th>
                <th className="px-6 py-4 font-medium text-right">{t("admin.total_page_views")}</th>
                <th className="px-6 py-4 font-medium text-right">{t("admin.bounce_rate")}</th>
                <th className="px-6 py-4 font-medium text-right">{t("admin.time_on_page")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {realTopPages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    ไม่พบข้อมูลการเข้าชม (พร้อมสำหรับการใช้งานจริง)
                  </td>
                </tr>
              ) : (
                realTopPages.map((page, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#0D1B3D]">{page.path}</td>
                    <td className="px-6 py-4 text-right">{page.views}</td>
                    <td className="px-6 py-4 text-right">{page.bounce}</td>
                    <td className="px-6 py-4 text-right text-slate-500">{page.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
