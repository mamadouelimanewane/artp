import { useState } from "react";
import Layout from "../components/Layout";
import { useAuthStore } from "../store/auth";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Cell } from "recharts";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
const ARTP_THRESHOLDS = { download: 5, upload: 1, latency: 100, availability: 99 };

function genMonthly() {
  return MONTHS.slice(0, 6).map(m => ({
    month: m,
    download: +(Math.random()*25+4).toFixed(1),
    upload:   +(Math.random()*8+1).toFixed(1),
    latency:  +(Math.random()*80+30).toFixed(0),
    availability: +(Math.random()*2+97.5).toFixed(2),
  }));
}

const REGIONS = ["Dakar","Thiès","Saint-Louis","Ziguinchor","Tambacounda","Kaolack"];

export default function QosPage() {
  const user = useAuthStore(s => s.user);
  const [data] = useState(genMonthly);
  const [region, setRegion] = useState("Dakar");

  const last = data[data.length - 1];
  const indicators = [
    { label: "Débit descendant", value: last.download, unit: "Mbps", threshold: ARTP_THRESHOLDS.download, good: last.download >= ARTP_THRESHOLDS.download },
    { label: "Débit montant",    value: last.upload,   unit: "Mbps", threshold: ARTP_THRESHOLDS.upload,   good: last.upload   >= ARTP_THRESHOLDS.upload   },
    { label: "Latence",          value: last.latency,  unit: "ms",   threshold: ARTP_THRESHOLDS.latency,  good: +last.latency <= ARTP_THRESHOLDS.latency   },
    { label: "Disponibilité",    value: last.availability, unit: "%",threshold: ARTP_THRESHOLDS.availability, good: +last.availability >= ARTP_THRESHOLDS.availability },
  ];
  const score = Math.round((indicators.filter(i => i.good).length / indicators.length) * 100);

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Rapports QoS</h1>
            <p className="text-slate-400 text-sm mt-0.5 capitalize">{user?.operator} Sénégal — Indicateurs de qualité de service</p>
          </div>
          <select value={region} onChange={e => setRegion(e.target.value)} className="input w-44">
            {REGIONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        {/* Score global */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Jauge conformité */}
          <div className="card p-5 flex flex-col items-center justify-center lg:col-span-1">
            <RadialBarChart width={140} height={140} cx={70} cy={70} innerRadius={45} outerRadius={65} data={[{ value: score }]} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "#f1f5f9" }}>
                <Cell fill={score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444"} />
              </RadialBar>
            </RadialBarChart>
            <p className="text-3xl font-black text-slate-900 -mt-10">{score}%</p>
            <p className="text-xs font-bold text-slate-400 mt-1">Conformité ARTP</p>
          </div>

          {/* Indicateurs */}
          {indicators.map(ind => (
            <div key={ind.label} className={`card p-4 border-l-4 ${ind.good ? "border-green-400" : "border-red-400"}`}>
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{ind.label}</p>
                {ind.good
                  ? <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                  : <ExclamationTriangleIcon className="h-4 w-4 text-red-500 flex-shrink-0" />}
              </div>
              <p className={`text-2xl font-black ${ind.good ? "text-green-700" : "text-red-600"}`}>
                {ind.value}<span className="text-sm font-semibold ml-1 text-slate-400">{ind.unit}</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Seuil ARTP : {ind.label === "Latence" ? "≤" : "≥"} {ind.threshold} {ind.unit}
              </p>
            </div>
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="card p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-4">Débit (Mbps) — 6 derniers mois</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="gDown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
                <Area type="monotone" dataKey="download" stroke="#6366f1" strokeWidth={2} fill="url(#gDown)" name="Descendant" />
                <Area type="monotone" dataKey="upload"   stroke="#22c55e" strokeWidth={2} fill="none" name="Montant" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-4">Disponibilité réseau (%)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="gAvail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[95, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
                <Area type="monotone" dataKey="availability" stroke="#22c55e" strokeWidth={2} fill="url(#gAvail)" name="Disponibilité %" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Seuil ARTP : 99% minimum
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
