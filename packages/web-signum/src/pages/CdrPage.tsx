import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";

const CDR_RECUP = [
  { op: "Orange SN", cdr_declares: 8420000, cdr_signum: 8418200, ecart: 1800, perte_fcfa: "274 M", taux: 99.98 },
  { op: "Free SN", cdr_declares: 3840000, cdr_signum: 3901400, ecart: -61400, perte_fcfa: "9.3 Mds", taux: 98.43 },
  { op: "Expresso SN", cdr_declares: 1240000, cdr_signum: 1268700, ecart: -28700, perte_fcfa: "4.1 Mds", taux: 97.74 },
];

const FUITES_7J = [
  { jour: "Lun", orange: 38, free: 890, expresso: 420 },
  { jour: "Mar", orange: 42, free: 820, expresso: 380 },
  { jour: "Mer", orange: 31, free: 960, expresso: 510 },
  { jour: "Jeu", orange: 55, free: 1040, expresso: 390 },
  { jour: "Ven", orange: 29, free: 780, expresso: 440 },
  { jour: "Sam", orange: 61, free: 1120, expresso: 480 },
  { jour: "Dim", orange: 22, free: 690, expresso: 320 },
];

const TYPES_FUITE = [
  { type: "Appels non déclarés (Grey Route interne)", vol: 48200, impact: "7.2 Mds FCFA", gravite: "CRITIQUE", op: "Free SN" },
  { type: "SMS premium non comptabilisés", vol: 12400, impact: "1.8 Mds FCFA", gravite: "ÉLEVÉ", op: "Free SN" },
  { type: "Durées d'appel tronquées (arrondies à la baisse)", vol: 8900, impact: "1.3 Mds FCFA", gravite: "ÉLEVÉ", op: "Expresso SN" },
  { type: "Trafic data non comptabilisé (off-peak)", vol: 28700, impact: "3.1 Mds FCFA", gravite: "CRITIQUE", op: "Expresso SN" },
  { type: "USSD SVA non reportés", vol: 3200, impact: "480 M FCFA", gravite: "MOYEN", op: "Orange SN" },
];

const GRAVITE: Record<string, string> = {
  "CRITIQUE": "bg-red-500/20 text-red-400 border-red-500/30",
  "ÉLEVÉ": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "MOYEN": "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default function CdrPage() {
  const [tab, setTab] = useState<"recap" | "fuites" | "reconcil">("recap");

  const totalFuite = "13.7 Mds FCFA";
  const totalEcart = CDR_RECUP.reduce((s, r) => s + Math.abs(r.ecart), 0);

  return (
    <div className="p-6 space-y-6 min-h-screen"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0f0a2e 40%, #0a1628 100%)" }}>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Moteur CDR — Réconciliation Totale</h1>
          <p className="text-white/40 text-sm">100% Call Detail Records · 3 opérateurs · Détection fuites revenus · Preuve ARMP</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-red-400 border border-red-500/30"
          style={{ background: "rgba(239,68,68,0.08)" }}>
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse inline-block" />
          {totalEcart.toLocaleString()} CDR en écart détecté
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "CDR traités aujourd'hui", value: "14.1 M", color: "#6366f1", icon: "📞" },
          { label: "Taux de couverture SIGNUM", value: "100%", color: "#10b981", icon: "✅" },
          { label: "Fuites revenus détectées (YTD)", value: totalFuite, color: "#ef4444", icon: "🔍" },
          { label: "Récupéré pour l'État (YTD)", value: "9.2 Mds FCFA", color: "#f59e0b", icon: "💰" },
        ].map(k => (
          <div key={k.label} className="rounded-2xl p-4 border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
            <span className="text-2xl">{k.icon}</span>
            <p className="text-xl font-black mt-2" style={{ color: k.color }}>{k.value}</p>
            <p className="text-[10px] text-white/40 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["recap", "fuites", "reconcil"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === t ? "text-white" : "text-white/40 hover:text-white/70"}`}
            style={tab === t ? { background: "linear-gradient(135deg,rgba(99,102,241,0.4),rgba(6,182,212,0.3))", border: "1px solid rgba(99,102,241,0.5)" } : { border: "1px solid rgba(255,255,255,0.1)" }}>
            {t === "recap" ? "📋 Récap. par opérateur" : t === "fuites" ? "⚠️ Types de fuites" : "📊 Écarts journaliers"}
          </button>
        ))}
      </div>

      {tab === "recap" && (
        <div className="space-y-4">
          {CDR_RECUP.map(r => (
            <div key={r.op} className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-black text-white text-base">{r.op}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">CDR déclarés : {r.cdr_declares.toLocaleString()} · SIGNUM détecte : {r.cdr_signum.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-black ${r.ecart < 0 ? "text-red-400" : "text-emerald-400"}`}>
                    {r.ecart < 0 ? `−${Math.abs(r.ecart).toLocaleString()}` : `+${r.ecart.toLocaleString()}`} CDR
                  </p>
                  <p className="text-[10px] text-white/40">Écart détecté</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] text-white/40 mb-1">
                    <span>Taux de concordance</span>
                    <span className={r.taux >= 99 ? "text-emerald-400" : "text-red-400"}>{r.taux}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${r.taux}%`, background: r.taux >= 99 ? "#10b981" : "#ef4444" }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-red-400">{r.perte_fcfa}</p>
                  <p className="text-[9px] text-white/40">Manque à gagner estimé</p>
                </div>
                {r.ecart < 0 && (
                  <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors shrink-0">
                    Générer PV
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="rounded-2xl p-4 border border-red-500/30" style={{ background: "rgba(239,68,68,0.08)" }}>
            <p className="text-xs text-red-300 font-bold">⚡ Ce que GVG ne peut pas faire :</p>
            <p className="text-xs text-white/60 mt-1">GVG surveille 60-70% du trafic par échantillonnage. SIGNUM traite <strong className="text-white">100% des CDR</strong> de chaque appel, SMS, et donnée. L'écart de 30-40% non couvert par GVG représente des milliards non récupérés annuellement.</p>
          </div>
        </div>
      )}

      {tab === "fuites" && (
        <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
          <p className="text-sm font-bold text-white mb-4">Catalogue des fuites de revenus détectées</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                {["Typologie de fuite", "Occurrences", "Impact financier", "Opérateur", "Gravité"].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-white/40 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TYPES_FUITE.map((f, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">{f.type}</td>
                  <td className="py-3 px-3 text-white/60">{f.vol.toLocaleString()}</td>
                  <td className="py-3 px-3 font-bold text-red-400">{f.impact}</td>
                  <td className="py-3 px-3 text-white/60">{f.op}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${GRAVITE[f.gravite]}`}>{f.gravite}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors">
              Générer dossier ARMP
            </button>
            <button className="px-4 py-2 rounded-lg text-xs font-bold bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-colors">
              Export PDF DGID
            </button>
          </div>
        </div>
      )}

      {tab === "reconcil" && (
        <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
          <p className="text-sm font-bold text-white mb-4">Écarts CDR quotidiens par opérateur (nombre d'appels manquants)</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={FUITES_7J}>
              <XAxis dataKey="jour" tick={{ fill: "#64748b", fontSize: 10 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }} labelStyle={{ color: "#94a3b8" }} />
              <Bar dataKey="orange" fill="#f97316" radius={[4,4,0,0]} name="Orange SN" />
              <Bar dataKey="free" fill="#ef4444" radius={[4,4,0,0]} name="Free SN" />
              <Bar dataKey="expresso" fill="#10b981" radius={[4,4,0,0]} name="Expresso SN" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
