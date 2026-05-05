import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import 'firebase/storage';
import 'firebase/firestore';

export const firebaseConfig = {
  googleMapKey: "YOUR_GOOGLE_MAP_KEY",
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  databaseURL: "YOUR_FIREBASE_DATABASE_URL",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID",
  measurementId: "YOUR_FIREBASE_MEASUREMENT_ID",
  serverKey: "YOUR_FIREBASE_SERVER_KEY"
};

// firebase.initializeApp(firebaseConfig); // ← commented out

const app = firebase.apps.length ? firebase.app() : null;

export const auth       = app ? app.auth()      : null;
export const db         = app ? app.database()  : null;
export const storageRef = app ? app.storage()   : null;
export const store      = app ? app.firestore() : null;