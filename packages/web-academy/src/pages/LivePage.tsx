import { useState } from "react";

const SESSIONS = [
  {
    id: "LIVE-2026-012",
    title: "Régulation 5G en Afrique subsaharienne",
    speaker: "Dr. Aminata Fall, DG adjointe ARTP",
    date: "2026-06-25",
    time: "09:00 – 12:00 UTC",
    lang: "FR",
    seats: 30,
    enrolled: 22,
    level: "Avancé",
    status: "upcoming",
    description: "Cadre réglementaire, attribution des fréquences 5G, obligations de déploiement et partage d'infrastructure.",
  },
  {
    id: "LIVE-2026-011",
    title: "DNSSEC & Sécurité DNS pour régulateurs",
    speaker: "Ing. Cheikh Tidiane Ndiaye, ARTP",
    date: "2026-07-02",
    time: "14:00 – 17:00 UTC",
    lang: "FR/EN",
    seats: 25,
    enrolled: 18,
    level: "Intermédiaire",
    status: "upcoming",
    description: "Techniques DNSSEC, gestion des clés KSK/ZSK, procédures de rollover et vérification de la chaîne de confiance.",
  },
  {
    id: "LIVE-2026-010",
    title: "Lutte contre la fraude télécom — Outils pratiques",
    speaker: "M. Papa Ibrahima Séne, SILFT ARTP",
    date: "2026-07-10",
    time: "10:00 – 13:00 UTC",
    lang: "FR",
    seats: 40,
    enrolled: 35,
    level: "Intermédiaire",
    status: "upcoming",
    description: "Détection SIM frauduleuses, contrôle SVA, coordination CERT Télécom, études de cas réels.",
  },
  {
    id: "LIVE-2026-009",
    title: "Qualité de service mobile : cadre réglementaire",
    speaker: "Mme. Rokhaya Diop, ARTP",
    date: "2026-06-12",
    time: "09:00 – 12:00 UTC",
    lang: "FR",
    seats: 35,
    enrolled: 35,
    level: "Débutant",
    status: "completed",
    description: "Paramètres QoS, seuils réglementaires, procédures d'audit terrain et sanctions.",
  },
];

const LEVEL_COLORS: Record<string, string> = {
  "Débutant": "bg-emerald-100 text-emerald-700",
  "Intermédiaire": "bg-acad-100 text-acad-700",
  "Avancé": "bg-purple-100 text-purple-700",
};

export default function LivePage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sessions Live</h1>
        <p className="text-slate-500 text-sm">Webinaires en direct · Interactifs · Enregistrements disponibles</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4"><p className="text-xs text-slate-500">À venir</p><p className="text-2xl font-bold text-acad-600">{SESSIONS.filter(s=>s.status==="upcoming").length}</p></div>
        <div className="card p-4"><p className="text-xs text-slate-500">Places disponibles</p><p className="text-2xl font-bold text-emerald-600">{SESSIONS.filter(s=>s.status==="upcoming").reduce((s,x)=>s+(x.seats-x.enrolled),0)}</p></div>
        <div className="card p-4"><p className="text-xs text-slate-500">Sessions terminées</p><p className="text-2xl font-bold text-slate-500">{SESSIONS.filter(s=>s.status==="completed").length}</p></div>
      </div>

      <div className="space-y-3">
        {SESSIONS.map(s => (
          <div
            key={s.id}
            className={`card overflow-hidden cursor-pointer hover:shadow-md transition-all ${s.status==="completed"?"opacity-70":""}`}
            onClick={() => setExpanded(expanded===s.id?null:s.id)}
          >
            <div className={`h-1 ${s.status==="upcoming"?"bg-acad-500":"bg-slate-300"}`} />
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${LEVEL_COLORS[s.level]}`}>{s.level}</span>
                    <span className="badge bg-slate-100 text-slate-500 text-[10px]">{s.lang}</span>
                    {s.status === "upcoming"
                      ? <span className="badge bg-acad-100 text-acad-700">● À venir</span>
                      : <span className="badge bg-slate-100 text-slate-500">✓ Terminé</span>
                    }
                  </div>
                  <h3 className="font-bold text-slate-800">{s.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{s.speaker}</p>
                  <p className="text-xs text-slate-400 mt-0.5">📅 {s.date} · ⏰ {s.time}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-acad-700">{s.enrolled}<span className="text-slate-400 text-base">/{s.seats}</span></p>
                  <p className="text-[10px] text-slate-400">inscrits</p>
                  {s.status === "upcoming" && s.enrolled < s.seats && (
                    <div className="mt-1 text-[10px] text-emerald-600 font-semibold">{s.seats - s.enrolled} places libres</div>
                  )}
                </div>
              </div>
            </div>

            {expanded === s.id && (
              <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
                <p className="text-sm text-slate-600">{s.description}</p>
                <div className="h-2 bg-slate-100 rounded-full">
                  <div className="h-2 bg-acad-500 rounded-full" style={{ width: `${(s.enrolled/s.seats)*100}%` }} />
                </div>
                <div className="flex gap-2">
                  {s.status === "upcoming" ? (
                    <>
                      <button className="px-4 py-2 bg-acad-600 text-white text-xs rounded-xl font-semibold hover:bg-acad-700 transition-colors">
                        S'inscrire
                      </button>
                      <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs rounded-xl hover:bg-slate-50 transition-colors">
                        Ajouter au calendrier
                      </button>
                    </>
                  ) : (
                    <button className="px-4 py-2 bg-slate-700 text-white text-xs rounded-xl font-semibold hover:bg-slate-800 transition-colors">
                      Voir l'enregistrement
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
