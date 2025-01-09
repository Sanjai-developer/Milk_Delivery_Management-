// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; 
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCH6o9qBcOTxKdPw0AWQVwZgXMGgrV4fVI",
    authDomain: "test-95f0d.firebaseapp.com",
    projectId: "test-95f0d",
    databaseURL:"https://test-95f0d-default-rtdb.asia-southeast1.firebasedatabase.app/",
    storageBucket: "test-95f0d.firebasestorage.app",
    messagingSenderId: "583181889598",
    appId: "1:583181889598:web:b063283ff73f5a5b92a16f"
  };
  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app); // Initialize Realtime Database

export { auth, database };
export default app;
