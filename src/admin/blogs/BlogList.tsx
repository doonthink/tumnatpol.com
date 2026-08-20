import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, MoreVertical, Eye, Pin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function BlogList() {
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      setBlogs(blogs.filter(blog => blog.id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("admin.blog_management")}</h1>
          <p className="text-slate-500 mt-1">{t("admin.blog_desc")}</p>
        </div>
        <Link 
          to="/admin/blogs/new" 
          className="flex items-center gap-2 bg-[#0D1B3D] text-white px-4 py-2 rounded-lg hover:bg-[#0D1B3D]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          สร้างบทความใหม่ (Create Post)
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อบทความ หรือผู้เขียน..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent bg-white">
              <option value="">{t("admin.all_categories")}</option>
              <option value="tips">Business Tips</option>
              <option value="updates">Platform Updates</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">{t("admin.title_label")}</th>
                <th className="px-6 py-4">{t("admin.category_label")}</th>
                <th className="px-6 py-4">{t("admin.author_label")}</th>
                <th className="px-6 py-4">{t("admin.views_label")}</th>
                <th className="px-6 py-4">{t("admin.status_label")}</th>
                <th className="px-6 py-4">{t("admin.date_label")}</th>
                <th className="px-6 py-4 text-right">{t("admin.actions_label")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-slate-500">{t("admin.loading")}</td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-slate-500">{t("admin.no_data")}</td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {blog.isPinned && <Pin className="w-4 h-4 text-[#B87333] shrink-0" />}
                        <span className="font-medium text-slate-900">{blog.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{blog.category}</td>
                    <td className="px-6 py-4 text-slate-500">{blog.author || 'Admin'}</td>
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        {(blog.views || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        blog.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {blog.status || 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {blog.date ? new Date(blog.date).toLocaleDateString('th-TH') : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {confirmDeleteId === blog.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-rose-500 font-medium">แน่ใจไหม?</span>
                          <button 
                            onClick={() => deleteBlog(blog.id)}
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
                          <Link to={`/admin/blogs/edit/${blog.id}`} className="p-2 text-slate-400 hover:text-[#B87333] rounded-lg hover:bg-[#B87333]/10 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button onClick={() => setConfirmDeleteId(blog.id)} className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors">
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
