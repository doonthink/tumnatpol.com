import fs from 'fs';
const file = 'src/admin/videos/VideoForm.tsx';
let code = fs.readFileSync(file, 'utf-8');

const newSubmit = `
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
    setUploadProgress(10); 

    try {
      let uploadedThumbnail = thumbnailPreview;
      let uploadedVideo = videoPreview;

      // Upload thumbnail as Base64 (Compressed)
      if (thumbnailFile) {
        setUploadProgress(30);
        const reader = new FileReader();
        uploadedThumbnail = await new Promise((resolve) => {
          reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              const maxDim = 1200;
              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                } else {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.85));
              } else {
                resolve(ev.target?.result as string);
              }
            };
            img.src = ev.target?.result as string;
          };
          reader.readAsDataURL(thumbnailFile);
        });
      }

      // Upload Video
      if (videoFile) {
        setUploadProgress(50);
        const uploadData = new FormData();
        uploadData.append('file', videoFile);
        const uploadRes = await fetch('/api/videos/upload', {
          method: 'POST',
          body: uploadData
        });
        if (!uploadRes.ok) throw new Error('Video upload failed');
        const uploadResult = await uploadRes.json();
        if (uploadResult.url) {
          uploadedVideo = uploadResult.url;
        }
      }

      setUploadProgress(80);

      const finalData = {
`;

const startIndex = code.indexOf('const handleSubmit = async (e: React.FormEvent) => {');
const endIndex = code.indexOf('const finalData = {', startIndex);
if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + newSubmit.trim() + '\n      ' + code.substring(endIndex);
  fs.writeFileSync(file, code);
  console.log("Patched VideoForm.tsx");
} else {
  console.log("Failed to find bounds in VideoForm.tsx");
}
