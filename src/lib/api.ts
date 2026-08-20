import { collection, doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

const singletons = ['settings', 'dashboard', 'analytics'];

export const api = {
  get: async (resource: string) => {
    if (singletons.includes(resource)) {
      const docSnap = await getDoc(doc(db, 'singletons', resource));
      return docSnap.exists() ? docSnap.data() : {};
    } else {
      const querySnapshot = await getDocs(collection(db, resource));
      const data: any[] = [];
      querySnapshot.forEach((d) => {
        data.push({ id: d.id, ...d.data() });
      });
      return data;
    }
  },
  getById: async (resource: string, id: string) => {
    const docSnap = await getDoc(doc(db, resource, id));
    return docSnap.exists() ? docSnap.data() : null;
  },
  post: async (resource: string, data: any) => {
    if (singletons.includes(resource)) {
      await setDoc(doc(db, 'singletons', resource), data, { merge: true });
      return data;
    } else {
      const id = data.id || Date.now().toString();
      const newItem = { ...data, id };
      await setDoc(doc(db, resource, id), newItem);
      return newItem;
    }
  },
  put: async (resource: string, id: string, data: any) => {
    if (singletons.includes(resource)) {
      await setDoc(doc(db, 'singletons', resource), data, { merge: true });
      return data;
    } else {
      await setDoc(doc(db, resource, id), data, { merge: true });
      return data;
    }
  },
  delete: async (resource: string, id: string) => {
    await deleteDoc(doc(db, resource, id));
    return { success: true };
  }
};
