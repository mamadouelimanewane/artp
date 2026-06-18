import Layout from "../components/Layout";
import { NATIONAL_KPIS, OPERATOR_SUMMARY, genTimeSeries } from "../data/senegal";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  ClipboardDocumentListIcon, CheckCircleIcon, SignalIcon,
  MapPinIcon, UsersIcon, ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const SERIES = genTimeSeries(6);

const KPIS = [
  { label:"Plaintes reçues",    value: NATIONAL_KPIS.totalComplaints, sub:"ce mois",          Icon:ClipboardDocumentListIcon, color:"text-blue-600",    bg:"bg-blue-50",    trend:"+8%" },
  { label:"Taux résolution",    value:`${NATIONAL_KPIS.resolutionRate}%`,sub:`délai moy. ${NATIONAL_KPIS.avgDelay}j`, Icon:CheckCircleIcon, color:"text-emerald-600", bg:"bg-emerald-50", trend:"+3%" },
  { label:"Débit moyen national",value:`${NATIONAL_KPIS.avgDownload} Mbps`,sub:"seuil ARTP ≥ 5", Icon:SignalIcon, color:"text-violet-600", bg:"bg-violet-50", trend:"+12%" },
  { label:"Zones blanches",     value: NATIONAL_KPIS.blindSpots,      sub:"à résorber",       Icon:MapPinIcon,                color:"text-red-600",     bg:"bg-red-50",     trend:"-5%" },
  { label:"Couverture 4G",      value:`${NATIONAL_KPIS.coverage4G}%`, sub:"du territoire",    Icon:ArrowTrendingUpIcon,       color:"text-amber-600",   bg:"bg-amber-50",   trend:"+2%" },
  { label:"Abonnés actifs",     value:`${(NATIONAL_KPIS.activeUsers/1e6).toFixed(1)}M`,sub:"tous opérateurs", Icon:UsersIcon, color:"text-slate-600", bg:"bg-slate-100",  trend:"+4%" },
];

export default function NationalPage() {
  const [period, setPeriod] = useState("6M");

  return (
    <Layout
      title="Vue nationale — Télécommunications Sénégal"
      subtitle={`Données consolidées • Mis à jour le ${new Date().toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" })}`}
      actions={
        <div className="flex gap-1">
          {["3M","6M","1A"].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${period===p ? "bg-artp-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
              {p}
            </button>
          ))}
        </div>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-7">
        {KPIS.map(({ label, value, sub, Icon, color, bg, trend }) => (
          <div key={label} className="card p-5 fade-up">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trend.startsWith("+") ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                {trend}
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900">{value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
            <p className="text-[11px] text-slate-400">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        {/* Évolution plaintes + résolutions */}
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-700">Plaintes vs Résolutions (6 mois)</h2>
            <div className="flex gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-artp-500 inline-block rounded" />Plaintes</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-500 inline-block rounded" />Résolues</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={SERIES}>
              <defs>
                <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2845cc" stopOpacity={0.12}/>
                  <stop offset="95%" stopColor="#2845cc" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.12}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11 }} axisLine={false} tickLine={false} width={30}/>
              <Tooltip contentStyle={{ borderRadius:10, border:"none", boxShadow:"0 4px 20px rgba(0,0,0,0.08)", fontSize:12 }}/>
              <Area type="monotone" dataKey="complaints" stroke="#2845cc" strokeWidth={2} fill="url(#gC)" name="Plaintes"/>
              <Area type="monotone" dataKey="resolved"   stroke="#22c55e" strokeWidth={2} fill="url(#gR)" name="Résolues"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Parts de marché */}
        <div className="card p-5">
          <h2 className="text-sm font-bold text-slate-700 mb-4">Parts de marché abonnés</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={OPERATOR_SUMMARY} dataKey="share" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={42} paddingAngle={3}>
                {OPERATOR_SUMMARY.map(op => <Cell key={op.name} fill={op.color}/>)}
              </Pie>
              <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ borderRadius:10, border:"none", boxShadow:"0 4px 20px rgba(0,0,0,0.08)", fontSize:12 }}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {OPERATOR_SUMMARY.map(op => (
              <div key={op.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background:op.color }}/>
                  <span className="text-sm font-semibold text-slate-700">{op.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{op.share}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Débit moyen par opérateur */}
      <div className="card p-5">
        <h2 className="text-sm font-bold text-slate-700 mb-4">Débit moyen mensuel par opérateur (Mbps)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={SERIES} barGap={4} barSize={18}>
            <XAxis dataKey="month" tick={{ fontSize:11 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize:11 }} axisLine={false} tickLine={false} width={30}/>
            <Tooltip contentStyle={{ borderRadius:10, border:"none", boxShadow:"0 4px 20px rgba(0,0,0,0.08)", fontSize:12 }}/>
            <Bar dataKey="orange"   fill="#f97316" radius={[4,4,0,0]} name="Orange"/>
            <Bar dataKey="free"     fill="#6366f1" radius={[4,4,0,0]} name="Free"/>
            <Bar dataKey="expresso" fill="#ef4444" radius={[4,4,0,0]} name="Expresso"/>
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11 }}/>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 border-t border-slate-50 pt-3">
          <span className="w-2 h-2 rounded-full bg-red-400"/>
          Ligne rouge : seuil minimal ARTP = 5 Mbps
        </div>
      </div>
    </Layout>
  );
}
