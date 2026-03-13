/*
BottomDock Component

PURPOSE
- Provides the main navigation buttons at the bottom of the interface.
- Allows the user to switch between the main application tabs.

FUNCTION
- Updates the active tab state when a button is clicked.
- Works together with BottomSheet, which displays the content
  for the currently selected tab.
*/

export default function BottomDock({ activeTab, setActiveTab }) {
  return (
    <div className="dock" aria-label="Home dock">

      {/* Trips tab button */}
      <button
        className={activeTab === "trips" ? "primary" : ""}
        type="button"
        onClick={() => setActiveTab("trips")}
      >
        Trips
      </button>

      {/* Pins tab button */}
      <button
        className={activeTab === "pins" ? "primary" : ""}
        type="button"
        onClick={() => setActiveTab("pins")}
      >
        Pins
      </button>

      {/* Upload tab button */}
      <button
        className={activeTab === "upload" ? "primary" : ""}
        type="button"
        onClick={() => setActiveTab("upload")}
      >
        Upload
      </button>

      {/* Profile tab button */}
      <button
        className={activeTab === "profile" ? "primary" : ""}
        type="button"
        onClick={() => setActiveTab("profile")}
      >
        Profile
      </button>

    </div>
  );
}