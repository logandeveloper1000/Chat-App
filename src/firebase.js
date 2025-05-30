// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1TWj5WC5yEWYmQCkc8pqx5xvrkhEbN3A",
  authDomain: "logan-portolio.firebaseapp.com",
  projectId: "logan-portolio",
  storageBucket: "logan-portolio.firebasestorage.app",
  messagingSenderId: "254880871321",
  appId: "1:254880871321:web:e0934219a72bc21e4b5908",
  measurementId: "G-PN9S1WN69N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);