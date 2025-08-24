// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQHMC1XO7TpdktnBcE_7ePl6oVUUAQU0A",
    authDomain: "notehub-app-86be7.firebaseapp.com",
    projectId: "notehub-app-86be7",
    storageBucket: "notehub-app-86be7.firebasestorage.app",
    messagingSenderId: "433548662176",
    appId: "1:433548662176:web:e79db883eff1985e1f80c5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Експортуємо сервіси, які нам знадобляться в інших частинах додатку
export const db = getFirestore(app);
export const auth = getAuth(app);
