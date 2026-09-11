import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function check() {
  await updateDoc(doc(db, "banners", "1788006109534"), { status: 'Active' });
  console.log("Banner 1788006109534 activated");
}
check();
