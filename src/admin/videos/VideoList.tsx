import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export function VideoList() {
  const [videos, setVideos] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vidRes, catRes] = await Promise.all([
        fetch('/api/videos'),
        fetch('/api/videoCategories')
      ]);
      const vidData = await vidRes.json();
      const catData = await catRes.json();
      
      setVideos(Array.isArray(vidData) ? vidData.sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0)) : []);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      fetchData();
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchSearch = video.title?.toLowerCase().includes(search.toLowerCase()) || video.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || video.status === statusFilter;
    const matchSource = sourceFilter === 'All' || video.sourceType === sourceFilter;
    const matchCategory = categoryFilter === 'All' || video.categoryId === categoryFilter;
    return matchSearch && matchStatus && matchSource && matchCategory;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">จัดการวิดีโอ (Video Management)</h1>
          <p className="text-slate-500 mt-1">เพิ่ม แก้ไข ลบ และจัดการวิดีโอทั้งหมด</p>
        </div>
        <Link 
          to="/admin/videos/create"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          เพิ่มวิดีโอใหม่
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="ค้นหาจากชื่อเรื่อง หรือรายละเอียด..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <div className="flex flex-wrap sm:flex-nowrap gap-4">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="All">สถานะทั้งหมด</option>
              <option value="Published">Published (เผยแพร่)</option>
              <option value="Draft">Draft (แบบร่าง)</option>
              <option value="Unpublished">Unpublished (ซ่อน)</option>
            </select>

            <select 
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="All">แหล่งที่มาทั้งหมด</option>
              <option value="Upload">Uploaded Video</option>
              <option value="YouTube">YouTube</option>
            </select>

            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="All">ทุกหมวดหมู่</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-y border-slate-200">
              <tr>
                <th className="py-3 px-4 text-sm font-semibold text-slate-900">วิดีโอ</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-900">หมวดหมู่</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-900">สถานะ</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-900">แหล่งที่มา</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-900">ยอดวิว</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-900">วันที่เผยแพร่</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-900 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="py-8 text-center text-slate-500">กำลังโหลดข้อมูล...</td></tr>
              ) : filteredVideos.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center text-slate-500">ไม่พบข้อมูลวิดีโอ</td></tr>
              ) : (
                filteredVideos.map(video => {
                  const cat = categories.find(c => c.id === video.categoryId);
                  return (
                    <tr key={video.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-16 bg-slate-200 rounded overflow-hidden relative shrink-0">
                            {video.thumbnail ? (
                              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Thumb</div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 line-clamp-1">{video.title}</div>
                            <div className="text-xs text-slate-500 mt-1">/{video.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{cat?.name || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full inline-block ${
                          video.status === 'Published' ? 'bg-emerald-100 text-emerald-700' :
                          video.status === 'Draft' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {video.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-sm">
                        {video.sourceType === 'YouTube' ? (
                          <span className="text-red-600 font-medium">YouTube</span>
                        ) : (
                          <span className="text-blue-600 font-medium">Upload</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{video.views || 0}</td>
                      <td className="py-3 px-4 text-slate-500 text-sm">
                        {video.publishDate ? new Date(video.publishDate).toLocaleDateString('th-TH') : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {confirmDeleteId === video.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-rose-500 font-medium">แน่ใจไหม?</span>
                            <button 
                              onClick={() => deleteVideo(video.id)}
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
                            <Link 
                              to={`/admin/videos/edit/${video.id}`}
                              className="p-2 text-slate-400 hover:text-accent rounded-lg hover:bg-accent/10"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => setConfirmDeleteId(video.id)}
                              className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}