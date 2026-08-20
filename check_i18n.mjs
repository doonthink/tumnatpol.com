import fs from 'fs';
const content = fs.readFileSync('src/i18n.ts', 'utf8');

// I will parse the javascript object and compare it
// Actually let's just copy i18n to a temp file, replace `export default i18n;` with `console.log(JSON.stringify(resources))` and run it.
let script = content.replace(/import[\s\S]*?;/g, '').replace(/i18n\s*\.use[\s\S]*/, 'console.log(JSON.stringify(resources, null, 2));');
fs.writeFileSync('temp.mjs', script);
