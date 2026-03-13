import FolderList from "./FolderList";
import PhotoPanel from "./PhotoPanel";
import PhotoUploader from "./PhotoUploader";
import { auth } from "../firebase";

/*
HomeTabs Component

PURPOSE
- Controls which content is shown inside the bottom sheet area.
- Each tab displays a different part of the Wanderloom UI.

TABS
- Trips   -> folder list and selected trip content
- Pins    -> placeholder for map pin data
- Upload  -> standalone upload panel
- Profile -> signed-in user information and future settings

LAYOUT NOTES
- The Trips tab uses a two-column layout
- Folder list stays separate from selected folder content
- Built to expand later with Firebase and map integration
*/

export default function HomeTabs({
  activeTab,
  selectedFolder,
  setSelectedFolder
}) {
  // Current logged-in Firebase user
  const user = auth.currentUser;

  /* =========================
     TRIPS TAB
     Shows trip folders on the left
     and selected trip content on the right
     ========================= */
  if (activeTab === "trips") {
    return (
      <div
        className="grid"
        style={{
          gridTemplateColumns: "360px 1fr",
          gap: 16,
          alignItems: "start"
        }}
      >
        {/* Left panel: folder list for selecting a trip */}
        <div className="card scroll-panel">
          <h3 style={{ marginTop: 0 }}>Trips</h3>

          <p style={{ fontSize: 13, color: "var(--muted)" }}>
            Organize travel photos by trip folder.
          </p>

          <FolderList
            userId={user?.uid}
            onSelectFolder={setSelectedFolder}
          />

          {/* Accessibility note for keyboard navigation */}
          <p style={{ fontSize: 12, marginTop: 12 }}>
            <span className="badge">ADA</span>{" "}
            Buttons are keyboard accessible with visible focus.
          </p>
        </div>

        {/* Right panel: selected folder details and photo tools */}
        <div className="card">
          {!selectedFolder ? (
            <>
              <h3 style={{ marginTop: 0 }}>Select a Trip</h3>

              <p>
                Choose a folder on the left to manage photos and future
                globe pins.
              </p>

              <p style={{ fontSize: 12 }}>
                <span className="badge">TODO</span>{" "}
                This panel will later show photos, metadata, and pin
                locations for the selected trip.
              </p>
            </>
          ) : (
            <>
              <h3 style={{ marginTop: 0 }}>
                {selectedFolder.name}
              </h3>

              <p style={{ fontSize: 13, color: "var(--muted)" }}>
                Manage photos and pins for this trip.
              </p>

              {/* PhotoPanel handles uploads, captions, and coordinates */}
              <PhotoPanel
                userId={user?.uid}
                folder={selectedFolder}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  /* =========================
     PINS TAB
     Placeholder for future globe pin integration
     ========================= */
  if (activeTab === "pins") {
    return (
      <div>
        <h3 style={{ marginTop: 0 }}>Pins</h3>

        <p>
          Pins represent locations tied to uploaded photos.
        </p>

        <div className="card" style={{ marginTop: 10 }}>
          <p style={{ marginBottom: 0 }}>
            <span className="badge">TODO</span>{" "}
            Teammate will connect Firestore pin data and display
            pins on the globe.
          </p>

          <p style={{ fontSize: 12 }}>
            Expected data format:
          </p>

          {/* Example structure for future pin documents */}
          <pre style={{ fontSize: 12 }}>
{`{
  id: string
  lat: number
  lng: number
  caption: string
  imageUrl: string
}`}
          </pre>
        </div>
      </div>
    );
  }

  /* =========================
     UPLOAD TAB
     Standalone uploader for quick photo uploads
     ========================= */
  if (activeTab === "upload") {
    return (
      <div>
        <h3 style={{ marginTop: 0 }}>Upload</h3>

        <p>
          Upload photos for your trips. These can later become
          globe pins.
        </p>

        <div className="card" style={{ marginTop: 10 }}>
          <PhotoUploader
            userId={user?.uid}
            folderId={selectedFolder?.id || "no-folder-selected"}
            onUploaded={() => {}}
          />

          <p style={{ fontSize: 12 }}>
            <span className="badge">TODO</span>{" "}
            Replace stub upload with Firebase Storage integration
            in <code>services/photoService.js</code>.
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     PROFILE TAB
     Displays signed-in user info and future settings
     ========================= */
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Profile</h3>

      <p style={{ marginBottom: 6 }}>
        Signed in as:
      </p>

      <p style={{ fontWeight: "bold" }}>
        {user?.email || "Unknown User"}
      </p>

      <div className="card" style={{ marginTop: 10 }}>
        <p style={{ marginBottom: 0 }}>
          <span className="badge">TODO</span>{" "}
          Future settings:
        </p>

        <ul style={{ marginTop: 8 }}>
          <li>Display name</li>
          <li>Avatar</li>
          <li>Default map view</li>
          <li>Privacy settings</li>
        </ul>
      </div>
    </div>
  );
}