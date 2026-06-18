import { useState } from "react";

export default function NumberVerifyPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  function demo() {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult({ devicePhoneNumberVerified: true, request_id: "GW-NV-" + Math.random().toString(36).slice(2,10).toUpperCase() });
      setLoading(false);
    }, 900);
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <span className="text-2xl">📱</span>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Number Verify</h1>
          <p className="text-slate-500 text-sm">Verification silencieuse du numero via reseau — remplace le SMS OTP</p>
        </div>
        <span className="badge bg-amber-100 text-amber-700">v1.0 — Beta</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-3">Comment ca fonctionne</h2>
            <div className="space-y-3">
              {[
                { n: "1", t: "L'utilisateur entre son numero dans votre app" },
                { n: "2", t: "Vous appelez l'API Number Verify avec le numero" },
                { n: "3", t: "Le reseau verifie silencieusement que l'appareil utilise ce SIM" },
                { n: "4", t: "Reponse true/false — aucun SMS envoye" },
              ].map(s => (
                <div key={s.n} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-gw-100 text-gw-700 flex items-center justify-center text-xs font-bold shrink-0">{s.n}</div>
                  <p className="text-sm text-slate-600">{s.t}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-3">Endpoint</h2>
            <div className="bg-slate-900 rounded-xl p-3 font-mono text-sm mb-3">
              <span className="text-emerald-400">POST</span>
              <span className="text-white ml-2">/api/v1/number-verify/verify</span>
            </div>
            <pre className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 font-mono">{`// Requete
{
  "phone_number": "+221771234567",
  "hashed_phone_number": "sha256_optionnel"
}

// Reponse
{
  "devicePhoneNumberVerified": true,
  "request_id": "GW-NV-XXXXXXXX"
}`}</pre>
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-slate-800">Demo</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            <strong>Sandbox :</strong> les resultats sont simules. En production, la verification utilise le vrai reseau de l'operateur.
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Numero a verifier</label>
            <input defaultValue="+221 77 123 45 67"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gw-400" />
          </div>
          <button onClick={demo} disabled={loading}
            className="w-full py-2.5 bg-gw-600 text-white font-bold rounded-xl hover:bg-gw-700 disabled:opacity-50 transition-colors">
            {loading ? "Verification reseau..." : "Tester la verification"}
          </button>
          {result && (
            <div className={`rounded-xl p-4 border ${result.devicePhoneNumberVerified ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
              <p className={`font-bold text-lg ${result.devicePhoneNumberVerified ? "text-emerald-700" : "text-red-700"}`}>
                {result.devicePhoneNumberVerified ? "✅ Numero verifie" : "❌ Non verifie"}
              </p>
              <p className="text-xs font-mono text-slate-500 mt-2">Request ID : {result.request_id}</p>
              <p className="text-xs text-slate-400 mt-1">Temps reponse : 187ms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
