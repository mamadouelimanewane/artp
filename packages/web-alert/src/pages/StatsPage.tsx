import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const TREND = [
  { m: "Jan", total: 892, resolus: 812 },
  { m: "Fev", total: 1024, resolus: 941 },
  { m: "Mar", total: 987, resolus: 902 },
  { m: "Avr", total: 1156, resolus: 1043 },
  { m: "Mai", total: 1432, resolus: 1298 },
  { m: "Jun", total: 1699, resolus: 1284 },
];

const BY_OP = [
  { op: "Orange SN", total: 834, resolus: 791, score: 87 },
  { op: "Free SN", total: 612, resolus: 544, score: 72 },
  { op: "Expresso", total: 253, resolus: 209, score: 68 },
];

const RADAR_DATA = [
  { subject: "Debit", Orange: 78, Free: 62, Expresso: 55 },
  { subject: "Couverture", Orange: 82, Free: 71, Expresso: 59 },
  { subject: "Facturation", Orange: 91, Free: 75, Expresso: 70 },
  { subject: "Service", Orange: 88, Free: 68, Expresso: 63 },
  { subject: "Delai reponse", Orange: 94, Free: 72, Expresso: 66 },
];

export default function StatsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Statistiques</h1>
        <p className="text-slate-500 text-sm">Analyse des signalements citoyens — 6 derniers mois</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Tendance */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Evolution des signalements</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="m" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#f43f5e" strokeWidth={2} dot={{ r: 4 }} name="Recus" />
              <Line type="monotone" dataKey="resolus" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Resolus" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar qualite operateurs */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Score qualite de service (sur 100)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <Radar name="Orange" dataKey="Orange" stroke="#f97316" fill="#f97316" fillOpacity={0.15} />
              <Radar name="Free" dataKey="Free" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
              <Radar name="Expresso" dataKey="Expresso" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Par operateur */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Performance par operateur</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {BY_OP.map(op => (
            <div key={op.op} className="bg-slate-50 rounded-2xl p-4">
              <p className="font-bold text-slate-800 mb-2">{op.op}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Signalements</span>
                  <span className="font-semibold">{op.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Resolus</span>
                  <span className="font-semibold text-emerald-600">{op.resolus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Score QoS</span>
                  <span className={`font-bold ${op.score >= 80 ? "text-emerald-600" : op.score >= 70 ? "text-amber-600" : "text-red-600"}`}>
                    {op.score}/100
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div className={`h-1.5 rounded-full ${op.score >= 80 ? "bg-emerald-500" : op.score >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                    style={{ width: `${op.score}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={BY_OP} layout="vertical">
            <XAxis type="number" tick={{ fontSize: 10 }} />
            <YAxis dataKey="op" type="category" tick={{ fontSize: 11 }} width={80} />
            <Tooltip />
            <Bar dataKey="resolus" name="Resolus" fill="#10b981" radius={[0,4,4,0]} />
            <Bar dataKey="total" name="Total" fill="#f43f5e" radius={[0,4,4,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
