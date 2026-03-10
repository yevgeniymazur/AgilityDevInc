import { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

import GlobePanel from "../components/GlobePanel";
import BottomDock from "../components/BottomDock";
import BottomSheet from "../components/BottomSheet";
import HomeTabs from "../components/HomeTabs";

export default function Home() {
  const user = auth.currentUser;

  const [activeTab, setActiveTab] = useState("trips");
  const [selectedFolder, setSelectedFolder] = useState(null);

  return (
    <div className="container">
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="header card" role="banner">
        <div>
          <h1>Wanderloom</h1>
          <span className="badge">Orbit UI</span>
        </div>

        <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            Signed in as{" "}
            <strong style={{ color: "var(--text)" }}>
              {user?.email || user?.displayName}
            </strong>
          </div>
          <button className="primary" type="button" onClick={() => signOut(auth)}>
            Logout
          </button>
        </div>
      </header>

      <main id="main" role="main" style={{ marginTop: 16, flex: 1 }}>
        <GlobePanel />

        {/* Dock + Sheet area */}
        <div className="dock-area" style={{ marginTop: 14 }}>
          <BottomSheet activeTab={activeTab} setActiveTab={setActiveTab}>
            <HomeTabs
              activeTab={activeTab}
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
            />
          </BottomSheet>

          <BottomDock activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </main>

      <div className="trademark">
        AgilityDevInc™ • Accessible by Design
      </div>
    </div>
  );
}