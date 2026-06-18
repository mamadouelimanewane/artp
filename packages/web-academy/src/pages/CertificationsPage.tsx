const CERTS = [
  { code: "CRA-1", title: "Certified Regulatory Analyst — Niveau 1", modules: 4, exam: "QCM 80 questions", validity: "3 ans", holders: 187, passing: 72 },
  { code: "CRA-2", title: "Certified Regulatory Analyst — Niveau 2", modules: 6, exam: "QCM + cas pratique", validity: "3 ans", holders: 94, passing: 65 },
  { code: "CSM", title: "Certified Spectrum Manager", modules: 3, exam: "Soutenance technique", validity: "5 ans", holders: 31, passing: 80 },
  { code: "CTL", title: "Certified Telecom Lawyer", modules: 5, exam: "Dissertation juridique", validity: "3 ans", holders: 48, passing: 68 },
];

const RECENT = [
  { name: "Amadou Diallo", cert: "CRA-1", country: "Sénégal", date: "2026-06-15", score: 87 },
  { name: "Fatou Sow", cert: "CRA-2", country: "Côte d'Ivoire", date: "2026-06-14", score: 91 },
  { name: "Moussa Camara", cert: "CSM", country: "Mali", date: "2026-06-12", score: 84 },
  { name: "Aïssatou Bah", cert: "CRA-1", country: "Guinée", date: "2026-06-10", score: 79 },
];

export default function CertificationsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Certifications</h1>
        <p className="text-slate-500 text-sm">Certifications professionnelles reconnues par les régulateurs africains</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CERTS.map(c => (
          <div key={c.code} className="card p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-acad-100 flex items-center justify-center text-acad-700 font-bold text-sm shrink-0">
                {c.code}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm leading-snug">{c.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Validité : {c.validity}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs mb-3">
              <div className="bg-slate-50 p-2 rounded-lg text-center">
                <p className="text-slate-400">Modules</p>
                <p className="font-bold text-slate-800">{c.modules}</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg text-center">
                <p className="text-slate-400">Certifiés</p>
                <p className="font-bold text-acad-700">{c.holders}</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg text-center">
                <p className="text-slate-400">Taux réussite</p>
                <p className="font-bold text-emerald-600">{c.passing}%</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-3">Examen : {c.exam}</p>
            <button className="w-full py-2 bg-acad-600 text-white text-xs rounded-xl font-semibold hover:bg-acad-700 transition-colors">
              Préparer la certification
            </button>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Certifications récentes</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
              <th className="pb-2 font-medium">Nom</th>
              <th className="pb-2 font-medium">Certification</th>
              <th className="pb-2 font-medium">Pays</th>
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Score</th>
            </tr>
          </thead>
          <tbody>
            {RECENT.map(r => (
              <tr key={r.name+r.date} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-2.5 font-medium text-slate-800">{r.name}</td>
                <td className="py-2.5"><span className="badge bg-acad-100 text-acad-700 font-mono text-[10px]">{r.cert}</span></td>
                <td className="py-2.5 text-slate-500">{r.country}</td>
                <td className="py-2.5 text-slate-500 text-xs">{r.date}</td>
                <td className="py-2.5 font-bold text-emerald-600">{r.score}/100</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
