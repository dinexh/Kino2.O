import { db } from '../config/firebase.js';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

const addInitialUsers = async () => {
  // ... your existing code ...
};

addInitialUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 