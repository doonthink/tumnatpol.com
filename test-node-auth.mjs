import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { readFile } from 'fs/promises';

const config = JSON.parse(await readFile('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(config);
const auth = getAuth(app);
try {
  await signInWithEmailAndPassword(auth, 'doonthink@gmail.com', 'Businesstoptier@2026');
  console.log('Signed in!');
} catch (e) {
  if (e.code === 'auth/invalid-credential' || e.code === 'auth/user-not-found') {
    await createUserWithEmailAndPassword(auth, 'doonthink@gmail.com', 'Businesstoptier@2026');
    console.log('Created and signed in!');
  } else {
    console.error(e);
  }
}
