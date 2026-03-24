import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getUserProfile(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data();
  }

 
  return {
    displayName: "",
    avatarUrl: "",
    defaultMapView: "globe",
    publicProfile: false,
    showPinsToOthers: false
  };
}