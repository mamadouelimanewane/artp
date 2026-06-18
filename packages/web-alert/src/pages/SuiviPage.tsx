import { useState } from "react";

const FAKE_CASES: Record<string, object> = {
  "ART-DEMO1": {
    ref: "ART-DEMO1",
    cat: "Debit insuffisant",
    operateur: "Orange SN",
    region: "Dakar",
    date: "2026-06-10",
    status: "En traitement",
    timeline: [
      { date: "2026-06-10 09:14", action: "Signalement recu et enregistre", done: true },
      { date: "2026-06-11 14:30", action: "Dossier ouvert — Equipe QoS ARTP", done: true },
      { date: "2026-06-13 10:00", action: "Demande d'explication envoyee a Orange SN", done: true },
      { date: "", action: "Reponse de l'operateur attendue", done: false },
      { date: "", action: "Decision ARTP et notification au plaignant", done: false },
    ],
  },
  "ART-DEMO2": {
    ref: "ART-DEMO2",
    cat: "Facturation abusive",
    operateur: "Free SN",
    region: "Thies",
    date: "2026-06-05",
    status: "Resolu",
    timeline: [
      { date: "2026-06-05 11:20", action: "Signalement recu et enregistre", done: true },
      { date: "2026-06-06 09:00", action: "Dossier ouvert — Equipe Tarifs ARTP", done: true },
      { date: "2026-06-08 14:00", action: "Enquete aupres de Free SN", done: true },
      { date: "2026-06-10 16:00", action: "Infraction confirmee — Mise en demeure emise", done: true },
      { date: "2026-06-12 10:00", action: "Operateur a corrige la facturation — Dossier clos", done: true },
    ],
  },
};

export default function SuiviPage() {
  const [ref, setRef] = useState("");
  const [result, setResult] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  function search() {
    const r = FAKE_CASES[ref.toUpperCase().trim()];
    if (r) { setResult(r); setNotFound(false); }
    else { setResult(null); setNotFound(true); }
  }

  const statusStyle: Record<string, string> = {
    "En traitement": "bg-blue-100 text-blue-700",
    "Resolu": "bg-emerald-100 text-emerald-700",
    "Clos": "bg-slate-100 text-slate-700",
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Suivi de signalement</h1>
        <p className="text-slate-500 text-sm">Entrez votre numero de reference pour suivre l'evolution de votre dossier</p>
      </div>

      <div className="card p-5">
        <label className="block text-sm font-medium text-slate-700 mb-2">Numero de reference</label>
        <div className="flex gap-3">
          <input value={ref} onChange={e => setRef(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search()}
            placeholder="Ex: ART-DEMO1"
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-alert-400 uppercase" />
          <button onClick={search}
            className="px-5 py-2.5 bg-alert-600 text-white font-semibold rounded-xl hover:bg-alert-700 transition-colors text-sm">
            Rechercher
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">Astuce : essayez ART-DEMO1 ou ART-DEMO2 pour une demonstration</p>
      </div>

      {notFound && (
        <div className="card p-5 bg-red-50 border border-red-200 text-center">
          <p className="text-red-600 font-medium">Reference introuvable</p>
          <p className="text-red-400 text-sm mt-1">Verifiez votre code de reference ou contactez-nous au 1234</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-mono text-lg font-bold text-alert-700">{result.ref}</p>
                <p className="text-sm text-slate-500">{result.cat} • {result.operateur} • {result.region}</p>
              </div>
              <span className={`badge ${statusStyle[result.status]}`}>{result.status}</span>
            </div>
            <p className="text-xs text-slate-400">Depose le {result.date}</p>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Historique du dossier</h3>
            <div className="space-y-4">
              {result.timeline.map((t: any, i: number) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${t.done ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300"}`}>
                      {t.done && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    {i < result.timeline.length - 1 && (
                      <div className={`w-0.5 flex-1 mt-1 ${t.done ? "bg-emerald-300" : "bg-slate-200"}`} style={{minHeight: "20px"}} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={`text-sm ${t.done ? "text-slate-800 font-medium" : "text-slate-400"}`}>{t.action}</p>
                    {t.date && <p className="text-xs text-slate-400 mt-0.5">{t.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
