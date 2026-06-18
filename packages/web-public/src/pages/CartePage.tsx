import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { REGIONS, THRESHOLDS } from "../data/stats";

type Mode = "qos" | "download" | "latency" | "coverage";

// SVG approx positions for 14 Senegal regions (x,y in 0-100 space on a 580x420 SVG)
const REGION_POSITIONS: Record<string, { cx: number; cy: number }> = {
  "Dakar":        { cx: 68,  cy: 310 },
  "Thiès":        { cx: 130, cy: 255 },
  "Diourbel":     { cx: 195, cy: 230 },
  "Fatick":       { cx: 175, cy: 290 },
  "Kaolack":      { cx: 240, cy: 285 },
  "Kaffrine":     { cx: 295, cy: 265 },
  "Tambacounda":  { cx: 390, cy: 250 },
  "Kédougou":     { cx: 420, cy: 330 },
  "Kolda":        { cx: 340, cy: 340 },
  "Sédhiou":      { cx: 265, cy: 355 },
  "Ziguinchor":   { cx: 185, cy: 390 },
  "Saint-Louis":  { cx: 120, cy: 80  },
  "Louga":        { cx: 175, cy: 155 },
  "Matam":        { cx: 340, cy: 140 },
};

function getColor(mode: Mode, region: typeof REGIONS[0]): string {
  if (mode === "qos") {
    return region.qos >= 7 ? "#22c55e" : region.qos >= 5 ? "#f97316" : "#ef4444";
  }
  if (mode === "download") {
    return region.download >= THRESHOLDS.download ? "#22c55e" : "#ef4444";
  }
  if (mode === "latency") {
    return region.latency <= THRESHOLDS.latency ? "#22c55e" : "#ef4444";
  }
  if (mode === "coverage") {
    return region.coverage >= 80 ? "#22c55e" : region.coverage >= 60 ? "#f97316" : "#ef4444";
  }
  return "#94a3b8";
}

function getValue(mode: Mode, region: typeof REGIONS[0]): string {
  if (mode === "qos")      return `${region.qos}/10`;
  if (mode === "download") return `${region.download}M`;
  if (mode === "latency")  return `${region.latency}ms`;
  if (mode === "coverage") return `${region.coverage}%`;
  return "";
}

const MODES: { key: Mode; label: string }[] = [
  { key: "qos",      label: "Score QoS"   },
  { key: "download", label: "Débit"        },
  { key: "latency",  label: "Latence"      },
  { key: "coverage", label: "Couverture 4G"},
];

export default function CartePage() {
  const [mode, setMode]     = useState<Mode>("qos");
  const [selected, setSelected] = useState<typeof REGIONS[0] | null>(null);

  const regionsWithPos = REGIONS.map(r => ({ ...r, ...REGION_POSITIONS[r.name] }));

  return (
    <div className="min-h-screen">
      <Navbar/>
      <div className="bg-gradient-to-br from-violet-800 to-purple-700 px-4 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Carte QoS du Sénégal</h1>
        <p className="text-violet-300 max-w-xl mx-auto">14 régions · Cliquez sur un cercle pour les détails</p>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Mode selector */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {MODES.map(m => (
            <button key={m.key} onClick={() => setMode(m.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${mode === m.key ? "bg-violet-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
              {m.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* SVG Map */}
          <div className="lg:col-span-2 card p-4 overflow-hidden">
            <svg viewBox="0 0 520 440" className="w-full" style={{ maxHeight: 480 }}>
              {/* Simplified Senegal outline (decorative) */}
              <rect width="520" height="440" fill="#f8faff" rx="12"/>

              {/* Background decorative shape representing approximate Senegal territory */}
              <path d="M60,60 L200,40 L320,50 L460,80 L490,160 L470,260 L430,340 L370,390 L280,410 L200,420 L130,400 L70,360 L40,280 L30,180 Z"
                fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" opacity="0.4"/>

              {/* Region circles */}
              {regionsWithPos.map(r => {
                const col = getColor(mode, r);
                const val = getValue(mode, r);
                const isSelected = selected?.name === r.name;
                return (
                  <g key={r.name} className="cursor-pointer" onClick={() => setSelected(isSelected ? null : r)}>
                    <circle cx={r.cx} cy={r.cy} r={isSelected ? 26 : 22}
                      fill={col} opacity={0.9} stroke={isSelected ? "#1e3a8a" : "white"} strokeWidth={isSelected ? 3 : 2}/>
                    <text x={r.cx} y={r.cy + 4} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">{val}</text>
                    <text x={r.cx} y={r.cy + 37} textAnchor="middle" fontSize="9" fill="#334155" fontWeight="600">
                      {r.name.length > 9 ? r.name.slice(0,8)+"…" : r.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"/> Conforme</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-400 inline-block"/> Moyen</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"/> Non conforme</span>
            </div>
          </div>

          {/* Detail panel */}
          <div className="space-y-4">
            {selected ? (
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-slate-800">{selected.name}</h3>
                  <button onClick={() => setSelected(null)} className="text-slate-300 hover:text-slate-500 text-xs">✕</button>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Score QoS",    value: `${selected.qos}/10`,       ok: selected.qos >= 7,                            color: selected.qos >= 7 ? "#22c55e" : selected.qos >= 5 ? "#f97316" : "#ef4444" },
                    { label: "Débit moyen",  value: `${selected.download} Mbps`, ok: selected.download >= THRESHOLDS.download,     color: "" },
                    { label: "Latence",      value: `${selected.latency} ms`,    ok: selected.latency  <= THRESHOLDS.latency,      color: "" },
                    { label: "Couverture 4G",value: `${selected.coverage}%`,     ok: selected.coverage >= 80,                      color: "" },
                    { label: "Plaintes",     value: selected.complaints.toLocaleString("fr"), ok: null, color: "" },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">{r.label}</span>
                      <span className={`font-bold text-sm ${r.ok === true ? "text-emerald-600" : r.ok === false ? "text-red-500" : "text-slate-700"}`}
                        style={r.color ? { color: r.color } : {}}>
                        {r.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card p-5 text-center text-slate-400">
                <p className="text-3xl mb-2">🗺️</p>
                <p className="text-sm font-semibold">Cliquez sur une région pour voir ses détails</p>
              </div>
            )}

            {/* Top/Bottom */}
            <div className="card p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Meilleure région</p>
              {(() => { const best = [...REGIONS].sort((a,b) => b.qos - a.qos)[0]; return (
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">{best.name}</span>
                  <span className="font-black text-emerald-600">{best.qos}/10</span>
                </div>
              ); })()}
            </div>
            <div className="card p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Région à améliorer</p>
              {(() => { const worst = [...REGIONS].sort((a,b) => a.qos - b.qos)[0]; return (
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">{worst.name}</span>
                  <span className="font-black text-red-500">{worst.qos}/10</span>
                </div>
              ); })()}
            </div>
            <div className="card p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Résumé national</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Conformes</span><span className="font-bold text-emerald-600">{REGIONS.filter(r => r.download >= THRESHOLDS.download && r.latency <= THRESHOLDS.latency).length}/{REGIONS.length}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Non conformes</span><span className="font-bold text-red-500">{REGIONS.filter(r => r.download < THRESHOLDS.download || r.latency > THRESHOLDS.latency).length}/{REGIONS.length}</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
