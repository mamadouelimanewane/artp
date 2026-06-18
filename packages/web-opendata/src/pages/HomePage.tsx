import { useNavigate } from "react-router-dom";

const DATASETS = [
  { id: "qos-mobile", title: "Qualite de service mobile", desc: "Mesures QoS terrain par operateur, region et technologie (2G/3G/4G)", rows: "48 392", updated: "2026-06-17", format: ["CSV","JSON","API"], category: "QoS" },
  { id: "coverage", title: "Couverture reseau nationale", desc: "Carte de couverture 2G/3G/4G/5G par operateur et localite", rows: "14 213", updated: "2026-06-01", format: ["GeoJSON","CSV","API"], category: "Couverture" },
  { id: "complaints", title: "Statistiques plaintes agregees", desc: "Volume de plaintes par type, operateur et region (donnees anonymisees)", rows: "3 841", updated: "2026-06-15", format: ["CSV","JSON"], category: "Plaintes" },
  { id: "spectrum", title: "Licences spectre radioelectrique", desc: "Attribution des frequences, titulaires et zones autorisees", rows: "247", updated: "2026-05-30", format: ["JSON","CSV","API"], category: "Spectre" },
  { id: "operators", title: "Indicateurs operateurs", desc: "Parts de marche, abonnes, revenus declares, KPIs trimestriels", rows: "156", updated: "2026-06-10", format: ["CSV","JSON"], category: "Marche" },
  { id: "tariffs", title: "Observatoire des tarifs", desc: "Grilles tarifaires declarees par les operateurs (voix, data, SMS)", rows: "892", updated: "2026-06-05", format: ["CSV","JSON"], category: "Tarifs" },
];

const CAT_COLORS: Record<string, string> = {
  QoS: "bg-blue-100 text-blue-700",
  Couverture: "bg-emerald-100 text-emerald-700",
  Plaintes: "bg-orange-100 text-orange-700",
  Spectre: "bg-purple-100 text-purple-700",
  Marche: "bg-cyan-100 text-cyan-700",
  Tarifs: "bg-rose-100 text-rose-700",
};

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="p-6 space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-od-800 to-od-600 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🌍</span>
          <div>
            <h1 className="text-3xl font-bold">data.artp.sn</h1>
            <p className="text-od-100 text-sm">Portail Open Data officiel de l'ARTP Senegal</p>
          </div>
        </div>
        <p className="text-od-100 max-w-2xl leading-relaxed mb-6">
          Acces libre aux donnees du secteur des telecommunications senegalais.
          Toutes les donnees sont publiees sous licence ouverte, disponibles en CSV, JSON et via API REST.
        </p>
        <div className="flex gap-3">
          <button onClick={() => navigate("/datasets")} className="px-5 py-2.5 bg-white text-od-800 font-bold rounded-xl hover:bg-od-50 transition-colors text-sm">
            Explorer les datasets
          </button>
          <button onClick={() => navigate("/api")} className="px-5 py-2.5 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors text-sm border border-white/30">
            Documentation API
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { v: "6", l: "Datasets publics" },
          { v: "3 APIs", l: "Endpoints REST" },
          { v: "48K+", l: "Mesures QoS" },
          { v: "Libre", l: "Licence ouverte" },
        ].map(s => (
          <div key={s.l} className="card p-4 text-center">
            <p className="text-2xl font-bold text-od-700">{s.v}</p>
            <p className="text-xs text-slate-500 mt-1">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Datasets */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Datasets disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DATASETS.map(d => (
            <div key={d.id} className="card p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/datasets")}>
              <div className="flex items-start justify-between mb-2">
                <span className={`badge ${CAT_COLORS[d.category]}`}>{d.category}</span>
                <span className="text-xs text-slate-400">Mis a jour {d.updated}</span>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{d.title}</h3>
              <p className="text-sm text-slate-500 mb-3 leading-snug">{d.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {d.format.map(f => (
                    <span key={f} className="badge bg-slate-100 text-slate-600 font-mono text-[10px]">{f}</span>
                  ))}
                </div>
                <span className="text-xs text-slate-400">{d.rows} lignes</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
