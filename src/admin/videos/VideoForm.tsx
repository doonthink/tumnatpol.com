import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Save, Play, Image as ImageIcon } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';

export function VideoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Video Form Data
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    categoryId: '',
    sourceType: 'Upload', // 'Upload' or 'YouTube'
    videoUrl: '', // For YouTube
    description: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    status: 'Draft', // 'Published', 'Draft', 'Unpublished'
    publishAt: '',
    sortOrder: 0
  });

  // Files
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetch('/api/videoCategories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []));

    if (isEditing) {
      fetch(`/api/videos/${id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            categoryId: data.categoryId || '',
            sourceType: data.sourceType || 'Upload',
            videoUrl: data.videoUrl || '',
            description: data.description || '',
            seoTitle: data.seoTitle || '',
            seoDescription: data.seoDescription || '',
            seoKeywords: data.seoKeywords || '',
            status: data.status || 'Draft',
            publishAt: data.publishAt || '',
            sortOrder: data.sortOrder || 0
          });
          setThumbnailPreview(data.thumbnail || '');
          if (data.sourceType === 'Upload') {
            setVideoPreview(data.videoFile || '');
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, isEditing]);

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleYoutubeUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, videoUrl: url }));
    const ytId = extractYoutubeId(url);
    if (ytId && !thumbnailPreview && !thumbnailFile) {
      // Auto set thumbnail if empty
      setThumbnailPreview(`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`);
    }
  };

  const generateSlug = (text: string) => {
    return (text || '').toLowerCase()
      .replace(/[^a-z0-9ก-๙\\s-]/g, '')
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert('กรุณากรอกชื่อวิดีโอ');
      return;
    }
    if (formData.sourceType === 'YouTube' && !formData.videoUrl) {
      alert('กรุณากรอก URL YouTube');
      return;
    }
    if (formData.sourceType === 'Upload' && !videoFile && !videoPreview) {
      alert('กรุณาอัปโหลดไฟล์วิดีโอ');
      return;
    }

    setSaving(true);
    setUploadProgress(10); // Start progress

    try {
      // 1. Upload Files first if there are any
      let uploadedThumbnail = thumbnailPreview;
      let uploadedVideo = videoPreview;

      if (thumbnailFile || videoFile) {
        const uploadData = new FormData();
        if (thumbnailFile) uploadData.append('thumbnail', thumbnailFile);
        if (videoFile) uploadData.append('video', videoFile);

        setUploadProgress(40);

        const uploadRes = await fetch('/api/videos/upload', {
          method: 'POST',
          body: uploadData
        });

        if (!uploadRes.ok) throw new Error('Upload failed');
        const uploadResult = await uploadRes.json();
        
        if (uploadResult.thumbnailUrl) uploadedThumbnail = uploadResult.thumbnailUrl;
        if (uploadResult.videoUrl) uploadedVideo = uploadResult.videoUrl;
        
        setUploadProgress(80);
      }

      // 2. Save Video Data
      const finalData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        thumbnail: uploadedThumbnail,
        videoFile: formData.sourceType === 'Upload' ? uploadedVideo : null,
      };

      const res = await fetch(`/api/videos${isEditing ? `/${id}` : ''}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });

      if (!res.ok) throw new Error('Failed to save video data');
      
      setUploadProgress(100);
      setTimeout(() => navigate('/admin/videos'), 500);

    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการบันทึก กรุณาลองอีกครั้ง');
      setUploadProgress(0);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/videos')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">{isEditing ? 'แก้ไขวิดีโอ' : 'เพิ่มวิดีโอใหม่'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อวิดีโอ <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                  <input 
                    type="text" 
                    value={formData.slug} 
                    onChange={e => setFormData({...formData, slug: e.target.value})} 
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">หมวดหมู่</label>
                  <select 
                    value={formData.categoryId} 
                    onChange={e => setFormData({...formData, categoryId: e.target.value})} 
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="">-- ไม่ระบุหมวดหมู่ --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">รายละเอียด / เนื้อหา</label>
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <Editor
                    licenseKey="gpl"
                    tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@7.3.0/tinymce.min.js"
                    value={formData.description}
                    onEditorChange={(content) => setFormData({ ...formData, description: content })}
                    init={{
                      height: 400,
                      menubar: false,
                      plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'],
                      toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                      content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px }'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Video Source */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">ไฟล์วิดีโอ / แหล่งที่มา</h2>
              
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={formData.sourceType === 'Upload'} onChange={() => setFormData({...formData, sourceType: 'Upload'})} className="text-primary focus:ring-primary" />
                  <span className="text-slate-700 font-medium">อัปโหลดไฟล์วิดีโอ (MP4)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={formData.sourceType === 'YouTube'} onChange={() => setFormData({...formData, sourceType: 'YouTube'})} className="text-primary focus:ring-primary" />
                  <span className="text-slate-700 font-medium">ลิงก์ YouTube</span>
                </label>
              </div>

              {formData.sourceType === 'YouTube' ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">YouTube URL <span className="text-rose-500">*</span></label>
                  <input 
                    type="url" 
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.videoUrl} 
                    onChange={e => handleYoutubeUrlChange(e.target.value)} 
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                  {formData.videoUrl && extractYoutubeId(formData.videoUrl) && (
                    <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${extractYoutubeId(formData.videoUrl)}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-slate-400" />
                      <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง</p>
                      <p className="text-xs text-slate-500">MP4, WebM (Max 500MB)</p>
                    </div>
                    <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setVideoFile(e.target.files[0]);
                        setVideoPreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }} />
                  </label>
                  
                  {videoPreview && (
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                      <video src={videoPreview} controls className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SEO Options */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">SEO / การค้นหา</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SEO Title</label>
                <input 
                  type="text" 
                  value={formData.seoTitle} 
                  onChange={e => setFormData({...formData, seoTitle: e.target.value})} 
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:border-primary"
                  placeholder="ถ้าไม่กรอก จะใช้ชื่อวิดีโอ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SEO Description</label>
                <textarea 
                  value={formData.seoDescription} 
                  onChange={e => setFormData({...formData, seoDescription: e.target.value})} 
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:border-primary h-24 resize-none"
                  placeholder="คำอธิบายแบบย่อ สำหรับแสดงผลบน Google"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Keywords</label>
                <input 
                  type="text" 
                  value={formData.seoKeywords} 
                  onChange={e => setFormData({...formData, seoKeywords: e.target.value})} 
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:border-primary"
                  placeholder="เช่น event, organizer, production (คั่นด้วยลูกน้ำ)"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">การเผยแพร่</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">สถานะ</label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})} 
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="Published">เผยแพร่ (Published)</option>
                  <option value="Draft">ฉบับร่าง (Draft)</option>
                  <option value="Unpublished">ซ่อน (Unpublished)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ตั้งเวลาเผยแพร่ (ถ้ามี)</label>
                <input 
                  type="datetime-local" 
                  value={formData.publishAt ? new Date(new Date(formData.publishAt).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,16) : ''} 
                  onChange={e => setFormData({...formData, publishAt: e.target.value ? new Date(e.target.value).toISOString() : ''})} 
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ลำดับการแสดงผล</label>
                <input 
                  type="number" 
                  value={formData.sortOrder} 
                  onChange={e => setFormData({...formData, sortOrder: Number(e.target.value)})} 
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none"
                />
              </div>

              {saving && uploadProgress > 0 && (
                <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4">
                  <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  <p className="text-xs text-center text-slate-500 mt-1">กำลังบันทึก... {uploadProgress}%</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={saving}
                className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'กำลังบันทึก...' : 'บันทึกวิดีโอ'}
              </button>
            </div>

            {/* Thumbnail */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">รูปภาพปก (Thumbnail)</h2>
              
              {thumbnailPreview ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-200 group">
                  <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full aspect-video object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="px-4 py-2 bg-white text-slate-900 rounded-lg cursor-pointer font-medium text-sm hover:bg-slate-100">
                      เปลี่ยนรูปปก
                      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setThumbnailFile(e.target.files[0]);
                          setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
                        }
                      }} />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 mb-3 text-slate-400" />
                    <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">อัปโหลดรูปปก</span></p>
                    <p className="text-xs text-slate-500">1280x720px แนะนำ</p>
                  </div>
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setThumbnailFile(e.target.files[0]);
                      setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }} />
                </label>
              )}
              {formData.sourceType === 'YouTube' && formData.videoUrl && !thumbnailFile && (
                <p className="text-xs text-slate-500">ระบบดึงรูปปกอัตโนมัติจาก YouTube แล้ว สามารถเปลี่ยนเองได้ถ้าต้องการ</p>
              )}
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}