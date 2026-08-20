import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ServiceCategoryList() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<any[]>([]);
  const [newName, setNewName] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editNameEn, setEditNameEn] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/service-categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching service categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newName.trim()) return;
    try {
      const res = await fetch('/api/service-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newName.trim(), 
          name_en: newNameEn.trim(),
          slug: newName.trim().toLowerCase().replace(/\s+/g, '-')
        })
      });
      if (res.ok) {
        setNewName('');
        setNewNameEn('');
        fetchCategories();
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const updateCategory = async (id: string) => {
    if (!editName.trim()) return;
    try {
      const res = await fetch(`/api/service-categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), name_en: editNameEn.trim() })
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
      await fetch(`/api/service-categories/${id}`, { method: 'DELETE' });
      setCategories(categories.filter(c => c.id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">จัดการหมวดหมู่บริการ (Service Categories)</h1>
          <p className="text-slate-500 mt-1">เพิ่ม แก้ไข และลบหมวดหมู่สำหรับระบบบริการ</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input 
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            placeholder="ชื่อหมวดหมู่ใหม่ (TH)..."
            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent"
          />
          <input 
            type="text"
            value={newNameEn}
            onChange={(e) => setNewNameEn(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            placeholder="New Category Name (EN)..."
            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent"
          />
          <button 
            onClick={addCategory}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0D1B3D] text-white rounded-lg font-medium hover:bg-[#0D1B3D]/90 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            เพิ่มหมวดหมู่บริการ
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="pb-3 text-sm font-semibold text-slate-900">{t("admin.name")} (TH)</th>
                <th className="pb-3 text-sm font-semibold text-slate-900">ชื่อหมวดหมู่ (EN)</th>
                <th className="pb-3 text-sm font-semibold text-slate-900 text-right">{t("admin.actions_label")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-slate-500">{t("admin.loading")}</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-slate-500">{t("admin.no_data")}</td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4">
                      {editingId === category.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && updateCategory(category.id)}
                          className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:border-[#B87333]"
                          autoFocus
                          placeholder="ชื่อภาษาไทย"
                        />
                      ) : (
                        <span className="font-medium text-slate-900">{category.name}</span>
                      )}
                    </td>
                    <td className="py-4">
                      {editingId === category.id ? (
                        <input
                          type="text"
                          value={editNameEn || ''}
                          onChange={(e) => setEditNameEn(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && updateCategory(category.id)}
                          className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:border-[#B87333]"
                          placeholder="Category Name (EN)"
                        />
                      ) : (
                        <span className="font-medium text-slate-900">{category.name_en}</span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      {editingId === category.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => updateCategory(category.id)}
                            className="px-3 py-1.5 text-sm bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                          >
                            บันทึก
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      ) : confirmDeleteId === category.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-rose-500 font-medium">แน่ใจไหม?</span>
                          <button 
                            onClick={() => deleteCategory(category.id)}
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
                            onClick={() => {
                              setEditingId(category.id);
                              setEditName(category.name);
                              setEditNameEn(category.name_en || '');
                            }}
                            className="p-2 text-slate-400 hover:text-[#B87333] rounded-lg hover:bg-[#B87333]/10 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setConfirmDeleteId(category.id)}
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
