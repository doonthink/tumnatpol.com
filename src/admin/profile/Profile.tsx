import { useState, useEffect } from 'react';
import { Save, User, Camera, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

export function Profile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: 'Super Admin',
    email: 'admin@biztoptier.com',
    profilePicture: 'https://i.pravatar.cc/150?u=admin',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, profilePicture: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }
    // Implement save logic here...
    alert("บันทึกข้อมูลเรียบร้อยแล้ว");
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">แก้ไขโปรไฟล์</h1>
          <p className="text-sm text-slate-500 mt-1">จัดการข้อมูลส่วนตัวและรหัสผ่านของคุณ</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-8">
        
        {/* Profile Picture Section */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
            <User className="w-5 h-5 text-slate-500" />
            ข้อมูลส่วนตัว
          </h2>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4 shrink-0">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-inner">
                {formData.profilePicture ? (
                  <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                    <User className="w-12 h-12" />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
              <label className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                เปลี่ยนรูปโปรไฟล์
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ Profile</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">อีเมล</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-500" />
            เปลี่ยนรหัสผ่าน
          </h2>
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">รหัสผ่านเดิม</label>
              <input 
                type="password" 
                name="currentPassword" 
                value={formData.currentPassword} 
                onChange={handleInputChange} 
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">รหัสผ่านใหม่</label>
              <input 
                type="password" 
                name="newPassword" 
                value={formData.newPassword} 
                onChange={handleInputChange} 
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ยืนยันรหัสผ่านใหม่</label>
              <input 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" 
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button onClick={handleSave} className="px-6 py-2.5 bg-[#B87333] text-white rounded-lg text-sm font-medium hover:bg-[#a0632b] transition-colors shadow-md flex items-center gap-2">
            <Save className="w-4 h-4" /> บันทึกข้อมูล
          </button>
        </div>

      </div>
    </div>
  );
}
