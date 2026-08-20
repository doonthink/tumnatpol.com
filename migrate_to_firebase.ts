import fs from 'fs/promises';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const dataDir = path.join(process.cwd(), 'data');

async function migrate() {
  const files = await fs.readdir(dataDir);
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const resourceName = file.replace('.json', '');
    const data = JSON.parse(await fs.readFile(path.join(dataDir, file), 'utf-8'));
    
    console.log(`Migrating ${resourceName}...`);
    
    if (Array.isArray(data)) {
      for (const item of data) {
        if (!item.id) continue;
        await setDoc(doc(db, resourceName, String(item.id)), item);
      }
    } else {
      // It's a single object (singleton document)
      await setDoc(doc(db, 'singletons', resourceName), data);
    }
  }
  console.log('Migration complete!');
}

migrate().catch(console.error);
