import { useState } from "react";

const DOMAINS = [
  { domain: "artp.sn", owner: "ARTP Sénégal", registrar: "NIC Sénégal", created: "2001-04-12", expires: "2027-04-12", dnssec: true, status: "active" },
  { domain: "orange.sn", owner: "Orange SN SA", registrar: "NIC Sénégal", created: "2003-07-20", expires: "2026-07-20", dnssec: true, status: "expiring" },
  { domain: "free.sn", owner: "Free Sénégal", registrar: "Dakar Telecom", created: "2010-01-15", expires: "2027-01-15", dnssec: false, status: "active" },
  { domain: "senelec.sn", owner: "SENELEC", registrar: "NIC Sénégal", created: "2005-03-08", expires: "2028-03-08", dnssec: true, status: "active" },
  { domain: "sen-finances.gouv.sn", owner: "Min. Finances", registrar: "NIC Sénégal", created: "2008-09-01", expires: "2027-09-01", dnssec: true, status: "active" },
  { domain: "senuniversites.edu.sn", owner: "Min. Enseignement", registrar: "NIC Sénégal", created: "2012-02-14", expires: "2026-08-14", dnssec: false, status: "expiring" },
];

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  expiring: "bg-amber-100 text-amber-700",
  suspended: "bg-red-100 text-red-700",
};

export default function RegistrePage() {
  const [search, setSearch] = useState("");

  const filtered = DOMAINS.filter(d =>
    d.domain.includes(search) || d.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Registre .sn</h1>
        <p className="text-slate-500 text-sm">Base de données officielle ccTLD Sénégal</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4"><p className="text-xs text-slate-500">Total domaines</p><p className="text-2xl font-bold text-slate-900">12 847</p></div>
        <div className="card p-4"><p className="text-xs text-slate-500">Expirant sous 90j</p><p className="text-2xl font-bold text-amber-600">48</p></div>
        <div className="card p-4"><p className="text-xs text-slate-500">DNSSEC activé</p><p className="text-2xl font-bold text-spec-600">68%</p></div>
      </div>

      <div className="card p-4">
        <input
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dom-400"
          placeholder="Rechercher un domaine ou propriétaire…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-left text-xs text-slate-500">
              <th className="px-4 py-3 font-medium">Domaine</th>
              <th className="px-4 py-3 font-medium">Propriétaire</th>
              <th className="px-4 py-3 font-medium">Registrar</th>
              <th className="px-4 py-3 font-medium">Expiration</th>
              <th className="px-4 py-3 font-medium">DNSSEC</th>
              <th className="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.domain} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-bold text-dom-600">{d.domain}</td>
                <td className="px-4 py-3 text-slate-700">{d.owner}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{d.registrar}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{d.expires}</td>
                <td className="px-4 py-3">
                  {d.dnssec
                    ? <span className="badge bg-emerald-100 text-emerald-700">✓ Oui</span>
                    : <span className="badge bg-slate-100 text-slate-500">Non</span>
                  }
                </td>
                <td className="px-4 py-3"><span className={`badge ${STATUS_STYLES[d.status]}`}>{d.status === "active" ? "Actif" : d.status === "expiring" ? "Expire bientôt" : "Suspendu"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
