export default function BottomDock({ activeTab, setActiveTab }) {
  return (
    <div className="dock" aria-label="Home dock">
      <button className={activeTab === "trips" ? "primary" : ""} type="button" onClick={() => setActiveTab("trips")}>
        Trips
      </button>
      <button className={activeTab === "pins" ? "primary" : ""} type="button" onClick={() => setActiveTab("pins")}>
        Pins
      </button>
      <button className={activeTab === "upload" ? "primary" : ""} type="button" onClick={() => setActiveTab("upload")}>
        Upload
      </button>
      <button className={activeTab === "profile" ? "primary" : ""} type="button" onClick={() => setActiveTab("profile")}>
        Profile
      </button>
    </div>
  );
}