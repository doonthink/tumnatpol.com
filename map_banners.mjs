import fs from 'fs';

// Update App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace("import { PackageList } from './admin/packages/PackageList';", "import { PackageList } from './admin/packages/PackageList';\nimport { BannerList } from './admin/banners/BannerList';");
app = app.replace('<Route path="pages" element={<PageList />} />', '<Route path="banners" element={<BannerList />} />\n          <Route path="pages" element={<PageList />} />');
fs.writeFileSync('src/App.tsx', app);

// Update AdminLayout.tsx
let admin = fs.readFileSync('src/admin/AdminLayout.tsx', 'utf8');
admin = admin.replace("import { LayoutDashboard, FileText, FileEdit, Settings, LogOut, Globe, FolderTree, Users, DollarSign, BarChart, Bell, Package, Image as ImageIcon } from 'lucide-react';", "import { LayoutDashboard, FileText, FileEdit, Settings, LogOut, Globe, FolderTree, Users, DollarSign, BarChart, Bell, Package, Image as ImageIcon, MonitorPlay } from 'lucide-react';");
admin = admin.replace("{ name: t('admin.pages'), href: '/admin/pages', icon: FileText },", "{ name: 'แบนเนอร์', href: '/admin/banners', icon: MonitorPlay },\n    { name: t('admin.pages'), href: '/admin/pages', icon: FileText },");
fs.writeFileSync('src/admin/AdminLayout.tsx', admin);
