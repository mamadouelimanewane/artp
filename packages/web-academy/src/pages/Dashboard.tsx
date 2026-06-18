import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const KPIS = [
  { label: "Apprenants inscrits", value: "1 284", delta: "+127 ce mois", color: "bg-acad-100 text-acad-800" },
  { label: "Modules disponibles", value: "34", delta: "8 langues", color: "bg-emerald-100 text-emerald-700" },
  { label: "Certifiés 2026", value: "312", delta: "+48%", color: "bg-purple-100 text-purple-700" },
  { label: "Pays participants", value: "12", delta: "Afrique francophone", color: "bg-amber-100 text-amber-700" },
];

const MONTHLY_COMPLETIONS = [
  { m: "Jan", completions: 38, certifications: 12 },
  { m: "Fév", completions: 45, certifications: 18 },
  { m: "Mar", completions: 52, certifications: 21 },
  { m: "Avr", completions: 61, certifications: 25 },
  { m: "Mai", completions: 58, certifications: 28 },
  { m: "Jun", completions: 74, certifications: 34 },
];

const TOP_MODULES = [
  { name: "Droit des télécom", enrolled: 342, completion: 78 },
  { name: "Régulation mobile", enrolled: 287, completion: 71 },
  { name: "Cybersécurité télécom", enrolled: 241, completion: 65 },
  { name: "Gestion du spectre", enrolled: 198, completion: 82 },
  { name: "QoS & Mesures", enrolled: 176, completion: 69 },
];

const UPCOMING = [
  { title: "Régulation 5G en Afrique", date: "2026-06-25", seats: 30, enrolled: 22, lang: "FR" },
  { title: "DNSSEC & Sécurité DNS", date: "2026-07-02", seats: 25, enrolled: 18, lang: "FR/EN" },
  { title: "Lutte contre la fraude télécom", date: "2026-07-10", seats: 40, enrolled: 35, lang: "FR" },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">ADR-ARTP — Académie Digitale de Régulation</h1>
        <p className="text-slate-500 text-sm">E-learning · Certifications · Formation régulateurs Afrique</p>
      </div>

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
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Complétions & Certifications mensuelles</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_COMPLETIONS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="m" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="completions" stroke="#0284c7" strokeWidth={2} dot={{ r: 4 }} name="Complétions" />
              <Line type="monotone" dataKey="certifications" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4 }} name="Certifications" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Top modules par inscrits</h2>
          <div className="space-y-3">
            {TOP_MODULES.map(m => (
              <div key={m.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">{m.name}</span>
                  <span className="text-slate-500">{m.enrolled} inscrits · <span className="font-semibold text-acad-600">{m.completion}%</span></span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full">
                  <div className="h-2 bg-acad-500 rounded-full" style={{ width: `${m.completion}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Sessions live à venir</h2>
        <div className="space-y-2">
          {UPCOMING.map(s => (
            <div key={s.title} className="flex items-center justify-between p-3 bg-acad-50 rounded-xl border border-acad-100">
              <div>
                <p className="font-semibold text-slate-800 text-sm">{s.title}</p>
                <p className="text-xs text-slate-500">{s.date} · Langue : {s.lang}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-acad-700">{s.enrolled}/{s.seats}</p>
                <p className="text-xs text-slate-400">places</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
