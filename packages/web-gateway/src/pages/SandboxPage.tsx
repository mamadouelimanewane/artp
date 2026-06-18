import { useState } from "react";

const ENDPOINTS = [
  { name: "KYC Verify", method: "POST", path: "/api/v1/kyc/verify",
    body: `{\n  "phone_number": "+221771234567",\n  "id_type": "CNI",\n  "id_number": "7XXXXXXX",\n  "name": "Mamadou Diallo"\n}`,
    response: `{\n  "status": "VERIFIED",\n  "match_level": "HIGH",\n  "name_masked": "Ma*** Di**",\n  "confidence": 97,\n  "request_id": "GW-KYC-A1B2C3D4"\n}` },
  { name: "Number Verify", method: "POST", path: "/api/v1/number-verify/verify",
    body: `{\n  "phone_number": "+221771234567"\n}`,
    response: `{\n  "devicePhoneNumberVerified": true,\n  "request_id": "GW-NV-E5F6G7H8"\n}` },
  { name: "Device Location", method: "POST", path: "/api/v1/location/retrieve",
    body: `{\n  "phone_number": "+221771234567",\n  "max_age": 60,\n  "accuracy": "MEDIUM"\n}`,
    response: `{\n  "latitude": 14.69370,\n  "longitude": -17.44410,\n  "accuracy": 187,\n  "area": "Dakar — Plateau",\n  "operator": "Orange SN",\n  "timestamp": "2026-06-18T09:00:00Z"\n}` },
];

export default function SandboxPage() {
  const [sel, setSel] = useState(0);
  const [apiKey, setApiKey] = useState("sk-sandbox-demo-artp-2026");
  const [body, setBody] = useState(ENDPOINTS[0].body);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  function selectEndpoint(i: number) {
    setSel(i);
    setBody(ENDPOINTS[i].body);
    setResponse("");
  }

  function send() {
    setLoading(true);
    setResponse("");
    setTimeout(() => {
      setResponse(ENDPOINTS[sel].response);
      setLoading(false);
    }, Math.random() * 400 + 200);
  }

  const ep = ENDPOINTS[sel];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sandbox API</h1>
        <p className="text-slate-500 text-sm">Testez toutes les APIs Open Gateway en environnement de bac a sable — sans impact sur la production</p>
      </div>

      <div className="card p-4 bg-amber-50 border border-amber-200">
        <div className="flex items-center gap-3">
          <span className="text-amber-500 font-bold text-sm">SANDBOX</span>
          <p className="text-xs text-amber-700">Les reponses sont simulees. Utilisez votre cle sandbox pour les tests. Cle de production disponible apres validation ARTP.</p>
        </div>
      </div>

      {/* API Key */}
      <div className="card p-4 flex items-center gap-3">
        <label className="text-xs font-medium text-slate-600 shrink-0">Cle API :</label>
        <input value={apiKey} onChange={e => setApiKey(e.target.value)}
          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gw-400" />
        <span className="badge bg-amber-100 text-amber-700 text-[10px]">SANDBOX</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Endpoints list */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Endpoints</p>
          {ENDPOINTS.map((e, i) => (
            <button key={i} onClick={() => selectEndpoint(i)}
              className={`w-full text-left p-3 rounded-xl border transition-all
                ${sel === i ? "border-gw-400 bg-gw-50" : "border-slate-200 bg-white hover:border-gw-200"}`}>
              <span className="badge bg-emerald-100 text-emerald-700 font-mono text-[10px] block mb-1">{e.method}</span>
              <p className="text-xs font-mono text-slate-600 truncate">{e.path}</p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{e.name}</p>
            </button>
          ))}
        </div>

        {/* Request */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Requete</p>
          <div className="bg-slate-900 rounded-xl p-3 font-mono text-sm">
            <span className="text-emerald-400">{ep.method}</span>
            <span className="text-white ml-2 text-xs">{ep.path}</span>
          </div>
          <textarea value={body} onChange={e => setBody(e.target.value)}
            rows={10}
            className="w-full px-3 py-2 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-gw-400 resize-none" />
          <button onClick={send} disabled={loading}
            className="w-full py-2.5 bg-gw-600 text-white font-bold rounded-xl hover:bg-gw-700 disabled:opacity-50 transition-colors">
            {loading ? "Envoi en cours..." : "Envoyer la requete"}
          </button>
        </div>

        {/* Response */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Reponse {response && <span className="text-emerald-500 font-mono">200 OK</span>}
          </p>
          <pre className={`min-h-[280px] p-3 rounded-xl text-xs font-mono leading-relaxed
            ${response ? "bg-slate-900 text-emerald-300" : "bg-slate-100 text-slate-400"}`}>
            {response || "La reponse apparaitra ici..."}
            {loading && <span className="animate-pulse">|</span>}
          </pre>
          {response && (
            <p className="text-xs text-slate-400 text-right">
              Temps : {Math.floor(Math.random() * 200 + 100)}ms
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
