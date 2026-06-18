import { useState } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, ZAxis, CartesianGrid } from "recharts";

const OPERATORS = [
  { name: "Orange SN", color: "#f97316", share: 47, qos: 91, infractions: 3, revenue: 420, download: 24 },
  { name: "Free SN", color: "#3b82f6", share: 34, qos: 84, infractions: 6, revenue: 280, download: 18 },
  { name: "Expresso", color: "#8b5cf6", share: 14, qos: 78, infractions: 4, revenue: 95, download: 12 },
];

const RADAR_DATA = [
  { metric: "Couverture", Orange: 95, Free: 80, Expresso: 65 },
  { metric: "Qualité voix", Orange: 92, Free: 88, Expresso: 80 },
  { metric: "Débit data", Orange: 90, Free: 82, Expresso: 70 },
  { metric: "Conformité", Orange: 85, Free: 78, Expresso: 82 },
  { metric: "Réclamations", Orange: 88, Free: 74, Expresso: 76 },
];

const ANOMALIES = [
  { op: "Free SN", type: "Chute débit", date: "2026-06-15", score: 0.91 },
  { op: "Expresso", type: "Couverture rurale", date: "2026-06-12", score: 0.84 },
  { op: "Orange SN", type: "Tarif SVA", date: "2026-06-10", score: 0.72 },
];

export default function MarchesPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analyse des Marchés Télécom</h1>
        <p className="text-slate-500 text-sm">ML anomalies · Parts de marché · Benchmarks</p>
      </div>

      {/* Opérateurs cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {OPERATORS.map(op => (
          <div
            key={op.name}
            className={`card p-4 cursor-pointer transition-all ${active===op.name?"ring-2 ring-pnir-500":""}`}
            onClick={() => setActive(active===op.name?null:op.name)}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 rounded-full" style={{ background: op.color }} />
              <span className="font-semibold text-slate-800">{op.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400">Part marché</p>
                <p className="font-bold text-slate-800">{op.share}%</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400">QoS</p>
                <p className="font-bold text-slate-800">{op.qos}%</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400">Infractions</p>
                <p className="font-bold text-red-600">{op.infractions}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400">Débit moy.</p>
                <p className="font-bold text-slate-800">{op.download} Mbps</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Radar comparatif */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Benchmark multi-dimensions</h2>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={RADAR_DATA}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
            {OPERATORS.map(op => (
              <Radar key={op.name} name={op.name} dataKey={op.name.split(" ")[0]} stroke={op.color} fill={op.color} fillOpacity={0.15} />
            ))}
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Anomalies ML */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Anomalies détectées par ML</h2>
        <div className="space-y-2">
          {ANOMALIES.map((a, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-amber-500">⚠</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{a.op} — {a.type}</p>
                  <p className="text-xs text-slate-500">{a.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Score anomalie</p>
                <p className="font-bold text-amber-700">{(a.score * 100).toFixed(0)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
