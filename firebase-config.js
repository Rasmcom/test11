// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCQGW7chezqctoYhiwxgjo5PW7Se1Qzg0",
  authDomain: "testm3-e309b.firebaseapp.com",
  databaseURL: "https://testm3-e309b-default-rtdb.firebaseio.com",
  projectId: "testm3-e309b",
  storageBucket: "testm3-e309b.firebasestorage.app",
  messagingSenderId: "959816245190",
  appId: "1:959816245190:web:fe5643df3a62e217315cc7",
  measurementId: "G-CY7TD2M4P6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig );

// Get a reference to the Firestore database
const db = getFirestore(app);

// Get a reference to Firebase Storage
const storage = getStorage(app);

// Export db and storage for use in other files
export { db, storage };
