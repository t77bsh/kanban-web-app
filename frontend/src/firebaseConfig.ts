// SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDvnIFHI95qXxjC7x_Zj8XrdHcQ9RwOiDE",
    authDomain: "kanban-d4d63.firebaseapp.com",
    projectId: "kanban-d4d63",
    storageBucket: "kanban-d4d63.appspot.com",
    messagingSenderId: "783378269137",
    appId: "1:783378269137:web:399cfbf2af8df8278a56f0",
    measurementId: "G-3QXZJH7JDG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);