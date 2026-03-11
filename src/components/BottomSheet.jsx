/*
BottomSheet Component

PURPOSE
- Displays the expandable bottom panel used for main navigation content.
- Works together with BottomDock to control which tab is active.

FUNCTION
- Shows tab buttons (Trips, Pins, Upload, Profile)
- Displays the content of the selected tab
- Uses accessibility roles so screen readers recognize the tab system
*/

export default function BottomSheet({ activeTab, setActiveTab, children }) {

  // List of tabs shown at the top of the panel
  const tabs = [
    { id: "trips", label: "Trips" },
    { id: "pins", label: "Pins" },
    { id: "upload", label: "Upload" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <div className="sheet" aria-label="Quick actions panel">
      <div className="sheet-inner">
        <div className="card">

          {/* Tab navigation bar */}
          <div className="tabbar" role="tablist" aria-label="Home tabs">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={activeTab === t.id}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content area for whichever tab is active */}
          <div role="tabpanel">
            {children}
          </div>

          {/* Accessibility note for keyboard interaction */}
          <p style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
            <span className="badge">ADA</span>{" "}
            Panel opens on hover or keyboard focus. Press Tab to enter.
          </p>

        </div>
      </div>
    </div>
  );
}