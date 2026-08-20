import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import { useTranslation } from 'react-i18next';

export function ServiceForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState<any>({
    title: '',
    subtitle: '',
    slug: '',
    category: '',
    coverImage: '',
    content: '',
    status: 'Draft',
    features: ''
  });
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/service-categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/services/${id}`);
      const data = await res.json();
      if (res.ok) {
        setFormData({
            ...data,
            features: Array.isArray(data.features) ? data.features.join('\n') : (data.features || '')
        });
      }
    } catch (error) {
      console.error('Error fetching service:', error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const saveService = async (status: string) => {
    if (!formData.title) {
      alert('กรุณากรอกชื่อบริการ');
      return;
    }
    
    setLoading(true);
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/services/${id}` : '/api/services';
    
    // Convert features back to array
    const featuresArray = formData.features ? formData.features.split('\n').filter(f => f.trim()) : [];
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, features: featuresArray, status })
      });
      
      if (res.ok) {
        navigate('/admin/services');
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึก');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/services" className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{id ? 'แก้ไขข้อมูลบริการ' : 'สร้างบริการใหม่'}</h1>
            <p className="text-slate-500 mt-1">รายละเอียดบริการของคุณ</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => saveService('Draft')}
            disabled={loading}
            className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            บันทึกแบบร่าง (Draft)
          </button>
          <button 
            onClick={() => saveService('Published')}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#0D1B3D] text-white rounded-lg hover:bg-[#0D1B3D]/90 transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            {loading ? 'กำลังบันทึก...' : 'บันทึกและเผยแพร่ (Publish)'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อบริการ (Title) <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-lg font-medium"
                placeholder="เช่น วิเคราะห์ธุรกิจ, จับคู่ธุรกิจ..."
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">คำอธิบายสั้น (Subtitle)</label>
              <input 
                type="text" 
                name="subtitle"
                value={formData.subtitle || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent"
                placeholder="คำอธิบายสรุปสั้นๆ (แสดงในการ์ดบริการ)..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">รายละเอียดบริการ (Content)</label>
              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY || 'no-api-key'}
                value={formData.content || ''}
                onEditorChange={handleEditorChange}
                init={{
                  height: 400,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Prompt,Helvetica,Arial,sans-serif; font-size:14px }'
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">จุดเด่น/ฟีเจอร์ (แต่ละบรรทัดคือ 1 ข้อ)</label>
              <textarea 
                name="features"
                value={formData.features || ''}
                onChange={handleChange}
                rows={5} 
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-sm" 
                placeholder="ใส่จุดเด่นข้อที่ 1&#10;ใส่จุดเด่นข้อที่ 2&#10;ใส่จุดเด่นข้อที่ 3"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">การจัดหมวดหมู่</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">หมวดหมู่บริการ (Category)</label>
              <select 
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-sm bg-white"
              >
                <option value="">เลือกหมวดหมู่</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name_en ? `${c.name} / ${c.name_en}` : c.name}</option>
                ))}
              </select>
              <Link to="/admin/service-categories" className="inline-block text-xs text-[#B87333] mt-2 hover:underline">จัดการหมวดหมู่บริการ</Link>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug (อ้างอิง URL)</label>
              <input 
                type="text" 
                name="slug"
                value={formData.slug || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-sm" 
                placeholder="my-service" 
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">รูปภาพบริการ</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ภาพหน้าปก (Cover Image)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 cursor-pointer transition-colors">
                <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <span className="text-sm text-slate-500">อัปโหลดภาพ (ยังไม่รองรับ)</span>
                <p className="text-xs text-slate-400 mt-1">แนะนำขนาด 1200x800px</p>
              </div>
              <div className="mt-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">หรือระบุ Image URL</label>
                <input 
                  type="text" 
                  name="coverImage"
                  value={formData.coverImage || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-xs" 
                  placeholder="https://images.unsplash.com/..." 
                />
              </div>
              {formData.coverImage && (
                <div className="mt-4 rounded-lg overflow-hidden border border-slate-200">
                  <img src={formData.coverImage} alt="Preview" className="w-full h-auto object-cover aspect-video" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
