import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { NATIONAL, OPERATORS, MONTHLY, THRESHOLDS, REGIONS } from "../data/stats";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import {
  SignalIcon, BoltIcon, ClockIcon,
  ArrowTrendingUpIcon, ArrowTrendingDownIcon, ChevronRightIcon,
  ShieldCheckIcon, ExclamationTriangleIcon, CheckCircleIcon,
} from "@heroicons/react/24/outline";

const QOS_COLOR = (v: number) => v >= 7 ? "#22c55e" : v >= 5 ? "#f97316" : "#ef4444";
const sortedRegions = [...REGIONS].sort((a, b) => b.qos - a.qos);

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar/>

      {/* HERO */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"/>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-artp-800/40 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl"/>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
              <span className="text-sm text-blue-100 font-medium">Données officielles · {NATIONAL.lastUpdate}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
              Qualité des réseaux<br/>
              <span className="text-blue-300">mobiles au Sénégal</span>
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed mb-8 max-w-xl">
              L'ARTP publie chaque mois les indicateurs officiels de qualité de service des opérateurs Orange, Free et Expresso.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/operateurs" className="bg-white text-artp-800 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
                Comparer les opérateurs <ChevronRightIcon className="h-4 w-4"/>
              </Link>
              <Link to="/carte" className="bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
                Voir la carte
              </Link>
            </div>
          </div>
        </div>

        {/* Hero stats bar */}
        <div className="relative max-w-6xl mx-auto px-4 pb-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15 -mb-8">
            {[
              { Icon: BoltIcon,          label: "Débit moyen",   value: `${NATIONAL.avgDownload} Mbps`, ok: NATIONAL.avgDownload >= 5   },
              { Icon: ClockIcon,         label: "Latence moy.",  value: `${NATIONAL.avgLatency} ms`,    ok: NATIONAL.avgLatency <= 100   },
              { Icon: SignalIcon,        label: "Couverture 4G", value: `${NATIONAL.coverage4G}%`,      ok: NATIONAL.coverage4G >= 80    },
              { Icon: CheckCircleIcon,   label: "Taux résolution", value: `${NATIONAL.resolvedRate}%`,  ok: NATIONAL.resolvedRate >= 90  },
            ].map(({ Icon, label, value, ok }) => (
              <div key={label} className="flex items-center gap-3 p-1">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ok ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                  <Icon className={`h-5 w-5 ${ok ? "text-emerald-300" : "text-red-300"}`}/>
                </div>
                <div>
                  <p className="text-white font-black text-lg leading-none">{value}</p>
                  <p className="text-blue-300 text-xs mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 pt-16 space-y-16">

        {/* Opérateurs */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="section-title">Les opérateurs en un coup d'œil</h2>
              <p className="section-sub">Score QoS et indicateurs clés — {NATIONAL.lastUpdate}</p>
            </div>
            <Link to="/operateurs" className="text-artp-600 text-sm font-semibold hover:underline hidden md:block">Détail complet →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {OPERATORS.map(op => (
              <div key={op.name} className="card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black" style={{ background: op.color }}>
                      {op.short[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{op.short}</p>
                      <p className="text-xs text-slate-400">{op.share}% du marché</p>
                    </div>
                  </div>
                  <div className="text-2xl font-black" style={{ color: QOS_COLOR(op.qos) }}>
                    {op.qos}<span className="text-sm font-semibold text-slate-400">/10</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "Débit",         value: `${op.download} Mbps`, ok: op.download >= THRESHOLDS.download       },
                    { label: "Latence",       value: `${op.latency} ms`,    ok: op.latency  <= THRESHOLDS.latency        },
                    { label: "Disponibilité", value: `${op.availability}%`, ok: op.availability >= THRESHOLDS.availability },
                  ].map(r => (
                    <div key={r.label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{r.label}</span>
                      <span className={`font-semibold flex items-center gap-1 ${r.ok ? "text-emerald-600" : "text-red-500"}`}>
                        {r.ok ? <CheckCircleIcon className="h-3.5 w-3.5"/> : <ExclamationTriangleIcon className="h-3.5 w-3.5"/>}
                        {r.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-1 text-xs">
                  {op.trend >= 0
                    ? <ArrowTrendingUpIcon className="h-3.5 w-3.5 text-emerald-500"/>
                    : <ArrowTrendingDownIcon className="h-3.5 w-3.5 text-red-500"/>}
                  <span className={op.trend >= 0 ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>
                    {op.trend >= 0 ? "+" : ""}{op.trend} pt vs mois dernier
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card p-6">
            <h3 className="font-bold text-slate-800 mb-1">Évolution du débit national</h3>
            <p className="text-xs text-slate-400 mb-4">Débit descendant moyen (Mbps) — 6 derniers mois</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={MONTHLY}>
                <defs>
                  <linearGradient id="gDown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize:11 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:11 }} axisLine={false} tickLine={false} width={30} domain={[4,12]}/>
                <Tooltip contentStyle={{ borderRadius:10, border:"none", boxShadow:"0 4px 20px rgba(0,0,0,0.08)", fontSize:12 }}/>
                <Area type="monotone" dataKey="download" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gDown)" name="Débit (Mbps)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-slate-800 mb-1">Débit par opérateur</h3>
            <p className="text-xs text-slate-400 mb-4">Comparaison mensuelle (Mbps)</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MONTHLY} barGap={3} barSize={10}>
                <XAxis dataKey="month" tick={{ fontSize:11 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:11 }} axisLine={false} tickLine={false} width={25}/>
                <Tooltip contentStyle={{ borderRadius:10, border:"none", fontSize:12 }}/>
                <Bar dataKey="orange"   fill="#f97316" radius={[3,3,0,0]} name="Orange"/>
                <Bar dataKey="free"     fill="#6366f1" radius={[3,3,0,0]} name="Free"/>
                <Bar dataKey="expresso" fill="#ef4444" radius={[3,3,0,0]} name="Expresso"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Régions */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="section-title">Régions du Sénégal</h2>
              <p className="section-sub">Classement par score QoS · {NATIONAL.lastUpdate}</p>
            </div>
            <Link to="/carte" className="text-artp-600 text-sm font-semibold hover:underline hidden md:block">Voir la carte →</Link>
          </div>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["#","Région","Score QoS","Débit moyen","Latence","Couverture 4G","Plaintes"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sortedRegions.map((r, i) => (
                    <tr key={r.name} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 text-sm font-black text-slate-300">{i + 1}</td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-800">{r.name}</td>
                      <td className="px-4 py-3 text-sm font-black" style={{ color: QOS_COLOR(r.qos) }}>{r.qos}/10</td>
                      <td className="px-4 py-3 text-sm font-semibold" style={{ color: r.download >= THRESHOLDS.download ? "#16a34a" : "#dc2626" }}>{r.download} Mbps</td>
                      <td className="px-4 py-3 text-sm font-semibold" style={{ color: r.latency <= THRESHOLDS.latency ? "#16a34a" : "#dc2626" }}>{r.latency} ms</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{r.coverage}%</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{r.complaints.toLocaleString("fr")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-artp-800 to-artp-600 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden mb-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,255,255,0.05),transparent)]"/>
          <div className="relative">
            <ShieldCheckIcon className="h-12 w-12 text-artp-300 mx-auto mb-4"/>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Vous avez un problème réseau ?</h2>
            <p className="text-artp-200 mb-6 max-w-md mx-auto">Déposez une plainte auprès de l'ARTP. Nos équipes traitent chaque signalement sous 15 jours ouvrés.</p>
            <a href="https://www.artp.sn" target="_blank" rel="noreferrer"
              className="bg-white text-artp-800 font-bold px-8 py-3 rounded-xl hover:bg-artp-50 transition-colors inline-flex items-center gap-2">
              Déposer une plainte <ChevronRightIcon className="h-4 w-4"/>
            </a>
          </div>
        </section>

      </main>
      <Footer/>
    </div>
  );
}
