import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, Plus, Trash2, Save } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const AVAILABLE_ICONS = ['ChevronRight', 'Mail', 'Phone', 'MapPin', 'Facebook', 'Instagram', 'Youtube', 'Twitter', 'Globe', 'Briefcase', 'MessageSquare', 'Music2'];

export function FooterSettings({ settings, setSettings, saveSettings }: { settings: any, setSettings: any, saveSettings?: any }) {
  const { t } = useTranslation();
  const [previewLang, setPreviewLang] = useState<'th' | 'en'>('th');

  // Initialize footer data if empty
  useEffect(() => {
    if (!settings.footer || !settings.footer.topColumns) {
      setSettings((prev: any) => ({
        ...prev,
        footer: {
          ...(prev.footer || {}),
          ...{
  "bgColor": "#0B1120",
  "textColor": "#FFFFFF",
  "topColumns": [
    {
      "title": "ลิงก์ด่วน",
      "titleEn": "Quick Links",
      "links": [
        {
          "text": "หน้าหลัก",
          "textEn": "Home",
          "url": "/",
          "icon": ""
        },
        {
          "text": "เกี่ยวกับเรา",
          "textEn": "About Us",
          "url": "/about",
          "icon": ""
        },
        {
          "text": "บริการของเรา",
          "textEn": "Services",
          "url": "/service",
          "icon": ""
        },
        {
          "text": "ติดต่อเรา",
          "textEn": "Contact Us",
          "url": "/contact",
          "icon": ""
        }
      ]
    },
    {
      "title": "โซลูชันธุรกิจ",
      "titleEn": "Business Solutions",
      "links": [
        {
          "text": "พัฒนาเว็บไซต์ (Web Dev)",
          "textEn": "Web Development",
          "url": "#",
          "icon": ""
        },
        {
          "text": "พัฒนาซอฟต์แวร์ (Software Dev)",
          "textEn": "Software Development",
          "url": "#",
          "icon": ""
        },
        {
          "text": "โซลูชัน AI (AI Solutions)",
          "textEn": "AI Solutions",
          "url": "#",
          "icon": ""
        },
        {
          "text": "แพลตฟอร์มธุรกิจ (Business Platform)",
          "textEn": "Business Platform",
          "url": "#",
          "icon": ""
        },
        {
          "text": "การตลาดดิจิทัล (Digital Marketing)",
          "textEn": "Digital Marketing",
          "url": "#",
          "icon": ""
        }
      ]
    },
    {
      "title": "แหล่งความรู้",
      "titleEn": "Resources",
      "links": [
        {
          "text": "บทความ",
          "textEn": "Blog",
          "url": "/blog",
          "icon": ""
        },
        {
          "text": "คำถามที่พบบ่อย (FAQ)",
          "textEn": "FAQ",
          "url": "#",
          "icon": ""
        },
        {
          "text": "นโยบายความเป็นส่วนตัว (Privacy)",
          "textEn": "Privacy Policy",
          "url": "/privacy",
          "icon": ""
        },
        {
          "text": "ข้อกำหนดและเงื่อนไข (Terms)",
          "textEn": "Terms of Service",
          "url": "/terms",
          "icon": ""
        },
        {
          "text": "นโยบายคุกกี้ (Cookies)",
          "textEn": "Cookie Policy",
          "url": "/cookies",
          "icon": ""
        }
      ]
    },
    {
      "title": "ติดต่อเรา",
      "titleEn": "Contact Us",
      "links": [
        {
          "text": "Biztoptier@outlook.co.th",
          "textEn": "Biztoptier@outlook.co.th",
          "url": "mailto:Biztoptier@outlook.co.th",
          "icon": "Mail"
        },
        {
          "text": "0617898692",
          "textEn": "0617898692",
          "url": "tel:0617898692",
          "icon": "Phone"
        },
        {
          "text": "Facebook: Biz Top Tier",
          "textEn": "Facebook: Biz Top Tier",
          "url": "#",
          "icon": ""
        },
        {
          "text": "TikTok: Biz Top Tier",
          "textEn": "TikTok: Biz Top Tier",
          "url": "#",
          "icon": ""
        },
        {
          "text": "ที่อยู่: 21/129 ซอยศูนย์วิจัย ถนนพระราม 9 แขวงบางกะปิ เขตห้วยขวาง กรุงเทพมหานคร 10310",
          "textEn": "Address: 21/129 Soi Soonvijai, Rama 9 Road, Bang Kapi, Huai Khwang, Bangkok 10310",
          "url": "#",
          "icon": ""
        }
      ]
    }
  ],
  "middle": {
    "logoUrl": "",
    "title": "แพลตฟอร์มธุรกิจ เพื่อต่อยอดการขายและเพิ่มประสิทธิภาพองค์กร",
    "titleEn": "Business Platform to scale sales and optimize organizational efficiency",
    "description": "ช่วยให้ธุรกิจทุกขนาดเติบโตอย่างก้าวกระโดด ด้วยเทคโนโลยี โซลูชันดิจิทัล และนวัตกรรมทางธุรกิจ",
    "descriptionEn": "Helping businesses of all sizes grow exponentially with technology, digital solutions, and business innovation.",
    "contactTitle": "ติดต่อเรา",
    "contactTitleEn": "Contact Us",
    "email": "Biztoptier@outlook.co.th",
    "phone": "0617898692",
    "socialTitle": "Social Media",
    "social": [
      {
        "icon": "Facebook",
        "url": "#"
      },
      {
        "icon": "Music2",
        "url": "#"
      },
      {
        "icon": "Youtube",
        "url": "#"
      },
      {
        "icon": "Instagram",
        "url": "#"
      }
    ],
    "newsletterTitle": "สมัครรับข่าวสาร",
    "newsletterTitleEn": "Subscribe to our newsletter",
    "newsletterDesc": "ติดตามเทรนด์ธุรกิจ เทคโนโลยี และนวัตกรรมดิจิทัลก่อนใคร",
    "newsletterDescEn": "Follow business trends, technology and digital innovations before anyone else.",
    "newsletterPlaceholder": "กรอกอีเมลของคุณ",
    "newsletterPlaceholderEn": "Enter your email",
    "newsletterBtn": "ติดตาม",
    "newsletterBtnEn": "Subscribe",
    "legalLinks": [
      {
        "text": "Privacy Policy",
        "textEn": "Privacy Policy",
        "url": "/privacy"
      },
      {
        "text": "Terms of Service",
        "textEn": "Terms of Service",
        "url": "/terms"
      },
      {
        "text": "Cookie Policy",
        "textEn": "Cookie Policy",
        "url": "/cookies"
      },
      {
        "text": "PDPA",
        "textEn": "PDPA",
        "url": "/pdpa"
      },
      {
        "text": "Disclaimer",
        "textEn": "Disclaimer",
        "url": "/disclaimer"
      }
    ]
  },
  "bottom": {
    "copyright": "© 2026 Biz Top Tier Co., Ltd. สงวนลิขสิทธิ์.",
    "copyrightEn": "© 2026 Biz Top Tier Co., Ltd. All rights reserved.",
    "rightText": "แพลตฟอร์มธุรกิจ เพื่อต่อยอดการขายและเพิ่มประสิทธิภาพองค์กร",
    "rightTextEn": "Business Platform to scale sales and optimize organizational efficiency"
  }
}
        }
      }));
    }
  }, []);

  const footer = settings.footer?.topColumns ? settings.footer : {"bgColor":"#0B1120","textColor":"#FFFFFF","topColumns":[{"title":"ลิงก์ด่วน","titleEn":"Quick Links","links":[{"text":"หน้าหลัก","textEn":"Home","url":"/","icon":""},{"text":"เกี่ยวกับเรา","textEn":"About Us","url":"/about","icon":""},{"text":"บริการของเรา","textEn":"Services","url":"/service","icon":""},{"text":"ติดต่อเรา","textEn":"Contact Us","url":"/contact","icon":""}]},{"title":"โซลูชันธุรกิจ","titleEn":"Business Solutions","links":[{"text":"พัฒนาเว็บไซต์ (Web Dev)","textEn":"Web Development","url":"#","icon":""},{"text":"พัฒนาซอฟต์แวร์ (Software Dev)","textEn":"Software Development","url":"#","icon":""},{"text":"โซลูชัน AI (AI Solutions)","textEn":"AI Solutions","url":"#","icon":""},{"text":"แพลตฟอร์มธุรกิจ (Business Platform)","textEn":"Business Platform","url":"#","icon":""},{"text":"การตลาดดิจิทัล (Digital Marketing)","textEn":"Digital Marketing","url":"#","icon":""}]},{"title":"แหล่งความรู้","titleEn":"Resources","links":[{"text":"บทความ","textEn":"Blog","url":"/blog","icon":""},{"text":"คำถามที่พบบ่อย (FAQ)","textEn":"FAQ","url":"#","icon":""},{"text":"นโยบายความเป็นส่วนตัว (Privacy)","textEn":"Privacy Policy","url":"/privacy","icon":""},{"text":"ข้อกำหนดและเงื่อนไข (Terms)","textEn":"Terms of Service","url":"/terms","icon":""},{"text":"นโยบายคุกกี้ (Cookies)","textEn":"Cookie Policy","url":"/cookies","icon":""}]},{"title":"ติดต่อเรา","titleEn":"Contact Us","links":[{"text":"Biztoptier@outlook.co.th","textEn":"Biztoptier@outlook.co.th","url":"mailto:Biztoptier@outlook.co.th","icon":"Mail"},{"text":"0617898692","textEn":"0617898692","url":"tel:0617898692","icon":"Phone"},{"text":"Facebook: Biz Top Tier","textEn":"Facebook: Biz Top Tier","url":"#","icon":""},{"text":"TikTok: Biz Top Tier","textEn":"TikTok: Biz Top Tier","url":"#","icon":""},{"text":"ที่อยู่: 21/129 ซอยศูนย์วิจัย ถนนพระราม 9 แขวงบางกะปิ เขตห้วยขวาง กรุงเทพมหานคร 10310","textEn":"Address: 21/129 Soi Soonvijai, Rama 9 Road, Bang Kapi, Huai Khwang, Bangkok 10310","url":"#","icon":""}]}],"middle":{"logoUrl":"","title":"แพลตฟอร์มธุรกิจ เพื่อต่อยอดการขายและเพิ่มประสิทธิภาพองค์กร","titleEn":"Business Platform to scale sales and optimize organizational efficiency","description":"ช่วยให้ธุรกิจทุกขนาดเติบโตอย่างก้าวกระโดด ด้วยเทคโนโลยี โซลูชันดิจิทัล และนวัตกรรมทางธุรกิจ","descriptionEn":"Helping businesses of all sizes grow exponentially with technology, digital solutions, and business innovation.","contactTitle":"ติดต่อเรา","contactTitleEn":"Contact Us","email":"Biztoptier@outlook.co.th","phone":"0617898692","socialTitle":"Social Media","social":[{"icon":"Facebook","url":"#"},{"icon":"Music2","url":"#"},{"icon":"Youtube","url":"#"},{"icon":"Instagram","url":"#"}],"newsletterTitle":"สมัครรับข่าวสาร","newsletterTitleEn":"Subscribe to our newsletter","newsletterDesc":"ติดตามเทรนด์ธุรกิจ เทคโนโลยี และนวัตกรรมดิจิทัลก่อนใคร","newsletterDescEn":"Follow business trends, technology and digital innovations before anyone else.","newsletterPlaceholder":"กรอกอีเมลของคุณ","newsletterPlaceholderEn":"Enter your email","newsletterBtn":"ติดตาม","newsletterBtnEn":"Subscribe","legalLinks":[{"text":"Privacy Policy","textEn":"Privacy Policy","url":"/privacy"},{"text":"Terms of Service","textEn":"Terms of Service","url":"/terms"},{"text":"Cookie Policy","textEn":"Cookie Policy","url":"/cookies"},{"text":"PDPA","textEn":"PDPA","url":"/pdpa"},{"text":"Disclaimer","textEn":"Disclaimer","url":"/disclaimer"}]},"bottom":{"copyright":"© 2026 Biz Top Tier Co., Ltd. สงวนลิขสิทธิ์.","copyrightEn":"© 2026 Biz Top Tier Co., Ltd. All rights reserved.","rightText":"แพลตฟอร์มธุรกิจ เพื่อต่อยอดการขายและเพิ่มประสิทธิภาพองค์กร","rightTextEn":"Business Platform to scale sales and optimize organizational efficiency"}};

  const handleFooterChange = (field: string, value: any, nestedPath?: string[]) => {
    setSettings((prev: any) => {
      const newFooter = { ...prev.footer };
      if (nestedPath && nestedPath.length > 0) {
        let current = newFooter;
        for (let i = 0; i < nestedPath.length; i++) {
          current[nestedPath[i]] = { ...current[nestedPath[i]] };
          current = current[nestedPath[i]];
        }
        current[field] = value;
      } else {
        newFooter[field] = value;
      }
      return { ...prev, footer: newFooter };
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFooterChange('logoUrl', reader.result, ['middle']);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTopColumn = () => {
    const current = [...(footer.topColumns || [])];
    current.push({ title: 'หมวดหมู่ใหม่', titleEn: 'New Column', links: [] });
    handleFooterChange('topColumns', current);
  };

  const removeTopColumn = (index: number) => {
    const current = [...(footer.topColumns || [])];
    current.splice(index, 1);
    handleFooterChange('topColumns', current);
  };

  const updateTopColumn = (index: number, field: string, value: any) => {
    const current = [...(footer.topColumns || [])];
    current[index] = { ...current[index], [field]: value };
    handleFooterChange('topColumns', current);
  };

  const addTopLink = (colIndex: number) => {
    const current = [...(footer.topColumns || [])];
    current[colIndex] = { ...current[colIndex], links: [...(current[colIndex].links || [])] };
    current[colIndex].links.push({ text: 'ลิงก์ใหม่', textEn: 'New Link', url: '/', icon: '' });
    handleFooterChange('topColumns', current);
  };

  const removeTopLink = (colIndex: number, linkIndex: number) => {
    const current = [...(footer.topColumns || [])];
    current[colIndex] = { ...current[colIndex], links: [...(current[colIndex].links || [])] };
    current[colIndex].links.splice(linkIndex, 1);
    handleFooterChange('topColumns', current);
  };

  const updateTopLink = (colIndex: number, linkIndex: number, field: string, value: any) => {
    const current = [...(footer.topColumns || [])];
    current[colIndex] = { ...current[colIndex], links: [...(current[colIndex].links || [])] };
    current[colIndex].links[linkIndex] = { ...current[colIndex].links[linkIndex], [field]: value };
    handleFooterChange('topColumns', current);
  };

  const addSocial = () => {
    const current = [...(footer.middle?.social || [])];
    current.push({ icon: 'Facebook', url: '#' });
    handleFooterChange('social', current, ['middle']);
  };

  const removeSocial = (index: number) => {
    const current = [...(footer.middle?.social || [])];
    current.splice(index, 1);
    handleFooterChange('social', current, ['middle']);
  };

  const updateSocial = (index: number, field: string, value: any) => {
    const current = [...(footer.middle?.social || [])];
    current[index] = { ...current[index], [field]: value };
    handleFooterChange('social', current, ['middle']);
  };

  const IconComponent = ({ name, className }: { name: string, className?: string }) => {
    const Icon = (LucideIcons as any)[name];
    if (!Icon) return null;
    return <Icon className={className} />;
  };

  const bgColor = footer.bgColor || '#0B1120';
  const textColor = footer.textColor || '#FFFFFF';
  const headingColor = footer.headingColor || '#FFFFFF';

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Footer Style & Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Background Color</label>
            <div className="flex gap-2">
              <input type="color" value={bgColor} onChange={e => handleFooterChange('bgColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
              <input type="text" value={bgColor} onChange={e => handleFooterChange('bgColor', e.target.value)} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary uppercase" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Text Color</label>
            <div className="flex gap-2">
              <input type="color" value={textColor} onChange={e => handleFooterChange('textColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
              <input type="text" value={textColor} onChange={e => handleFooterChange('textColor', e.target.value)} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary uppercase" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Heading Color</label>
            <div className="flex gap-2">
              <input type="color" value={headingColor} onChange={e => handleFooterChange('headingColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
              <input type="text" value={headingColor} onChange={e => handleFooterChange('headingColor', e.target.value)} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary uppercase" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Top Section (ลิงก์ด่วน & หมวดหมู่)</h2>
          <button onClick={addTopColumn} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Column
          </button>
        </div>
        
        <div className="space-y-6">
          {(footer.topColumns || []).map((col: any, colIdx: number) => (
            <div key={colIdx} className="border border-slate-200 rounded-lg p-4 bg-slate-50 relative">
              <button onClick={() => removeTopColumn(colIdx)} className="absolute top-4 right-4 text-rose-500 hover:bg-rose-100 p-1.5 rounded transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-10">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Column Title (TH)</label>
                  <input type="text" value={col.title || ''} onChange={e => updateTopColumn(colIdx, 'title', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Column Title (EN)</label>
                  <input type="text" value={col.titleEn || ''} onChange={e => updateTopColumn(colIdx, 'titleEn', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>

              <div className="space-y-3 pl-4 border-l-2 border-slate-200">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Links</h4>
                {(col.links || []).map((link: any, linkIdx: number) => (
                  <div key={linkIdx} className="flex flex-wrap items-center gap-2 bg-white p-2 rounded border border-slate-200">
                    <select value={link.icon || ''} onChange={e => updateTopLink(colIdx, linkIdx, 'icon', e.target.value)} className="w-24 px-1 py-1.5 text-sm border border-slate-300 rounded focus:outline-none">
                      <option value="">No Icon</option>
                      {AVAILABLE_ICONS.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                    <input type="text" value={link.text || ''} onChange={e => updateTopLink(colIdx, linkIdx, 'text', e.target.value)} placeholder="Text (TH)" className="w-32 px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                    <input type="text" value={link.textEn || ''} onChange={e => updateTopLink(colIdx, linkIdx, 'textEn', e.target.value)} placeholder="Text (EN)" className="w-32 px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                    <input type="text" value={link.url || ''} onChange={e => updateTopLink(colIdx, linkIdx, 'url', e.target.value)} placeholder="URL (/path or https://)" className="flex-1 min-w-[150px] px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                    <button onClick={() => removeTopLink(colIdx, linkIdx)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button onClick={() => addTopLink(colIdx)} className="flex items-center gap-1 px-2 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors text-xs font-medium mt-2">
                  <Plus className="w-3 h-3" /> Add Link
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">Middle Section (โลโก้, บริษัท, Social & Newsletter)</h2>
        </div>
        
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-6">
            <h3 className="text-md font-bold text-slate-800 mb-3">Logo & Company Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Footer Logo URL (or Upload)</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1 space-y-2">
                    <input type="text" value={footer.middle?.logoUrl || ''} onChange={e => handleFooterChange('logoUrl', e.target.value, ['middle'])} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://..." />
                    <div className="relative">
                      <input type="file" className="hidden" id="footer-logo-upload" accept="image/*" onChange={handleLogoUpload} />
                      <label htmlFor="footer-logo-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors text-sm font-medium">
                        <Upload className="w-4 h-4" /> Upload New Logo
                      </label>
                    </div>
                  </div>
                  {footer.middle?.logoUrl && (
                    <div className="relative p-4 border border-slate-200 rounded-lg flex items-center justify-center min-w-[120px]" style={{ backgroundColor: bgColor }}>
                      <img src={footer.middle.logoUrl} alt="Logo Preview" className="h-10 object-contain" />
                      <button onClick={() => handleFooterChange('logoUrl', '', ['middle'])} className="absolute -top-2 -right-2 bg-rose-100 text-rose-600 p-1 rounded-full hover:bg-rose-200">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Title (TH)</label>
                  <input type="text" value={footer.middle?.title || ''} onChange={e => handleFooterChange('title', e.target.value, ['middle'])} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Title (EN)</label>
                  <input type="text" value={footer.middle?.titleEn || ''} onChange={e => handleFooterChange('titleEn', e.target.value, ['middle'])} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">Description (TH)</label>
                  <textarea value={footer.middle?.description || ''} onChange={e => handleFooterChange('description', e.target.value, ['middle'])} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">Description (EN)</label>
                  <textarea value={footer.middle?.descriptionEn || ''} onChange={e => handleFooterChange('descriptionEn', e.target.value, ['middle'])} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-100 pb-6">
            <h3 className="text-md font-bold text-slate-800 mb-3">Contact & Social</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Contact Title (TH)</label>
                    <input type="text" value={footer.middle?.contactTitle || ''} onChange={e => handleFooterChange('contactTitle', e.target.value, ['middle'])} className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Contact Title (EN)</label>
                    <input type="text" value={footer.middle?.contactTitleEn || ''} onChange={e => handleFooterChange('contactTitleEn', e.target.value, ['middle'])} className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Email</label>
                  <input type="text" value={footer.middle?.email || ''} onChange={e => handleFooterChange('email', e.target.value, ['middle'])} className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Phone</label>
                  <input type="text" value={footer.middle?.phone || ''} onChange={e => handleFooterChange('phone', e.target.value, ['middle'])} className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-800">Social Media Links</label>
                  <button onClick={addSocial} className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors text-xs font-medium">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {(footer.middle?.social || []).map((soc: any, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <select value={soc.icon || 'Facebook'} onChange={e => updateSocial(idx, 'icon', e.target.value)} className="w-24 px-1 py-1.5 text-sm border border-slate-300 rounded focus:outline-none">
                        {AVAILABLE_ICONS.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                      <input type="text" value={soc.url || ''} onChange={e => updateSocial(idx, 'url', e.target.value)} placeholder="URL" className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
                      <button onClick={() => removeSocial(idx)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-bold text-slate-800 mb-3">Newsletter & Legal Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Newsletter Title (TH/EN)</label>
                <div className="flex gap-2">
                  <input type="text" value={footer.middle?.newsletterTitle || ''} onChange={e => handleFooterChange('newsletterTitle', e.target.value, ['middle'])} placeholder="TH" className="w-1/2 px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                  <input type="text" value={footer.middle?.newsletterTitleEn || ''} onChange={e => handleFooterChange('newsletterTitleEn', e.target.value, ['middle'])} placeholder="EN" className="w-1/2 px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Newsletter Desc (TH/EN)</label>
                <div className="flex gap-2">
                  <input type="text" value={footer.middle?.newsletterDesc || ''} onChange={e => handleFooterChange('newsletterDesc', e.target.value, ['middle'])} placeholder="TH" className="w-1/2 px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                  <input type="text" value={footer.middle?.newsletterDescEn || ''} onChange={e => handleFooterChange('newsletterDescEn', e.target.value, ['middle'])} placeholder="EN" className="w-1/2 px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Button Text (TH/EN)</label>
                <div className="flex gap-2">
                  <input type="text" value={footer.middle?.newsletterBtn || ''} onChange={e => handleFooterChange('newsletterBtn', e.target.value, ['middle'])} placeholder="TH" className="w-1/2 px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                  <input type="text" value={footer.middle?.newsletterBtnEn || ''} onChange={e => handleFooterChange('newsletterBtnEn', e.target.value, ['middle'])} placeholder="EN" className="w-1/2 px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
              </div>
            </div>
            
            <div>
               <label className="block text-xs font-bold text-slate-800 mb-2">Legal Links (Edit via Code for now, or add UI if needed)</label>
               <p className="text-xs text-slate-500">Legal links are pre-populated based on standard requirements.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Bottom Section (Copyright)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Copyright (TH)</label>
            <input type="text" value={footer.bottom?.copyright || ''} onChange={e => handleFooterChange('copyright', e.target.value, ['bottom'])} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Copyright (EN)</label>
            <input type="text" value={footer.bottom?.copyrightEn || ''} onChange={e => handleFooterChange('copyrightEn', e.target.value, ['bottom'])} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Right Text (TH)</label>
            <input type="text" value={footer.bottom?.rightText || ''} onChange={e => handleFooterChange('rightText', e.target.value, ['bottom'])} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Right Text (EN)</label>
            <input type="text" value={footer.bottom?.rightTextEn || ''} onChange={e => handleFooterChange('rightTextEn', e.target.value, ['bottom'])} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Footer Preview</h2>
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button onClick={() => setPreviewLang('th')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${previewLang === 'th' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}>TH</button>
            <button onClick={() => setPreviewLang('en')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${previewLang === 'en' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}>EN</button>
          </div>
        </div>

        {/* The actual preview */}
        <div className="p-8 shadow-sm transition-colors text-sm" style={{ backgroundColor: bgColor, color: textColor }}>
          {/* Top Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 border-b pb-12" style={{ borderColor: 'color-mix(in srgb, currentcolor 10%, transparent)' }}>
            {(footer.topColumns || []).map((col: any, colIdx: number) => (
              <div key={colIdx}>
                <h4 className="font-bold mb-6 text-base" style={{ color: headingColor }}>{previewLang === 'en' && col.titleEn ? col.titleEn : col.title}</h4>
                <ul className="space-y-4 opacity-80">
                  {(col.links || []).map((link: any, linkIdx: number) => (
                    <li key={linkIdx}>
                      <a href={link.url || '#'} className="flex items-start gap-2 hover:opacity-100 transition-opacity">
                        {link.icon && <IconComponent name={link.icon} className="w-4 h-4 shrink-0 mt-0.5" />}
                        <span>{previewLang === 'en' && link.textEn ? link.textEn : link.text}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Middle Section */}
          <div className="flex flex-col lg:flex-row gap-12 mb-12 border-b pb-12" style={{ borderColor: 'color-mix(in srgb, currentcolor 10%, transparent)' }}>
            <div className="lg:w-1/2 space-y-8">
              <div>
                {footer.middle?.logoUrl ? (
                  <img src={footer.middle.logoUrl} alt="Logo" className="h-10 object-contain mb-4" />
                ) : (
                  <div className="text-2xl font-bold mb-4" style={{ color: headingColor }}>LOGO</div>
                )}
                <h3 className="text-xl font-bold mb-2" style={{ color: headingColor }}>{previewLang === 'en' && footer.middle?.titleEn ? footer.middle.titleEn : footer.middle?.title}</h3>
                <p className="opacity-70 leading-relaxed text-sm">
                  {previewLang === 'en' && footer.middle?.descriptionEn ? footer.middle.descriptionEn : footer.middle?.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-12">
                <div>
                  <h4 className="font-bold mb-4" style={{ color: headingColor }}>{previewLang === 'en' && footer.middle?.contactTitleEn ? footer.middle.contactTitleEn : footer.middle?.contactTitle}</h4>
                  <ul className="space-y-2 opacity-80">
                    <li className="flex items-center gap-2"><LucideIcons.Mail className="w-4 h-4" /> <a href="#" className="hover:opacity-100">{footer.middle?.email}</a></li>
                    <li className="flex items-center gap-2"><LucideIcons.Phone className="w-4 h-4" /> {footer.middle?.phone}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4" style={{ color: headingColor }}>{footer.middle?.socialTitle || 'Social Media'}</h4>
                  <div className="flex gap-3">
                    {(footer.middle?.social || []).map((soc: any, idx: number) => (
                      <a key={idx} href={soc.url} className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-white/10 transition-colors" style={{ borderColor: 'color-mix(in srgb, currentcolor 20%, transparent)' }}>
                         <IconComponent name={soc.icon || 'Facebook'} className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 flex flex-col">
              <h3 className="text-xl font-bold mb-2" style={{ color: headingColor }}>{previewLang === 'en' && footer.middle?.newsletterTitleEn ? footer.middle.newsletterTitleEn : footer.middle?.newsletterTitle}</h3>
              <p className="opacity-70 mb-6">{previewLang === 'en' && footer.middle?.newsletterDescEn ? footer.middle.newsletterDescEn : footer.middle?.newsletterDesc}</p>
              
              <div className="flex rounded-full p-1 border mb-auto" style={{ backgroundColor: 'color-mix(in srgb, currentcolor 5%, transparent)', borderColor: 'color-mix(in srgb, currentcolor 10%, transparent)' }}>
                <input type="text" placeholder={previewLang === 'en' && footer.middle?.newsletterPlaceholderEn ? footer.middle.newsletterPlaceholderEn : footer.middle?.newsletterPlaceholder} className="bg-transparent px-4 py-2 w-full focus:outline-none" style={{ color: textColor }} />
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium transition-colors shrink-0">
                  {previewLang === 'en' && footer.middle?.newsletterBtnEn ? footer.middle.newsletterBtnEn : footer.middle?.newsletterBtn}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-8 text-xs opacity-60">
                {(footer.middle?.legalLinks || []).map((link: any, idx: number) => (
                  <React.Fragment key={idx}>
                    <a href={link.url} className="hover:opacity-100">{previewLang === 'en' && link.textEn ? link.textEn : link.text}</a>
                    {idx < (footer.middle?.legalLinks?.length || 0) - 1 && <span>|</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
            <p>{previewLang === 'en' && footer.bottom?.copyrightEn ? footer.bottom.copyrightEn : footer.bottom?.copyright}</p>
            <p>{previewLang === 'en' && footer.bottom?.rightTextEn ? footer.bottom.rightTextEn : footer.bottom?.rightText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
