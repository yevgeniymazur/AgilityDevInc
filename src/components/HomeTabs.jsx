import { useEffect, useState } from "react";
import FolderList from "./FolderList";
import PhotoPanel from "./PhotoPanel";
import PhotoUploader from "./PhotoUploader";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

export default function HomeTabs({
  activeTab,
  selectedFolder,
  setSelectedFolder
}) {

  // current logged in user
  const [user, setUser] = useState(null);

  // profile data from Firestore
  const [profile, setProfile] = useState(null);

  // toggle edit mode
  const [isEditing, setIsEditing] = useState(false);

  // holds selected image file before upload
  const [avatarFile, setAvatarFile] = useState(null);

  // listen for login/logout
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // load user profile from Firestore
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const refDoc = doc(db, "users", user.uid);
      const snap = await getDoc(refDoc);

      if (snap.exists()) {
        setProfile(snap.data());
      } else {
        // default profile if none exists
        setProfile({
          displayName: "",
          avatarUrl: "",
          defaultMapView: "globe",
          publicProfile: false
        });
      }
    };

    loadProfile();
  }, [user]);

  // handle selecting a new profile picture
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);

    // preview image locally (before upload)
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        avatarUrl: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  // save profile (upload image + save to Firestore)
  const handleSave = async () => {
    if (!user || !profile) return;

    let avatarUrl = profile.avatarUrl || "";

    // upload image to Firebase Storage if new file selected
    if (avatarFile) {
      const storageRef = ref(storage, `avatars/${user.uid}`);

      await uploadBytes(storageRef, avatarFile);
      avatarUrl = await getDownloadURL(storageRef);
    }

    // save profile data to Firestore
    await setDoc(
      doc(db, "users", user.uid),
      {
        displayName: profile.displayName || "",
        avatarUrl,
        defaultMapView: profile.defaultMapView || "globe",
        publicProfile: profile.publicProfile || false
      },
      { merge: true }
    );

    // update UI with saved image
    setProfile((prev) => ({
      ...prev,
      avatarUrl
    }));

    setAvatarFile(null);
    setIsEditing(false);
  };

  // TRIPS TAB
  if (activeTab === "trips") {
    return (
      <div className="grid" style={{ gridTemplateColumns: "360px 1fr", gap: 16 }}>
        <div className="card">
          <h3>Trips</h3>

          {/* list of folders */}
          <FolderList
            userId={user?.uid}
            onSelectFolder={setSelectedFolder}
          />
        </div>

        <div className="card">
          {/* show selected folder content */}
          {!selectedFolder ? (
            <p>Select a trip</p>
          ) : (
            <PhotoPanel
              userId={user?.uid}
              folder={selectedFolder}
            />
          )}
        </div>
      </div>
    );
  }

  // PINS TAB (placeholder)
  if (activeTab === "pins") {
    return (
      <div>
        <h3>Pins</h3>
        <div className="card">
          <p>Pin data will show here</p>
        </div>
      </div>
    );
  }

  // UPLOAD TAB
  if (activeTab === "upload") {
    return (
      <div>
        <h3>Upload</h3>
        <div className="card">
          <PhotoUploader
            userId={user?.uid}
            folderId={selectedFolder?.id || "none"}
            onUploaded={() => {}}
          />
        </div>
      </div>
    );
  }

  // PROFILE TAB
  return (
    <div>
      <h3>Profile</h3>

      <p>Signed in as:</p>
      <p style={{ fontWeight: "bold" }}>
        {user?.email || "Unknown User"}
      </p>

      <div className="card">

        {/* loading state */}
        {!profile ? (
          <p>Loading profile...</p>

        // VIEW MODE
        ) : !isEditing ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {profile.avatarUrl && (
                <img
                  src={profile.avatarUrl}
                  alt="avatar"
                  width={60}
                  style={{ borderRadius: "50%" }}
                />
              )}

              <h4 style={{ margin: 0 }}>
                {profile.displayName || "No name set"}
              </h4>
            </div>

            {/* edit button */}
            <button
              style={{ marginTop: 12 }}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </>

        // EDIT MODE
        ) : (
          <>
            <label>Display Name</label>
            <input
              style={{ width: "100%", marginBottom: 8 }}
              value={profile.displayName}
              onChange={(e) =>
                setProfile({ ...profile, displayName: e.target.value })
              }
            />

            <label>Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />

            {/* preview image */}
            {profile.avatarUrl && (
              <img
                src={profile.avatarUrl}
                alt="avatar"
                width={80}
                style={{ borderRadius: 8, marginTop: 10 }}
              />
            )}

            <label>Default View</label>
            <select
              style={{ width: "100%", marginBottom: 8 }}
              value={profile.defaultMapView}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  defaultMapView: e.target.value
                })
              }
            >
              <option value="globe">Globe</option>
              <option value="trips">Trips</option>
              <option value="pins">Pins</option>
            </select>

            <label>
              <input
                type="checkbox"
                checked={profile.publicProfile}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    publicProfile: e.target.checked
                  })
                }
              />
              Public Profile
            </label>

            <div style={{ marginTop: 12 }}>
              <button onClick={handleSave}>Save</button>

              <button
                style={{ marginLeft: 8 }}
                onClick={() => {
                  setAvatarFile(null);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}