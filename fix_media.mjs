import fs from 'fs';

let content = fs.readFileSync('src/admin/media/MediaLibrary.tsx', 'utf8');

// Replace initialMedia array with empty array
content = content.replace(/const initialMedia = \[[\s\S]*?\];/, 'const initialMedia: any[] = [];');

// Add "No files" UI
const emptyStateList = `
                    {mediaItems.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                          ยังไม่มีข้อมูลไฟล์ที่อัปโหลด
                        </td>
                      </tr>
                    )}
`;
content = content.replace(/<tbody className="divide-y divide-slate-100">/, '<tbody className="divide-y divide-slate-100">' + emptyStateList);

const emptyStateGrid = `
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {mediaItems.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-lg border border-slate-200">
                    ยังไม่มีข้อมูลไฟล์ที่อัปโหลด
                  </div>
                )}
`;
content = content.replace(/<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">/, emptyStateGrid);


// Update addMedia
const newAddMedia = `
  const addMedia = () => {
    const name = prompt("Enter file name (e.g., banner.jpg)");
    if (!name) return;
    const type = name.endsWith('.jpg') || name.endsWith('.png') ? 'image' : name.endsWith('.pdf') ? 'document' : 'video';
    const newItem = {
      id: Date.now().toString(),
      name,
      type,
      size: Math.floor(Math.random() * 10) + 1 + ' MB',
      date: 'Just now',
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    };
    setMediaItems([newItem, ...mediaItems]);
  };
`;
content = content.replace(/const addMedia = \(\) => \{[\s\S]*?\};/, newAddMedia.trim());

// Update buttons that alert
content = content.replace(/onClick=\{\(\) => alert\("Download functionality coming soon"\)\}/g, 'onClick={() => {}}');
content = content.replace(/onClick=\{\(\) => alert\("Filtering[^\"]+"\)\}/g, 'onClick={() => {}}');

fs.writeFileSync('src/admin/media/MediaLibrary.tsx', content);
console.log("Updated MediaLibrary.tsx");
