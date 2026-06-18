import { useNavigate } from "react-router-dom";

const APIS = [
  {
    id: "kyc",
    name: "KYC API",
    fullName: "Know Your Customer",
    icon: "🪪",
    version: "v1.2",
    desc: "Verifie l'identite d'un abonne mobile en temps reel. Retourne statut, nom masque et niveau de confiance.",
    useCases: ["Ouverture de compte mobile money","Verification KYC e-commerce","Onboarding applications fintech"],
    operators: ["Orange SN","Free SN"],
    latency: "< 300ms",
    status: "Disponible",
    path: "/kyc",
  },
  {
    id: "number-verify",
    name: "Number Verify",
    fullName: "Verification de numero",
    icon: "📱",
    version: "v1.0",
    desc: "Confirme silencieusement que le numero de telephone utilise correspond bien au SIM de l'appareil. Anti-fraude OTP.",
    useCases: ["Remplacement silencieux OTP SMS","Protection account takeover","Double authentification sans friction"],
    operators: ["Orange SN"],
    latency: "< 200ms",
    status: "Beta",
    path: "/number-verify",
  },
  {
    id: "location",
    name: "Device Location",
    fullName: "Localisation de l'appareil",
    icon: "📍",
    version: "v0.9",
    desc: "Localisation approximative de l'appareil via le reseau (sans GPS), avec consentement de l'utilisateur.",
    useCases: ["Livraison last-mile","Alertes de securite geographiques","Services de proximite"],
    operators: ["Orange SN","Free SN","Expresso SN"],
    latency: "< 500ms",
    status: "Preview",
    path: "/location",
  },
];

const STATUS_STYLE: Record<string, string> = {
  "Disponible": "bg-emerald-100 text-emerald-700",
  "Beta": "bg-amber-100 text-amber-700",
  "Preview": "bg-blue-100 text-blue-700",
};

export default function CataloguePage() {
  const navigate = useNavigate();
  return (
    <div className="p-6 space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-gw-800 to-gw-600 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🌐</span>
          <div>
            <h1 className="text-2xl font-bold">Open Gateway ARTP</h1>
            <p className="text-gw-200 text-sm">APIs GSMA Open Gateway — acces unifie aux capacites reseau des operateurs senegalais</p>
          </div>
        </div>
        <p className="text-gw-100 text-sm max-w-2xl leading-relaxed">
          Programme pilote lance par l'ARTP en partenariat avec les 3 operateurs. Inspire de la consultation ARTCI/GSMA en Cote d'Ivoire.
          Les APIs sont standardisees, documentees et testables dans le sandbox ci-dessous.
        </p>
        <div className="flex gap-3 mt-5">
          <div className="bg-white/15 rounded-xl px-4 py-2 text-center">
            <p className="text-lg font-bold">3</p>
            <p className="text-gw-200 text-xs">APIs disponibles</p>
          </div>
          <div className="bg-white/15 rounded-xl px-4 py-2 text-center">
            <p className="text-lg font-bold">3</p>
            <p className="text-gw-200 text-xs">Operateurs partenaires</p>
          </div>
          <div className="bg-white/15 rounded-xl px-4 py-2 text-center">
            <p className="text-lg font-bold">OAuth 2.0</p>
            <p className="text-gw-200 text-xs">Authentification</p>
          </div>
        </div>
      </div>

      {/* Catalogue */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Catalogue d'APIs</h2>
        <div className="grid grid-cols-1 gap-4">
          {APIS.map(api => (
            <div key={api.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{api.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800">{api.name}</h3>
                      <span className="badge bg-slate-100 text-slate-600 font-mono text-[10px]">{api.version}</span>
                      <span className={`badge ${STATUS_STYLE[api.status]}`}>{api.status}</span>
                    </div>
                    <p className="text-xs text-slate-500">{api.fullName}</p>
                  </div>
                </div>
                <button onClick={() => navigate(api.path)}
                  className="px-4 py-1.5 bg-gw-600 text-white text-xs font-semibold rounded-xl hover:bg-gw-700 transition-colors shrink-0">
                  Documentation
                </button>
              </div>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">{api.desc}</p>
              <div className="flex items-start gap-8 text-xs">
                <div>
                  <p className="text-slate-400 mb-1 font-medium">Cas d'usage</p>
                  <ul className="space-y-0.5">
                    {api.useCases.map(uc => (
                      <li key={uc} className="text-slate-600 flex items-center gap-1.5">
                        <span className="text-gw-400">•</span>{uc}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-slate-400 mb-1 font-medium">Operateurs</p>
                  <div className="flex flex-col gap-0.5">
                    {api.operators.map(op => (
                      <span key={op} className="badge bg-slate-100 text-slate-600 inline-block">{op}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 mb-1 font-medium">Latence P99</p>
                  <p className="font-semibold text-slate-700">{api.latency}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
