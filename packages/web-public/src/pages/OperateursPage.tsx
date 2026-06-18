import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { OPERATORS, MONTHLY, THRESHOLDS, NATIONAL } from "../data/stats";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid,
} from "recharts";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const RADAR_DATA = [
  { subject: "Débit",        Orange: 9.1, Free: 6.7, Expresso: 5.4 },
  { subject: "Latence",      Orange: 8.7, Free: 7.2, Expresso: 5.8 },
  { subject: "Disponibilité",Orange: 9.7, Free: 9.5, Expresso: 9.1 },
  { subject: "Couverture",   Orange: 8.9, Free: 7.4, Expresso: 6.1 },
  { subject: "Résolution",   Orange: 9.5, Free: 9.0, Expresso: 8.7 },
  { subject: "QoS global",   Orange: 8.2, Free: 6.8, Expresso: 5.9 },
];

export default function OperateursPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <Navbar/>
      <div className="bg-gradient-to-br from-artp-900 to-artp-700 px-4 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Comparatif opérateurs</h1>
        <p className="text-artp-300 max-w-xl mx-auto">Performance réglementaire officielle — Orange · Free · Expresso — {NATIONAL.lastUpdate}</p>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-12">

        {/* Opérateur cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {OPERATORS.map(op => (
            <div key={op.name} onClick={() => setActive(active === op.short ? null : op.short)}
              className={`card p-6 cursor-pointer transition-all ${active === op.short ? "ring-2 shadow-lg" : "hover:shadow-md"}`}
              style={{ ringColor: op.color } as any}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-sm" style={{ background: op.color }}>
                  {op.short[0]}
                </div>
                <div>
                  <p className="font-black text-slate-900">{op.name}</p>
                  <p className="text-xs text-slate-400">{op.share}% de part de marché</p>
                </div>
              </div>
              <div className="text-center mb-5">
                <p className="text-4xl font-black" style={{ color: op.qos >= 7 ? "#22c55e" : op.qos >= 5 ? "#f97316" : "#ef4444" }}>{op.qos}</p>
                <p className="text-slate-400 text-sm">Score QoS /10</p>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-5">
                <div className="h-full rounded-full" style={{ width: `${op.qos * 10}%`, background: op.color }}/>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Débit",         value: `${op.download} Mbps`, ok: op.download >= THRESHOLDS.download       },
                  { label: "Latence",       value: `${op.latency} ms`,    ok: op.latency <= THRESHOLDS.latency         },
                  { label: "Disponibilité", value: `${op.availability}%`, ok: op.availability >= THRESHOLDS.availability },
                  { label: "Couverture 4G", value: `${op.coverage}%`,     ok: op.coverage >= 75                        },
                  { label: "Plaintes",      value: op.complaints.toLocaleString("fr"), ok: null },
                  { label: "Résolues",      value: op.resolved.toLocaleString("fr"),   ok: null },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span className="text-slate-400">{r.label}</span>
                    <span className={`font-semibold flex items-center gap-1 ${r.ok === true ? "text-emerald-600" : r.ok === false ? "text-red-500" : "text-slate-700"}`}>
                      {r.ok === true  && <CheckCircleIcon className="h-3.5 w-3.5"/>}
                      {r.ok === false && <ExclamationTriangleIcon className="h-3.5 w-3.5"/>}
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Radar */}
        <section className="card p-6">
          <h2 className="text-lg font-black text-slate-800 mb-1">Profil de performance global</h2>
          <p className="text-sm text-slate-400 mb-5">6 dimensions · Valeurs normalisées /10</p>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius={110}>
              <PolarGrid stroke="#f1f5f9"/>
              <PolarAngleAxis dataKey="subject" tick={{ fontSize:12 }}/>
              {OPERATORS.map(op => (
                <Radar key={op.short} name={op.short} dataKey={op.short}
                  stroke={op.color} fill={op.color} fillOpacity={0.07} strokeWidth={2.5}/>
              ))}
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12 }}/>
              <Tooltip contentStyle={{ borderRadius:10, border:"none", fontSize:12 }}/>
            </RadarChart>
          </ResponsiveContainer>
        </section>

        {/* Débit trend */}
        <section className="card p-6">
          <h2 className="text-lg font-black text-slate-800 mb-1">Évolution du débit mensuel</h2>
          <p className="text-sm text-slate-400 mb-5">Mbps — 6 derniers mois · Ligne pointillée = seuil ARTP (5 Mbps)</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="month" tick={{ fontSize:12 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:12 }} axisLine={false} tickLine={false} width={30} domain={[3,12]}/>
              <Tooltip contentStyle={{ borderRadius:10, border:"none", fontSize:12 }}/>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12 }}/>
              {OPERATORS.map(op => (
                <Line key={op.short} type="monotone" dataKey={op.short.toLowerCase()}
                  stroke={op.color} strokeWidth={2.5} dot={{ r:4, fill: op.color }}
                  name={op.short} activeDot={{ r:5 }}/>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* Conformité table */}
        <section className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50">
            <h2 className="text-lg font-black text-slate-800">Conformité aux seuils ARTP</h2>
            <p className="text-sm text-slate-400">✓ conforme · ✗ non conforme</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wide">Indicateur</th>
                  {OPERATORS.map(op => (
                    <th key={op.short} className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wide" style={{ color: op.color }}>{op.short}</th>
                  ))}
                  <th className="px-5 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wide">Seuil ARTP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { label:"Débit descendant",  key:"download",     threshold:5,   unit:"Mbps", higher:true  },
                  { label:"Latence",           key:"latency",      threshold:100, unit:"ms",   higher:false },
                  { label:"Disponibilité",     key:"availability", threshold:99,  unit:"%",    higher:true  },
                  { label:"Couverture 4G",     key:"coverage",     threshold:75,  unit:"%",    higher:true  },
                ].map(row => (
                  <tr key={row.label} className="hover:bg-slate-50/50">
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">{row.label}</td>
                    {OPERATORS.map(op => {
                      const val = op[row.key as keyof typeof op] as number;
                      const ok = row.higher ? val >= row.threshold : val <= row.threshold;
                      return (
                        <td key={op.short} className="px-5 py-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`font-black text-sm ${ok ? "text-emerald-600" : "text-red-500"}`}>{val}{row.unit}</span>
                            {ok
                              ? <CheckCircleIcon className="h-4 w-4 text-emerald-400"/>
                              : <ExclamationTriangleIcon className="h-4 w-4 text-red-400"/>}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-5 py-4 text-center text-xs text-slate-400 font-semibold">
                      {row.higher ? "≥" : "≤"} {row.threshold} {row.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
      <Footer/>
    </div>
  );
}
