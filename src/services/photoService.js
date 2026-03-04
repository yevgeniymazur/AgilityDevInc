/**
 * photoService.js
 *
 * PURPOSE:
 * - This service isolates photo upload/storage logic.
 * - Right now it's a STUB (non-functional upload) so the UI can ship.
 * - Teammate will replace the marked TODO blocks with real Storage integration.
 */

export async function uploadPhotoFile({ file, userId, folderId }) {
  /**
   * TODO [TEAMMATE - IMPLEMENT REAL UPLOAD]
   * Replace this stub with one of:
   *  - Firebase Storage uploadBytes + getDownloadURL
   *  - Cloudinary unsigned upload
   *  - External API teammate owns
   *
   * Must return:
   *   { imageUrl: string, storagePath?: string }
   */

  console.warn("uploadPhotoFile STUB called. No real upload is happening.");

  // Fake URL so UI can render something:
  const imageUrl = URL.createObjectURL(file);

  // Fake "path" placeholder
  const storagePath = `STUB/users/${userId}/folders/${folderId}/${file.name}`;

  return { imageUrl, storagePath };
}

export async function deletePhotoFile({ storagePath }) {
  /**
   * TODO [TEAMMATE - IMPLEMENT REAL DELETE]
   * If using Firebase Storage:
   *  - deleteObject(ref(storage, storagePath))
   */
  console.warn("deletePhotoFile STUB called. No real delete is happening.");
  return true;
}