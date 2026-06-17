import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { useAuthStore } from "../store/auth";

export default function LoginPage() {
  const [phone, setPhone] = useState("+221");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/request-otp", { phone });
      setStep("otp");
      toast.success("Code OTP envoyé ! (dev: 123456)");
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? "Erreur d'envoi OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", { phone, otp });
      setAuth(data.data.token, data.data.user);
      toast.success("Connexion réussie");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? "Code OTP invalide");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-artp-800 to-artp-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur mb-4">
            <span className="text-white font-bold text-2xl">AR</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Mon Réseau SN</h1>
          <p className="text-artp-200 mt-1 text-sm">Portail Administration ARTP</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {step === "phone" ? (
            <form onSubmit={requestOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+221 77 000 00 00"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Format: +221XXXXXXXXX</p>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? "Envoi en cours…" : "Recevoir le code OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Code OTP reçu par SMS
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-center tracking-widest font-mono text-lg focus:outline-none focus:ring-2 focus:ring-artp-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-400 mt-1 text-center">
                  Code envoyé à {phone}
                </p>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? "Vérification…" : "Se connecter"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("phone"); setOtp(""); }}
                className="w-full text-center text-sm text-gray-500 hover:text-artp-600 transition-colors"
              >
                Changer de numéro
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-artp-300 text-xs mt-6">
          © 2026 ARTP Sénégal — Tous droits réservés
        </p>
      </div>
    </div>
  );
}
