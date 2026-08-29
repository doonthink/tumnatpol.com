import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFile } from 'fs/promises';

const config = JSON.parse(await readFile('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app, config.firestoreDatabaseId);

try {
  await signInWithEmailAndPassword(auth, 'doonthink@gmail.com', 'Businesstoptier@2026');
  console.log('Signed in!');
  
  const snapshot = await getDocs(collection(db, 'members'));
  console.log('Fetched members: ', snapshot.size);
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
