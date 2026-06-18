import { useState } from "react";

const INFRACTIONS = [
  { id: "INF-2026-041", operator: "Free SN", type: "QoS non conforme", zone: "Kaolack", date: "2026-06-10", risk: "high", status: "En cours" },
  { id: "INF-2026-040", operator: "Orange SN", type: "Tarif SVA non déclaré", zone: "Dakar", date: "2026-06-08", risk: "high", status: "Ouvert" },
  { id: "INF-2026-039", operator: "Expresso", type: "Couverture insuffisante", zone: "Tambacounda", date: "2026-06-05", risk: "medium", status: "En cours" },
  { id: "INF-2026-038", operator: "Orange SN", type: "Taux résiliation élevé", zone: "National", date: "2026-06-01", risk: "medium", status: "Résolu" },
  { id: "INF-2026-037", operator: "Free SN", type: "Non-déclaration incident", zone: "Thiès", date: "2026-05-28", risk: "low", status: "Résolu" },
];

const RISK_COLORS: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-slate-100 text-slate-600 border-slate-200",
};

const STATUS_COLORS: Record<string, string> = {
  "Ouvert": "bg-red-100 text-red-700",
  "En cours": "bg-amber-100 text-amber-700",
  "Résolu": "bg-emerald-100 text-emerald-700",
};

export default function InfractionsPage() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? INFRACTIONS : INFRACTIONS.filter(i => i.risk === filter);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Observatoire Prédictif des Infractions</h1>
          <p className="text-slate-500 text-sm">Détection IA · Scoring de risque · Suivi des procédures</p>
        </div>
        <div className="flex gap-2">
          {["all","high","medium","low"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                ${filter===f ? "bg-pnir-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-pnir-300"}`}
            >
              {f === "all" ? "Tous" : f === "high" ? "Critique" : f === "medium" ? "Moyen" : "Faible"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 border-l-4 border-red-500">
          <p className="text-xs text-slate-500">Critiques</p>
          <p className="text-2xl font-bold text-red-600">{INFRACTIONS.filter(i=>i.risk==="high").length}</p>
        </div>
        <div className="card p-4 border-l-4 border-amber-400">
          <p className="text-xs text-slate-500">Moyens</p>
          <p className="text-2xl font-bold text-amber-600">{INFRACTIONS.filter(i=>i.risk==="medium").length}</p>
        </div>
        <div className="card p-4 border-l-4 border-slate-300">
          <p className="text-xs text-slate-500">Faibles</p>
          <p className="text-2xl font-bold text-slate-600">{INFRACTIONS.filter(i=>i.risk==="low").length}</p>
        </div>
      </div>

      {/* Liste */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-left text-xs text-slate-500">
              <th className="px-4 py-3 font-medium">Référence</th>
              <th className="px-4 py-3 font-medium">Opérateur</th>
              <th className="px-4 py-3 font-medium">Type d'infraction</th>
              <th className="px-4 py-3 font-medium">Zone</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Risque</th>
              <th className="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inf => (
              <tr key={inf.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-pnir-600">{inf.id}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{inf.operator}</td>
                <td className="px-4 py-3 text-slate-600">{inf.type}</td>
                <td className="px-4 py-3 text-slate-500">{inf.zone}</td>
                <td className="px-4 py-3 text-slate-500">{inf.date}</td>
                <td className="px-4 py-3">
                  <span className={`badge border ${RISK_COLORS[inf.risk]}`}>
                    {inf.risk === "high" ? "Critique" : inf.risk === "medium" ? "Moyen" : "Faible"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${STATUS_COLORS[inf.status]}`}>{inf.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
