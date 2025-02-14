import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from "../config/firebase_client.config.json";
import { defineNuxtPlugin, useState } from "#app";

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };

// Add listener to maintain persistent session
export default defineNuxtPlugin(() => {
  const user = useState("user");
  // Add authReady state to indicate if authentication has been resolved.
  const authReady = useState("authReady", () => false);
  
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
    authReady.value = true;
  });
});
