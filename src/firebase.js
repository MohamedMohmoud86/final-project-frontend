import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyDeLBG5PXpCwzTvKjLIaT3E43lcwTgZyeQ",
  authDomain: "app-store-3a113.firebaseapp.com",
  projectId: "app-store-3a113",
  storageBucket: "app-store-3a113.firebasestorage.app",
  messagingSenderId: "1021686806591",
  appId: "1:1021686806591:web:e44777c28f8bfb1242208a",
  measurementId: "G-G1TXNW62RV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();