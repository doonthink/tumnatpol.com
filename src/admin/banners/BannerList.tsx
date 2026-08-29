import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { BannerForm } from './BannerForm';

export function BannerList() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [formData, setFormData] = useState<any>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [rotationTime, setRotationTime] = useState(5);
  const [showBannerSection, setShowBannerSection] = useState(false);

  useEffect(() => {
    fetchBanners();
    
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data && data.general) {
          if (data.general.bannerRotationTime) {
            setRotationTime(parseInt(data.general.bannerRotationTime));
          }
          if (data.general.showBannerSection !== undefined) {
            setShowBannerSection(data.general.showBannerSection);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = async (newTime: number, showSection: boolean) => {
    try {
      const res = await fetch('/api/settings');
      let data = await res.json();
      data = {
        ...data,
        general: {
          ...data.general,
          bannerRotationTime: newTime.toString(),
          showBannerSection: showSection
        }
      };

      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      alert('บันทึกการตั้งค่าเรียบร้อย');
    } catch(err) {
      console.error(err);
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners');
      const data = await res.json();
      data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      setBanners(data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setFormData({ name: '', link: '', order: 0, status: 'Inactive', image: '' });
    setView('form');
  };

  const handleEdit = (banner: any) => {
    setFormData({ ...banner });
    setView('form');
  };

  const handleSave = async (savedData: any) => {
    try {
      const url = savedData.id ? `/api/banners/${savedData.id}` : '/api/banners';
      const method = savedData.id ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...savedData, order: parseInt(savedData.order) || 0 }),
      });
      await fetchBanners();
      setView('list');
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        await fetch(`/api/banners/${deleteConfirmId}`, { method: 'DELETE' });
        await fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
      setDeleteConfirmId(null);
    }
  };

  if (view === 'form') {
    return (
      <BannerForm 
        initialData={formData} 
        onSave={handleSave} 
        onCancel={() => setView('list')} 
      />
    );
  }


  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">จัดการแบนเนอร์ (Banners)</h1>
          <p className="text-sm text-slate-500 mt-1">จัดการแบนเนอร์ที่แสดงในหน้าแรกของเว็บไซต์</p>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showBannerSection} 
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setShowBannerSection(checked);
                    saveSettings(rotationTime, checked);
                  }}
                  className="w-4 h-4 text-[#B87333] focus:ring-[#B87333] border-slate-300 rounded"
                />
                <span className="text-sm font-medium text-slate-700">เปิดใช้งานระบบแบนเนอร์ในหน้าแรก</span>
              </label>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
              <label className="text-sm font-medium text-slate-700">เวลาหมุนภาพ (วินาที):</label>
              <input 
                type="number" 
                value={rotationTime} 
                onChange={(e) => setRotationTime(parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 border border-slate-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-[#B87333]"
              />
              <button 
                onClick={() => saveSettings(rotationTime, showBannerSection)}
                className="text-xs bg-[#0D1B3D] text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
              >
                บันทึก
              </button>
            </div>
            <button onClick={handleNew} className="px-4 py-2 bg-[#B87333] text-white rounded-lg text-sm font-medium hover:bg-[#a0632b] transition-colors shadow-md flex items-center gap-2">
              <Plus className="w-4 h-4" /> เพิ่มแบนเนอร์
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">ภาพ</th>
                <th className="px-6 py-4">ชื่อแบนเนอร์</th>
                <th className="px-6 py-4">ลิงก์</th>
                <th className="px-6 py-4 text-center">ลำดับ</th>
                <th className="px-6 py-4 text-center">สถานะ</th>
                <th className="px-6 py-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">กำลังโหลด...</td></tr>
              ) : banners.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">ยังไม่มีข้อมูลแบนเนอร์</td></tr>
              ) : (
                banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      {banner.image ? (
                        <img src={banner.image} alt={banner.name} className="h-12 w-24 object-cover rounded border border-slate-200" />
                      ) : (
                        <div className="h-12 w-24 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-slate-400">ไม่มีรูปภาพ</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{banner.name || '-'}</td>
                    <td className="px-6 py-4">
                      {banner.link ? <a href={banner.link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline line-clamp-1 max-w-[200px]">{banner.link}</a> : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">{banner.order}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        banner.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {banner.status === 'Active' ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(banner)} className="p-2 text-slate-400 hover:text-[#B87333] rounded-lg hover:bg-[#B87333]/10 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(banner.id)} className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">ยืนยันการลบแบนเนอร์</h3>
            <p className="text-sm text-slate-600">คุณแน่ใจหรือไม่ว่าต้องการลบแบนเนอร์นี้? การดำเนินการนี้ไม่สามารถยกเลิกได้</p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                ยกเลิก
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg text-sm font-medium transition-colors shadow-sm">
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
