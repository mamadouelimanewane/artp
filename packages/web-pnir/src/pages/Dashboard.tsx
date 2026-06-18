import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const KPIS = [
  { label: "Décisions analysées", value: "1 247", delta: "+12%", color: "bg-pnir-100 text-pnir-800" },
  { label: "Alertes actives", value: "8", delta: "+2", color: "bg-amber-100 text-amber-800" },
  { label: "Conformité opérateurs", value: "87%", delta: "+3%", color: "bg-emerald-100 text-emerald-800" },
  { label: "Veille IA (sources)", value: "142", delta: "+5", color: "bg-blue-100 text-blue-800" },
];

const TREND = [
  { m: "Jan", decisions: 82, infractions: 4 },
  { m: "Fév", decisions: 98, infractions: 6 },
  { m: "Mar", decisions: 114, infractions: 3 },
  { m: "Avr", decisions: 127, infractions: 8 },
  { m: "Mai", decisions: 143, infractions: 5 },
  { m: "Jun", decisions: 158, infractions: 7 },
];

const MARKET_SHARE = [
  { name: "Orange", value: 47, color: "#f97316" },
  { name: "Free", value: 34, color: "#3b82f6" },
  { name: "Expresso", value: 14, color: "#8b5cf6" },
  { name: "Autres", value: 5, color: "#94a3b8" },
];

const ALERTS = [
  { id: 1, title: "Orange SN : dépassement taux résiliation", severity: "high", time: "Il y a 2h" },
  { id: 2, title: "Tarifs interconnexion non déclarés", severity: "medium", time: "Il y a 5h" },
  { id: 3, title: "Free : non-conformité couverture zone rurale", severity: "medium", time: "Il y a 1j" },
  { id: 4, title: "Domaine .sn cybersquatting détecté", severity: "low", time: "Il y a 2j" },
];

const sev = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Exécutif</h1>
        <p className="text-slate-500 text-sm">Plateforme Nationale d'Intelligence Régulatoire · Sénégal 2026</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map(k => (
          <div key={k.label} className="card p-4">
            <p className="text-xs text-slate-500 mb-1">{k.label}</p>
            <p className="text-2xl font-bold text-slate-900">{k.value}</p>
            <span className={`badge mt-1 ${k.color}`}>{k.delta}</span>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Tendance */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-semibold text-slate-800 mb-4">Décisions & Infractions (6 mois)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={TREND}>
              <XAxis dataKey="m" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="decisions" stroke="#7c3aed" fill="#ede9fe" strokeWidth={2} name="Décisions" />
              <Area type="monotone" dataKey="infractions" stroke="#ef4444" fill="#fee2e2" strokeWidth={2} name="Infractions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Parts de marché */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Parts de marché</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={MARKET_SHARE} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {MARKET_SHARE.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {MARKET_SHARE.map(e => (
              <div key={e.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: e.color }} />
                  {e.name}
                </div>
                <span className="font-semibold text-slate-700">{e.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertes */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Alertes Régulatoires</h2>
        <div className="space-y-2">
          {ALERTS.map(a => (
            <div key={a.id} className={`flex items-center justify-between p-3 rounded-xl border ${sev[a.severity as keyof typeof sev]}`}>
              <div className="flex items-center gap-3">
                <span className="text-base">{a.severity === "high" ? "🔴" : a.severity === "medium" ? "🟡" : "⚪"}</span>
                <span className="text-sm font-medium">{a.title}</span>
              </div>
              <span className="text-xs opacity-70">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
