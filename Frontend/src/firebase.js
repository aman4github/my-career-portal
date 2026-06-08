// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWEP1Ep11NNOrZJKHdkYQS-blX6O4Xgxs",
  authDomain: "career-portal-a729a.firebaseapp.com",
  projectId: "career-portal-a729a",
  storageBucket: "career-portal-a729a.firebasestorage.app",
  messagingSenderId: "618878350626",
  appId: "1:618878350626:web:72c25e433102ee0b2c217b",
  measurementId: "G-G2FD5KVPP6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();


// Helper function for the popup
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);