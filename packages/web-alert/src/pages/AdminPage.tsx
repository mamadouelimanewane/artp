import { useState } from "react";

const TICKETS = [
  { id: "ART-20260618-001", cat: "Debit insuffisant", op: "Orange SN", region: "Dakar", date: "2026-06-18 08:14", priority: "Haute", status: "Nouveau" },
  { id: "ART-20260618-002", cat: "Facturation abusive", op: "Free SN", region: "Thies", date: "2026-06-18 07:52", priority: "Moyenne", status: "Nouveau" },
  { id: "ART-20260617-089", cat: "Absence couverture", op: "Expresso SN", region: "Tambacounda", date: "2026-06-17 16:30", priority: "Haute", status: "En cours" },
  { id: "ART-20260617-088", cat: "Service indisponible", op: "Orange SN", region: "Kaolack", date: "2026-06-17 15:10", priority: "Urgente", status: "En cours" },
  { id: "ART-20260617-082", cat: "Spam/Appels abusifs", op: "Free SN", region: "Dakar", date: "2026-06-17 10:22", priority: "Faible", status: "En attente" },
  { id: "ART-20260616-071", cat: "Debit insuffisant", op: "Orange SN", region: "Saint-Louis", date: "2026-06-16 14:05", priority: "Moyenne", status: "Resolu" },
];

const PRIORITY_STYLE: Record<string, string> = {
  "Urgente": "bg-red-100 text-red-700",
  "Haute": "bg-orange-100 text-orange-700",
  "Moyenne": "bg-amber-100 text-amber-700",
  "Faible": "bg-slate-100 text-slate-600",
};

const STATUS_STYLE: Record<string, string> = {
  "Nouveau": "bg-blue-100 text-blue-700",
  "En cours": "bg-purple-100 text-purple-700",
  "En attente": "bg-amber-100 text-amber-700",
  "Resolu": "bg-emerald-100 text-emerald-700",
};

export default function AdminPage() {
  const [filter, setFilter] = useState("Tous");

  const filtered = filter === "Tous" ? TICKETS : TICKETS.filter(t => t.status === filter);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Administration</h1>
          <p className="text-slate-500 text-sm">Tableau de bord interne — Agents ARTP</p>
        </div>
        <span className="badge bg-alert-100 text-alert-700 text-sm font-semibold">Acces restreint</span>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { l: "Tous", v: TICKETS.length, c: "text-slate-700" },
          { l: "Nouveau", v: TICKETS.filter(t => t.status === "Nouveau").length, c: "text-blue-600" },
          { l: "En cours", v: TICKETS.filter(t => t.status === "En cours").length, c: "text-purple-600" },
          { l: "En attente", v: TICKETS.filter(t => t.status === "En attente").length, c: "text-amber-600" },
          { l: "Resolu", v: TICKETS.filter(t => t.status === "Resolu").length, c: "text-emerald-600" },
        ].map(s => (
          <button key={s.l} onClick={() => setFilter(s.l)}
            className={`card p-3 text-center transition-all ${filter === s.l ? "ring-2 ring-alert-400" : ""}`}>
            <p className={`text-xl font-bold ${s.c}`}>{s.v}</p>
            <p className="text-xs text-slate-500">{s.l}</p>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-left text-xs text-slate-500 font-medium">
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Categorie</th>
              <th className="px-4 py-3">Operateur</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Priorite</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-alert-700 font-semibold">{t.id}</td>
                <td className="px-4 py-3 text-slate-700">{t.cat}</td>
                <td className="px-4 py-3 text-slate-600">{t.op}</td>
                <td className="px-4 py-3 text-slate-600">{t.region}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{t.date}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${PRIORITY_STYLE[t.priority]}`}>{t.priority}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${STATUS_STYLE[t.status]}`}>{t.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">Voir</button>
                    <button className="px-2 py-1 text-xs bg-alert-100 text-alert-700 rounded-lg hover:bg-alert-200">Traiter</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
