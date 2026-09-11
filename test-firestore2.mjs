import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function check() {
  const querySnapshot = await getDocs(collection(db, "pages"));
  querySnapshot.forEach((doc) => {
    if (doc.data().slug === 'home' || doc.id === 'home') {
      console.log('ID:', doc.id);
      console.log('content:', doc.data().content);
      console.log('useCustomLayout:', doc.data().useCustomLayout);
      console.log('---');
    }
  });
}
check();
