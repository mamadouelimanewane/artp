import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../lib/toast";
import { api } from "../services/api";
import { useAuthStore } from "../store/auth";
import { PhoneIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

type Step = "phone" | "otp";

const REGIONS = [
  { value: "dakar",        label: "Dakar"        },
  { value: "thies",        label: "Thiès"        },
  { value: "saint_louis",  label: "Saint-Louis"  },
  { value: "ziguinchor",   label: "Ziguinchor"   },
  { value: "tambacounda",  label: "Tambacounda"  },
  { value: "kaolack",      label: "Kaolack"      },
  { value: "louga",        label: "Louga"        },
  { value: "fatick",       label: "Fatick"       },
  { value: "kolda",        label: "Kolda"        },
  { value: "matam",        label: "Matam"        },
  { value: "kaffrine",     label: "Kaffrine"     },
  { value: "kedougou",     label: "Kédougou"     },
  { value: "sedhiou",      label: "Sédhiou"      },
];

const OPERATORS = [
  { value: "orange",   label: "Orange",   color: "from-orange-400 to-orange-500", ring: "ring-orange-300" },
  { value: "free",     label: "Free",     color: "from-indigo-500 to-blue-600",   ring: "ring-indigo-300" },
  { value: "expresso", label: "Expresso", color: "from-red-500 to-rose-600",      ring: "ring-red-300"    },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("+221");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [region, setRegion] = useState("dakar");
  const [operator, setOperator] = useState("orange");
  const [loading, setLoading] = useState(false);

  async function requestOtp() {
    if (phone.length < 13) return toast.error("Numéro invalide. Format: +221XXXXXXXXX");
    setLoading(true);
    try {
      await api.post("/auth/request-otp", { phone });
      toast.success("Code SMS envoyé !");
      setStep("otp");
    } catch (e: any) {
      toast.error(e.response?.data?.error ?? "Erreur d'envoi du code");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (otp.length !== 6) return toast.error("Le code doit avoir 6 chiffres");
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { phone, otp, name: name || undefined, region, operator });
      setAuth(res.data.data.token, res.data.data.user);
      navigate("/");
    } catch (e: any) {
      toast.error(e.response?.data?.error ?? "Code incorrect ou expiré");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4ff]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a3aff] via-[#2845cc] to-[#6c3ff5] px-6 pt-16 pb-20 text-center">
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-36 rounded-full bg-blue-900/30 blur-3xl" />
        <div className="relative">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-4xl">📡</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Mon Réseau SN</h1>
          <p className="text-blue-200 text-sm mt-1.5 font-medium">Portail citoyen — ARTP Sénégal</p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="relative -mt-8 flex-1 px-5 max-w-sm mx-auto w-full">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-200/40 p-6">
          {step === "phone" ? (
            <div className="space-y-5 animate-slide-up">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-artp-50 rounded-2xl flex items-center justify-center">
                  <PhoneIcon className="h-5 w-5 text-artp-600" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900">Connexion</h2>
                  <p className="text-gray-400 text-xs">Entrez votre numéro sénégalais</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Numéro de téléphone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="+221 7X XXX XX XX" className="input-field text-lg tracking-widest font-bold" maxLength={13} />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Votre région</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)} className="input-field">
                  {REGIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Votre opérateur</label>
                <div className="grid grid-cols-3 gap-2">
                  {OPERATORS.map((op) => (
                    <button key={op.value} type="button" onClick={() => setOperator(op.value)}
                      className={`py-3 rounded-2xl text-sm font-bold transition-all duration-150 ${
                        operator === op.value
                          ? `bg-gradient-to-br ${op.color} text-white shadow-md ring-2 ${op.ring} ring-offset-1 scale-105`
                          : "bg-gray-50 border-2 border-gray-100 text-gray-500"
                      }`}>
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={requestOtp} disabled={loading} className="btn-primary">
                {loading
                  ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Envoi...</span>
                  : "Recevoir le code SMS →"}
              </button>
              <p className="text-center text-xs text-gray-300">En continuant, vous acceptez les CGU de l'ARTP</p>
            </div>
          ) : (
            <div className="space-y-5 animate-slide-up">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center">
                  <ShieldCheckIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900">Vérification</h2>
                  <p className="text-gray-400 text-xs">Code envoyé au <span className="font-bold text-gray-600">{phone}</span></p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Prénom (optionnel)</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Mamadou" className="input-field" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Code SMS à 6 chiffres</label>
                <input type="number" value={otp} onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  placeholder="• • • • • •"
                  className="input-field text-3xl text-center tracking-[0.7em] font-extrabold" />
                <div className="mt-2 flex items-center justify-center gap-1.5 bg-emerald-50 rounded-xl py-2">
                  <span className="text-emerald-500 text-xs font-bold">Mode démo :</span>
                  <span className="text-emerald-700 font-extrabold text-sm tracking-widest">123456</span>
                </div>
              </div>

              <button onClick={verifyOtp} disabled={loading} className="btn-primary">
                {loading
                  ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Vérification...</span>
                  : "Confirmer →"}
              </button>
              <button onClick={() => setStep("phone")} className="w-full text-sm text-artp-600 font-bold py-2 text-center">
                ← Changer de numéro
              </button>
            </div>
          )}
        </div>
        <p className="text-center text-xs text-gray-300 mt-5 pb-8">ARTP Sénégal • (+221) 33 849 08 08</p>
      </div>
    </div>
  );
}
