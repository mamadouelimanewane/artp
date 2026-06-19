import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const MARQUES = [
  { marque: "Samsung", total: 3840200, conformes: 3790000, contrefaits: 42000, voles: 8200 },
  { marque: "Tecno", total: 2140000, conformes: 2090000, contrefaits: 41000, voles: 9000 },
  { marque: "iPhone", total: 980000, conformes: 978500, contrefaits: 1200, voles: 300 },
  { marque: "Infinix", total: 1420000, conformes: 1380000, contrefaits: 32000, voles: 8000 },
  { marque: "Nokia", total: 640000, conformes: 635000, contrefaits: 4200, voles: 800 },
  { marque: "Huawei", total: 820000, conformes: 810000, contrefaits: 8400, voles: 1600 },
];

const IMEI_DEMO = [
  { imei: "354123456789012", marque: "Samsung Galaxy A54", statut: "CONFORME", op: "Orange SN", region: "Dakar" },
  { imei: "869400012345678", marque: "Tecno Spark 10", statut: "CONTREFAIT", op: "Free SN", region: "Thiès" },
  { imei: "352099001234567", marque: "iPhone 14 Pro", statut: "VOLÉ", op: "Orange SN", region: "Dakar" },
  { imei: "490154203237518", marque: "Infinix Hot 30", statut: "BLOQUÉ", op: "Expresso SN", region: "Ziguinchor" },
];

const STATUT_STYLE: Record<string, string> = {
  "CONFORME": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "CONTREFAIT": "bg-red-500/20 text-red-400 border-red-500/30",
  "VOLÉ": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "BLOQUÉ": "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export default function ImeiPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<typeof IMEI_DEMO[0] | null>(null);
  const [searched, setSearched] = useState(false);

  function search() {
    setSearched(true);
    const found = IMEI_DEMO.find(d => d.imei.includes(query) || query === "");
    setResult(found || null);
  }

  return (
    <div className="p-6 space-y-6 min-h-screen"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0f0a2e 40%, #0a1628 100%)" }}>

      <div>
        <h1 className="text-2xl font-black text-white">Registre National des IMEI (RNAI)</h1>
        <p className="text-white/40 text-sm">Base nationale · 12.8 M appareils · Synchronisation GSMA · Détection contrefaçons</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Appareils conformes", value: "12 682 500", color: "#10b981", icon: "✅" },
          { label: "Contrefaçons détectées", value: "128 800", color: "#ef4444", icon: "🚫" },
          { label: "Appareils volés", value: "27 900", color: "#f59e0b", icon: "⚠️" },
          { label: "Bloqués sur réseau", value: "18 200", color: "#94a3b8", icon: "🔒" },
        ].map(k => (
          <div key={k.label} className="rounded-2xl p-4 border border-white/10"
            style={{ background: "rgba(255,255,255,0.05)" }}>
            <span className="text-2xl">{k.icon}</span>
            <p className="text-xl font-black mt-2" style={{ color: k.color }}>{k.value}</p>
            <p className="text-[10px] text-white/40 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Recherche IMEI */}
      <div className="rounded-2xl p-5 border border-cyan-500/30"
        style={{ background: "rgba(6,182,212,0.06)" }}>
        <p className="text-sm font-bold text-cyan-300 mb-3">🔍 Vérification IMEI en temps réel</p>
        <div className="flex gap-3">
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Saisir un numéro IMEI (15 chiffres)..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-500/50 font-mono" />
          <button onClick={search}
            className="px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)" }}>
            Vérifier
          </button>
        </div>

        {searched && (
          <div className="mt-4">
            {result ? (
              <div className="rounded-xl p-4 border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-white text-sm">{result.imei}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUT_STYLE[result.statut]}`}>{result.statut}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div><p className="text-white/40">Appareil</p><p className="text-white font-semibold mt-0.5">{result.marque}</p></div>
                  <div><p className="text-white/40">Opérateur</p><p className="text-white font-semibold mt-0.5">{result.op}</p></div>
                  <div><p className="text-white/40">Région</p><p className="text-white font-semibold mt-0.5">{result.region}</p></div>
                </div>
                {result.statut !== "CONFORME" && (
                  <div className="mt-3 flex gap-2">
                    <button className="px-4 py-2 rounded-lg text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors">
                      Signaler à l'ARTP
                    </button>
                    <button className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors">
                      Bloquer sur réseau
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-white/50 text-sm mt-2">IMEI non trouvé dans la base nationale. Essayez : 354123456789012, 869400012345678, 352099001234567</p>
            )}
          </div>
        )}
      </div>

      {/* Répartition par marque */}
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
          <p className="text-sm font-bold text-white mb-4">Taux de contrefaçon par marque</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MARQUES}>
              <XAxis dataKey="marque" tick={{ fill: "#64748b", fontSize: 9 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 9 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }} labelStyle={{ color: "#94a3b8" }} />
              <Bar dataKey="contrefaits" fill="#ef4444" radius={[4, 4, 0, 0]} name="Contrefaits" />
              <Bar dataKey="voles" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Volés" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
          <p className="text-sm font-bold text-white mb-4">Tableau de conformité par marque</p>
          <div className="space-y-3">
            {MARQUES.map(m => {
              const pct = ((m.conformes / m.total) * 100).toFixed(1);
              return (
                <div key={m.marque}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/70">{m.marque}</span>
                    <span className="text-xs font-bold text-emerald-400">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full">
                    <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Avantage */}
      <div className="rounded-2xl p-4 border border-indigo-500/20" style={{ background: "rgba(99,102,241,0.06)" }}>
        <p className="text-xs text-indigo-300 font-bold mb-2">🏆 SIGNUM vs GVG — Module IMEI</p>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="text-white/60">✅ <span className="text-white">API GSMA temps réel</span> synchronisée (GVG : import mensuel)</div>
          <div className="text-white/60">✅ <span className="text-white">Recherche citoyenne</span> publique intégrée (GVG : accès régulateur uniquement)</div>
          <div className="text-white/60">✅ <span className="text-white">Blocage immédiat</span> sur les 3 opérateurs simultanément (GVG : 24-48h)</div>
        </div>
      </div>
    </div>
  );
}
