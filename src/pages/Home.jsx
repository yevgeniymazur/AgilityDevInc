import { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

import GlobePanel from "../components/GlobePanel";
import BottomSheet from "../components/BottomSheet";
import HomeTabs from "../components/HomeTabs";

export default function Home() {
  // Current authenticated user from Firebase
  const user = auth.currentUser;

  // Controls which tab is active inside the sheet
  const [activeTab, setActiveTab] = useState("trips");

  // Tracks which trip folder is selected
  const [selectedFolder, setSelectedFolder] = useState(null);

  const [globePoints, setGlobePoints] = useState([]);

  // Controls whether the bottom sheet is open
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="home-shell">
      {/* Accessibility link for keyboard users */}
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* Top brand area */}
      <header className="topbar" role="banner">
        <div className="brand-wrap">
          <h1 className="brand-title">Wanderloom</h1>
          <p className="brand-subtitle">Explore the world through memory</p>
        </div>

        {/* Minimal account info in top-right corner */}
        <div className="account-mini" aria-label="Account information">
          <div className="account-email">
            {user?.email || user?.displayName || "Signed in"}
          </div>
          <button
            className="account-logout"
            type="button"
            onClick={() => signOut(auth)}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main stage keeps the globe as the focal point */}
      <main id="main" className="main-stage" role="main">
        <GlobePanel points={globePoints} />

        <div className="dock-area">
          {/* Expanding menu sheet */}
          {menuOpen && (
            <BottomSheet activeTab={activeTab} setActiveTab={setActiveTab}>
              <HomeTabs
                activeTab={activeTab}
                selectedFolder={selectedFolder}
                setSelectedFolder={setSelectedFolder}
                setGlobePoints={setGlobePoints}
              />
            </BottomSheet>
          )}

          {/* Single floating menu button */}
          <button
            className="menu-toggle"
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="wanderloom-sheet"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </main>

      {/* Footer branding */}
      <div className="trademark">
        AgilityDevInc™ • Accessible by Design
      </div>
    </div>
  );
}