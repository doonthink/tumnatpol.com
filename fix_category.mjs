import fs from 'fs';

let content = fs.readFileSync('src/admin/categories/CategoryList.tsx', 'utf-8');

// Update state
if (!content.includes('newNameEn')) {
  content = content.replace(
    "const [newName, setNewName] = useState('');",
    "const [newName, setNewName] = useState('');\n  const [newNameEn, setNewNameEn] = useState('');"
  );
  content = content.replace(
    "const [editName, setEditName] = useState('');",
    "const [editName, setEditName] = useState('');\n  const [editNameEn, setEditNameEn] = useState('');"
  );

  // Update addCategory
  content = content.replace(
    "body: JSON.stringify({ name: newName })",
    "body: JSON.stringify({ name: newName, name_en: newNameEn })"
  );
  content = content.replace(
    "setNewName('');",
    "setNewName('');\n      setNewNameEn('');"
  );

  // Update saveEdit
  content = content.replace(
    "body: JSON.stringify({ name: editName })",
    "body: JSON.stringify({ name: editName, name_en: editNameEn })"
  );

  // Update setEditingId in handle edit click (need to find the button)
  content = content.replace(
    /onClick=\{\(\) => \{\n\s*setEditingId\(cat.id\);\n\s*setEditName\(cat.name\);\n\s*\}\}/g,
    "onClick={() => {\n                        setEditingId(cat.id);\n                        setEditName(cat.name);\n                        setEditNameEn(cat.name_en || '');\n                      }}"
  );

  // Update Table Headers
  content = content.replace(
    '<th className="px-6 py-4 font-medium text-slate-500">ชื่อหมวดหมู่</th>',
    '<th className="px-6 py-4 font-medium text-slate-500">ชื่อหมวดหมู่ (TH)</th>\n                  <th className="px-6 py-4 font-medium text-slate-500">ชื่อหมวดหมู่ (EN)</th>'
  );

  // Update Add New Form
  content = content.replace(
    '<input\n              type="text"\n              value={newName}\n              onChange={(e) => setNewName(e.target.value)}\n              placeholder="ชื่อหมวดหมู่ใหม่..."\n              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent"\n            />',
    `<input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="ชื่อหมวดหมู่ใหม่ (TH)..."
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent"
            />
            <input
              type="text"
              value={newNameEn}
              onChange={(e) => setNewNameEn(e.target.value)}
              placeholder="ชื่อหมวดหมู่ใหม่ (EN)..."
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent"
            />`
  );

  // Update Edit row
  content = content.replace(
    /<td className="px-6 py-4">[\s\S]*?<input[\s\S]*?value=\{editName\}[\s\S]*?onChange=\{\(e\) => setEditName\(e.target.value\)\}[\s\S]*?\/>[\s\S]*?<\/td>/,
    `<td className="px-6 py-4">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editNameEn}
                          onChange={(e) => setEditNameEn(e.target.value)}
                          className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                        />
                      </td>`
  );

  // Update Display row
  content = content.replace(
    /<td className="px-6 py-4 font-medium text-slate-900">\s*\{cat.name\}\s*<\/td>/,
    `<td className="px-6 py-4 font-medium text-slate-900">
                        {cat.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {cat.name_en || '-'}
                      </td>`
  );

  fs.writeFileSync('src/admin/categories/CategoryList.tsx', content);
}
