import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  MapIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  DocumentChartBarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "../store/auth";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import clsx from "clsx";
import ChatbotWidget from "./ChatbotWidget";

const nav = [
  { to: "/dashboard", label: "Tableau de bord", icon: HomeIcon },
  { to: "/complaints", label: "Plaintes", icon: ChatBubbleLeftRightIcon, badge: true },
  { to: "/qos-map", label: "Carte QoS", icon: MapIcon },
  { to: "/stats", label: "Statistiques", icon: ChartBarIcon },
  { to: "/users", label: "Utilisateurs", icon: UsersIcon },
  { to: "/notifications", label: "Notifications", icon: BellIcon },
  { to: "/reports", label: "Rapports", icon: DocumentChartBarIcon },
];

const breadcrumbLabels: Record<string, string> = {
  dashboard: "Tableau de bord",
  complaints: "Plaintes",
  "qos-map": "Carte QoS",
  stats: "Statistiques",
  users: "Utilisateurs",
  notifications: "Notifications",
  reports: "Rapports",
  profile: "Mon profil",
};

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);
  const [notifCount] = useState(3);

  useEffect(() => {
    api
      .get("/complaints?status=submitted&limit=1")
      .then((r) => setPendingCount(r.data.pagination?.total ?? 0))
      .catch(() => {});
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const segments = location.pathname.split("/").filter(Boolean);
  const currentSegment = segments[0] ?? "dashboard";
  const breadcrumb = breadcrumbLabels[currentSegment] ?? currentSegment;
  const isDetail = segments.length > 1;

  const initials =
    user?.name
      ? user.name
          .split(" ")
          .slice(0, 2)
          .map((w) => w[0])
          .join("")
          .toUpperCase()
      : (user?.phone?.slice(-2) ?? "?");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-artp-900 text-white flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-artp-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-artp-500 flex items-center justify-center font-extrabold text-sm tracking-tight">
              AR
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">Mon Réseau SN</p>
              <p className="text-artp-300 text-xs">Portail ARTP</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {nav.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-artp-600 text-white shadow-sm"
                    : "text-artp-200 hover:bg-artp-800 hover:text-white"
                )
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {badge && pendingCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {pendingCount > 99 ? "99+" : pendingCount}
                </span>
              )}
              {to === "/notifications" && notifCount > 0 && (
                <span className="bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {notifCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-artp-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-artp-500 flex items-center justify-center text-xs font-bold uppercase flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name ?? user?.phone ?? "Utilisateur"}
              </p>
              <p className="text-xs text-artp-300 capitalize">
                {user?.role?.replace("_", " ") ?? ""}
              </p>
            </div>
          </div>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-2 text-xs transition-colors w-full py-1 mb-1",
                isActive ? "text-white" : "text-artp-300 hover:text-white"
              )
            }
          >
            <UserCircleIcon className="h-4 w-4" />
            Mon profil
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-artp-300 hover:text-white text-xs transition-colors w-full py-1"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          {/* Fil d'ariane */}
          <nav className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">ARTP</span>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-900">{breadcrumb}</span>
            {isDetail && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-gray-500">Détail</span>
              </>
            )}
          </nav>

          {/* Actions header */}
          <div className="flex items-center gap-2">
            <NavLink
              to="/notifications"
              className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <BellIcon className="h-5 w-5" />
              {notifCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  {notifCount}
                </span>
              )}
            </NavLink>
            <div className="h-6 w-px bg-gray-200 mx-1" />
            <p className="text-xs text-gray-500">
              Autorité de Régulation des Télécommunications et des Postes
            </p>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <ChatbotWidget />
    </div>
  );
}
