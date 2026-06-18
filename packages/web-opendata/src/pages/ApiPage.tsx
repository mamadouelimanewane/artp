import { useState } from "react";

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/qos",
    title: "Mesures QoS",
    description: "Retourne les mesures de qualite de service. Filtrable par operateur, region, technologie et periode.",
    params: [
      { name: "operateur", type: "string", desc: "Orange, Free, Expresso (optionnel)" },
      { name: "region", type: "string", desc: "Code region ISO (optionnel)" },
      { name: "from", type: "date", desc: "Date debut YYYY-MM-DD (optionnel)" },
      { name: "to", type: "date", desc: "Date fin YYYY-MM-DD (optionnel)" },
      { name: "limit", type: "integer", desc: "Max resultats, defaut 100 (max 1000)" },
      { name: "format", type: "string", desc: "json | csv (defaut: json)" },
    ],
    example: `curl "https://data.artp.sn/api/v1/qos?operateur=Orange&region=DK&limit=10"`,
    response: `{
  "meta": { "total": 4821, "page": 1, "limit": 10 },
  "data": [
    {
      "date": "2026-06-17",
      "region": "Dakar",
      "operateur": "Orange SN",
      "technologie": "4G",
      "download_mbps": 24.3,
      "upload_mbps": 8.1,
      "latence_ms": 42,
      "taux_succes": 97.4
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/coverage",
    title: "Couverture reseau",
    description: "Taux de couverture reseau par commune, operateur et technologie.",
    params: [
      { name: "operateur", type: "string", desc: "Filtre par operateur" },
      { name: "technologie", type: "string", desc: "2G | 3G | 4G | 5G" },
      { name: "region", type: "string", desc: "Filtre par region" },
    ],
    example: `curl "https://data.artp.sn/api/v1/coverage?technologie=4G&region=DK"`,
    response: `{
  "data": [
    {
      "commune": "Dakar Plateau",
      "region": "Dakar",
      "operateur": "Orange SN",
      "technologie": "4G",
      "couverture_pct": 99.2,
      "population_couverte": 321480
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/spectrum",
    title: "Licences spectre",
    description: "Registre public des licences d'utilisation du spectre radioelectrique.",
    params: [
      { name: "bande", type: "string", desc: "Filtre par bande (700, 900, 1800...)" },
      { name: "titulaire", type: "string", desc: "Nom du titulaire de licence" },
    ],
    example: `curl "https://data.artp.sn/api/v1/spectrum?bande=700"`,
    response: `{
  "data": [
    {
      "licence_id": "SN-SPE-700-001",
      "bande_mhz": 700,
      "plage": "703-748 / 758-803 MHz",
      "titulaire": "Orange SN",
      "technologie": "4G LTE",
      "zone": "National",
      "expiration": "2030-12-31"
    }
  ]
}`,
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-100 text-emerald-700",
  POST: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
};

export default function ApiPage() {
  const [active, setActive] = useState(0);
  const ep = ENDPOINTS[active];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">API Reference</h1>
        <p className="text-slate-500 text-sm">Base URL : <code className="bg-slate-100 px-2 py-0.5 rounded text-od-700 font-mono text-xs">https://data.artp.sn/api/v1</code> — Acces libre, pas d'authentification requise</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Liste endpoints */}
        <div className="space-y-2">
          {ENDPOINTS.map((ep, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`w-full text-left p-3 rounded-xl border transition-all text-sm
                ${active === i ? "border-od-400 bg-od-50" : "border-slate-200 bg-white hover:border-od-200"}`}>
              <span className={`badge ${METHOD_COLORS[ep.method]} font-mono text-[10px] mb-1`}>{ep.method}</span>
              <p className="font-mono text-xs text-slate-600 truncate">{ep.path}</p>
              <p className="text-slate-700 font-semibold mt-0.5 text-xs">{ep.title}</p>
            </button>
          ))}
        </div>

        {/* Detail endpoint */}
        <div className="lg:col-span-3 space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className={`badge ${METHOD_COLORS[ep.method]} font-mono`}>{ep.method}</span>
              <code className="text-od-700 font-mono font-bold">{ep.path}</code>
            </div>
            <p className="text-slate-600 text-sm">{ep.description}</p>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-700 mb-3 text-sm">Parametres</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="pb-2 font-medium">Nom</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {ep.params.map(p => (
                  <tr key={p.name} className="border-b border-slate-50">
                    <td className="py-2 font-mono text-xs text-od-600 font-semibold">{p.name}</td>
                    <td className="py-2 text-xs text-slate-400 font-mono">{p.type}</td>
                    <td className="py-2 text-xs text-slate-600">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-700 mb-3 text-sm">Exemple de requete</h3>
            <pre>{ep.example}</pre>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-700 mb-3 text-sm">Exemple de reponse</h3>
            <pre>{ep.response}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
