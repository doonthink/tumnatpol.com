import fs from 'fs';

let serverTs = fs.readFileSync('server.ts', 'utf-8');

// Add Firebase imports at the top
const firebaseImports = `import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
`;
serverTs = serverTs.replace('import express from "express";', firebaseImports + '\nimport express from "express";');

// Replace readData and writeData
const newFunctions = `
const singletons = ['settings', 'dashboard', 'analytics'];

// Helper function to read data
async function readData(file) {
  const resourceName = file.replace('.json', '');
  try {
    if (singletons.includes(resourceName)) {
      const docSnap = await getDoc(doc(db, 'singletons', resourceName));
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } else {
      const querySnapshot = await getDocs(collection(db, resourceName));
      const data = [];
      querySnapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() });
      });
      if (data.length > 0) return data;
    }
    
    // Fallback to default data
    const defaultData = getDefaultData(resourceName);
    await writeData(file, defaultData);
    return defaultData;
  } catch (error) {
    console.error('Error reading from Firebase:', error);
    return getDefaultData(resourceName);
  }
}

// Helper function to write data
async function writeData(file, data) {
  const resourceName = file.replace('.json', '');
  try {
    if (singletons.includes(resourceName)) {
      await setDoc(doc(db, 'singletons', resourceName), data);
    } else {
      // For arrays, if writeData is called with an array, we must update the collection.
      // Because this is inefficient, we just iterate and setDoc each item.
      // (Any deleted items won't be removed here, but the CRUD delete endpoint handles true deletion)
      for (const item of data) {
        if (!item.id) continue;
        await setDoc(doc(db, resourceName, String(item.id)), item);
      }
    }
  } catch (error) {
    console.error('Error writing to Firebase:', error);
  }
}
`;

serverTs = serverTs.replace(/async function readData\(file: string\) \{[\s\S]*?\n\}\n\n\/\/ Helper function to write data\nasync function writeData\(file: string, data: any\) \{[\s\S]*?\n\}/, newFunctions);

fs.writeFileSync('server.ts', serverTs);
