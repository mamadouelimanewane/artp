import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { api } from "../services/api";
import Layout from "../components/Layout";
import {
  ClipboardDocumentListIcon, CheckCircleIcon, ClockIcon,
  ExclamationTriangleIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const OP_COLORS: Record<string, { primary: string; light: string; gradient: string[] }> = {
  orange:   { primary: "#f97316", light: "#fff7ed", gradient: ["#fb923c", "#f97316"] },
  free:     { primary: "#6366f1", light: "#eef2ff", gradient: ["#818cf8", "#6366f1"] },
  expresso: { primary: "#ef4444", light: "#fef2f2", gradient: ["#f87171", "#ef4444"] },
};

// Données de démo
const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"];
const genData = () => MONTHS.map(m => ({
  month: m,
  plaintes: Math.floor(Math.random() * 40 + 10),
  resolues: Math.floor(Math.random() * 30 + 5),
  qos: +(Math.random() * 20 + 5).toFixed(1),
}));

const STATUS_MAP: Record<string, { label: string; badge: string }> = {
  submitted:             { label: "Soumise",    badge: "bg-blue-50 text-blue-700"   },
  under_review:          { label: "En examen",  badge: "bg-amber-50 text-amber-700" },
  forwarded_to_operator: { label: "Transmise",  badge: "bg-violet-50 text-violet-700"},
  pending_response:      { label: "En attente", badge: "bg-orange-50 text-orange-700"},
  resolved:              { label: "Résolue",    badge: "bg-green-50 text-green-700"  },
  rejected:              { label: "Rejetée",    badge: "bg-red-50 text-red-700"      },
};

export default function DashboardPage() {
  const user = useAuthStore(s => s.user);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [chartData] = useState(genData);
  const op = OP_COLORS[user?.operator ?? "orange"] ?? OP_COLORS.orange;

  useEffect(() => {
    api.get("/complaints?limit=5").then(r => setComplaints(r.data.data?.complaints ?? r.data.data ?? [])).catch(() => {
      setComplaints([
        { id: "1", reference: "ARTP-2026-00123", subject: "Coupure internet 3 jours", status: "forwarded_to_operator", priority: "high",   createdAt: new Date().toISOString() },
        { id: "2", reference: "ARTP-2026-00118", subject: "Surfacturation forfait",    status: "pending_response",      priority: "medium", createdAt: new Date().toISOString() },
        { id: "3", reference: "ARTP-2026-00112", subject: "Signal absent en zone",     status: "forwarded_to_operator", priority: "high",   createdAt: new Date().toISOString() },
      ]);
    });
    api.get("/stats/operator").then(r => setStats(r.data.data)).catch(() => {
      setStats({ total: 47, pending: 12, resolved: 31, avgDelay: 4.2, qosScore: 7.8, blindSpots: 3 });
    });
  }, []);

  const kpis = stats ? [
    { label: "Total plaintes",     value: stats.total,     sub: "ce mois",         Icon: ClipboardDocumentListIcon, color: "text-slate-700", bg: "bg-slate-100",  trend: +8  },
    { label: "En attente réponse", value: stats.pending,   sub: "à traiter",       Icon: ClockIcon,                 color: "text-amber-700", bg: "bg-amber-100",  trend: -3  },
    { label: "Résolues",           value: stats.resolved,  sub: `délai moy. ${stats.avgDelay}j`, Icon: CheckCircleIcon, color: "text-green-700", bg: "bg-green-100", trend: +15 },
    { label: "Score QoS moyen",    value: `${stats.qosScore}/10`, sub: "seuil ARTP ≥ 7", Icon: ArrowTrendingUpIcon, color: "text-blue-700",  bg: "bg-blue-100",   trend: +2  },
  ] : [];

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Tableau de bord</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Bienvenue, <span className="font-semibold text-slate-600">{user?.name}</span> —
              <span className="capitalize ml-1 font-semibold" style={{ color: op.primary }}>{user?.operator} Sénégal</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-100 px-3 py-2 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Données en temps réel
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {kpis.map(({ label, value, sub, Icon, color, bg, trend }) => (
            <div key={label} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${trend > 0 ? "text-green-600" : "text-red-500"}`}>
                  {trend > 0 ? <ArrowTrendingUpIcon className="h-3.5 w-3.5" /> : <ArrowTrendingDownIcon className="h-3.5 w-3.5" />}
                  {Math.abs(trend)}%
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900">{value}</p>
              <p className="text-xs font-semibold text-slate-500">{label}</p>
              <p className="text-[11px] text-slate-400">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          {/* Évolution plaintes */}
          <div className="card p-5 xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-700">Évolution des plaintes (6 mois)</h2>
              <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">2026</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gPlaint" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={op.primary} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={op.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
                <Area type="monotone" dataKey="plaintes" stroke={op.primary} strokeWidth={2} fill="url(#gPlaint)" name="Plaintes" />
                <Area type="monotone" dataKey="resolues" stroke="#22c55e" strokeWidth={2} fill="none" strokeDasharray="4 2" name="Résolues" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Débit moyen */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-700">Débit moyen (Mbps)</h2>
              <span className="badge bg-green-50 text-green-700">QoS</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={24}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
                <Bar dataKey="qos" fill={op.primary} radius={[6,6,0,0]} name="Débit Mbps" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Seuil ARTP : 5 Mbps minimum
            </div>
          </div>
        </div>

        {/* Plaintes récentes à traiter */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h2 className="text-sm font-bold text-slate-700">Plaintes à traiter</h2>
            <Link to="/complaints" className="text-xs text-op-600 font-semibold flex items-center gap-1 hover:text-op-700">
              Voir toutes <ChevronRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {complaints.slice(0, 5).map(c => {
              const st = STATUS_MAP[c.status] ?? STATUS_MAP["submitted"];
              return (
                <Link key={c.id} to={`/complaints/${c.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                  <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${c.priority === "high" ? "bg-red-400" : c.priority === "medium" ? "bg-amber-400" : "bg-slate-200"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{c.subject}</p>
                    <p className="text-xs text-slate-400">{c.reference}</p>
                  </div>
                  <span className={`badge ${st.badge} flex-shrink-0`}>{st.label}</span>
                  <ChevronRightIcon className="h-4 w-4 text-slate-300 flex-shrink-0" />
                </Link>
              );
            })}
            {complaints.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-slate-400">
                <CheckCircleIcon className="h-10 w-10 mx-auto mb-2 text-green-300" />
                Aucune plainte en attente. Excellent !
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
