import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const LINKS = [
  { path: "/",          label: "Accueil"    },
  { path: "/operateurs",label: "Opérateurs" },
  { path: "/carte",     label: "Carte"      },
  { path: "/rapports",  label: "Rapports"   },
  { path: "/faq",       label: "FAQ"        },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <div className="w-8 h-8 bg-gradient-to-br from-artp-700 to-artp-500 rounded-xl flex items-center justify-center">
            <ShieldCheckIcon className="h-4.5 w-4.5 text-white h-5 w-5"/>
          </div>
          <div>
            <p className="text-sm font-black text-artp-900 leading-none">ARTP Sénégal</p>
            <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Observatoire QoS</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {LINKS.map(l => (
            <Link key={l.path} to={l.path}
              className={pathname === l.path ? "nav-link-active" : "nav-link"}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Badge */}
        <div className="hidden md:flex items-center gap-2">
          <span className="badge bg-emerald-50 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
            Données Juin 2026
          </span>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-xl text-slate-500" onClick={() => setOpen(!open)}>
          {open ? <XMarkIcon className="h-5 w-5"/> : <Bars3Icon className="h-5 w-5"/>}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-1">
          {LINKS.map(l => (
            <Link key={l.path} to={l.path} onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === l.path ? "bg-artp-50 text-artp-700 font-bold" : "text-slate-600 hover:bg-slate-50"}`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
