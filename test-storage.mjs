import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import fs from 'fs';
const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const testRef = ref(storage, 'test.txt');
async function test() {
  try {
    await uploadString(testRef, 'hello world');
    const url = await getDownloadURL(testRef);
    console.log("Success:", url);
  } catch (e) {
    console.error("Storage error:", e);
  }
}
test();
