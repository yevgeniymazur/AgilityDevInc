import { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

import GlobePanel from "../components/GlobePanel";
import BottomDock from "../components/BottomDock";
import BottomSheet from "../components/BottomSheet";
import HomeTabs from "../components/HomeTabs";

export default function Home() {
  // Current authenticated user from Firebase
  const user = auth.currentUser;

  /*
  Controls which bottom dock tab is active.
  Example tabs: Trips, Map, Photos, etc.
  */
  const [activeTab, setActiveTab] = useState("trips");

  /*
  Tracks which travel folder is currently selected.
  This allows the UI to show folder contents in the tab view.
  */
  const [selectedFolder, setSelectedFolder] = useState(null);

  return (
    <div className="container">

      {/* Accessibility link allowing keyboard users to skip navigation */}
      <a className="skip-link" href="#main">Skip to content</a>

      {/* Top header with app title and authentication info */}
      <header className="header card" role="banner">
        <div>
          <h1>Wanderloom</h1>
          <span className="badge">Orbit UI</span>
        </div>

        {/* User info and logout button */}
        <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            Signed in as{" "}
            <strong style={{ color: "var(--text)" }}>
              {user?.email || user?.displayName}
            </strong>
          </div>

          {/* Firebase logout button */}
          <button
            className="primary"
            type="button"
            onClick={() => signOut(auth)}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main application content */}
      <main id="main" role="main" style={{ marginTop: 16, flex: 1 }}>

        {/* Interactive globe or map panel */}
        <GlobePanel />

        {/* Bottom navigation dock and sliding content panel */}
        <div className="dock-area" style={{ marginTop: 14 }}>

          {/* BottomSheet holds the content area controlled by tabs */}
          <BottomSheet activeTab={activeTab} setActiveTab={setActiveTab}>

            {/* HomeTabs renders tab-specific content such as trip folders */}
            <HomeTabs
              activeTab={activeTab}
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
            />

          </BottomSheet>

          {/* BottomDock is the main navigation bar for switching tabs */}
          <BottomDock
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

        </div>
      </main>

      {/* Footer branding */}
      <div className="trademark">
        AgilityDevInc™ • Accessible by Design
      </div>

    </div>
  );
}