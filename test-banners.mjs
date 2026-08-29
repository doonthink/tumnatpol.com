import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

async function test() {
  const qs = await getDocs(collection(db, 'banners'));
  const banners = [];
  qs.forEach(d => banners.push(d.data()));
  console.log("Banners in Firebase:", banners.length);
  if (banners.length > 0) {
     console.log("First banner image:", banners[0].image ? banners[0].image.substring(0, 50) + '...' : 'none');
  }
}
test().catch(console.error);
