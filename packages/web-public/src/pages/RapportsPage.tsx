import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { DocumentArrowDownIcon, CalendarDaysIcon, ChartBarIcon } from "@heroicons/react/24/outline";

const REPORTS = [
  { title: "Rapport QoS T2 2026",          date: "Juin 2026",   type: "Trimestriel",   size: "2.4 Mo",   highlight: true  },
  { title: "Rapport QoS T1 2026",          date: "Mars 2026",   type: "Trimestriel",   size: "2.1 Mo",   highlight: false },
  { title: "Bilan annuel QoS 2025",        date: "Jan. 2026",   type: "Annuel",        size: "5.8 Mo",   highlight: false },
  { title: "Rapport zones blanches 2025",  date: "Déc. 2025",   type: "Thématique",    size: "1.7 Mo",   highlight: false },
  { title: "Rapport QoS T4 2025",         date: "Déc. 2025",   type: "Trimestriel",   size: "2.0 Mo",   highlight: false },
  { title: "Rapport plaintes 2025",        date: "Nov. 2025",   type: "Thématique",    size: "1.3 Mo",   highlight: false },
  { title: "Rapport QoS T3 2025",         date: "Sept. 2025",  type: "Trimestriel",   size: "1.9 Mo",   highlight: false },
  { title: "Enquête satisfaction 2025",    date: "Août 2025",   type: "Enquête",       size: "3.2 Mo",   highlight: false },
];

const TYPE_COLORS: Record<string, string> = {
  "Trimestriel": "bg-blue-50 text-blue-700",
  "Annuel":      "bg-violet-50 text-violet-700",
  "Thématique":  "bg-amber-50 text-amber-700",
  "Enquête":     "bg-emerald-50 text-emerald-700",
};

export default function RapportsPage() {
  return (
    <div className="min-h-screen">
      <Navbar/>
      <div className="bg-gradient-to-br from-emerald-800 to-teal-700 px-4 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Rapports officiels ARTP</h1>
        <p className="text-emerald-300 max-w-xl mx-auto">Tous les rapports de qualité de service publiés par l'ARTP Sénégal</p>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Latest */}
        <section className="mb-10">
          <h2 className="text-xl font-black text-slate-800 mb-4">Dernier rapport publié</h2>
          <div className="bg-gradient-to-br from-artp-700 to-artp-500 rounded-2xl p-6 text-white flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0">
              <ChartBarIcon className="h-7 w-7 text-white"/>
            </div>
            <div className="flex-1">
              <p className="text-artp-200 text-sm mb-1">Trimestriel · Juin 2026</p>
              <h3 className="text-xl font-black mb-1">Rapport QoS T2 2026</h3>
              <p className="text-artp-200 text-sm">
                Analyse complète des indicateurs de qualité de service pour les 3 opérateurs mobiles et les 14 régions du Sénégal.
              </p>
            </div>
            <button className="flex items-center gap-2 bg-white text-artp-800 font-bold px-5 py-2.5 rounded-xl hover:bg-artp-50 transition-colors whitespace-nowrap flex-shrink-0">
              <DocumentArrowDownIcon className="h-4 w-4"/>
              Télécharger (2.4 Mo)
            </button>
          </div>
        </section>

        {/* All reports */}
        <section>
          <h2 className="text-xl font-black text-slate-800 mb-4">Tous les rapports</h2>
          <div className="card overflow-hidden">
            {REPORTS.map((r, i) => (
              <div key={i} className={`flex items-center gap-4 px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors ${r.highlight ? "bg-artp-50/30" : ""}`}>
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <DocumentArrowDownIcon className="h-5 w-5 text-slate-400"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className={`badge text-[10px] ${TYPE_COLORS[r.type] ?? "bg-slate-100 text-slate-500"}`}>{r.type}</span>
                    {r.highlight && <span className="badge bg-artp-50 text-artp-700 text-[10px]">Nouveau</span>}
                  </div>
                  <p className="text-sm font-bold text-slate-800 truncate">{r.title}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><CalendarDaysIcon className="h-3 w-3"/>{r.date}</span>
                    <span>{r.size}</span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-artp-600 hover:text-artp-800 font-semibold text-sm flex-shrink-0 transition-colors">
                  <DocumentArrowDownIcon className="h-4 w-4"/>
                  <span className="hidden sm:inline">Télécharger</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Note */}
        <div className="mt-8 bg-slate-50 rounded-2xl p-5 border border-slate-100 text-sm text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">À propos des données</p>
          <p>Les rapports ARTP sont publiés conformément à la loi n°2011-01 portant Code des Télécommunications du Sénégal. Les données sont collectées auprès des opérateurs et vérifiées par les agents terrain ARTP.</p>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
