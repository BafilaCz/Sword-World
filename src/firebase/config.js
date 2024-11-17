// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAhIlfwXNc2278S73IYNthJX3YgFglHsDY",
  authDomain: "swordworld-10d4f.firebaseapp.com",
  projectId: "swordworld-10d4f",
  storageBucket: "swordworld-10d4f.appspot.com",
  messagingSenderId: "992406354965",
  appId: "1:992406354965:web:a332d816b468833d24621c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const projectFirestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

export { projectFirestore, storage, auth, googleAuthProvider };
