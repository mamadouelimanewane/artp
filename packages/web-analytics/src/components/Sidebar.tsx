import { NavLink } from "react-router-dom";
import {
  HomeIcon, MapIcon, ChartBarIcon,
  BuildingOffice2Icon, DocumentChartBarIcon, Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const NAV = [
  { to:"/",          label:"Vue nationale",    Icon:HomeIcon              },
  { to:"/map",       label:"Carte réseau",     Icon:MapIcon               },
  { to:"/operators", label:"Opérateurs",       Icon:BuildingOffice2Icon   },
  { to:"/qos",       label:"Qualité réseau",   Icon:ChartBarIcon          },
  { to:"/reports",   label:"Rapports",         Icon:DocumentChartBarIcon  },
  { to:"/settings",  label:"Paramètres",       Icon:Cog6ToothIcon         },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-slate-100 flex flex-col z-40">
      <div className="px-4 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-artp-600 to-violet-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-base">A</span>
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 leading-none">ARTP Sénégal</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Tableau de bord national</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Données en direct
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} end={to === "/"}
            className={({ isActive }) =>
              `nav-item ${isActive ? "bg-artp-50 text-artp-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`
            }>
            <Icon className="h-4.5 w-4.5 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 text-center">
          ARTP © 2026 · v1.0 · Confidentiel
        </p>
      </div>
    </aside>
  );
}
