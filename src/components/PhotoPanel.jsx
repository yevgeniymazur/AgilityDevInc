import { useState } from "react";
import PhotoUploader from "./PhotoUploader";

/**
 * PhotoPanel
 * PURPOSE:
 * - Shows upload UI + metadata fields (caption, lat/lng).
 * - MVP stores photos in component state for demo (no Storage needed).
 *
 * TODO [TEAMMATE]:
 * - Persist photo metadata to Firestore collection "photos"
 * - Load photos by folderId from Firestore
 */
export default function PhotoPanel({ userId, folder }) {
  const [photos, setPhotos] = useState([]);
  const [caption, setCaption] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [formMsg, setFormMsg] = useState("");

  function handleUploaded({ imageUrl, storagePath }) {
    setFormMsg("");

    const parsedLat = lat.trim() === "" ? null : Number(lat);
    const parsedLng = lng.trim() === "" ? null : Number(lng);

    // Basic validation (ADA-friendly: message + not color-only)
    if (parsedLat !== null && Number.isNaN(parsedLat)) {
      setFormMsg("Latitude must be a number.");
      return;
    }
    if (parsedLng !== null && Number.isNaN(parsedLng)) {
      setFormMsg("Longitude must be a number.");
      return;
    }

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

    setCaption("");
    setLat("");
    setLng("");
    setFormMsg("Photo added to demo list.");
  }

  return (
    <div>
      <h2 style={{ marginBottom: 6 }}>Folder: {folder.name}</h2>
      <p>Add a photo and optional coordinates (future map pin).</p>

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
            <div className="row" style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}>
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

        <PhotoUploader userId={userId} folderId={folder.id} onUploaded={handleUploaded} />

        {formMsg && (
          <p role="status" aria-live="polite" style={{ marginTop: 12 }}>
            {formMsg}
          </p>
        )}
      </div>

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
                <img
                  src={p.imageUrl}
                  alt={p.caption}
                  width="120"
                  height="80"
                  style={{ objectFit: "cover", borderRadius: 10, border: "1px solid var(--border)" }}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: "var(--text)" }}>
                    <strong>{p.caption}</strong>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                    Lat: {p.lat ?? "—"} | Lng: {p.lng ?? "—"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                    <span className="badge">TODO</span>{" "}
                    storagePath placeholder for delete: <code>{p.storagePath}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{ fontSize: 12, marginTop: 12 }}>
          <span className="badge">TODO</span>{" "}
          Teammate: replace in-memory list with Firestore <code>photos</code> collection.
        </p>
      </div>
    </div>
  );
}