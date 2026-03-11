/**
 * photoService.js
 *
 * PURPOSE
 * - Handles photo upload and delete logic for Firebase Storage.
 * - Keeps storage code separate from UI components.
 */

import { storage } from "../firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

/*
Uploads a photo file to Firebase Storage.
Returns the public image URL and the storage path.
*/
export async function uploadPhotoFile({ file, userId, folderId }) {
  if (!file) {
    throw new Error("No file provided.");
  }

  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (!folderId) {
    throw new Error("Folder ID is required.");
  }

  const filename = `${Date.now()}-${file.name}`;
  const storagePath = `users/${userId}/folders/${folderId}/${filename}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);

  return { imageUrl, storagePath };
}

/*
Deletes a photo file from Firebase Storage using its path.
*/
export async function deletePhotoFile({ storagePath }) {
  if (!storagePath) {
    throw new Error("Storage path is required.");
  }

  const fileRef = ref(storage, storagePath);
  await deleteObject(fileRef);

  return true;
}