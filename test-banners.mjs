import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function check() {
  const querySnapshot = await getDocs(collection(db, "banners"));
  const banners = [];
  querySnapshot.forEach((doc) => {
    banners.push(doc.data());
  });
  console.log(banners.length, "banners found");
  console.log(banners.map(b => ({ id: b.id, name: b.name, status: b.status, imageLength: b.image ? b.image.length : 0 })));
}
check();
