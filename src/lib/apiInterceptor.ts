import { collection, doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

const singletons = ['settings', 'dashboard', 'analytics'];

function handleFirestoreError(error: unknown) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    }
  };
  console.error('Firestore Error Detailed:', JSON.stringify(errInfo));
  return new Response(JSON.stringify({ error: errInfo.error }), { status: 500 });
}

const api = {
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
    if (singletons.includes(resource)) {
       const docSnap = await getDoc(doc(db, 'singletons', resource));
       return docSnap.exists() ? docSnap.data() : {};
    }
    const docSnap = await getDoc(doc(db, resource, id));
    return docSnap.exists() ? docSnap.data() : null;
  },
  post: async (resource: string, data: any) => {
    if (singletons.includes(resource)) {
      await setDoc(doc(db, 'singletons', resource), data, { merge: true });
      return data;
    } else {
      const id = data.id || Date.now().toString();
      const newItem = { ...data, id, lastUpdated: new Date().toISOString() };
      await setDoc(doc(db, resource, id), newItem);
      return newItem;
    }
  },
  put: async (resource: string, id: string, data: any) => {
    if (singletons.includes(resource)) {
      await setDoc(doc(db, 'singletons', resource), data, { merge: true });
      return data;
    } else {
      const updatedItem = { ...data, lastUpdated: new Date().toISOString() };
      await setDoc(doc(db, resource, id), updatedItem, { merge: true });
      return updatedItem;
    }
  },
  delete: async (resource: string, id: string) => {
    await deleteDoc(doc(db, resource, id));
    return { success: true };
  }
};

const originalFetch = window.fetch;

Object.defineProperty(window, 'fetch', {
  configurable: true,
  enumerable: true,
  writable: true,
  value: async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.toString());

  const isInternalApi = url.startsWith('/api/') || url.startsWith(window.location.origin + '/api/');
  if (isInternalApi) {
    const resourcePath = url.substring(url.indexOf('/api/') + 5).split('?')[0];
    const parts = resourcePath.split('/');
    const resource = parts[0];
    const id = parts[1];
    
    // Exclude certain endpoints that should still hit the real server
    const excluded = ['logs', 'backups', 'media', 'health', 'business-check', 'verify-recaptcha'];
    if (excluded.includes(resource) || url.includes('/api/videos/upload')) {
      return originalFetch(input, init);
    }
    
    const method = init?.method || (input instanceof Request ? input.method : 'GET');
    
    try {
      let result;
      if (method === 'GET') {
        if (id) result = await api.getById(resource, id);
        else result = await api.get(resource);
      } else if (method === 'POST') {
        const body = JSON.parse(init?.body as string || '{}');
        result = await api.post(resource, body);
      } else if (method === 'PUT') {
        const body = JSON.parse(init?.body as string || '{}');
        result = await api.put(resource, id, body);
      } else if (method === 'DELETE') {
        result = await api.delete(resource, id);
      }
      
      if (!result && method === 'GET' && id) {
          return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
      }

      return new Response(JSON.stringify(result), {
        status: method === 'POST' ? 201 : 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error: any) {
      if (error.code && error.code.includes('permission-denied')) {
         handleFirestoreError(error);
      } else {
         console.error('API Interceptor Error:', error);
      }
      
      if (method === 'GET') {
          return new Response(JSON.stringify(id ? null : []), { 
              status: 200, 
              headers: { 'Content-Type': 'application/json' } 
          });
      }
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
  
  return originalFetch(input, init);
  }
});

console.log("🔥 Firebase API Interceptor registered!");
