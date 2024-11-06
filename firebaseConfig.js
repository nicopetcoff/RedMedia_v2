// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA6fCLbVBpM3J1ipGK3ywI6kS_rFyFG0p8",
  authDomain: "redmedia-aef35.firebaseapp.com",
  projectId: "redmedia-aef35",
  storageBucket: "redmedia-aef35.appspot.com",
  messagingSenderId: "897370499655",
  appId: "1:897370499655:web:cea045f88a1fa8bde11f62",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };