import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import {
  HomeIcon, ClipboardDocumentListIcon, ChartBarIcon,
  DocumentArrowUpIcon, BellIcon, UserIcon, ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

const OP_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  orange:   { label: "Orange Sénégal",   color: "text-orange-600",  bg: "bg-orange-50",  dot: "bg-orange-500" },
  free:     { label: "Free Sénégal",     color: "text-indigo-600",  bg: "bg-indigo-50",  dot: "bg-indigo-500" },
  expresso: { label: "Expresso Sénégal", color: "text-red-600",     bg: "bg-red-50",     dot: "bg-red-500"    },
};

const NAV = [
  { to: "/",          label: "Tableau de bord",   Icon: HomeIcon },
  { to: "/complaints",label: "Plaintes",           Icon: ClipboardDocumentListIcon },
  { to: "/qos",       label: "Rapports QoS",       Icon: ChartBarIcon },
  { to: "/reports",   label: "Soumettre rapport",  Icon: DocumentArrowUpIcon },
  { to: "/alerts",    label: "Alertes",            Icon: BellIcon },
  { to: "/profile",   label: "Mon compte",         Icon: UserIcon },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const op = OP_CONFIG[user?.operator ?? ""] ?? OP_CONFIG["orange"];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-slate-100 flex flex-col z-40">
      {/* Logo ARTP */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-op-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm">A</span>
          </div>
          <div>
            <p className="text-xs font-black text-slate-900 leading-none">ARTP</p>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">Portail Opérateurs</p>
          </div>
        </div>
        {/* Opérateur connecté */}
        <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl ${op.bg}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${op.dot} flex-shrink-0`} />
          <div className="min-w-0">
            <p className={`text-xs font-bold ${op.color} truncate`}>{op.label}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.name ?? user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : "nav-link-inactive"}`}
          >
            <Icon className="h-4.5 w-4.5 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Déconnexion */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="nav-link nav-link-inactive w-full text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <ArrowRightStartOnRectangleIcon className="h-4.5 w-4.5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
