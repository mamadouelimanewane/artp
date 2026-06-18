import { useState } from "react";

const SIM_DATA = [
  { id: "SIM-001", msisdn: "+221 77 123 4567", operator: "Orange SN", type: "Non enrôlée", region: "Dakar", detected: "2026-06-15", status: "Bloquée" },
  { id: "SIM-002", msisdn: "+221 76 234 5678", operator: "Free SN", type: "Clonée", region: "Thiès", detected: "2026-06-14", status: "En cours" },
  { id: "SIM-003", msisdn: "+221 70 345 6789", operator: "Expresso", type: "Non enrôlée", region: "Kaolack", detected: "2026-06-13", status: "En cours" },
  { id: "SIM-004", msisdn: "+221 78 456 7890", operator: "Orange SN", type: "Frauduleuse", region: "Saint-Louis", detected: "2026-06-12", status: "Bloquée" },
  { id: "SIM-005", msisdn: "+221 77 567 8901", operator: "Free SN", type: "Non enrôlée", region: "Ziguinchor", detected: "2026-06-11", status: "Bloquée" },
  { id: "SIM-006", msisdn: "+221 76 678 9012", operator: "Orange SN", type: "Clonée", region: "Tambacounda", detected: "2026-06-10", status: "Résolu" },
];

const STATUS_COLORS: Record<string, string> = {
  "Bloquée": "bg-red-100 text-red-700",
  "En cours": "bg-amber-100 text-amber-700",
  "Résolu": "bg-emerald-100 text-emerald-700",
};

const TYPE_COLORS: Record<string, string> = {
  "Non enrôlée": "bg-orange-100 text-orange-700",
  "Clonée": "bg-red-100 text-red-700",
  "Frauduleuse": "bg-purple-100 text-purple-700",
};

export default function SimPage() {
  const [search, setSearch] = useState("");
  const filtered = SIM_DATA.filter(s =>
    s.msisdn.includes(search) || s.operator.toLowerCase().includes(search.toLowerCase()) || s.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">SIM Frauduleuses & Non Enrôlées</h1>
        <p className="text-slate-500 text-sm">Base IMEI nationale · Détection automatique · {SIM_DATA.length} cas actifs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {["Non enrôlée","Clonée","Frauduleuse"].map(t => (
          <div key={t} className="card p-4">
            <p className="text-xs text-slate-500">{t}</p>
            <p className="text-2xl font-bold text-slate-900">{SIM_DATA.filter(s=>s.type===t).length}</p>
          </div>
        ))}
      </div>

      {/* Recherche */}
      <div className="card p-4">
        <input
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fraud-400"
          placeholder="Rechercher par numéro, opérateur ou région…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-left text-xs text-slate-500">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">MSISDN</th>
              <th className="px-4 py-3 font-medium">Opérateur</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Région</th>
              <th className="px-4 py-3 font-medium">Détecté</th>
              <th className="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-fraud-600">{s.id}</td>
                <td className="px-4 py-3 font-mono text-xs">{s.msisdn}</td>
                <td className="px-4 py-3 text-slate-700">{s.operator}</td>
                <td className="px-4 py-3"><span className={`badge ${TYPE_COLORS[s.type]}`}>{s.type}</span></td>
                <td className="px-4 py-3 text-slate-500">{s.region}</td>
                <td className="px-4 py-3 text-slate-500">{s.detected}</td>
                <td className="px-4 py-3"><span className={`badge ${STATUS_COLORS[s.status]}`}>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
