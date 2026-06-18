import { useState } from "react";

const CATEGORIES = [
  { id: "couverture", icon: "📶", label: "Absence de couverture", desc: "Zone non couverte ou signal inexistant" },
  { id: "debit", icon: "🐢", label: "Debit insuffisant", desc: "Internet lent ou coupures fréquentes" },
  { id: "facturation", icon: "💳", label: "Facturation abusive", desc: "Frais inexpliques ou facturation incorrecte" },
  { id: "service", icon: "📵", label: "Service indisponible", desc: "Appels, SMS ou data en panne" },
  { id: "spam", icon: "📧", label: "Spam / appels abusifs", desc: "Messages non sollicites ou harcelement" },
  { id: "fraude", icon: "⚠️", label: "Fraude presumee", desc: "Arnaque, SIM swap, vol de credit" },
];

const REGIONS = ["Dakar","Thies","Kaolack","Saint-Louis","Ziguinchor","Tambacounda","Matam","Louga","Fatick","Kolda","Sedhiou","Kedougou","Kaffrine","Diourbel"];

export default function SignalerPage() {
  const [step, setStep] = useState(1);
  const [cat, setCat] = useState("");
  const [form, setForm] = useState({ operateur: "", region: "", description: "", tel: "" });
  const [ref, setRef] = useState("");

  function submit() {
    const code = "ART-" + Math.random().toString(36).slice(2,8).toUpperCase();
    setRef(code);
    setStep(4);
  }

  if (step === 4) return (
    <div className="p-6 max-w-lg mx-auto text-center space-y-6 mt-10">
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-4xl">✅</div>
      <h2 className="text-2xl font-bold text-slate-900">Alerte enregistree</h2>
      <p className="text-slate-500">Votre signalement a ete transmis a l'ARTP avec succes.</p>
      <div className="card p-5 bg-alert-50 border border-alert-200 text-center">
        <p className="text-xs text-slate-500 mb-1">Votre numero de reference</p>
        <p className="text-2xl font-bold font-mono text-alert-700">{ref}</p>
        <p className="text-xs text-slate-400 mt-2">Conservez ce code pour suivre votre dossier sur l'onglet "Suivi"</p>
      </div>
      <p className="text-sm text-slate-500">Delai de traitement : <strong>5 jours ouvrables</strong></p>
      <button onClick={() => { setStep(1); setCat(""); setForm({ operateur: "", region: "", description: "", tel: "" }); }}
        className="px-5 py-2.5 bg-alert-600 text-white font-semibold rounded-xl hover:bg-alert-700 transition-colors text-sm">
        Nouveau signalement
      </button>
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Signaler un probleme</h1>
        <p className="text-slate-500 text-sm">Signalez tout probleme avec votre operateur — l'ARTP traitera votre dossier sous 5 jours</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {["Categorie","Details","Confirmation"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${step > i+1 ? "bg-emerald-500 text-white" : step === i+1 ? "bg-alert-600 text-white" : "bg-slate-200 text-slate-500"}`}>
              {step > i+1 ? "✓" : i+1}
            </div>
            <span className={`text-sm ${step === i+1 ? "font-semibold text-slate-800" : "text-slate-400"}`}>{s}</span>
            {i < 2 && <div className="w-8 h-px bg-slate-200 mx-1" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-slate-800">Quelle est la nature du probleme ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all
                  ${cat === c.id ? "border-alert-500 bg-alert-50" : "border-slate-200 hover:border-alert-300 bg-white"}`}>
                <span className="text-2xl block mb-2">{c.icon}</span>
                <p className="font-semibold text-slate-800 text-sm">{c.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{c.desc}</p>
              </button>
            ))}
          </div>
          <button disabled={!cat} onClick={() => setStep(2)}
            className="w-full py-3 bg-alert-600 text-white font-bold rounded-2xl hover:bg-alert-700 disabled:opacity-40 transition-colors">
            Continuer
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-slate-800">Details du signalement</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Operateur concerne</label>
              <select value={form.operateur} onChange={e => setForm({...form, operateur: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-alert-400">
                <option value="">-- Choisir --</option>
                <option>Orange SN</option><option>Free SN</option><option>Expresso SN</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Region</label>
              <select value={form.region} onChange={e => setForm({...form, region: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-alert-400">
                <option value="">-- Choisir --</option>
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Description du probleme</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              rows={4} placeholder="Decrivez le probleme avec le plus de detail possible..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-alert-400 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Numero de telephone (optionnel)</label>
            <input type="tel" value={form.tel} onChange={e => setForm({...form, tel: e.target.value})}
              placeholder="+221 7X XXX XX XX"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-alert-400" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
              Retour
            </button>
            <button disabled={!form.operateur || !form.region || !form.description} onClick={() => setStep(3)}
              className="flex-1 py-2.5 bg-alert-600 text-white font-bold rounded-xl hover:bg-alert-700 disabled:opacity-40 transition-colors text-sm">
              Suivant
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-slate-800">Confirmation de votre signalement</h2>
          <div className="card p-5 space-y-3">
            {[
              ["Categorie", CATEGORIES.find(c => c.id === cat)?.label],
              ["Operateur", form.operateur],
              ["Region", form.region],
              ["Description", form.description],
            ].map(([k, v]) => (
              <div key={k as string} className="flex gap-2 text-sm">
                <span className="text-slate-500 w-28 shrink-0">{k} :</span>
                <span className="text-slate-800 font-medium">{v}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400">En soumettant, vous acceptez que vos informations soient utilisees par l'ARTP pour le traitement de votre plainte, conformement a la loi sur la protection des donnees personnelles.</p>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
              Retour
            </button>
            <button onClick={submit} className="flex-1 py-2.5 bg-alert-600 text-white font-bold rounded-xl hover:bg-alert-700 transition-colors text-sm">
              Soumettre le signalement
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
