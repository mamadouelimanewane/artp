import { useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon, MapIcon, ClipboardDocumentListIcon,
  PlusCircleIcon, UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolid, MapIcon as MapSolid,
  ClipboardDocumentListIcon as ClipboardSolid,
  PlusCircleIcon as PlusSolid, UserCircleIcon as UserSolid,
} from "@heroicons/react/24/solid";

const tabs = [
  { path: "/",          label: "Accueil",   Icon: HomeIcon,                  IconS: HomeSolid,      color: "text-field-600",  bg: "bg-field-100"  },
  { path: "/missions",  label: "Missions",  Icon: ClipboardDocumentListIcon, IconS: ClipboardSolid, color: "text-blue-600",   bg: "bg-blue-100"   },
  { path: "/measure",   label: "Mesure",    Icon: PlusCircleIcon,            IconS: PlusSolid,      color: "text-rose-600",   bg: "bg-rose-100"   },
  { path: "/map",       label: "Carte",     Icon: MapIcon,                   IconS: MapSolid,       color: "text-violet-600", bg: "bg-violet-100" },
  { path: "/profile",   label: "Profil",    Icon: UserCircleIcon,            IconS: UserSolid,      color: "text-amber-600",  bg: "bg-amber-100"  },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav bg-white/80 backdrop-blur-xl border-t border-slate-100">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ path, label, Icon, IconS, color, bg }) => {
          const active = pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-0.5 flex-1 py-1 relative"
            >
              {active && (
                <span className={`absolute top-0.5 inset-x-3 h-0.5 rounded-full ${color.replace("text-","bg-")}`}/>
              )}
              <span className={`p-1.5 rounded-xl transition-all ${active ? `${bg} ${color}` : "text-slate-400"}`}>
                {active ? <IconS className="h-5 w-5"/> : <Icon className="h-5 w-5"/>}
              </span>
              <span className={`text-[10px] font-semibold ${active ? color : "text-slate-400"}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
