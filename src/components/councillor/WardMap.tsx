import { useCallback, useMemo, useRef, useState, type CSSProperties } from "react";
import Map, { Source, Layer, Popup, NavigationControl } from "react-map-gl/mapbox";
import type { MapRef, LayerProps } from "react-map-gl/mapbox";
import type { GeoJSONFeature, MapMouseEvent } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { WardReportSummary } from "@/lib/councillorAuth";

// Pin color signals who the ticket is sitting on: red = still with the
// councillor unescalated, orange = sent to the department awaiting them,
// green = resolved. Ported from signal-desk-municipal-councillor's WardMap.
const STATUS_COLOR: Record<string, string> = {
  pending: "#FF453A",
  escalated: "#FF9F0A",
  resolved: "#30D158",
  new: "#FF453A",
  pending_approval: "#FF453A",
  reopened: "#FF453A",
  allocated: "#FF9F0A",
  in_progress: "#FF9F0A",
  closed: "#30D158",
  ignored: "#30D158",
};

const FALLBACK_COLOR = "#8899aa";
const WARD_CENTER = { longitude: 28.011, latitude: -26.024, zoom: 13 };
const SOURCE_ID = "ward-reports";

const UNCLUSTERED_LAYER = {
  id: "unclustered-point",
  type: "circle",
  source: SOURCE_ID,
  paint: {
    "circle-color": [
      "match",
      ["get", "status"],
      "resolved", STATUS_COLOR["resolved"], "closed", STATUS_COLOR["closed"], "ignored", STATUS_COLOR["ignored"],
      "allocated", STATUS_COLOR["allocated"], "in_progress", STATUS_COLOR["in_progress"], "escalated", STATUS_COLOR["escalated"],
      "new", STATUS_COLOR["new"], "pending_approval", STATUS_COLOR["pending_approval"], "reopened", STATUS_COLOR["reopened"],
      FALLBACK_COLOR,
    ],
    "circle-radius": 6,
    "circle-stroke-width": 2,
    "circle-stroke-color": "rgba(255,255,255,0.25)",
  },
} as unknown as LayerProps;

function MapLegend() {
  const sectionLabelStyle: CSSProperties = {
    fontSize: 9,
    fontWeight: 700,
    color: "rgba(245,245,244,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 6,
  };
  const rowStyle: CSSProperties = { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 };
  const labelStyle: CSSProperties = { fontSize: 10, color: "rgba(245,245,244,0.6)" };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 14,
        left: 14,
        zIndex: 10,
        background: "rgba(5,5,5,0.85)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8,
        padding: "10px 12px",
        backdropFilter: "blur(8px)",
      }}
    >
      <p style={sectionLabelStyle}>Report status</p>
      {[
        { color: STATUS_COLOR["pending"], label: "Pending" },
        { color: STATUS_COLOR["escalated"], label: "Escalated" },
        { color: STATUS_COLOR["resolved"], label: "Resolved" },
      ].map((l, i, arr) => (
        <div key={l.label} style={i === arr.length - 1 ? { ...rowStyle, marginBottom: 0 } : rowStyle}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, display: "inline-block", flexShrink: 0 }} />
          <span style={labelStyle}>{l.label}</span>
        </div>
      ))}
    </div>
  );
}

const MAPBOX_TOKEN = import.meta.env["VITE_MAPBOX_TOKEN"] as string | undefined;

export default function WardMap({ reports }: { reports: WardReportSummary[] }) {
  const mapRef = useRef<MapRef>(null);
  const [popup, setPopup] = useState<WardReportSummary | null>(null);

  const pins = useMemo(() => reports.filter((r) => r.lat != null && r.lng != null), [reports]);

  const geojson = useMemo<GeoJSON.FeatureCollection>(
    () => ({
      type: "FeatureCollection",
      features: pins.map((r) => ({
        type: "Feature",
        properties: { ...r },
        geometry: { type: "Point", coordinates: [r.lng as number, r.lat as number] },
      })),
    }),
    [pins],
  );

  const onClick = useCallback((e: MapMouseEvent & { features?: GeoJSONFeature[] }) => {
    const feature = e.features?.[0];
    if (!feature) return;
    setPopup(feature.properties as unknown as WardReportSummary);
  }, []);

  if (!MAPBOX_TOKEN) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e0e0f",
        }}
      >
        <p style={{ fontSize: 12, color: "rgba(245,245,244,0.35)" }}>
          Map needs a Mapbox token (VITE_MAPBOX_TOKEN) — not yet configured on this deployment.
        </p>
      </div>
    );
  }

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={WARD_CENTER}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      interactiveLayerIds={["unclustered-point"]}
      onClick={onClick}
    >
      <NavigationControl position="top-right" />
      <MapLegend />

      <Source id={SOURCE_ID} type="geojson" data={geojson}>
        <Layer {...UNCLUSTERED_LAYER} />
      </Source>

      {popup && popup.lat != null && popup.lng != null && (
        <Popup longitude={popup.lng} latitude={popup.lat} onClose={() => setPopup(null)} closeOnClick={false} anchor="bottom" offset={16}>
          <div style={{ padding: "12px 14px", minWidth: 200, maxWidth: 240 }}>
            <p style={{ fontSize: 10, fontFamily: "monospace", color: "#C6FF3D", letterSpacing: "0.06em", marginBottom: 6 }}>
              {popup.referenceNumber ?? "no ref"}
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#f5f5f4", marginBottom: 4 }}>
              {popup.category.charAt(0).toUpperCase() + popup.category.slice(1)}
            </p>
            <p style={{ fontSize: 11, color: "rgba(245,245,244,0.6)", lineHeight: 1.45 }}>
              {popup.description && popup.description.length > 90 ? popup.description.slice(0, 90) + "…" : popup.description}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: STATUS_COLOR[popup.status] ?? FALLBACK_COLOR,
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: 10, color: "rgba(245,245,244,0.4)", textTransform: "capitalize" }}>
                {popup.status.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </Popup>
      )}
    </Map>
  );
}
