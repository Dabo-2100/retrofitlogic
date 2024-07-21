import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAq5pR7e-uN8G6Vv3-EY53Y7b3eEjKEmNM",
  authDomain: "ipaco-9c6da.firebaseapp.com",
  projectId: "ipaco-9c6da",
  storageBucket: "ipaco-9c6da.appspot.com",
  messagingSenderId: "265168758159",
  appId: "1:265168758159:web:399fa6d9e3a04b8e5997fa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
