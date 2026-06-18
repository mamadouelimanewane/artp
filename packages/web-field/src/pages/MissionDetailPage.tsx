import { useParams, useNavigate } from "react-router-dom";
import { useMissionsStore } from "../store/missions";
import BottomNav from "../components/BottomNav";
import {
  ArrowLeftIcon, BoltIcon, MapPinIcon, CheckCircleIcon,
  ClockIcon, CloudArrowUpIcon, ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const MEASURE_LABELS: Record<string, string> = {
  download: "Débit descendant", upload: "Débit montant",
  latency: "Latence", coverage: "Couverture", blind_spot: "Zone blanche",
};
const TECH_COLORS: Record<string, string> = {
  "4G": "bg-blue-100 text-blue-700", "3G": "bg-amber-100 text-amber-700",
  "2G": "bg-red-100 text-red-700", "5G": "bg-violet-100 text-violet-700",
  "No signal": "bg-slate-100 text-slate-500",
};

export default function MissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { missions, updateStatus, markSynced } = useMissionsStore();
  const mission = missions.find(m => m.id === id);

  if (!mission) return (
    <div className="page bg-slate-50 flex items-center justify-center">
      <p className="text-slate-400">Mission introuvable</p>
    </div>
  );

  const progress = mission.targetCount > 0
    ? Math.min(100, Math.round((mission.measurements.length / mission.targetCount) * 100))
    : 0;

  return (
    <div className="page bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-700 px-5 pt-8 pb-16 relative overflow-hidden">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-blue-200 text-sm mb-4">
          <ArrowLeftIcon className="h-4 w-4"/> Retour
        </button>
        <div className="flex items-start gap-2 mb-2">
          {mission.priority === "urgent" && <ExclamationTriangleIcon className="h-5 w-5 text-red-300 flex-shrink-0 mt-0.5"/>}
          <h1 className="text-white text-lg font-black leading-snug">{mission.title}</h1>
        </div>
        <p className="text-blue-200 text-sm">{mission.region} · {mission.zone}</p>
      </div>

      <div className="px-4 -mt-6 space-y-4 pb-4">
        {/* Progress card */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-slate-700">Progression</p>
            <span className="text-2xl font-black text-blue-600">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all" style={{ width: `${progress}%` }}/>
          </div>
          <p className="text-xs text-slate-400">{mission.measurements.length} / {mission.targetCount} mesures effectuées</p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-0.5">Assignée le</p>
              <p className="text-sm font-semibold text-slate-700">{format(mission.assignedAt, "d MMM yyyy", { locale: fr })}</p>
            </div>
            <div className={`rounded-xl p-3 ${mission.dueDate < Date.now() && mission.status !== "completed" ? "bg-red-50" : "bg-slate-50"}`}>
              <p className="text-xs text-slate-400 mb-0.5">Échéance</p>
              <p className={`text-sm font-semibold ${mission.dueDate < Date.now() && mission.status !== "completed" ? "text-red-600" : "text-slate-700"}`}>
                {formatDistanceToNow(mission.dueDate, { addSuffix: true, locale: fr })}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Description</p>
          <p className="text-sm text-slate-700 leading-relaxed">{mission.description}</p>
        </div>

        {/* Actions */}
        {mission.status !== "completed" && mission.status !== "synced" && (
          <div className="card p-4 space-y-3">
            <button onClick={() => navigate(`/measure?mission=${mission.id}`)}
              className="btn-primary w-full flex items-center justify-center gap-2">
              <BoltIcon className="h-5 w-5"/>
              Ajouter une mesure
            </button>
            {mission.measurements.length > 0 && (
              <>
                <button onClick={() => updateStatus(mission.id, "completed")}
                  className="btn-secondary w-full flex items-center justify-center gap-2">
                  <CheckCircleIcon className="h-5 w-5"/>
                  Marquer comme terminée
                </button>
                <button onClick={() => markSynced(mission.id)}
                  className="w-full flex items-center justify-center gap-2 text-sm text-field-700 font-semibold py-2">
                  <CloudArrowUpIcon className="h-4 w-4"/>
                  Synchroniser les données
                </button>
              </>
            )}
          </div>
        )}

        {/* Mesures */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-700">Mesures collectées</p>
            <span className="badge bg-blue-50 text-blue-700">{mission.measurements.length}</span>
          </div>
          {mission.measurements.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <MapPinIcon className="h-8 w-8 text-slate-200 mx-auto mb-2"/>
              <p className="text-slate-400 text-sm">Aucune mesure encore</p>
              <p className="text-slate-300 text-xs mt-1">Commencez par ajouter une mesure GPS</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {mission.measurements.map(m => (
                <div key={m.id} className="px-5 py-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BoltIcon className="h-4 w-4 text-white"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-slate-800">{MEASURE_LABELS[m.type] ?? m.type}</p>
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-lg ${TECH_COLORS[m.technology] ?? "bg-slate-100 text-slate-500"}`}>{m.technology}</span>
                      {!m.synced && <span className="badge bg-amber-50 text-amber-600">Non sync.</span>}
                    </div>
                    <p className="text-sm font-black text-blue-600">{m.value} {m.unit}</p>
                    <p className="text-xs text-slate-400">{m.operator} · {format(m.timestamp, "HH:mm", { locale: fr })}</p>
                    {m.note && <p className="text-xs text-slate-500 mt-0.5 italic">{m.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav/>
    </div>
  );
}
