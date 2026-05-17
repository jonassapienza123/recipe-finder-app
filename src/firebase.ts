import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBwSF-XFpGfgojC0yrZUFs50XLdS4g-cEE",
  authDomain: "recipe-finder-app-15f58.firebaseapp.com",
  databaseURL: "https://recipe-finder-app-15f58-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "recipe-finder-app-15f58",
  storageBucket: "recipe-finder-app-15f58.firebasestorage.app",
  messagingSenderId: "637118980261",
  appId: "1:637118980261:web:2898aedcddb423befe6d4c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);