import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import firebaseConfig from "../config/firebase_client.config.json";
import { defineNuxtPlugin, useState } from "#app";

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Configure auth for proper popup handling
auth.useDeviceLanguage();
provider.setCustomParameters({
  prompt: 'select_account',
  redirect_uri: 'http://localhost:3000'
});

export { auth, provider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile };

// Add listener to maintain persistent session
export default defineNuxtPlugin(() => {
  const user = useState("user");
  const authReady = useState("authReady", () => false);
  
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
    authReady.value = true;
  });
});
