/**
 * GlobePanel Component
 *
 * PURPOSE
 * - Serves as the integration area for the interactive globe.
 * - This will eventually render a Mapbox or MapLibre globe visualization.
 *
 * IMPORTANT FOR TEAMMATES
 * - Only replace the contents inside the `.globe-wrap` container.
 * - Do NOT remove or rename the `.globe-wrap` class because
 *   the CSS layout depends on it.
 *
 * FUTURE FEATURES
 * - Display map pins linked to uploaded photos
 * - Show trip locations on the globe
 * - Allow clicking pins to view photo metadata
 */

import GlobeView from "./GlobeView";

export default function GlobePanel({ points = [] }) {
  return (
    <section aria-label="Interactive map showing photo locations">
      <div className="globe-wrap">
        <div style={{ position: "relative", padding: 16 }}>
          <h2 style={{ marginBottom: 6 }}>Interactive World Map</h2>
          <p style={{ maxWidth: 700 }}>
            Drag to explore the world map. Pins and photos from current album will appear here.
          </p>
          <GlobeView points={points} />
        </div>
      </div>
    </section>
  );
}