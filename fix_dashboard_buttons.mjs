import fs from 'fs';

let content = fs.readFileSync('src/admin/dashboard/Dashboard.tsx', 'utf8');

// Replace alerts for export report
const exportCSV = `
  const exportToCSV = () => {
    // Generate simple CSV from stats
    const csvContent = [
      ['Title', 'Value', 'Change', 'Trend'],
      ...stats.map(s => [s.title, s.value, s.change, s.trend])
    ].map(e => e.join(",")).join("\\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "dashboard_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
`;

content = content.replace(/export function Dashboard\(\) \{/, exportCSV.trim() + '\nexport function Dashboard() {');

// Fix buttons
content = content.replace(/onClick=\{\(\) => alert\("Exporting report\.\.\."\)\}/, 'onClick={exportToCSV}');
content = content.replace(/onClick=\{\(\) => alert\("Creating new campaign\.\.\."\)\}/, 'onClick={() => navigate("/admin/banners")}');

// Fix Quick Actions links
content = content.replace(/\{ label: t\('admin\.create_article'\), icon: FileText, color: 'text-blue-600 bg-blue-50' \}/, "{ label: t('admin.create_article'), icon: FileText, color: 'text-blue-600 bg-blue-50', link: '/admin/blogs/new' }");
content = content.replace(/\{ label: t\('admin\.add_member'\), icon: Users, color: 'text-emerald-600 bg-emerald-50' \}/, "{ label: t('admin.add_member'), icon: Users, color: 'text-emerald-600 bg-emerald-50', link: '/admin/membership' }");
content = content.replace(/\{ label: t\('admin\.create_invoice'\), icon: DollarSign, color: 'text-\[#B87333\] bg-\[#B87333\]\/10' \}/, "{ label: t('admin.create_invoice'), icon: DollarSign, color: 'text-[#B87333] bg-[#B87333]/10', link: '/admin/financial' }");
content = content.replace(/\{ label: t\('admin\.manage_packages'\), icon: Package, color: 'text-indigo-600 bg-indigo-50' \}/, "{ label: t('admin.manage_packages'), icon: Package, color: 'text-indigo-600 bg-indigo-50', link: '/admin/packages' }");

fs.writeFileSync('src/admin/dashboard/Dashboard.tsx', content);
console.log("Updated Dashboard buttons and CSV export");
