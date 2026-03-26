import { useState, useEffect } from "react";
import { getPhotosByUser } from "../services/photoMetadataService";
import { auth } from "../firebase";

/*
PinsTab Component

PURPOSE
- Fetches all photos across every album for the current user
- Passes all GPS coordinates to the globe as pins
- Displays a count of how many pins are on the map
*/

export default function PinsTab({ setGlobePoints }) {
    const user = auth.currentUser;
    const [pinCount, setPinCount] = useState(0);

    useEffect(() => {
        async function loadAllPins() {
            const results = await getPhotosByUser({ userId: user?.uid });

            const points = results
                .filter((p) => p.lat && p.lng)
                .map((p) => ({
                    lat: p.lat,
                    lng: p.lng,
                    caption: p.caption || "Untitled photo",
                    imageUrl: p.imageUrl,
                }));

            setGlobePoints(points);
            setPinCount(points.length);
        }

        loadAllPins();
    }, []);

    return (
        <div>
            <h3 style={{ marginTop: 0 }}>Pins</h3>
            <p>Showing all photo locations across every trip.</p>

            <div className="card" style={{ marginTop: 10 }}>
                <div className="header" style={{ marginBottom: 8 }}>
                    <h3 style={{ marginBottom: 0 }}>All Pins</h3>
                    <span className="badge">{pinCount} pins</span>
                </div>

                {pinCount === 0 ? (
                    <p style={{ marginBottom: 0 }}>
                        No pins yet. Upload photos with GPS data to see them here.
                    </p>
                ) : (
                    <p style={{ marginBottom: 0 }}>
                        {pinCount} photo {pinCount === 1 ? "location" : "locations"} pinned on the map.
                    </p>
                )}
            </div>
        </div>
    );
}