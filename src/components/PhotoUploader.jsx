import { useState } from "react";
import { uploadPhotoFile } from "../services/photoService";
import { savePhotoMetadata } from "../services/photoMetadataService";
import exifr from "exifr";

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
  const [caption, setCaption] = useState("");

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

    //validate file type. 
    // In future iterations support more formats, implement more security, implement image processing, 
    // and export this logic to a separate service
    if (!file.name.toLowerCase().endsWith(".jpg") && !file.name.toLowerCase().endsWith(".jpeg")) {
      setStatus("Only JPG/JPEG files are supported.");
      return;
    }

    setStatus("Uploading photo...");

    try {
      // Step 1: Extract GPS coordinates from photo metadata
      const gps = await exifr.gps(file);
      const lat = gps?.latitude ?? null;
      const lng = gps?.longitude ?? null;

      // Step 2: Upload file to Firebase Storage
      // Upload the file and return metadata from the service
      const result = await uploadPhotoFile({ file, userId, folderId });

      //Step 2: Save photo metadata to Firestore
      await savePhotoMetadata({
        userId,
        folderId,
        caption: "", // Placeholder for now, can be extended to include a caption input
        lat,
        lng,
        imageUrl: result.imageUrl,
        storagePath: result.storagePath,
      });

      // Notify parent component that upload completed
      if (onUploaded) {
        onUploaded(result);
      }

      // Reset selected file and caption after successful upload
      setFile(null);
      setCaption("");

      setStatus(lat && lng
        ? "Photo uploaded and location saved successfully."
        : "Photo uploaded successfully. No GPS data found.");
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
        accept=".jpg,.jpeg,image/jpeg"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      {/* Caption input */}
      <label htmlFor="caption">Caption (optional)</label>
      <input
        id="caption"
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Eiffel Tower at sunset"
        autoComplete="off"
        style={{ marginBottom: 10 }}
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
        Only JPG/JPEG files are supported.
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