// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQENduPKuZCtsyJADP7FBbl6fFqV-nMKU",
  authDomain: "sveltetree-e2035.firebaseapp.com",
  projectId: "sveltetree-e2035",
  storageBucket: "sveltetree-e2035.appspot.com",
  messagingSenderId: "505320391446",
  appId: "1:505320391446:web:ac4bbac04e234b2040c637"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();