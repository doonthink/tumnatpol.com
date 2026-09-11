import { initializeApp } from 'firebase/app';
import { getFirestore, getDoc, doc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function check() {
  const settingsDoc = await getDoc(doc(db, "singletons", "settings"));
  if (settingsDoc.exists()) {
    console.log(settingsDoc.data());
  } else {
    console.log("No settings doc found");
  }
}
check();
