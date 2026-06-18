import { RadarChart, Radar, PolarGrid, PolarAngleAxis, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { useState } from "react";

const OPERATORS = [
  {
    name: "Orange SN",
    score: 78,
    risk: "Faible",
    dimensions: [
      { dim: "QoS Voix", score: 82 }, { dim: "QoS Data", score: 79 }, { dim: "Couverture", score: 85 },
      { dim: "Facturation", score: 91 }, { dim: "Plaintes", score: 74 }, { dim: "Conformite", score: 88 },
    ],
    radar: [
      { d: "QoS Voix", v: 82 }, { d: "QoS Data", v: 79 }, { d: "Couverture", v: 85 },
      { d: "Facturation", v: 91 }, { d: "Plaintes", v: 74 }, { d: "Conformite", v: 88 },
    ],
    alerts: ["Taux succes appels T1 2026 : 94.2% < 95% seuil"],
  },
  {
    name: "Free SN",
    score: 65,
    risk: "Moyen",
    dimensions: [
      { dim: "QoS Voix", score: 71 }, { dim: "QoS Data", score: 63 }, { dim: "Couverture", score: 68 },
      { dim: "Facturation", score: 77 }, { dim: "Plaintes", score: 58 }, { dim: "Conformite", score: 72 },
    ],
    radar: [
      { d: "QoS Voix", v: 71 }, { d: "QoS Data", v: 63 }, { d: "Couverture", v: 68 },
      { d: "Facturation", v: 77 }, { d: "Plaintes", v: 58 }, { d: "Conformite", v: 72 },
    ],
    alerts: ["Volume plaintes +23% vs T4 2025", "Debit 4G moyen < 15 Mbps en zone rurale"],
  },
  {
    name: "Expresso SN",
    score: 52,
    risk: "Eleve",
    dimensions: [
      { dim: "QoS Voix", score: 55 }, { dim: "QoS Data", score: 48 }, { dim: "Couverture", score: 51 },
      { dim: "Facturation", score: 68 }, { dim: "Plaintes", score: 44 }, { dim: "Conformite", score: 59 },
    ],
    radar: [
      { d: "QoS Voix", v: 55 }, { d: "QoS Data", v: 48 }, { d: "Couverture", v: 51 },
      { d: "Facturation", v: 68 }, { d: "Plaintes", v: 44 }, { d: "Conformite", v: 59 },
    ],
    alerts: ["Couverture 3G Ziguinchor : 43% < seuil 60%","Rapport trimestriel T4 2025 non depose","3 interruptions >6h en Q1 2026"],
  },
];

const RISK_STYLE: Record<string, string> = {
  "Faible": "bg-emerald-100 text-emerald-700",
  "Moyen": "bg-amber-100 text-amber-700",
  "Eleve": "bg-red-100 text-red-700",
};

const SCORE_COLOR = (s: number) => s >= 75 ? "#10b981" : s >= 60 ? "#f59e0b" : "#ef4444";

export default function ScoringPage() {
  const [selected, setSelected] = useState(0);
  const op = OPERATORS[selected];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Scoring IA des operateurs</h1>
        <p className="text-slate-500 text-sm">Note de conformite reglementaire calculee automatiquement sur 50+ indicateurs</p>
      </div>

      {/* Selector */}
      <div className="flex gap-3">
        {OPERATORS.map((o, i) => (
          <button key={o.name} onClick={() => setSelected(i)}
            className={`card p-4 flex-1 text-center transition-all cursor-pointer
              ${selected === i ? "ring-2 ring-ai-500" : "hover:shadow-md"}`}>
            <p className="font-bold text-slate-800 mb-1">{o.name}</p>
            <p className="text-3xl font-black" style={{ color: SCORE_COLOR(o.score) }}>{o.score}</p>
            <p className="text-xs text-slate-400 mb-2">/100</p>
            <span className={`badge ${RISK_STYLE[o.risk]}`}>{o.risk} risque</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Radar */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-3">Profil reglementaire — {op.name}</h2>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={op.radar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="d" tick={{ fontSize: 11 }} />
              <Radar dataKey="v" stroke={SCORE_COLOR(op.score)} fill={SCORE_COLOR(op.score)} fillOpacity={0.2} />
              <Tooltip formatter={(v: any) => [`${v}/100`]} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Dimensions */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-3">Scores par dimension</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={op.dimensions} layout="vertical">
              <XAxis type="number" domain={[0,100]} tick={{ fontSize: 10 }} />
              <YAxis dataKey="dim" type="category" tick={{ fontSize: 10 }} width={80} />
              <Tooltip formatter={(v: any) => [`${v}/100`]} />
              <Bar dataKey="score" fill={SCORE_COLOR(op.score)} radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>

          {op.alerts.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-red-600">Alertes actives ({op.alerts.length})</p>
              {op.alerts.map((a, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-red-700 bg-red-50 rounded-lg p-2">
                  <span className="shrink-0">⚠</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
