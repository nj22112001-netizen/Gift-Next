// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBgSe3AOC7aPyhgdzkG2cx6I5gpfhOvaaE",
  authDomain: "gift-next.firebaseapp.com",
  projectId: "gift-next",
  storageBucket: "gift-next.firebasestorage.app",
  messagingSenderId: "581708383124",
  appId: "1:581708383124:web:2d8e07a7d670a47f3dc581",
  measurementId: "G-16J5YRJXT6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);

// Export
export { auth, db };