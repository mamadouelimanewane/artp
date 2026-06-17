import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { api } from "../services/api";
import "leaflet/dist/leaflet.css";

const opColor: Record<string, string> = { orange: "#f97316", free: "#6366f1", expresso: "#10b981" };

interface MapPoint {
  latitude: number;
  longitude: number;
  operator: string;
  networkType: string;
  downloadSpeed: number;
  signalStrength: number;
}

export default function QosMapPage() {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [blindSpots, setBlindSpots] = useState<{ latitude: number; longitude: number }[]>([]);
  const [operator, setOperator] = useState("");
  const [region, setRegion] = useState("");
  const [showBlindSpots, setShowBlindSpots] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (operator) params.set("operator", operator);
    if (region) params.set("region", region);

    Promise.all([
      api.get(`/qos/map?${params}`),
      api.get(`/qos/blind-spots${region ? `?region=${region}` : ""}`),
    ]).then(([mapRes, bsRes]) => {
      setPoints(mapRes.data.data);
      setBlindSpots(bsRes.data.data);
    }).finally(() => setLoading(false));
  }, [operator, region]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Carte de couverture QoS</h2>
        <p className="text-sm text-gray-500 mt-0.5">{points.length} mesures affichées</p>
      </div>

      {/* Filtres */}
      <div className="card py-3 flex flex-wrap gap-3 items-center">
        <select value={operator} onChange={(e) => setOperator(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500">
          <option value="">Tous les opérateurs</option>
          <option value="orange">Orange</option>
          <option value="free">Free</option>
          <option value="expresso">Expresso</option>
        </select>
        <select value={region} onChange={(e) => setRegion(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500">
          <option value="">Toutes les régions</option>
          {["dakar","thies","saint_louis","ziguinchor","tambacounda","kaolack","louga","fatick"].map((r) => (
            <option key={r} value={r}>{r.replace("_", " ")}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={showBlindSpots} onChange={(e) => setShowBlindSpots(e.target.checked)}
            className="rounded border-gray-300 text-artp-600 focus:ring-artp-500" />
          Zones blanches ({blindSpots.length})
        </label>

        {/* Légende */}
        <div className="ml-auto flex items-center gap-4 text-xs text-gray-500">
          {Object.entries(opColor).map(([op, color]) => (
            <span key={op} className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: color }} />
              {op}
            </span>
          ))}
          {showBlindSpots && (
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
              Zone blanche
            </span>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="card p-0 overflow-hidden rounded-xl" style={{ height: 560 }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-artp-600" />
          </div>
        ) : (
          <MapContainer
            center={[14.6937, -17.4441]} // Dakar
            zoom={11}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {points.map((p, i) => (
              <CircleMarker
                key={i}
                center={[p.latitude, p.longitude]}
                radius={6}
                pathOptions={{ color: opColor[p.operator] ?? "#6b7280", fillColor: opColor[p.operator] ?? "#6b7280", fillOpacity: 0.7 }}
              >
                <Popup>
                  <div className="text-xs space-y-1">
                    <p className="font-semibold capitalize">{p.operator} — {p.networkType}</p>
                    <p>Débit: <strong>{p.downloadSpeed} Mbps</strong></p>
                    <p>Signal: {p.signalStrength} dBm</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
            {showBlindSpots && blindSpots.map((b, i) => (
              <CircleMarker
                key={`bs-${i}`}
                center={[b.latitude, b.longitude]}
                radius={8}
                pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.5 }}
              >
                <Popup><p className="text-xs font-medium text-red-600">Zone blanche signalée</p></Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
