import { useState } from "react";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";

const OPERATEURS = ["Orange", "Free", "Expresso"];

const TARIFS = [
  { nom: "Forfait 1 Go / 24h", orange: 300, free: 250, expresso: 200, unite: "FCFA" },
  { nom: "Forfait 5 Go / 7 jours", orange: 1000, free: 800, expresso: 750, unite: "FCFA" },
  { nom: "Forfait 20 Go / 30 jours", orange: 3500, free: 2900, expresso: 2500, unite: "FCFA" },
  { nom: "Appels illimités / 30 jours", orange: 5000, free: 4500, expresso: 4000, unite: "FCFA" },
  { nom: "SMS illimités / 30 jours", orange: 1500, free: 1200, expresso: 1000, unite: "FCFA" },
  { nom: "Forfait voix 60 min / 30 jours", orange: 2000, free: 1800, expresso: 1500, unite: "FCFA" },
];

const COUVERTURE = [
  { region: "Dakar", orange: 99, free: 97, expresso: 94 },
  { region: "Thiès", orange: 95, free: 90, expresso: 85 },
  { region: "Saint-Louis", orange: 88, free: 82, expresso: 75 },
  { region: "Ziguinchor", orange: 85, free: 78, expresso: 70 },
  { region: "Tambacounda", orange: 75, free: 68, expresso: 58 },
  { region: "Kaolack", orange: 92, free: 86, expresso: 80 },
  { region: "Kolda", orange: 72, free: 65, expresso: 55 },
  { region: "Matam", orange: 70, free: 60, expresso: 50 },
  { region: "Kédougou", orange: 65, free: 55, expresso: 42 },
  { region: "Sédhiou", orange: 68, free: 58, expresso: 48 },
  { region: "Louga", orange: 84, free: 76, expresso: 68 },
  { region: "Fatick", orange: 88, free: 80, expresso: 72 },
  { region: "Kaffrine", orange: 80, free: 72, expresso: 62 },
  { region: "Diourbel", orange: 86, free: 79, expresso: 70 },
];

const COLORS: Record<string, string> = {
  Orange: "bg-orange-100 text-orange-700 border-orange-200",
  Free: "bg-red-100 text-red-700 border-red-200",
  Expresso: "bg-green-100 text-green-700 border-green-200",
};
const BAR_COLORS: Record<string, string> = {
  Orange: "bg-orange-500",
  Free: "bg-red-500",
  Expresso: "bg-green-500",
};

export default function ComparateurPage() {
  const [tab, setTab] = useState<"tarifs" | "couverture">("tarifs");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  function best(row: { orange: number; free: number; expresso: number }) {
    const min = Math.min(row.orange, row.free, row.expresso);
    return { orange: row.orange === min, free: row.free === min, expresso: row.expresso === min };
  }

  function bestCov(row: { orange: number; free: number; expresso: number }) {
    const max = Math.max(row.orange, row.free, row.expresso);
    return { orange: row.orange === max, free: row.free === max, expresso: row.expresso === max };
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <TopBar title="Comparateur certifié ARTP" back="/" />

      <div className="px-4 py-4 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2">
          <span className="text-blue-500 text-lg">✅</span>
          <p className="text-xs text-blue-700">Données certifiées ARTP — mises à jour mensuellement. Tarifs en FCFA TTC.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-xl p-1 border border-gray-200">
          <button onClick={() => setTab("tarifs")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "tarifs" ? "bg-blue-600 text-white" : "text-gray-500"}`}>
            Tarifs
          </button>
          <button onClick={() => setTab("couverture")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "couverture" ? "bg-blue-600 text-white" : "text-gray-500"}`}>
            Couverture
          </button>
        </div>

        {/* Opérateurs header */}
        <div className="grid grid-cols-4 gap-1 text-center">
          <div />
          {OPERATEURS.map(op => (
            <div key={op} className={`text-xs font-bold py-1.5 px-2 rounded-lg border ${COLORS[op]}`}>{op}</div>
          ))}
        </div>

        {tab === "tarifs" && (
          <div className="space-y-2">
            {TARIFS.map((row) => {
              const b = best(row);
              const vals: Record<string, number> = { Orange: row.orange, Free: row.free, Expresso: row.expresso };
              return (
                <div key={row.nom} className="bg-white rounded-xl border border-gray-100 p-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2">{row.nom}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {OPERATEURS.map(op => (
                      <div key={op} className={`text-center rounded-lg py-2 border ${b[op.toLowerCase() as keyof typeof b] ? "border-emerald-300 bg-emerald-50" : "border-gray-100 bg-gray-50"}`}>
                        <p className={`text-sm font-black ${b[op.toLowerCase() as keyof typeof b] ? "text-emerald-700" : "text-gray-700"}`}>
                          {vals[op].toLocaleString()}
                        </p>
                        <p className="text-[9px] text-gray-400">{row.unite}</p>
                        {b[op.toLowerCase() as keyof typeof b] && <p className="text-[9px] text-emerald-600 font-bold">Meilleur</p>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "couverture" && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 text-center">Couverture 4G par région (% de la population)</p>
            {COUVERTURE.map((row) => {
              const b = bestCov(row);
              const isSelected = selectedRegion === row.region;
              return (
                <div key={row.region}
                  className={`bg-white rounded-xl border p-3 cursor-pointer transition-all ${isSelected ? "border-blue-300 shadow-md" : "border-gray-100"}`}
                  onClick={() => setSelectedRegion(isSelected ? null : row.region)}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-700">📍 {row.region}</p>
                    <span className="text-[10px] text-gray-400">{Math.max(row.orange, row.free, row.expresso)}% max</span>
                  </div>
                  <div className="space-y-1.5">
                    {OPERATEURS.map(op => {
                      const val = row[op.toLowerCase() as "orange" | "free" | "expresso"];
                      return (
                        <div key={op} className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-500 w-14">{op}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div className={`h-2 rounded-full ${BAR_COLORS[op]}`} style={{ width: `${val}%` }} />
                          </div>
                          <span className={`text-[10px] font-bold w-8 text-right ${b[op.toLowerCase() as keyof typeof b] ? "text-emerald-600" : "text-gray-500"}`}>{val}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-[10px] text-gray-400 text-center">Source : ARTP Sénégal — Rapport QoS T1 2026</p>
      </div>
      <BottomNav />
    </div>
  );
}
