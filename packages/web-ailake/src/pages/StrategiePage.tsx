const AXES = [
  {
    num: 1,
    title: "Detection automatique des infractions",
    desc: "Deploiement de modeles ML pour identifier en temps reel les violations de QoS, fraudes SIM swap et non-conformites tarifaires.",
    status: "En cours",
    budget: "120M FCFA",
    timeline: "2026-2027",
    kpi: "85% precision cible",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    num: 2,
    title: "Chatbot reglementaire citoyen",
    desc: "Assistant conversationnel IA disponible 24h/7j pour guider les citoyens dans leurs reclamations et expliquer la reglementation telecom.",
    status: "PoC valide",
    budget: "45M FCFA",
    timeline: "2026",
    kpi: "10 000 conversations/mois",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    num: 3,
    title: "Analyse predictive des plaintes",
    desc: "Modeles de prediction des pics de plaintes par operateur et region pour anticiper les interventions reglementaires.",
    status: "Etude",
    budget: "30M FCFA",
    timeline: "2027",
    kpi: "Prevision J+7 avec 80% exactitude",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    num: 4,
    title: "Scoring operateurs automatise",
    desc: "Systeme de notation IA des operateurs basé sur l'agregation de 50+ indicateurs de conformite reglementaire.",
    status: "En conception",
    budget: "65M FCFA",
    timeline: "2027-2028",
    kpi: "Rapport trimestriel automatise",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    num: 5,
    title: "Lac de donnees regulatoire",
    desc: "Infrastructure centralisee de stockage et traitement des donnees ARTP (QoS, plaintes, spectre, licences, controles terrain).",
    status: "Deploiement",
    budget: "200M FCFA",
    timeline: "2026",
    kpi: "5+ sources integrees, 50TB/an",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
];

const STATUS_DOT: Record<string, string> = {
  "En cours": "bg-blue-400",
  "PoC valide": "bg-emerald-400",
  "Etude": "bg-amber-400",
  "En conception": "bg-slate-400",
  "Deploiement": "bg-purple-400",
};

export default function StrategiePage() {
  return (
    <div className="p-6 space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-ai-800 via-ai-700 to-ai-600 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🧠</span>
          <div>
            <h1 className="text-2xl font-bold">Strategie IA — ARTP 2026-2030</h1>
            <p className="text-ai-200 text-sm">5 axes prioritaires pour une regulation augmentee par l'intelligence artificielle</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            { v: "5", l: "Axes strategiques" },
            { v: "460M FCFA", l: "Budget previsionnel" },
            { v: "2026-2030", l: "Horizon" },
          ].map(s => (
            <div key={s.l} className="bg-white/15 rounded-2xl p-3 text-center">
              <p className="text-xl font-bold">{s.v}</p>
              <p className="text-ai-200 text-xs">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Axes */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800">5 axes prioritaires</h2>
        {AXES.map(a => (
          <div key={a.num} className={`card p-5 border ${a.color}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-ai-100 flex items-center justify-center font-bold text-ai-700 text-sm shrink-0">
                  {a.num}
                </div>
                <h3 className="font-bold text-slate-800">{a.title}</h3>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-4">
                <div className={`w-2 h-2 rounded-full ${STATUS_DOT[a.status]}`} />
                <span className="text-xs font-medium text-slate-600">{a.status}</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">{a.desc}</p>
            <div className="flex flex-wrap gap-4 text-xs">
              <div>
                <span className="text-slate-400">Budget : </span>
                <span className="font-semibold text-slate-700">{a.budget}</span>
              </div>
              <div>
                <span className="text-slate-400">Calendrier : </span>
                <span className="font-semibold text-slate-700">{a.timeline}</span>
              </div>
              <div>
                <span className="text-slate-400">KPI cible : </span>
                <span className="font-semibold text-slate-700">{a.kpi}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
