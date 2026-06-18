import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const SCENARIOS = [
  { id: "tarif", label: "Baisse tarifs interconnexion 20%" },
  { id: "couverture", label: "Obligation couverture zones rurales" },
  { id: "mnp", label: "Portabilité mobile obligatoire (MNP)" },
  { id: "spectrum", label: "Réattribution bande 700 MHz" },
];

function simulate(scenario: string, intensity: number) {
  const base = {
    tarif: { Orange: -8, Free: +12, Expresso: +6, Marché: +3 },
    couverture: { Orange: -5, Free: -4, Expresso: -9, Marché: +8 },
    mnp: { Orange: -10, Free: +15, Expresso: +5, Marché: +2 },
    spectrum: { Orange: +5, Free: -3, Expresso: +18, Marché: +7 },
  }[scenario] ?? { Orange: 0, Free: 0, Expresso: 0, Marché: 0 };
  const factor = intensity / 50;
  return Object.entries(base).map(([name, val]) => ({ name, impact: +(val * factor).toFixed(1) }));
}

export default function SimulateurPage() {
  const [scenario, setScenario] = useState("tarif");
  const [intensity, setIntensity] = useState(50);

  const data = simulate(scenario, intensity);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Simulateur d'Impact Réglementaire</h1>
        <p className="text-slate-500 text-sm">Modélisation ex-ante des effets de marché</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Paramètres */}
        <div className="card p-5 space-y-5">
          <h2 className="font-semibold text-slate-800">Paramètres</h2>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Scénario réglementaire</label>
            <div className="space-y-2">
              {SCENARIOS.map(s => (
                <label key={s.id} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all
                  ${scenario===s.id ? "border-pnir-400 bg-pnir-50" : "border-slate-200 hover:border-pnir-200"}`}>
                  <input type="radio" name="scenario" value={s.id} checked={scenario===s.id} onChange={() => setScenario(s.id)} className="accent-pnir-600" />
                  <span className="text-sm text-slate-700">{s.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Intensité de la mesure : {intensity}%</label>
            <input
              type="range" min={10} max={100} value={intensity}
              onChange={e => setIntensity(Number(e.target.value))}
              className="w-full accent-pnir-600"
            />
          </div>
        </div>

        {/* Résultats */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-semibold text-slate-800 mb-4">Impact estimé sur les acteurs (%)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} domain={[-20, 20]} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip formatter={(v: number) => `${v > 0 ? "+" : ""}${v}%`} />
              <ReferenceLine x={0} stroke="#94a3b8" />
              <Bar dataKey="impact" fill="#7c3aed" radius={[0,4,4,0]}
                label={{ position: "right", fontSize: 11, formatter: (v: number) => `${v>0?"+":""}${v}%` }}
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 p-4 bg-pnir-50 rounded-xl border border-pnir-100">
            <p className="text-xs font-semibold text-pnir-800 mb-1">Analyse IA</p>
            <p className="text-sm text-pnir-700">
              Le scénario sélectionné devrait favoriser les opérateurs alternatifs tout en maintenant la viabilité du marché.
              Impact global estimé positif sur la concurrence ({data.find(d=>d.name==="Marché")?.impact ?? 0}% de gain concurrentiel).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
