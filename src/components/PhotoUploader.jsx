import { useState } from "react";
import { uploadPhotoFile } from "../services/photoService";

/*
PhotoUploader Component

PURPOSE
- Allows a user to select an image and upload it.
- This component handles UI interaction only.
- The actual upload logic is handled by photoService.js.

CURRENT STATE
- uploadPhotoFile() is currently a stub/demo implementation.
- A teammate will replace the stub with real Firebase Storage logic.
*/

export default function PhotoUploader({ userId, folderId, onUploaded }) {

  // Stores the selected file before upload
  const [file, setFile] = useState(null);

  // Displays status messages (uploading, success, errors)
  const [status, setStatus] = useState("");

  /*
  Handles the upload process when the form is submitted.
  - Validates a file is selected
  - Calls the upload service
  - Returns the uploaded file data to the parent component
  */
  async function handleUpload(e) {
    e.preventDefault();
    setStatus("");

    // Prevent upload if no file is selected
    if (!file) {
      setStatus("Choose an image first.");
      return;
    }

    setStatus("Uploading (demo stub)...");

    try {
      /*
      Call the upload service.
      In the final implementation this will upload the file
      to Firebase Storage and return metadata.
      */
      const result = await uploadPhotoFile({ file, userId, folderId });

      // Notify parent component that upload completed
      onUploaded(result);

      // Reset file input
      setFile(null);

      setStatus("Uploaded (stub). Real storage will be added by teammate.");
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

        {/* Clears selected file */}
        <button type="button" onClick={() => setFile(null)}>
          Clear
        </button>
      </div>

      {/* Developer note indicating upload logic still needs implementation */}
      <p id="upload-help" style={{ fontSize: 12, marginTop: 10 }}>
        <span className="badge">TODO</span>{" "}
        Teammate: implement real upload in <code>src/services/photoService.js</code>.
      </p>

      {/* Status message area (success/errors) */}
      {status && (
        <p role="status" aria-live="polite" style={{ marginTop: 10 }}>
          {status}
        </p>
      )}

    </form>
  );
}