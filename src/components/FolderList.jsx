import { useEffect, useState } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function FolderList({ userId, onSelectFolder }) {
  const [name, setName] = useState("");
  const [folders, setFolders] = useState([]);
  const [status, setStatus] = useState("");

  async function loadFolders() {
    const q = query(collection(db, "folders"), where("userId", "==", userId));
    const snap = await getDocs(q);
    setFolders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  async function createFolder(e) {
    e.preventDefault();
    setStatus("");

    const trimmed = name.trim();
    if (!trimmed) {
      setStatus("Folder name is required.");
      return;
    }

    await addDoc(collection(db, "folders"), {
      userId,
      name: trimmed,
      createdAt: new Date(),
    });

    setName("");
    setStatus("Folder created.");
    loadFolders();
  }

  useEffect(() => {
    loadFolders();
  }, []);

  return (
    <aside className="card" aria-label="Trip folders">
      <h2>Your Trips</h2>
      <p>Create a folder for each trip (e.g., “Japan 2026”).</p>

      <form onSubmit={createFolder} aria-describedby={status ? "folder-status" : undefined}>
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
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                Manage photos and pins
              </div>
            </button>
          ))
        )}
      </div>

      <p style={{ fontSize: 12, marginTop: 14 }}>
        <span className="badge">ADA</span>{" "}
        Buttons are keyboard accessible with visible focus.
      </p>
    </aside>
  );
}