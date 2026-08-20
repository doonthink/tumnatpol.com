import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  const querySnapshot = await getDocs(collection(db, "pages"));
  console.log(`Found ${querySnapshot.size} pages.`);
  process.exit(0);
}
test().catch(console.error);
