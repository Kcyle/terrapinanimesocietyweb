import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCN9dMIMtjE2UNrRHRuTWPO6KUoUms3IdM",
  authDomain: "csm-drawing-competition.firebaseapp.com",
  databaseURL: "https://csm-drawing-competition-default-rtdb.firebaseio.com",
  projectId: "csm-drawing-competition",
  storageBucket: "csm-drawing-competition.firebasestorage.app",
  messagingSenderId: "126389105375",
  appId: "1:126389105375:web:85ba0b063e39537da9af6a",
  measurementId: "G-7GWHPY3SKB"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
