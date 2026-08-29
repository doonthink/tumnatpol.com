import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
const app = initializeApp({ projectId: 'tumnatpol-437c3' });
const db = getFirestore(app);
db.collection('pages').get().then(s => console.log('success', s.size)).catch(e => console.error('error', e));
