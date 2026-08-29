import fs from 'fs';
const file = 'src/lib/firebase.ts';
let code = fs.readFileSync(file, 'utf-8');
if (!code.includes('getStorage')) {
  code = code.replace("import { getFirestore } from 'firebase/firestore';", "import { getFirestore } from 'firebase/firestore';\nimport { getStorage } from 'firebase/storage';");
  code += "\nexport const storage = getStorage(app);\n";
  fs.writeFileSync(file, code);
}
