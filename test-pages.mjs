import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

async function test() {
  const qs = await getDocs(collection(db, 'pages'));
  const pages = [];
  qs.forEach(d => pages.push(d.data()));
  console.log("Pages in Firebase:", pages.length);
  pages.forEach(p => console.log("- ", p.slug));
}
test().catch(console.error);
