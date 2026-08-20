import fs from 'fs';

let content = fs.readFileSync('src/admin/blogs/BlogForm.tsx', 'utf-8');

// Add lang state
if (!content.includes('const [lang, setLang]')) {
  content = content.replace(
    'const [loading, setLoading] = useState(false);',
    "const [lang, setLang] = useState<'th' | 'en'>('th');\n  const [loading, setLoading] = useState(false);"
  );
}

// Add Language Toggle UI
if (!content.includes('Language Toggle')) {
  content = content.replace(
    '<div className="grid grid-cols-3 gap-6">',
    `{/* Language Toggle */}
      <div className="flex bg-slate-200/50 p-1 rounded-lg w-fit mb-6">
        <button 
          onClick={() => setLang('th')}
          className={\`px-6 py-2 rounded-md font-medium text-sm transition-colors \${lang === 'th' ? 'bg-white text-[#0D1B3D] shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
        >
          ภาษาไทย (TH)
        </button>
        <button 
          onClick={() => setLang('en')}
          className={\`px-6 py-2 rounded-md font-medium text-sm transition-colors \${lang === 'en' ? 'bg-white text-[#0D1B3D] shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
        >
          English (EN)
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-6">`
  );
}

// Update inputs
content = content.replace(
  "value={formData.title}",
  "value={lang === 'en' ? (formData as any).title_en || '' : formData.title || ''}"
).replace(
  "value={formData.description}",
  "value={lang === 'en' ? (formData as any).description_en || '' : formData.description || ''}"
).replace(
  /onChange=\{\(content: string\) => setFormData\(prev => \(\{ \.\.\.prev, content \}\)\)\}/g,
  "onChange={(content: string) => setFormData(prev => ({ ...prev, [lang === 'en' ? 'content_en' : 'content']: content }))}"
).replace(
  "value={formData.content}",
  "value={lang === 'en' ? (formData as any).content_en || '' : formData.content || ''}"
);

const handleChangeReplacement = `
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const langSpecific = ['title', 'description'].includes(name);
    const key = (langSpecific && lang === 'en') ? name + '_en' : name;
    setFormData(prev => ({ ...prev, [key]: value }));
  };
`;

content = content.replace(
  /const handleChange = \(e: React\.ChangeEvent<HTMLInputElement \| HTMLTextAreaElement \| HTMLSelectElement>\) => \{[\s\S]*?setFormData\(prev => \(\{ \.\.\.prev, \[name\]: value \}\)\);\s*\};/,
  handleChangeReplacement
);

fs.writeFileSync('src/admin/blogs/BlogForm.tsx', content);
