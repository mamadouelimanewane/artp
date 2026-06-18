import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const SCATTER_DATA = [
  { x: 320, y: 47, z: 8, name: "Orange Jan" },
  { x: 280, y: 34, z: 5, name: "Free Jan" },
  { x: 150, y: 62, z: 12, name: "Orange Mar" },
  { x: 410, y: 28, z: 4, name: "Free Mar" },
  { x: 95,  y: 78, z: 15, name: "Orange Mai" },
  { x: 200, y: 55, z: 7, name: "Expresso" },
  { x: 350, y: 41, z: 9, name: "Free Mai" },
  { x: 180, y: 68, z: 11, name: "Orange Avr" },
];

const RISK_RADAR = [
  { metric: "SIM fraud", value: 78 },
  { metric: "SVA abus", value: 65 },
  { metric: "IRSF", value: 82 },
  { metric: "SIM swap", value: 71 },
  { metric: "DoS", value: 45 },
  { metric: "Roaming", value: 38 },
];

const ML_MODELS = [
  { name: "Détection SIM frauduleuse", accuracy: 94.2, recall: 91.8, precision: 96.1, status: "Production" },
  { name: "Classification SVA", accuracy: 88.7, recall: 86.4, precision: 90.2, status: "Production" },
  { name: "IRSF patterns", accuracy: 91.3, recall: 89.1, precision: 93.5, status: "Beta" },
];

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics ML — Fraude Télécom</h1>
        <p className="text-slate-500 text-sm">Modèles d'apprentissage automatique · Détection d'anomalies</p>
      </div>

      {/* Modèles ML */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Performances des modèles ML</h2>
        <div className="space-y-3">
          {ML_MODELS.map(m => (
            <div key={m.name} className="p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-800 text-sm">{m.name}</span>
                <span className={`badge ${m.status==="Production"?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700"}`}>{m.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[["Accuracy", m.accuracy], ["Recall", m.recall], ["Precision", m.precision]].map(([l,v]) => (
                  <div key={l as string} className="bg-white rounded-lg p-2">
                    <p className="text-slate-400">{l as string}</p>
                    <p className="font-bold text-fraud-700">{(v as number).toFixed(1)}%</p>
                    <div className="mt-1 h-1 bg-slate-100 rounded-full">
                      <div className="h-1 bg-fraud-500 rounded-full" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Scatter */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-1">Clustering fraude</h2>
          <p className="text-xs text-slate-400 mb-4">Volume SIM × Score risque (taille = gravité)</p>
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="x" name="Volume SIM" tick={{ fontSize: 11 }} label={{ value: "Volume", offset: -5, position: "insideBottom", fontSize: 10 }} />
              <YAxis dataKey="y" name="Score risque" tick={{ fontSize: 11 }} />
              <ZAxis dataKey="z" range={[40, 200]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} content={({ payload }) => {
                if (!payload?.length) return null;
                const d = payload[0].payload;
                return <div className="bg-white border border-slate-200 shadow-md rounded-lg p-2 text-xs"><p className="font-semibold">{d.name}</p><p>Score : {d.y}%</p></div>;
              }} />
              <Scatter data={SCATTER_DATA} fill="#dc2626" fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Radar risque */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-1">Carte des risques</h2>
          <p className="text-xs text-slate-400 mb-4">Score par catégorie de fraude</p>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={RISK_RADAR}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <Radar name="Risque" dataKey="value" stroke="#dc2626" fill="#dc2626" fillOpacity={0.2} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
