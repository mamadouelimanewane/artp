import { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";

const COLORS: Record<string, string> = {
  orange: "#f97316",
  free: "#6366f1",
  expresso: "#10b981",
};

const MONTHLY_FALLBACK = [
  { mois: "Jan", orange: 12.4, free: 8.1, expresso: 5.9 },
  { mois: "Fev", orange: 13.1, free: 8.6, expresso: 6.2 },
  { mois: "Mar", orange: 11.8, free: 9.0, expresso: 5.5 },
  { mois: "Avr", orange: 14.2, free: 9.4, expresso: 6.8 },
  { mois: "Mai", orange: 15.0, free: 8.8, expresso: 7.1 },
  { mois: "Jun", orange: 14.7, free: 9.2, expresso: 6.5 },
];

const REGIONS_FALLBACK = [
  { region: "Dakar", count: 245, pct: 100 },
  { region: "Thiès", count: 89, pct: 36 },
  { region: "Saint-Louis", count: 67, pct: 27 },
  { region: "Ziguinchor", count: 52, pct: 21 },
  { region: "Kaolack", count: 41, pct: 17 },
];

// Donnees plaintes par categorie et operateur (simulees)
const COMPLAINTS_CATEGORY_MOCK = [
  { categorie: "Connexion", orange: 45, free: 32, expresso: 18 },
  { categorie: "Facturation", orange: 28, free: 19, expresso: 12 },
  { categorie: "Couverture", orange: 35, free: 22, expresso: 25 },
  { categorie: "Qualite voix", orange: 20, free: 15, expresso: 8 },
  { categorie: "SMS", orange: 12, free: 9, expresso: 5 },
];

type Tab = "global" | "operateur" | "region" | "conformite";

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("global");
  const [ranking, setRanking] = useState<
    {
      operator: string;
      rank: number;
      score: number;
      avgDownload: number;
      avgUpload: number;
      avgLatency: number;
      avgMos: number;
      measureCount: number;
      blindSpotCount: number;
    }[]
  >([]);
  const [stats, setStats] = useState<
    {
      operator: string;
      avgDownload: number;
      avgUpload: number;
      avgLatency: number;
      avgMos: number;
      measureCount: number;
      blindSpotCount: number;
    }[]
  >([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState(MONTHLY_FALLBACK);
  const [topRegions, setTopRegions] = useState(REGIONS_FALLBACK);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/qos/ranking?days=${days}`),
      api.get(`/qos/stats?days=${days}`),
      api.get("/qos/stats?days=180"),
    ])
      .then(([rankRes, statsRes, histRes]) => {
        setRanking(rankRes.data.data ?? []);
        const statsArr = statsRes.data.data ?? [];
        setStats(statsArr);

        // Evolution mensuelle depuis /qos/stats?days=180
        const histArr: {
          operator?: string;
          createdAt?: string;
          date?: string;
          avgDownload?: number;
          downloadSpeed?: number;
        }[] = histRes.data.data ?? [];
        if (Array.isArray(histArr) && histArr.length > 6) {
          // Grouper par mois
          const byMonth: Record<string, Record<string, number[]>> = {};
          histArr.forEach((item) => {
            const dateStr = item.createdAt ?? item.date ?? "";
            if (!dateStr) return;
            const d = new Date(dateStr);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            const op = (item.operator ?? "unknown").toLowerCase();
            const dl = item.avgDownload ?? item.downloadSpeed ?? 0;
            if (!byMonth[key]) byMonth[key] = {};
            if (!byMonth[key][op]) byMonth[key][op] = [];
            byMonth[key][op].push(dl);
          });
          const monthNames = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"];
          const monthPoints = Object.entries(byMonth)
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(-6)
            .map(([key, ops]) => {
              const [, month] = key.split("-");
              const avg = (arr: number[]) =>
                arr.length ? parseFloat((arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(1)) : 0;
              return {
                mois: monthNames[parseInt(month) - 1],
                orange: avg(ops.orange ?? []),
                free: avg(ops.free ?? []),
                expresso: avg(ops.expresso ?? []),
              };
            });
          if (monthPoints.length >= 3) setMonthlyData(monthPoints);
        }

        // Top regions depuis /qos/stats?days=30 — grouper par region si disponible
        if (Array.isArray(statsArr) && statsArr.length > 0) {
          const regionMap: Record<string, number> = {};
          statsArr.forEach((item: { region?: string; measureCount?: number }) => {
            if (item.region) {
              regionMap[item.region] = (regionMap[item.region] ?? 0) + (item.measureCount ?? 1);
            }
          });
          const regionEntries = Object.entries(regionMap);
          if (regionEntries.length > 0) {
            const sorted = regionEntries.sort(([, a], [, b]) => b - a).slice(0, 5);
            const max = sorted[0][1];
            setTopRegions(
              sorted.map(([region, count]) => ({
                region: region.charAt(0).toUpperCase() + region.slice(1).replace(/_/g, " "),
                count,
                pct: Math.round((count / max) * 100),
              }))
            );
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [days]);

  // Calcul conformite: download >= 5 Mbps ET latence <= 100 ms
  const compliantOps = stats.filter(
    (op) => op.avgDownload >= 5 && op.avgLatency <= 100
  ).length;
  const conformiteRate =
    stats.length > 0 ? Math.round((compliantOps / stats.length) * 100) : 0;

  const tabs: { key: Tab; label: string }[] = [
    { key: "global", label: "Vue globale" },
    { key: "operateur", label: "Par operateur" },
    { key: "region", label: "Par region" },
    { key: "conformite", label: "Conformite" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Statistiques QoS</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Analyse comparative des operateurs et des regions
          </p>
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

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? "border-artp-600 text-artp-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-artp-600" />
        </div>
      ) : (
        <>
          {/* VUE GLOBALE */}
          {activeTab === "global" && (
            <div className="space-y-6">
              {/* Classement */}
              {ranking.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ranking.map((op) => (
                    <div key={op.operator} className="card text-center">
                      <div className="text-4xl font-black text-gray-100 mb-1">
                        #{op.rank}
                      </div>
                      <p
                        className="text-lg font-bold capitalize"
                        style={{ color: COLORS[op.operator] ?? "#6b7280" }}
                      >
                        {op.operator}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {op.score}
                        <span className="text-base text-gray-400">/100</span>
                      </p>
                      <div className="mt-3 space-y-1 text-sm text-gray-500">
                        <p>
                          Debit moy:{" "}
                          <strong className="text-gray-900">
                            {op.avgDownload} Mbps
                          </strong>
                        </p>
                        <p>
                          Latence:{" "}
                          <strong className="text-gray-900">
                            {op.avgLatency} ms
                          </strong>
                        </p>
                        <p>
                          Score MOS:{" "}
                          <strong className="text-gray-900">
                            {op.avgMos}/5
                          </strong>
                        </p>
                        <p className="text-xs">{op.measureCount} mesures</p>
                      </div>
                      {/* Seuil conformite */}
                      <div
                        className={`mt-3 text-xs font-medium px-2 py-1 rounded-full ${
                          op.avgDownload >= 5 && op.avgLatency <= 100
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {op.avgDownload >= 5 && op.avgLatency <= 100
                          ? "Conforme ARTP"
                          : "Non conforme"}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Evolution mensuelle */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Evolution mensuelle du debit (Mbps)
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Debit de telechargement moyen par operateur (donnees illustratives)
                </p>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      label={{
                        value: "Mbps",
                        angle: -90,
                        position: "insideLeft",
                        style: { fontSize: 11 },
                      }}
                    />
                    <Tooltip formatter={(v: number) => [`${v} Mbps`]} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    {["orange", "free", "expresso"].map((op) => (
                      <Line
                        key={op}
                        type="monotone"
                        dataKey={op}
                        stroke={COLORS[op]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name={op.charAt(0).toUpperCase() + op.slice(1)}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* PAR OPERATEUR */}
          {activeTab === "operateur" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Debit telechargement moyen (Mbps)
                  </h3>
                  {stats.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-10">
                      Aucune donnee
                    </p>
                  ) : (
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={stats} barSize={40}>
                        <XAxis dataKey="operator" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(v: number) => [`${v} Mbps`, "Debit DL"]} />
                        <Bar
                          dataKey="avgDownload"
                          name="Download"
                          radius={[6, 6, 0, 0]}
                          fill="#3b5ef0"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Latence moyenne (ms) — moins = mieux
                  </h3>
                  {stats.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-10">
                      Aucune donnee
                    </p>
                  ) : (
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={stats} barSize={40}>
                        <XAxis dataKey="operator" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(v: number) => [`${v} ms`, "Latence"]}
                        />
                        <Bar
                          dataKey="avgLatency"
                          name="Latence"
                          radius={[6, 6, 0, 0]}
                          fill="#f59e0b"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Tableau comparatif */}
              <div className="card p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">
                    Tableau comparatif detaille
                  </h3>
                </div>
                {stats.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-10">
                    Aucune donnee disponible
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          {[
                            "Operateur",
                            "DL moy. (Mbps)",
                            "UL moy. (Mbps)",
                            "Latence (ms)",
                            "Score MOS",
                            "Zones blanches",
                            "Mesures",
                            "Seuil ARTP",
                          ].map((h) => (
                            <th
                              key={h}
                              className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wide"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {stats.map((op) => {
                          const conforme =
                            op.avgDownload >= 5 && op.avgLatency <= 100;
                          return (
                            <tr
                              key={op.operator}
                              className="border-b border-gray-50 hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">
                                <span
                                  className="font-bold capitalize"
                                  style={{
                                    color: COLORS[op.operator] ?? "#6b7280",
                                  }}
                                >
                                  {op.operator}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-medium">
                                {op.avgDownload}
                              </td>
                              <td className="py-3 px-4">{op.avgUpload}</td>
                              <td className="py-3 px-4">{op.avgLatency}</td>
                              <td className="py-3 px-4">{op.avgMos}/5</td>
                              <td className="py-3 px-4 text-red-500">
                                {op.blindSpotCount}
                              </td>
                              <td className="py-3 px-4 text-gray-400">
                                {op.measureCount.toLocaleString("fr-FR")}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`badge ${
                                    conforme
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {conforme ? "Conforme" : "Non conforme"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Plaintes par categorie */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Plaintes par categorie et operateur
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Distribution des plaintes (donnees illustratives)
                </p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={COMPLAINTS_CATEGORY_MOCK}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="categorie" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    {["orange", "free", "expresso"].map((op) => (
                      <Bar
                        key={op}
                        dataKey={op}
                        stackId="a"
                        fill={COLORS[op]}
                        name={op.charAt(0).toUpperCase() + op.slice(1)}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* PAR REGION */}
          {activeTab === "region" && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Top 5 regions avec le plus de plaintes
                </h3>
                <div className="space-y-4">
                  {topRegions.map((r, i) => (
                    <div key={r.region} className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-artp-100 text-artp-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-800">
                            {r.region}
                          </span>
                          <span className="text-sm text-gray-500">
                            {r.count} plaintes
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-artp-500 rounded-full transition-all"
                            style={{ width: `${r.pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Note sur les donnees regionales
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Les statistiques par region sont calculees a partir des mesures QoS
                  et des plaintes soumises par les citoyens localises dans chaque
                  region. La region de Dakar concentre la majorite des mesures en
                  raison de sa densite de population plus elevee.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { label: "Regions couvertes", value: "14" },
                    { label: "Regions avec alertes", value: "3" },
                    { label: "Taux de couverture", value: "78%" },
                    { label: "Zones blanches tot.", value: stats.reduce((s, o) => s + (o.blindSpotCount ?? 0), 0).toString() },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-gray-900">{value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONFORMITE */}
          {activeTab === "conformite" && (
            <div className="space-y-6">
              {/* Jauge globale */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card text-center col-span-1">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Taux de conformite global
                  </h3>
                  <div className="relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={160}>
                      <RadialBarChart
                        cx="50%"
                        cy="100%"
                        innerRadius="60%"
                        outerRadius="100%"
                        startAngle={180}
                        endAngle={0}
                        data={[{ value: conformiteRate, fill: conformiteRate >= 66 ? "#10b981" : conformiteRate >= 33 ? "#f59e0b" : "#ef4444" }]}
                      >
                        <RadialBar dataKey="value" cornerRadius={8} background />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-4xl font-black text-gray-900 -mt-4">
                    {conformiteRate}
                    <span className="text-xl text-gray-400">%</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {compliantOps}/{stats.length} operateurs conformes
                  </p>
                </div>

                <div className="card col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Seuils reglementaires ARTP
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-artp-50 rounded-lg">
                      <SignalIcon className="h-5 w-5 text-artp-600 flex-shrink-0" style={{}} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Debit de telechargement minimum
                        </p>
                        <p className="text-xs text-gray-500">
                          Seuil obligatoire: 5 Mbps
                        </p>
                      </div>
                      <span className="text-sm font-bold text-artp-700">≥ 5 Mbps</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Latence maximum autorisee
                        </p>
                        <p className="text-xs text-gray-500">
                          Seuil obligatoire: 100 ms
                        </p>
                      </div>
                      <span className="text-sm font-bold text-green-700">≤ 100 ms</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <ExclamationTriangleIcon className="h-5 w-5 text-orange-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Taux de disponibilite reseau
                        </p>
                        <p className="text-xs text-gray-500">
                          Objectif: 99.5% de disponibilite
                        </p>
                      </div>
                      <span className="text-sm font-bold text-orange-700">≥ 99.5%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detail par operateur */}
              <div className="card p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">
                    Etat de conformite par operateur
                  </h3>
                </div>
                {stats.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-10">
                    Aucune donnee disponible
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          "Operateur",
                          "Debit DL",
                          "Seuil DL",
                          "Latence",
                          "Seuil latence",
                          "Score MOS",
                          "Statut",
                        ].map((h) => (
                          <th
                            key={h}
                            className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wide"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((op) => {
                        const dlOk = op.avgDownload >= 5;
                        const latOk = op.avgLatency <= 100;
                        const conforme = dlOk && latOk;
                        return (
                          <tr
                            key={op.operator}
                            className="border-t border-gray-50 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4">
                              <span
                                className="font-bold capitalize"
                                style={{ color: COLORS[op.operator] ?? "#6b7280" }}
                              >
                                {op.operator}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium">
                              {op.avgDownload} Mbps
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`badge ${
                                  dlOk
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {dlOk ? "OK" : "NON CONFORME"}
                              </span>
                            </td>
                            <td className="py-3 px-4">{op.avgLatency} ms</td>
                            <td className="py-3 px-4">
                              <span
                                className={`badge ${
                                  latOk
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {latOk ? "OK" : "NON CONFORME"}
                              </span>
                            </td>
                            <td className="py-3 px-4">{op.avgMos}/5</td>
                            <td className="py-3 px-4">
                              {conforme ? (
                                <span className="flex items-center gap-1 text-green-700 text-xs font-medium">
                                  <CheckCircleIcon className="h-4 w-4" />
                                  Conforme
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
                                  <ExclamationTriangleIcon className="h-4 w-4" />
                                  Non conforme
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

