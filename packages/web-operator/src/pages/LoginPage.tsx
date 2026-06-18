import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuthStore } from "../store/auth";
import { toast } from "../lib/toast";
import { LockClosedIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

const OPERATORS = [
  { value: "orange",   label: "Orange Sénégal",   color: "border-orange-400 bg-orange-50",   active: "ring-orange-400",   dot: "bg-orange-500"  },
  { value: "free",     label: "Free Sénégal",     color: "border-indigo-400 bg-indigo-50",   active: "ring-indigo-400",   dot: "bg-indigo-500"  },
  { value: "expresso", label: "Expresso Sénégal", color: "border-red-400 bg-red-50",         active: "ring-red-400",      dot: "bg-red-500"     },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [operator, setOperator] = useState("orange");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return toast.error("Remplissez tous les champs");
    setLoading(true);
    try {
      const res = await api.post("/auth/operator/login", { email, password, operator });
      setAuth(res.data.data.token, res.data.data.user);
      navigate("/");
    } catch (err: any) {
      // Mode démo : accepte n'importe quel login
      const demoUser = { id: "op-1", name: email.split("@")[0], email, role: "operator", operator };
      setAuth("demo-operator-token", demoUser);
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  const selectedOp = OPERATORS.find(o => o.value === operator)!;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-[420px] bg-gradient-to-br from-op-700 via-op-600 to-emerald-500 flex-col justify-between p-10 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-black text-lg">A</span>
            </div>
            <div>
              <p className="text-white font-black text-base leading-none">ARTP Sénégal</p>
              <p className="text-green-200 text-xs">Autorité de Régulation</p>
            </div>
          </div>
          <h1 className="text-3xl font-black text-white leading-tight">Portail<br/>Opérateurs</h1>
          <p className="text-green-200 mt-3 text-sm leading-relaxed">
            Gérez les plaintes, soumettez vos rapports QoS et suivez vos indicateurs de performance réglementaires.
          </p>
        </div>
        <div className="space-y-3">
          {[
            "Réponse aux plaintes citoyennes",
            "Soumission des rapports QoS trimestriels",
            "Suivi des indicateurs réglementaires",
            "Alertes zones blanches en temps réel",
          ].map(t => (
            <div key={t} className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">✓</span>
              </div>
              <p className="text-green-100 text-sm">{t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900">Connexion</h2>
            <p className="text-slate-400 text-sm mt-1">Accès réservé aux opérateurs agréés ARTP</p>
          </div>

          {/* Sélection opérateur */}
          <div className="mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Votre opérateur</p>
            <div className="grid grid-cols-3 gap-2.5">
              {OPERATORS.map(op => (
                <button key={op.value} type="button" onClick={() => setOperator(op.value)}
                  className={`py-3 px-3 rounded-xl border-2 text-sm font-bold transition-all ${
                    operator === op.value
                      ? `${op.color} ring-2 ${op.active} ring-offset-1`
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${op.dot} inline-block mr-1.5`} />
                  {op.value.charAt(0).toUpperCase() + op.value.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="contact@orange.sn" className="input pl-10" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className="input pl-10" required />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                <input type="checkbox" className="rounded" />
                Se souvenir de moi
              </label>
              <button type="button" className="text-op-600 font-semibold hover:text-op-700">
                Mot de passe oublié ?
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading
                ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Connexion...</>
                : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-100 rounded-xl">
            <p className="text-xs font-bold text-slate-500 mb-1">Mode démo</p>
            <p className="text-xs text-slate-400">Utilisez n'importe quel email/mot de passe. Sélectionnez votre opérateur ci-dessus.</p>
          </div>

          <p className="text-center text-xs text-slate-300 mt-6">
            ARTP Sénégal • (+221) 33 849 08 08 • contact@artp.sn
          </p>
        </div>
      </div>
    </div>
  );
}
