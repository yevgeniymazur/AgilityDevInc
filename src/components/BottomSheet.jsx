/*
BottomSheet Component

PURPOSE
- Displays the expandable bottom panel used for main navigation content.
- Contains the tab buttons and the active tab content.
*/

export default function BottomSheet({ activeTab, setActiveTab, children }) {
  const tabs = [
    { id: "trips", label: "Trips" },
    { id: "pins", label: "Pins" },
    { id: "upload", label: "Upload" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <div
      id="wanderloom-sheet"
      className="sheet"
      aria-label="Quick actions panel"
    >
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

          {/* Active tab content */}
          <div role="tabpanel">{children}</div>

          {/* Accessibility note */}
          <p style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
            <span className="badge">ADA</span>{" "}
            Menu is keyboard accessible and can be opened with Enter or Space.
          </p>
        </div>
      </div>
    </div>
  );
}