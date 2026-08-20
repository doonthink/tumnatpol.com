import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Users, Save, ChevronRight, ArrowLeft } from 'lucide-react';

export function StaffSettings() {
  const [view, setView] = useState<'list' | 'form' | 'permissions'>('list');
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [staffList, setStaffList] = useState<any[]>([]);

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/staff');
      const data = await res.json();
      if (Array.isArray(data)) {
        setStaffList(data);
      }
    } catch (e) {
      console.error('Failed to fetch staff list:', e);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const [formData, setFormData] = useState<any>({});

  const handleEdit = (staff: any) => {
    setSelectedStaff(staff);
    setFormData({ ...staff });
    setView('form');
  };

  const handleNew = () => {
    setSelectedStaff(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'Admin Support',
      permissions: { pages: true, blogs: true, categories: true, media: true, roles: true, settings: false }
    });
    setView('form');
  };

  const handleDeleteClick = (id: any) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId !== null) {
      setIsDeleting(true);
      const targetStaff = staffList.find(s => String(s.id) === String(deleteConfirmId));
      try {
        await fetch(`/api/staff/${deleteConfirmId}`, {
          method: 'DELETE'
        });
        
        // Record log
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: 'Super Admin (admin)',
            action: `ลบพนักงาน '${targetStaff?.name || deleteConfirmId}'`,
            module: 'Staff Management'
          })
        });

        // Update local state and refetch to guarantee persistence
        setStaffList(prev => prev.filter(s => String(s.id) !== String(deleteConfirmId)));
        await fetchStaff();
      } catch (e) {
        console.error('Failed to delete staff:', e);
      } finally {
        setIsDeleting(false);
        setDeleteConfirmId(null);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };
    
    // Auto preset permissions when role changes
    if (name === 'role') {
      if (value === 'Super Admin') {
        updatedData.permissions = { pages: true, blogs: true, categories: true, media: true, roles: true, settings: true };
      } else if (value === 'Admin') {
        updatedData.permissions = { pages: true, blogs: true, categories: true, media: true, roles: true, settings: false };
      }
    }
    setFormData(updatedData);
  };

  const handlePermissionChange = (e: any) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      permissions: { ...formData.permissions, [name]: checked }
    });
  };

  const handleSave = async () => {
    try {
      if (selectedStaff) {
        await fetch(`/api/staff/${selectedStaff.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        setStaffList(prev => prev.map(s => String(s.id) === String(selectedStaff.id) ? { ...s, ...formData } : s));
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: 'Super Admin (admin)',
            action: `แก้ไขข้อมูลพนักงาน '${formData.name}'`,
            module: 'Staff Management'
          })
        });
      } else {
        const res = await fetch('/api/staff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const newItem = await res.json();
        setStaffList(prev => [...prev, newItem]);
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: 'Super Admin (admin)',
            action: `เพิ่มพนักงานใหม่ '${formData.name}'`,
            module: 'Staff Management'
          })
        });
      }
      fetchStaff();
    } catch (e) {
      console.error('Failed to save staff:', e);
    }
    setView('list');
  };

  if (view === 'form') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Staff Information</h2>
          <div className="space-x-3">
             <button onClick={() => setView('list')} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              ยกเลิก
             </button>
             <button onClick={() => setView('permissions')} className="px-4 py-2 bg-[#0088ff] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-md inline-flex items-center gap-1">
              ถัดไป (ตั้งค่าสิทธิ์) <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-3xl">
          <div className="space-y-6">
            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-slate-700">ชื่อ</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleFormChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0088ff] focus:border-transparent text-sm" placeholder="ชื่อพนักงาน" />
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-slate-700">อีเมล์</label>
              <input type="email" name="email" value={formData.email || ''} onChange={handleFormChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0088ff] focus:border-transparent text-sm" placeholder="อีเมล์" />
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-slate-700">โทรศัพท์</label>
              <input type="text" name="phone" value={formData.phone || ''} onChange={handleFormChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0088ff] focus:border-transparent text-sm" placeholder="เบอร์โทรศัพท์" />
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-slate-700">รหัสผ่าน</label>
              <input type="password" name="password" value={formData.password || ''} onChange={handleFormChange} placeholder="รหัสผ่าน" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0088ff] focus:border-transparent text-sm" />
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-slate-700">บทบาท</label>
              <select name="role" value={formData.role || ''} onChange={handleFormChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0088ff] focus:border-transparent text-sm bg-white">
                <option value="Super Admin">Super Admin</option>
                <option value="Admin Support">Admin Support</option>
                <option value="Admin Platform">Admin Platform</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button onClick={handleSave} className="px-6 py-2 bg-[#00a8ff] text-white rounded-lg text-sm font-medium hover:bg-[#0097e6] transition-colors shadow-sm inline-flex items-center gap-2">
                <Save className="w-4 h-4" /> บันทึก
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'permissions') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">ตั้งค่าสิทธิ์การเข้าถึง (Permissions)</h2>
          <div className="space-x-3">
             <button onClick={() => setView('form')} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
             </button>
             <button onClick={handleSave} className="px-4 py-2 bg-[#00a8ff] text-white rounded-lg text-sm font-medium hover:bg-[#0097e6] transition-colors shadow-sm inline-flex items-center gap-2">
              <Save className="w-4 h-4" /> บันทึกการตั้งค่า
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-3xl space-y-6">
          <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
            <strong>1. Admin:</strong> สามารถจัดการหน้าเพจ, บทความ, หมวดหมู่บทความ, ไฟล์ที่อัปโหลด ได้เท่านี้ และสามารถแก้ไข Role ได้ <br/>
            <strong>2. Super Admin:</strong> สามารถจัดการได้หมดเลย
          </div>
          
          <div className="space-y-4">
             <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
               <input type="checkbox" name="pages" checked={formData.permissions?.pages || false} onChange={handlePermissionChange} className="w-5 h-5 text-[#0088ff] rounded focus:ring-[#0088ff]" />
               <div>
                 <p className="text-sm font-medium text-slate-900">จัดการหน้าเพจ (Pages)</p>
               </div>
             </label>
             <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
               <input type="checkbox" name="blogs" checked={formData.permissions?.blogs || false} onChange={handlePermissionChange} className="w-5 h-5 text-[#0088ff] rounded focus:ring-[#0088ff]" />
               <div>
                 <p className="text-sm font-medium text-slate-900">จัดการบทความ (Blogs)</p>
               </div>
             </label>
             <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
               <input type="checkbox" name="categories" checked={formData.permissions?.categories || false} onChange={handlePermissionChange} className="w-5 h-5 text-[#0088ff] rounded focus:ring-[#0088ff]" />
               <div>
                 <p className="text-sm font-medium text-slate-900">จัดการหมวดหมู่ (Categories)</p>
               </div>
             </label>
             <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
               <input type="checkbox" name="media" checked={formData.permissions?.media || false} onChange={handlePermissionChange} className="w-5 h-5 text-[#0088ff] rounded focus:ring-[#0088ff]" />
               <div>
                 <p className="text-sm font-medium text-slate-900">จัดการไฟล์ (Media Library)</p>
               </div>
             </label>
             <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
               <input type="checkbox" name="roles" checked={formData.permissions?.roles || false} onChange={handlePermissionChange} className="w-5 h-5 text-[#0088ff] rounded focus:ring-[#0088ff]" />
               <div>
                 <p className="text-sm font-medium text-slate-900">แก้ไขบทบาท (Manage Roles)</p>
               </div>
             </label>
             <label className={`flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer transition-colors ${formData.role === 'Super Admin' ? 'hover:bg-slate-50' : 'bg-slate-50 opacity-70'}`}>
               <input type="checkbox" name="settings" checked={formData.permissions?.settings || false} onChange={handlePermissionChange} disabled={formData.role !== 'Super Admin'} className="w-5 h-5 text-[#0088ff] rounded focus:ring-[#0088ff] disabled:opacity-50" />
               <div>
                 <p className="text-sm font-medium text-slate-900">ตั้งค่าระบบ (System Settings) - สำหรับ Super Admin</p>
               </div>
             </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">พนักงานทุกคน</h2>
        <button onClick={handleNew} className="px-4 py-2 bg-[#8b5cf6] text-white rounded-lg text-sm font-medium hover:bg-[#7c3aed] transition-colors shadow-md flex items-center gap-2">
          <Plus className="w-4 h-4" /> เพิ่มพนักงานใหม่
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
           <h3 className="text-lg font-bold text-slate-800">พนักงาน</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">ชื่อ</th>
                <th className="px-6 py-4">อีเมล์</th>
                <th className="px-6 py-4">โทรศัพท์</th>
                <th className="px-6 py-4">บทบาท</th>
                <th className="px-6 py-4 text-center">ตัวเลือก</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.map((staff, index) => (
                <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{staff.name}</td>
                  <td className="px-6 py-4">{staff.email}</td>
                  <td className="px-6 py-4">{staff.phone}</td>
                  <td className="px-6 py-4">{staff.role}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleEdit(staff)} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(staff.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {staffList.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    ไม่มีข้อมูลพนักงาน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">ยืนยันการลบ</h3>
            <p className="text-sm text-slate-600">คุณแน่ใจหรือไม่ว่าต้องการลบพนักงานรายนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้</p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={cancelDelete} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
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
