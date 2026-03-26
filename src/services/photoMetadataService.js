/**
 * Photo Metadata Service
 * 
 * PURPOSE:
 * - Saves photo metadata to Firestore.
 * - Allows uploaded data to persist after uploads refresh
 */

import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";

export async function savePhotoMetadata({ userId, folderId, caption, lat, lng, imageUrl, storagePath }) {

    // Basic validation to ensure all required fields are present.
    // TODO: Add this validation once the PhotoUploader component is updated to pass all required fields.

    // if (!userId || !folderId || !lat || !lng || !imageUrl || !storagePath) {
    //     throw new Error("Missing required photo metadata fields.");
    // }

    try {
        const docRef = await addDoc(collection(db, "photos"), {
            userId,
            folderId,
            caption: caption || "",
            lat: lat || null,
            lng: lng || null,
            imageUrl,
            storagePath
        });
        console.log("Photo metadata saved with ID: ", docRef.id);
        console.log("Saved metadata: ", { userId, folderId, caption, lat, lng, imageUrl, storagePath });
        return docRef.id;
    } catch (e) {
        console.error("Error saving photo metadata: ", e);
        throw e;
    }
}

/*
Fetches all photos for a given folder from Firestore.
Returns an array of photo objects with their metadata.
*/

export async function getPhotosByFolder({ userId, folderId }) {
    const q = query(
        collection(db, "photos"),
        where("userId", "==", userId),
        where("folderId", "==", folderId)
    );

    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

//removing photo information from Firestore
export async function deletePhotoMetadata({ photoId }) {
    await deleteDoc(doc(db, "photos", photoId));
}