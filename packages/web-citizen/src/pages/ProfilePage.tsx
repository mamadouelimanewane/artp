import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { api } from "../services/api";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import { toast } from "../lib/toast";
import {
  UserIcon, MapPinIcon, DevicePhoneMobileIcon,
  ArrowRightOnRectangleIcon, ChevronRightIcon,
  ShieldCheckIcon, BellIcon, InformationCircleIcon,
} from "@heroicons/react/24/outline";

const REGIONS: Record<string, string> = {
  dakar: "Dakar", thies: "Thiès", saint_louis: "Saint-Louis",
  ziguinchor: "Ziguinchor", tambacounda: "Tambacounda", kaolack: "Kaolack",
  louga: "Louga", fatick: "Fatick", kolda: "Kolda", matam: "Matam",
  kaffrine: "Kaffrine", kedougou: "Kédougou", sedhiou: "Sédhiou",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setAuth, logout } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [region, setRegion] = useState(user?.region ?? "dakar");
  const [saving, setSaving] = useState(false);

  const initials = (user?.name ?? user?.phone ?? "?")
    .split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  async function save() {
    setSaving(true);
    try {
      const res = await api.patch("/auth/profile", { name, region });
      const updated = res.data.data;
      const token = useAuthStore.getState().token!;
      setAuth(token, { ...user!, ...updated });
      setEditing(false);
      toast.success("Profil mis à jour");
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <TopBar title="Mon profil" />

      <div className="px-4 pt-4 max-w-lg mx-auto space-y-4">
        <div className="card flex flex-col items-center py-7">
          <div className="w-20 h-20 rounded-full bg-artp-600 flex items-center justify-center text-white text-2xl font-bold mb-3">
            {initials}
          </div>
          <p className="font-bold text-gray-900 text-lg">{user?.name ?? "Citoyen"}</p>
          <p className="text-gray-500 text-sm mt-0.5">{user?.phone}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              <MapPinIcon className="h-3.5 w-3.5" />
              {REGIONS[user?.region ?? ""] ?? user?.region}
            </span>
            {user?.operator && (
              <span className="flex items-center gap-1 text-xs text-white px-2.5 py-1 rounded-full capitalize bg-artp-500">
                <DevicePhoneMobileIcon className="h-3.5 w-3.5" />
                {user.operator}
              </span>
            )}
          </div>
        </div>

        {!editing ? (
          <button onClick={() => setEditing(true)} className="card w-full flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <UserIcon className="h-5 w-5 text-artp-600" />
              <span className="text-sm font-medium text-gray-700">Modifier mon profil</span>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
          </button>
        ) : (
          <div className="card space-y-4">
            <h3 className="font-semibold text-gray-900">Modifier le profil</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Votre prénom" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Région</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="input-field">
                {Object.entries(REGIONS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={save} disabled={saving} className="btn-primary flex-1">{saving ? "Enregistrement..." : "Enregistrer"}</button>
              <button onClick={() => setEditing(false)} className="btn-secondary flex-1">Annuler</button>
            </div>
          </div>
        )}

        <div className="card divide-y divide-gray-50">
          {[
            { Icon: BellIcon, label: "Notifications" },
            { Icon: ShieldCheckIcon, label: "Confidentialité" },
            { Icon: InformationCircleIcon, label: "À propos de l'ARTP" },
          ].map(({ Icon, label }) => (
            <button key={label} className="w-full flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{label}</span>
              </div>
              <ChevronRightIcon className="h-4 w-4 text-gray-300" />
            </button>
          ))}
        </div>

        <div className="bg-artp-50 border border-artp-100 rounded-2xl p-4 text-center">
          <p className="text-xs text-artp-700 font-semibold">ARTP Sénégal</p>
          <p className="text-xs text-artp-600">(+221) 33 849 08 08 • contact@artp.sn</p>
          <p className="text-xs text-artp-400 mt-0.5">Mon Réseau SN v1.0.0</p>
        </div>

        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="w-full flex items-center justify-center gap-2 py-3.5 text-red-600 font-semibold text-sm border border-red-200 rounded-2xl hover:bg-red-50 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Déconnexion
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
