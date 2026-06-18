const INTERFERENCES = [
  { id: "INT-2026-003", band: "900 MHz", region: "Dakar", severity: "high", source: "Équipement non homologué", detected: "2026-06-10", status: "Résolu" },
  { id: "INT-2026-002", band: "1800 MHz", region: "Thiès", severity: "medium", source: "Brouilleur GSM", detected: "2026-06-08", status: "Résolu" },
  { id: "INT-2026-001", band: "700 MHz", region: "Ziguinchor", severity: "low", source: "Émetteur FM hors bande", detected: "2026-05-30", status: "Résolu" },
];

const SEVERITY: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function InterferencesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Détection Interférences</h1>
        <p className="text-slate-500 text-sm">Historique · Analyse source · Procédures de résolution</p>
      </div>

      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
        <span className="text-2xl">✅</span>
        <div>
          <p className="font-semibold text-emerald-800 text-sm">Aucune interférence active</p>
          <p className="text-emerald-700 text-xs">Tous les incidents précédents ont été résolus. Surveillance continue en attente de capteurs.</p>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Historique des interférences détectées</h2>
        <div className="space-y-3">
          {INTERFERENCES.map(inf => (
            <div key={inf.id} className={`p-3 rounded-xl border ${SEVERITY[inf.severity]}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold">{inf.id}</span>
                    <span className="badge bg-white/70 border border-current text-[10px]">{inf.band}</span>
                  </div>
                  <p className="font-semibold text-sm">{inf.source}</p>
                  <p className="text-xs opacity-70">{inf.region} · {inf.detected}</p>
                </div>
                <span className="badge bg-emerald-100 text-emerald-700">{inf.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-3">Procédure de traitement</h2>
        <ol className="space-y-3">
          {[
            "Détection automatique par capteur SDR (signal anormal)",
            "Classification ML de la source d'interférence",
            "Notification immédiate à l'équipe Spectre ARTP",
            "Localisation géographique et identification du responsable",
            "Mise en demeure et délai de régularisation (48h)",
            "Intervention terrain si non-résolution",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
              <span className="w-6 h-6 rounded-full bg-spec-100 text-spec-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
