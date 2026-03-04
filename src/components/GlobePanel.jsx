/**
 * GlobePanel.jsx
 * PURPOSE:
 * - This is the "integration zone" for the Mapbox/MapLibre globe.
 * - Teammate can replace ONLY the inside of the <div className="globe-wrap">.
 * - Do not change outer wrapper className, so not to break CSS.
 */

export default function GlobePanel() {
  return (
    <section aria-label="Interactive globe">
      <div className="globe-wrap">
        <div style={{ position: "relative", padding: 16 }}>
          <h2 style={{ marginBottom: 6 }}>Interactive Globe</h2>
          <p style={{ maxWidth: 700 }}>
            Drag to explore Earth from orbit. Pins and photos will appear here.
          </p>

          <p style={{ fontSize: 12, marginTop: 14 }}>
            <span className="badge">TODO</span>{" "}
            Teammate: Replace this placeholder with Mapbox/MapLibre globe.
            Keep the outer <code>.globe-wrap</code> container intact.
          </p>
        </div>
      </div>
    </section>
  );
}