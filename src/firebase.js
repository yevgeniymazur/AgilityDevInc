import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUgRx8C1LikCIzWnbQTjE1VggJP68Ox8k",
  authDomain: "wanderloom-5339a.firebaseapp.com",
  projectId: "wanderloom-5339a",
  storageBucket: "wanderloom-5339a.appspot.com",
  messagingSenderId: "596669595366",
  appId: "1:596669595366:web:66a9d882213dcc6a9dc527",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);