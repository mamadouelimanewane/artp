const OPERATORS = [
  {
    name: "Orange SN",
    apis: ["KYC","Number Verify","Device Location"],
    status: "Partenaire actif",
    since: "2026-03-01",
    sla: "99.5%",
    compliance: 94,
    contact: "api.gateway@orange.sn",
  },
  {
    name: "Free SN",
    apis: ["KYC"],
    status: "Partenaire actif",
    since: "2026-05-15",
    sla: "98.2%",
    compliance: 81,
    contact: "api@free.sn",
  },
  {
    name: "Expresso SN",
    apis: ["Device Location"],
    status: "Integration en cours",
    since: "2026-06-01",
    sla: "N/A",
    compliance: 62,
    contact: "dsi@expresso.sn",
  },
];

const STATUS_STYLE: Record<string, string> = {
  "Partenaire actif": "bg-emerald-100 text-emerald-700",
  "Integration en cours": "bg-amber-100 text-amber-700",
  "Suspendu": "bg-red-100 text-red-700",
};

const REQS = [
  { req: "Accord de confidentialite (NDA) signe", Orange: true, Free: true, Expresso: true },
  { req: "API sandbox disponible", Orange: true, Free: true, Expresso: false },
  { req: "Environnement de production", Orange: true, Free: false, Expresso: false },
  { req: "Monitoring Datadog configure", Orange: true, Free: true, Expresso: false },
  { req: "SLA certifie ARTP", Orange: true, Free: false, Expresso: false },
  { req: "Audit securite passe", Orange: true, Free: true, Expresso: false },
];

export default function OperateursPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Operateurs partenaires</h1>
        <p className="text-slate-500 text-sm">Statut de conformite et d'integration des operateurs au programme Open Gateway</p>
      </div>

      {/* Cards operateurs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {OPERATORS.map(op => (
          <div key={op.name} className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-lg">{op.name}</h3>
              <span className={`badge ${STATUS_STYLE[op.status]}`}>{op.status}</span>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Depuis</span>
                <span className="text-slate-700">{op.since}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SLA</span>
                <span className="font-semibold text-slate-700">{op.sla}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Score conformite</span>
                <span className={`font-bold ${op.compliance >= 85 ? "text-emerald-600" : op.compliance >= 70 ? "text-amber-600" : "text-red-600"}`}>
                  {op.compliance}/100
                </span>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-xs text-slate-400 mb-1">APIs exposees</p>
              <div className="flex flex-wrap gap-1.5">
                {op.apis.map(a => (
                  <span key={a} className="badge bg-gw-100 text-gw-700 text-[10px]">{a}</span>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-400">{op.contact}</p>
          </div>
        ))}
      </div>

      {/* Compliance matrix */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Matrice de conformite</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs text-slate-500 font-medium">
              <th className="px-4 py-3 w-2/5">Exigence</th>
              {OPERATORS.map(op => <th key={op.name} className="px-4 py-3 text-center">{op.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {REQS.map(r => (
              <tr key={r.req} className="border-t border-slate-50 hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-700">{r.req}</td>
                {[r.Orange, r.Free, r.Expresso].map((v, i) => (
                  <td key={i} className="px-4 py-3 text-center">
                    <span className={`text-lg ${v ? "text-emerald-500" : "text-slate-300"}`}>{v ? "✓" : "✗"}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
