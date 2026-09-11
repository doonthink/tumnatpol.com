import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function check() {
  const b = await getDoc(doc(db, "banners", "1788006109534"));
  console.log(JSON.stringify(b.data(), null, 2).substring(0, 500));
}
check();
