import fs from 'fs';
let content = fs.readFileSync('src/admin/media/MediaLibrary.tsx', 'utf8');

// Replace addMedia
const newAddMedia = `
  const addMedia = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf,video/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document';
        const newItem = {
          id: Date.now().toString(),
          name: file.name,
          type,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          date: 'Just now',
          url: reader.result as string
        };
        setMediaItems([newItem, ...mediaItems]);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };
`;
content = content.replace(/const addMedia = \(\) => \{[\s\S]*?setMediaItems\(\[newItem, \.\.\.mediaItems\]\);\n  \};/, newAddMedia.trim());

fs.writeFileSync('src/admin/media/MediaLibrary.tsx', content);
console.log("Updated MediaLibrary.tsx file upload");
