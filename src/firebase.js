// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);