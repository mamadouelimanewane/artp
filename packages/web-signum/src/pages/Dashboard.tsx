import { useState, useEffect } from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const genTrafic = () =>
  Array.from({ length: 24 }, (_, i) => ({
    h: `${String(i).padStart(2, "0")}:00`,
    voix: Math.floor(Math.random() * 40000 + 80000),
    data: Math.floor(Math.random() * 200 + 600),
    fraude: Math.floor(Math.random() * 120 + 20),
  }));

const ALERTES = [
  { id: 1, type: "CRITIQUE", msg: "SIM Box détectée — 847 appels en bypass · Orange SN", time: "il y a 2 min", color: "text-red-400", dot: "bg-red-500" },
  { id: 2, type: "ALERTE", msg: "IMEI contrefait activé — Samsung S21 clone · Free SN", time: "il y a 8 min", color: "text-amber-400", dot: "bg-amber-500" },
  { id: 3, type: "INFO", msg: "Transaction Mobile Money suspecte — 4,2M FCFA · Wave", time: "il y a 15 min", color: "text-blue-400", dot: "bg-blue-500" },
  { id: 4, type: "ALERTE", msg: "Anomalie trafic SMS international · Expresso", time: "il y a 23 min", color: "text-amber-400", dot: "bg-amber-500" },
  { id: 5, type: "INFO", msg: "Rapport QoS T2 2026 généré automatiquement", time: "il y a 41 min", color: "text-blue-400", dot: "bg-blue-500" },
  { id: 6, type: "CRITIQUE", msg: "Grey route détectée — 1 240 min de trafic perdu · Secteur Thiès", time: "il y a 1h", color: "text-red-400", dot: "bg-red-500" },
];

const SONDES = [
  { op: "Orange SN", statut: "Connectée", trafic: "2.4 Tbps", fraude: "0.3%", latence: "12 ms", color: "emerald" },
  { op: "Free SN", statut: "Connectée", trafic: "1.1 Tbps", fraude: "0.8%", latence: "18 ms", color: "emerald" },
  { op: "Expresso SN", statut: "Connectée", trafic: "0.4 Tbps", fraude: "1.2%", latence: "24 ms", color: "emerald" },
];

export default function Dashboard() {
  const [trafic] = useState(genTrafic);
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 3000); return () => clearInterval(t); }, []);

  const fraudeTotal = Math.floor(tick * 0.3 + 4820);
  const recettes = (14.7 + tick * 0.004).toFixed(1);

  return (
    <div className="p-6 space-y-6 min-h-screen"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0f0a2e 40%, #0a1628 100%)" }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Centre de Commandement</h1>
          <p className="text-white/40 text-sm mt-0.5">Surveillance temps réel · 3 opérateurs · Sénégal</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-400 border border-emerald-500/30"
            style={{ background: "rgba(16,185,129,0.08)" }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            SIGNUM LIVE
          </div>
          <div className="text-xs text-white/30 border border-white/10 px-3 py-2 rounded-xl">
            {new Date().toLocaleTimeString("fr-SN")}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "Appels surveillés / heure", value: "284 K", icon: "📞", sub: "+3.2% vs hier", c: "#6366f1" },
          { label: "Fraudes bloquées aujourd'hui", value: fraudeTotal.toLocaleString(), icon: "🚫", sub: "↓ 68% vs sem. passée", c: "#ef4444" },
          { label: "IMEI vérifiés", value: "12.8 M", icon: "📱", sub: "Base nationale synchronisée", c: "#06b6d4" },
          { label: "Transactions MM surveillées", value: "1.2 M", icon: "💳", sub: "Wave + OM + Free Money", c: "#10b981" },
          { label: "Recettes générées (Mds FCFA)", value: recettes, icon: "💰", sub: "Cumul 2026 · objectif 25 Mds", c: "#f59e0b" },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl p-4 border border-white/10"
            style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl">{k.icon}</span>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: k.c }} />
            </div>
            <p className="text-2xl font-black text-white">{k.value}</p>
            <p className="text-[10px] text-white/40 mt-1 leading-tight">{k.label}</p>
            <p className="text-[10px] mt-1 font-semibold" style={{ color: k.c }}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Graphe trafic */}
        <div className="col-span-2 rounded-2xl p-5 border border-white/10"
          style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-white">Trafic national temps réel</p>
              <p className="text-xs text-white/40">Volume voix (K appels) · Fraude détectée (occurrences)</p>
            </div>
            <span className="badge text-[10px] text-indigo-300 border border-indigo-500/30 bg-indigo-500/10">24h glissantes</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={trafic}>
              <defs>
                <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="h" tick={{ fill: "#64748b", fontSize: 9 }} />
              <YAxis yAxisId="v" tick={{ fill: "#64748b", fontSize: 9 }} />
              <YAxis yAxisId="f" orientation="right" tick={{ fill: "#64748b", fontSize: 9 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: "#94a3b8" }} />
              <Area yAxisId="v" type="monotone" dataKey="voix" stroke="#6366f1" fill="url(#gv)" strokeWidth={2} name="Voix (K)" />
              <Area yAxisId="f" type="monotone" dataKey="fraude" stroke="#ef4444" fill="url(#gf)" strokeWidth={1.5} name="Fraude" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Alertes */}
        <div className="rounded-2xl p-5 border border-white/10 flex flex-col"
          style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-white">Alertes temps réel</p>
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
              {ALERTES.filter(a => a.type === "CRITIQUE").length}
            </span>
          </div>
          <div className="space-y-3 flex-1 overflow-auto">
            {ALERTES.map((a) => (
              <div key={a.id} className="flex gap-2.5">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.dot}`} />
                <div>
                  <p className={`text-[10px] font-bold ${a.color}`}>{a.type}</p>
                  <p className="text-[11px] text-white/70 leading-tight">{a.msg}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sondes opérateurs */}
      <div className="rounded-2xl p-5 border border-white/10"
        style={{ background: "rgba(255,255,255,0.04)" }}>
        <p className="text-sm font-bold text-white mb-4">État des sondes réseau · Opérateurs</p>
        <div className="grid grid-cols-3 gap-4">
          {SONDES.map((s) => (
            <div key={s.op} className="rounded-xl p-4 border border-emerald-500/20"
              style={{ background: "rgba(16,185,129,0.06)" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-white text-sm">{s.op}</p>
                <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  {s.statut}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><p className="text-xs font-black text-white">{s.trafic}</p><p className="text-[9px] text-white/40">Trafic</p></div>
                <div><p className="text-xs font-black text-red-400">{s.fraude}</p><p className="text-[9px] text-white/40">Fraude</p></div>
                <div><p className="text-xs font-black text-cyan-400">{s.latence}</p><p className="text-[9px] text-white/40">Latence</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VS GVG */}
      <div className="rounded-2xl p-5 border border-indigo-500/30"
        style={{ background: "rgba(99,102,241,0.08)" }}>
        <p className="text-xs font-bold text-indigo-300 mb-3">SIGNUM vs Global Voice Group — Positionnement concurrentiel</p>
        <div className="grid grid-cols-4 gap-4 text-center">
          {[
            { label: "Souveraineté données", signum: "100% SN", gvg: "Hors Sénégal", win: true },
            { label: "IA prédictive intégrée", signum: "✅ LLM + ML", gvg: "❌ Non", win: true },
            { label: "Coût contrat 5 ans", signum: "60% moins cher", gvg: "Référence", win: true },
            { label: "Modules couverts", signum: "7 modules", gvg: "4 modules", win: true },
          ].map((c) => (
            <div key={c.label} className="rounded-xl p-3 border border-white/10"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-[10px] text-white/50 mb-2">{c.label}</p>
              <p className="text-xs font-black text-emerald-400">{c.signum}</p>
              <p className="text-[10px] text-white/30 mt-1">GVG : {c.gvg}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
