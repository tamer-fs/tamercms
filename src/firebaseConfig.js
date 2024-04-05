import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBHKsPoWBY0ikNphNy_eKCheG4XxBhJmEw",
  authDomain: "tamer-cms.firebaseapp.com",
  databaseURL:
    "https://tamer-cms-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tamer-cms",
  storageBucket: "tamer-cms.appspot.com",
  messagingSenderId: "607836297545",
  appId: "1:607836297545:web:bfccf24fdd4066b983e298",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default db;
