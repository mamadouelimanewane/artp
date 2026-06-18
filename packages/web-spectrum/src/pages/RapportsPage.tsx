const RAPPORTS = [
  { title: "Rapport annuel utilisation spectre 2025", type: "Annuel", date: "2026-01-15", size: "4.2 MB" },
  { title: "Audit fréquences bande 900 MHz — Q1 2026", type: "Trimestriel", date: "2026-04-01", size: "1.8 MB" },
  { title: "Note technique — Interférence Thiès Q1", type: "Incident", date: "2026-03-12", size: "0.6 MB" },
  { title: "Plan 5G Sénégal — Bande 3500 MHz", type: "Stratégique", date: "2026-02-20", size: "2.1 MB" },
];

const TYPE_COLORS: Record<string, string> = {
  "Annuel": "bg-spec-100 text-spec-700",
  "Trimestriel": "bg-blue-100 text-blue-700",
  "Incident": "bg-red-100 text-red-700",
  "Stratégique": "bg-purple-100 text-purple-700",
};

export default function RapportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Rapports & Alertes</h1>
        <p className="text-slate-500 text-sm">Documents techniques · Historique incidents · Notes de surveillance</p>
      </div>

      <div className="space-y-3">
        {RAPPORTS.map(r => (
          <div key={r.title} className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{r.title}</p>
                <p className="text-xs text-slate-500">{r.date} · {r.size}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`badge ${TYPE_COLORS[r.type]}`}>{r.type}</span>
              <button className="px-3 py-1.5 bg-spec-600 text-white text-xs rounded-lg hover:bg-spec-700 transition-colors">
                Télécharger
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-3">Générer un rapport</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Période</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-spec-400">
              <option>Juin 2026</option>
              <option>Q2 2026</option>
              <option>H1 2026</option>
              <option>Année 2025</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-spec-400">
              <option>Utilisation spectre</option>
              <option>Interférences</option>
              <option>Licences</option>
            </select>
          </div>
        </div>
        <button className="px-4 py-2 bg-spec-600 text-white text-sm font-semibold rounded-xl hover:bg-spec-700 transition-colors">
          Générer PDF
        </button>
      </div>
    </div>
  );
}
