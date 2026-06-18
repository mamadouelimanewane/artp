import { useState } from "react";

const MODULES = [
  { id: "M001", title: "Fondamentaux de la régulation télécom", category: "Régulation", level: "Débutant", duration: "8h", enrolled: 342, rating: 4.8, lang: ["FR","EN"] },
  { id: "M002", title: "Droit des télécommunications sénégalais", category: "Juridique", level: "Intermédiaire", duration: "12h", enrolled: 287, rating: 4.9, lang: ["FR"] },
  { id: "M003", title: "Régulation des réseaux mobiles 4G/5G", category: "Technique", level: "Avancé", duration: "16h", enrolled: 241, rating: 4.7, lang: ["FR","EN"] },
  { id: "M004", title: "Gestion du spectre radioélectrique", category: "Technique", level: "Avancé", duration: "10h", enrolled: 198, rating: 4.6, lang: ["FR"] },
  { id: "M005", title: "Cybersécurité pour régulateurs télécom", category: "Sécurité", level: "Intermédiaire", duration: "14h", enrolled: 176, rating: 4.8, lang: ["FR","EN","PT"] },
  { id: "M006", title: "QoS : mesure et supervision", category: "Technique", level: "Intermédiaire", duration: "8h", enrolled: 154, rating: 4.5, lang: ["FR"] },
  { id: "M007", title: "Règlement des différends télécom", category: "Juridique", level: "Avancé", duration: "10h", enrolled: 132, rating: 4.7, lang: ["FR","EN"] },
  { id: "M008", title: "Service universel et inclusion numérique", category: "Régulation", level: "Débutant", duration: "6h", enrolled: 218, rating: 4.6, lang: ["FR"] },
];

const CATS = ["Tous", "Régulation", "Juridique", "Technique", "Sécurité"];
const LEVELS = ["Tous niveaux", "Débutant", "Intermédiaire", "Avancé"];

const LEVEL_COLORS: Record<string, string> = {
  "Débutant": "bg-emerald-100 text-emerald-700",
  "Intermédiaire": "bg-acad-100 text-acad-700",
  "Avancé": "bg-purple-100 text-purple-700",
};

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5 items-center">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i<=Math.floor(n)?"text-amber-400":"text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      <span className="text-xs text-slate-500 ml-1">{n}</span>
    </span>
  );
}

export default function CataloguePage() {
  const [cat, setCat] = useState("Tous");
  const [level, setLevel] = useState("Tous niveaux");

  const filtered = MODULES.filter(m =>
    (cat === "Tous" || m.category === cat) &&
    (level === "Tous niveaux" || m.level === level)
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Catalogue des Formations</h1>
        <p className="text-slate-500 text-sm">{MODULES.length} modules · Disponibles en ligne · Certifiants</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${cat===c?"bg-acad-600 text-white":"bg-white border border-slate-200 text-slate-600 hover:border-acad-300"}`}>
            {c}
          </button>
        ))}
        <div className="border-l border-slate-200 mx-1" />
        {LEVELS.map(l => (
          <button key={l} onClick={() => setLevel(l)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${level===l?"bg-slate-700 text-white":"bg-white border border-slate-200 text-slate-600 hover:border-slate-400"}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(m => (
          <div key={m.id} className="card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <span className={`badge ${LEVEL_COLORS[m.level]}`}>{m.level}</span>
              <span className="badge bg-slate-100 text-slate-600 text-[10px]">{m.category}</span>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1 leading-snug">{m.title}</h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
              <span>⏱ {m.duration}</span>
              <span>👥 {m.enrolled} inscrits</span>
              <div className="flex gap-1">
                {m.lang.map(l => <span key={l} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono">{l}</span>)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Stars n={m.rating} />
              <button className="px-3 py-1.5 bg-acad-600 text-white text-xs rounded-lg hover:bg-acad-700 transition-colors font-semibold">
                S'inscrire
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
