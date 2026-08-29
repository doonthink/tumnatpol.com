import React, { useState, useEffect } from 'react';
import { Upload, Search, Filter, Folder, Image as ImageIcon, FileText, Video, MoreVertical, Trash2, Edit2, Download, Grid, List, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';



export function MediaLibrary() {
  const { t } = useTranslation();
  const [view, setView] = useState('grid');
  const [mediaItems, setMediaItems] = useState<any[]>([]);

  const [folders, setFolders] = useState([
    { id: 1, name: 'Banners', count: 0 },
    { id: 2, name: 'Documents', count: 0 },
    { id: 3, name: 'Products', count: 0 },
    { id: 4, name: 'Blog Assets', count: 0 },
  ]);
  const [activeFolder, setActiveFolder] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleNewFolder = () => {
    const name = prompt('Enter folder name:');
    if (name) {
      setFolders([...folders, { id: Date.now(), name, count: 0 }]);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      setMediaItems(data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
  };const handleCopy = (url: string) => {
    const fullUrl = url.startsWith('/') ? window.location.origin + url : url;
    navigator.clipboard.writeText(fullUrl);
    alert('คัดลอกที่อยู่รูปภาพแล้ว (Copied to clipboard)');
  };

  const handleDownload = async (e: React.MouseEvent, url: string, filename: string) => {
    e.preventDefault();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
      window.open(url, '_blank');
    }
  };

  const deleteMedia = async (id: string) => {
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMediaItems(mediaItems.filter(m => String(m.id) !== String(id)));
        setConfirmDeleteId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  
  const displayedMedia = activeFolder === null 
    ? mediaItems 
    : mediaItems.filter(item => item.folderId === activeFolder);
  
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("admin.media_library")}</h1>
          <p className="text-sm text-slate-500 mt-1">{t("admin.media_desc")}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleNewFolder} className="px-4 py-2 bg-[#0D1B3D] text-white border border-[#0D1B3D] rounded-lg text-sm font-medium hover:bg-[#0D1B3D]/90 transition-colors flex items-center gap-2">
            <Folder className="w-4 h-4" /> New Folder
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder={t("admin.search")} 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
              <button 
                onClick={() => setView('grid')} 
                className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-[#0D1B3D]' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setView('list')} 
                className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-white shadow-sm text-[#0D1B3D]' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button onClick={() => {}} className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Folders Sidebar */}
          <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/50 p-4 overflow-y-auto shrink-0">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t("admin.folders")}</h3>
            <ul className="space-y-1">
              <li>
                <button onClick={() => setActiveFolder(null)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-sm transition-colors ${activeFolder === null ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <div className="flex items-center gap-2">
                    <Folder className={`w-4 h-4 ${activeFolder === null ? 'fill-blue-200 text-blue-200' : 'text-slate-400'}`} /> All Files
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeFolder === null ? 'bg-white text-blue-600' : 'text-slate-400'}`}>{mediaItems.length}</span>
                </button>
              </li>
              {folders.map(folder => (
                <li key={folder.id}>
                  <button onClick={() => setActiveFolder(folder.id)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-sm transition-colors ${activeFolder === folder.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                    <div className="flex items-center gap-2">
                      <Folder className={`w-4 h-4 ${activeFolder === folder.id ? 'fill-blue-200 text-blue-200' : 'text-slate-400'}`} /> {folder.name}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeFolder === folder.id ? 'bg-white text-blue-600' : 'text-slate-400'}`}>{mediaItems.filter(m => m.folderId === folder.id).length}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Media Content */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            {/* Drag & Drop Zone */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload} 
              accept="image/*,video/*,.pdf,.doc,.docx"
            />
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 rounded-xl bg-white p-8 mb-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-[#B87333] transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{t("admin.click_or_drag")}</h3>
              <p className="text-xs text-slate-500 max-w-xs">{t("admin.supports_files")}</p>
            </div>

            {/* Grid View */}
            {view === 'grid' && (
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {displayedMedia.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-lg border border-slate-200">
                    ยังไม่มีข้อมูลไฟล์ที่อัปโหลด
                  </div>
                )}

                {displayedMedia.map(item => (
                  <div key={item.id} className="group relative bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-[#B87333] transition-all">
                    <div className="aspect-square bg-slate-100 relative flex items-center justify-center">
                      {item.type === 'image' ? (
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      ) : item.type === 'document' ? (
                        <FileText className="w-12 h-12 text-slate-300" />
                      ) : (
                        <Video className="w-12 h-12 text-slate-300" />
                      )}
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {confirmDeleteId === item.id ? (
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-white text-xs font-medium">แน่ใจไหม?</span>
                            <div className="flex gap-2">
                              <button onClick={() => deleteMedia(item.id)} className="px-2 py-1 text-xs bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors">
                                ลบ
                              </button>
                              <button onClick={() => setConfirmDeleteId(null)} className="px-2 py-1 text-xs bg-white text-slate-700 rounded hover:bg-slate-100 transition-colors">
                                ยกเลิก
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <button onClick={() => handleCopy(item.url)} className="w-8 h-8 rounded-full bg-white text-slate-700 flex items-center justify-center hover:text-[#B87333]" title="คัดลอกที่อยู่รูปภาพ">
                              <Copy className="w-4 h-4" />
                            </button>
                            <a href={item.url} onClick={(e) => handleDownload(e, item.url, item.name)} className="w-8 h-8 rounded-full bg-white text-slate-700 flex items-center justify-center hover:text-[#B87333]" title="ดาวน์โหลด">
                              <Download className="w-4 h-4" />
                            </a>
                            <button onClick={() => setConfirmDeleteId(item.id)} className="w-8 h-8 rounded-full bg-white text-slate-700 flex items-center justify-center hover:text-rose-600" title="ลบ">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/90 shadow-sm text-slate-700">
                        {item.type}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-medium text-slate-900 truncate" title={item.name}>{item.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-slate-500">{item.size}</span>
                        <span className="text-[10px] text-slate-500">{item.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {view === 'list' && (
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-medium">{t("admin.name")}</th>
                      <th className="px-4 py-3 font-medium">{t("admin.size")}</th>
                      <th className="px-4 py-3 font-medium">{t("admin.date")}</th>
                      <th className="px-4 py-3 font-medium text-right">{t("admin.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedMedia.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                          ยังไม่มีข้อมูลไฟล์ที่อัปโหลด
                        </td>
                      </tr>
                    )}

                    {displayedMedia.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                              {item.type === 'image' ? (
                                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                              ) : item.type === 'document' ? (
                                <FileText className="w-5 h-5 text-slate-400" />
                              ) : (
                                <Video className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{item.name}</p>
                              <p className="text-[10px] text-slate-500 uppercase">{item.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{item.size}</td>
                        <td className="px-4 py-3 text-slate-500">{item.date}</td>
                        <td className="px-4 py-3 text-right">
                          {confirmDeleteId === item.id ? (
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-xs text-rose-500 font-medium">แน่ใจไหม?</span>
                              <button 
                                onClick={() => deleteMedia(item.id)}
                                className="px-3 py-1 text-xs bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors"
                              >
                                ลบ
                              </button>
                              <button 
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-3 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors"
                              >
                                ยกเลิก
                              </button>
                            </div>
                          ) : (
                             <div className="flex items-center justify-end gap-2">
                               <button onClick={() => handleCopy(item.url)} className="p-1.5 text-slate-400 hover:text-[#B87333] transition-colors rounded-lg hover:bg-slate-100 inline-flex items-center justify-center" title="คัดลอกที่อยู่รูปภาพ">
                                 <Copy className="w-4 h-4" />
                               </button>
                               <a href={item.url} onClick={(e) => handleDownload(e, item.url, item.name)} className="p-1.5 text-slate-400 hover:text-[#0D1B3D] transition-colors rounded-lg hover:bg-slate-100 inline-flex items-center justify-center" title="ดาวน์โหลด">
                                 <Download className="w-4 h-4" />
                               </a>
                               <button onClick={() => setConfirmDeleteId(item.id)} className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50" title="ลบ">
                                 <Trash2 className="w-4 h-4" />
                               </button>
                             </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
