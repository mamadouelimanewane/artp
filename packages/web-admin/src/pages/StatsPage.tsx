import { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const COLORS = { orange: "#f97316", free: "#6366f1", expresso: "#10b981" };

export default function StatsPage() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [days, setDays] = useState(30);

  useEffect(() => {
    Promise.all([
      api.get(`/qos/ranking?days=${days}`),
      api.get(`/qos/stats?days=${days}`),
    ]).then(([rankRes, statsRes]) => {
      setRanking(rankRes.data.data);
      setStats(statsRes.data.data);
    });
  }, [days]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Statistiques QoS</h2>
          <p className="text-sm text-gray-500 mt-0.5">Analyse comparative des opérateurs</p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
        >
          <option value={7}>7 derniers jours</option>
          <option value={30}>30 derniers jours</option>
          <option value={90}>90 derniers jours</option>
        </select>
      </div>

      {/* Classement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ranking.map((op) => (
          <div key={op.operator} className="card text-center">
            <div className="text-3xl font-black text-gray-200 mb-1">#{op.rank}</div>
            <p className="text-lg font-bold capitalize" style={{ color: COLORS[op.operator as keyof typeof COLORS] ?? "#6b7280" }}>
              {op.operator}
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{op.score}<span className="text-base text-gray-400">/100</span></p>
            <div className="mt-3 space-y-1 text-sm text-gray-500">
              <p>Débit moy: <strong className="text-gray-900">{op.avgDownload} Mbps</strong></p>
              <p>Latence moy: <strong className="text-gray-900">{op.avgLatency} ms</strong></p>
              <p>Score MOS: <strong className="text-gray-900">{op.avgMos}/5</strong></p>
              <p className="text-xs">{op.measureCount} mesures</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Débit téléchargement */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Débit téléchargement moyen (Mbps)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats} barSize={40}>
              <XAxis dataKey="operator" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => `${v} Mbps`} />
              <Bar dataKey="avgDownload" name="Téléchargement" fill="#3b5ef0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Latence */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Latence moyenne (ms) — plus bas = meilleur</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats} barSize={40}>
              <XAxis dataKey="operator" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => `${v} ms`} />
              <Bar dataKey="avgLatency" name="Latence (ms)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tableau comparatif */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Tableau comparatif détaillé</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Opérateur","Débit DL (Mbps)","Débit UL (Mbps)","Latence (ms)","MOS","Zones blanches","Mesures"].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.map((op) => (
                <tr key={op.operator} className="border-b border-gray-50">
                  <td className="py-3 px-3 font-bold capitalize" style={{ color: COLORS[op.operator as keyof typeof COLORS] ?? "#6b7280" }}>
                    {op.operator}
                  </td>
                  <td className="py-3 px-3">{op.avgDownload}</td>
                  <td className="py-3 px-3">{op.avgUpload}</td>
                  <td className="py-3 px-3">{op.avgLatency}</td>
                  <td className="py-3 px-3">{op.avgMos}/5</td>
                  <td className="py-3 px-3 text-red-500">{op.blindSpotCount}</td>
                  <td className="py-3 px-3 text-gray-400">{op.measureCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
