import { useState, useEffect } from 'react';
import { Mail, Search, Trash2, XCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function NewsletterList() {
  const { t } = useTranslation();
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/newsletters');
      if (res.ok) {
        const data = await res.json();
        setSubscribers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriber = async (id: string) => {
    try {
      const res = await fetch(`/api/newsletters/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSubscribers(subscribers.filter(s => s.id !== id));
        setConfirmDeleteId(null);
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
    }
  };

  const toggleStatus = async (subscriber: any) => {
    const newStatus = subscriber.status === 'Active' ? 'Unsubscribed' : 'Active';
    try {
      const res = await fetch(`/api/newsletters/${subscriber.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setSubscribers(subscribers.map(s => s.id === subscriber.id ? { ...s, status: newStatus } : s));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const exportCSV = () => {
    const headers = ['Email', 'Status', 'Subscribed At'];
    const csvData = subscribers.map(s => [
      s.email,
      s.status,
      new Date(s.subscribedAt).toLocaleString('th-TH')
    ]);
    const csvContent = [headers, ...csvData].map(e => e.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'newsletter_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubscribers = subscribers.filter(s => {
    const matchSearch = s.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.subscribedAt || 0).getTime() - new Date(a.subscribedAt || 0).getTime());

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">จัดการจดหมายข่าว (Newsletter Subscribers)</h1>
          <p className="text-slate-500 mt-1">จัดการรายชื่ออีเมลผู้สมัครรับข่าวสาร</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-[#0D1B3D] text-white px-4 py-2 rounded-lg hover:bg-[#0D1B3D]/90 transition-colors"
        >
          <Mail className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาอีเมล..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm font-medium text-slate-700">สถานะ:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent"
            >
              <option value="All">ทั้งหมด</option>
              <option value="Active">กำลังติดตาม (Active)</option>
              <option value="Unsubscribed">ยกเลิกติดตาม (Unsubscribed)</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium whitespace-nowrap">
              <tr>
                <th className="px-6 py-4">อีเมล (Email)</th>
                <th className="px-6 py-4">สถานะ (Status)</th>
                <th className="px-6 py-4">วันที่สมัคร (Subscribed At)</th>
                <th className="px-6 py-4 text-right">จัดการ (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span>กำลังโหลด...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-900">ไม่พบรายชื่ออีเมล</p>
                    <p>ยังไม่มีผู้สมัครรับข่าวสาร หรือไม่พบข้อมูลที่ค้นหา</p>
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{subscriber.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subscriber.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {subscriber.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleString('th-TH') : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {confirmDeleteId === subscriber.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-rose-500 font-medium">แน่ใจไหม?</span>
                          <button
                            onClick={() => deleteSubscriber(subscriber.id)}
                            className="px-3 py-1.5 text-sm bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors"
                          >
                            ลบ
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => toggleStatus(subscriber)} 
                            title={subscriber.status === 'Active' ? 'เปลี่ยนเป็นยกเลิกติดตาม' : 'เปลี่ยนเป็นกำลังติดตาม'}
                            className="p-2 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-amber-50 transition-colors"
                          >
                            {subscriber.status === 'Active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => setConfirmDeleteId(subscriber.id)} 
                            className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
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
