import fs from 'fs';

let content = fs.readFileSync('src/admin/membership/MembershipList.tsx', 'utf8');

// Ensure useNavigate is imported
if (!content.includes('useNavigate')) {
  content = content.replace("import { useTranslation } from 'react-i18next';", "import { useTranslation } from 'react-i18next';\nimport { useNavigate } from 'react-router-dom';");
}

const exportCSV = `
  const exportCSV = () => {
    const csvContent = [
      ['ID', 'Name', 'Email', 'Package', 'Status', 'Last Login', 'Joined'],
      ...members.map(m => [m.id, m.name, m.email, m.package, m.status, m.login, m.joined])
    ].map(e => e.join(",")).join("\\n");
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "members_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
`;

content = content.replace("  const { t } = useTranslation();", "  const { t } = useTranslation();\n  const navigate = useNavigate();\n  const [statusFilter, setStatusFilter] = useState('All');\n" + exportCSV);

content = content.replace(
  '<button onClick={() => {}} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">\n            <Download className="w-4 h-4" /> Export CSV\n          </button>',
  '<button onClick={exportCSV} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">\n            <Download className="w-4 h-4" /> Export CSV\n          </button>'
);

content = content.replace(
  '<button onClick={() => {}} className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center gap-2">\n              <Filter className="w-4 h-4" /> Filters\n            </button>',
  `<select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#B87333] flex items-center gap-2"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>`
);

// Map filtered members
const filterLogic = `
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
`;

content = content.replace("  return (", filterLogic + "\n  return (");

content = content.replace(/\{members\.map\(\(member\) => \(/g, "{filteredMembers.map((member) => (");

content = content.replace(/\{members\.length === 0 && \(/g, "{filteredMembers.length === 0 && (");

content = content.replace(
  '<button onClick={() => {}} className="p-1.5 text-slate-400 hover:text-[#0D1B3D] transition-colors rounded-lg hover:bg-slate-100">\n                        <Edit className="w-4 h-4" />\n                      </button>',
  '<button onClick={() => navigate(`/admin/membership/${member.id}`)} className="p-1.5 text-slate-400 hover:text-[#0D1B3D] transition-colors rounded-lg hover:bg-slate-100" title="Manage">\n                        <Edit className="w-4 h-4" />\n                      </button>'
);

fs.writeFileSync('src/admin/membership/MembershipList.tsx', content);
