// src/utils/firebaseConfig.js
import {initializeApp, getApps} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getDatabase} from "firebase/database";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKwmmlwTbJ7XwYjRGg-kj0HV4Tj9kn_aY",
  authDomain: "voting-system-64792.firebaseapp.com",
  projectId: "voting-system-64792",
  storageBucket: "voting-system-64792.appspot.com",
  messagingSenderId: "842143068010",
  appId: "1:842143068010:web:1a7aadedc35556e4263f13",
  measurementId: "G-51Y8MZZM81",
  databaseURL: "https://voting-system-64792-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const storage = getStorage(app);

export {auth, db, rtdb, storage};
