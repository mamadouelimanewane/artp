import { useState } from "react";

export default function LocationPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  function demo() {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult({
        latitude: 14.6937 + (Math.random() - 0.5) * 0.05,
        longitude: -17.4441 + (Math.random() - 0.5) * 0.05,
        accuracy: Math.floor(Math.random() * 300) + 100,
        area: "Dakar — Plateau",
        operator: "Orange SN",
        timestamp: new Date().toISOString(),
        request_id: "GW-LOC-" + Math.random().toString(36).slice(2,10).toUpperCase(),
      });
      setLoading(false);
    }, 1100);
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <span className="text-2xl">📍</span>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Device Location</h1>
          <p className="text-slate-500 text-sm">Localisation approximative via reseau cellular — sans GPS requis</p>
        </div>
        <span className="badge bg-blue-100 text-blue-700">v0.9 — Preview</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-3">Consentement obligatoire</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800 space-y-2">
              <p><strong>Requis avant tout appel :</strong></p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Consentement explicite de l'utilisateur (RGPD/Loi 2008-12)</li>
                <li>Finalite declaree au moment de la demande</li>
                <li>Droit de refus sans consequence</li>
                <li>Log de consentement conserve 3 ans</li>
              </ul>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-3">Endpoint</h2>
            <div className="bg-slate-900 rounded-xl p-3 font-mono text-sm mb-3">
              <span className="text-emerald-400">POST</span>
              <span className="text-white ml-2">/api/v1/location/retrieve</span>
            </div>
            <pre className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 font-mono">{`// Requete
{
  "phone_number": "+221771234567",
  "max_age": 60,
  "accuracy": "LOW|MEDIUM|HIGH"
}

// Reponse
{
  "latitude": 14.6937,
  "longitude": -17.4441,
  "accuracy": 150,
  "area": "Dakar — Plateau",
  "timestamp": "2026-06-18T09:00:00Z"
}`}</pre>
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-slate-800">Demo sandbox</h2>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Numero de telephone</label>
            <input defaultValue="+221 77 123 45 67"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gw-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Precision demandee</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none">
              <option value="LOW">Faible (rayon ~500m)</option>
              <option value="MEDIUM" selected>Moyenne (rayon ~200m)</option>
              <option value="HIGH">Haute (rayon ~50m)</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-xs text-slate-600">Je confirme avoir obtenu le consentement de l'utilisateur</span>
          </label>
          <button onClick={demo} disabled={loading}
            className="w-full py-2.5 bg-gw-600 text-white font-bold rounded-xl hover:bg-gw-700 disabled:opacity-50 transition-colors">
            {loading ? "Localisation en cours..." : "Obtenir la localisation"}
          </button>
          {result && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
              <p className="font-bold text-emerald-700">📍 Localisation obtenue</p>
              {[
                ["Latitude", result.latitude.toFixed(5)],
                ["Longitude", result.longitude.toFixed(5)],
                ["Precision", `±${result.accuracy}m`],
                ["Zone", result.area],
                ["Operateur", result.operator],
                ["Timestamp", result.timestamp.replace("T"," ").slice(0,19)],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between text-xs">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-mono text-slate-800">{v as string}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
