import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics'; // Add this if you need analytics

const firebaseConfig = {
  apiKey: "AIzaSyDBWYUJH_FAY7L2wyuGi-4B7djhmvcr5XE",
  authDomain: "mynotes-b83e1.firebaseapp.com",
  projectId: "mynotes-b83e1",
  storageBucket: "mynotes-b83e1.firebasestorage.app",
  messagingSenderId: "71489692359",
  appId: "1:71489692359:web:978c2221c8fd487c04d4e2",
  measurementId: "G-VZ6MDYZ74B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app); // Only if you need analytics

export { auth, db, googleProvider };