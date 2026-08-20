import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, TrendingUp, Download, Calendar, Activity, ArrowUpRight, ArrowDownRight, Plus, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function FinancialDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    try {
      const [checksRes, membersRes, packagesRes] = await Promise.all([
        fetch('/api/businessChecks'),
        fetch('/api/members'),
        fetch('/api/packages')
      ]);
      
      const checksData = await checksRes.json();
      const membersData = await membersRes.json();
      const packagesData = await packagesRes.json();

      const checks = Array.isArray(checksData) ? checksData : [];
      const members = Array.isArray(membersData) ? membersData : [];
      const packages = Array.isArray(packagesData) ? packagesData : [];

      const financeData = checks.map(check => {
        const member = members.find((m: any) => m.id === check.member_id);
        const pkg = packages.find((p: any) => p.id === member?.packageId);
        
        return {
          id: check.id,
          customer: check.memberName || member?.name || (member?.firstName ? `${member.firstName} ${member.lastName}` : check.companyName),
          package: pkg?.name || member?.package || 'N/A',
          amount: pkg?.price || 0,
          status: check.paymentStatus || 'Pending',
          date: check.createdAt
        };
      });

      setRecentOrders(financeData);
    } catch (err) {
      console.error(err);
      setRecentOrders([]);
    }
  };

  // Dynamic calculations
  const parseAmount = (amt: any) => {
    if (typeof amt === 'number') return amt;
    if (typeof amt === 'string') return parseFloat(amt.replace(/[^0-9.-]+/g, '')) || 0;
    return 0;
  };

  const totalPaid = recentOrders
    .filter(o => o.status === 'Paid')
    .reduce((sum, o) => sum + parseAmount(o.amount), 0);

  const pendingOrders = recentOrders.filter(o => o.status === 'Pending');
  const pendingAmount = pendingOrders.reduce((sum, o) => sum + parseAmount(o.amount), 0);

  const refundOrders = recentOrders.filter(o => o.status === 'Cancelled' || o.status === 'Refunded');
  const refundAmount = refundOrders.reduce((sum, o) => sum + parseAmount(o.amount), 0);

  const mrr = totalPaid > 0 ? Math.round(totalPaid / (recentOrders.length || 1)) : 0;

  // Real Monthly breakdown calculation
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyDataMap = new Map();
  
  recentOrders.forEach(o => {
    if (o.status === 'Paid') {
      const d = new Date(o.date);
      if (!isNaN(d.getTime())) {
        const month = months[d.getMonth()];
        monthlyDataMap.set(month, (monthlyDataMap.get(month) || 0) + parseAmount(o.amount));
      }
    }
  });

  const monthlyRevenue = months.map(m => ({
    name: m,
    revenue: monthlyDataMap.get(m) || 0
  })).slice(0, new Date().getMonth() + 1); // Show up to current month

  if (monthlyRevenue.length === 0) {
    monthlyRevenue.push({ name: months[new Date().getMonth()], revenue: 0 });
  }

  // Real Package distribution calculation
  const packageMap: Record<string, number> = {};
  recentOrders.filter(o => o.status === 'Paid').forEach(o => {
    const pkgName = o.package || 'Other';
    packageMap[pkgName] = (packageMap[pkgName] || 0) + parseAmount(o.amount);
  });

  const colors = ['#3b82f6', '#10b981', '#B87333', '#8b5cf6', '#ec4899'];
  const packageSales = Object.keys(packageMap).length > 0 
    ? Object.keys(packageMap).map((key, i) => ({
        name: key,
        value: packageMap[key],
        color: colors[i % colors.length]
      }))
    : [
        { name: 'Basic', value: 0, color: '#94a3b8' },
        { name: 'Premium', value: 0, color: '#3b82f6' },
        { name: 'Enterprise', value: 0, color: '#B87333' },
      ];

  const handleExport = () => {
    if (recentOrders.length === 0) {
      alert('ไม่มีข้อมูลให้ Export');
      return;
    }
    
    const headers = ['Invoice ID', 'Customer', 'Package', 'Date', 'Status', 'Amount'];
    const rows = recentOrders.map(o => [
      o.id,
      `"${(o.customer || '').replace(/"/g, '""')}"`,
      `"${(o.package || '').replace(/"/g, '""')}"`,
      o.date,
      o.status,
      parseAmount(o.amount)
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + headers.join(',') + "\n"
      + rows.map(e => e.join(',')).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `financial_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("admin.financial_overview")}</h1>
          <p className="text-sm text-slate-500 mt-1">{t("admin.financial_desc")}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{t("admin.total_revenue_ytd")}</p>
              <h3 className="text-3xl font-bold text-slate-900">฿{totalPaid.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 shadow-sm">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-500">{recentOrders.filter(o => o.status === 'Paid').length} รายการที่ชำระแล้ว</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{t("admin.mrr")}</p>
              <h3 className="text-3xl font-bold text-slate-900">฿{mrr.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600 shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-500">รายได้เฉลี่ยต่อรายการ</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{t("admin.pending_payments")}</p>
              <h3 className="text-3xl font-bold text-slate-900">฿{pendingAmount.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 text-amber-600 shadow-sm">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-500">{pendingOrders.length} {t("admin.invoices_awaiting")}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{t("admin.refunds")}</p>
              <h3 className="text-3xl font-bold text-slate-900">฿{refundAmount.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-lg bg-rose-50 text-rose-600 shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-500">{refundOrders.length} รายการคืนเงิน</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">{t("admin.revenue_trend")}</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} 
                  tickFormatter={(val) => `฿${val}`}
                />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`฿${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMonthly)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">{t("admin.package_sales_dist")}</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={packageSales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {packageSales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">{t("admin.recent_orders")}</h2>
          <span className="text-xs text-slate-500">จำนวนทั้งหมด {recentOrders.length} รายการ</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">{t("admin.invoice_id")}</th>
                <th className="px-6 py-4 font-medium">{t("admin.customer")}</th>
                <th className="px-6 py-4 font-medium">{t("admin.package")}</th>
                <th className="px-6 py-4 font-medium">{t("admin.date")}</th>
                <th className="px-6 py-4 font-medium">{t("admin.status")}</th>
                <th className="px-6 py-4 font-medium text-right">{t("admin.amount")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    ไม่พบข้อมูลรายการสั่งซื้อในระบบ (พร้อมสำหรับการใช้งานจริง)
                  </td>
                </tr>
              ) : (
                recentOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#0D1B3D]">{order.id}</td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4">{order.package}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(order.date).toLocaleDateString('th-TH')}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 
                        order.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {order.status === 'Paid' ? 'ชำระแล้ว' : order.status === 'Pending' ? 'ยังไม่ชำระ' : 'ยกเลิก'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">฿{order.amount}</td>
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

