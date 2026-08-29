import fs from 'fs';
const file = 'src/admin/media/MediaLibrary.tsx';
let code = fs.readFileSync(file, 'utf-8');

const replacement = `
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    let fileType = 'document';
    if (file.type.startsWith('image/')) fileType = 'image';
    else if (file.type.startsWith('video/')) fileType = 'video';
    
    let sizeFormatted = (file.size / 1024).toFixed(1) + ' KB';
    if (file.size > 1024 * 1024) {
      sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    }

    try {
      let finalUrl = '';
      
      if (fileType === 'image') {
        const reader = new FileReader();
        finalUrl = await new Promise((resolve) => {
          reader.onload = (e) => {
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
                resolve(e.target?.result as string);
              }
            };
            img.src = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        });
      } else {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch('/api/videos/upload', {
          method: 'POST',
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalUrl = uploadData.url;
        } else {
          throw new Error('Upload failed');
        }
      }

      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          type: fileType,
          size: sizeFormatted,
          date: new Date().toISOString().split('T')[0],
          url: finalUrl,
          folderId: activeFolder
        })
      });

      if (res.ok) {
        fetchMedia();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Upload failed');
    }
  };
`;

const startIndex = code.indexOf('const handleFileUpload');
const endIndex = code.indexOf('};', code.indexOf('alert(\'Upload failed.\');')) + 2;

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + replacement.trim() + code.substring(endIndex + 4);
  fs.writeFileSync(file, code);
  console.log("Patched MediaLibrary.tsx successfully");
} else {
  console.log("Could not find start/end bounds.");
}
