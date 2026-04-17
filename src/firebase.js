import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCeBxxqGSIeUX0S9j80I_rGmJFIVYF2NZA",
  authDomain: "foodfuel-008.firebaseapp.com",
  projectId: "foodfuel-008",
  storageBucket: "foodfuel-008.firebasestorage.app",
  messagingSenderId: "169733732279",
  appId: "1:169733732279:web:997a24346b167fc20e9a32",
  measurementId: "G-1KYRM0N531"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
