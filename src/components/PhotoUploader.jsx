import { useState } from "react";
import { uploadPhotoFile } from "../services/photoService";
import { savePhotoMetadata } from "../services/photoMetadataService";

/*
PhotoUploader Component

PURPOSE
- Allows a user to select an image and upload it.
- This component handles the upload UI only.
- The actual storage logic is handled by photoService.js.
*/

export default function PhotoUploader({ userId, folderId, onUploaded }) {
  // Stores the selected file before upload
  const [file, setFile] = useState(null);

  // Displays upload progress, success, or error messages
  const [status, setStatus] = useState("");

  /*
  Handles the upload process when the form is submitted.
  - Validates a file is selected
  - Calls the upload service
  - Sends uploaded file data back to the parent component
  */
  async function handleUpload(e) {
    e.preventDefault();
    setStatus("");

    // Prevent upload if no file is selected
    if (!file) {
      setStatus("Choose an image first.");
      return;
    }

    setStatus("Uploading photo...");

    try {
      // Step 1: Upload file to Firebase Storage
      // Upload the file and return metadata from the service
      const result = await uploadPhotoFile({ file, userId, folderId });

      //Step 2: Save photo metadata to Firestore
      await savePhotoMetadata({
        userId,
        folderId,
        caption: "", // Placeholder for now, can be extended to include a caption input
        lat: null, // Placeholder for geotagging, can be extended to include location data
        lng: null, // Placeholder for geotagging, can be extended to include location data
        imageUrl: result.imageUrl,
        storagePath: result.storagePath,
      });

      // Notify parent component that upload completed
      if (onUploaded) {
        onUploaded(result);
      }

      // Reset selected file after successful upload
      setFile(null);

      setStatus("Photo uploaded and metadata saved successfully.");
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <form onSubmit={handleUpload} aria-describedby="upload-help">
      {/* File selector for image uploads */}
      <label htmlFor="photoFile">Photo file</label>
      <input
        id="photoFile"
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      {/* Upload controls */}
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button className="primary" type="submit">
          Upload photo
        </button>

        {/* Clears the selected file */}
        <button type="button" onClick={() => setFile(null)}>
          Clear
        </button>
      </div>

      {/* Helper text for the uploader */}
      <p id="upload-help" style={{ fontSize: 12, marginTop: 10 }}>
        Uploaded files are stored in Firebase Storage.
      </p>

      {/* Status message area for upload feedback */}
      {status && (
        <p role="status" aria-live="polite" style={{ marginTop: 10 }}>
          {status}
        </p>
      )}
    </form>
  );
}