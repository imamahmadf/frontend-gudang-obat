// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmFAAeX_Omxp656Mby9xqin7DLYLmkp10",
  authDomain: "apteka-8123a.firebaseapp.com",
  projectId: "apteka-8123a",
  storageBucket: "apteka-8123a.firebasestorage.app",
  messagingSenderId: "132129911953",
  appId: "1:132129911953:web:3a566be43a61a4da503b30",
  measurementId: "G-LZH491D1PE",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const authFirebase = getAuth(app);
