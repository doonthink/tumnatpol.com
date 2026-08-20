import fs from 'fs';
let content = fs.readFileSync('src/admin/membership/MembershipList.tsx', 'utf8');

content = content.replace(
  '<button onClick={addMember} className="px-4 py-2 bg-[#0D1B3D] text-white rounded-lg text-sm font-medium hover:bg-[#0a152e] transition-colors shadow-md flex items-center gap-2">\n            <Plus className="w-4 h-4" /> Add Member\n          </button>',
  '<button onClick={() => navigate("/admin/membership/new")} className="px-4 py-2 bg-[#0D1B3D] text-white rounded-lg text-sm font-medium hover:bg-[#0a152e] transition-colors shadow-md flex items-center gap-2">\n            <Plus className="w-4 h-4" /> Add Member\n          </button>'
);

fs.writeFileSync('src/admin/membership/MembershipList.tsx', content);
