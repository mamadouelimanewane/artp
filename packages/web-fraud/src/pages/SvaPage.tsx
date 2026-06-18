import { useState } from "react";

const SVA_DATA = [
  { id: "SVA-001", numero: "+221 33 800 0001", service: "Jeux en ligne", operator: "Orange SN", tarif_declare: "150 FCFA/min", tarif_reel: "450 FCFA/min", plaintes: 47, status: "Suspendu" },
  { id: "SVA-002", numero: "+221 33 800 0002", service: "Horoscope SMS", operator: "Free SN", tarif_declare: "50 FCFA/SMS", tarif_reel: "200 FCFA/SMS", plaintes: 23, status: "En cours" },
  { id: "SVA-003", numero:"+221 33 800 0003", service: "Téléchargement ringtones", operator: "Orange SN", tarif_declare: "100 FCFA", tarif_reel: "500 FCFA", plaintes: 31, status: "En cours" },
  { id: "SVA-004", numero: "+221 33 800 0004", service: "Abonnement non sollicité", operator: "Expresso", tarif_declare: "Non déclaré", tarif_reel: "300 FCFA/jour", plaintes: 89, status: "Suspendu" },
];

const STATUS_COLORS: Record<string, string> = {
  "Suspendu": "bg-red-100 text-red-700",
  "En cours": "bg-amber-100 text-amber-700",
  "Conforme": "bg-emerald-100 text-emerald-700",
};

export default function SvaPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">SVA Non Conformes</h1>
        <p className="text-slate-500 text-sm">Services à Valeur Ajoutée · Contrôle tarification et consentement</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 border-l-4 border-red-500">
          <p className="text-xs text-slate-500">Suspendus</p>
          <p className="text-2xl font-bold text-red-600">{SVA_DATA.filter(s=>s.status==="Suspendu").length}</p>
        </div>
        <div className="card p-4 border-l-4 border-amber-400">
          <p className="text-xs text-slate-500">Instruction en cours</p>
          <p className="text-2xl font-bold text-amber-600">{SVA_DATA.filter(s=>s.status==="En cours").length}</p>
        </div>
        <div className="card p-4 border-l-4 border-slate-300">
          <p className="text-xs text-slate-500">Total plaintes</p>
          <p className="text-2xl font-bold text-slate-700">{SVA_DATA.reduce((s,x)=>s+x.plaintes,0)}</p>
        </div>
      </div>

      <div className="space-y-3">
        {SVA_DATA.map(s => (
          <div
            key={s.id}
            className={`card p-4 cursor-pointer transition-all hover:shadow-md ${selected===s.id?"ring-2 ring-fraud-400":""}`}
            onClick={() => setSelected(selected===s.id?null:s.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-fraud-600">{s.id}</span>
                  <span className={`badge ${STATUS_COLORS[s.status]}`}>{s.status}</span>
                </div>
                <h3 className="font-semibold text-slate-800">{s.service}</h3>
                <p className="text-sm text-slate-500">{s.operator} · {s.numero}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Plaintes reçues</p>
                <p className="text-xl font-bold text-red-600">{s.plaintes}</p>
              </div>
            </div>
            {selected === s.id && (
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-sm">
                <div className="bg-emerald-50 p-2.5 rounded-lg">
                  <p className="text-xs text-slate-500">Tarif déclaré</p>
                  <p className="font-semibold text-emerald-700">{s.tarif_declare}</p>
                </div>
                <div className="bg-red-50 p-2.5 rounded-lg">
                  <p className="text-xs text-slate-500">Tarif réel constaté</p>
                  <p className="font-semibold text-red-700">{s.tarif_reel}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
