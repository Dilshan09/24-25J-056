// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCUqjmqB_3fCl1k0lwP44VkKogzzkmOUoQ",
  authDomain: "orchid-86e55.firebaseapp.com",
  projectId: "orchid-86e55",
  storageBucket: "orchid-86e55.firebasestorage.app",
  messagingSenderId: "580039357341",
  appId: "1:580039357341:web:83f8589ae9fca913ce3574",
  measurementId: "G-421NMTFS08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;
const analytics = getAnalytics(app);