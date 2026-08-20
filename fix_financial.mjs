import fs from 'fs';
let content = fs.readFileSync('src/admin/financial/FinancialDashboard.tsx', 'utf8');

if (!content.includes('useNavigate')) {
  content = content.replace("import { useTranslation } from 'react-i18next';", "import { useTranslation } from 'react-i18next';\nimport { useNavigate } from 'react-router-dom';");
}

if (!content.includes('const navigate = useNavigate();')) {
  content = content.replace("const { t } = useTranslation();", "const { t } = useTranslation();\n  const navigate = useNavigate();");
}

// "View All" button -> navigate to orders (doesn't exist, maybe mock)
content = content.replace(/<button className="text-sm font-medium text-\[#B87333\] hover:text-\[#8a5626\]">\{t\("admin.view_all"\)\}<\/button>/g, '<button onClick={() => alert("View All Orders")} className="text-sm font-medium text-[#B87333] hover:text-[#8a5626]">{t("admin.view_all")}</button>');

// Calendar mock
content = content.replace(/<button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">\s*<Calendar className="w-4 h-4" \/> This Month\s*<\/button>/, 
`<button onClick={() => alert("Calendar Filter")} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Calendar className="w-4 h-4" /> This Month
          </button>`);

fs.writeFileSync('src/admin/financial/FinancialDashboard.tsx', content);
