import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  MapIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "../store/auth";
import clsx from "clsx";

const nav = [
  { to: "/dashboard", label: "Tableau de bord", icon: HomeIcon },
  { to: "/complaints", label: "Plaintes", icon: ChatBubbleLeftRightIcon },
  { to: "/qos-map", label: "Carte QoS", icon: MapIcon },
  { to: "/stats", label: "Statistiques", icon: ChartBarIcon },
  { to: "/users", label: "Utilisateurs", icon: UsersIcon },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-artp-800 text-white flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-artp-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-artp-400 flex items-center justify-center font-bold text-sm">
              AR
            </div>
            <div>
              <p className="font-semibold text-sm">Mon Réseau SN</p>
              <p className="text-artp-300 text-xs">Portail ARTP</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-artp-600 text-white"
                    : "text-artp-200 hover:bg-artp-700 hover:text-white"
                )
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-artp-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-artp-500 flex items-center justify-center text-xs font-bold uppercase">
              {user?.name?.[0] ?? user?.phone?.[4] ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name ?? user?.phone}</p>
              <p className="text-xs text-artp-300 capitalize">{user?.role?.replace("_", " ")}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-artp-300 hover:text-white text-xs transition-colors w-full"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-sm font-medium text-gray-500">
            ARTP — Autorité de Régulation des Télécommunications et des Postes
          </h1>
          <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <BellIcon className="h-5 w-5" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
