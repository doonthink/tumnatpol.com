import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Calendar, Video, Pin, Share2 } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';


import { useTranslation } from 'react-i18next';

export function BlogForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const [isRawHtml, setIsRawHtml] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    relatedPosts: '',
    productTags: '',
    publishDate: '',
    author: 'Admin',
    category: '',
    slug: '',
    coverImage: '',
    seoDescription: '',
    tags: '',
    status: 'Published'
  });

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
    fetchCategories();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/blogs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, ...data }));
        setIsPinned(data.isPinned || false);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    }
  };

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const langSpecific = ['title', 'description'].includes(name);
    const key = (langSpecific && lang === 'en') ? name + '_en' : name;
    setFormData(prev => ({ ...prev, [key]: value }));
  };


  const handleSave = async (status: string) => {
    if (!formData.title) {
      alert('กรุณากรอกชื่อบทความ');
      return;
    }

    setLoading(true);
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/blogs/${id}` : '/api/blogs';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status, isPinned, image: formData.coverImage })
      });
      
      if (res.ok) {
        navigate('/admin/blogs');
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึก');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/blogs" className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{id ? t('admin.edit_post') : t('admin.create_post')}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleSave('Draft')}
            disabled={loading}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            บันทึกแบบร่าง (Save Draft)
          </button>
          <button 
            onClick={() => handleSave('Published')}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#0D1B3D] text-white rounded-lg font-medium hover:bg-[#0D1B3D]/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'กำลังบันทึก...' : 'บันทึกและเผยแพร่ (Publish)'}
          </button>
        </div>
      </div>

      {/* Language Toggle */}
      <div className="flex bg-slate-200/50 p-1 rounded-lg w-fit mb-6">
        <button 
          onClick={() => setLang('th')}
          className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${lang === 'th' ? 'bg-white text-[#0D1B3D] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          ภาษาไทย (TH)
        </button>
        <button 
          onClick={() => setLang('en')}
          className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${lang === 'en' ? 'bg-white text-[#0D1B3D] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          English (EN)
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">{t("admin.content_label")}</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.title_label")} *</label>
              <input 
                type="text" 
                name="title"
                value={lang === 'en' ? (formData as any).title_en || '' : formData.title || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" 
                placeholder={lang === 'th' ? "ชื่อบทความ..." : "Post Title..."} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.desc_label")}</label>
              <textarea 
                rows={3} 
                name="description"
                value={lang === 'en' ? (formData as any).description_en || '' : formData.description || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" 
                placeholder="คำอธิบายเกริ่นนำ..."
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.html_editor")}</label>
              <div className="bg-white">
                {isRawHtml ? (
                  <textarea
                    value={lang === 'en' ? (formData as any).content_en || '' : formData.content || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [lang === 'en' ? 'content_en' : 'content']: e.target.value }))}
                    className="w-full h-96 p-4 font-mono text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent"
                    placeholder="<div class='container'>Hello Bootstrap 5</div>"
                  />
                ) : (
                  <div className="mb-12 editor-container">
                    <Editor
                        licenseKey="gpl"
                        tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@7.3.0/tinymce.min.js"
                        value={lang === 'en' ? (formData as any).content_en || '' : formData.content || ''}
                        onEditorChange={(content) => {
                            setFormData(prev => ({ ...prev, [lang === 'en' ? 'content_en' : 'content']: content }));
                        }}
                        init={{
                            height: 500,
                            menubar: true,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | fontfamily fontsize | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code | help',
                            font_family_formats: 'Anuphan=Anuphan, sans-serif; Noto Sans Thai=Noto Sans Thai, sans-serif; UID อวกาศ="UID อวกาศ", sans-serif; UID Awakat=UID Awakat, sans-serif; Prompt=Prompt, sans-serif; Arial=arial,helvetica,sans-serif; Courier New=courier new,courier; Verdana=verdana,geneva;',
                            content_style: 'body { font-family: "Noto Sans Thai", sans-serif; font-size:14px }',
                            extended_valid_elements: '*[*]',
                            content_css: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css'
                        }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">{t("admin.video_label")}</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.video_url")}</label>
              <div className="relative">
                <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  name="youtubeUrl"
                  value={(formData as any).youtubeUrl || ''}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-sm" 
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">{t("admin.video_desc")}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">{t("admin.relationships")}</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.related_posts")}</label>
              <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" placeholder="ค้นหาชื่อบทความเพื่อเชื่อมโยง..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.product_tags")}</label>
              <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" placeholder="ค้นหาชื่อสินค้า/บริการเพื่อแท็ก..." />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">{t("admin.publish_setting")}</h2>
            
            <button 
              onClick={() => setIsPinned(!isPinned)}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg border transition-colors ${isPinned ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Pin className="w-4 h-4" />
              {isPinned ? 'ปักหมุดโพสต์แล้ว' : 'ปักหมุดโพสต์นี้'}
            </button>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.publish_time")}</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="datetime-local" 
                  name="publishDate"
                  value={formData.publishDate || ''}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-sm" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.author_label")}</label>
              <select 
                name="author"
                value={formData.author || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-sm bg-white"
              >
                <option value="Admin">Admin</option>
                <option value="Guest Writer">Guest Writer</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">{t("admin.categorization")}</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.category_label")}</label>
              <select 
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-sm bg-white"
              >
                <option value="">{t("admin.select_category")}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name_en ? `${c.name} / ${c.name_en}` : c.name}</option>
                ))}
              </select>
              <Link to="/admin/categories" className="inline-block text-xs text-[#B87333] mt-2 hover:underline">{t("admin.manage_category")}</Link>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.slug_label")}</label>
              <input 
                type="text" 
                name="slug"
                value={formData.slug || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-sm" 
                placeholder="my-blog-post" 
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">{t("admin.media_images")}</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.cover_image")}</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 cursor-pointer transition-colors">
                <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <span className="text-sm text-slate-500">{t("admin.upload_cover")}</span>
                <p className="text-xs text-slate-400 mt-1">{t("admin.recommend_size")}</p>
              </div>
              <div className="mt-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">{t("admin.or_url")}</label>
                <input 
                  type="text" 
                  name="coverImage"
                  value={formData.coverImage || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-xs" 
                  placeholder="https://images.unsplash.com/..." 
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">{t("admin.seo_sharing")}</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.seo_desc")}</label>
              <textarea rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-sm" placeholder="คำอธิบายสำหรับ Search Engine..."></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.tags_label")}</label>
              <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-sm" placeholder="คั่นด้วยเครื่องหมายลูกน้ำ (,)" />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <p className="text-sm font-medium text-slate-700 mb-2">{t("admin.social_share_preview")}</p>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Share2 className="w-4 h-4" /></div>
                <span className="text-xs text-slate-500 self-center">{t("admin.social_share_desc")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
