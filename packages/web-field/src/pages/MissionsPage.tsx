import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMissionsStore, MissionStatus } from "../store/missions";
import BottomNav from "../components/BottomNav";
import {
  ClipboardDocumentListIcon, ArrowRightIcon,
  ExclamationTriangleIcon, ClockIcon, CheckCircleIcon, CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const STATUS_CONFIG: Record<MissionStatus, { label: string; color: string; bg: string; dot: string }> = {
  assigned:    { label: "Assignée",     color: "text-amber-700",   bg: "bg-amber-50",   dot: "bg-amber-500"   },
  in_progress: { label: "En cours",     color: "text-blue-700",    bg: "bg-blue-50",    dot: "bg-blue-500"    },
  completed:   { label: "Terminée",     color: "text-emerald-700", bg: "bg-emerald-50", dot: "bg-emerald-500" },
  synced:      { label: "Synchronisée", color: "text-slate-600",   bg: "bg-slate-50",   dot: "bg-slate-400"   },
};

const PRIORITY_CONFIG = {
  urgent: { label: "Urgent",  color: "text-red-700",    bg: "bg-red-50"    },
  normal: { label: "Normal",  color: "text-blue-700",   bg: "bg-blue-50"   },
  low:    { label: "Faible",  color: "text-slate-600",  bg: "bg-slate-100" },
};

export default function MissionsPage() {
  const { missions } = useMissionsStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<MissionStatus | "all">("all");

  const filtered = filter === "all" ? missions : missions.filter(m => m.status === filter);
  const counts = {
    all:         missions.length,
    assigned:    missions.filter(m => m.status === "assigned").length,
    in_progress: missions.filter(m => m.status === "in_progress").length,
    completed:   missions.filter(m => m.status === "completed").length,
    synced:      missions.filter(m => m.status === "synced").length,
  };

  return (
    <div className="page bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-700 px-5 pt-8 pb-14 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"/>
        <div className="flex items-center gap-3 mb-1">
          <ClipboardDocumentListIcon className="h-6 w-6 text-blue-200"/>
          <h1 className="text-white text-xl font-black">Mes missions</h1>
        </div>
        <p className="text-blue-200 text-sm">{missions.length} missions au total</p>
      </div>

      <div className="px-4 -mt-6 space-y-4">
        {/* Filtres */}
        <div className="card p-2 flex gap-1 overflow-x-auto">
          {([["all","Toutes",[]], ["assigned","Assignées",[]], ["in_progress","En cours",[]], ["completed","Terminées",[]]] as [string, string, string[]][]).map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k as typeof filter)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === k ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
              {l} <span className={`ml-1 ${filter === k ? "text-blue-200" : "text-slate-400"}`}>{counts[k as keyof typeof counts]}</span>
            </button>
          ))}
        </div>

        {/* Liste */}
        {filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <ClipboardDocumentListIcon className="h-10 w-10 text-slate-200 mx-auto mb-3"/>
            <p className="text-slate-400 text-sm">Aucune mission dans cette catégorie</p>
          </div>
        ) : (
          filtered.map(mission => {
            const sc = STATUS_CONFIG[mission.status];
            const pc = PRIORITY_CONFIG[mission.priority];
            const progress = mission.targetCount > 0
              ? Math.min(100, Math.round((mission.measurements.length / mission.targetCount) * 100))
              : 0;
            const overdue = mission.dueDate < Date.now() && mission.status !== "completed" && mission.status !== "synced";

            return (
              <button key={mission.id} onClick={() => navigate(`/missions/${mission.id}`)}
                className="card w-full p-4 text-left active:scale-98 transition-transform block">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`badge ${pc.bg} ${pc.color}`}>
                        {mission.priority === "urgent" && <ExclamationTriangleIcon className="h-3 w-3"/>}
                        {pc.label}
                      </span>
                      <span className={`badge ${sc.bg} ${sc.color}`}>
                        <span className={`dot-green w-1.5 h-1.5 rounded-full ${sc.dot}`}/>
                        {sc.label}
                      </span>
                      {overdue && <span className="badge bg-red-50 text-red-600">En retard</span>}
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 truncate">{mission.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{mission.region} · {mission.zone}</p>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-slate-300 flex-shrink-0 mt-1"/>
                </div>

                {/* Progress */}
                {mission.status !== "completed" && mission.status !== "synced" && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>{mission.measurements.length}/{mission.targetCount} mesures</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }}/>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  {mission.status === "completed" || mission.status === "synced" ? (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircleIcon className="h-3.5 w-3.5"/>
                      Terminée {mission.completedAt ? formatDistanceToNow(mission.completedAt, { addSuffix: true, locale: fr }) : ""}
                    </span>
                  ) : (
                    <>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3.5 w-3.5"/>
                        Échéance : {formatDistanceToNow(mission.dueDate, { addSuffix: true, locale: fr })}
                      </span>
                      {mission.status === "synced" && (
                        <span className="flex items-center gap-1 text-field-600">
                          <CloudArrowUpIcon className="h-3.5 w-3.5"/>
                          Synchronisée
                        </span>
                      )}
                    </>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      <BottomNav/>
    </div>
  );
}
