import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');
content = "import { Profile } from './admin/profile/Profile';\n" + content;

content = content.replace(/<Route index element={<Dashboard \/>} \/>/, "<Route index element={<Dashboard />} />\n              <Route path=\"profile\" element={<Profile />} />");

fs.writeFileSync('src/App.tsx', content);
console.log("Added Profile to App.tsx");
