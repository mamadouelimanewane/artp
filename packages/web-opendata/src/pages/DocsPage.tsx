const SECTIONS = [
  {
    title: "Introduction",
    content: `data.artp.sn est le portail officiel Open Data de l'ARTP Senegal, inspire des meilleures pratiques mondiales (ARCEP France, Ofcom UK, FCC USA).

Toutes les donnees publiees sont sous licence ouverte (ODbL 1.0 ou Licence Ouverte 2.0) et peuvent etre reutilisees librement, y compris a des fins commerciales, sous reserve de mentionner la source.`,
  },
  {
    title: "Authentification",
    content: `L'API est publique et ne necessite pas d'authentification pour les endpoints de lecture.

Pour les besoins d'acces volumetrique (>10 000 requetes/jour) ou pour acceder a des donnees temps reel, contactez data@artp.sn pour obtenir une cle API gratuite.

La cle s'ajoute en header :
  X-API-Key: votre_cle_ici`,
  },
  {
    title: "Pagination",
    content: `Tous les endpoints pagines acceptent les parametres :
- limit : nombre de resultats par page (defaut 100, max 1000)
- offset : position de depart (defaut 0)

La reponse inclut toujours :
{
  "meta": {
    "total": 48392,
    "limit": 100,
    "offset": 0,
    "next": "/api/v1/qos?offset=100"
  },
  "data": [...]
}`,
  },
  {
    title: "Formats de sortie",
    content: `Ajoutez le parametre format a votre requete :
- format=json  (defaut) — JSON structure
- format=csv   — CSV avec en-tetes
- format=geojson — Pour les donnees geographiques uniquement

Exemple : GET /api/v1/qos?format=csv&operateur=Orange`,
  },
  {
    title: "Codes d'erreur",
    content: `400 Bad Request   — Parametre invalide
404 Not Found     — Ressource inexistante
429 Too Many Req. — Limite depassee (sans cle API)
500 Server Error  — Contactez support@artp.sn

Format d'erreur :
{
  "error": {
    "code": 400,
    "message": "Parametre 'operateur' invalide"
  }
}`,
  },
  {
    title: "Exemples d'utilisation",
    content: `Python :
import requests
r = requests.get("https://data.artp.sn/api/v1/qos",
  params={"operateur": "Orange", "region": "DK"})
data = r.json()

JavaScript :
const res = await fetch(
  "https://data.artp.sn/api/v1/qos?limit=50"
);
const data = await res.json();

R :
library(httr)
r <- GET("https://data.artp.sn/api/v1/qos",
  query = list(format = "csv"))`,
  },
];

export default function DocsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Documentation</h1>
        <p className="text-slate-500 text-sm">Guide d'utilisation du portail Open Data ARTP</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="card p-4 h-fit">
          <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">Sommaire</p>
          <nav className="space-y-1">
            {SECTIONS.map(s => (
              <a key={s.title} href={`#${s.title}`}
                className="block text-sm text-od-700 hover:text-od-900 py-1 border-l-2 border-transparent hover:border-od-400 pl-2 transition-all">
                {s.title}
              </a>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3 space-y-5">
          {SECTIONS.map(s => (
            <div key={s.title} id={s.title} className="card p-5">
              <h2 className="font-bold text-slate-800 text-lg mb-3">{s.title}</h2>
              <pre className="bg-slate-50 border border-slate-100 text-slate-700 text-xs rounded-xl p-4 whitespace-pre-wrap font-mono leading-relaxed">
                {s.content}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
