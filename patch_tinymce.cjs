const fs = require('fs');
const glob = require('glob');

const files = [
  'src/admin/services/ServiceForm.tsx',
  'src/admin/pages/PageForm.tsx',
  'src/admin/videos/VideoForm.tsx',
  'src/admin/blogs/BlogForm.tsx'
];

const handler = `
                            images_upload_handler: async (blobInfo, progress) => {
                              return new Promise(async (resolve, reject) => {
                                try {
                                  const file = blobInfo.blob();
                                  const { compressImage } = await import('../../lib/imageUtils');
                                  const base64 = await compressImage(file, 1000, 0.8);
                                  resolve(base64);
                                } catch (err) {
                                  reject('Image upload failed: ' + err.message);
                                }
                              });
                            },`;

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('images_upload_handler')) {
      content = content.replace(/init=\{\{/g, `init={{\n${handler}`);
      fs.writeFileSync(file, content);
      console.log(`Patched ${file}`);
    } else {
      console.log(`Already patched ${file}`);
    }
  }
});
