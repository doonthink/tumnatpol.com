import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);
const auth = getAuth(app);

async function run() {
  await signInWithEmailAndPassword(auth, 'doonthink@gmail.com', 'Businesstoptier@2026');
  const snapshot = await getDocs(collection(db, 'businessChecks'));
  console.log("businessChecks length:", snapshot.docs.length);
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
