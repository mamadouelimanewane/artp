import { NavLink } from "react-router-dom";

const NAV_ACCUEIL = [
  { to: "/accueil", label: "Accueil SIGNUM", icon: "🏛️" },
];

const NAV_CORE = [
  { to: "/dashboard",   label: "Centre de Commandement", icon: "🛰️" },
  { to: "/trafic",      label: "Surveillance Trafic",    icon: "📡" },
  { to: "/imei",        label: "Registre IMEI National", icon: "📱" },
  { to: "/mobilemoney", label: "Mobile Money & AML",     icon: "💳" },
  { to: "/fiscalite",   label: "Gouvernance Fiscale",    icon: "💰" },
  { to: "/ia",          label: "IA Prédictive",          icon: "🤖" },
  { to: "/souverainete",label: "Souveraineté & Audit",   icon: "🛡️" },
];

const NAV_SIMU = [
  { to: "/simulateur", label: "Simulateur de Terrain", icon: "🎮" },
];

const NAV_PHASE1 = [
  { to: "/cdr",         label: "CDR — Réconciliation",   icon: "📞" },
  { to: "/cnie",        label: "CNIE / SIM KYC",         icon: "🪪" },
  { to: "/dossier",     label: "Dossier Légal Auto",     icon: "⚖️" },
  { to: "/ott",         label: "OTT Monitor",            icon: "🌐" },
];

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 min-h-screen flex flex-col text-white"
      style={{ background: "linear-gradient(180deg, #020617 0%, #0f0a2e 50%, #0a1628 100%)" }}>

      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg"
            style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)" }}>S</div>
          <div>
            <p className="font-black text-base tracking-tight text-white">SIGNUM</p>
            <p className="text-[10px] text-indigo-300 font-medium">by Processingenierie</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          3 opérateurs connectés · Temps réel
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 overflow-auto">
        <div className="space-y-0.5 mb-3">
          {NAV_ACCUEIL.map(n => (
            <NavLink key={n.to} to={n.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                 ${isActive ? "text-white font-semibold" : "text-white/55 hover:text-white/90 hover:bg-white/5"}`}
              style={({ isActive }) => isActive
                ? { background: "linear-gradient(90deg, rgba(99,102,241,0.3), rgba(6,182,212,0.15))", borderLeft: "2px solid #06b6d4" }
                : {}}>
              <span className="text-base w-5 text-center">{n.icon}</span>
              <span className="text-xs">{n.label}</span>
            </NavLink>
          ))}
        </div>
        <div className="pt-2 border-t border-white/10 mb-3 space-y-0.5">
          {NAV_CORE.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                 ${isActive ? "text-white font-semibold" : "text-white/55 hover:text-white/90 hover:bg-white/5"}`}
              style={({ isActive }) => isActive
                ? { background: "linear-gradient(90deg, rgba(99,102,241,0.3), rgba(6,182,212,0.15))", borderLeft: "2px solid #6366f1" }
                : {}}>
              <span className="text-base w-5 text-center">{n.icon}</span>
              <span className="text-xs">{n.label}</span>
            </NavLink>
          ))}
        </div>
        <div className="pt-3 border-t border-white/10">
          <p className="text-[9px] text-violet-400 font-bold px-3 mb-2 uppercase tracking-widest">🎮 Simulateur Live</p>
          <div className="space-y-0.5 mb-3">
            {NAV_SIMU.map(n => (
              <NavLink key={n.to} to={n.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                   ${isActive ? "text-white font-semibold" : "text-white/55 hover:text-white/90 hover:bg-white/5"}`}
                style={({ isActive }) => isActive
                  ? { background: "linear-gradient(90deg, rgba(139,92,246,0.35), rgba(99,102,241,0.15))", borderLeft: "2px solid #8b5cf6" }
                  : {}}>
                <span className="text-base w-5 text-center">{n.icon}</span>
                <span className="text-xs">{n.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
        <div className="pt-3 border-t border-white/10">
          <p className="text-[9px] text-red-400 font-bold px-3 mb-2 uppercase tracking-widest">⚡ Phase 1 — Anti-GVG</p>
          <div className="space-y-0.5">
            {NAV_PHASE1.map(n => (
              <NavLink key={n.to} to={n.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                   ${isActive ? "text-white font-semibold" : "text-white/55 hover:text-white/90 hover:bg-white/5"}`}
                style={({ isActive }) => isActive
                  ? { background: "linear-gradient(90deg, rgba(239,68,68,0.25), rgba(245,158,11,0.1))", borderLeft: "2px solid #ef4444" }
                  : {}}>
                <span className="text-base w-5 text-center">{n.icon}</span>
                <span className="text-xs">{n.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10 space-y-2">
        <div className="text-[10px] text-white/40">
          SIGNUM v1.0 · 2026<br />
          © Processingenierie · Dakar, SN
        </div>
        <div className="text-[10px] text-indigo-400 font-semibold">🇸🇳 Souveraineté 100% sénégalaise</div>
      </div>
    </aside>
  );
}
