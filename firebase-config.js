import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { 
  getFirestore, enableIndexedDbPersistence,
  collection, addDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { 
  getStorage, ref, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-storage.js";
import { 
  getAuth, signInAnonymously, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

// Firebase configuration - Replace with actual Firebase keys when deployed
const firebaseConfig = {
  apiKey: "AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "ar-scanner-pro.firebaseapp.com",
  projectId: "ar-scanner-pro",
  storageBucket: "ar-scanner-pro.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdefghijklmnopqrstuv",
  measurementId: "G-ABCDEFGHIJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.error('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.error('The current browser does not support all of the features required to enable persistence');
    }
  });

// Handle anonymous authentication
let currentUser = null;

const initializeAuth = async () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        currentUser = user;
        console.log('User is signed in:', user.uid);
        resolve(user);
      } else {
        // User is signed out, sign in anonymously
        signInAnonymously(auth)
          .then((userCredential) => {
            currentUser = userCredential.user;
            console.log('Anonymous auth successful:', currentUser.uid);
            resolve(currentUser);
          })
          .catch((error) => {
            console.error('Anonymous auth error:', error);
            reject(error);
          });
      }
    });
  });
};

// Export the initialized Firebase services and utilities
export { 
  app, db, storage, auth, currentUser, initializeAuth,
  collection, addDoc, serverTimestamp,
  ref, uploadBytes, getDownloadURL
};