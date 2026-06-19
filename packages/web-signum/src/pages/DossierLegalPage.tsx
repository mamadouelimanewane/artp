import { useState } from "react";

const DOSSIERS = [
  {
    ref: "DL-2026-0047",
    titre: "Bypass international massif — Free SN",
    date: "18 juin 2026",
    qualification: "Article 431-1 Code Pénal SN · Fraude aux télécommunications",
    montant: "9.3 Mds FCFA",
    preuves: ["CDR_FREE_ECART_20260618.json", "CAPTURE_SIGNUM_BYPASS_1204.pdf", "RAPPORT_ANALYSE_CDR_v3.pdf"],
    statut: "PRÊT ARMP",
    gravite: "CRITIQUE",
    destinataire: "ARMP + Parquet de Dakar",
  },
  {
    ref: "DL-2026-0046",
    titre: "SIM Box détectée — réseau de 12 équipements · Orange SN",
    date: "15 juin 2026",
    qualification: "Article 430-7 Code Pénal SN · Exploitation illicite infrastructure télécom",
    montant: "284 M FCFA",
    preuves: ["SIMBOX_COORDONNEES_GPS.pdf", "CDR_BYPASS_847APPELS.json", "PHOTOS_EQUIPEMENTS_SAISIS.pdf"],
    statut: "TRANSMIS",
    gravite: "CRITIQUE",
    destinataire: "DPJ + ARTP",
  },
  {
    ref: "DL-2026-0044",
    titre: "1 240 SIM enregistrées sur CNIE de décédés · Expresso SN",
    date: "10 juin 2026",
    qualification: "Article 363 Code Pénal SN · Usurpation d'identité",
    montant: "Non chiffré",
    preuves: ["LISTE_CNIE_DECEEDES.xlsx", "CROISEMENT_ETAT_CIVIL_SIGNUM.pdf", "RAPPORT_KYC_EXPRESSO.pdf"],
    statut: "EN COURS",
    gravite: "ÉLEVÉ",
    destinataire: "ARTP + DPJ",
  },
];

const STATUT_STYLE: Record<string, string> = {
  "PRÊT ARMP": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "TRANSMIS": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  "EN COURS": "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const GRAVITE_STYLE: Record<string, string> = {
  "CRITIQUE": "bg-red-500/20 text-red-400 border-red-500/30",
  "ÉLEVÉ": "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const ETAPES_GENERATION = [
  { num: 1, label: "Extraction des CDR concernés", desc: "Horodatage blockchain · Non répudiable", done: true },
  { num: 2, label: "Qualification juridique automatique", desc: "Croisement Code Pénal SN + jurisprudence ARTP", done: true },
  { num: 3, label: "Génération du PV numérique", desc: "Signature électronique ARTP · Format ARMP", done: true },
  { num: 4, label: "Calcul du préjudice financier", desc: "Modèle actuariel certifié DGID", done: true },
  { num: 5, label: "Assemblage du dossier complet", desc: "PDF sécurisé + pièces jointes chiffrées", done: false },
  { num: 6, label: "Transmission sécurisée au destinataire", desc: "Canal chiffré ARTP ↔ ARMP / Parquet", done: false },
];

export default function DossierLegalPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [actif, setActif] = useState(0);

  function generer() {
    setGenerating(true);
    setActif(0);
    let step = 0;
    const iv = setInterval(() => {
      step++;
      setActif(step);
      if (step >= ETAPES_GENERATION.length) {
        clearInterval(iv);
        setGenerating(false);
        setGenerated(true);
      }
    }, 600);
  }

  return (
    <div className="p-6 space-y-6 min-h-screen"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0f0a2e 40%, #0a1628 100%)" }}>

      <div>
        <h1 className="text-2xl font-black text-white">Dossier Légal Automatique</h1>
        <p className="text-white/40 text-sm">Preuves judiciaires · PV horodatés · Qualification pénale · Transmission ARMP / Parquet / DPJ</p>
      </div>

      <div className="rounded-2xl p-4 border border-indigo-500/30" style={{ background: "rgba(99,102,241,0.08)" }}>
        <p className="text-xs font-bold text-indigo-300 mb-1">⚖️ La différence décisive avec GVG</p>
        <p className="text-xs text-white/60">GVG remet des tableaux CSV. Un juge ne peut pas condamner avec un CSV. SIGNUM génère automatiquement un <strong className="text-white">dossier judiciaire complet</strong> : PV numérique signé ARTP, qualification pénale selon le Code Pénal sénégalais, chaîne de preuve horodatée blockchain, calcul actuariel du préjudice. <strong className="text-white">Recevable immédiatement devant tout tribunal sénégalais.</strong></p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Dossiers générés (2026)", value: "47", color: "#6366f1", icon: "📁" },
          { label: "Transmis ARMP / Parquet", value: "31", color: "#10b981", icon: "⚖️" },
          { label: "Condamnations obtenues", value: "8", color: "#f59e0b", icon: "🔨" },
          { label: "Recouvrement obtenu", value: "12.4 Mds", color: "#ef4444", icon: "💰" },
        ].map(k => (
          <div key={k.label} className="rounded-2xl p-4 border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
            <span className="text-2xl">{k.icon}</span>
            <p className="text-xl font-black mt-2" style={{ color: k.color }}>{k.value}</p>
            <p className="text-[10px] text-white/40 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Liste dossiers */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-white">Dossiers actifs</p>
          {DOSSIERS.map((d, i) => (
            <div key={d.ref}
              onClick={() => setSelected(i === selected ? null : i)}
              className={`rounded-2xl p-4 border cursor-pointer transition-all ${selected === i ? "border-indigo-500/50" : "border-white/10 hover:border-white/20"}`}
              style={{ background: selected === i ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.04)" }}>
              <div className="flex items-start justify-between mb-2">
                <p className="font-mono text-[10px] text-indigo-300">{d.ref}</p>
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${GRAVITE_STYLE[d.gravite]}`}>{d.gravite}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUT_STYLE[d.statut]}`}>{d.statut}</span>
                </div>
              </div>
              <p className="text-sm font-bold text-white">{d.titre}</p>
              <p className="text-[10px] text-white/40 mt-1">{d.date} · {d.destinataire}</p>
              <p className="text-[10px] text-red-400 font-semibold mt-1">Préjudice : {d.montant}</p>
            </div>
          ))}
        </div>

        {/* Détail + génération */}
        <div>
          {selected !== null ? (
            <div className="rounded-2xl p-5 border border-white/10 space-y-4" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div>
                <p className="text-sm font-bold text-white mb-1">{DOSSIERS[selected].titre}</p>
                <p className="text-[10px] text-indigo-300 font-mono">{DOSSIERS[selected].ref}</p>
              </div>

              <div className="rounded-xl p-3 border border-amber-500/20" style={{ background: "rgba(245,158,11,0.08)" }}>
                <p className="text-[10px] text-amber-300 font-bold mb-1">⚖️ Qualification pénale</p>
                <p className="text-xs text-white/70">{DOSSIERS[selected].qualification}</p>
              </div>

              <div>
                <p className="text-[10px] text-white/40 font-bold mb-2">PIÈCES CONSTITUTIVES</p>
                <div className="space-y-1.5">
                  {DOSSIERS[selected].preuves.map(p => (
                    <div key={p} className="flex items-center gap-2 text-xs text-white/60">
                      <span className="text-emerald-400">✓</span>
                      <span className="font-mono text-[10px]">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-white/40 font-bold mb-2">GÉNÉRATION DU DOSSIER COMPLET</p>
                <div className="space-y-2">
                  {ETAPES_GENERATION.map((e, idx) => (
                    <div key={e.num} className={`flex items-center gap-3 text-xs transition-all ${generating && actif === idx ? "opacity-100" : actif > idx || generated ? "opacity-100" : "opacity-40"}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${generated || actif > idx ? "bg-emerald-500 text-white" : generating && actif === idx ? "bg-indigo-500 text-white animate-pulse" : "bg-white/10 text-white/40"}`}>
                        {generated || actif > idx ? "✓" : e.num}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{e.label}</p>
                        <p className="text-[9px] text-white/40">{e.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {!generated ? (
                <button onClick={generer} disabled={generating}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)" }}>
                  {generating ? "Génération en cours..." : "⚖️ Générer le dossier judiciaire"}
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl border border-emerald-500/30 text-xs text-emerald-400 font-bold text-center" style={{ background: "rgba(16,185,129,0.1)" }}>
                    ✅ Dossier complet — Prêt pour transmission
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-xl text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors">
                      Transmettre ARMP
                    </button>
                    <button className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors">
                      Transmettre Parquet
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl p-8 border border-white/10 flex items-center justify-center h-full" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-white/30 text-sm">Sélectionnez un dossier pour voir le détail et générer les documents judiciaires</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
