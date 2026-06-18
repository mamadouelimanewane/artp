import { useState, useEffect } from "react";
import { useMissionsStore } from "../store/missions";
import BottomNav from "../components/BottomNav";
import { MapPinIcon, BoltIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// Senegal regions with coords for demo markers
const REGIONS = [
  { name: "Dakar",       lat: 14.693, lng: -17.447 },
  { name: "Thiès",       lat: 14.791, lng: -16.926 },
  { name: "Saint-Louis", lat: 16.019, lng: -16.497 },
  { name: "Kaolack",     lat: 14.138, lng: -16.072 },
  { name: "Ziguinchor",  lat: 12.550, lng: -16.270 },
  { name: "Tambacounda", lat: 13.771, lng: -13.668 },
  { name: "Diourbel",    lat: 14.655, lng: -16.229 },
  { name: "Fatick",      lat: 14.339, lng: -16.411 },
  { name: "Kolda",       lat: 12.893, lng: -14.951 },
  { name: "Matam",       lat: 15.658, lng: -13.255 },
  { name: "Sédhiou",     lat: 12.708, lng: -15.557 },
  { name: "Kédougou",    lat: 12.556, lng: -12.175 },
  { name: "Kaffrine",    lat: 14.105, lng: -15.551 },
  { name: "Louga",       lat: 15.619, lng: -16.224 },
];

export default function MapPage() {
  const { missions } = useMissionsStore();
  const [MapReady, setMapReady] = useState(false);
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [userPos, setUserPos] = useState<[number,number] | null>(null);

  const allMeasurements = missions.flatMap(m => m.measurements);
  const blindSpots = allMeasurements.filter(m => m.type === "blind_spot");

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
    ]).then(([rl, L]) => {
      // Fix default icon
      delete (L.default.Icon.Default.prototype as any)._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setMapComponents(rl);
      setMapReady(true);
    });

    navigator.geolocation?.getCurrentPosition(
      pos => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => setUserPos([14.693, -17.447]) // Dakar fallback
    );
  }, []);

  return (
    <div className="page-map">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-700 to-purple-700 px-5 pt-8 pb-4 flex-shrink-0">
        <h1 className="text-white text-xl font-black">Carte terrain</h1>
        <p className="text-violet-200 text-sm mt-0.5">
          {allMeasurements.length} mesures · {blindSpots.length} zones blanches
        </p>
      </div>

      {/* Map */}
      <div className="flex-1 relative overflow-hidden">
        {!MapReady ? (
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
              <p className="text-slate-500 text-sm">Chargement de la carte…</p>
            </div>
          </div>
        ) : (
          (() => {
            const { MapContainer, TileLayer, Marker, Popup, Circle, ZoomControl } = MapComponents;
            const center: [number,number] = userPos ?? [14.693, -17.447];
            return (
              <MapContainer center={center} zoom={7} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomControl position="bottomright"/>

                {/* User position */}
                {userPos && (
                  <Circle center={userPos} radius={200} color="#6366f1" fillColor="#818cf8" fillOpacity={0.3}>
                    <Popup>📍 Votre position</Popup>
                  </Circle>
                )}

                {/* Mission markers */}
                {missions.filter(m => m.coords).map(m => (
                  <Marker key={m.id} position={[m.coords!.lat, m.coords!.lng]}>
                    <Popup>
                      <b>{m.title}</b><br/>{m.region} · {m.zone}<br/>
                      Statut: {m.status}
                    </Popup>
                  </Marker>
                ))}

                {/* Blind spots */}
                {blindSpots.map(m => (
                  <Circle key={m.id} center={[m.coords.lat, m.coords.lng]} radius={500}
                    color="#ef4444" fillColor="#fca5a5" fillOpacity={0.4}>
                    <Popup>⚠️ Zone blanche signalée<br/>{m.operator} · {m.note}</Popup>
                  </Circle>
                ))}

                {/* Download measurements */}
                {allMeasurements.filter(m => m.type === "download").map(m => (
                  <Circle key={m.id} center={[m.coords.lat, m.coords.lng]} radius={300}
                    color={m.value >= 5 ? "#22c55e" : "#f97316"} fillOpacity={0.3}>
                    <Popup>⚡ Débit: {m.value} Mbps<br/>{m.operator} {m.technology}</Popup>
                  </Circle>
                ))}
              </MapContainer>
            );
          })()
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-2xl shadow-lg p-3 z-10">
          <p className="text-xs font-bold text-slate-600 mb-2">Légende</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-3 h-3 rounded-full bg-emerald-400 flex-shrink-0"/>
              Débit ≥ 5 Mbps
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-3 h-3 rounded-full bg-orange-400 flex-shrink-0"/>
              Débit &lt; 5 Mbps
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-3 h-3 rounded-full bg-red-400 flex-shrink-0"/>
              Zone blanche
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-3 h-3 rounded-full bg-indigo-400 flex-shrink-0"/>
              Votre position
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="bg-white border-t border-slate-100 px-4 py-3 flex-shrink-0 grid grid-cols-3 gap-2 text-center" style={{ paddingBottom: "calc(0.75rem + var(--nav-h))" }}>
        {[
          { icon: BoltIcon,                   label: "Mesures",  value: allMeasurements.length, color: "text-blue-600"  },
          { icon: ExclamationTriangleIcon,     label: "Zones bl.", value: blindSpots.length,     color: "text-red-600"   },
          { icon: MapPinIcon,                  label: "Missions", value: missions.filter(m => m.coords).length, color: "text-violet-600" },
        ].map(k => (
          <div key={k.label}>
            <p className={`text-lg font-black ${k.color}`}>{k.value}</p>
            <p className="text-xs text-slate-400">{k.label}</p>
          </div>
        ))}
      </div>

      <BottomNav/>
    </div>
  );
}
