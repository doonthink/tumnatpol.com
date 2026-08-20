import fs from 'fs';
let content = fs.readFileSync('src/admin/AdminLayout.tsx', 'utf8');

// add import
if (!content.includes('useAuth')) {
    content = content.replace("import { useTranslation } from 'react-i18next';", "import { useTranslation } from 'react-i18next';\nimport { useAuth } from '../contexts/AuthContext';");
}

// add handleLogout
if (!content.includes('logout()')) {
    content = content.replace("const { t, i18n } = useTranslation();", "const { t, i18n } = useTranslation();\n  const { logout } = useAuth();\n\n  const handleLogout = () => {\n    logout();\n    navigate('/admin/login');\n  };");
}

// replace button
content = content.replace(/<button onClick=\{\(\) => navigate\('\/'\)\} className="w-full flex items-center gap-3 px-3 py-2\.5 rounded-lg text-rose-400 hover:bg-rose-500\/10 transition-colors">/g, 
'<button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors">');

fs.writeFileSync('src/admin/AdminLayout.tsx', content);
