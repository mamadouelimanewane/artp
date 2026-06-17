import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import {
  UsersIcon,
  ChatBubbleLeftRightIcon,
  SignalIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const OP_COLORS: Record<string, string> = {
  orange: "#f97316",
  free: "#6366f1",
  expresso: "#10b981",
};

const PIE_COLORS = [
  "#3b5ef0",
  "#f97316",
  "#10b981",
  "#6366f1",
  "#f59e0b",
  "#6b7280",
  "#ef4444",
];

const statusLabel: Record<string, string> = {
  submitted: "Soumise",
  under_review: "En examen",
  forwarded_to_operator: "Transmise",
  pending_response: "En attente",
  resolved: "Resolue",
  closed: "Fermee",
  rejected: "Rejetee",
};

const statusColor: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700",
  under_review: "bg-yellow-100 text-yellow-700",
  forwarded_to_operator: "bg-purple-100 text-purple-700",
  pending_response: "bg-orange-100 text-orange-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600",
  rejected: "bg-red-100 text-red-700",
};

interface DashboardData {
  kpis: {
    totalUsers: number;
    totalMeasures: number;
    totalComplaints: number;
    blindSpotCount: number;
  };
  complaintsByStatus: Record<string, number>;
  complaintsByOperator: Record<string, number>;
  qosByOperator: {
    operator: string;
    avgDownload: number;
    avgLatency: number;
    measureCount: number;
  }[];
  recentComplaints: {
    id: string;
    reference: string;
    subject: string;
    operator: string;
    status: string;
    createdAt: string;
  }[];
}

function TrendBadge({ positive }: { positive: boolean }) {
  return positive ? (
    <span className="inline-flex items-center gap-0.5 text-green-600 text-xs font-medium">
      <ArrowTrendingUpIcon className="h-3.5 w-3.5" />
      +12%
    </span>
  ) : (
    <span className="inline-flex items-center gap-0.5 text-red-500 text-xs font-medium">
      <ArrowTrendingDownIcon className="h-3.5 w-3.5" />
      -8%
    </span>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get("/stats/dashboard?days=30")
      .then((r) => setData(r.data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-artp-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mb-3" />
        <p className="text-gray-700 font-medium">Impossible de charger le tableau de bord</p>
        <p className="text-sm text-gray-500 mt-1">
          Verifiez que l'API est disponible sur http://localhost:3001
        </p>
      </div>
    );
  }

  const resolvedCount = data.complaintsByStatus["resolved"] ?? 0;
  const total = data.kpis.totalComplaints;
  const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

  const kpis = [
    {
      label: "Citoyens inscrits",
      value: data.kpis.totalUsers,
      icon: UsersIcon,
      color: "text-artp-600",
      bg: "bg-artp-50",
      trend: true,
    },
    {
      label: "Mesures QoS (30j)",
      value: data.kpis.totalMeasures,
      icon: SignalIcon,
      color: "text-green-600",
      bg: "bg-green-50",
      trend: true,
    },
    {
      label: "Plaintes totales",
      value: total,
      icon: ChatBubbleLeftRightIcon,
      color: "text-orange-600",
      bg: "bg-orange-50",
      trend: false,
    },
    {
      label: "Plaintes resolues",
      value: resolvedCount,
      icon: CheckCircleIcon,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: true,
    },
    {
      label: "Zones blanches",
      value: data.kpis.blindSpotCount,
      icon: ExclamationTriangleIcon,
      color: "text-red-600",
      bg: "bg-red-50",
      trend: false,
    },
    {
      label: "Taux de resolution",
      value: `${resolutionRate}%`,
      icon: CheckCircleIcon,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: resolutionRate > 50,
    },
  ];

  const statusData = Object.entries(data.complaintsByStatus).map(([k, v]) => ({
    name: statusLabel[k] ?? k,
    value: v,
  }));

  // Alertes: operateurs sous seuil
  const alerts = data.qosByOperator.filter((op) => op.avgDownload < 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tableau de bord</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Vue d'ensemble — 30 derniers jours
          </p>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
          Mis a jour en temps reel
        </span>
      </div>

      {/* Alertes QoS */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              Alerte qualite de service
            </p>
            <p className="text-sm text-red-700 mt-0.5">
              {alerts.map((a) => a.operator).join(", ")} — debit moyen inferieur au
              seuil ARTP de 5 Mbps
            </p>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, bg, trend }) => (
          <div key={label} className="card flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className={`${bg} p-2.5 rounded-xl`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <TrendBadge positive={trend} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QoS par operateur */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-1">
            Debit moyen par operateur
          </h3>
          <p className="text-xs text-gray-400 mb-4">En Mbps — seuil ARTP: 5 Mbps</p>
          {data.qosByOperator.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">
              Aucune donnee disponible
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.qosByOperator} barSize={36}>
                <XAxis dataKey="operator" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(v: number) => [`${v} Mbps`, "Debit moyen"]}
                />
                {/* Ligne seuil */}
                <Bar dataKey="avgDownload" radius={[6, 6, 0, 0]}>
                  {data.qosByOperator.map((op) => (
                    <Cell
                      key={op.operator}
                      fill={
                        op.avgDownload < 5
                          ? "#ef4444"
                          : OP_COLORS[op.operator] ?? "#6b7280"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Plaintes par statut */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-1">
            Repartition des plaintes
          </h3>
          <p className="text-xs text-gray-400 mb-4">Par statut de traitement</p>
          {statusData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">
              Aucune donnee disponible
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={40}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Plaintes recentes */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">5 dernieres plaintes</h3>
          <Link
            to="/complaints"
            className="text-sm text-artp-600 hover:text-artp-700 font-medium"
          >
            Voir toutes &rarr;
          </Link>
        </div>
        {data.recentComplaints.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">
            Aucune plainte recente
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Reference", "Sujet", "Operateur", "Statut", "Date"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.recentComplaints.slice(0, 5).map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3">
                    <Link
                      to={`/complaints/${c.id}`}
                      className="font-mono text-xs text-artp-600 hover:underline"
                    >
                      {c.reference}
                    </Link>
                  </td>
                  <td className="px-6 py-3 max-w-xs truncate text-gray-700">
                    {c.subject}
                  </td>
                  <td className="px-6 py-3 capitalize font-medium">{c.operator}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`badge ${
                        statusColor[c.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {statusLabel[c.status] ?? c.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-400 text-xs">
                    {formatDistanceToNow(new Date(c.createdAt), {
                      locale: fr,
                      addSuffix: true,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
