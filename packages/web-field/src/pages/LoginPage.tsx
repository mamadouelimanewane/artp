import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { ShieldCheckIcon, FingerPrintIcon } from "@heroicons/react/24/solid";

export default function LoginPage() {
  const [badge, setBadge]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!badge || !password) { setError("Veuillez remplir tous les champs"); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 1200));
    // Demo: any badge + password accepted
    setAuth({
      id: "agent-001",
      name: "Oumar Diallo",
      badge: badge.toUpperCase(),
      region: "Dakar",
      email: "o.diallo@artp.sn",
      phone: "+221 77 123 45 67",
    }, "demo-token");
    navigate("/");
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-field-900 via-field-800 to-emerald-700 px-6 pt-14 pb-20 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"/>
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-emerald-400/10 rounded-full blur-xl"/>
        <div className="relative w-20 h-20 bg-white/10 backdrop-blur rounded-3xl flex items-center justify-center mb-5 shadow-xl border border-white/20">
          <ShieldCheckIcon className="h-11 w-11 text-emerald-300"/>
        </div>
        <h1 className="text-2xl font-black text-white mb-1">ARTP Terrain</h1>
        <p className="text-emerald-200 text-sm font-medium">Application agent mobile — Sénégal</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
          <span className="text-emerald-300 text-xs">Mode hors-ligne disponible</span>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 bg-slate-50 rounded-t-3xl -mt-6 px-5 pt-8 pb-8">
        <h2 className="text-xl font-black text-slate-800 mb-1">Connexion agent</h2>
        <p className="text-slate-400 text-sm mb-7">Entrez votre matricule et mot de passe ARTP</p>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Matricule / Badge</label>
            <input
              className="input font-mono tracking-wider uppercase"
              placeholder="ex: ARTP-2024-001"
              value={badge} onChange={e => setBadge(e.target.value)}
              autoCapitalize="characters"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Mot de passe</label>
            <input
              type="password" className="input"
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Connexion…
              </>
            ) : (
              <>
                <FingerPrintIcon className="h-5 w-5"/>
                Se connecter
              </>
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-field-50 rounded-2xl border border-field-100">
          <p className="text-xs font-bold text-field-800 mb-1">Mode démonstration</p>
          <p className="text-xs text-field-600">Entrez n'importe quel matricule et mot de passe pour tester l'application.</p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Problème de connexion ? Contactez le support ARTP<br/>
          <span className="text-field-600 font-semibold">support@artp.sn · +221 33 869 75 10</span>
        </p>
      </div>
    </div>
  );
}
