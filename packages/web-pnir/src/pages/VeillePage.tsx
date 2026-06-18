const SOURCES = [
  { name: "ITU", region: "Monde", articles: 24, last: "Il y a 2h" },
  { name: "ARCEP France", region: "Europe", articles: 18, last: "Il y a 4h" },
  { name: "ARTCI Côte d'Ivoire", region: "Afrique", articles: 12, last: "Il y a 6h" },
  { name: "ANRT Maroc", region: "Afrique", articles: 9, last: "Il y a 1j" },
  { name: "ARCI Burkina", region: "Afrique", articles: 7, last: "Il y a 1j" },
];

const ARTICLES = [
  {
    id: 1,
    title: "Nouvelles obligations de couverture 4G en zones rurales — ARCEP France",
    source: "ARCEP France",
    date: "2026-06-17",
    tags: ["couverture", "rural", "4G"],
    summary: "L'ARCEP impose aux opérateurs de couvrir 99% de la population en 4G d'ici 2027, incluant les zones blanches.",
    relevance: 0.91,
  },
  {
    id: 2,
    title: "Cadre réglementaire eSIM en Afrique subsaharienne — ITU",
    source: "ITU",
    date: "2026-06-16",
    tags: ["eSIM", "Afrique", "réglementation"],
    summary: "Recommandations ITU pour l'harmonisation des régimes d'homologation eSIM dans les pays membres.",
    relevance: 0.88,
  },
  {
    id: 3,
    title: "Portabilité numérique : bilan 5 ans en Côte d'Ivoire — ARTCI",
    source: "ARTCI Côte d'Ivoire",
    date: "2026-06-15",
    tags: ["MNP", "portabilité", "bilan"],
    summary: "Analyse de l'impact de la portabilité sur la concurrence et les parts de marché depuis 2021.",
    relevance: 0.84,
  },
  {
    id: 4,
    title: "Lutte contre la fraude télécom : nouvelles directives — ANRT Maroc",
    source: "ANRT Maroc",
    date: "2026-06-13",
    tags: ["fraude", "SIM", "IMEI"],
    summary: "Directive ANRT renforçant l'enrôlement biométrique et la base de données IMEI nationale.",
    relevance: 0.79,
  },
];

export default function VeillePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Veille Réglementaire Internationale</h1>
        <p className="text-slate-500 text-sm">Automatisée par IA · {SOURCES.reduce((s,x)=>s+x.articles,0)} articles indexés · Mis à jour en continu</p>
      </div>

      {/* Sources */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {SOURCES.map(s => (
          <div key={s.name} className="card p-3 text-center">
            <p className="font-semibold text-slate-800 text-sm">{s.name}</p>
            <p className="text-xs text-slate-500">{s.region}</p>
            <p className="text-xl font-bold text-pnir-600 mt-1">{s.articles}</p>
            <p className="text-[10px] text-slate-400">{s.last}</p>
          </div>
        ))}
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {ARTICLES.map(a => (
          <div key={a.id} className="card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-semibold text-slate-800 text-sm leading-snug flex-1">{a.title}</h3>
              <div className="text-right shrink-0">
                <p className="text-xs text-slate-500">{a.date}</p>
                <div className="flex items-center gap-1 justify-end mt-1">
                  <span className="text-[10px] text-slate-400">Pertinence</span>
                  <span className={`text-xs font-bold ${a.relevance>0.85?"text-emerald-600":"text-amber-600"}`}>
                    {(a.relevance*100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-3">{a.summary}</p>
            <div className="flex items-center gap-2">
              <span className="badge bg-pnir-50 text-pnir-700 text-[10px]">{a.source}</span>
              {a.tags.map(t => (
                <span key={t} className="badge bg-slate-100 text-slate-600 text-[10px]">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
