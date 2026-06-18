import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../lib/toast";
import { api } from "../services/api";
import TopBar from "../components/TopBar";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const CATEGORIES = [
  { value: "network_quality", label: "Qualité réseau", emoji: "📶", desc: "Mauvais débit, coupures, latence élevée" },
  { value: "billing", label: "Facturation", emoji: "💰", desc: "Surfacturation, frais non autorisés" },
  { value: "coverage", label: "Couverture", emoji: "🗺️", desc: "Zone sans réseau, signal absent" },
  { value: "customer_service", label: "Service client", emoji: "🎧", desc: "Réponse insatisfaisante de l'opérateur" },
  { value: "contract", label: "Contrat", emoji: "📄", desc: "Non-respect des conditions" },
  { value: "other", label: "Autre", emoji: "❓", desc: "Autre type de problème" },
];

const OPERATORS = [
  { value: "orange", label: "Orange", color: "bg-orange-500" },
  { value: "free", label: "Free", color: "bg-indigo-500" },
  { value: "expresso", label: "Expresso", color: "bg-red-500" },
];

type Step = "category" | "operator" | "details" | "success";

export default function NewComplaintPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("category");
  const [category, setCategory] = useState("");
  const [operator, setOperator] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState("");

  async function submit() {
    if (!subject.trim() || !description.trim()) return toast.error("Remplissez tous les champs");
    setLoading(true);
    try {
      const res = await api.post("/complaints", { category, operator, subject, description, priority });
      setReference(res.data.data?.reference ?? "ARTP-2026-XXXXX");
      setStep("success");
    } catch (e: any) {
      toast.error(e.response?.data?.error ?? "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5">
          <CheckCircleIcon className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Plainte enregistrée !</h2>
        <p className="text-gray-500 text-sm mt-2 max-w-xs">
          Votre dossier a été transmis à l'ARTP. Vous recevrez une notification à chaque étape.
        </p>
        <div className="mt-5 bg-artp-50 border border-artp-100 rounded-2xl px-6 py-4">
          <p className="text-xs text-artp-600 font-medium">Numéro de dossier</p>
          <p className="text-lg font-bold text-artp-800 mt-0.5">{reference}</p>
        </div>
        <div className="mt-6 w-full max-w-xs space-y-3">
          <button onClick={() => navigate("/complaints")} className="btn-primary">Voir mes plaintes</button>
          <button onClick={() => navigate("/")} className="btn-secondary">Retour à l'accueil</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <TopBar title="Nouvelle plainte" back />

      <div className="px-4 pt-4 max-w-lg mx-auto">
        <div className="flex gap-1.5 mb-6">
          {(["category", "operator", "details"] as Step[]).map((s, i) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${
              ["category", "operator", "details"].indexOf(step) >= i ? "bg-artp-600" : "bg-gray-200"
            }`} />
          ))}
        </div>

        {step === "category" && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Quel est le problème ?</h2>
            <p className="text-sm text-gray-500 mb-4">Choisissez la catégorie qui correspond le mieux</p>
            <div className="space-y-2.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => { setCategory(c.value); setStep("operator"); }}
                  className="w-full text-left card flex items-center gap-3.5 hover:shadow-md transition-all"
                >
                  <span className="text-2xl w-8 text-center">{c.emoji}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{c.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "operator" && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Quel opérateur ?</h2>
            <p className="text-sm text-gray-500 mb-5">Sélectionnez l'opérateur concerné</p>
            <div className="space-y-3">
              {OPERATORS.map((op) => (
                <button
                  key={op.value}
                  onClick={() => { setOperator(op.value); setStep("details"); }}
                  className="w-full card flex items-center gap-4 py-4 hover:shadow-md transition-all"
                >
                  <div className={`w-10 h-10 rounded-full ${op.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-sm">{op.label[0]}</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-base">{op.label} Sénégal</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep("category")} className="w-full text-sm text-artp-600 font-medium py-3 mt-2">
              ← Revenir
            </button>
          </div>
        )}

        {step === "details" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Décrivez le problème</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre de la plainte</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Internet coupé depuis 3 jours"
                className="input-field"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description détaillée</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Expliquez le problème en détail : depuis quand, ce que vous avez essayé, l'impact sur vous..."
                className="input-field resize-none"
                rows={5}
                maxLength={2000}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{description.length}/2000</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Priorité</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "low", label: "Faible" },
                  { value: "medium", label: "Normale" },
                  { value: "high", label: "Urgente" },
                ].map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPriority(p.value)}
                    className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                      priority === p.value ? "border-artp-500 bg-artp-50 text-artp-700" : "border-gray-100 bg-white text-gray-500"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={submit} disabled={loading} className="btn-primary mt-2">
              {loading ? "Envoi en cours..." : "Soumettre la plainte"}
            </button>
            <button onClick={() => setStep("operator")} className="w-full text-sm text-artp-600 font-medium py-2">
              ← Revenir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
