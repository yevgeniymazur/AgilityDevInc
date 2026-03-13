/**
 * Photo Metadata Service
 * 
 * PURPOSE:
 * - Saves photo metadata to Firestore.
 * - Allows uploaded data to persist after uploads refresh
 */

import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

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
            storagePath,
            timestamp: Date.now()
        });
        console.log("Photo metadata saved with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error saving photo metadata: ", e);
        throw e;
    }
}