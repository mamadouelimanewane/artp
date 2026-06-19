import { useState } from "react";

const BANDES = [
  { bande: "700 MHz", type: "Sub-6 GHz", usage: "Couverture rurale 5G", statut: "Attribuée", titulaire: "Orange SN", expiration: "2031", couleur: "emerald" },
  { bande: "3.5 GHz", type: "Sub-6 GHz", usage: "5G urbaine capacité", statut: "Planifiée", titulaire: "—", expiration: "2026", couleur: "blue" },
  { bande: "26 GHz", type: "mmWave", usage: "5G ultra-haut débit", statut: "Réservée", titulaire: "—", expiration: "—", couleur: "violet" },
  { bande: "28 GHz", type: "mmWave", usage: "5G entreprise & IoT", statut: "Étude", titulaire: "—", expiration: "—", couleur: "purple" },
  { bande: "1800 MHz", type: "Sub-6 GHz", usage: "4G/5G DSS transition", statut: "Active", titulaire: "Tous opérateurs", expiration: "2029", couleur: "amber" },
  { bande: "2100 MHz", type: "Sub-6 GHz", usage: "5G NSA (Non-Stand Alone)", statut: "Planifiée", titulaire: "—", expiration: "2027", couleur: "sky" },
];

const REGIONS = [
  { nom: "Dakar", lat: 14.7, lng: -17.4, score: 95, pop: 3900000, priorite: "P1" },
  { nom: "Thiès", lat: 14.8, lng: -16.9, score: 72, pop: 1850000, priorite: "P2" },
  { nom: "Ziguinchor", lat: 12.6, lng: -16.3, score: 48, pop: 680000, priorite: "P3" },
  { nom: "Saint-Louis", lat: 16.0, lng: -16.5, score: 61, pop: 1000000, priorite: "P2" },
  { nom: "Kaolack", lat: 14.2, lng: -16.1, score: 58, pop: 970000, priorite: "P3" },
  { nom: "Tambacounda", lat: 13.8, lng: -13.7, score: 32, pop: 720000, priorite: "P4" },
  { nom: "Kédougou", lat: 12.6, lng: -12.2, score: 18, pop: 180000, priorite: "P4" },
];

const SIMULATIONS = [
  { scenario: "Attribution 3.5 GHz à 3 opérateurs", impact: "+340 000 utilisateurs 5G", cout: "12 Mds FCFA", delai: "18 mois", risque: "Faible" },
  { scenario: "Attribution exclusive 26 GHz (mmWave) Dakar", impact: "Zones ultra-haut débit centre-ville", cout: "8 Mds FCFA", delai: "12 mois", risque: "Moyen" },
  { scenario: "Partage infrastructure passive 5G", impact: "-35% coût déploiement opérateurs", cout: "Régulation sans coût direct", delai: "6 mois", risque: "Faible" },
  { scenario: "5G NSA via DSS sur 1800/2100 MHz", impact: "Couverture rapide 5G nationale", cout: "Investissement opérateurs", delai: "9 mois", risque: "Faible" },
];

const STATUT_COLORS: Record<string, string> = {
  "Attribuée": "bg-emerald-100 text-emerald-700",
  "Planifiée": "bg-blue-100 text-blue-700",
  "Réservée": "bg-violet-100 text-violet-700",
  "Étude": "bg-gray-100 text-gray-600",
  "Active": "bg-amber-100 text-amber-700",
};

export default function CinqGPage() {
  const [tab, setTab] = useState<"bandes" | "simulation" | "jumeau">("bandes");

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Planification 5G & Jumeau Numérique</h1>
        <p className="text-slate-500 text-sm">Gestion des bandes mmWave, simulation de déploiement, coordination CEDEAO</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
        {[["bandes", "Bandes 5G"], ["simulation", "Simulation Déploiement"], ["jumeau", "Jumeau Numérique"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as typeof tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === k ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === "bandes" && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="card p-4 text-center">
              <p className="text-2xl font-black text-blue-600">6</p>
              <p className="text-xs text-slate-500">Bandes planifiées</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-black text-violet-600">2</p>
              <p className="text-xs text-slate-500">Bandes mmWave</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-black text-emerald-600">2026</p>
              <p className="text-xs text-slate-500">Lancement prévu</p>
            </div>
          </div>
          {BANDES.map((b) => (
            <div key={b.bande} className="card p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-black text-slate-900">{b.bande}</span>
                    <span className="badge bg-slate-100 text-slate-600 text-[10px]">{b.type}</span>
                  </div>
                  <p className="text-sm text-slate-500">{b.usage}</p>
                </div>
                <span className={`badge text-xs font-semibold ${STATUT_COLORS[b.statut] || "bg-gray-100 text-gray-600"}`}>{b.statut}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-slate-400">Titulaire :</span> <span className="font-medium text-slate-700">{b.titulaire}</span></div>
                <div><span className="text-slate-400">Expiration :</span> <span className="font-medium text-slate-700">{b.expiration}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "simulation" && (
        <div className="space-y-4">
          <div className="card p-4 bg-blue-50 border border-blue-200">
            <p className="text-sm font-semibold text-blue-800 mb-1">Simulateur d'impact déploiement 5G</p>
            <p className="text-xs text-blue-600">Analysez l'impact de chaque scénario d'attribution avant toute décision réglementaire</p>
          </div>

          {SIMULATIONS.map((s, i) => (
            <div key={i} className="card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <p className="font-semibold text-slate-800 text-sm flex-1 pr-3">{s.scenario}</p>
                <span className={`badge text-[10px] font-semibold shrink-0 ${s.risque === "Faible" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  Risque {s.risque}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-400 text-[10px] mb-0.5">Impact</p>
                  <p className="font-semibold text-slate-700">{s.impact}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-400 text-[10px] mb-0.5">Coût estimé</p>
                  <p className="font-semibold text-slate-700">{s.cout}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-400 text-[10px] mb-0.5">Délai</p>
                  <p className="font-semibold text-slate-700">{s.delai}</p>
                </div>
              </div>
              <button className="w-full py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                Lancer la simulation détaillée →
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "jumeau" && (
        <div className="space-y-4">
          <div className="card p-4 bg-violet-50 border border-violet-200">
            <p className="text-sm font-semibold text-violet-800 mb-1">🔮 Jumeau Numérique du Spectre Sénégalais</p>
            <p className="text-xs text-violet-700">Modèle numérique temps réel de l'occupation fréquentielle nationale. Permet de simuler l'impact de nouvelles attributions avant décision.</p>
          </div>

          <div className="card p-0 overflow-hidden">
            <div className="bg-slate-900 p-4 text-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold">Carte d'occupation spectre — Sénégal</p>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  Temps réel
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {REGIONS.map((r) => (
                  <div key={r.nom} className="text-center">
                    <div className="w-full aspect-square rounded-lg mb-1 flex items-center justify-center text-xs font-bold"
                      style={{ background: `rgba(99,102,241,${r.score / 100})`, color: r.score > 50 ? "white" : "#94a3b8" }}>
                      {r.score}%
                    </div>
                    <p className="text-[8px] text-slate-400 truncate">{r.nom}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-900 inline-block" />0%</span>
                <span className="flex-1 h-1 rounded" style={{ background: "linear-gradient(to right, #1e1b4b, #6366f1, #a5b4fc)" }} />
                <span className="flex items-center gap-1">100%<span className="w-3 h-3 rounded bg-indigo-300 inline-block" /></span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {REGIONS.map((r) => (
                <div key={r.nom} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-600 w-24">{r.nom}</span>
                  <span className={`badge text-[10px] ${r.priorite === "P1" ? "bg-red-100 text-red-700" : r.priorite === "P2" ? "bg-amber-100 text-amber-700" : r.priorite === "P3" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                    Priorité {r.priorite}
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${r.score}%` }} />
                  </div>
                  <span className="text-xs font-bold text-indigo-600 w-8 text-right">{r.score}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Coordination CEDEAO</p>
            <div className="space-y-2">
              {["Mauritanie", "Mali", "Guinée-Bissau", "Guinée Conakry", "Gambie"].map((pays) => (
                <div key={pays} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-sm text-slate-600">{pays}</span>
                  <span className="badge bg-emerald-100 text-emerald-700 text-[10px]">Coordination active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
