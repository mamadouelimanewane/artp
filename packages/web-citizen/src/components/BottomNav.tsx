import { NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon, ChatBubbleLeftRightIcon, SignalIcon,
  ClipboardDocumentListIcon, ChartBarIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  ChatBubbleLeftRightIcon as ChatSolid,
  SignalIcon as SignalSolid,
  ClipboardDocumentListIcon as ClipboardSolid,
  ChartBarIcon as ChartSolid,
} from "@heroicons/react/24/solid";

const tabs = [
  { to: "/",             label: "Accueil",     Icon: HomeIcon,                  IconActive: HomeIconSolid,   color: "text-blue-600",    pill: "bg-blue-100"    },
  { to: "/complaints",   label: "Plaintes",    Icon: ClipboardDocumentListIcon, IconActive: ClipboardSolid,  color: "text-rose-600",    pill: "bg-rose-100"    },
  { to: "/qos",          label: "Test",        Icon: SignalIcon,                 IconActive: SignalSolid,     color: "text-emerald-600", pill: "bg-emerald-100" },
  { to: "/comparateur",  label: "Tarifs",      Icon: ChartBarIcon,               IconActive: ChartSolid,      color: "text-teal-600",    pill: "bg-teal-100"    },
  { to: "/chat",         label: "Assistant",   Icon: ChatBubbleLeftRightIcon,    IconActive: ChatSolid,       color: "text-violet-600",  pill: "bg-violet-100"  },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-100 shadow-2xl shadow-black/10"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center max-w-lg mx-auto px-1">
        {tabs.map(({ to, label, Icon, IconActive, color, pill }) => {
          const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className="flex-1 flex flex-col items-center justify-center pt-2 pb-1.5 gap-0.5 transition-all duration-200 active:scale-90 min-w-0"
            >
              <div className={`flex items-center justify-center w-10 h-7 rounded-2xl transition-all duration-200 ${isActive ? pill : "bg-transparent"}`}>
                {isActive
                  ? <IconActive className={`h-5 w-5 ${color}`} />
                  : <Icon className="h-5 w-5 text-gray-400" />
                }
              </div>
              <span className={`text-[10px] font-semibold leading-none transition-colors truncate max-w-full px-1 ${isActive ? color : "text-gray-400"}`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
