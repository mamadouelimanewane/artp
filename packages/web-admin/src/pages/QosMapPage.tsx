import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { api } from "../services/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  SignalIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  WifiIcon,
} from "@heroicons/react/24/outline";
import "leaflet/dist/leaflet.css";

interface MapPoint {
  id?: string;
  latitude: number;
  longitude: number;
  operator: string;
  networkType: string;
  downloadSpeed: number;
  uploadSpeed?: number;
  latency?: number;
  signalStrength: number;
  createdAt?: string;
}

interface BlindSpot {
  id?: string;
  latitude: number;
  longitude: number;
  region?: string;
  description?: string;
}

const OPERATORS = ["orange", "free", "expresso"];

const REGIONS = [
  "dakar",
  "thies",
  "saint_louis",
  "ziguinchor",
  "tambacounda",
  "kaolack",
  "louga",
  "fatick",
  "kolda",
  "matam",
];

const REGION_CENTERS: Record<string, { coords: [number, number]; label: string }> = {
  dakar:        { coords: [14.6937, -17.4441], label: "Dakar" },
  thies:        { coords: [14.7833, -16.9167], label: "Thiès" },
  saint_louis:  { coords: [16.0200, -16.4897], label: "Saint-Louis" },
  ziguinchor:   { coords: [12.5667, -16.2833], label: "Ziguinchor" },
  tambacounda:  { coords: [13.7667, -13.6667], label: "Tambacounda" },
  kaolack:      { coords: [14.1500, -16.0667], label: "Kaolack" },
  louga:        { coords: [15.6167, -16.2333], label: "Louga" },
  fatick:       { coords: [14.3333, -16.4167], label: "Fatick" },
  kolda:        { coords: [12.8833, -14.9500], label: "Kolda" },
  matam:        { coords: [15.6553, -13.2553], label: "Matam" },
  kaffrine:     { coords: [14.1000, -15.5500], label: "Kaffrine" },
  kedougou:     { coords: [12.5500, -12.1833], label: "Kédougou" },
  sedhiou:      { coords: [12.7000, -15.5500], label: "Sédhiou" },
};

function qualityColor(download: number): string {
  if (download >= 10) return "#10b981"; // vert
  if (download >= 5) return "#f59e0b";  // orange
  if (download >= 1) return "#ef4444";  // rouge
  return "#1f2937";                      // noir (zone blanche)
}

function qualityLabel(download: number): string {
  if (download >= 10) return "Bonne qualite";
  if (download >= 5) return "Qualite moyenne";
  if (download >= 1) return "Mauvaise qualite";
  return "Zone blanche";
}

const OP_COLORS: Record<string, string> = {
  orange: "#f97316",
  free: "#6366f1",
  expresso: "#10b981",
};

export default function QosMapPage() {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [blindSpots, setBlindSpots] = useState<BlindSpot[]>([]);
  const [operator, setOperator] = useState("");
  const [region, setRegion] = useState("");
  const [colorMode, setColorMode] = useState<"quality" | "operator">("quality");
  const [showBlindSpots, setShowBlindSpots] = useState(true);
  const [viewMode, setViewMode] = useState<"points" | "regions">("points");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (operator) params.set("operator", operator);
    if (region) params.set("region", region);

    Promise.all([
      api.get(`/qos/map?${params}`),
      api.get(`/qos/blind-spots${region ? `?region=${region}` : ""}`),
    ])
      .then(([mapRes, bsRes]) => {
        setPoints(mapRes.data.data ?? []);
        setBlindSpots(bsRes.data.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [operator, region]);

  // Calcul score QoS moyen par region
  const regionScores: Record<string, { avg: number; count: number }> = {};
  points.forEach((p) => {
    const r = (p as MapPoint & { region?: string }).region;
    if (r) {
      if (!regionScores[r]) regionScores[r] = { avg: 0, count: 0 };
      regionScores[r].avg += p.downloadSpeed;
      regionScores[r].count += 1;
    }
  });
  Object.keys(regionScores).forEach((r) => {
    regionScores[r].avg = regionScores[r].avg / regionScores[r].count;
  });

  // Stats resumees
  const avgDownload =
    points.length > 0
      ? (points.reduce((s, p) => s + p.downloadSpeed, 0) / points.length).toFixed(1)
      : "—";
  const avgLatency =
    points.filter((p) => p.latency).length > 0
      ? (
          points.filter((p) => p.latency).reduce((s, p) => s + (p.latency ?? 0), 0) /
          points.filter((p) => p.latency).length
        ).toFixed(0)
      : "—";
  const goodCount = points.filter((p) => p.downloadSpeed >= 10).length;
  const mediumCount = points.filter(
    (p) => p.downloadSpeed >= 5 && p.downloadSpeed < 10
  ).length;
  const badCount = points.filter((p) => p.downloadSpeed < 5).length;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Carte de couverture QoS</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {points.length.toLocaleString("fr-FR")} mesures affichees —{" "}
          {blindSpots.length} zone{blindSpots.length > 1 ? "s" : ""} blanche
          {blindSpots.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Filtres */}
      <div className="card py-3 flex flex-wrap gap-3 items-center">
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
        >
          <option value="">Tous les operateurs</option>
          {OPERATORS.map((op) => (
            <option key={op} value={op}>
              {op.charAt(0).toUpperCase() + op.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
        >
          <option value="">Toutes les regions</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r.charAt(0).toUpperCase() + r.slice(1).replace(/_/g, " ")}
            </option>
          ))}
        </select>

        <select
          value={colorMode}
          onChange={(e) => setColorMode(e.target.value as "quality" | "operator")}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
        >
          <option value="quality">Couleur par qualite</option>
          <option value="operator">Couleur par operateur</option>
        </select>

        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showBlindSpots}
            onChange={(e) => setShowBlindSpots(e.target.checked)}
            className="rounded border-gray-300 text-artp-600 focus:ring-artp-500"
          />
          Zones blanches ({blindSpots.length})
        </label>

        <div className="flex items-center gap-1 ml-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("points")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === "points"
                ? "bg-white text-artp-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Vue points
          </button>
          <button
            onClick={() => setViewMode("regions")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === "regions"
                ? "bg-white text-artp-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Vue régions
          </button>
        </div>

        {/* Legende */}
        <div className="ml-auto flex items-center gap-4 flex-wrap">
          {colorMode === "quality" ? (
            <>
              {[
                { color: "#10b981", label: "Bonne (≥10 Mbps)" },
                { color: "#f59e0b", label: "Moyenne (5-10)" },
                { color: "#ef4444", label: "Mauvaise (<5)" },
                { color: "#1f2937", label: "Zone blanche" },
              ].map(({ color, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span
                    className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: color }}
                  />
                  {label}
                </span>
              ))}
            </>
          ) : (
            <>
              {Object.entries(OP_COLORS).map(([op, color]) => (
                <span key={op} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span
                    className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: color }}
                  />
                  {op.charAt(0).toUpperCase() + op.slice(1)}
                </span>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Carte */}
        <div
          className="xl:col-span-3 card p-0 overflow-hidden rounded-xl"
          style={{ height: 560 }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-artp-600" />
            </div>
          ) : (
            <MapContainer
              center={[14.7167, -17.4677]}
              zoom={11}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {viewMode === "points" && points.map((p, i) => {
                const color =
                  colorMode === "quality"
                    ? qualityColor(p.downloadSpeed)
                    : OP_COLORS[p.operator] ?? "#6b7280";
                return (
                  <CircleMarker
                    key={i}
                    center={[p.latitude, p.longitude]}
                    radius={6}
                    pathOptions={{
                      color,
                      fillColor: color,
                      fillOpacity: 0.75,
                      weight: 1,
                    }}
                  >
                    <Popup>
                      <div className="text-xs space-y-1 min-w-32">
                        <p className="font-semibold capitalize text-sm">
                          {p.operator} — {p.networkType}
                        </p>
                        <p
                          className="text-xs font-medium"
                          style={{ color: qualityColor(p.downloadSpeed) }}
                        >
                          {qualityLabel(p.downloadSpeed)}
                        </p>
                        <hr className="my-1" />
                        <p>
                          Download:{" "}
                          <strong>{p.downloadSpeed.toFixed(1)} Mbps</strong>
                        </p>
                        {p.uploadSpeed !== undefined && (
                          <p>
                            Upload:{" "}
                            <strong>{p.uploadSpeed.toFixed(1)} Mbps</strong>
                          </p>
                        )}
                        {p.latency !== undefined && (
                          <p>
                            Latence: <strong>{p.latency} ms</strong>
                          </p>
                        )}
                        <p>Signal: {p.signalStrength} dBm</p>
                        {p.createdAt && (
                          <p className="text-gray-400">
                            {format(new Date(p.createdAt), "d MMM yyyy HH:mm", {
                              locale: fr,
                            })}
                          </p>
                        )}
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}

              {viewMode === "regions" && Object.entries(REGION_CENTERS).map(([key, { coords, label }]) => {
                const score = regionScores[key];
                const avgDl = score ? score.avg : 0;
                const color = score ? qualityColor(avgDl) : "#9ca3af";
                const radius = score ? Math.min(50, Math.max(30, 30 + score.count / 5)) : 30;
                return (
                  <CircleMarker
                    key={key}
                    center={coords}
                    radius={radius}
                    pathOptions={{
                      color,
                      fillColor: color,
                      fillOpacity: 0.35,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="text-xs space-y-1 min-w-28">
                        <p className="font-bold text-sm text-gray-900">{label}</p>
                        {score ? (
                          <>
                            <p style={{ color: qualityColor(avgDl) }} className="font-medium">
                              {qualityLabel(avgDl)}
                            </p>
                            <p>Débit moy.: <strong>{avgDl.toFixed(1)} Mbps</strong></p>
                            <p className="text-gray-400">{score.count} mesures</p>
                          </>
                        ) : (
                          <p className="text-gray-400">Aucune mesure</p>
                        )}
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
              {showBlindSpots &&
                blindSpots.map((b, i) => (
                  <CircleMarker
                    key={`bs-${i}`}
                    center={[b.latitude, b.longitude]}
                    radius={9}
                    pathOptions={{
                      color: "#1f2937",
                      fillColor: "#1f2937",
                      fillOpacity: 0.6,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="text-xs space-y-1">
                        <p className="font-semibold text-gray-900">Zone blanche</p>
                        {b.region && (
                          <p className="text-gray-500 capitalize">
                            Region: {b.region}
                          </p>
                        )}
                        {b.description && (
                          <p className="text-gray-600">{b.description}</p>
                        )}
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
            </MapContainer>
          )}
        </div>

        {/* Panel lateral stats */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <SignalIcon className="h-4 w-4 text-artp-500" />
              Resume des mesures
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total mesures</span>
                <span className="font-bold text-gray-900">
                  {points.length.toLocaleString("fr-FR")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Debit moyen</span>
                <span className="font-bold text-gray-900">{avgDownload} Mbps</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Latence moy.</span>
                <span className="font-bold text-gray-900">{avgLatency} ms</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <WifiIcon className="h-4 w-4 text-artp-500" />
              Qualite du reseau
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-green-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                  Bonne
                </span>
                <span className="font-semibold text-sm">{goodCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-yellow-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
                  Moyenne
                </span>
                <span className="font-semibold text-sm">{mediumCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-red-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                  Mauvaise
                </span>
                <span className="font-semibold text-sm">{badCount}</span>
              </div>
              {points.length > 0 && (
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    className="bg-green-500 h-full transition-all"
                    style={{ width: `${(goodCount / points.length) * 100}%` }}
                  />
                  <div
                    className="bg-yellow-400 h-full transition-all"
                    style={{ width: `${(mediumCount / points.length) * 100}%` }}
                  />
                  <div
                    className="bg-red-500 h-full transition-all"
                    style={{ width: `${(badCount / points.length) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ExclamationTriangleIcon className="h-4 w-4 text-red-400" />
              Zones blanches
            </h3>
            {blindSpots.length === 0 ? (
              <p className="text-sm text-gray-400">Aucune zone blanche</p>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total signalees</span>
                  <span className="font-bold text-red-600">{blindSpots.length}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Ces zones sont sans couverture reseau mobile confirmee
                </p>
              </div>
            )}
          </div>

          {/* Repartition par operateur */}
          {OPERATORS.map((op) => {
            const count = points.filter((p) => p.operator === op).length;
            const pct = points.length > 0 ? Math.round((count / points.length) * 100) : 0;
            return (
              <div key={op} className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: OP_COLORS[op] }}
                />
                <span className="text-sm text-gray-600 capitalize flex-1">{op}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
                <span className="text-xs text-gray-400 w-10 text-right">{pct}%</span>
              </div>
            );
          })}
          <div className="flex items-center gap-3">
            <MapPinIcon className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              Centree sur Dakar (14.72°N, 17.47°O)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
