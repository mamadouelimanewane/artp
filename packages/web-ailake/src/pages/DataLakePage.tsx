const SOURCES = [
  { name: "QoS Mobile Terrain", type: "Mesures", volume: "48 392 enregistrements", freq: "Quotidien", status: "Actif", pipeline: "ETL", latency: "J+1" },
  { name: "Plaintes Citoyens", type: "Formulaires", volume: "21 847 tickets", freq: "Temps reel", status: "Actif", pipeline: "Stream", latency: "< 5min" },
  { name: "Declarations Operateurs", type: "Rapports", volume: "1 247 documents", freq: "Trimestriel", status: "Actif", pipeline: "Batch", latency: "J+7" },
  { name: "Licences Spectre", type: "Registre", volume: "247 licences", freq: "A chaque modification", status: "Actif", pipeline: "CDC", latency: "Temps reel" },
  { name: "Mesures Terrain Agents", type: "IoT/Terrain", volume: "12 341 mesures", freq: "Hebdomadaire", status: "Integration", pipeline: "API Push", latency: "J+2" },
  { name: "Tarifs Publies", type: "Scraping", volume: "892 grilles tarifaires", freq: "Quotidien", status: "Test", pipeline: "Scraper", latency: "J+1" },
];

const STATUS_STYLE: Record<string, string> = {
  "Actif": "bg-emerald-100 text-emerald-700",
  "Integration": "bg-blue-100 text-blue-700",
  "Test": "bg-amber-100 text-amber-700",
  "Inactif": "bg-slate-100 text-slate-500",
};

export default function DataLakePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Lac de donnees regulatoire</h1>
        <p className="text-slate-500 text-sm">Sources integrees, volumes et statuts des pipelines</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { v: "6", l: "Sources integrees" },
          { v: "84K+", l: "Enregistrements" },
          { v: "3 pipelines", l: "Actifs" },
          { v: "28 TB/an", l: "Volume projete" },
        ].map(s => (
          <div key={s.l} className="card p-4 text-center">
            <p className="text-2xl font-bold text-ai-700">{s.v}</p>
            <p className="text-xs text-slate-500 mt-1">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Architecture */}
      <div className="card p-5 bg-ai-900 text-white">
        <h2 className="font-semibold mb-4 text-ai-200">Architecture du lac de donnees</h2>
        <div className="grid grid-cols-4 gap-3 text-center text-xs">
          {[
            { icon: "📡", label: "Sources", items: ["QoS", "Plaintes", "Spectre", "Operateurs"] },
            { icon: "⚙️", label: "Ingestion", items: ["ETL Batch", "Stream Kafka", "API Push", "CDC"] },
            { icon: "🗄️", label: "Stockage", items: ["Raw Zone", "Cleaned Zone", "Gold Zone", "Archive"] },
            { icon: "🧠", label: "Consommation", items: ["IA/ML", "Dashboards", "Open Data", "Scoring"] },
          ].map(layer => (
            <div key={layer.label} className="bg-white/10 rounded-xl p-3">
              <span className="text-2xl block mb-1">{layer.icon}</span>
              <p className="font-bold text-ai-200 mb-2">{layer.label}</p>
              {layer.items.map(i => (
                <p key={i} className="text-ai-300 text-[10px] py-0.5">{i}</p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Sources table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Sources de donnees</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs text-slate-500 font-medium">
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Volume actuel</th>
              <th className="px-4 py-3">Frequence</th>
              <th className="px-4 py-3">Pipeline</th>
              <th className="px-4 py-3">Latence</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {SOURCES.map(s => (
              <tr key={s.name} className="border-t border-slate-50 hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-800">{s.name}</td>
                <td className="px-4 py-3 text-slate-500">{s.type}</td>
                <td className="px-4 py-3 font-mono text-xs text-ai-700">{s.volume}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{s.freq}</td>
                <td className="px-4 py-3">
                  <span className="badge bg-ai-100 text-ai-700 font-mono text-[10px]">{s.pipeline}</span>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">{s.latency}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${STATUS_STYLE[s.status]}`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
