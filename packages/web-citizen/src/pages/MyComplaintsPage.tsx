import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import { PlusIcon, ChevronRightIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const STATUS_CONFIG: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  submitted:             { label: "Soumise",      color: "text-blue-600 bg-blue-50",     Icon: ClockIcon },
  under_review:          { label: "En examen",    color: "text-yellow-600 bg-yellow-50",  Icon: ClockIcon },
  forwarded_to_operator: { label: "Transmise",    color: "text-purple-600 bg-purple-50",  Icon: ClockIcon },
  pending_response:      { label: "En attente",   color: "text-orange-600 bg-orange-50",  Icon: ClockIcon },
  resolved:              { label: "Résolue",      color: "text-green-600 bg-green-50",    Icon: CheckCircleIcon },
  closed:                { label: "Fermée",       color: "text-gray-500 bg-gray-100",     Icon: CheckCircleIcon },
  rejected:              { label: "Rejetée",      color: "text-red-600 bg-red-50",        Icon: ExclamationTriangleIcon },
};

const OP_COLORS: Record<string, string> = {
  orange: "bg-orange-500",
  free: "bg-indigo-500",
  expresso: "bg-red-500",
};

interface Complaint {
  id: string;
  reference: string;
  subject: string;
  operator: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
}

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/complaints?limit=50").then((r) => {
      setComplaints(r.data.data?.complaints ?? r.data.data ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <div className="page">
      <TopBar
        title="Mes plaintes"
        subtitle={`${complaints.length} dossier${complaints.length > 1 ? "s" : ""}`}
        right={
          <Link to="/complaints/new" className="flex items-center gap-1.5 bg-artp-600 text-white text-sm font-medium px-3 py-1.5 rounded-xl">
            <PlusIcon className="h-4 w-4" />
            Nouvelle
          </Link>
        }
      />

      {/* Filtres */}
      <div className="px-4 py-3 max-w-lg mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { value: "all", label: "Toutes" },
            { value: "submitted", label: "Soumises" },
            { value: "under_review", label: "En cours" },
            { value: "resolved", label: "Résolues" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f.value ? "bg-artp-600 text-white" : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto">
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map((i) => (
              <div key={i} className="card h-20 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <p className="font-semibold text-gray-700">Aucune plainte</p>
            <p className="text-sm text-gray-400 mt-1">Déposez votre première plainte</p>
            <Link to="/complaints/new" className="inline-block mt-5 btn-primary max-w-xs">
              Déposer une plainte
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((c) => {
              const cfg = STATUS_CONFIG[c.status] ?? STATUS_CONFIG["submitted"];
              const { Icon } = cfg;
              return (
                <Link key={c.id} to={`/complaints/${c.id}`} className="card flex items-center gap-3 hover:shadow-md transition-all active:scale-98">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${OP_COLORS[c.operator] ?? "bg-gray-400"}`}>
                    <span className="text-white font-bold text-xs">{c.operator[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.subject}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`status-badge ${cfg.color}`}>
                        <Icon className="h-3 w-3 mr-1" />
                        {cfg.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                  </div>
                  <ChevronRightIcon className="h-4 w-4 text-gray-300 flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
