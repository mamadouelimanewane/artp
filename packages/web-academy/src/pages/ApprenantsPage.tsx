import { useState } from "react";

const LEARNERS = [
  { id: "APR-001", name: "Moussa Diop", country: "Sénégal", org: "ARTP", enrolled: 3, completed: 2, cert: "CRA-1", progress: 78 },
  { id: "APR-002", name: "Fatou Kouyaté", country: "Mali", org: "AMRTP", enrolled: 2, completed: 1, cert: null, progress: 45 },
  { id: "APR-003", name: "Ibrahim Traoré", country: "Burkina", org: "ARCEP BF", enrolled: 4, completed: 3, cert: "CRA-2", progress: 92 },
  { id: "APR-004", name: "Adama Coulibaly", country: "Côte d'Ivoire", org: "ARTCI", enrolled: 1, completed: 0, cert: null, progress: 22 },
  { id: "APR-005", name: "Mariama Balde", country: "Guinée", org: "ARPT", enrolled: 3, completed: 2, cert: "CRA-1", progress: 65 },
];

const COUNTRIES = [
  { country: "Sénégal", learners: 487 },
  { country: "Côte d'Ivoire", learners: 214 },
  { country: "Mali", learners: 178 },
  { country: "Burkina Faso", learners: 143 },
  { country: "Guinée", learners: 98 },
  { country: "Autres", learners: 164 },
];

export default function ApprenantsPage() {
  const [search, setSearch] = useState("");

  const filtered = LEARNERS.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.country.toLowerCase().includes(search.toLowerCase()) ||
    l.org.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Apprenants</h1>
        <p className="text-slate-500 text-sm">Suivi individuel · Progression · Certifications obtenues</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {COUNTRIES.map(c => (
          <div key={c.country} className="card p-3 flex items-center justify-between">
            <span className="text-sm text-slate-700 font-medium">{c.country}</span>
            <span className="text-lg font-bold text-acad-700">{c.learners}</span>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <input
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-acad-400"
          placeholder="Rechercher un apprenant, pays ou organisation…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {filtered.map(l => (
          <div key={l.id} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-800">{l.name}</p>
                  {l.cert && <span className="badge bg-acad-100 text-acad-700 font-mono text-[10px]">{l.cert}</span>}
                </div>
                <p className="text-xs text-slate-500">{l.org} · {l.country}</p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>{l.completed}/{l.enrolled} modules</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-100 rounded-full">
                <div
                  className={`h-2 rounded-full ${l.progress >= 80 ? "bg-emerald-500" : l.progress >= 50 ? "bg-acad-500" : "bg-amber-400"}`}
                  style={{ width: `${l.progress}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-600">{l.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
