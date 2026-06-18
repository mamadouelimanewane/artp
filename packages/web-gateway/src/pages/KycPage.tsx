import { useState } from "react";

export default function KycPage() {
  const [phone, setPhone] = useState("+221 77 123 45 67");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  function demo() {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult({
        status: "VERIFIED",
        match_level: "HIGH",
        name_masked: "Ma*** Di**",
        id_type: "CNI",
        id_verified: true,
        operator: "Orange SN",
        sim_age_days: 1247,
        confidence: 97,
        request_id: "GW-KYC-" + Math.random().toString(36).slice(2,10).toUpperCase(),
      });
      setLoading(false);
    }, 1200);
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🪪</span>
          <h1 className="text-2xl font-bold text-slate-900">KYC API</h1>
          <span className="badge bg-emerald-100 text-emerald-700">v1.2 — Disponible</span>
        </div>
        <p className="text-slate-500 text-sm">Verification d'identite en temps reel via le reseau de l'operateur. Conforme BCEAO & RGPD/Loi SN.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Spec */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-3">Endpoint</h2>
            <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm">
              <span className="text-emerald-400">POST</span>
              <span className="text-white ml-2">/api/v1/kyc/verify</span>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-3">Requete</h2>
            <pre className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 font-mono">{`{
  "phone_number": "+221771234567",
  "id_type": "CNI",
  "id_number": "7xxxxxxx",
  "name": "Mamadou Diallo"
}`}</pre>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-3">Reponse</h2>
            <pre className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 font-mono">{`{
  "status": "VERIFIED",
  "match_level": "HIGH|MEDIUM|LOW",
  "name_masked": "Ma*** Di**",
  "id_verified": true,
  "sim_age_days": 1247,
  "confidence": 97,
  "request_id": "GW-KYC-XXXXXXXX"
}`}</pre>
          </div>
        </div>

        {/* Demo */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-slate-800">Demo interactive</h2>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Numero de telephone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gw-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Type ID</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none">
                <option>CNI</option><option>Passeport</option><option>Permis</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Num. ID</label>
              <input defaultValue="7XXXXXXX" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none" />
            </div>
          </div>
          <button onClick={demo} disabled={loading}
            className="w-full py-2.5 bg-gw-600 text-white font-bold rounded-xl hover:bg-gw-700 disabled:opacity-50 transition-colors">
            {loading ? "Verification..." : "Tester l'API"}
          </button>

          {result && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">✅</span>
                <span className="font-bold text-emerald-700">{result.status}</span>
                <span className="badge bg-emerald-100 text-emerald-700">{result.match_level} confidence</span>
              </div>
              {[
                ["Nom masque", result.name_masked],
                ["ID verifie", result.id_verified ? "Oui" : "Non"],
                ["Operateur", result.operator],
                ["Anciennete SIM", `${result.sim_age_days} jours`],
                ["Score confiance", `${result.confidence}%`],
                ["Request ID", result.request_id],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between text-xs">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-mono text-slate-800 font-medium">{v as string}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
