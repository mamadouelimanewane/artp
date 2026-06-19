import { useState } from "react";

const ARTICLES = [
  {
    id: 1, date: "2026-06-15", source: "ARCEP (France)", categorie: "5G",
    titre: "Attribution des fréquences 5G millimétrique : retours d'expérience",
    resume: "L'ARCEP publie son bilan de l'attribution des bandes 26 GHz et tire des enseignements pour les régulateurs africains souhaitant préparer leur propre cadre 5G mmWave.",
    lien: "#", badge: "bg-blue-100 text-blue-700",
  },
  {
    id: 2, date: "2026-06-12", source: "UIT", categorie: "IA & Régulation",
    titre: "L'intelligence artificielle au service des régulateurs : guide pratique UIT 2026",
    resume: "Le nouveau guide de l'UIT détaille comment les régulateurs peuvent intégrer l'IA dans leurs processus de surveillance de marché, de QoS et de détection de fraudes.",
    lien: "#", badge: "bg-violet-100 text-violet-700",
  },
  {
    id: 3, date: "2026-06-10", source: "GSMA", categorie: "Open Gateway",
    titre: "GSMA Open Gateway : état du déploiement mondial et cadre réglementaire",
    resume: "La GSMA fait le point sur l'adoption des APIs Open Gateway (KYC, Number Verify, Location) dans 45 pays et recommande un cadre réglementaire harmonisé CEDEAO.",
    lien: "#", badge: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 4, date: "2026-06-08", source: "BEREC (UE)", categorie: "Net Neutralité",
    titre: "Neutralité du Net à l'ère de la 5G : nouvelles lignes directrices BEREC",
    resume: "BEREC publie des guidelines actualisées sur la neutralité du Net applicables aux réseaux 5G, avec des implications pour les régulateurs souhaitant des obligations similaires.",
    lien: "#", badge: "bg-amber-100 text-amber-700",
  },
  {
    id: 5, date: "2026-06-05", source: "ANACOM (Portugal)", categorie: "Consommateurs",
    titre: "Plateforme citoyenne de mesure QoS : bilan 2 ans et recommandations",
    resume: "ANACOM partage son expérience de plateforme de mesure participative de la QoS : méthodologie, gouvernance des données, impact sur les décisions réglementaires.",
    lien: "#", badge: "bg-rose-100 text-rose-700",
  },
  {
    id: 6, date: "2026-06-02", source: "CRASA", categorie: "CEDEAO",
    titre: "Harmonisation des cadres réglementaires en Afrique australe : leçons pour l'Afrique de l'Ouest",
    resume: "La CRASA présente son modèle d'harmonisation réglementaire qui pourrait inspirer la CEDEAO dans sa démarche d'intégration des marchés télécoms régionaux.",
    lien: "#", badge: "bg-teal-100 text-teal-700",
  },
];

const PODCASTS = [
  { id: 1, titre: "La 5G au Sénégal : enjeux et calendrier", duree: "32 min", date: "2026-06-10", invité: "DG Adjoint ARTP" },
  { id: 2, titre: "Fraude télécom : état des lieux et nouvelles menaces", duree: "28 min", date: "2026-05-28", invité: "Chef Département Sécurité" },
  { id: 3, titre: "Open Data : pourquoi ouvrir les données de régulation ?", duree: "24 min", date: "2026-05-14", invité: "Expert Data ARTP" },
  { id: 4, titre: "Droits des consommateurs numériques : ce qui change en 2026", duree: "35 min", date: "2026-04-30", invité: "Juriste ARTP" },
];

const DECISIONS = [
  { ref: "DEC-2026-018", date: "2026-06-05", objet: "Sanctions Orange SN — non-respect QoS 4G T1 2026", impact: "Opérateurs", resume: "Amende de 50M FCFA prononcée à l'encontre d'Orange pour non-respect des seuils minimaux de débit moyen 4G dans 3 régions." },
  { ref: "DEC-2026-015", date: "2026-05-20", objet: "Attribution fréquence 700 MHz — Extension zone rurale", impact: "Spectre", resume: "Extension de la licence 700 MHz accordée pour couvrir 12 nouvelles communes rurales dans les régions de Tambacounda et Kédougou." },
  { ref: "DEC-2026-012", date: "2026-05-08", objet: "Tarifs interconnexion 2026-2027", impact: "Marché", resume: "Révision des tarifs d'interconnexion voix et SMS entre opérateurs. Baisse de 8% sur les terminaisons d'appels mobiles." },
];

export default function VeillePage() {
  const [tab, setTab] = useState<"veille" | "podcast" | "decisions">("veille");
  const [catFilter, setCatFilter] = useState("Tous");

  const categories = ["Tous", "5G", "IA & Régulation", "CEDEAO", "Consommateurs", "Open Gateway"];
  const filtered = catFilter === "Tous" ? ARTICLES : ARTICLES.filter(a => a.categorie === catFilter);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Veille Réglementaire & Médias</h1>
        <p className="text-slate-500 text-sm">Newsletter IA · Résumés décisions ARTP · Podcast « La Régulation Expliquée »</p>
      </div>

      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
        {[["veille", "Veille internationale"], ["podcast", "Podcast"], ["decisions", "Décisions ARTP"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as typeof tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${tab === k ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === "veille" && (
        <div className="space-y-4">
          <div className="card p-4 bg-violet-50 border border-violet-200 flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <p className="text-sm font-semibold text-violet-800">Newsletter IA hebdomadaire</p>
              <p className="text-xs text-violet-600">Résumés automatiques des publications réglementaires mondiales — chaque lundi matin</p>
            </div>
            <button className="badge bg-violet-600 text-white text-xs shrink-0">S'abonner</button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all
                  ${catFilter === c ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200"}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map(a => (
              <div key={a.id} className="card p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`badge text-[10px] font-semibold ${a.badge}`}>{a.categorie}</span>
                  <span className="text-[10px] text-slate-400">{a.source}</span>
                  <span className="text-[10px] text-slate-400 ml-auto">{new Date(a.date).toLocaleDateString("fr-FR")}</span>
                </div>
                <p className="font-semibold text-slate-800 text-sm">{a.titre}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{a.resume}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-violet-600 font-semibold">✨ Résumé généré par IA</span>
                  <button className="text-xs text-blue-600 font-semibold ml-auto hover:underline">Lire l'original →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "podcast" && (
        <div className="space-y-4">
          <div className="card p-5 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-2xl">🎙️</div>
              <div>
                <p className="font-bold">La Régulation Expliquée</p>
                <p className="text-xs text-slate-400">Podcast officiel ARTP · Bi-mensuel</p>
              </div>
            </div>
            <p className="text-xs text-slate-300">Des experts de l'ARTP décryptent les enjeux de la régulation des télécommunications pour tous les acteurs de l'écosystème.</p>
          </div>

          <div className="space-y-3">
            {PODCASTS.map((p, i) => (
              <div key={p.id} className="card p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center text-lg font-black text-violet-600 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm leading-tight">{p.titre}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Invité : {p.invité} · {p.duree}</p>
                    <p className="text-[10px] text-slate-400">{new Date(p.date).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0 hover:bg-violet-700 transition-colors">▶</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "decisions" && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">Résumés IA des dernières décisions officielles de l'ARTP</p>
          {DECISIONS.map((d) => (
            <div key={d.ref} className="card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="badge bg-slate-100 text-slate-600 font-mono text-[10px]">{d.ref}</span>
                <span className="badge bg-blue-100 text-blue-700 text-[10px]">{d.impact}</span>
                <span className="text-[10px] text-slate-400 ml-auto">{new Date(d.date).toLocaleDateString("fr-FR")}</span>
              </div>
              <p className="font-semibold text-slate-800 text-sm">{d.objet}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{d.resume}</p>
              <span className="text-[10px] text-violet-600 font-semibold">✨ Résumé généré par IA</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
