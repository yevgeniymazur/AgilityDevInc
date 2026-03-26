// import { useEffect, useRef } from "react";
// import Globe from "globe.gl";

// export default function GlobeView({ points = [] }) {
//   const globeRef = useRef(null);
//   const globeInstance = useRef(null);
//   const pointsRef = useRef(points); // always holds the latest points

//   useEffect(() => {
//     pointsRef.current = points;
//   }, [points]);

//   useEffect(() => {
//     if (!globeRef.current) return;

//     let frameId;

//     const globe = Globe()(globeRef.current)
//       .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
//       .backgroundColor("rgba(0,0,0,0)")
//       .pointLat((d) => d.lat)
//       .pointLng((d) => d.lng)
//       .pointLabel((d) => d.caption)
//       .pointAltitude((d) => d.altitude)
//       .pointRadius((d) => d.radius)
//       .pointColor((d) => d.color)
//       .pointsTransitionDuration(0)
//       .width(globeRef.current.offsetWidth)
//       .height(600);

//     const controls = globe.controls();
//     controls.autoRotate = false;
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.08;
//     controls.rotateSpeed = 0.6;
//     controls.zoomSpeed = 0.8;

//     globeInstance.current = globe;

//     function angularDistance(lat1, lng1, lat2, lng2) {
//       const toRad = (deg) => (deg * Math.PI) / 180;
//       const phi1 = toRad(lat1);
//       const phi2 = toRad(lat2);
//       const lambda1 = toRad(lng1);
//       const lambda2 = toRad(lng2);
//       const cosAngle =
//         Math.sin(phi1) * Math.sin(phi2) +
//         Math.cos(phi1) * Math.cos(phi2) * Math.cos(lambda1 - lambda2);
//       const safeCos = Math.min(1, Math.max(-1, cosAngle));
//       return Math.acos(safeCos) * (180 / Math.PI);
//     }

//     function updatePoints() {
//       const pov = globe.pointOfView();

//       const dynamicData = pointsRef.current.map((point) => {
//         const distance = angularDistance(point.lat, point.lng, pov.lat, pov.lng);
//         const strength = Math.max(0, 1 - distance / 90);
//         const hidden = distance >= 90;

//         return {
//           ...point,
//           altitude: hidden ? 0 : 0.003 + strength * 0.07,
//           radius: hidden ? 0.0001 : 0.03 + strength * 0.22,
//           color: hidden
//             ? "rgba(255, 235, 160, 0)"
//             : `rgba(255, 235, 160, ${0.1 + strength * 0.9})`,
//         };
//       });

//       globe.pointsData(dynamicData);
//       frameId = requestAnimationFrame(updatePoints);
//     }

//     updatePoints();

//     const handleResize = () => {
//       if (!globeRef.current) return;
//       globe.width(globeRef.current.offsetWidth);
//       globe.height(600);
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       cancelAnimationFrame(frameId);
//       window.removeEventListener("resize", handleResize);
//       if (globeRef.current) {
//         globeRef.current.innerHTML = "";
//       }
//     };
//   }, []);

//   return (
//     <div
//       ref={globeRef}
//       style={{ width: "100%", height: "600px", marginTop: "80px" }}
//     />
//   );
// }


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
      center: [0, 20],
      zoom: 1.5,
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
            // display: "flex",
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
              alt={popup.caption || "Photo"}
              width="180"
              height="160"
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
          )}

          {/* Caption and coordinates */}
          <div>
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>
              {popup.caption || "Untitled photo"}
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
    </div>
  );
}