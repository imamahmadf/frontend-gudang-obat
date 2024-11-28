// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClZVgi7ngaqG6r1d_2pzrmopeHO-B6b3Q",
  authDomain: "gfk-paser-c6e69.firebaseapp.com",
  projectId: "gfk-paser-c6e69",
  storageBucket: "gfk-paser-c6e69.firebasestorage.app",
  messagingSenderId: "631314418567",
  appId: "1:631314418567:web:45e7c80df8526012822122",
  measurementId: "G-YKD8F4T1B3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const authFirebase = getAuth(app);
