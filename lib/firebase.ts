
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional



const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,  
  authDomain: "crackit-c092f.firebaseapp.com",
  projectId: "crackit-c092f",
  storageBucket: "crackit-c092f.firebasestorage.app",
  messagingSenderId: "304892731932",
  appId: "1:304892731932:web:c02277f9d6d5a88ed275d9",
  measurementId: "G-73JZG34T6E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


