import { useState } from "react";

type TypeActeur = "operateur" | "fai" | "mvno" | "sva" | "startup";

const CHECKLIST: Record<TypeActeur, { section: string; items: { label: string; obligatoire: boolean }[] }[]> = {
  operateur: [
    { section: "Licences & Autorisations", items: [
      { label: "Licence d'établissement et d'exploitation réseau", obligatoire: true },
      { label: "Licence de services de communications électroniques", obligatoire: true },
      { label: "Autorisation d'utilisation de fréquences radioélectriques", obligatoire: true },
    ]},
    { section: "Qualité de Service (QoS)", items: [
      { label: "Rapports QoS trimestriels transmis à l'ARTP", obligatoire: true },
      { label: "Couverture réseau conforme aux obligations de déploiement", obligatoire: true },
      { label: "Seuils de débit minimal respectés (≥ 5 Mbps 4G)", obligatoire: true },
    ]},
    { section: "Protection des consommateurs", items: [
      { label: "Contrats conformes au Code des télécoms", obligatoire: true },
      { label: "Service client disponible 24h/24", obligatoire: true },
      { label: "Traitement des plaintes ≤ 15 jours ouvrables", obligatoire: true },
    ]},
    { section: "SIM & Enrôlement", items: [
      { label: "Enrôlement biométrique de 100% des abonnés", obligatoire: true },
      { label: "Base SIM synchronisée avec DGI", obligatoire: true },
    ]},
  ],
  fai: [
    { section: "Licences FAI", items: [
      { label: "Autorisation FAI délivrée par l'ARTP", obligatoire: true },
      { label: "Déclaration annuelle d'activité", obligatoire: true },
    ]},
    { section: "Interconnexion", items: [
      { label: "Accord d'interconnexion avec opérateurs nationaux", obligatoire: true },
      { label: "Point d'échange Internet (IXP) connecté", obligatoire: false },
    ]},
  ],
  mvno: [
    { section: "Accord MVNO", items: [
      { label: "Contrat d'accès réseau avec opérateur hôte", obligatoire: true },
      { label: "Notification ARTP de l'accord MVNO", obligatoire: true },
    ]},
    { section: "Obligations propres", items: [
      { label: "Service client dédié", obligatoire: true },
      { label: "Conformité tarifs ARTP", obligatoire: true },
    ]},
  ],
  sva: [
    { section: "Enregistrement SVA", items: [
      { label: "Déclaration du service à valeur ajoutée auprès de l'ARTP", obligatoire: true },
      { label: "Plafond tarifaire respecté (selon type SVA)", obligatoire: true },
      { label: "Mécanisme de désinscription gratuit (1 SMS)", obligatoire: true },
    ]},
    { section: "Contenu", items: [
      { label: "Contenu conforme aux lois sénégalaises", obligatoire: true },
      { label: "Pas de débit automatique sans consentement explicite", obligatoire: true },
    ]},
  ],
  startup: [
    { section: "Statut légal", items: [
      { label: "Entreprise enregistrée au RCCM Sénégal", obligatoire: true },
      { label: "NINEA obtenu", obligatoire: true },
    ]},
    { section: "Sandbox réglementaire", items: [
      { label: "Dossier de candidature sandbox déposé", obligatoire: false },
      { label: "Prototype fonctionnel documenté", obligatoire: false },
      { label: "Accord de confidentialité signé avec ARTP", obligatoire: false },
    ]},
  ],
};

const STARTUPS = [
  { nom: "WavePay SN", secteur: "FinTech Mobile", statut: "En sandbox", date: "2026-03-01", contact: "Dossier accepté" },
  { nom: "AgriConnect", secteur: "AgriTech IoT", statut: "En cours", date: "2026-05-15", contact: "En évaluation" },
  { nom: "MedTel SN", secteur: "eSanté", statut: "Diplômé", date: "2026-01-10", contact: "Licence obtenue" },
];

export default function SandboxPage() {
  const [tab, setTab] = useState<"conformite" | "sandbox">("conformite");
  const [acteur, setActeur] = useState<TypeActeur>("operateur");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [generated, setGenerated] = useState(false);

  const checklist = CHECKLIST[acteur];
  const allItems = checklist.flatMap(s => s.items);
  const obligatoires = allItems.filter(i => i.obligatoire);
  const score = obligatoires.length === 0 ? 0 :
    Math.round((obligatoires.filter(i => checked[i.label]).length / obligatoires.length) * 100);

  const scoreColor = score >= 80 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-red-600";
  const scoreBg = score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Conformité & Sandbox Réglementaire</h1>
        <p className="text-slate-500 text-sm">Vérifiez votre conformité · Accédez au bac à sable réglementaire ARTP</p>
      </div>

      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
        {[["conformite", "Simulateur Conformité"], ["sandbox", "Guichet Startups"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as typeof tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === k ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === "conformite" && (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Type d'acteur</p>
            <div className="flex gap-2 flex-wrap">
              {([["operateur", "Opérateur"], ["fai", "FAI"], ["mvno", "MVNO"], ["sva", "SVA"], ["startup", "Startup"]] as const).map(([k, l]) => (
                <button key={k} onClick={() => { setActeur(k); setChecked({}); setGenerated(false); }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all
                    ${acteur === k ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4 flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle cx="32" cy="32" r="28" fill="none" stroke={score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="8" strokeDasharray={`${score * 1.759} 175.9`} />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-sm font-black ${scoreColor}`}>{score}%</span>
            </div>
            <div>
              <p className="font-bold text-slate-800">Score de conformité</p>
              <p className="text-xs text-slate-500">{obligatoires.filter(i => checked[i.label]).length} / {obligatoires.length} obligations respectées</p>
              <p className={`text-xs font-semibold mt-1 ${scoreColor}`}>
                {score >= 80 ? "✅ Conforme" : score >= 50 ? "⚠️ Partiellement conforme" : "❌ Non conforme"}
              </p>
            </div>
          </div>

          {checklist.map((section) => (
            <div key={section.section} className="card p-4 space-y-3">
              <p className="font-semibold text-slate-700 text-sm">{section.section}</p>
              {section.items.map((item) => (
                <label key={item.label} className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={!!checked[item.label]}
                    onChange={e => setChecked(p => ({ ...p, [item.label]: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 rounded accent-emerald-600 shrink-0" />
                  <div className="flex-1">
                    <span className={`text-sm ${checked[item.label] ? "text-slate-400 line-through" : "text-slate-700"}`}>{item.label}</span>
                    {item.obligatoire && <span className="ml-2 text-[10px] text-red-500 font-semibold">OBLIGATOIRE</span>}
                  </div>
                </label>
              ))}
            </div>
          ))}

          <button onClick={() => setGenerated(true)}
            className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors">
            Générer le rapport de conformité PDF
          </button>

          {generated && (
            <div className="card p-4 bg-emerald-50 border border-emerald-200 text-center">
              <p className="text-emerald-700 font-semibold">📄 Rapport généré</p>
              <p className="text-xs text-emerald-600 mt-1">Rapport de conformité {acteur.toUpperCase()} — Score {score}% — {new Date().toLocaleDateString("fr-FR")}</p>
              <button className="mt-2 text-sm text-emerald-700 font-semibold border border-emerald-300 px-4 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
                Télécharger le rapport →
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "sandbox" && (
        <div className="space-y-4">
          <div className="card p-5 bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
            <h3 className="text-lg font-black mb-1">Sandbox Réglementaire ARTP</h3>
            <p className="text-sm text-indigo-100">Espace dédié aux startups souhaitant expérimenter des services innovants sous supervision réglementaire, sans obligation de licence complète pendant 12 mois.</p>
          </div>

          <div className="card p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Conditions d'accès</p>
            <div className="space-y-2">
              {[
                "Entreprise sénégalaise enregistrée au RCCM",
                "Solution technologique innovante liée aux télécoms",
                "Prototype fonctionnel ou MVP démontrable",
                "Maximum 500 utilisateurs en phase sandbox",
                "Rapport mensuel d'activité transmis à l'ARTP",
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                  <p className="text-xs text-slate-600">{c}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Startups actuellement en sandbox</p>
            {STARTUPS.map((s) => (
              <div key={s.nom} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{s.nom}</p>
                  <p className="text-xs text-slate-400">{s.secteur}</p>
                </div>
                <span className={`badge text-[10px] font-semibold ${s.statut === "Diplômé" ? "bg-emerald-100 text-emerald-700" : s.statut === "En sandbox" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                  {s.statut}
                </span>
              </div>
            ))}
          </div>

          <div className="card p-4 space-y-3">
            <p className="text-sm font-semibold text-slate-700">Déposer une candidature sandbox</p>
            <input placeholder="Nom de la startup" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            <input placeholder="Secteur d'activité" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            <textarea placeholder="Description de l'innovation (100-300 mots)" rows={4}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
            <button className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
              Soumettre le dossier →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
