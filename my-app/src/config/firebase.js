// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA_x4zYEpo0M2yr1sdaKO8FbLM1SGgk2GI",
  authDomain: "chitramelabackup.firebaseapp.com",
  projectId: "chitramelabackup",
  storageBucket: "chitramelabackup.firebasestorage.app",
  messagingSenderId: "777289516908",
  appId: "1:777289516908:web:a74e7c1ec281d9424fd549",
  measurementId: "G-5DWKGBNBL8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;

// Initialize Analytics only on client side
