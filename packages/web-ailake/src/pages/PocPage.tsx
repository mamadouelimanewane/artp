import { useState } from "react";

const POCS = [
  { id: 1, title: "Detection QoS anomalies", desc: "Modele LSTM pour detecter les anomalies de QoS en temps reel", status: "Valide", accuracy: 89, tech: ["Python","TensorFlow","Kafka"] },
  { id: 2, title: "Chatbot reglementaire", desc: "Chatbot NLP base sur LLM pour repondre aux questions sur la reglementation telecom", status: "Valide", accuracy: 92, tech: ["GPT-4","LangChain","FastAPI"] },
  { id: 3, title: "Scoring infraction automatique", desc: "Random Forest pour evaluer le niveau de risque d'infraction par operateur", status: "En test", accuracy: 78, tech: ["scikit-learn","Pandas","PostgreSQL"] },
  { id: 4, title: "Prediction plaintes", desc: "XGBoost pour anticiper les pics de plaintes J+7 par region et operateur", status: "En test", accuracy: 74, tech: ["XGBoost","Airflow","Metabase"] },
  { id: 5, title: "Classification auto signalements", desc: "Modele NLP pour categoriser automatiquement les signalements citoyens", status: "Valide", accuracy: 94, tech: ["spaCy","BERT","Redis"] },
  { id: 6, title: "OCR documents operateurs", desc: "Pipeline OCR + NLP pour extraire automatiquement les KPIs des rapports PDF", status: "En cours", accuracy: 71, tech: ["Tesseract","PyMuPDF","Regex"] },
  { id: 7, title: "Cartographie couverture IA", desc: "Modele de prediction de la couverture reseau a partir de donnees terrain partielles", status: "En cours", accuracy: null, tech: ["GIS","RandomForest","GeoJSON"] },
  { id: 8, title: "Analyse sentiment plaintes", desc: "Analyse de sentiment sur les descriptions textuelles des plaintes pour priorisation", status: "Prototype", accuracy: 81, tech: ["BERT","HuggingFace","FastAPI"] },
];

const STATUS_STYLE: Record<string, string> = {
  "Valide": "bg-emerald-100 text-emerald-700",
  "En test": "bg-amber-100 text-amber-700",
  "En cours": "bg-blue-100 text-blue-700",
  "Prototype": "bg-purple-100 text-purple-700",
};

export default function PocPage() {
  const [filter, setFilter] = useState("Tous");

  const filtered = filter === "Tous" ? POCS : POCS.filter(p => p.status === filter);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Preuves de concept (PoC)</h1>
        <p className="text-slate-500 text-sm">12 use cases IA en cours d'experimentation au sein du laboratoire ARTP</p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {["Tous","Valide","En test","En cours","Prototype"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors
              ${filter === s ? "bg-ai-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(poc => (
          <div key={poc.id} className="card p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-ai-400">#{poc.id.toString().padStart(2,"0")}</span>
                <h3 className="font-bold text-slate-800">{poc.title}</h3>
              </div>
              <span className={`badge ${STATUS_STYLE[poc.status]} shrink-0`}>{poc.status}</span>
            </div>
            <p className="text-sm text-slate-500 mb-4 leading-snug">{poc.desc}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5 flex-wrap">
                {poc.tech.map(t => (
                  <code key={t} className="px-1.5 py-0.5 bg-ai-50 border border-ai-100 rounded text-[10px] text-ai-700 font-mono">{t}</code>
                ))}
              </div>
              {poc.accuracy !== null && (
                <div className="text-right shrink-0 ml-3">
                  <p className="text-xs text-slate-400">Accuracy</p>
                  <p className={`font-bold text-sm ${poc.accuracy >= 85 ? "text-emerald-600" : poc.accuracy >= 75 ? "text-amber-600" : "text-red-600"}`}>
                    {poc.accuracy}%
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
