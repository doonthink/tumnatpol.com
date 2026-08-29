import fs from 'fs';
const file = 'src/admin/videos/VideoForm.tsx';
let code = fs.readFileSync(file, 'utf-8');
code = code.replace("const finalData = {\n      const finalData = {", "const finalData = {");
fs.writeFileSync(file, code);
