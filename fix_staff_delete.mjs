import fs from 'fs';

let content = fs.readFileSync('src/admin/settings/StaffSettings.tsx', 'utf8');

// Add deleteConfirmId state
content = content.replace(/const \[selectedStaff, setSelectedStaff\] = useState<any>\(null\);/g, 
`const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);`);

// Replace handleDelete
content = content.replace(/const handleDelete = \(id: number\) => \{\s*if \(confirm\("ยืนยันการลบพนักงาน\?"\)\) \{\s*setStaffList\(staffList\.filter\(s => s\.id !== id\)\);\s*\}\s*\};/g, 
`const handleDeleteClick = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      setStaffList(staffList.filter(s => s.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };`);

// Replace button onClick
content = content.replace(/onClick=\{() => handleDelete\(staff\.id\)\}/g, 'onClick={() => handleDeleteClick(staff.id)}');

// Add modal JSX before the final closing div
const modalJSX = `
      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">ยืนยันการลบ</h3>
            <p className="text-sm text-slate-600">คุณแน่ใจหรือไม่ว่าต้องการลบพนักงานรายนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้</p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={cancelDelete} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                ยกเลิก
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg text-sm font-medium transition-colors shadow-sm">
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

content = content.replace(/    <\/div>\n  \);\n\}/g, modalJSX);

fs.writeFileSync('src/admin/settings/StaffSettings.tsx', content);
