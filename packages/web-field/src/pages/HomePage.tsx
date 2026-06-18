import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { useMissionsStore } from "../store/missions";
import BottomNav from "../components/BottomNav";
import {
  BoltIcon, MapPinIcon, ClipboardDocumentCheckIcon,
  CloudArrowUpIcon, ExclamationTriangleIcon, CheckCircleIcon,
  ArrowRightIcon, WifiIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function HomePage() {
  const { agent, isOnline } = useAuthStore();
  const { missions, pendingSync } = useMissionsStore();
  const navigate = useNavigate();

  const assigned  = missions.filter(m => m.status === "assigned").length;
  const inProg    = missions.filter(m => m.status === "in_progress").length;
  const completed = missions.filter(m => m.status === "completed" || m.status === "synced").length;
  const urgent    = missions.filter(m => m.priority === "urgent" && m.status !== "completed" && m.status !== "synced");
  const totalMeasures = missions.reduce((s, m) => s + m.measurements.length, 0);

  return (
    <div className="page bg-slate-50">
      {!isOnline && (
        <div className="offline-banner">
          Mode hors-ligne — données sauvegardées localement
        </div>
      )}

      {/* Header */}
      <div className="relative bg-gradient-to-br from-field-900 via-field-800 to-emerald-700 px-5 pt-6 pb-16 overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"/>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent"/>
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-emerald-300 text-xs font-semibold mb-1">
              {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
            </p>
            <h1 className="text-white text-xl font-black">Bonjour, {agent?.name?.split(" ")[0]} 👋</h1>
            <p className="text-emerald-200 text-sm mt-0.5">Badge · {agent?.badge}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${isOnline ? "bg-emerald-500/20 text-emerald-200" : "bg-amber-500/20 text-amber-200"}`}>
            <WifiIcon className="h-3.5 w-3.5"/>
            {isOnline ? "En ligne" : "Hors-ligne"}
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative mt-5 grid grid-cols-3 gap-2">
          {[
            { label: "Assignées",  value: assigned,  color: "text-amber-300",   bg: "bg-amber-500/15"   },
            { label: "En cours",   value: inProg,     color: "text-blue-300",    bg: "bg-blue-500/15"    },
            { label: "Terminées",  value: completed,  color: "text-emerald-300", bg: "bg-emerald-500/15" },
          ].map(k => (
            <div key={k.label} className={`${k.bg} rounded-2xl p-3 text-center`}>
              <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
              <p className="text-white/60 text-[10px] font-semibold">{k.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-4 pb-4">
        {/* Alertes urgentes */}
        {urgent.length > 0 && (
          <div className="card border-l-4 border-red-500 p-4 slide-up">
            <div className="flex items-center gap-2 mb-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500"/>
              <p className="text-sm font-bold text-red-700">{urgent.length} mission{urgent.length > 1 ? "s" : ""} urgente{urgent.length > 1 ? "s" : ""}</p>
            </div>
            {urgent.map(m => (
              <button key={m.id} onClick={() => navigate(`/missions/${m.id}`)}
                className="w-full flex items-center justify-between bg-red-50 rounded-xl px-3 py-2.5 mb-2 last:mb-0 active:scale-98">
                <div className="text-left">
                  <p className="text-sm font-semibold text-red-800">{m.title}</p>
                  <p className="text-xs text-red-500">{m.region} · {m.zone}</p>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-red-400 flex-shrink-0"/>
              </button>
            ))}
          </div>
        )}

        {/* Actions rapides */}
        <div className="card p-5 slide-up">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Actions rapides</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: BoltIcon,                    label: "Nouvelle mesure",   sub: "GPS auto",          color: "from-rose-500 to-pink-600",      onClick: () => navigate("/measure")  },
              { icon: MapPinIcon,                  label: "Zone blanche",      sub: "Signaler",           color: "from-violet-500 to-purple-600",  onClick: () => navigate("/measure?type=blind_spot") },
              { icon: ClipboardDocumentCheckIcon,  label: "Mes missions",      sub: `${assigned + inProg} actives`, color: "from-blue-500 to-indigo-600",    onClick: () => navigate("/missions") },
              { icon: CloudArrowUpIcon,            label: "Synchroniser",      sub: `${pendingSync.length} en attente`, color: "from-field-500 to-emerald-600", onClick: () => {} },
            ].map(({ icon: Icon, label, sub, color, onClick }) => (
              <button key={label} onClick={onClick}
                className="flex flex-col items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 active:scale-95 transition-transform text-left">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
                  <Icon className="h-5 w-5 text-white"/>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{label}</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Activité du jour */}
        <div className="card p-5 slide-up">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Activité aujourd'hui</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BoltIcon className="h-4 w-4 text-rose-400"/>
                <span className="text-sm text-slate-700">Mesures effectuées</span>
              </div>
              <span className="text-sm font-black text-slate-800">{totalMeasures}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudArrowUpIcon className="h-4 w-4 text-amber-400"/>
                <span className="text-sm text-slate-700">En attente de sync</span>
              </div>
              <span className={`text-sm font-black ${pendingSync.length > 0 ? "text-amber-600" : "text-slate-800"}`}>{pendingSync.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-emerald-400"/>
                <span className="text-sm text-slate-700">Missions terminées</span>
              </div>
              <span className="text-sm font-black text-slate-800">{completed}</span>
            </div>
          </div>

          {pendingSync.length > 0 && (
            <button className="btn-primary w-full mt-4 flex items-center justify-center gap-2 text-sm py-2.5">
              <CloudArrowUpIcon className="h-4 w-4"/>
              Synchroniser {pendingSync.length} mesure{pendingSync.length > 1 ? "s" : ""}
            </button>
          )}
        </div>

        {/* Info région */}
        <div className="bg-gradient-to-br from-field-800 to-emerald-700 rounded-2xl p-5 text-white slide-up">
          <p className="text-emerald-200 text-xs font-semibold mb-1">Votre zone d'affectation</p>
          <p className="text-xl font-black mb-1">Région de {agent?.region}</p>
          <p className="text-emerald-300 text-sm">Agent ARTP · Direction de la Qualité de Service</p>
        </div>
      </div>

      <BottomNav/>
    </div>
  );
}
