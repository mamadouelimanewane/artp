import { useState } from "react";

const SITES = [
  { id: "SDR-001", name: "Tour ARTP Dakar", region: "Dakar", lat: 14.693, lon: -17.447, status: "planned", bands: ["700","900","1800"], signal: null },
  { id: "SDR-002", name: "Relais Thiès", region: "Thiès", lat: 14.789, lon: -16.926, status: "planned", bands: ["900","2100"], signal: null },
  { id: "SDR-003", name: "Site Ziguinchor", region: "Ziguinchor", lat: 12.558, lon: -16.272, status: "planned", bands: ["900","1800"], signal: null },
  { id: "SDR-004", name: "Capteur Saint-Louis", region: "Saint-Louis", lat: 16.017, lon: -16.489, status: "planned", bands: ["700","900"], signal: null },
  { id: "SDR-005", name: "Tour Kaolack", region: "Kaolack", lat: 14.138, lon: -16.070, status: "planned", bands: ["900","1800","2100"], signal: null },
];

const STATUS_INFO: Record<string, { label: string; color: string; dot: string }> = {
  active:   { label: "Actif",     color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  planned:  { label: "Planifié",  color: "bg-amber-100 text-amber-700",    dot: "bg-amber-400" },
  offline:  { label: "Hors ligne",color: "bg-red-100 text-red-700",         dot: "bg-red-500" },
};

export default function CapteursPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Capteurs SDR</h1>
        <p className="text-slate-500 text-sm">Software Defined Radio · {SITES.length} sites planifiés</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 border-l-4 border-emerald-400">
          <p className="text-xs text-slate-500">Actifs</p>
          <p className="text-2xl font-bold text-emerald-600">{SITES.filter(s=>s.status==="active").length}</p>
        </div>
        <div className="card p-4 border-l-4 border-amber-400">
          <p className="text-xs text-slate-500">Planifiés</p>
          <p className="text-2xl font-bold text-amber-600">{SITES.filter(s=>s.status==="planned").length}</p>
        </div>
        <div className="card p-4 border-l-4 border-slate-300">
          <p className="text-xs text-slate-500">Hors ligne</p>
          <p className="text-2xl font-bold text-slate-500">{SITES.filter(s=>s.status==="offline").length}</p>
        </div>
      </div>

      <div className="space-y-2">
        {SITES.map(s => {
          const si = STATUS_INFO[s.status];
          return (
            <div
              key={s.id}
              className={`card p-4 cursor-pointer hover:shadow-md transition-all ${selected===s.id?"ring-2 ring-spec-400":""}`}
              onClick={() => setSelected(selected===s.id?null:s.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${si.dot}`} />
                  <div>
                    <p className="font-semibold text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.id} · {s.region} · {s.lat.toFixed(3)}N {Math.abs(s.lon).toFixed(3)}W</p>
                  </div>
                </div>
                <span className={`badge ${si.color}`}>{si.label}</span>
              </div>
              {selected === s.id && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Bandes surveillées</p>
                  <div className="flex gap-2">
                    {s.bands.map(b => (
                      <span key={b} className="badge bg-spec-50 text-spec-700 border border-spec-200">{b} MHz</span>
                    ))}
                  </div>
                  {s.status === "planned" && (
                    <p className="text-xs text-amber-600 mt-2">⏳ Déploiement prévu T3 2026</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
