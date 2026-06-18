import { useState } from "react";

const DATASETS = [
  {
    id: "qos-mobile",
    title: "Qualite de service mobile",
    category: "QoS",
    description: "Mesures QoS terrain par operateur, region et technologie. Inclut debit descendant/montant, latence, taux de succes appels.",
    rows: 48392,
    size: "12.4 MB",
    updated: "2026-06-17",
    formats: ["CSV","JSON","API"],
    license: "ODbL 1.0",
    fields: ["date","region","operateur","technologie","download_mbps","upload_mbps","latence_ms","taux_succes"],
  },
  {
    id: "coverage",
    title: "Couverture reseau nationale",
    category: "Couverture",
    description: "Polygones de couverture 2G/3G/4G/5G par operateur. Granularite commune. Source : declarations operateurs + mesures ARTP.",
    rows: 14213,
    size: "48.7 MB",
    updated: "2026-06-01",
    formats: ["GeoJSON","CSV","API"],
    license: "ODbL 1.0",
    fields: ["commune","departement","region","operateur","technologie","couverture_pct","population_couverte"],
  },
  {
    id: "complaints",
    title: "Statistiques plaintes agregees",
    category: "Plaintes",
    description: "Donnees anonymisees et agregees des plaintes recues par l'ARTP. Par type, operateur et mois. Aucune donnee personnelle.",
    rows: 3841,
    size: "0.8 MB",
    updated: "2026-06-15",
    formats: ["CSV","JSON"],
    license: "Licence Ouverte 2.0",
    fields: ["annee","mois","operateur","type_plainte","region","nombre","resolues","delai_moyen_jours"],
  },
  {
    id: "spectrum",
    title: "Licences spectre radioelectrique",
    category: "Spectre",
    description: "Registre public des licences d'utilisation du spectre au Senegal. Bandes, titulaires, zones et dates.",
    rows: 247,
    size: "0.1 MB",
    updated: "2026-05-30",
    formats: ["JSON","CSV","API"],
    license: "Licence Ouverte 2.0",
    fields: ["licence_id","bande_mhz","plage_frequences","titulaire","technologie","zone","date_attribution","date_expiration"],
  },
];

export default function DatasetsPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Datasets</h1>
        <p className="text-slate-500 text-sm">Toutes les donnees sont sous licence ouverte — telechargement libre</p>
      </div>
      {DATASETS.map(d => (
        <div key={d.id} className="card overflow-hidden">
          <div
            className="p-5 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => setSelected(selected === d.id ? null : d.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-800">{d.title}</h3>
                  <span className="badge bg-od-100 text-od-700">{d.category}</span>
                </div>
                <p className="text-sm text-slate-500 mb-2">{d.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>{d.rows.toLocaleString()} lignes</span>
                  <span>{d.size}</span>
                  <span>MAJ {d.updated}</span>
                  <span className="text-emerald-600 font-semibold">{d.license}</span>
                </div>
              </div>
              <div className="flex gap-1.5 ml-4 shrink-0">
                {d.formats.map(f => (
                  <span key={f} className="badge bg-slate-100 text-slate-600 font-mono text-[10px]">{f}</span>
                ))}
              </div>
            </div>
          </div>

          {selected === d.id && (
            <div className="border-t border-slate-100 p-5 bg-slate-50 space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Champs disponibles</p>
                <div className="flex flex-wrap gap-1.5">
                  {d.fields.map(f => (
                    <code key={f} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs text-od-700 font-mono">{f}</code>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-od-600 text-white text-xs font-semibold rounded-xl hover:bg-od-700 transition-colors">
                  Telecharger CSV
                </button>
                <button className="px-4 py-2 bg-slate-700 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors">
                  Telecharger JSON
                </button>
                {d.formats.includes("API") && (
                  <button className="px-4 py-2 bg-white border border-od-300 text-od-700 text-xs font-semibold rounded-xl hover:bg-od-50 transition-colors">
                    Voir endpoint API
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
