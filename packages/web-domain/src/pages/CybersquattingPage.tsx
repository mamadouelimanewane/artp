import { useState } from "react";

const CASES = [
  { id: "CS-2026-018", domain: "orange-sn-promo.com", target: "orange.sn", type: "Typosquatting", complainant: "Orange SN", filed: "2026-06-10", status: "En cours", risk: "high" },
  { id: "CS-2026-017", domain: "artp-senegal.net", target: "artp.sn", type: "Usurpation", complainant: "ARTP", filed: "2026-06-08", status: "En cours", risk: "high" },
  { id: "CS-2026-016", domain: "free-senegall.sn", target: "free.sn", type: "Typosquatting", complainant: "Free SN", filed: "2026-06-01", status: "Résolu", risk: "medium" },
  { id: "CS-2026-015", domain: "senelec-paiement.com", target: "senelec.sn", type: "Phishing", complainant: "SENELEC", filed: "2026-05-25", status: "Résolu", risk: "high" },
];

const RISK_COLORS: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-slate-100 text-slate-600 border-slate-200",
};

const STATUS_COLORS: Record<string, string> = {
  "En cours": "bg-amber-100 text-amber-700",
  "Résolu": "bg-emerald-100 text-emerald-700",
  "Rejeté": "bg-slate-100 text-slate-500",
};

export default function CybersquattingPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Anti-Cybersquatting</h1>
        <p className="text-slate-500 text-sm">Procédure UDRP Sénégal · Typosquatting · Usurpation de marques</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 border-l-4 border-red-500">
          <p className="text-xs text-slate-500">Signalements actifs</p>
          <p className="text-2xl font-bold text-red-600">{CASES.filter(c=>c.status==="En cours").length}</p>
        </div>
        <div className="card p-4 border-l-4 border-emerald-400">
          <p className="text-xs text-slate-500">Résolus 2026</p>
          <p className="text-2xl font-bold text-emerald-600">{CASES.filter(c=>c.status==="Résolu").length}</p>
        </div>
        <div className="card p-4 border-l-4 border-dom-400">
          <p className="text-xs text-slate-500">Total traités</p>
          <p className="text-2xl font-bold text-dom-600">{CASES.length}</p>
        </div>
      </div>

      <div className="space-y-2">
        {CASES.map(c => (
          <div
            key={c.id}
            className={`card border overflow-hidden cursor-pointer hover:shadow-md transition-all ${RISK_COLORS[c.risk]}`}
            onClick={() => setExpanded(expanded===c.id?null:c.id)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold">{c.id}</span>
                    <span className="badge bg-white/70 border border-current text-[10px]">{c.type}</span>
                    <span className={`badge ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                  </div>
                  <p className="font-mono text-sm font-bold">{c.domain}</p>
                  <p className="text-xs opacity-70">Cible : {c.target} · Plaignant : {c.complainant} · {c.filed}</p>
                </div>
                <span className="text-slate-400">{expanded===c.id?"▲":"▼"}</span>
              </div>
            </div>
            {expanded === c.id && (
              <div className="px-4 pb-4 border-t border-white/40 pt-3">
                <div className="flex gap-2">
                  {c.status === "En cours" && <>
                    <button className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors">Suspendre domaine</button>
                    <button className="px-3 py-1.5 bg-dom-600 text-white text-xs rounded-lg hover:bg-dom-700 transition-colors">Notifier ICANN</button>
                  </>}
                  <button className="px-3 py-1.5 bg-white border border-current text-xs rounded-lg hover:opacity-80 transition-opacity">Rapport décision</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
