import { useState } from "react";

const AUDIT_LOGS = [
  { ts: "2026-06-19 08:42:11", user: "Col. Diop / ARTP", action: "Export rapport fraude Q2 2026", module: "Trafic", ip: "196.1.x.x", statut: "Autorisé" },
  { ts: "2026-06-19 07:15:38", user: "Dr. Ndiaye / DGID", action: "Consultation tableau fiscal Orange SN", module: "Fiscalité", ip: "196.2.x.x", statut: "Autorisé" },
  { ts: "2026-06-19 06:58:02", user: "Système SIGNUM", action: "Transmission alerte AML-2846 au CENTIF", module: "Mobile Money", ip: "Interne", statut: "Automatique" },
  { ts: "2026-06-18 23:41:17", user: "INCONNU", action: "Tentative accès base IMEI nationale", module: "IMEI", ip: "105.235.x.x (Extérieur)", statut: "BLOQUÉ" },
  { ts: "2026-06-18 21:12:55", user: "M. Sarr / Processingenierie", action: "Déploiement modèle ML v1.3.2", module: "IA", ip: "196.1.x.x", statut: "Autorisé" },
];

const HEBERGEMENT = [
  { composant: "Base de données IMEI nationale", lieu: "Datacenter Sonatel · Dakar", certif: "ISO 27001", souverainete: 100 },
  { composant: "Moteur IA prédictive", lieu: "Infra ARTP · Dakar", certif: "Hébergement souverain", souverainete: 100 },
  { composant: "Données trafic opérateurs", lieu: "Sondes physiques · 3 opérateurs SN", certif: "Accès direct", souverainete: 100 },
  { composant: "Base AML / CENTIF", lieu: "Datacenter BCEAO · Dakar", certif: "Secret bancaire SN", souverainete: 100 },
  { composant: "Sauvegarde & réplication", lieu: "DC secondaire · Saint-Louis", certif: "PRA national", souverainete: 100 },
];

const CONFORMITE = [
  { ref: "Loi 2008-12", nom: "Protection données personnelles SN", statut: "CONFORME", detail: "Pas de transfert de données hors Sénégal" },
  { ref: "CEDEAO 2010/C11/62", nom: "Cadre régulation télécoms CEDEAO", statut: "CONFORME", detail: "Interconnexion et partage d'informations autorisés" },
  { ref: "BCEAO AML/CFT 2018", nom: "Anti-blanchiment et financement terrorisme", statut: "CONFORME", detail: "Module AML aligné sur les directives BCEAO" },
  { ref: "UIT-T X.805", nom: "Sécurité des systèmes de communication", statut: "CONFORME", detail: "Architecture 8 couches de sécurité implémentée" },
  { ref: "GAFI R.16", nom: "Recommandation virements électroniques", statut: "EN COURS", detail: "Intégration interface CENTIF finalisée à 80%" },
];

export default function SouverainetePage() {
  const [tab, setTab] = useState<"audit" | "infra" | "conformite">("audit");

  return (
    <div className="p-6 space-y-6 min-h-screen"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0f0a2e 40%, #0a1628 100%)" }}>

      <div>
        <h1 className="text-2xl font-black text-white">Souveraineté Numérique & Audit</h1>
        <p className="text-white/40 text-sm">100% hébergé au Sénégal · Données souveraines · Traçabilité totale · Conformité légale</p>
      </div>

      {/* Badges souveraineté */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Données hébergées au Sénégal", value: "100%", color: "#10b981", icon: "🇸🇳" },
          { label: "Accès extérieurs bloqués", value: "1 ce mois", color: "#ef4444", icon: "🛡️" },
          { label: "Conformités légales validées", value: "4 / 5", color: "#6366f1", icon: "✅" },
          { label: "Uptime système SIGNUM", value: "99.97%", color: "#06b6d4", icon: "⚡" },
        ].map(k => (
          <div key={k.label} className="rounded-2xl p-4 border border-white/10"
            style={{ background: "rgba(255,255,255,0.05)" }}>
            <span className="text-2xl">{k.icon}</span>
            <p className="text-xl font-black mt-2" style={{ color: k.color }}>{k.value}</p>
            <p className="text-[10px] text-white/40 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Déclaration souveraineté */}
      <div className="rounded-2xl p-5 border border-emerald-500/30" style={{ background: "rgba(16,185,129,0.08)" }}>
        <div className="flex items-start gap-4">
          <span className="text-4xl">🇸🇳</span>
          <div>
            <p className="text-lg font-black text-white">Engagement de Souveraineté Numérique</p>
            <p className="text-sm text-white/60 mt-1 leading-relaxed">
              SIGNUM par Processingenierie garantit que <strong className="text-emerald-400">100% des données télécom sénégalaises</strong> restent hébergées sur le territoire national, sous contrôle exclusif de l'État du Sénégal via l'ARTP. Aucune donnée n'est transmise à des serveurs étrangers. Contrairement aux solutions étrangères, SIGNUM ne génère <strong className="text-emerald-400">aucune dépendance technologique externe</strong> et forme des équipes locales pour l'exploitation et la maintenance.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["audit", "infra", "conformite"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === t ? "text-white" : "text-white/40 hover:text-white/70"}`}
            style={tab === t ? { background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(6,182,212,0.3))", border: "1px solid rgba(99,102,241,0.5)" } : { border: "1px solid rgba(255,255,255,0.1)" }}>
            {t === "audit" ? "📋 Journal d'audit" : t === "infra" ? "🏗️ Infrastructure SN" : "⚖️ Conformité légale"}
          </button>
        ))}
      </div>

      {tab === "audit" && (
        <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-white">Journal d'audit immuable</p>
            <span className="text-[10px] text-indigo-300 font-semibold">Blockchain-ancré · Non-répudiable</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  {["Horodatage", "Utilisateur / Entité", "Action", "Module", "IP", "Statut"].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-white/40 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AUDIT_LOGS.map((l, i) => (
                  <tr key={i} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${l.statut === "BLOQUÉ" ? "bg-red-500/5" : ""}`}>
                    <td className="py-3 px-3 font-mono text-white/50 text-[10px]">{l.ts}</td>
                    <td className="py-3 px-3 font-semibold text-white">{l.user}</td>
                    <td className="py-3 px-3 text-white/70">{l.action}</td>
                    <td className="py-3 px-3 text-indigo-300">{l.module}</td>
                    <td className="py-3 px-3 font-mono text-white/40 text-[10px]">{l.ip}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        l.statut === "BLOQUÉ" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                        l.statut === "Automatique" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                        "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"}`}>
                        {l.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 rounded-lg text-xs font-bold bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-colors">
              Exporter audit complet
            </button>
            <button className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors">
              Rapport mensuel ARTP
            </button>
          </div>
        </div>
      )}

      {tab === "infra" && (
        <div className="space-y-3">
          {HEBERGEMENT.map(h => (
            <div key={h.composant} className="rounded-2xl p-4 border border-white/10 grid grid-cols-4 gap-4 items-center"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="col-span-2">
                <p className="text-sm font-semibold text-white">{h.composant}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{h.lieu}</p>
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {h.certif}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-emerald-400">{h.souverainete}% 🇸🇳</p>
                <p className="text-[9px] text-white/40">Souveraineté</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "conformite" && (
        <div className="space-y-3">
          {CONFORMITE.map(c => (
            <div key={c.ref} className="rounded-2xl p-4 border border-white/10"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md">{c.ref}</span>
                    <p className="text-sm font-semibold text-white">{c.nom}</p>
                  </div>
                  <p className="text-xs text-white/50">{c.detail}</p>
                </div>
                <span className={`ml-4 shrink-0 px-3 py-1 rounded-full text-xs font-bold border ${c.statut === "CONFORME" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}`}>
                  {c.statut}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Avantage final */}
      <div className="rounded-2xl p-5 border border-indigo-500/30" style={{ background: "rgba(99,102,241,0.1)" }}>
        <p className="text-sm font-bold text-indigo-300 mb-3">🏆 SIGNUM vs GVG — Bilan comparatif final</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { crit: "Hébergement données", signum: "100% Sénégal (Sonatel + ARTP)", gvg: "Serveurs hors-Sénégal (Europe/USA)" },
            { crit: "Contrat & dépendance", signum: "Propriété intégrale ARTP", gvg: "Modèle BOT 5 ans — contrat annulé ARMP" },
            { crit: "Modules couverts", signum: "7 modules (dont IA + AML + Fiscal)", gvg: "4 modules (TTMS basique)" },
            { crit: "Transfert de compétences", signum: "Formation équipes SN incluse", gvg: "Dépendance expertise étrangère" },
            { crit: "Coût estimé 5 ans", signum: "~60% moins cher", gvg: "Référence marché (base 100)" },
            { crit: "Conformité loi SN 2008-12", signum: "✅ Totalement conforme", gvg: "⚠️ Problèmes de localisation données" },
          ].map(r => (
            <div key={r.crit} className="rounded-xl p-3 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-[10px] text-white/50 mb-1">{r.crit}</p>
              <p className="text-xs text-emerald-400 font-semibold">✅ {r.signum}</p>
              <p className="text-[10px] text-white/30 mt-0.5">GVG : {r.gvg}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-xl border border-emerald-500/30" style={{ background: "rgba(16,185,129,0.08)" }}>
          <p className="text-xs text-emerald-300 font-bold">🇸🇳 SIGNUM by Processingenierie — La première solution souveraine de surveillance des réseaux et usages mobiles du Sénégal. Dépasser Global Voice Group, c'est possible.</p>
        </div>
      </div>
    </div>
  );
}
