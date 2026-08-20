import fs from 'fs';
let content = fs.readFileSync('src/admin/dashboard/Dashboard.tsx', 'utf8');

// Remove the global exportToCSV
content = content.replace(/const exportToCSV = \(\) => \{[\s\S]*?document\.body\.removeChild\(link\);\n  \};\n/, "");

// Inject it inside the component, right after navigate
const insideExport = `
  const exportToCSV = () => {
    const csvContent = [
      ['Title', 'Value', 'Change', 'Trend'],
      ...stats.map(s => [s.title, s.value, s.change, s.trend])
    ].map(e => e.join(",")).join("\\n");
    
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' }); // Add BOM for excel support
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "dashboard_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
`;

content = content.replace(/(const stats = \[[\s\S]*?\];)/, `$1\n${insideExport}`);

fs.writeFileSync('src/admin/dashboard/Dashboard.tsx', content);
console.log("Fixed export scope");
