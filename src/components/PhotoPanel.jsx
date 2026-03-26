import { useState, useEffect } from "react";
import PhotoUploader from "./PhotoUploader";
import { getPhotosByFolder } from "../services/photoMetadataService";
import { deletePhotoFile } from "../services/photoService";
import { deletePhotoMetadata } from "../services/photoMetadataService";

/*
PhotoPanel Component

PURPOSE
- Displays photo upload controls.
- Fetches and displays photos from Firestore for the selected folder.
*/

export default function PhotoPanel({ userId, folder, setGlobePoints }) {
  // Photos fetched from Firestore
  const [photos, setPhotos] = useState([]);

  // Status message for upload feedback
  const [formMsg, setFormMsg] = useState("");

  /*
  Fetches photos from Firestore when the folder is selected.
  Re-runs if the folder changes.
  */
  async function loadPhotos() {
    const results = await getPhotosByFolder({ userId, folderId: folder.id });
    setPhotos(results);

    const points = results
      .filter((p) => p.lat && p.lng)
      .map((p) => ({
        lat: p.lat,
        lng: p.lng,
        caption: p.caption || "Photo",
        imageUrl: p.imageUrl
      }));

    setGlobePoints(points);
  }

  useEffect(() => {
    loadPhotos();
  }, [folder.id]);

  /*
  Runs after PhotoUploader finishes uploading.
  Re-fetches the photo list so the new photo and pin appear immediately.
  */
  function handleUploaded() {
    setFormMsg("Photo uploaded successfully.");
    loadPhotos();
  }

  /*
Deletes a photo from Firebase Storage and Firestore,
then re-fetches the photo list to update the UI and globe pins.
*/
  async function handleDelete(photo) {
    try {
      // Step 1: Delete file from Firebase Storage
      await deletePhotoFile({ storagePath: photo.storagePath });

      // Step 2: Delete metadata from Firestore
      await deletePhotoMetadata({ photoId: photo.id });

      setFormMsg("Photo deleted successfully.");

      // Step 3: Refresh photo list and globe pins
      loadPhotos();
    } catch (err) {
      setFormMsg("Failed to delete photo. Please try again.");
      console.error("Delete error:", err);
    }
  }


  return (
    <div>
      {/* Current selected folder name */}
      {/* <h2 style={{ marginBottom: 6 }}>Folder: {folder.name}</h2> */}
      <p>Upload photos to see their locations pinned on the globe.</p>


      {/* Photo upload form */}
      <div className="card" style={{ marginTop: 12 }}>
        <h3>Upload a photo</h3>

        <PhotoUploader
          userId={userId}
          folderId={folder.id}
          onUploaded={handleUploaded}
        />

        {formMsg && (
          <p role="status" aria-live="polite" style={{ marginTop: 12 }}>
            {formMsg}
          </p>
        )}
      </div>

      {/* Photo list */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="header" style={{ marginBottom: 8 }}>
          <h3 style={{ marginBottom: 0 }}>Photos</h3>
          <span className="badge">{photos.length} items</span>
        </div>

        {photos.length === 0 ? (
          <p style={{ marginBottom: 0 }}>
            No photos yet. Upload an image to get started.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {photos.map((p) => (
              <div
                key={p.id}
                className="card"
                style={{
                  padding: 12,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                {/* Preview image for the uploaded photo */}
                <img
                  src={p.imageUrl}
                  alt={p.caption || "Untitled photo"}
                  width="120"
                  height="80"
                  style={{
                    objectFit: "cover",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                  }}
                />

                {/* Photo metadata display */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: "var(--text)" }}>
                    <strong>{p.caption || "Untitled photo"}</strong>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                    Lat: {p.lat ?? "—"} | Lng: {p.lng ?? "—"}
                  </div>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleDelete(p)}
                  aria-label={`Delete photo ${p.caption || "Untitled photo"}`}
                  style={{
                    marginLeft: "auto",
                    background: "none",
                    border: "none",
                    fontSize: 18,
                    color: "var(--muted)",
                    padding: "4px 8px",
                    borderRadius: 4,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}