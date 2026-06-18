import Layout from "../components/Layout";
import { OPERATOR_SUMMARY, genTimeSeries } from "../data/senegal";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell,
} from "recharts";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const SERIES = genTimeSeries(6);
const ARTP_MIN = 5;

// Données radar normalisées /10 par opérateur
const RADAR_DATA = [
  { subject:"Débit",        Orange:8.2, Free:6.8, Expresso:5.4 },
  { subject:"Latence",      Orange:8.5, Free:7.2, Expresso:6.0 },
  { subject:"Dispo.",       Orange:9.2, Free:8.1, Expresso:7.5 },
  { subject:"Résolution",   Orange:8.8, Free:7.6, Expresso:6.8 },
  { subject:"Couverture",   Orange:9.0, Free:7.4, Expresso:6.2 },
  { subject:"Satisfaction", Orange:7.9, Free:6.9, Expresso:5.8 },
];

export default function OperatorsPage() {
  return (
    <Layout title="Comparatif opérateurs" subtitle="Performance réglementaire — Orange · Free · Expresso Sénégal">
      {/* Tableau comparatif */}
      <div className="card overflow-hidden mb-5">
        <div className="px-5 py-4 border-b border-slate-50">
          <h2 className="text-sm font-bold text-slate-700">Indicateurs clés de performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Indicateur</th>
                {OPERATOR_SUMMARY.map(op => (
                  <th key={op.name} className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wide" style={{ color:op.color }}>
                    {op.name}
                  </th>
                ))}
                <th className="px-5 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wide">Seuil ARTP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { label:"Part de marché",      key:"share",      unit:"%",    threshold:null,    higher:true },
                { label:"Score QoS /10",        key:"qos",        unit:"/10",  threshold:7,       higher:true },
                { label:"Débit moyen",          key:"download",   unit:"Mbps", threshold:ARTP_MIN,higher:true },
                { label:"Plaintes reçues",      key:"complaints", unit:"",     threshold:null,    higher:false },
                { label:"Plaintes résolues",    key:"resolved",   unit:"",     threshold:null,    higher:true },
                { label:"Zones blanches",       key:"blindSpots", unit:"",     threshold:10,      higher:false },
              ].map(row => (
                <tr key={row.label} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-700">{row.label}</td>
                  {OPERATOR_SUMMARY.map(op => {
                    const val = op[row.key as keyof typeof op] as number;
                    const conformant = row.threshold
                      ? (row.higher ? val >= row.threshold : val <= row.threshold)
                      : null;
                    return (
                      <td key={op.name} className="px-5 py-3.5 text-center">
                        <span className="text-sm font-black" style={{ color: conformant===false ? "#ef4444" : conformant===true ? "#16a34a" : "#334155" }}>
                          {val}{row.unit}
                        </span>
                        {conformant !== null && (
                          conformant
                            ? <CheckCircleIcon className="h-3.5 w-3.5 text-green-500 inline ml-1"/>
                            : <ExclamationTriangleIcon className="h-3.5 w-3.5 text-red-500 inline ml-1"/>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-5 py-3.5 text-center text-xs text-slate-400">
                    {row.threshold ? `${row.higher?"≥":"≤"} ${row.threshold}${row.unit}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Radar */}
        <div className="card p-5">
          <h2 className="text-sm font-bold text-slate-700 mb-4">Profil de performance global</h2>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius={100}>
              <PolarGrid stroke="#f1f5f9"/>
              <PolarAngleAxis dataKey="subject" tick={{ fontSize:11 }}/>
              {OPERATOR_SUMMARY.map(op => (
                <Radar key={op.name} name={op.name} dataKey={op.name} stroke={op.color} fill={op.color} fillOpacity={0.08} strokeWidth={2}/>
              ))}
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11 }}/>
              <Tooltip contentStyle={{ borderRadius:10, border:"none", boxShadow:"0 4px 20px rgba(0,0,0,0.08)", fontSize:12 }}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Débit mensuel comparé */}
        <div className="card p-5">
          <h2 className="text-sm font-bold text-slate-700 mb-4">Débit mensuel comparatif (Mbps)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={SERIES} barGap={3} barSize={14}>
              <XAxis dataKey="month" tick={{ fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11 }} axisLine={false} tickLine={false} width={30}/>
              <Tooltip contentStyle={{ borderRadius:10, border:"none", boxShadow:"0 4px 20px rgba(0,0,0,0.08)", fontSize:12 }}/>
              <Bar dataKey="orange"   fill="#f97316" radius={[3,3,0,0]} name="Orange">
                {SERIES.map((s,i) => <Cell key={i} fill={s.orange < ARTP_MIN ? "#fca5a5" : "#f97316"}/>)}
              </Bar>
              <Bar dataKey="free"     fill="#6366f1" radius={[3,3,0,0]} name="Free">
                {SERIES.map((s,i) => <Cell key={i} fill={s.free < ARTP_MIN ? "#c7d2fe" : "#6366f1"}/>)}
              </Bar>
              <Bar dataKey="expresso" fill="#ef4444" radius={[3,3,0,0]} name="Expresso">
                {SERIES.map((s,i) => <Cell key={i} fill={s.expresso < ARTP_MIN ? "#fca5a5" : "#ef4444"}/>)}
              </Bar>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11 }}/>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-red-200 inline-block"/>
            Couleur pâle = en dessous du seuil ARTP (5 Mbps)
          </p>
        </div>
      </div>
    </Layout>
  );
}
