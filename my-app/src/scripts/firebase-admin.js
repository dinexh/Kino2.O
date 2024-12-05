const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCxv010NrOKUtIRI2Xop0e5gsOcgKVhn54",
  authDomain: "chitramela-20723.firebaseapp.com",
  projectId: "chitramela-20723",
  storageBucket: "chitramela-20723.appspot.com",
  messagingSenderId: "401244839584",
  appId: "1:401244839584:web:e2d29cb10cd8301d61b3c5",
  measurementId: "G-9JJNBKF6SK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db }; 