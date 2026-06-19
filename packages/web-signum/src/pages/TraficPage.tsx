import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const TRAFIC_SEMAINE = [
  { jour: "Lun", orange: 840, free: 420, expresso: 180, fraude: 32 },
  { jour: "Mar", orange: 920, free: 450, expresso: 190, fraude: 28 },
  { jour: "Mer", orange: 780, free: 380, expresso: 160, fraude: 45 },
  { jour: "Jeu", orange: 1050, free: 510, expresso: 210, fraude: 19 },
  { jour: "Ven", orange: 1180, free: 580, expresso: 240, fraude: 22 },
  { jour: "Sam", orange: 960, free: 470, expresso: 200, fraude: 38 },
  { jour: "Dim", orange: 720, free: 350, expresso: 140, fraude: 15 },
];

const FRAUDES = [
  { type: "SIM Box / Bypass", count: 1847, perte: "284 M FCFA", gravite: "CRITIQUE", tendance: "↑ +12%" },
  { type: "Grey Routes", count: 634, perte: "97 M FCFA", gravite: "ÉLEVÉ", tendance: "↓ -8%" },
  { type: "Wangiri (Rappel automatique)", count: 2340, perte: "18 M FCFA", gravite: "MOYEN", tendance: "↑ +3%" },
  { type: "IRSF (Fraud Revenue Sharing)", count: 128, perte: "456 M FCFA", gravite: "CRITIQUE", tendance: "↓ -22%" },
  { type: "SMS Spoofing", count: 4820, perte: "9 M FCFA", gravite: "FAIBLE", tendance: "↑ +45%" },
  { type: "SIM Cloning", count: 47, perte: "12 M FCFA", gravite: "ÉLEVÉ", tendance: "↓ -5%" },
];

const PIE_DATA = [
  { name: "Trafic légitime", value: 97.2, color: "#10b981" },
  { name: "Fraude détectée", value: 1.8, color: "#ef4444" },
  { name: "Suspect", value: 1.0, color: "#f59e0b" },
];

const GRAVITE: Record<string, string> = {
  "CRITIQUE": "bg-red-500/20 text-red-400 border-red-500/30",
  "ÉLEVÉ": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "MOYEN": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "FAIBLE": "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export default function TraficPage() {
  const [selectedFraude, setSelectedFraude] = useState<number | null>(null);

  return (
    <div className="p-6 space-y-6 min-h-screen"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0f0a2e 40%, #0a1628 100%)" }}>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Surveillance du Trafic Télécom</h1>
          <p className="text-white/40 text-sm">Détection fraude internationale · Grey routes · SIM Box · Bypass</p>
        </div>
        <div className="flex gap-2">
          {["7J", "30J", "90J"].map(p => (
            <button key={p} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all">
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Volume trafic total (7j)", value: "84.3 Mds min", icon: "📞", color: "#6366f1" },
          { label: "Fraude bloquée (7j)", value: "9 814 cas", icon: "🚫", color: "#ef4444" },
          { label: "Pertes évitées", value: "876 M FCFA", icon: "💰", color: "#10b981" },
          { label: "Taux de fraude résiduel", value: "0.42%", icon: "📉", color: "#f59e0b" },
        ].map(k => (
          <div key={k.label} className="rounded-2xl p-4 border border-white/10"
            style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2 mb-2">
              <span>{k.icon}</span>
              <span className="text-[10px] text-white/40">{k.label}</span>
            </div>
            <p className="text-xl font-black" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Volume par opérateur */}
        <div className="col-span-2 rounded-2xl p-5 border border-white/10"
          style={{ background: "rgba(255,255,255,0.04)" }}>
          <p className="text-sm font-bold text-white mb-4">Volume trafic par opérateur (M minutes)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={TRAFIC_SEMAINE}>
              <XAxis dataKey="jour" tick={{ fill: "#64748b", fontSize: 10 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: "#94a3b8" }} />
              <Bar dataKey="orange" fill="#f97316" radius={[4, 4, 0, 0]} name="Orange" />
              <Bar dataKey="free" fill="#ef4444" radius={[4, 4, 0, 0]} name="Free" />
              <Bar dataKey="expresso" fill="#10b981" radius={[4, 4, 0, 0]} name="Expresso" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition trafic */}
        <div className="rounded-2xl p-5 border border-white/10"
          style={{ background: "rgba(255,255,255,0.04)" }}>
          <p className="text-sm font-bold text-white mb-4">Qualité du trafic</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`]} contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {PIE_DATA.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
                <span className="text-[10px] text-white/60 flex-1">{d.name}</span>
                <span className="text-[10px] font-bold text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Types de fraude */}
      <div className="rounded-2xl p-5 border border-white/10"
        style={{ background: "rgba(255,255,255,0.04)" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-white">Catalogue des fraudes détectées</p>
          <span className="text-[10px] text-white/40">SIGNUM Intelligence Engine v1.0</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                {["Type de fraude", "Occurrences (7j)", "Pertes estimées", "Gravité", "Tendance", "Action"].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-white/40 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FRAUDES.map((f, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedFraude(selectedFraude === i ? null : i)}>
                  <td className="py-3 px-3 font-semibold text-white">{f.type}</td>
                  <td className="py-3 px-3 text-white/70">{f.count.toLocaleString()}</td>
                  <td className="py-3 px-3 text-red-400 font-semibold">{f.perte}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${GRAVITE[f.gravite]}`}>{f.gravite}</span>
                  </td>
                  <td className={`py-3 px-3 font-semibold text-xs ${f.tendance.startsWith("↑") ? "text-red-400" : "text-emerald-400"}`}>{f.tendance}</td>
                  <td className="py-3 px-3">
                    <button className="px-2 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors">
                      Bloquer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Avantage vs GVG */}
      <div className="rounded-2xl p-4 border border-indigo-500/20" style={{ background: "rgba(99,102,241,0.06)" }}>
        <p className="text-xs text-indigo-300 font-bold mb-2">🏆 SIGNUM vs GVG — Module Surveillance Trafic</p>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="text-white/60">✅ <span className="text-white">6 types de fraude</span> détectés (GVG : 3)</div>
          <div className="text-white/60">✅ <span className="text-white">IA prédictive</span> intégrée (GVG : règles statiques)</div>
          <div className="text-white/60">✅ <span className="text-white">Données 100% Sénégal</span> (GVG : traitement externe)</div>
        </div>
      </div>
    </div>
  );
}
