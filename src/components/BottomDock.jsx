export default function BottomDock({ setActiveTab }) {
  return (
    <div className="dock" aria-label="Home dock">
      <button className="primary" type="button" onClick={() => setActiveTab("trips")}>
        Trips
      </button>
      <button type="button" onClick={() => setActiveTab("pins")}>
        Pins
      </button>
      <button type="button" onClick={() => setActiveTab("upload")}>
        Upload
      </button>
      <button type="button" onClick={() => setActiveTab("profile")}>
        Profile
      </button>
    </div>
  );
}