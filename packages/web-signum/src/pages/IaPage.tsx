import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const PREDICTIONS_7J = [
  { jour: "J+1", fraude: 4820, trafic: 284000, mm_suspect: 18 },
  { jour: "J+2", fraude: 5100, trafic: 291000, mm_suspect: 14 },
  { jour: "J+3", fraude: 4650, trafic: 278000, mm_suspect: 22 },
  { jour: "J+4", fraude: 5380, trafic: 305000, mm_suspect: 31 },
  { jour: "J+5", fraude: 6200, trafic: 312000, mm_suspect: 28 },
  { jour: "J+6", fraude: 5720, trafic: 298000, mm_suspect: 19 },
  { jour: "J+7", fraude: 4980, trafic: 285000, mm_suspect: 16 },
];

const MODELES = [
  { nom: "Détection SIM Box", type: "Anomalie réseau", precision: 97.4, rappel: 94.1, algo: "Isolation Forest + LSTM", dernierEntrainement: "12 juin 2026", statut: "ACTIF" },
  { nom: "AML Mobile Money", type: "Fraude financière", precision: 95.2, rappel: 91.8, algo: "XGBoost + Graph Neural Net", dernierEntrainement: "10 juin 2026", statut: "ACTIF" },
  { nom: "Prédiction trafic 24h", type: "Prévision", precision: 98.7, rappel: 98.7, algo: "Transformer (seq2seq)", dernierEntrainement: "13 juin 2026", statut: "ACTIF" },
  { nom: "Détection IMEI clone", type: "Contrefaçon", precision: 99.1, rappel: 88.4, algo: "CNN + Feature hashing", dernierEntrainement: "8 juin 2026", statut: "ACTIF" },
  { nom: "Score risque opérateur", type: "Scoring", precision: 92.3, rappel: 90.7, algo: "Random Forest + SHAP", dernierEntrainement: "11 juin 2026", statut: "ACTIF" },
];

const INSIGHTS = [
  { emoji: "🔮", titre: "Pic de fraude prévu vendredi", detail: "L'IA détecte un pattern historique → +28% de fraude SIM Box attendu vendredi soir. Recommandation : renforcer les seuils de blocage de 17h à 23h.", priorite: "ÉLEVÉ" },
  { emoji: "📡", titre: "Anomalie spectre 2.1 GHz — Free SN", detail: "Usage anormal de la bande 2.1 GHz détecté dans la région de Thiès. Possibles équipements non homologués. Inspection terrain recommandée.", priorite: "MOYEN" },
  { emoji: "💳", titre: "Réseau de comptes Wave coordonnés", detail: "42 comptes Wave présentant des comportements synchronisés — probable réseau de mules. Alerte transmise au CENTIF automatiquement.", priorite: "CRITIQUE" },
  { emoji: "📊", titre: "Baisse trafic voix longue distance", detail: "Trafic voix international Orange en baisse de 12% sur 30 jours — potentiel passage vers applications OTT (WhatsApp, etc.). Impact fiscal estimé : 180M FCFA/mois.", priorite: "INFO" },
];

const PRIORITE_STYLE: Record<string, string> = {
  "CRITIQUE": "border-red-500/40 bg-red-500/10",
  "ÉLEVÉ": "border-amber-500/40 bg-amber-500/10",
  "MOYEN": "border-blue-500/40 bg-blue-500/10",
  "INFO": "border-white/20 bg-white/5",
};
const PRIORITE_TEXT: Record<string, string> = {
  "CRITIQUE": "text-red-400",
  "ÉLEVÉ": "text-amber-400",
  "MOYEN": "text-blue-400",
  "INFO": "text-white/50",
};

export default function IaPage() {
  const [tab, setTab] = useState<"insights" | "predictions" | "modeles">("insights");
  const [query, setQuery] = useState("");
  const [iaResponse, setIaResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const DEMO_RESPONSES: Record<string, string> = {
    default: "Analyse en cours... Sur la base des données SIGNUM (24h glissantes) : le trafic voix national est stable à 284K appels/heure. Le taux de fraude est de 0.42%, en baisse de 8% par rapport à hier. 3 alertes CRITIQUE actives. Recommandation : surveiller les bandes 900MHz d'Expresso SN qui présentent une anomalie légère.",
  };

  function askAI() {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setIaResponse(DEMO_RESPONSES.default);
      setLoading(false);
    }, 1800);
  }

  return (
    <div className="p-6 space-y-6 min-h-screen"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0f0a2e 40%, #0a1628 100%)" }}>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">IA Prédictive & Analyse Intelligente</h1>
          <p className="text-white/40 text-sm">5 modèles ML actifs · Prédictions 7J · Insights automatiques · LLM embarqué</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-purple-400 border border-purple-500/30"
          style={{ background: "rgba(168,85,247,0.1)" }}>
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse inline-block" />
          5 modèles actifs
        </div>
      </div>

      {/* Assistant IA */}
      <div className="rounded-2xl p-5 border border-purple-500/30" style={{ background: "rgba(168,85,247,0.08)" }}>
        <p className="text-sm font-bold text-purple-300 mb-3">🤖 SIGNUM IA — Assistant d'analyse sectorielle</p>
        <div className="flex gap-3">
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && askAI()}
            placeholder="Posez une question sur le secteur télécom sénégalais..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50" />
          <button onClick={askAI}
            disabled={loading}
            className="px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6366f1)" }}>
            {loading ? "..." : "Analyser"}
          </button>
        </div>
        {iaResponse && (
          <div className="mt-4 p-4 rounded-xl border border-purple-500/20" style={{ background: "rgba(255,255,255,0.04)" }}>
            <p className="text-xs text-purple-300 font-bold mb-2">🤖 SIGNUM IA répond :</p>
            <p className="text-sm text-white/80 leading-relaxed">{iaResponse}</p>
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {["État du réseau aujourd'hui ?", "Opérateur le plus risqué ?", "Prévision fraude cette semaine ?"].map(q => (
            <button key={q} onClick={() => { setQuery(q); }}
              className="px-3 py-1.5 rounded-lg text-xs text-purple-300 border border-purple-500/20 hover:bg-purple-500/10 transition-colors">
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["insights", "predictions", "modeles"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === t ? "text-white" : "text-white/40 hover:text-white/70"}`}
            style={tab === t ? { background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(6,182,212,0.3))", border: "1px solid rgba(99,102,241,0.5)" } : { border: "1px solid rgba(255,255,255,0.1)" }}>
            {t === "insights" ? "💡 Insights automatiques" : t === "predictions" ? "🔮 Prédictions 7 jours" : "⚙️ Modèles ML"}
          </button>
        ))}
      </div>

      {tab === "insights" && (
        <div className="grid grid-cols-2 gap-4">
          {INSIGHTS.map(ins => (
            <div key={ins.titre} className={`rounded-2xl p-5 border ${PRIORITE_STYLE[ins.priorite]}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{ins.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-bold text-white">{ins.titre}</p>
                    <span className={`text-[10px] font-bold ${PRIORITE_TEXT[ins.priorite]}`}>{ins.priorite}</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">{ins.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "predictions" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
            <p className="text-sm font-bold text-white mb-4">Prédiction fraude — 7 jours</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={PREDICTIONS_7J}>
                <defs>
                  <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="jour" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }} labelStyle={{ color: "#94a3b8" }} />
                <Area type="monotone" dataKey="fraude" stroke="#ef4444" fill="url(#gp)" strokeWidth={2} strokeDasharray="6 3" name="Fraude prévue" />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-white/30 mt-2">--- Prédiction (intervalle de confiance 94%)</p>
          </div>
          <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
            <p className="text-sm font-bold text-white mb-4">Prédiction alertes AML — 7 jours</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={PREDICTIONS_7J}>
                <XAxis dataKey="jour" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }} labelStyle={{ color: "#94a3b8" }} />
                <Line type="monotone" dataKey="mm_suspect" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Alertes MM" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "modeles" && (
        <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
          <p className="text-sm font-bold text-white mb-4">Catalogue des modèles IA déployés</p>
          <div className="space-y-3">
            {MODELES.map(m => (
              <div key={m.nom} className="rounded-xl p-4 border border-white/10 grid grid-cols-5 gap-4 items-center"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-white">{m.nom}</p>
                  <p className="text-[10px] text-indigo-300 mt-0.5">{m.algo}</p>
                  <p className="text-[10px] text-white/30">{m.type}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-emerald-400">{m.precision}%</p>
                  <p className="text-[9px] text-white/40">Précision</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-cyan-400">{m.rappel}%</p>
                  <p className="text-[9px] text-white/40">Rappel</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">{m.statut}</span>
                  <p className="text-[9px] text-white/30 mt-1">{m.dernierEntrainement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl p-4 border border-indigo-500/20" style={{ background: "rgba(99,102,241,0.06)" }}>
        <p className="text-xs text-indigo-300 font-bold mb-2">🏆 SIGNUM vs GVG — Module IA</p>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="text-white/60">✅ <span className="text-white">LLM embarqué</span> pour analyse narrative (GVG : pas d'IA)</div>
          <div className="text-white/60">✅ <span className="text-white">5 modèles ML</span> spécialisés (GVG : règles statiques)</div>
          <div className="text-white/60">✅ <span className="text-white">Prédictions 7J</span> avec intervalles de confiance (GVG : réactif uniquement)</div>
        </div>
      </div>
    </div>
  );
}
