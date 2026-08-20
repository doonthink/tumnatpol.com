import fs from 'fs';

let content = `import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Image as ImageIcon, Check, X, ArrowLeft, Save } from 'lucide-react';

export function BannerList() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [formData, setFormData] = useState<any>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [rotationTime, setRotationTime] = useState(5);

  useEffect(() => {
    fetchBanners();
    
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data && data.general && data.general.bannerRotationTime) {
          setRotationTime(parseInt(data.general.bannerRotationTime));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const saveRotationTime = async (newTime: number) => {
    try {
      const res = await fetch('/api/settings');
      let data = await res.json();
      data = {
        ...data,
        general: {
          ...data.general,
          bannerRotationTime: newTime.toString()
        }
      };
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      alert('บันทึกเวลาหมุนแบนเนอร์เรียบร้อย');
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
    setFormData({ name: '', link: '', order: 0, status: 'Active', image: '' });
    setView('form');
  };

  const handleEdit = (banner: any) => {
    setFormData({ ...banner });
    setView('form');
  };

  const handleFormChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked ? 'Active' : 'Inactive' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const url = formData.id ? \`/api/banners/\${formData.id}\` : '/api/banners';
      const method = formData.id ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, order: parseInt(formData.order) || 0 }),
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
        await fetch(\`/api/banners/\${deleteConfirmId}\`, { method: 'DELETE' });
        await fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
      setDeleteConfirmId(null);
    }
  };

  if (view === 'form') {
    return (
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{formData.id ? 'แก้ไขแบนเนอร์' : 'เพิ่มแบนเนอร์ใหม่'}</h1>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => setView('list')} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> ยกเลิก
             </button>
             <button onClick={handleSave} className="px-4 py-2 bg-[#B87333] text-white rounded-lg text-sm font-medium hover:bg-[#a0632b] transition-colors shadow-md inline-flex items-center gap-2">
              <Save className="w-4 h-4" /> บันทึก
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="max-w-2xl space-y-6">
            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-slate-700">ชื่อแบนเนอร์</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleFormChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-sm" placeholder="เช่น แบนเนอร์โปรโมชั่น 1" />
            </div>

            <div className="grid grid-cols-[150px_1fr] items-start gap-4">
              <label className="text-sm font-medium text-slate-700 pt-3">รูปภาพแบนเนอร์</label>
              <div>
                {formData.image ? (
                  <div className="relative inline-block">
                    <img src={formData.image} alt="Preview" className="max-h-48 rounded-lg border border-slate-200" />
                    <button onClick={() => setFormData({ ...formData, image: '' })} className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md text-slate-400 hover:text-rose-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500">คลิกเพื่ออัปโหลดรูปภาพ</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-slate-700">ลิงก์ (URL)</label>
              <input type="text" name="link" value={formData.link || ''} onChange={handleFormChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-sm" placeholder="https://..." />
            </div>
            
            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-slate-700">ลำดับการแสดงผล</label>
              <input type="number" name="order" value={formData.order || 0} onChange={handleFormChange} className="w-32 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-sm" />
            </div>

            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-slate-700">สถานะ</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="status" checked={formData.status === 'Active'} onChange={handleFormChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#B87333]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B87333]"></div>
                <span className="ml-3 text-sm font-medium text-slate-700">{formData.status === 'Active' ? 'เปิดใช้งาน' : 'ปิดการแสดงผล'}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">จัดการแบนเนอร์ (Banners)</h1>
          <p className="text-sm text-slate-500 mt-1">จัดการแบนเนอร์ที่แสดงในหน้าแรกของเว็บไซต์</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
            <label className="text-sm font-medium text-slate-700">เวลาหมุนภาพ (วินาที):</label>
            <input 
              type="number" 
              value={rotationTime} 
              onChange={(e) => setRotationTime(parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 border border-slate-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-[#B87333]"
            />
            <button 
              onClick={() => saveRotationTime(rotationTime)}
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
                      <span className={\`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium \${
                        banner.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }\`}>
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
`;

fs.writeFileSync('src/admin/banners/BannerList.tsx', content);
console.log("Restored BannerList.tsx");
