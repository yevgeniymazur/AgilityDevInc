import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function GlobeView({ points = [] }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const pointsRef = useRef(points);

  // Tracks the currently open popup content
  const [popup, setPopup] = useState(null);

  //track state of expanded photo from popup
  const [expandedPhoto, setExpandedPhoto] = useState(null);

  // Keep pointsRef in sync with latest points prop
  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  // Initialize the map once on mount
  useEffect(() => {
    if (!mapRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      showRoadLabels: false,
      center: [0, 20],
      zoom: 2.0,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update markers whenever points change
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add a marker for each point
    points.forEach((point) => {
      const el = document.createElement("div");
      el.style.cssText = `
        width: 14px;
        height: 14px;
        background: rgba(255, 235, 160, 0.9);
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([point.lng, point.lat])
        .addTo(map);

      // Show popup on click
      el.addEventListener("click", () => {
        setPopup(point);

        map.flyTo({
          center: [point.lng, point.lat],
          zoom: 6,
          speed: 1.2,
        });
      });

      markersRef.current.push(marker);
    });
  }, [points]);

  return (
    <div style={{ position: "relative", width: "100%", height: "600px" }}>

      {/* Map container */}
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* Photo popup */}
      {popup && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--card, #1e1e2e)",
            border: "1px solid var(--border, #333)",
            borderRadius: 12,
            padding: 12,
            gap: 12,
            alignItems: "center",
            zIndex: 10,
            maxWidth: 320,
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >

          {/* Photo preview */}
          {popup.imageUrl && (
            <img
              src={popup.imageUrl}
              alt={popup.caption || " "}
              width="180"
              height="160"
              onClick={() => setExpandedPhoto(popup)}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
          )}

          {/* Caption and coordinates */}
          <div>
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>
              {popup.caption || " "}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted, #888)" }}>
              {popup.lat?.toFixed(4)}, {popup.lng?.toFixed(4)}
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={() => setPopup(null)}
            style={{
              background: "none",
              border: "none",
              fontSize: 16,
              color: "var(--muted, #888)",
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

      )}

      {expandedPhoto && (
        <div
          onClick={() => setExpandedPhoto(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            cursor: "pointer",
          }}
        >
          <img
            src={expandedPhoto.imageUrl}
            alt={expandedPhoto.caption || "Photo"}
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              borderRadius: 12,
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              objectFit: "contain",
            }}
          />
          {expandedPhoto.caption && (
            <p style={{ color: "white", marginTop: 12, fontSize: 14 }}>
              {expandedPhoto.caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}