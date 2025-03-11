import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your Firebase configuration (get this from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyAzBNj20JCE39AUvRXWoV5VlgNaiL-o_94",
  authDomain: "sendora-9e14f.firebaseapp.com",
  databaseURL: "https://sendora-9e14f-default-rtdb.firebaseio.com",
  projectId: "sendora-9e14f",
  storageBucket: "sendora-9e14f.appspot.com",
  messagingSenderId: "844599229027",
  appId: "1:844599229027:web:a6d6751f4d50d6680dd656",
  measurementId: "G-HEYHYSGKBL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };