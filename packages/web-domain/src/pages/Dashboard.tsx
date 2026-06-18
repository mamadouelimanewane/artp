import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

const KPIS = [
  { label: "Domaines .sn actifs", value: "12 847", delta: "+234 ce mois", color: "bg-dom-100 text-dom-800" },
  { label: "Nouveaux enregistrements", value: "234", delta: "Ce mois", color: "bg-emerald-100 text-emerald-700" },
  { label: "Signalements cybersquatting", value: "18", delta: "+3 en cours", color: "bg-red-100 text-red-700" },
  { label: "Registrars agréés", value: "7", delta: "Actifs", color: "bg-blue-100 text-blue-700" },
];

const TLD_DIST = [
  { name: ".sn", value: 12847, color: "#ea580c" },
  { name: ".gouv.sn", value: 412, color: "#3b82f6" },
  { name: ".edu.sn", value: 287, color: "#10b981" },
  { name: ".com.sn", value: 3241, color: "#8b5cf6" },
  { name: ".org.sn", value: 894, color: "#f59e0b" },
];

const MONTHLY = [
  { m: "Jan", new: 180, expired: 42 },
  { m: "Fév", new: 210, expired: 38 },
  { m: "Mar", new: 195, expired: 51 },
  { m: "Avr", new: 228, expired: 44 },
  { m: "Mai", new: 245, expired: 39 },
  { m: "Jun", new: 234, expired: 47 },
];

const RECENT_REGISTRATIONS = [
  { domain: "artp.sn", registrar: "NIC Sénégal", date: "2026-06-17", status: "Actif" },
  { domain: "banque-centrale.sn", registrar: "NIC Sénégal", date: "2026-06-16", status: "Actif" },
  { domain: "senelec.sn", registrar: "Dakar Telecom", date: "2026-06-15", status: "Actif" },
  { domain: "ministere-finances.gouv.sn", registrar: "NIC Sénégal", date: "2026-06-14", status: "Actif" },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">RegTech .sn — Registre Domaines</h1>
        <p className="text-slate-500 text-sm">Gestion ccTLD .sn · DNSSEC · Anti-cybersquatting</p>
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
          <h2 className="font-semibold text-slate-800 mb-4">Distribution par TLD</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={TLD_DIST} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {TLD_DIST.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => v.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {TLD_DIST.map(e => (
              <div key={e.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
                <span className="text-slate-600">{e.name}</span>
                <span className="font-semibold text-slate-800 ml-auto">{e.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Enregistrements & Expirations</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY}>
              <XAxis dataKey="m" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="new" fill="#ea580c" radius={[4,4,0,0]} name="Nouveaux" />
              <Bar dataKey="expired" fill="#94a3b8" radius={[4,4,0,0]} name="Expirés" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Derniers enregistrements</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
              <th className="pb-2 font-medium">Domaine</th>
              <th className="pb-2 font-medium">Registrar</th>
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_REGISTRATIONS.map(r => (
              <tr key={r.domain} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-2.5 font-mono text-xs text-dom-600 font-semibold">{r.domain}</td>
                <td className="py-2.5 text-slate-600">{r.registrar}</td>
                <td className="py-2.5 text-slate-500">{r.date}</td>
                <td className="py-2.5"><span className="badge bg-emerald-100 text-emerald-700">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
