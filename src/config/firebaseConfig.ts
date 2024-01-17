// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_AUTH_API,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: "evening-films",
  storageBucket: import.meta.env.VITE_FIREBASE_STORE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESENGER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const firestoreDB = getFirestore(firebaseApp)