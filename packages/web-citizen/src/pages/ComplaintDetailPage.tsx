import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";

const STATUS_STEPS = ["submitted", "under_review", "forwarded_to_operator", "pending_response", "resolved"];

const STATUS_LABELS: Record<string, string> = {
  submitted: "Plainte soumise",
  under_review: "Examen ARTP",
  forwarded_to_operator: "Transmis à l'opérateur",
  pending_response: "En attente de réponse",
  resolved: "Résolue",
  closed: "Fermée",
  rejected: "Rejetée",
};

interface Event {
  id: string;
  status: string;
  message: string;
  createdAt: string;
}

interface ComplaintDetail {
  id: string;
  reference: string;
  subject: string;
  description: string;
  operator: string;
  category: string;
  status: string;
  priority: string;
  region: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
  events?: Event[];
}

export default function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/complaints/${id}`).then((r) => setComplaint(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-artp-600" /></div>;
  if (!complaint) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Plainte introuvable</div>;

  const currentStepIndex = STATUS_STEPS.indexOf(complaint.status);

  return (
    <div className="page">
      <TopBar title="Suivi de plainte" subtitle={complaint.reference} back />

      <div className="px-4 pt-4 max-w-lg mx-auto space-y-4">
        {/* En-tête */}
        <div className="card">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="font-bold text-gray-900">{complaint.subject}</p>
              <p className="text-sm text-gray-500 mt-0.5 capitalize">{complaint.operator} • {complaint.category.replace("_", " ")}</p>
            </div>
            <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${
              complaint.priority === "high" ? "bg-red-100 text-red-700" :
              complaint.priority === "medium" ? "bg-orange-100 text-orange-700" :
              "bg-gray-100 text-gray-600"
            }`}>
              {complaint.priority === "high" ? "Urgente" : complaint.priority === "medium" ? "Normale" : "Faible"}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-3 leading-relaxed">{complaint.description}</p>
          <p className="text-xs text-gray-400 mt-3">
            Déposée {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true, locale: fr })}
          </p>
        </div>

        {/* Timeline de progression */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Progression du dossier</h3>
          <div className="space-y-0">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentStepIndex;
              const active = i === currentStepIndex;
              const isLast = i === STATUS_STEPS.length - 1;
              return (
                <div key={step} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      done ? (active ? "bg-artp-600" : "bg-artp-200") : "bg-gray-100"
                    }`}>
                      {done
                        ? <CheckCircleIcon className={`h-4 w-4 ${active ? "text-white" : "text-artp-600"}`} />
                        : <ClockIcon className="h-4 w-4 text-gray-300" />
                      }
                    </div>
                    {!isLast && <div className={`w-0.5 flex-1 min-h-[24px] my-1 ${i < currentStepIndex ? "bg-artp-200" : "bg-gray-100"}`} />}
                  </div>
                  <div className="pb-5 flex-1">
                    <p className={`text-sm font-medium ${done ? "text-gray-900" : "text-gray-400"}`}>
                      {STATUS_LABELS[step]}
                    </p>
                    {active && (
                      <p className="text-xs text-artp-600 mt-0.5">En cours • Mise à jour {formatDistanceToNow(new Date(complaint.updatedAt), { addSuffix: true, locale: fr })}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Résolution si disponible */}
        {complaint.resolution && (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
            <p className="text-sm font-semibold text-green-800">Réponse de l'ARTP</p>
            <p className="text-sm text-green-700 mt-1.5 leading-relaxed">{complaint.resolution}</p>
          </div>
        )}

        {/* Événements */}
        {complaint.events && complaint.events.length > 0 && (
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">Historique</h3>
            <div className="space-y-3">
              {complaint.events.map((ev) => (
                <div key={ev.id} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-artp-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">{ev.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {format(new Date(ev.createdAt), "dd MMM yyyy à HH:mm", { locale: fr })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Infos de contact */}
        <div className="bg-artp-50 rounded-2xl p-4 text-center">
          <p className="text-xs text-artp-700 font-medium">Besoin d'aide ?</p>
          <p className="text-xs text-artp-600 mt-0.5">ARTP : (+221) 33 849 08 08 • contact@artp.sn</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
