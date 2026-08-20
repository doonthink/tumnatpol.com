import fs from 'fs';
let content = fs.readFileSync('src/admin/banners/BannerList.tsx', 'utf8');

const oldUpload = `  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      setFormData({ ...formData, image: data.url });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };`;

const newUpload = `  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };`;

content = content.replace(oldUpload, newUpload);
fs.writeFileSync('src/admin/banners/BannerList.tsx', content);
