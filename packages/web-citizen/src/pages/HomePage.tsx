import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { api } from "../services/api";
import BottomNav from "../components/BottomNav";
import {
  PlusCircleIcon, SignalIcon, ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon, ChevronRightIcon, SparklesIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string; Icon: React.ElementType }> = {
  submitted:             { label: "Soumise",    color: "text-blue-600 bg-blue-50",     dot: "bg-blue-400",    Icon: ClockIcon },
  under_review:          { label: "En examen",  color: "text-amber-600 bg-amber-50",   dot: "bg-amber-400",   Icon: ClockIcon },
  forwarded_to_operator: { label: "Transmise",  color: "text-violet-600 bg-violet-50", dot: "bg-violet-400",  Icon: ClockIcon },
  pending_response:      { label: "En attente", color: "text-orange-600 bg-orange-50", dot: "bg-orange-400",  Icon: ClockIcon },
  resolved:              { label: "Résolue",    color: "text-emerald-600 bg-emerald-50",dot:"bg-emerald-400", Icon: CheckCircleIcon },
  closed:                { label: "Fermée",     color: "text-gray-600 bg-gray-50",     dot: "bg-gray-400",    Icon: CheckCircleIcon },
  rejected:              { label: "Rejetée",    color: "text-red-600 bg-red-50",       dot: "bg-red-400",     Icon: ExclamationTriangleIcon },
};

interface Complaint { id: string; reference: string; subject: string; operator: string; status: string; createdAt: string }
interface PublicStats { totalMeasures: number; resolvedComplaints: number; blindSpotsReported: number }

const ACTIONS = [
  { to: "/complaints/new", label: "Déposer une plainte", sub: "Signaler un problème",  Icon: PlusCircleIcon,           gradient: "from-rose-500 to-pink-600",    shadow: "shadow-rose-200"    },
  { to: "/qos",            label: "Tester mon réseau",   sub: "Mesurer la qualité",    Icon: SignalIcon,                gradient: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-200" },
  { to: "/chat",           label: "Assistant ARTP",      sub: "Aide & questions",      Icon: ChatBubbleLeftRightIcon,   gradient: "from-violet-500 to-purple-600",shadow: "shadow-violet-200"  },
  { to: "/complaints",     label: "Mes plaintes",        sub: "Suivre l'avancement",   Icon: ClipboardDocumentListIcon, gradient: "from-amber-500 to-orange-500", shadow: "shadow-amber-200"   },
];

export default function HomePage() {
  const user = useAuthStore((s) => s.user);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [notifCount, setNotifCount] = useState(0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  const firstName = user?.name?.split(" ")[0] ?? "citoyen";
  const initial = firstName[0]?.toUpperCase() ?? "C";

  useEffect(() => {
    api.get("/complaints?limit=3").then((r) => setComplaints(r.data.data?.complaints ?? r.data.data ?? [])).catch(() => {});
    api.get("/stats/public").then((r) => setStats(r.data.data)).catch(() => {});
    api.get("/notifications?unreadOnly=true").then((r) => setNotifCount(r.data.data?.length ?? 0)).catch(() => {});
  }, []);

  return (
    <div className="page">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a3aff] via-[#2845cc] to-[#6c3ff5] px-4 pt-10 pb-16 sm:px-6 sm:pt-12">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-32 rounded-full bg-blue-800/30 blur-3xl pointer-events-none" />

        <div className="relative flex items-start justify-between max-w-lg mx-auto">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <SparklesIcon className="h-4 w-4 text-yellow-300 flex-shrink-0" />
              <p className="text-blue-200 text-sm font-medium">{greeting} !</p>
            </div>
            <h1 className="text-xl font-extrabold text-white capitalize tracking-tight sm:text-2xl">{firstName} 👋</h1>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className="text-xs bg-white/15 text-blue-100 px-2.5 py-1 rounded-full capitalize">📍 {user?.region ?? "Sénégal"}</span>
              <span className="text-xs bg-white/15 text-blue-100 px-2.5 py-1 rounded-full capitalize">📶 {user?.operator ?? "—"}</span>
            </div>
          </div>
          <Link to="/profile" className="relative flex-shrink-0 ml-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-base">{initial}</span>
            </div>
            {notifCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold border-2 border-white">
                {notifCount}
              </span>
            )}
          </Link>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-3 gap-2 mt-5 max-w-lg mx-auto">
          {[
            { label: "Mesures",       value: stats?.totalMeasures ?? "—",       emoji: "📶" },
            { label: "Résolues",      value: stats?.resolvedComplaints ?? "—",  emoji: "✅" },
            { label: "Zones blanches",value: stats?.blindSpotsReported ?? "—",  emoji: "⚠️" },
          ].map((s) => (
            <div key={s.label} className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-3 text-center">
              <div className="text-lg sm:text-xl">{s.emoji}</div>
              <div className="text-white font-extrabold text-lg leading-none mt-1">{s.value}</div>
              <div className="text-blue-100 text-[9px] sm:text-[10px] mt-1 font-medium leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Corps */}
      <div className="px-4 -mt-5 max-w-lg mx-auto space-y-5">
        {/* Actions */}
        <div>
          <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Actions rapides</h2>
          <div className="grid grid-cols-2 gap-3">
            {ACTIONS.map(({ to, label, sub, Icon, gradient, shadow }) => (
              <Link key={to} to={to}
                className={`bg-white rounded-3xl p-4 shadow-lg ${shadow} shadow-sm hover:shadow-xl active:scale-95 transition-all duration-200 flex flex-col gap-3`}>
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm leading-tight">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Plaintes récentes */}
        {complaints.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Plaintes récentes</h2>
              <Link to="/complaints" className="text-xs text-artp-600 font-bold flex items-center gap-0.5">
                Tout voir <ChevronRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-2.5">
              {complaints.map((c) => {
                const cfg = STATUS_CONFIG[c.status] ?? STATUS_CONFIG["submitted"];
                const { Icon } = cfg;
                return (
                  <Link key={c.id} to={`/complaints/${c.id}`}
                    className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 active:scale-[0.99] transition-all">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{c.subject}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{c.reference} • {c.operator}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                      <ChevronRightIcon className="h-3.5 w-3.5 text-gray-300" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Bannière ARTP */}
        <div className="bg-gradient-to-r from-artp-600 to-violet-600 rounded-3xl p-4 flex gap-3 shadow-lg shadow-artp-200">
          <span className="text-2xl flex-shrink-0">📡</span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white">Seuils ARTP en vigueur</p>
            <p className="text-xs text-blue-100 mt-0.5">Débit min. <b>5 Mbps</b> · Latence max. <b>100 ms</b> · Dispo. <b>≥ 99%</b></p>
          </div>
        </div>
      </div>
    </div>
  );
}
