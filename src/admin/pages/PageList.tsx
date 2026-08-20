import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, MoreVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function PageList() {
  const { t } = useTranslation();
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/pages');
      const data = await res.json();
      setPages(data.filter((page: any) => page.slug !== 'service'));
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (id: string) => {
    try {
      await fetch(`/api/pages/${id}`, { method: 'DELETE' });
      setPages(pages.filter(page => page.id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("admin.page_management")}</h1>
          <p className="text-slate-500 mt-1">{t("admin.page_desc")}</p>
        </div>
        <Link 
          to="/admin/pages/new" 
          className="flex items-center gap-2 bg-[#0D1B3D] text-white px-4 py-2 rounded-lg hover:bg-[#0D1B3D]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          สร้างเพจใหม่ (Create Page)
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อเพจ หรือ URL Slug..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent"
            />
          </div>
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
            <tr>
              <th className="px-6 py-4">{t("admin.title_label")}</th>
              <th className="px-6 py-4">{t("admin.slug_label")}</th>
              <th className="px-6 py-4">{t("admin.status_label")}</th>
              <th className="px-6 py-4">{t("admin.last_updated_label")}</th>
              <th className="px-6 py-4 text-right">{t("admin.actions_label")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-slate-500">{t("admin.loading")}</td>
              </tr>
            ) : pages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-slate-500">{t("admin.no_data")}</td>
              </tr>
            ) : (
              pages.map((page) => (
                <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{page.title}</td>
                  <td className="px-6 py-4 text-slate-500">{page.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      page.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {page.status || 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {page.lastUpdated ? new Date(page.lastUpdated).toLocaleString('th-TH') : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {confirmDeleteId === page.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-rose-500 font-medium">แน่ใจไหม?</span>
                        <button 
                          onClick={() => deletePage(page.id)}
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
                        <Link to={`/admin/pages/edit/${page.id}`} className="p-2 text-slate-400 hover:text-[#B87333] rounded-lg hover:bg-[#B87333]/10 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        {!['home'].includes(page.slug) && (
                          <button onClick={() => setConfirmDeleteId(page.id)} className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => alert("More options coming soon")} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
                          <MoreVertical className="w-4 h-4" />
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
  );
}
