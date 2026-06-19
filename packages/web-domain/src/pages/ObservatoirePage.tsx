import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const ADOPTION = [
  { annee: "2019", domaines: 4200 },
  { annee: "2020", domaines: 5800 },
  { annee: "2021", domaines: 7400 },
  { annee: "2022", domaines: 9100 },
  { annee: "2023", domaines: 11200 },
  { annee: "2024", domaines: 13500 },
  { annee: "2025", domaines: 15800 },
  { annee: "2026", domaines: 18200 },
];

const SECTEURS = [
  { secteur: "Commerce & E-commerce", count: 4200, pct: 23 },
  { secteur: "Services financiers", count: 2800, pct: 15 },
  { secteur: "Administration publique", count: 2100, pct: 12 },
  { secteur: "Médias & Communication", count: 1900, pct: 10 },
  { secteur: "Éducation", count: 1600, pct: 9 },
  { secteur: "Santé", count: 1200, pct: 7 },
  { secteur: "Agriculture & Agritech", count: 900, pct: 5 },
  { secteur: "Autres", count: 3500, pct: 19 },
];

const COMPARATIF = [
  { pays: ".sn (Sénégal)", domaines: 18200, croissance: "+15%", rang: 3 },
  { pays: ".ci (Côte d'Ivoire)", domaines: 24500, croissance: "+18%", rang: 1 },
  { pays: ".cm (Cameroun)", domaines: 21000, croissance: "+12%", rang: 2 },
  { pays: ".bj (Bénin)", domaines: 8400, croissance: "+22%", rang: 5 },
  { pays: ".ml (Mali)", domaines: 6200, croissance: "+9%", rang: 6 },
  { pays: ".tg (Togo)", domaines: 9800, croissance: "+17%", rang: 4 },
];

export default function ObservatoirePage() {
  const [tab, setTab] = useState<"adoption" | "secteurs" | "comparatif" | "programme">("adoption");

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Observatoire Économie Numérique .sn</h1>
        <p className="text-slate-500 text-sm">Baromètre de la présence en ligne des entreprises sénégalaises</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Domaines actifs", value: "18 247", color: "text-blue-600" },
          { label: "Nouveaux / mois", value: "+247", color: "text-emerald-600" },
          { label: "Taux renouvellement", value: "87%", color: "text-amber-600" },
          { label: "Rang Afrique de l'Ouest", value: "#3", color: "text-violet-600" },
        ].map((k) => (
          <div key={k.label} className="card p-3 text-center">
            <p className={`text-xl font-black ${k.color}`}>{k.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
        {[["adoption", "Évolution"], ["secteurs", "Secteurs"], ["comparatif", "CEDEAO"], ["programme", "Programme .sn"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as typeof tab)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${tab === k ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === "adoption" && (
        <div className="space-y-4">
          <div className="card p-4">
            <p className="text-sm font-semibold text-slate-700 mb-4">Évolution des domaines .sn (2019-2026)</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={ADOPTION}>
                <XAxis dataKey="annee" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [v.toLocaleString(), "Domaines"]} />
                <Line type="monotone" dataKey="domaines" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-4 bg-emerald-50 border border-emerald-200">
            <p className="text-sm font-semibold text-emerald-800">Objectif ARTP 2030 : 50 000 domaines .sn</p>
            <div className="mt-2 bg-emerald-100 rounded-full h-3">
              <div className="h-3 rounded-full bg-emerald-500" style={{ width: "36%" }} />
            </div>
            <p className="text-xs text-emerald-700 mt-1">18 247 / 50 000 — 36% de l'objectif</p>
          </div>
        </div>
      )}

      {tab === "secteurs" && (
        <div className="space-y-4">
          <div className="card p-4">
            <p className="text-sm font-semibold text-slate-700 mb-4">Répartition par secteur d'activité</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={SECTEURS.slice(0, 6)} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="secteur" tick={{ fontSize: 9 }} width={130} />
                <Tooltip formatter={(v: number) => [v.toLocaleString(), "Domaines"]} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {SECTEURS.map((s) => (
              <div key={s.secteur} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 flex-1">{s.secteur}</span>
                <div className="w-24 bg-slate-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${s.pct * 4}%` }} />
                </div>
                <span className="text-xs font-bold text-indigo-600 w-8 text-right">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "comparatif" && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">Comparatif des TLD africains — Afrique de l'Ouest</p>
          {COMPARATIF.sort((a, b) => a.rang - b.rang).map((c) => (
            <div key={c.pays} className={`card p-4 ${c.pays.includes("sn") ? "border-blue-200 bg-blue-50" : ""}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black
                    ${c.rang === 1 ? "bg-amber-400 text-white" : c.rang === 2 ? "bg-slate-300 text-slate-700" : c.rang === 3 ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                    #{c.rang}
                  </span>
                  <span className={`font-semibold text-sm ${c.pays.includes("sn") ? "text-blue-700" : "text-slate-700"}`}>{c.pays}</span>
                </div>
                <span className="badge bg-emerald-100 text-emerald-700 text-xs">{c.croissance}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: `${(c.domaines / 25000) * 100}%` }} />
                </div>
                <span className="text-xs font-bold text-slate-600">{c.domaines.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "programme" && (
        <div className="space-y-4">
          <div className="card p-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <h3 className="text-lg font-black mb-2">Programme « Sénégal.sn »</h3>
            <p className="text-sm text-blue-100">Campagne nationale d'incitation à l'adoption du domaine .sn</p>
          </div>

          {[
            { titre: "Tarifs préférentiels PME", desc: "50% de réduction sur l'enregistrement .sn pour les PME sénégalaises (CA < 100M FCFA)", badge: "Actif", color: "emerald" },
            { titre: "Programme Startups", desc: "Domaine .sn gratuit la 1ère année pour les startups incubées (Jokkolabs, CTIC, Dakar Hub)", badge: "Actif", color: "emerald" },
            { titre: "Institutions publiques", desc: "Obligation de .sn pour tous les sites gouvernementaux et établissements publics d'ici 2027", badge: "En cours", color: "amber" },
            { titre: "Formation registrars", desc: "Programme de certification des bureaux d'enregistrement accrédités ARTP", badge: "Planifié", color: "blue" },
            { titre: "Sensibilisation universités", desc: "Partenariat UCAD / UGB / ESP pour promouvoir le .sn dans les projets étudiants", badge: "Planifié", color: "blue" },
          ].map((p) => (
            <div key={p.titre} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-slate-800 text-sm">{p.titre}</p>
                <span className={`badge text-[10px] font-semibold
                  ${p.color === "emerald" ? "bg-emerald-100 text-emerald-700" : p.color === "amber" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                  {p.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500">{p.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
