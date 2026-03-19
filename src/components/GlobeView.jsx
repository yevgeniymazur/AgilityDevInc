import { useEffect, useRef } from "react";
import Globe from "globe.gl";

export default function GlobeView() {
  const globeRef = useRef(null);

  useEffect(() => {
    if (!globeRef.current) return;

    const baseData = [
      { lat: 47.6062, lng: -122.3321, caption: "Seattle" },
      { lat: 40.7128, lng: -74.006, caption: "New York" },
      { lat: 51.5072, lng: -0.1276, caption: "London" },
    ];

    let frameId;

    const globe = Globe()(globeRef.current)
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
      .backgroundColor("rgba(0,0,0,0)")
      .pointLat((d) => d.lat)
      .pointLng((d) => d.lng)
      .pointLabel((d) => d.caption)
      .pointAltitude((d) => d.altitude)
      .pointRadius((d) => d.radius)
      .pointColor((d) => d.color)
      .pointsTransitionDuration(0)
      .width(globeRef.current.offsetWidth)
      .height(600);

    const controls = globe.controls();
    controls.autoRotate = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.6;
    controls.zoomSpeed = 0.8;

    function angularDistance(lat1, lng1, lat2, lng2) {
      const toRad = (deg) => (deg * Math.PI) / 180;

      const phi1 = toRad(lat1);
      const phi2 = toRad(lat2);
      const lambda1 = toRad(lng1);
      const lambda2 = toRad(lng2);

      const cosAngle =
        Math.sin(phi1) * Math.sin(phi2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.cos(lambda1 - lambda2);

      const safeCos = Math.min(1, Math.max(-1, cosAngle));
      return Math.acos(safeCos) * (180 / Math.PI);
    }

    function updatePoints() {
      const pov = globe.pointOfView();

      const dynamicData = baseData.map((point) => {
        const distance = angularDistance(point.lat, point.lng, pov.lat, pov.lng);

        // Front half only: 0 at 90° and beyond, 1 at center
        const strength = Math.max(0, 1 - distance / 90);

        // Hide points once they move behind the visible hemisphere
        const hidden = distance >= 90;

        return {
          ...point,
          altitude: hidden ? 0 : 0.003 + strength * 0.07,
          radius: hidden ? 0.0001 : 0.03 + strength * 0.22,
          color: hidden
            ? "rgba(255, 235, 160, 0)"
            : `rgba(255, 235, 160, ${0.1 + strength * 0.9})`,
        };
      });

      globe.pointsData(dynamicData);
      frameId = requestAnimationFrame(updatePoints);
    }

    updatePoints();

    const handleResize = () => {
      if (!globeRef.current) return;
      globe.width(globeRef.current.offsetWidth);
      globe.height(600);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      if (globeRef.current) {
        globeRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      ref={globeRef}
      style={{
        width: "100%",
        height: "600px",
        marginTop: "80px",
      }}
    />
  );
}