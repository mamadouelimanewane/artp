import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const OTT_EVOLUTION = [
  { mois: "Jan", voix_trad: 2840, whatsapp: 1240, data_ott: 4820, sms_trad: 980, sms_ott: 2100 },
  { mois: "Fév", voix_trad: 2720, whatsapp: 1380, data_ott: 5140, sms_trad: 920, sms_ott: 2340 },
  { mois: "Mar", voix_trad: 2610, whatsapp: 1520, data_ott: 5480, sms_trad: 840, sms_ott: 2580 },
  { mois: "Avr", voix_trad: 2490, whatsapp: 1680, data_ott: 5820, sms_trad: 780, sms_ott: 2820 },
  { mois: "Mai", voix_trad: 2380, whatsapp: 1840, data_ott: 6140, sms_trad: 710, sms_ott: 3040 },
  { mois: "Jun", voix_trad: 2240, whatsapp: 2020, data_ott: 6520, sms_trad: 640, sms_ott: 3280 },
];

const OTT_APPS = [
  { app: "WhatsApp", color: "#25d366", part: 38.4, appels_M: 2020, msgs_M: 3280, impact_fiscal: "18.2 Mds FCFA/an" },
  { app: "TikTok", color: "#ff0050", part: 22.1, appels_M: 0, msgs_M: 0, impact_fiscal: "8.4 Mds FCFA/an" },
  { app: "YouTube", color: "#ff0000", part: 18.8, appels_M: 0, msgs_M: 0, impact_fiscal: "7.1 Mds FCFA/an" },
  { app: "Facebook", color: "#1877f2", part: 11.2, appels_M: 0, msgs_M: 840, impact_fiscal: "4.2 Mds FCFA/an" },
  { app: "Telegram", color: "#2ca5e0", part: 5.8, appels_M: 180, msgs_M: 620, impact_fiscal: "2.2 Mds FCFA/an" },
  { app: "Autres OTT", color: "#64748b", part: 3.7, appels_M: 120, msgs_M: 410, impact_fiscal: "1.4 Mds FCFA/an" },
];

const SCENARIOS_REDEV = [
  { scenario: "Taxe OTT 1% CA local", recette_annuelle: "4.2 Mds FCFA", faisabilite: "ÉLEVÉE", precedent: "Ouganda, Tanzanie" },
  { scenario: "Redevance data OTT (0.02 FCFA/MB)", recette_annuelle: "8.8 Mds FCFA", faisabilite: "MOYENNE", precedent: "Kenya (proposition 2025)" },
  { scenario: "Taxe interopérabilité OTT", recette_annuelle: "12.4 Mds FCFA", faisabilite: "FAIBLE", precedent: "Union Européenne (DMA)" },
  { scenario: "Partage revenus pub géolocalisée", recette_annuelle: "6.1 Mds FCFA", faisabilite: "MOYENNE", precedent: "Nigeria (en discussion)" },
];

export default function OttPage() {
  const [tab, setTab] = useState<"impact" | "apps" | "scenarios">("impact");

  return (
    <div className="p-6 space-y-6 min-h-screen"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0f0a2e 40%, #0a1628 100%)" }}>

      <div>
        <h1 className="text-2xl font-black text-white">OTT Monitor — Impact WhatsApp & Économie Numérique</h1>
        <p className="text-white/40 text-sm">Trafic OTT vs voix traditionnelle · Impact fiscal · Scénarios redevance · Prospective 2027-2030</p>
      </div>

      <div className="rounded-2xl p-4 border border-orange-500/30" style={{ background: "rgba(249,115,22,0.07)" }}>
        <p className="text-xs font-bold text-orange-300 mb-1">🌐 Pourquoi GVG ne voit pas ça</p>
        <p className="text-xs text-white/60">GVG est une technologie conçue pour surveiller les réseaux 2G/3G de 2010. WhatsApp, TikTok et YouTube transitent par la couche data des opérateurs — GVG n'a <strong className="text-white">aucun module pour mesurer ce trafic OTT</strong>. SIGNUM, via les sondes DPI (Deep Packet Inspection) installées chez les opérateurs, peut mesurer <strong className="text-white">application par application</strong> le volume et l'impact fiscal.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Part OTT dans le trafic voix", value: "47.4%", color: "#f97316", icon: "📱" },
          { label: "Manque à gagner fiscal / an", value: "41.5 Mds FCFA", color: "#ef4444", icon: "💸" },
          { label: "Croissance OTT (6 mois)", value: "+63%", color: "#f59e0b", icon: "📈" },
          { label: "Scénarios redevance proposés", value: "4", color: "#6366f1", icon: "⚖️" },
        ].map(k => (
          <div key={k.label} className="rounded-2xl p-4 border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
            <span className="text-2xl">{k.icon}</span>
            <p className="text-xl font-black mt-2" style={{ color: k.color }}>{k.value}</p>
            <p className="text-[10px] text-white/40 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["impact", "apps", "scenarios"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === t ? "text-white" : "text-white/40 hover:text-white/70"}`}
            style={tab === t ? { background: "linear-gradient(135deg,rgba(99,102,241,0.4),rgba(6,182,212,0.3))", border: "1px solid rgba(99,102,241,0.5)" } : { border: "1px solid rgba(255,255,255,0.1)" }}>
            {t === "impact" ? "📊 OTT vs Traditionnel" : t === "apps" ? "📱 Par application" : "💡 Scénarios redevance"}
          </button>
        ))}
      </div>

      {tab === "impact" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
            <p className="text-sm font-bold text-white mb-4">Voix traditionnelle vs WhatsApp (M minutes/mois)</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={OTT_EVOLUTION}>
                <defs>
                  <linearGradient id="gv2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gw" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#25d366" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#25d366" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="mois" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }} labelStyle={{ color: "#94a3b8" }} />
                <Area type="monotone" dataKey="voix_trad" stroke="#6366f1" fill="url(#gv2)" strokeWidth={2} name="Voix traditionnelle" />
                <Area type="monotone" dataKey="whatsapp" stroke="#25d366" fill="url(#gw)" strokeWidth={2} name="Appels WhatsApp" />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-amber-400 mt-2 font-semibold">⚠️ Tendance : WhatsApp dépasse la voix traditionnelle d'ici mi-2027</p>
          </div>

          <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
            <p className="text-sm font-bold text-white mb-4">SMS traditionnel vs OTT (M messages/mois)</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={OTT_EVOLUTION}>
                <XAxis dataKey="mois" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }} labelStyle={{ color: "#94a3b8" }} />
                <Bar dataKey="sms_trad" fill="#6366f1" radius={[4,4,0,0]} name="SMS traditionnel" />
                <Bar dataKey="sms_ott" fill="#25d366" radius={[4,4,0,0]} name="Messages OTT" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "apps" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
            <p className="text-sm font-bold text-white mb-4">Répartition trafic OTT par application</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={OTT_APPS} cx="50%" cy="50%" outerRadius={80} dataKey="part">
                  {OTT_APPS.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`]} contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {OTT_APPS.map(a => (
                <div key={a.app} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: a.color }} />
                  <span className="text-white/60">{a.app}</span>
                  <span className="font-bold text-white ml-auto">{a.part}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
            <p className="text-sm font-bold text-white mb-4">Impact fiscal par application (estimé / an)</p>
            <div className="space-y-3">
              {OTT_APPS.map(a => (
                <div key={a.app} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ background: a.color }} />
                  <span className="text-xs text-white/70 flex-1">{a.app}</span>
                  <span className="text-xs font-bold text-red-400">{a.impact_fiscal}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-white/10 flex justify-between">
                <span className="text-xs font-bold text-white">Total manque à gagner</span>
                <span className="text-xs font-black text-red-400">41.5 Mds FCFA/an</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "scenarios" && (
        <div className="space-y-3">
          {SCENARIOS_REDEV.map(s => (
            <div key={s.scenario} className="rounded-2xl p-5 border border-white/10 grid grid-cols-4 gap-4 items-center"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="col-span-2">
                <p className="text-sm font-semibold text-white">{s.scenario}</p>
                <p className="text-[10px] text-indigo-300 mt-0.5">Précédent : {s.precedent}</p>
              </div>
              <div>
                <p className="text-sm font-black text-emerald-400">{s.recette_annuelle}</p>
                <p className="text-[9px] text-white/40">Recette estimée / an</p>
              </div>
              <div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${s.faisabilite === "ÉLEVÉE" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : s.faisabilite === "MOYENNE" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-slate-500/20 text-slate-400 border-slate-500/30"}`}>
                  Faisabilité {s.faisabilite}
                </span>
              </div>
            </div>
          ))}
          <div className="rounded-2xl p-4 border border-indigo-500/20" style={{ background: "rgba(99,102,241,0.06)" }}>
            <p className="text-xs text-indigo-300 font-bold">💡 Recommandation SIGNUM pour l'ARTP</p>
            <p className="text-xs text-white/60 mt-1">Commencer par la <strong className="text-white">Taxe OTT 1% CA local</strong> (scénario 1) — la plus simple à défendre juridiquement et déjà appliquée en Ouganda et Tanzanie. Projeter un gain de <strong className="text-white">4.2 Mds FCFA/an</strong> dès 2027, en montant en puissance vers le scénario 2 (8.8 Mds). Ce dossier, produit automatiquement par SIGNUM, est prêt pour présentation au Ministre de l'Économie Numérique.</p>
          </div>
        </div>
      )}
    </div>
  );
}
