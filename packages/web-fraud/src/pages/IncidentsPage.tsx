import { useState } from "react";

const INCIDENTS = [
  {
    id: "CERT-2026-023",
    title: "Attaque IRSF — Interconnexion Orange SN",
    category: "IRSF",
    severity: "critical",
    operator: "Orange SN",
    opened: "2026-06-17",
    assigned: "Équipe CERT-1",
    status: "Ouvert",
    description: "Détection de trafic artificiel vers numéros surtaxés hors Sénégal. Perte estimée : 4.2M FCFA/heure.",
  },
  {
    id: "CERT-2026-022",
    title: "Déni de service vocal — Réseau Free",
    category: "DoS",
    severity: "high",
    operator: "Free SN",
    opened: "2026-06-16",
    assigned: "Équipe CERT-2",
    status: "En cours",
    description: "Saturation des trunks SIP entrants zone Dakar Plateau. Impact : 12 000 appels perdus.",
  },
  {
    id: "CERT-2026-021",
    title: "SIM swapping massif — 200 abonnés",
    category: "SIM Swap",
    severity: "high",
    operator: "Expresso",
    opened: "2026-06-14",
    assigned: "Équipe CERT-1",
    status: "Résolu",
    description: "200 cas de SIM swapping frauduleux détectés en 48h. Corrélation avec fuite données KYC.",
  },
];

const SEVERITY: Record<string, { label: string; color: string; bg: string }> = {
  critical: { label: "Critique", color: "text-red-700", bg: "bg-red-50 border-red-200" },
  high: { label: "Élevé", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  medium: { label: "Moyen", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
};

const STATUS_COLORS: Record<string, string> = {
  "Ouvert": "bg-red-100 text-red-700",
  "En cours": "bg-amber-100 text-amber-700",
  "Résolu": "bg-emerald-100 text-emerald-700",
};

export default function IncidentsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Centre d'Incidents CERT Télécom</h1>
        <p className="text-slate-500 text-sm">Gestion des incidents de sécurité · Coordination inter-opérateurs</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 border-l-4 border-red-500">
          <p className="text-xs text-slate-500">Critiques</p>
          <p className="text-2xl font-bold text-red-600">{INCIDENTS.filter(i=>i.severity==="critical").length}</p>
        </div>
        <div className="card p-4 border-l-4 border-orange-400">
          <p className="text-xs text-slate-500">Élevés</p>
          <p className="text-2xl font-bold text-orange-600">{INCIDENTS.filter(i=>i.severity==="high").length}</p>
        </div>
        <div className="card p-4 border-l-4 border-emerald-400">
          <p className="text-xs text-slate-500">Résolus ce mois</p>
          <p className="text-2xl font-bold text-emerald-600">{INCIDENTS.filter(i=>i.status==="Résolu").length}</p>
        </div>
      </div>

      <div className="space-y-3">
        {INCIDENTS.map(inc => {
          const sev = SEVERITY[inc.severity];
          return (
            <div key={inc.id} className={`card border overflow-hidden ${sev.bg}`}>
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpanded(expanded===inc.id?null:inc.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{inc.severity==="critical"?"🔴":inc.severity==="high"?"🟠":"🟡"}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-xs text-fraud-600">{inc.id}</span>
                        <span className={`badge bg-white border ${sev.bg} ${sev.color} text-[10px]`}>{inc.category}</span>
                        <span className={`badge ${STATUS_COLORS[inc.status]}`}>{inc.status}</span>
                      </div>
                      <h3 className="font-semibold text-slate-800">{inc.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{inc.operator} · Ouvert le {inc.opened} · Assigné : {inc.assigned}</p>
                    </div>
                  </div>
                  <span className="text-slate-400 text-sm">{expanded===inc.id?"▲":"▼"}</span>
                </div>
              </div>
              {expanded === inc.id && (
                <div className="px-4 pb-4 border-t border-white/50">
                  <p className="text-sm text-slate-700 mt-3 leading-relaxed">{inc.description}</p>
                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1.5 bg-fraud-600 text-white text-xs rounded-lg hover:bg-fraud-700 transition-colors">
                      Escalader
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs rounded-lg hover:bg-slate-50 transition-colors">
                      Générer rapport
                    </button>
                    {inc.status !== "Résolu" && (
                      <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors">
                        Marquer résolu
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
