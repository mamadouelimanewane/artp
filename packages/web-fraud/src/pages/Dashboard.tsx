import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const KPIS = [
  { label: "Incidents ouverts", value: "23", delta: "+3 ce mois", color: "bg-red-100 text-red-800" },
  { label: "SIM frauduleuses", value: "1 847", delta: "-12% vs trim.", color: "bg-orange-100 text-orange-800" },
  { label: "SVA non conformes", value: "34", delta: "+5 signalés", color: "bg-amber-100 text-amber-800" },
  { label: "Montant fraude (FCFA)", value: "2.3M", delta: "Estimé", color: "bg-slate-100 text-slate-700" },
];

const MONTHLY = [
  { m: "Jan", sim: 320, sva: 8, incidents: 5 },
  { m: "Fév", sim: 280, sva: 6, incidents: 4 },
  { m: "Mar", sim: 410, sva: 11, incidents: 7 },
  { m: "Avr", sim: 350, sva: 9, incidents: 6 },
  { m: "Mai", sim: 290, sva: 7, incidents: 4 },
  { m: "Jun", sim: 197, sva: 5, incidents: 3 },
];

const RECENT = [
  { id: "FR-2026-0023", type: "SIM", operator: "Orange SN", status: "Ouvert", date: "2026-06-17" },
  { id: "FR-2026-0022", type: "SVA", operator: "Free SN", status: "En cours", date: "2026-06-16" },
  { id: "FR-2026-0021", type: "Fraude vocale", operator: "Expresso", status: "Résolu", date: "2026-06-14" },
  { id: "FR-2026-0020", type: "SIM", operator: "Orange SN", status: "Résolu", date: "2026-06-12" },
];

const statusColor: Record<string, string> = {
  "Ouvert": "bg-red-100 text-red-700",
  "En cours": "bg-amber-100 text-amber-700",
  "Résolu": "bg-emerald-100 text-emerald-700",
};

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Fraude Télécom</h1>
        <p className="text-slate-500 text-sm">SILFT — Système Intégré de Lutte contre la Fraude · Temps réel</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* SIM frauduleuses par mois */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">SIM frauduleuses détectées</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY}>
              <XAxis dataKey="m" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="sim" fill="#ef4444" radius={[4,4,0,0]} name="SIM frauduleuses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Incidents mensuels */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Incidents mensuels</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="m" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="incidents" stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} name="Incidents" />
              <Line type="monotone" dataKey="sva" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} name="SVA" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Incidents récents */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Incidents récents</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
              <th className="pb-2 font-medium">Référence</th>
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Opérateur</th>
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {RECENT.map(r => (
              <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-2.5 font-mono text-xs text-pnir-700">{r.id}</td>
                <td className="py-2.5 text-slate-700">{r.type}</td>
                <td className="py-2.5 text-slate-600">{r.operator}</td>
                <td className="py-2.5 text-slate-500">{r.date}</td>
                <td className="py-2.5">
                  <span className={`badge ${statusColor[r.status]}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
