import { useState } from "react";

const SAMPLE_TEXT = `Rapport de controle Orange SN — T1 2026

Dans le cadre de notre mission reglementaire, nous avons procede au controle des indicateurs de qualite de service
de la societe Orange Senegal SA pour le premier trimestre 2026. L'analyse porte sur les regions de Dakar, Thies
et Kaolack, couvrant une periode du 1er janvier au 31 mars 2026.

Il ressort de ce controle que le taux de succes des appels vocaux s'etablit a 94.2%, en deca du seuil reglementaire
de 95% fixe par la decision ARTP n°002/2023. Le debit moyen descendant en 4G est de 22.4 Mbps, conforme aux
engagements de couverture. Cependant, dans les zones rurales de Kaolack, le taux de couverture 3G n'atteint que
67%, bien en deca du seuil de 80% fixe pour 2025.

Par ailleurs, trois plaintes majeures ont ete enregistrees concernant des interruptions de service de plus de 4 heures
dans les quartiers de Pikine et Guediawaye entre le 15 et le 17 mars 2026, affectant plus de 85 000 abonnes.

En consequence, l'ARTP envisage l'emission d'une mise en demeure conformement a l'article 45 du decret 2021-1828
portant reglementation du secteur des communications electroniques.`;

const SUMMARY = `**Resume automatique par IA :**

**Operateur analyse :** Orange Senegal SA — T1 2026
**Regions controlees :** Dakar, Thies, Kaolack

**Infractions detectees (3) :**
1. Taux succes appels vocaux : 94.2% < seuil 95% [CRITIQUE]
2. Couverture 3G rurale Kaolack : 67% < seuil 80% [MAJEUR]
3. Interruption service >4h les 15-17 mars (85 000 abonnes) [MAJEUR]

**Conformites :**
- Debit 4G : 22.4 Mbps (conforme)

**Recommandation IA :** Mise en demeure probable — 2 infractions majeures et 1 critique
**Texte reglementaire applicable :** Article 45, Decret 2021-1828
**Niveau de confiance de l'analyse :** 92%`;

export default function ConsultationPage() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  function analyze() {
    setLoading(true);
    setResult("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < SUMMARY.length) {
        setResult(SUMMARY.slice(0, i + 3));
        i += 3;
      } else {
        clearInterval(interval);
        setLoading(false);
      }
    }, 15);
  }

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Resumeur de consultation IA</h1>
        <p className="text-slate-500 text-sm">
          Collez un rapport d'inspection ou un document reglementaire — l'IA extrait automatiquement les infractions et recommandations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">Document source</label>
          <textarea value={text} onChange={e => setText(e.target.value)}
            rows={16}
            className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-ai-400 resize-none leading-relaxed bg-slate-50" />
          <button onClick={analyze} disabled={loading || !text}
            className="w-full py-3 bg-ai-600 text-white font-bold rounded-2xl hover:bg-ai-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {loading ? (
              <>
                <span className="animate-spin text-lg">⚙️</span>
                Analyse en cours...
              </>
            ) : "Analyser avec l'IA"}
          </button>
          <p className="text-xs text-slate-400 text-center">
            Modele : ARTP-LLM v1.2 — Specialise reglementation telecom senegalaise
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">Analyse IA</label>
          <div className={`min-h-[350px] p-4 rounded-2xl border text-sm font-mono leading-relaxed whitespace-pre-wrap
            ${result ? "bg-ai-50 border-ai-200 text-slate-700" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
            {result || "Le resume apparaitra ici apres l'analyse..."}
            {loading && <span className="animate-pulse text-ai-600">|</span>}
          </div>
          {result && !loading && (
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-slate-700 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors">
                Exporter PDF
              </button>
              <button className="flex-1 py-2 bg-ai-100 text-ai-700 text-xs font-semibold rounded-xl hover:bg-ai-200 transition-colors">
                Creer dossier infraction
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
