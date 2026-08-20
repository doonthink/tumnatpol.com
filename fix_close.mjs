import fs from 'fs';

let content = fs.readFileSync('src/admin/media/MediaLibrary.tsx', 'utf8');
content = content.replace(
  '<Download className="w-4 h-4" />\n                             </button>\n                             <button onClick={() => deleteMedia(item.id)}',
  '<Download className="w-4 h-4" />\n                             </a>\n                             <button onClick={() => deleteMedia(item.id)}'
);
fs.writeFileSync('src/admin/media/MediaLibrary.tsx', content);
