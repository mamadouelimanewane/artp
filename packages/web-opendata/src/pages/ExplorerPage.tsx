import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const QOS_DATA = [
  { region: "Dakar", Orange: 24.3, Free: 18.2, Expresso: 12.1 },
  { region: "Thies", Orange: 19.8, Free: 14.6, Expresso: 9.4 },
  { region: "Kaolack", Orange: 16.2, Free: 11.3, Expresso: 7.8 },
  { region: "Saint-Louis", Orange: 14.7, Free: 10.1, Expresso: 6.9 },
  { region: "Ziguinchor", Orange: 13.4, Free: 9.8, Expresso: 5.2 },
  { region: "Tambacounda", Orange: 11.2, Free: 7.4, Expresso: 4.1 },
];

const TREND_DATA = [
  { m: "Jan", download: 18.4, latence: 52 },
  { m: "Fev", download: 19.2, latence: 49 },
  { m: "Mar", download: 20.8, latence: 47 },
  { m: "Avr", download: 21.3, latence: 45 },
  { m: "Mai", download: 22.7, latence: 44 },
  { m: "Jun", download: 23.9, latence: 42 },
];

export default function ExplorerPage() {
  const [dataset, setDataset] = useState("qos");
  const [metric, setMetric] = useState("download");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Explorateur de donnees</h1>
        <p className="text-slate-500 text-sm">Visualisez les donnees sans code — exportez ce que vous voyez</p>
      </div>

      {/* Filtres */}
      <div className="card p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Dataset</label>
          <select value={dataset} onChange={e => setDataset(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-od-400">
            <option value="qos">QoS Mobile</option>
            <option value="coverage">Couverture</option>
            <option value="complaints">Plaintes</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Metrique</label>
          <select value={metric} onChange={e => setMetric(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-od-400">
            <option value="download">Debit descendant (Mbps)</option>
            <option value="upload">Debit montant (Mbps)</option>
            <option value="latence">Latence (ms)</option>
          </select>
        </div>
        <button className="px-4 py-2 bg-od-600 text-white text-xs font-semibold rounded-xl hover:bg-od-700 transition-colors">
          Exporter CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Debit moyen par region (Mbps)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={QOS_DATA} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="region" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip />
              <Bar dataKey="Orange" fill="#f97316" radius={[0,4,4,0]} />
              <Bar dataKey="Free" fill="#3b82f6" radius={[0,4,4,0]} />
              <Bar dataKey="Expresso" fill="#8b5cf6" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Evolution nationale (6 mois)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="m" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="download" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} name="Debit (Mbps)" />
              <Line type="monotone" dataKey="latence" stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} name="Latence (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Apercu table */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Apercu des donnees brutes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-left text-slate-500">
                {["date","region","operateur","technologie","download_mbps","upload_mbps","latence_ms","taux_succes"].map(h => (
                  <th key={h} className="px-3 py-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["2026-06-17","Dakar","Orange SN","4G","24.3","8.1","42","97.4"],
                ["2026-06-17","Dakar","Free SN","4G","18.2","6.4","51","95.1"],
                ["2026-06-17","Thies","Orange SN","4G","19.8","7.2","46","96.8"],
                ["2026-06-17","Kaolack","Expresso","3G","7.8","2.1","89","91.2"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2 text-slate-700">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
