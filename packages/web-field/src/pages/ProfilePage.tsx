import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { useMissionsStore } from "../store/missions";
import BottomNav from "../components/BottomNav";
import {
  UserCircleIcon, MapPinIcon, PhoneIcon, EnvelopeIcon,
  ShieldCheckIcon, ArrowRightOnRectangleIcon, CloudArrowUpIcon,
  BoltIcon, ClipboardDocumentCheckIcon, WifiIcon,
} from "@heroicons/react/24/outline";

export default function ProfilePage() {
  const { agent, isOnline, logout } = useAuthStore();
  const { missions, pendingSync } = useMissionsStore();
  const navigate = useNavigate();

  const totalMeasures = missions.reduce((s, m) => s + m.measurements.length, 0);
  const completed = missions.filter(m => m.status === "completed" || m.status === "synced").length;

  const initials = agent?.name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() ?? "AG";

  return (
    <div className="page bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-600 to-orange-600 px-5 pt-8 pb-20 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"/>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white text-2xl font-black border border-white/30">
            {initials}
          </div>
          <div>
            <h1 className="text-white text-xl font-black">{agent?.name}</h1>
            <p className="text-orange-200 text-sm">Badge · {agent?.badge}</p>
            <div className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full text-xs font-bold ${isOnline ? "bg-emerald-500/20 text-emerald-200" : "bg-slate-500/20 text-slate-200"}`}>
              <WifiIcon className="h-3 w-3"/>
              {isOnline ? "En ligne" : "Hors-ligne"}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-8 space-y-4 pb-4">
        {/* Stats */}
        <div className="card p-4 grid grid-cols-3 gap-2 text-center">
          {[
            { icon: BoltIcon,                   value: totalMeasures, label: "Mesures",   color: "text-blue-600"    },
            { icon: ClipboardDocumentCheckIcon, value: completed,      label: "Missions",  color: "text-emerald-600" },
            { icon: CloudArrowUpIcon,           value: pendingSync.length, label: "À sync.", color: "text-amber-600"   },
          ].map(k => (
            <div key={k.label}>
              <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
              <p className="text-xs text-slate-400">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Infos agent */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-50">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Informations agent</p>
          </div>
          {[
            { icon: ShieldCheckIcon, label: "Matricule",  value: agent?.badge    },
            { icon: MapPinIcon,      label: "Région",     value: agent?.region   },
            { icon: EnvelopeIcon,    label: "Email",      value: agent?.email    },
            { icon: PhoneIcon,       label: "Téléphone",  value: agent?.phone    },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-50 last:border-0">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Icon className="h-4 w-4 text-amber-600"/>
              </div>
              <div>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-sm font-semibold text-slate-800">{value ?? "—"}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sync */}
        {pendingSync.length > 0 && (
          <div className="card p-4 border-l-4 border-amber-500">
            <div className="flex items-start gap-2 mb-3">
              <CloudArrowUpIcon className="h-5 w-5 text-amber-500 flex-shrink-0"/>
              <div>
                <p className="text-sm font-bold text-amber-700">{pendingSync.length} mesure{pendingSync.length > 1 ? "s" : ""} en attente</p>
                <p className="text-xs text-amber-500">Connectez-vous à internet pour synchroniser</p>
              </div>
            </div>
            <button className="btn-primary w-full text-sm py-2.5 flex items-center justify-center gap-2" disabled={!isOnline}>
              <CloudArrowUpIcon className="h-4 w-4"/>
              {isOnline ? "Synchroniser maintenant" : "Hors-ligne — synchronisation impossible"}
            </button>
          </div>
        )}

        {/* App info */}
        <div className="card p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Application</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Version</span><span className="font-semibold text-slate-600">1.0.0-beta</span></div>
            <div className="flex justify-between"><span className="text-slate-400">API</span><span className="font-semibold text-slate-600">localhost:3001</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Mode</span><span className="badge bg-amber-50 text-amber-700">Démonstration</span></div>
          </div>
        </div>

        {/* Déconnexion */}
        <button onClick={() => { logout(); navigate("/login", { replace: true }); }}
          className="btn-danger w-full flex items-center justify-center gap-2">
          <ArrowRightOnRectangleIcon className="h-5 w-5"/>
          Se déconnecter
        </button>
      </div>

      <BottomNav/>
    </div>
  );
}
