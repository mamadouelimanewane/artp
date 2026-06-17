import { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  UsersIcon,
  ChatBubbleLeftRightIcon,
  SignalIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const COLORS = { orange: "#f97316", free: "#6366f1", expresso: "#10b981" };

interface DashboardData {
  kpis: { totalUsers: number; totalMeasures: number; totalComplaints: number; blindSpotCount: number };
  complaintsByStatus: Record<string, number>;
  complaintsByOperator: Record<string, number>;
  qosByOperator: { operator: string; avgDownload: number; avgLatency: number; measureCount: number }[];
  recentComplaints: { id: string; reference: string; subject: string; operator: string; status: string; createdAt: string }[];
}

const statusLabel: Record<string, string> = {
  submitted: "Soumise",
  under_review: "En examen",
  forwarded_to_operator: "Transmise",
  pending_response: "En attente",
  resolved: "Résolue",
  closed: "Fermée",
  rejected: "Rejetée",
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

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/stats/dashboard?days=30").then((r) => {
      setData(r.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-artp-600" />
    </div>
  );

  if (!data) return <p className="text-red-500">Erreur de chargement</p>;

  const kpis = [
    { label: "Citoyens inscrits", value: data.kpis.totalUsers, icon: UsersIcon, color: "text-artp-600", bg: "bg-artp-50" },
    { label: "Mesures QoS (30j)", value: data.kpis.totalMeasures, icon: SignalIcon, color: "text-green-600", bg: "bg-green-50" },
    { label: "Plaintes (30j)", value: data.kpis.totalComplaints, icon: ChatBubbleLeftRightIcon, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Zones blanches", value: data.kpis.blindSpotCount, icon: ExclamationTriangleIcon, color: "text-red-600", bg: "bg-red-50" },
  ];

  const statusData = Object.entries(data.complaintsByStatus).map(([k, v]) => ({
    name: statusLabel[k] ?? k,
    value: v,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Tableau de bord</h2>
        <p className="text-sm text-gray-500 mt-0.5">30 derniers jours</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`${bg} p-3 rounded-xl`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value.toLocaleString("fr-FR")}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QoS par opérateur */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Débit moyen par opérateur (Mbps)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.qosByOperator} barSize={32}>
              <XAxis dataKey="operator" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => `${v} Mbps`} />
              <Bar dataKey="avgDownload" radius={[6, 6, 0, 0]}>
                {data.qosByOperator.map((op) => (
                  <Cell key={op.operator} fill={COLORS[op.operator as keyof typeof COLORS] ?? "#6b7280"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Plaintes par statut */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Répartition des plaintes</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={["#3b5ef0","#f97316","#10b981","#6366f1","#f59e0b","#6b7280","#ef4444"][i % 7]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plaintes récentes */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Plaintes récentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 pr-4 text-gray-500 font-medium">Référence</th>
                <th className="text-left py-2 pr-4 text-gray-500 font-medium">Sujet</th>
                <th className="text-left py-2 pr-4 text-gray-500 font-medium">Opérateur</th>
                <th className="text-left py-2 pr-4 text-gray-500 font-medium">Statut</th>
                <th className="text-left py-2 text-gray-500 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentComplaints.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 pr-4 font-mono text-xs text-artp-600">{c.reference}</td>
                  <td className="py-2.5 pr-4 max-w-xs truncate">{c.subject}</td>
                  <td className="py-2.5 pr-4 capitalize">{c.operator}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`badge ${statusColor[c.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {statusLabel[c.status] ?? c.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-gray-400 text-xs">
                    {formatDistanceToNow(new Date(c.createdAt), { locale: fr, addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
