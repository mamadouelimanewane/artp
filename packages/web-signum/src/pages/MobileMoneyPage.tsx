import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const EVOL_MM = [
  { mois: "Jan", wave: 420, om: 380, free: 120, suspect: 8 },
  { mois: "Fév", wave: 445, om: 395, free: 134, suspect: 12 },
  { mois: "Mar", wave: 478, om: 410, free: 148, suspect: 6 },
  { mois: "Avr", wave: 510, om: 422, free: 162, suspect: 15 },
  { mois: "Mai", wave: 540, om: 440, free: 178, suspect: 9 },
  { mois: "Jun", wave: 568, om: 458, free: 190, suspect: 21 },
];

const ALERTES_AML = [
  { id: "AML-2847", montant: "4 200 000 FCFA", type: "Fractionnement suspect", acteur: "Wave", region: "Dakar", risque: "ÉLEVÉ", statut: "En cours" },
  { id: "AML-2846", montant: "12 800 000 FCFA", type: "Transaction hors profil", acteur: "Orange Money", region: "Thiès", risque: "CRITIQUE", statut: "Bloqué" },
  { id: "AML-2844", montant: "890 000 FCFA", type: "Multiplication de comptes", acteur: "Free Money", region: "Ziguinchor", risque: "MOYEN", statut: "Analysé" },
  { id: "AML-2840", montant: "67 000 000 FCFA", type: "Virement transfrontalier atypique", acteur: "Wave", region: "Saint-Louis", risque: "CRITIQUE", statut: "Transmis DPJ" },
  { id: "AML-2835", montant: "2 100 000 FCFA", type: "Fréquence anormale", acteur: "Orange Money", region: "Kaolack", risque: "ÉLEVÉ", statut: "En cours" },
];

const RISQUE_STYLE: Record<string, string> = {
  "CRITIQUE": "bg-red-500/20 text-red-400 border-red-500/30",
  "ÉLEVÉ": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "MOYEN": "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const ACTEURS = [
  { nom: "Wave", comptes: "8.2M", vol_mois: "1 240 Mds", risque: "2.1%", color: "#06b6d4" },
  { nom: "Orange Money", comptes: "6.4M", vol_mois: "980 Mds", risque: "1.4%", color: "#f97316" },
  { nom: "Free Money", comptes: "2.1M", vol_mois: "310 Mds", risque: "3.8%", color: "#ef4444" },
];

export default function MobileMoneyPage() {
  const [tab, setTab] = useState<"aml" | "stats" | "acteurs">("aml");

  return (
    <div className="p-6 space-y-6 min-h-screen"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0f0a2e 40%, #0a1628 100%)" }}>

      <div>
        <h1 className="text-2xl font-black text-white">Mobile Money & Anti-Blanchiment (AML)</h1>
        <p className="text-white/40 text-sm">Wave · Orange Money · Free Money · Surveillance BCEAO · Conformité GAFI</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Transactions surveillées / jour", value: "4.2 M", color: "#6366f1", icon: "💳" },
          { label: "Alertes AML actives", value: "127", color: "#ef4444", icon: "🚨" },
          { label: "Volume Mobile Money (mois)", value: "2 530 Mds FCFA", color: "#10b981", icon: "💰" },
          { label: "Cas transmis CENTIF", value: "23", color: "#f59e0b", icon: "📋" },
        ].map(k => (
          <div key={k.label} className="rounded-2xl p-4 border border-white/10"
            style={{ background: "rgba(255,255,255,0.05)" }}>
            <span className="text-2xl">{k.icon}</span>
            <p className="text-xl font-black mt-2" style={{ color: k.color }}>{k.value}</p>
            <p className="text-[10px] text-white/40 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["aml", "stats", "acteurs"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === t ? "text-white" : "text-white/40 hover:text-white/70"}`}
            style={tab === t ? { background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(6,182,212,0.3))", border: "1px solid rgba(99,102,241,0.5)" } : { border: "1px solid rgba(255,255,255,0.1)" }}>
            {t === "aml" ? "🚨 Alertes AML" : t === "stats" ? "📊 Évolution volumes" : "🏛️ Acteurs agréés"}
          </button>
        ))}
      </div>

      {tab === "aml" && (
        <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-white">Alertes Anti-Blanchiment actives</p>
            <span className="text-[10px] text-red-400 font-bold">● LIVE · Moteur AML SIGNUM v1.0</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  {["Référence", "Montant", "Typologie", "Acteur", "Région", "Risque", "Statut"].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-white/40 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALERTES_AML.map((a) => (
                  <tr key={a.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-mono text-indigo-300">{a.id}</td>
                    <td className="py-3 px-3 font-bold text-white">{a.montant}</td>
                    <td className="py-3 px-3 text-white/70">{a.type}</td>
                    <td className="py-3 px-3 text-white/70">{a.acteur}</td>
                    <td className="py-3 px-3 text-white/70">{a.region}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${RISQUE_STYLE[a.risque]}`}>{a.risque}</span>
                    </td>
                    <td className="py-3 px-3 text-white/60">{a.statut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors">
              Transmettre au CENTIF
            </button>
            <button className="px-4 py-2 rounded-lg text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors">
              Geler comptes CRITIQUE
            </button>
            <button className="px-4 py-2 rounded-lg text-xs font-bold bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-colors">
              Exporter rapport GAFI
            </button>
          </div>
        </div>
      )}

      {tab === "stats" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
            <p className="text-sm font-bold text-white mb-4">Volume transactions (Mds FCFA / mois)</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={EVOL_MM}>
                <XAxis dataKey="mois" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }} labelStyle={{ color: "#94a3b8" }} />
                <Line type="monotone" dataKey="wave" stroke="#06b6d4" strokeWidth={2} dot={false} name="Wave" />
                <Line type="monotone" dataKey="om" stroke="#f97316" strokeWidth={2} dot={false} name="Orange Money" />
                <Line type="monotone" dataKey="free" stroke="#ef4444" strokeWidth={2} dot={false} name="Free Money" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
            <p className="text-sm font-bold text-white mb-4">Transactions suspectes détectées (K)</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={EVOL_MM}>
                <XAxis dataKey="mois" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }} labelStyle={{ color: "#94a3b8" }} />
                <Bar dataKey="suspect" fill="#ef4444" radius={[4, 4, 0, 0]} name="Suspect (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "acteurs" && (
        <div className="space-y-4">
          {ACTEURS.map(a => (
            <div key={a.nom} className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black text-white"
                    style={{ background: a.color }}>
                    {a.nom[0]}
                  </div>
                  <div>
                    <p className="font-bold text-white">{a.nom}</p>
                    <p className="text-[10px] text-white/40">Agréé BCEAO · Conforme GAFI</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 text-right">
                  <div><p className="text-sm font-black text-white">{a.comptes}</p><p className="text-[9px] text-white/40">Comptes actifs</p></div>
                  <div><p className="text-sm font-black text-white">{a.vol_mois}</p><p className="text-[9px] text-white/40">Volume / mois</p></div>
                  <div><p className="text-sm font-black text-red-400">{a.risque}</p><p className="text-[9px] text-white/40">Taux risque AML</p></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl p-4 border border-indigo-500/20" style={{ background: "rgba(99,102,241,0.06)" }}>
        <p className="text-xs text-indigo-300 font-bold mb-2">🏆 SIGNUM vs GVG — Module Mobile Money</p>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="text-white/60">✅ <span className="text-white">Moteur AML embarqué</span> (GVG : pas de module dédié)</div>
          <div className="text-white/60">✅ <span className="text-white">Interface CENTIF</span> automatisée (GVG : rapport manuel)</div>
          <div className="text-white/60">✅ <span className="text-white">Couverture 3 acteurs</span> Wave + OM + Free (GVG : OM uniquement)</div>
        </div>
      </div>
    </div>
  );
}
