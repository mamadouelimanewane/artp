import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const STATS = [
  { name: "DNSSEC activé", value: 8736, color: "#10b981" },
  { name: "Sans DNSSEC", value: 4111, color: "#e2e8f0" },
];

const ZONES = [
  { zone: ".sn", dnssec: true, algorithm: "ECDSA P-256", keyTag: 12847, lastSigned: "2026-06-17" },
  { zone: ".gouv.sn", dnssec: true, algorithm: "RSA-SHA256", keyTag: 41200, lastSigned: "2026-06-17" },
  { zone: ".edu.sn", dnssec: true, algorithm: "ECDSA P-256", keyTag: 28710, lastSigned: "2026-06-16" },
  { zone: ".com.sn", dnssec: false, algorithm: "—", keyTag: null, lastSigned: "—" },
  { zone: ".org.sn", dnssec: false, algorithm: "—", keyTag: null, lastSigned: "—" },
];

const ALERTS = [
  { type: "Clé DNSKEY bientôt expirée", zone: ".com.sn", severity: "warning", date: "2026-06-15" },
  { type: "Signature DS absente", zone: ".org.sn", severity: "warning", date: "2026-06-14" },
];

export default function DnssecPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">DNSSEC & Sécurité DNS</h1>
        <p className="text-slate-500 text-sm">Validation des signatures · Gestion des clés · Conformité zones</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-5 flex flex-col items-center">
          <h2 className="font-semibold text-slate-800 mb-3 self-start">Taux d'adoption DNSSEC</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={STATS} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2}>
                {STATS.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => v.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-3xl font-bold text-spec-600 mt-2">68%</p>
          <p className="text-xs text-slate-500">des domaines .sn signés</p>
        </div>

        <div className="card p-5 lg:col-span-2">
          <h2 className="font-semibold text-slate-800 mb-4">État des zones DNS</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                <th className="pb-2 font-medium">Zone</th>
                <th className="pb-2 font-medium">DNSSEC</th>
                <th className="pb-2 font-medium">Algorithme</th>
                <th className="pb-2 font-medium">Dernière signature</th>
              </tr>
            </thead>
            <tbody>
              {ZONES.map(z => (
                <tr key={z.zone} className="border-b border-slate-50">
                  <td className="py-2.5 font-mono text-xs font-bold text-dom-600">{z.zone}</td>
                  <td className="py-2.5">
                    {z.dnssec
                      ? <span className="badge bg-emerald-100 text-emerald-700">✓ Activé</span>
                      : <span className="badge bg-red-100 text-red-600">✗ Désactivé</span>
                    }
                  </td>
                  <td className="py-2.5 text-xs text-slate-500 font-mono">{z.algorithm}</td>
                  <td className="py-2.5 text-xs text-slate-500">{z.lastSigned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {ALERTS.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-3">Alertes DNSSEC</h2>
          <div className="space-y-2">
            {ALERTS.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <span>⚠️</span>
                  <div>
                    <p className="text-sm font-semibold text-amber-800">{a.type}</p>
                    <p className="text-xs text-amber-600">Zone : {a.zone} · {a.date}</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-amber-600 text-white text-xs rounded-lg hover:bg-amber-700 transition-colors">
                  Corriger
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
