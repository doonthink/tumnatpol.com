import fs from 'fs';

let content = fs.readFileSync('src/admin/pages/PageForm.tsx', 'utf-8');

// We need to modify the input values and onChange bindings based on `lang`
// For example: value={lang === 'en' ? formData.title_en || '' : formData.title || ''}
// And in handleChange we need to check if the field is lang-specific.

content = content.replace(
  "value={formData.title}",
  "value={lang === 'en' ? (formData as any).title_en || '' : formData.title || ''}"
).replace(
  "value={formData.description}",
  "value={lang === 'en' ? (formData as any).description_en || '' : formData.description || ''}"
).replace(
  "value={formData.seoDescription}",
  "value={lang === 'en' ? (formData as any).seoDescription_en || '' : formData.seoDescription || ''}"
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
    const langSpecific = ['title', 'description', 'seoDescription'].includes(name);
    const key = (langSpecific && lang === 'en') ? name + '_en' : name;
    setFormData(prev => ({ ...prev, [key]: value }));
  };
`;

content = content.replace(
  /const handleChange = \(e: React\.ChangeEvent<HTMLInputElement \| HTMLTextAreaElement \| HTMLSelectElement>\) => \{[\s\S]*?setFormData\(prev => \(\{ \.\.\.prev, \[name\]: value \}\)\);\s*\};/,
  handleChangeReplacement
);

fs.writeFileSync('src/admin/pages/PageForm.tsx', content);
