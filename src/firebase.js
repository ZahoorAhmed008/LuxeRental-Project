// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeW-QKo-oDNkZO1OW-djBS9Tw38_Io45I",
  authDomain: "luxerental-60505.firebaseapp.com",
  projectId: "luxerental-60505",
  storageBucket: "luxerental-60505.appspot.com",
  messagingSenderId: "725285475499",
  appId: "1:725285475499:web:692b2ae744be1982eb13ee",
  measurementId: "G-1XKKTE8LNN",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Firebase instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
