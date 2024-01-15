import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import{
    push,
    child,
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBmEcMc_jHCDGqlqs6qZ8xC14A9UNrlmoY",
  authDomain: "my-first-project-1-c98da.firebaseapp.com",
  projectId: "my-first-project-1-c98da",
  storageBucket: "my-first-project-1-c98da.appspot.com",
  messagingSenderId: "1012241146158",
  appId: "1:1012241146158:web:a5bc95e7379c334635dabf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth=getAuth(app);
const storage = getStorage();

export{
    initializeApp,
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    db,
    app,
    auth,
    getDownloadURL,
    ref,
    storage,
    push,
    child,
    serverTimestamp,
    uploadBytesResumable,
}