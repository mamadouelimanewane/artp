import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const RECETTES_MENSUEL = [
  { mois: "Jan", taxe_appels: 2.1, taxe_sms: 0.8, redev_spectre: 1.2, taxe_mm: 0.6 },
  { mois: "Fév", taxe_appels: 2.3, taxe_sms: 0.85, redev_spectre: 1.2, taxe_mm: 0.72 },
  { mois: "Mar", taxe_appels: 2.0, taxe_sms: 0.79, redev_spectre: 1.2, taxe_mm: 0.85 },
  { mois: "Avr", taxe_appels: 2.5, taxe_sms: 0.92, redev_spectre: 1.5, taxe_mm: 0.91 },
  { mois: "Mai", taxe_appels: 2.4, taxe_sms: 0.88, redev_spectre: 1.5, taxe_mm: 1.02 },
  { mois: "Jun", taxe_appels: 2.7, taxe_sms: 0.95, redev_spectre: 1.5, taxe_mm: 1.18 },
];

const OPERATEURS_FISCAL = [
  { op: "Orange SN", ca: "284 Mds", taxe_due: "42.6 Mds", taxe_versee: "42.6 Mds", ecart: "0", statut: "CONFORME" },
  { op: "Free SN", ca: "128 Mds", taxe_due: "19.2 Mds", taxe_versee: "17.8 Mds", ecart: "-1.4 Mds", statut: "RETARD" },
  { op: "Expresso SN", ca: "47 Mds", taxe_due: "7.05 Mds", taxe_versee: "7.05 Mds", ecart: "0", statut: "CONFORME" },
  { op: "Wave SN", ca: "210 Mds", taxe_due: "31.5 Mds", taxe_versee: "29.8 Mds", ecart: "-1.7 Mds", statut: "RETARD" },
];

const TAXES = [
  { type: "Taxe sur les appels locaux", taux: "3%", base: "CA voix", collecte_ytd: "14.8 Mds FCFA" },
  { type: "Taxe sur les SMS", taux: "5%", base: "CA SMS", collecte_ytd: "5.3 Mds FCFA" },
  { type: "Redevance spectre radioélectrique", taux: "Forfait/MHz", base: "Bandes attribuées", collecte_ytd: "8.4 Mds FCFA" },
  { type: "Taxe sur transactions Mobile Money", taux: "0.5%", base: "Volume transactions", collecte_ytd: "5.68 Mds FCFA" },
  { type: "Droit d'entrée marché", taux: "Forfait", base: "Licence octroyée", collecte_ytd: "2.0 Mds FCFA" },
];

export default function FiscalitePage() {
  const [tab, setTab] = useState<"tableau" | "recettes" | "taxes">("tableau");

  return (
    <div className="p-6 space-y-6 min-h-screen"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0f0a2e 40%, #0a1628 100%)" }}>

      <div>
        <h1 className="text-2xl font-black text-white">Gouvernance Fiscale Télécom</h1>
        <p className="text-white/40 text-sm">Contrôle recettes · Taxes sectorielles · Redevances spectre · Conformité DGID</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Recettes collectées (YTD)", value: "36.2 Mds FCFA", color: "#10b981", icon: "💰" },
          { label: "Objectif annuel 2026", value: "68 Mds FCFA", color: "#6366f1", icon: "🎯" },
          { label: "Taux de recouvrement", value: "89.4%", color: "#f59e0b", icon: "📊" },
          { label: "Impayés détectés", value: "3.1 Mds FCFA", color: "#ef4444", icon: "⚠️" },
        ].map(k => (
          <div key={k.label} className="rounded-2xl p-4 border border-white/10"
            style={{ background: "rgba(255,255,255,0.05)" }}>
            <span className="text-2xl">{k.icon}</span>
            <p className="text-xl font-black mt-2" style={{ color: k.color }}>{k.value}</p>
            <p className="text-[10px] text-white/40 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Progression objectif */}
      <div className="rounded-2xl p-4 border border-emerald-500/20" style={{ background: "rgba(16,185,129,0.06)" }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-white">Progression vers l'objectif 2026</p>
          <p className="text-xs font-bold text-emerald-400">36.2 / 68 Mds FCFA · 53.2%</p>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div className="h-3 rounded-full transition-all" style={{ width: "53.2%", background: "linear-gradient(90deg, #10b981, #06b6d4)" }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["tableau", "recettes", "taxes"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === t ? "text-white" : "text-white/40 hover:text-white/70"}`}
            style={tab === t ? { background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(6,182,212,0.3))", border: "1px solid rgba(99,102,241,0.5)" } : { border: "1px solid rgba(255,255,255,0.1)" }}>
            {t === "tableau" ? "📋 Conformité opérateurs" : t === "recettes" ? "📈 Évolution recettes" : "🏷️ Barème des taxes"}
          </button>
        ))}
      </div>

      {tab === "tableau" && (
        <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
          <p className="text-sm font-bold text-white mb-4">Tableau de conformité fiscale par opérateur</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  {["Opérateur", "CA déclaré", "Taxe due", "Taxe versée", "Écart", "Statut"].map(h => (
                    <th key={h} className="text-left py-2 px-4 text-white/40 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {OPERATEURS_FISCAL.map((o) => (
                  <tr key={o.op} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{o.op}</td>
                    <td className="py-3 px-4 text-white/70">{o.ca}</td>
                    <td className="py-3 px-4 text-white/70">{o.taxe_due}</td>
                    <td className="py-3 px-4 font-semibold text-white">{o.taxe_versee}</td>
                    <td className={`py-3 px-4 font-bold ${o.ecart === "0" ? "text-emerald-400" : "text-red-400"}`}>{o.ecart === "0" ? "—" : o.ecart}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${o.statut === "CONFORME" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}`}>
                        {o.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors">
              Émettre mise en demeure
            </button>
            <button className="px-4 py-2 rounded-lg text-xs font-bold bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-colors">
              Rapport DGID
            </button>
          </div>
        </div>
      )}

      {tab === "recettes" && (
        <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
          <p className="text-sm font-bold text-white mb-4">Recettes par type de taxe (Mds FCFA / mois)</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={RECETTES_MENSUEL}>
              <XAxis dataKey="mois" tick={{ fill: "#64748b", fontSize: 10 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }} labelStyle={{ color: "#94a3b8" }} />
              <Bar dataKey="taxe_appels" stackId="a" fill="#6366f1" name="Taxe appels" />
              <Bar dataKey="taxe_sms" stackId="a" fill="#06b6d4" name="Taxe SMS" />
              <Bar dataKey="redev_spectre" stackId="a" fill="#10b981" name="Redevance spectre" />
              <Bar dataKey="taxe_mm" stackId="a" fill="#f59e0b" name="Taxe Mobile Money" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === "taxes" && (
        <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
          <p className="text-sm font-bold text-white mb-4">Barème fiscal sectoriel 2026</p>
          <div className="space-y-3">
            {TAXES.map(t => (
              <div key={t.type} className="rounded-xl p-4 border border-white/10 grid grid-cols-4 gap-4 items-center"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-white">{t.type}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">Base : {t.base}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-indigo-300">{t.taux}</p>
                  <p className="text-[9px] text-white/40">Taux</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-400">{t.collecte_ytd}</p>
                  <p className="text-[9px] text-white/40">Collecté YTD</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl p-4 border border-indigo-500/20" style={{ background: "rgba(99,102,241,0.06)" }}>
        <p className="text-xs text-indigo-300 font-bold mb-2">🏆 SIGNUM vs GVG — Module Gouvernance Fiscale</p>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="text-white/60">✅ <span className="text-white">Interface DGID/DGI</span> directe (GVG : exports CSV manuels)</div>
          <div className="text-white/60">✅ <span className="text-white">Croisement CA vs taxes</span> automatisé (GVG : déclaratif)</div>
          <div className="text-white/60">✅ <span className="text-white">Alertes impayés</span> temps réel (GVG : audit annuel)</div>
        </div>
      </div>
    </div>
  );
}
