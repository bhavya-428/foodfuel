import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
const db = getFirestore(app);

async function run() {
  console.log("Fetching menuItems...");
  try {
    const querySnapshot = await getDocs(collection(db, "menuItems"));
    console.log("Total items found:", querySnapshot.size);
    if (querySnapshot.size > 0) {
      console.log("First item data:", querySnapshot.docs[0].id, querySnapshot.docs[0].data());

      // Let's count categories and types
      const types = {};
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        const t = data.type || data.category || data.menuType || 'undefined';
        types[t] = (types[t] || 0) + 1;
      });
      console.log("Categories found in Firestore:", types);
    } else {
      console.log("Collection menuItems is empty.");
    }
  } catch (err) {
    console.error("Error fetching menuItems:", err);
  }
}
run();
