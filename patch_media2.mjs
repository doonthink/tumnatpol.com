import fs from 'fs';

let content = fs.readFileSync('src/admin/media/MediaLibrary.tsx', 'utf8');

// Move folders to inside component
content = content.replace(
  /const folders = \[\s*\{ id: 1, name: 'Banners', count: 12 \},\s*\{ id: 2, name: 'Documents', count: 45 \},\s*\{ id: 3, name: 'Products', count: 128 \},\s*\{ id: 4, name: 'Blog Assets', count: 56 \},\s*\];/,
  ''
);

const stateInit = `
  const [folders, setFolders] = useState([
    { id: 1, name: 'Banners', count: 12 },
    { id: 2, name: 'Documents', count: 45 },
    { id: 3, name: 'Products', count: 128 },
    { id: 4, name: 'Blog Assets', count: 56 },
  ]);
  const [activeFolder, setActiveFolder] = useState<number | null>(null);

  const handleNewFolder = () => {
    const name = prompt('Enter folder name:');
    if (name) {
      setFolders([...folders, { id: Date.now(), name, count: 0 }]);
    }
  };
`;

content = content.replace(
  "const [mediaItems, setMediaItems] = useState<any[]>([]);",
  "const [mediaItems, setMediaItems] = useState<any[]>([]);\n" + stateInit
);

content = content.replace(
  /body: JSON\.stringify\(\{([\s\S]*?)url: url\n\s*\}\)/,
  "body: JSON.stringify({$1url: url, folderId: activeFolder\n        })"
);

content = content.replace(
  /<button onClick=\{\(\) => alert\('New folder created! \(Demo\)'\)\} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">\n\s*<Folder className="w-4 h-4" \/> New Folder\n\s*<\/button>\n\s*<button onClick=\{addMedia\} className="px-4 py-2 bg-\[#0D1B3D\] text-white rounded-lg text-sm font-medium hover:bg-\[#0a152e\] transition-colors shadow-md flex items-center gap-2">\n\s*<Upload className="w-4 h-4" \/> Upload Files\n\s*<\/button>/,
  `<button onClick={handleNewFolder} className="px-4 py-2 bg-[#0D1B3D] text-white border border-[#0D1B3D] rounded-lg text-sm font-medium hover:bg-[#0D1B3D]/90 transition-colors flex items-center gap-2">
            <Folder className="w-4 h-4" /> New Folder
          </button>`
);

const allFilesBtnOld = `<button onClick={() => {}} className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium text-sm">
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 fill-blue-200" /> All Files
                  </div>
                  <span className="text-xs bg-white px-2 py-0.5 rounded-full text-blue-600">241</span>
                </button>`;
const allFilesBtnNew = `<button onClick={() => setActiveFolder(null)} className={\`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-sm transition-colors \${activeFolder === null ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>
                  <div className="flex items-center gap-2">
                    <Folder className={\`w-4 h-4 \${activeFolder === null ? 'fill-blue-200 text-blue-200' : 'text-slate-400'}\`} /> All Files
                  </div>
                  <span className={\`text-xs px-2 py-0.5 rounded-full \${activeFolder === null ? 'bg-white text-blue-600' : 'text-slate-400'}\`}>{mediaItems.length}</span>
                </button>`;
content = content.replace(allFilesBtnOld, allFilesBtnNew);

const folderMapOld = `{folders.map(folder => (
                <li key={folder.id}>
                  <button onClick={() => {}} className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors text-sm">
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4 text-slate-400" /> {folder.name}
                    </div>
                    <span className="text-xs text-slate-400">{folder.count}</span>
                  </button>
                </li>
              ))}`;
const folderMapNew = `{folders.map(folder => (
                <li key={folder.id}>
                  <button onClick={() => setActiveFolder(folder.id)} className={\`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-sm transition-colors \${activeFolder === folder.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>
                    <div className="flex items-center gap-2">
                      <Folder className={\`w-4 h-4 \${activeFolder === folder.id ? 'fill-blue-200 text-blue-200' : 'text-slate-400'}\`} /> {folder.name}
                    </div>
                    <span className={\`text-xs px-2 py-0.5 rounded-full \${activeFolder === folder.id ? 'bg-white text-blue-600' : 'text-slate-400'}\`}>{mediaItems.filter(m => m.folderId === folder.id).length || folder.count}</span>
                  </button>
                </li>
              ))}`;
content = content.replace(folderMapOld, folderMapNew);

content = content.replace(/\{mediaItems\.length === 0 && \(/g, '{displayedMedia.length === 0 && (');
content = content.replace(/\{mediaItems\.map\(item => \(/g, '{displayedMedia.map(item => (');

content = content.replace("return (", `
  const displayedMedia = activeFolder === null 
    ? mediaItems 
    : mediaItems.filter(item => item.folderId === activeFolder);
  
  return (`);

fs.writeFileSync('src/admin/media/MediaLibrary.tsx', content);
