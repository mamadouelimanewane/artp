import { useState } from "react";
import Layout from "../components/Layout";
import { NATIONAL_KPIS, OPERATOR_SUMMARY, REGIONS } from "../data/senegal";
import { DocumentArrowDownIcon, PrinterIcon, CalendarIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

const REPORT_TYPES = [
  { id:"monthly",    label:"Rapport mensuel",     desc:"Synthèse nationale — plaintes, QoS, opérateurs",   icon:"📋", pages:12 },
  { id:"qos",        label:"Rapport QoS",          desc:"Indicateurs de qualité de service par région",     icon:"📶", pages:8  },
  { id:"operators",  label:"Rapport opérateurs",   desc:"Conformité réglementaire — Orange, Free, Expresso",icon:"🏢", pages:15 },
  { id:"blindspots", label:"Rapport zones blanches",desc:"Cartographie et plan d'action zones non couvertes",icon:"📍", pages:6  },
];

const HISTORY = [
  { id:1, title:"Rapport mensuel — Mai 2026",    date:"01/06/2026", type:"monthly",   pages:12, status:"validé"     },
  { id:2, title:"Rapport QoS — T1 2026",         date:"05/04/2026", type:"qos",       pages:8,  status:"validé"     },
  { id:3, title:"Rapport opérateurs — T1 2026",  date:"05/04/2026", type:"operators", pages:15, status:"validé"     },
  { id:4, title:"Rapport mensuel — Avril 2026",  date:"01/05/2026", type:"monthly",   pages:11, status:"archivé"    },
  { id:5, title:"Rapport zones blanches — 2026", date:"15/03/2026", type:"blindspots",pages:6,  status:"en révision"},
];

function PrintableReport({ month }: { month: string }) {
  return (
    <div id="print-report" className="hidden print:block p-8 text-slate-900 font-sans" style={{ fontFamily:"Inter,sans-serif" }}>
      {/* En-tête */}
      <div className="flex items-start justify-between pb-6 border-b-2 border-artp-600 mb-6">
        <div>
          <div className="text-artp-600 font-black text-2xl">ARTP</div>
          <div className="text-slate-500 text-sm">Autorité de Régulation des Télécommunications et des Postes</div>
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-800">Rapport mensuel — {month}</p>
          <p className="text-slate-500 text-sm">Confidentiel • Usage interne ARTP</p>
        </div>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-2">État du secteur des télécommunications</h1>
      <p className="text-slate-500 text-sm mb-8">République du Sénégal · Direction de la Régulation · {new Date().toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}</p>

      <h2 className="text-base font-black text-artp-700 mb-3 uppercase tracking-wide">1. Indicateurs nationaux</h2>
      <table className="w-full border-collapse mb-6 text-sm">
        <tbody>
          {[
            ["Plaintes reçues",          NATIONAL_KPIS.totalComplaints, ""],
            ["Taux de résolution",        `${NATIONAL_KPIS.resolutionRate}%`, "Objectif : ≥ 90%"],
            ["Délai moyen de traitement", `${NATIONAL_KPIS.avgDelay} jours`,  "Délai max : 15 jours"],
            ["Débit moyen national",      `${NATIONAL_KPIS.avgDownload} Mbps`,"Seuil : ≥ 5 Mbps"],
            ["Zones blanches signalées",  NATIONAL_KPIS.blindSpots,       ""],
            ["Couverture 4G territoire",  `${NATIONAL_KPIS.coverage4G}%`, "Objectif : ≥ 80%"],
          ].map(([l,v,note]) => (
            <tr key={l as string} className="border-b border-slate-100">
              <td className="py-2 pr-4 text-slate-600 w-64">{l}</td>
              <td className="py-2 font-bold text-slate-900">{v}</td>
              <td className="py-2 text-slate-400 text-xs">{note}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-base font-black text-artp-700 mb-3 uppercase tracking-wide">2. Performance par opérateur</h2>
      <table className="w-full border-collapse mb-6 text-sm">
        <thead>
          <tr className="bg-slate-50">
            <th className="py-2 px-3 text-left font-bold text-slate-600">Opérateur</th>
            <th className="py-2 px-3 text-center font-bold text-slate-600">Score QoS</th>
            <th className="py-2 px-3 text-center font-bold text-slate-600">Débit moy.</th>
            <th className="py-2 px-3 text-center font-bold text-slate-600">Plaintes</th>
            <th className="py-2 px-3 text-center font-bold text-slate-600">Résolues</th>
          </tr>
        </thead>
        <tbody>
          {OPERATOR_SUMMARY.map(op => (
            <tr key={op.name} className="border-b border-slate-100">
              <td className="py-2 px-3 font-bold">{op.name} Sénégal</td>
              <td className="py-2 px-3 text-center">{op.qos}/10</td>
              <td className="py-2 px-3 text-center">{op.download} Mbps</td>
              <td className="py-2 px-3 text-center">{op.complaints}</td>
              <td className="py-2 px-3 text-center">{op.resolved}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-base font-black text-artp-700 mb-3 uppercase tracking-wide">3. Régions prioritaires</h2>
      <p className="text-sm text-slate-600 mb-3">Régions nécessitant une intervention réglementaire urgente :</p>
      <ul className="text-sm text-slate-700 space-y-1 mb-8">
        {REGIONS.filter(r => r.qosScore < 6).map(r => (
          <li key={r.id} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"/>
            <b>{r.name}</b> — Score QoS : {r.qosScore}/10 · {r.blindSpots} zones blanches · Débit : {r.downloadAvg} Mbps
          </li>
        ))}
      </ul>

      <div className="border-t border-slate-200 pt-4 mt-8 text-xs text-slate-400 flex justify-between">
        <span>ARTP Sénégal • Km 5, Boulevard du Centenaire, Dakar • (+221) 33 849 08 08</span>
        <span>Document confidentiel — Ne pas diffuser</span>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [selected, setSelected] = useState("monthly");
  const month = new Date().toLocaleDateString("fr-FR", { month:"long", year:"numeric" });

  return (
    <Layout
      title="Rapports & exports"
      subtitle="Génération des rapports réglementaires ARTP"
      actions={
        <button onClick={() => window.print()}
          className="btn-primary gap-2">
          <PrinterIcon className="h-4 w-4"/>
          Imprimer le rapport
        </button>
      }
    >
      <PrintableReport month={month}/>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sélecteur type */}
        <div className="xl:col-span-1 space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Type de rapport</h2>
          {REPORT_TYPES.map(r => (
            <button key={r.id} onClick={() => setSelected(r.id)}
              className={`w-full text-left card p-4 transition-all hover:shadow-md ${selected===r.id ? "ring-2 ring-artp-500 ring-offset-1" : ""}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{r.icon}</span>
                <div>
                  <p className="text-sm font-bold text-slate-800">{r.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{r.desc}</p>
                  <p className="text-xs text-slate-300 mt-1">{r.pages} pages estimées</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Paramètres + aperçu */}
        <div className="xl:col-span-2 space-y-4">
          <div className="card p-6">
            <h2 className="text-sm font-bold text-slate-700 mb-4">Configurer le rapport</h2>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Période</label>
                <select className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-artp-500">
                  <option>Juin 2026</option>
                  <option>Mai 2026</option>
                  <option>T2 2026 (Avr–Jun)</option>
                  <option>T1 2026 (Jan–Mar)</option>
                  <option>Année 2025</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Périmètre</label>
                <select className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-artp-500">
                  <option>National (toutes régions)</option>
                  <option>Dakar uniquement</option>
                  <option>Régions défavorisées</option>
                </select>
              </div>
            </div>

            {/* Sections incluses */}
            <div className="mb-5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Sections à inclure</p>
              <div className="grid grid-cols-2 gap-2">
                {["Indicateurs nationaux","Performance opérateurs","Analyse régionale","Zones blanches","Évolution temporelle","Recommandations"].map(s => (
                  <label key={s} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-artp-600"/>
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => window.print()} className="btn-primary flex-1">
                <PrinterIcon className="h-4 w-4"/>
                Imprimer / Aperçu PDF
              </button>
              <button className="btn-secondary flex-1">
                <DocumentArrowDownIcon className="h-4 w-4"/>
                Télécharger (PDF)
              </button>
            </div>
          </div>

          {/* Historique */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-slate-400"/>
              <h2 className="text-sm font-bold text-slate-700">Historique des rapports</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {HISTORY.map(h => (
                <div key={h.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-artp-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-base">{REPORT_TYPES.find(r=>r.id===h.type)?.icon ?? "📄"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{h.title}</p>
                    <p className="text-xs text-slate-400">{h.date} · {h.pages} pages</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`badge ${h.status==="validé"?"bg-green-50 text-green-700":h.status==="archivé"?"bg-slate-100 text-slate-500":"bg-amber-50 text-amber-700"}`}>
                      {h.status==="validé" && <CheckBadgeIcon className="h-3 w-3"/>}
                      {h.status}
                    </span>
                    <button className="text-xs text-artp-600 font-semibold hover:text-artp-700">
                      Télécharger
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
