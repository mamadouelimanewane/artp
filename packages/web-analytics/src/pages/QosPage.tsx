import { useState } from "react";
import Layout from "../components/Layout";
import { REGIONS } from "../data/senegal";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, CartesianGrid, ReferenceLine, Cell,
} from "recharts";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const THRESHOLDS = { download:5, upload:1, latency:100, availability:99 };

export default function QosPage() {
  const [metric, setMetric] = useState<"downloadAvg"|"latencyAvg"|"coverage">("downloadAvg");

  const sorted = [...REGIONS].sort((a,b) => {
    if (metric==="latencyAvg") return a[metric]-b[metric];
    return b[metric as "downloadAvg"|"coverage"]-a[metric as "downloadAvg"|"coverage"];
  });

  const conformant = REGIONS.filter(r =>
    r.downloadAvg >= THRESHOLDS.download &&
    r.latencyAvg  <= THRESHOLDS.latency  &&
    r.availability >= THRESHOLDS.availability
  ).length;

  const scatterData = REGIONS.map(r => ({
    x: r.downloadAvg,
    y: r.latencyAvg,
    z: r.complaints,
    name: r.name,
    ok: r.downloadAvg >= THRESHOLDS.download && r.latencyAvg <= THRESHOLDS.latency,
  }));

  return (
    <Layout title="Qualité de service réseau" subtitle="Analyse des indicateurs QoS par région — seuils ARTP">
      {/* Conformité nationale */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label:"Régions conformes",      value:`${conformant}/${REGIONS.length}`,      color:"text-emerald-600", bg:"bg-emerald-50", ok:conformant>=10 },
          { label:"Débit moyen national",   value:`${(REGIONS.reduce((s,r)=>s+r.downloadAvg,0)/REGIONS.length).toFixed(1)} Mbps`, color:"text-artp-600", bg:"bg-artp-50", ok:true },
          { label:"Latence moyenne",        value:`${Math.round(REGIONS.reduce((s,r)=>s+r.latencyAvg,0)/REGIONS.length)} ms`,    color:"text-amber-600", bg:"bg-amber-50", ok:false },
          { label:"Régions non conformes",  value:`${REGIONS.length-conformant}`,          color:"text-red-600",     bg:"bg-red-50",     ok:false },
        ].map(k => (
          <div key={k.label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              {k.ok
                ? <CheckCircleIcon className="h-4 w-4 text-emerald-500"/>
                : <ExclamationTriangleIcon className="h-4 w-4 text-red-400"/>}
              <p className="text-xs font-bold text-slate-500">{k.label}</p>
            </div>
            <p className={`text-xl font-black ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        {/* Classement régions */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-700">Classement par région</h2>
            <div className="flex gap-1">
              {([["downloadAvg","Débit"],["latencyAvg","Latence"],["coverage","Couverture"]] as [typeof metric,string][]).map(([k,l]) => (
                <button key={k} onClick={() => setMetric(k)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${metric===k ? "bg-artp-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={sorted} layout="vertical" barSize={14} margin={{ left:60 }}>
              <XAxis type="number" tick={{ fontSize:10 }} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="name" tick={{ fontSize:10 }} axisLine={false} tickLine={false} width={65}/>
              <Tooltip contentStyle={{ borderRadius:10, border:"none", boxShadow:"0 4px 20px rgba(0,0,0,0.08)", fontSize:12 }}/>
              {metric==="downloadAvg" && <ReferenceLine x={THRESHOLDS.download} stroke="#ef4444" strokeDasharray="4 2" label={{ value:"Min ARTP", fontSize:9, fill:"#ef4444" }}/>}
              {metric==="latencyAvg"  && <ReferenceLine x={THRESHOLDS.latency}  stroke="#ef4444" strokeDasharray="4 2" label={{ value:"Max ARTP", fontSize:9, fill:"#ef4444" }}/>}
              <Bar dataKey={metric} radius={[0,4,4,0]} name={metric==="downloadAvg"?"Mbps":metric==="latencyAvg"?"ms":"%"}>
                {sorted.map((r,i) => {
                  const ok = metric==="downloadAvg" ? r.downloadAvg>=THRESHOLDS.download
                    : metric==="latencyAvg" ? r.latencyAvg<=THRESHOLDS.latency
                    : r.coverage>=75;
                  return <Cell key={i} fill={ok?"#22c55e":"#ef4444"}/>;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scatter débit vs latence */}
        <div className="card p-5">
          <h2 className="text-sm font-bold text-slate-700 mb-1">Débit vs Latence par région</h2>
          <p className="text-xs text-slate-400 mb-3">Taille du cercle = volume de plaintes · Zone verte = conforme ARTP</p>
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top:20, right:20, bottom:20, left:10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="x" name="Débit" unit=" Mbps" tick={{ fontSize:10 }} label={{ value:"Débit (Mbps)", position:"insideBottom", offset:-10, fontSize:10 }}/>
              <YAxis dataKey="y" name="Latence" unit=" ms" tick={{ fontSize:10 }} label={{ value:"Latence (ms)", angle:-90, position:"insideLeft", fontSize:10 }}/>
              <ZAxis dataKey="z" range={[40,300]}/>
              <Tooltip cursor={{ strokeDasharray:"3 3" }} content={({ payload }) => {
                if (!payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white rounded-xl shadow-lg border border-slate-100 px-3 py-2.5 text-xs">
                    <p className="font-bold text-slate-800 mb-1">{d.name}</p>
                    <p className="text-slate-500">Débit : <b>{d.x} Mbps</b></p>
                    <p className="text-slate-500">Latence : <b>{d.y} ms</b></p>
                    <p className="text-slate-500">Plaintes : <b>{d.z}</b></p>
                  </div>
                );
              }}/>
              {/* Zones conformité */}
              <ReferenceLine x={THRESHOLDS.download} stroke="#ef4444" strokeDasharray="4 2" strokeWidth={1}/>
              <ReferenceLine y={THRESHOLDS.latency}  stroke="#ef4444" strokeDasharray="4 2" strokeWidth={1}/>
              <Scatter data={scatterData} fill="#6366f1">
                {scatterData.map((d,i) => <Cell key={i} fill={d.ok ? "#22c55e" : "#ef4444"} fillOpacity={0.7}/>)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table conformité */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50">
          <h2 className="text-sm font-bold text-slate-700">Conformité aux seuils ARTP — toutes régions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Région","Débit ↓ (≥5 Mbps)","Latence (≤100 ms)","Dispo. (≥99%)","Couverture 4G","Score QoS","Statut"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[...REGIONS].sort((a,b) => b.qosScore-a.qosScore).map(r => {
                const okD = r.downloadAvg >= THRESHOLDS.download;
                const okL = r.latencyAvg  <= THRESHOLDS.latency;
                const okA = r.availability >= THRESHOLDS.availability;
                const allOk = okD && okL && okA;
                const cell = (ok:boolean, val:string) => (
                  <span className={`font-semibold ${ok ? "text-emerald-600" : "text-red-600"}`}>{val}</span>
                );
                return (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">{r.name}</td>
                    <td className="px-4 py-3 text-sm">{cell(okD, `${r.downloadAvg} Mbps`)}</td>
                    <td className="px-4 py-3 text-sm">{cell(okL, `${r.latencyAvg} ms`)}</td>
                    <td className="px-4 py-3 text-sm">{cell(okA, `${r.availability}%`)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{r.coverage}%</td>
                    <td className="px-4 py-3 text-sm font-black text-artp-600">{r.qosScore}/10</td>
                    <td className="px-4 py-3">
                      {allOk
                        ? <span className="badge bg-emerald-50 text-emerald-700">✓ Conforme</span>
                        : <span className="badge bg-red-50 text-red-700">⚠ Non conforme</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
