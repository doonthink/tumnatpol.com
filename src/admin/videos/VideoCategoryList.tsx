import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

export function VideoCategoryList() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  // Edit State
  const [editData, setEditData] = useState<any>({});
  
  // Add State
  const [isAdding, setIsAdding] = useState(false);
  const [newData, setNewData] = useState({ name: '', name_en: '', slug: '', description: '', status: 'Active', sortOrder: 0 });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/videoCategories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data.sort((a,b) => a.sortOrder - b.sortOrder) : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return (text || '').toLowerCase()
      .replace(/[^a-z0-9ก-๙\\s-]/g, '')
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const addCategory = async () => {
    if (!newData.name.trim()) return;
    try {
      const res = await fetch('/api/videoCategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...newData, 
          slug: newData.slug || generateSlug(newData.name),
          createdAt: new Date().toISOString()
        })
      });
      if (res.ok) {
        setNewData({ name: '', name_en: '', slug: '', description: '', status: 'Active', sortOrder: categories.length + 1 });
        setIsAdding(false);
        fetchCategories();
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const updateCategory = async (id: string) => {
    if (!editData.name.trim()) return;
    try {
      const res = await fetch(`/api/videoCategories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editData, updatedAt: new Date().toISOString() })
      });
      if (res.ok) {
        setEditingId(null);
        fetchCategories();
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await fetch(`/api/videoCategories/${id}`, { method: 'DELETE' });
      fetchCategories();
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">จัดการหมวดหมู่วิดีโอ</h1>
          <p className="text-slate-500 mt-1">เพิ่ม แก้ไข และจัดการหมวดหมู่วิดีโอสำหรับเว็บไซต์</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          เพิ่มหมวดหมู่ใหม่
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-sm font-semibold text-slate-900">ลำดับ</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-900">ชื่อหมวดหมู่ (TH)</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-900">ชื่อหมวดหมู่ (EN)</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-900">Slug</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-900">สถานะ</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-900 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isAdding && (
                <tr className="bg-blue-50/50">
                  <td className="py-3 px-4">
                    <input type="number" value={newData.sortOrder} onChange={e => setNewData({...newData, sortOrder: Number(e.target.value)})} className="w-16 px-2 py-1 rounded border text-sm" />
                  </td>
                  <td className="py-3 px-4">
                    <input type="text" placeholder="ชื่อหมวดหมู่ (TH)" value={newData.name} onChange={e => setNewData({...newData, name: e.target.value})} className="w-full px-2 py-1 rounded border text-sm" />
                  </td>
                  <td className="py-3 px-4">
                    <input type="text" placeholder="Category Name (EN)" value={newData.name_en} onChange={e => setNewData({...newData, name_en: e.target.value})} className="w-full px-2 py-1 rounded border text-sm" />
                  </td>
                  <td className="py-3 px-4">
                    <input type="text" placeholder="slug-name" value={newData.slug} onChange={e => setNewData({...newData, slug: e.target.value})} className="w-full px-2 py-1 rounded border text-sm" />
                  </td>
                  <td className="py-3 px-4">
                    <select value={newData.status} onChange={e => setNewData({...newData, status: e.target.value})} className="px-2 py-1 rounded border text-sm">
                      <option value="Active">ใช้งาน</option>
                      <option value="Inactive">ปิดใช้งาน</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button onClick={addCategory} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded text-sm hover:bg-emerald-200">บันทึก</button>
                    <button onClick={() => setIsAdding(false)} className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-sm hover:bg-slate-200">ยกเลิก</button>
                  </td>
                </tr>
              )}
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-slate-500">กำลังโหลด...</td></tr>
              ) : categories.length === 0 && !isAdding ? (
                <tr><td colSpan={6} className="py-8 text-center text-slate-500">ยังไม่มีหมวดหมู่วิดีโอ</td></tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      {editingId === category.id ? (
                        <input type="number" value={editData.sortOrder || 0} onChange={e => setEditData({...editData, sortOrder: Number(e.target.value)})} className="w-16 px-2 py-1 rounded border text-sm" />
                      ) : category.sortOrder || 0}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {editingId === category.id ? (
                        <input type="text" value={editData.name || ''} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full px-2 py-1 rounded border text-sm" />
                      ) : category.name}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {editingId === category.id ? (
                        <input type="text" value={editData.name_en || ''} onChange={e => setEditData({...editData, name_en: e.target.value})} className="w-full px-2 py-1 rounded border text-sm" />
                      ) : category.name_en}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {editingId === category.id ? (
                        <input type="text" value={editData.slug || ''} onChange={e => setEditData({...editData, slug: e.target.value})} className="w-full px-2 py-1 rounded border text-sm" />
                      ) : category.slug}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === category.id ? (
                        <select value={editData.status} onChange={e => setEditData({...editData, status: e.target.value})} className="px-2 py-1 rounded border text-sm">
                          <option value="Active">ใช้งาน</option>
                          <option value="Inactive">ปิดใช้งาน</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 text-xs rounded-full ${category.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {category.status === 'Active' ? 'ใช้งาน' : 'ปิดใช้งาน'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {editingId === category.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => updateCategory(category.id)} className="px-3 py-1 text-sm bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200">บันทึก</button>
                          <button onClick={() => setEditingId(null)} className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded hover:bg-slate-200">ยกเลิก</button>
                        </div>
                      ) : confirmDeleteId === category.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-rose-500 font-medium">แน่ใจไหม?</span>
                          <button onClick={() => deleteCategory(category.id)} className="px-3 py-1 text-sm bg-rose-500 text-white rounded hover:bg-rose-600">ลบ</button>
                          <button onClick={() => setConfirmDeleteId(null)} className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded hover:bg-slate-200">ยกเลิก</button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setEditingId(category.id); setEditData(category); }} className="p-2 text-slate-400 hover:text-accent rounded-lg hover:bg-accent/10">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setConfirmDeleteId(category.id)} className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50">
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