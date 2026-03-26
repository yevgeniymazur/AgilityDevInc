import { useEffect, useState } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/*
FolderList Component

PURPOSE
- Displays the user's trip folders from Firestore
- Allows the user to create a new folder
- Lets the user select a folder to view its contents

FIREBASE
- Reads from the "folders" collection
- Filters folders by the current user's userId
*/

export default function FolderList({ userId, onSelectFolder }) {
  // Stores new folder name input
  const [name, setName] = useState("");

  // Stores folders loaded from Firestore
  const [folders, setFolders] = useState([]);

  // Status message for validation or successful actions
  const [status, setStatus] = useState("");

  /*
  Loads all folders for the current user from Firestore.
  This runs when the component first loads and again after
  a new folder is created.
  */
  async function loadFolders() {
    const q = query(collection(db, "folders"), where("userId", "==", userId));
    const snap = await getDocs(q);

    setFolders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  /*
  Creates a new folder in Firestore using the entered folder name.
  After creation, the folder list is refreshed.
  */
  async function createFolder(e) {
    e.preventDefault();
    setStatus("");

    const trimmed = name.trim();

    // Prevent empty folder names
    if (!trimmed) {
      setStatus("Folder name is required.");
      return;
    }

    // Add new folder document to Firestore
    await addDoc(collection(db, "folders"), {
      userId,
      name: trimmed,
      createdAt: new Date(),
    });

    setName("");
    setStatus("Folder created.");

    // Refresh the list so the new folder appears immediately
    loadFolders();
  }

  /*
  Load folders when the component first mounts.
  This gives the user their saved trip list on page load.
  */
  useEffect(() => {
    loadFolders();
  }, []);

  return (
    <>
      <h2>Your Trips</h2>
      <p>Create a folder for each trip (e.g., “Japan 2026”).</p>

      {/* Form for creating a new trip folder */}
      <form
        onSubmit={createFolder}
        aria-describedby={status ? "folder-status" : undefined}
      >
        <label htmlFor="folderName">New folder name</label>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            id="folderName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Japan 2026"
            autoComplete="off"
          />
          <button className="primary" type="submit">
            Create
          </button>
        </div>

        {/* Accessible status message for validation/success */}
        {status && (
          <p
            id="folder-status"
            style={{ marginTop: 10 }}
            role="status"
            aria-live="polite"
          >
            {status}
          </p>
        )}
      </form>

      <hr />

      {/* Render saved folders or an empty-state message */}
      <div style={{ display: "grid", gap: 10 }}>
        {folders.length === 0 ? (
          <p style={{ marginBottom: 0 }}>No folders yet.</p>
        ) : (
          folders.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onSelectFolder(f)}
              aria-label={`Open folder ${f.name}`}
              style={{ textAlign: "left" }}
            >
              <strong>{f.name}</strong>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  marginTop: 4,
                }}
              >
                Manage photos and pins
              </div>
            </button>
          ))
        )}
      </div>
      </>
  );
}