const REGISTRARS = [
  { name: "NIC Sénégal", accredited: "2001-01-01", domains: 8420, status: "Accrédité", score: 98 },
  { name: "Dakar Telecom Services", accredited: "2008-03-15", domains: 2140, status: "Accrédité", score: 91 },
  { name: "Orange Business SN", accredited: "2012-07-01", domains: 1087, status: "Accrédité", score: 89 },
  { name: "Africahosting SN", accredited: "2015-09-20", domains: 742, status: "Accrédité", score: 84 },
  { name: "WebSenegal Pro", accredited: "2018-04-12", domains: 318, status: "Accrédité", score: 79 },
  { name: "SN Digital Hub", accredited: "2021-11-05", domains: 87, status: "Probatoire", score: 71 },
  { name: "Technova SN", accredited: "2023-06-30", domains: 53, status: "Probatoire", score: 68 },
];

const STATUS_STYLES: Record<string, string> = {
  "Accrédité": "bg-emerald-100 text-emerald-700",
  "Probatoire": "bg-amber-100 text-amber-700",
  "Suspendu": "bg-red-100 text-red-700",
};

export default function RegistrarsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Registrars Agréés</h1>
        <p className="text-slate-500 text-sm">Bureaux d'enregistrement accrédités ARTP · Score de conformité</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4"><p className="text-xs text-slate-500">Registrars actifs</p><p className="text-2xl font-bold text-slate-900">{REGISTRARS.length}</p></div>
        <div className="card p-4"><p className="text-xs text-slate-500">Accrédités</p><p className="text-2xl font-bold text-emerald-600">{REGISTRARS.filter(r=>r.status==="Accrédité").length}</p></div>
        <div className="card p-4"><p className="text-xs text-slate-500">En probatoire</p><p className="text-2xl font-bold text-amber-600">{REGISTRARS.filter(r=>r.status==="Probatoire").length}</p></div>
      </div>

      <div className="space-y-2">
        {REGISTRARS.sort((a,b)=>b.domains-a.domains).map((r, i) => (
          <div key={r.name} className="card p-4 flex items-center gap-4">
            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm flex items-center justify-center shrink-0">
              {i+1}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-slate-800">{r.name}</p>
                <span className={`badge ${STATUS_STYLES[r.status]}`}>{r.status}</span>
              </div>
              <p className="text-xs text-slate-500">Agréé depuis {r.accredited} · {r.domains.toLocaleString()} domaines gérés</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
                  <div
                    className={`h-1.5 rounded-full ${r.score >= 90 ? "bg-emerald-500" : r.score >= 75 ? "bg-amber-400" : "bg-red-400"}`}
                    style={{ width: `${r.score}%` }}
                  />
                </div>
                <span className={`text-xs font-bold ${r.score >= 90 ? "text-emerald-600" : r.score >= 75 ? "text-amber-600" : "text-red-600"}`}>
                  Score {r.score}/100
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
