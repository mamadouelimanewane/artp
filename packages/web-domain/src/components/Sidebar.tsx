import { NavLink } from "react-router-dom";

const NAV = [
  { to: "/", label: "Dashboard", icon: "🌐" },
  { to: "/registre", label: "Registre .sn", icon: "📁" },
  { to: "/dnssec", label: "DNSSEC & Sécurité", icon: "🔒" },
  { to: "/cybersquatting", label: "Anti-Cybersquatting", icon: "🚫" },
  { to: "/registrars", label: "Registrars Agrées", icon: "🏢" },
  { to: "/observatoire", label: "Observatoire .sn", icon: "📊" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar text-white flex flex-col">
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-sm font-bold">P4</div>
          <div>
            <p className="font-bold text-sm">RegTech .sn</p>
            <p className="text-white/60 text-[10px]">Registre Domaines</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {NAV.map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150
               ${isActive ? "bg-white/20 font-semibold" : "text-white/70 hover:bg-white/10 hover:text-white"}`
            }
          >
            <span className="text-base">{n.icon}</span>
            {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-white/10">
        <a href="http://localhost:5186" className="text-white/50 text-xs hover:text-white/80 transition-colors">← Hub Central</a>
      </div>
    </aside>
  );
}
