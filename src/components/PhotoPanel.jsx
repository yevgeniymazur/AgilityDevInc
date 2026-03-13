import { useState } from "react";
import PhotoUploader from "./PhotoUploader";

/*
PhotoPanel Component

PURPOSE
- Displays photo upload controls and metadata fields.
- Lets the user add a caption and optional coordinates.
- For the MVP demo, uploaded photos are stored only in component state.

FUTURE PLAN
- Save photo metadata in Firestore
- Load saved photos by folderId
- Use storagePath later for delete/edit actions
*/

export default function PhotoPanel({ userId, folder }) {
  // Demo photo list stored locally in component state
  const [photos, setPhotos] = useState([]);

  // Metadata fields for the photo being added
  const [caption, setCaption] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  // Status message for validation or successful add
  const [formMsg, setFormMsg] = useState("");

  /*
  Runs after PhotoUploader finishes uploading.
  Receives the uploaded image URL and storage path from the service,
  validates optional coordinates, and adds the photo to the demo list.
  */
  function handleUploaded({ imageUrl, storagePath }) {
    setFormMsg("");

    // Convert coordinate text values into numbers when provided
    const parsedLat = lat.trim() === "" ? null : Number(lat);
    const parsedLng = lng.trim() === "" ? null : Number(lng);

    // Basic validation so users get clear accessible feedback
    if (parsedLat !== null && Number.isNaN(parsedLat)) {
      setFormMsg("Latitude must be a number.");
      return;
    }

    if (parsedLng !== null && Number.isNaN(parsedLng)) {
      setFormMsg("Longitude must be a number.");
      return;
    }

    // Add the uploaded photo and metadata to the local demo list
    setPhotos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        imageUrl,
        storagePath,
        caption: caption.trim() || "Untitled photo",
        lat: parsedLat,
        lng: parsedLng,
      },
    ]);

    // Clear input fields after successful add
    setCaption("");
    setLat("");
    setLng("");
    setFormMsg("Photo added to demo list.");
  }

  return (
    <div>
      {/* Current selected folder name */}
      <h2 style={{ marginBottom: 6 }}>Folder: {folder.name}</h2>
      <p>Add a photo and optional coordinates (future map pin).</p>

      {/* Photo metadata form and uploader */}
      <div className="card" style={{ marginTop: 12 }}>
        <h3>Photo details</h3>

        <div className="row" style={{ marginTop: 10 }}>
          <div>
            <label htmlFor="caption">Caption</label>
            <input
              id="caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Eiffel Tower at sunset"
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="coords">Coordinates (optional)</label>

            {/* Separate latitude and longitude inputs */}
            <div
              className="row"
              style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}
            >
              <input
                id="coords"
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="Latitude"
                aria-label="Latitude"
              />
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="Longitude"
                aria-label="Longitude"
              />
            </div>
          </div>
        </div>

        <hr />

        {/* Upload UI handled by PhotoUploader component */}
        <PhotoUploader
          userId={userId}
          folderId={folder.id}
          onUploaded={handleUploaded}
        />

        {/* Displays validation or success message */}
        {formMsg && (
          <p role="status" aria-live="polite" style={{ marginTop: 12 }}>
            {formMsg}
          </p>
        )}
      </div>

      {/* Demo list of uploaded photos */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="header" style={{ marginBottom: 8 }}>
          <h3 style={{ marginBottom: 0 }}>Photos (MVP demo list)</h3>
          <span className="badge">{photos.length} items</span>
        </div>

        {photos.length === 0 ? (
          <p style={{ marginBottom: 0 }}>
            No photos yet. Upload an image to demo the flow.
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
                  alt={p.caption}
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
                    <strong>{p.caption}</strong>
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      marginTop: 4,
                    }}
                  >
                    Lat: {p.lat ?? "—"} | Lng: {p.lng ?? "—"}
                  </div>

                  {/* storagePath will be useful later for delete functionality */}
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      marginTop: 4,
                    }}
                  >
                    <span className="badge">TODO</span>{" "}
                    storagePath placeholder for delete: <code>{p.storagePath}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Developer note for future Firestore integration */}
        <p style={{ fontSize: 12, marginTop: 12 }}>
          <span className="badge">TODO</span>{" "}
          Teammate: replace in-memory list with Firestore <code>photos</code> collection.
        </p>
      </div>
    </div>
  );
}