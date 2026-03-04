import { useState } from "react";
import { uploadPhotoFile } from "../services/photoService";

/**
 * PhotoUploader
 * PURPOSE:
 * - UI for selecting an image and uploading it.
 * - Currently uses photoService.js STUB, so it "uploads" locally for demo.
 * - Teammate will implement real upload inside photoService.js.
 */
export default function PhotoUploader({ userId, folderId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  async function handleUpload(e) {
    e.preventDefault();
    setStatus("");

    if (!file) {
      setStatus("Choose an image first.");
      return;
    }

    setStatus("Uploading (demo stub)...");
    try {
      const result = await uploadPhotoFile({ file, userId, folderId });
      onUploaded(result);
      setFile(null);
      setStatus("Uploaded (stub). Real storage will be added by teammate.");
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <form onSubmit={handleUpload} aria-describedby="upload-help">
      <label htmlFor="photoFile">Photo file</label>
      <input
        id="photoFile"
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button className="primary" type="submit">
          Upload photo
        </button>
        <button type="button" onClick={() => setFile(null)}>
          Clear
        </button>
      </div>

      <p id="upload-help" style={{ fontSize: 12, marginTop: 10 }}>
        <span className="badge">TODO</span>{" "}
        Teammate: implement real upload in <code>src/services/photoService.js</code>.
      </p>

      {status && (
        <p role="status" aria-live="polite" style={{ marginTop: 10 }}>
          {status}
        </p>
      )}
    </form>
  );
}