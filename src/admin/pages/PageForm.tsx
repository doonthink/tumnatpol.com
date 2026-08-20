import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Calendar } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';


import { useTranslation } from 'react-i18next';

export function PageForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const [isRawHtml, setIsRawHtml] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    headerScript: '',
    footerScript: '',
    slug: '',
    publishDate: '',
    seoDescription: '',
    favicon: '',
    tags: '',
    status: 'Published'
  });

  useEffect(() => {
    if (id) {
      fetchPage();
    }
  }, [id]);

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/pages/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching page:', error);
    }
  };

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const langSpecific = ['title', 'description', 'seoDescription'].includes(name);
    const key = (langSpecific && lang === 'en') ? name + '_en' : name;
    setFormData(prev => ({ ...prev, [key]: value }));
  };


  const handleSave = async (status: string) => {
    if (!formData.title) {
      alert('กรุณากรอกชื่อเพจ');
      return;
    }

    setLoading(true);
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/pages/${id}` : '/api/pages';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status })
      });
      
      if (res.ok) {
        navigate('/admin/pages');
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึก');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/pages" className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{id ? t('admin.edit_page') : t('admin.create_page')}</h1>
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
      <div className="flex bg-slate-200/50 p-1 rounded-lg w-fit">
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
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">{t("admin.general_info")}</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.title_label")} *</label>
              <input 
                type="text" 
                name="title"
                value={lang === 'en' ? (formData as any).title_en || '' : formData.title || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" 
                placeholder={lang === 'th' ? "เช่น เกี่ยวกับเรา" : "e.g. About Us"} 
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
                placeholder="คำอธิบายเพจแบบสั้นๆ..."
              ></textarea>
            </div>
            
            <div>
              
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700">{t("admin.html_editor")}</label>
              <button 
                type="button"
                onClick={() => setIsRawHtml(!isRawHtml)}
                className="text-xs font-medium text-[#B87333] bg-[#B87333]/10 px-3 py-1 rounded hover:bg-[#B87333]/20 transition-colors"
              >
                {isRawHtml ? 'สลับเป็นแบบ Visual' : 'แก้ไขแบบ Raw HTML (รองรับ Bootstrap 5)'}
              </button>
            </div>

              <div className="bg-white">
                {isRawHtml ? (
                  <textarea
                    value={lang === 'en' ? (formData as any).content_en || '' : formData.content || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [lang === 'en' ? 'content_en' : 'content']: e.target.value }))}
                    className="w-full h-80 p-4 font-mono text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent"
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
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">{t("admin.scripts_label")}</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Header Script <span className="text-xs text-slate-400 font-normal ml-2">(สามารถใส่ link css bootstrap ได้ที่นี่)</span></label>
              <textarea 
                rows={3} 
                name="headerScript"
                value={formData.headerScript || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 font-mono text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" 
                placeholder="<script>...</script> หรือ <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css' rel='stylesheet'>"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.footer_script")}</label>
              <textarea 
                rows={3} 
                name="footerScript"
                value={formData.footerScript || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 font-mono text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" 
                placeholder="<script>...</script>"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">{t("admin.page_settings")}</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.slug_label")}</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                  /
                </span>
                <input 
                  type="text" 
                  name="slug"
                  value={formData.slug || ''}
                  onChange={handleChange}
                  className="flex-1 min-w-0 px-3 py-2 rounded-r-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" 
                  placeholder="about-us" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.favicon_url")}</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  name="favicon"
                  value={(formData as any).favicon || ''}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-sm" 
                  placeholder="https://example.com/favicon.ico" 
                />
              </div>
            </div>

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
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">{t("admin.seo_tags")}</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.seo_desc")}</label>
              <textarea 
                rows={3} 
                name="seoDescription"
                value={lang === 'en' ? (formData as any).seoDescription_en || '' : formData.seoDescription || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-sm" 
                placeholder="คำอธิบายสำหรับ Search Engine..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("admin.tags_label")}</label>
              <input 
                type="text" 
                name="tags"
                value={formData.tags || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-sm" 
                placeholder="คั่นด้วยเครื่องหมายลูกน้ำ (,)" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
