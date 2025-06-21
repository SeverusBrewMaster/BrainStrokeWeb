// src/firebase/firebase.jsx

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage'; // ✅ Add this line



// Import Auth and Firestore services
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRnEWKEyJmFy6d6Qy0odJRDvVRWqgIHVg",
  authDomain: "brain-stroke-e42b1.firebaseapp.com",
  projectId: "brain-stroke-e42b1",
  storageBucket: "brain-stroke-e42b1.firebasestorage.app",
  messagingSenderId: "44670502149",
  appId: "1:44670502149:web:dbc5dcdf262dbe5bd5636c",
  measurementId: "G-JG69TSQZQW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Export auth and db so you can import them elsewhere
export { auth, db };
