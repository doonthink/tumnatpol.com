import fs from 'fs';

let content = fs.readFileSync('src/admin/settings/SettingsPage.tsx', 'utf8');

// Add import
content = content.replace("import { Save, Globe, Mail, Shield, Database, Key, CheckCircle, Clock } from 'lucide-react';", 
"import { Save, Globe, Mail, Shield, Database, Key, CheckCircle, Clock, Users } from 'lucide-react';\nimport { StaffSettings } from './StaffSettings';");

// Add tab
content = content.replace("{ id: 'logs', label: t('admin.activity_logs'), icon: Clock },", 
"{ id: 'logs', label: t('admin.activity_logs'), icon: Clock },\n    { id: 'staff', label: 'พนักงานและสิทธิ์', icon: Users },");

// Render tab content
const staffRender = `
            {activeTab === 'staff' && (
              <div className="p-6">
                 <StaffSettings />
              </div>
            )}
            {/* Other tabs placeholder */}`;

content = content.replace("{/* Other tabs placeholder */}", staffRender);

fs.writeFileSync('src/admin/settings/SettingsPage.tsx', content);
