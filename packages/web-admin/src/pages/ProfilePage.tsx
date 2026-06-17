import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { useAuthStore } from "../store/auth";

interface ProfileData {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  role: string;
  region?: string;
  operator?: string;
  createdAt?: string;
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  admin: { label: "Administrateur", color: "bg-red-100 text-red-700" },
  agent_artp: { label: "Agent ARTP", color: "bg-artp-100 text-artp-700" },
  operator: { label: "Opérateur", color: "bg-orange-100 text-orange-700" },
  citizen: { label: "Citoyen", color: "bg-green-100 text-green-700" },
};

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className ?? ""}`} />;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout, user: storeUser } = useAuthStore();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    region: "",
    operator: "",
  });

  useEffect(() => {
    setLoading(true);
    api
      .get("/auth/me")
      .then((res) => {
        const data: ProfileData = res.data?.data ?? res.data;
        setProfile(data);
        setForm({
          name: data.name ?? "",
          email: data.email ?? "",
          region: data.region ?? "",
          operator: data.operator ?? "",
        });
      })
      .catch(() => {
        // Fallback au store
        if (storeUser) {
          const p: ProfileData = {
            id: storeUser.id,
            name: storeUser.name,
            phone: storeUser.phone,
            role: storeUser.role,
            region: storeUser.region,
            operator: storeUser.operator,
          };
          setProfile(p);
          setForm({
            name: p.name ?? "",
            email: "",
            region: p.region ?? "",
            operator: p.operator ?? "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, [storeUser]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch("/auth/profile", form);
      toast.success("Profil mis à jour avec succès");
      setProfile((prev) => (prev ? { ...prev, ...form } : prev));
    } catch {
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : profile?.phone?.slice(-2) ?? "?";

  const roleConf = ROLE_LABELS[profile?.role ?? ""] ?? {
    label: profile?.role ?? "",
    color: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Mon profil</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Informations de votre compte et préférences
        </p>
      </div>

      {/* Carte identité */}
      <div className="card flex items-center gap-5">
        {loading ? (
          <>
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-32" />
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-artp-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {profile?.name ?? profile?.phone ?? "Utilisateur"}
                </h3>
                <span className={`badge ${roleConf.color} text-xs`}>
                  {roleConf.label}
                </span>
              </div>
              {profile?.phone && (
                <p className="text-sm text-gray-500 mt-0.5">{profile.phone}</p>
              )}
              {profile?.email && (
                <p className="text-sm text-gray-500">{profile.email}</p>
              )}
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                {profile?.region && (
                  <span className="text-xs text-gray-400">
                    Région: <strong className="text-gray-600 capitalize">{profile.region.replace(/_/g, " ")}</strong>
                  </span>
                )}
                {profile?.operator && (
                  <span className="text-xs text-gray-400">
                    Opérateur: <strong className="text-gray-600 capitalize">{profile.operator}</strong>
                  </span>
                )}
                {profile?.createdAt && (
                  <span className="text-xs text-gray-400">
                    Inscrit le:{" "}
                    <strong className="text-gray-600">
                      {new Date(profile.createdAt).toLocaleDateString("fr-FR")}
                    </strong>
                  </span>
                )}
              </div>
            </div>
            <UserCircleIcon className="h-8 w-8 text-gray-300 flex-shrink-0" />
          </>
        )}
      </div>

      {/* Formulaire de mise a jour */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-5">Modifier le profil</h3>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="h-3 w-24 mb-1.5" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nom complet
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Adresse e-mail
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
                placeholder="exemple@artp.sn"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Région
              </label>
              <select
                value={form.region}
                onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
              >
                <option value="">Sélectionner une région</option>
                {[
                  "dakar", "thies", "saint_louis", "ziguinchor", "tambacounda",
                  "kaolack", "louga", "fatick", "kolda", "matam",
                  "kaffrine", "kedougou", "sedhiou",
                ].map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1).replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Opérateur
              </label>
              <select
                value={form.operator}
                onChange={(e) => setForm((f) => ({ ...f, operator: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
              >
                <option value="">Aucun / Non applicable</option>
                <option value="orange">Orange</option>
                <option value="free">Free (Saga Africa)</option>
                <option value="expresso">Expresso Télécom</option>
              </select>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full justify-center"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Enregistrement...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4" />
                    Enregistrer les modifications
                  </span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Deconnexion */}
      <div className="card border-red-100">
        <h3 className="font-semibold text-gray-900 mb-1">Déconnexion</h3>
        <p className="text-sm text-gray-500 mb-4">
          Vous serez redirigé vers la page de connexion.
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
