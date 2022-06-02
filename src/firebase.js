import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBszFmkn-e6n2tKe5UTZD2LQXt3Oe-FQ0o",
  authDomain: "netflix-challenge-clone.firebaseapp.com",
  projectId: "netflix-challenge-clone",
  storageBucket: "netflix-challenge-clone.appspot.com",
  messagingSenderId: "956622965917",
  appId: "1:956622965917:web:475249604dbf7692ef1874",
  measurementId: "G-F77WWKNNXL",
};

const initApp = firebase.initializeApp(firebaseConfig);

const db = initApp.firestore();
const authM = firebase.auth();

export { db, authM };
