export default function BottomSheet({ activeTab, setActiveTab, children }) {
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

          <div role="tabpanel">{children}</div>

          <p style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
            <span className="badge">ADA</span>{" "}
            Panel opens on hover or keyboard focus. Press Tab to enter.
          </p>
        </div>
      </div>
    </div>
  );
}