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

export default function GlobePanel() {
  return (
    <section aria-label="Interactive globe">
      {/* Globe container used by the layout and styling system */}
      <div className="globe-wrap">
        <div style={{ position: "relative", padding: 16 }}>
          <h2 style={{ marginBottom: 6 }}>Interactive Globe</h2>

          <p style={{ maxWidth: 700 }}>
            Drag to explore Earth from orbit. Pins and photos will appear here.
          </p>

          {/* Placeholder content until the map library is integrated */}
          <p style={{ fontSize: 12, marginTop: 14 }}>
            <span className="badge">TODO</span>{" "}
            Teammate: Replace this placeholder with a Mapbox/MapLibre globe.
            Keep the outer <code>.globe-wrap</code> container intact.
          </p>
        </div>
      </div>
    </section>
  );
}