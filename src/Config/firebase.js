// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsuwsydXDWG64ETA0GYAivBc1HUorJCqM",
  authDomain: "gfk-paser.firebaseapp.com",
  projectId: "gfk-paser",
  storageBucket: "gfk-paser.appspot.com",
  messagingSenderId: "536902020774",
  appId: "1:536902020774:web:5719ceac06d01592ca0e67",
  measurementId: "G-LRMX5E63SV",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const authFirebase = getAuth(app);
