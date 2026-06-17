import { useEffect, useState, useCallback } from "react";
import { api } from "../services/api";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  MagnifyingGlassIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const roleLabel: Record<string, string> = {
  citizen: "Citoyen",
  agent_artp: "Agent ARTP",
  admin: "Administrateur",
  operator: "Operateur",
};

const roleColor: Record<string, string> = {
  citizen: "bg-green-100 text-green-700",
  agent_artp: "bg-blue-100 text-blue-700",
  admin: "bg-red-100 text-red-700",
  operator: "bg-orange-100 text-orange-700",
};

interface User {
  id: string;
  phone: string;
  name?: string;
  role: string;
  region?: string;
  operator?: string;
  isVerified?: boolean;
  createdAt: string;
  _count?: { qosMeasures: number; complaints: number };
}

interface RoleModalProps {
  user: User;
  onClose: () => void;
  onConfirm: (userId: string, newRole: string) => Promise<void>;
}

function RoleModal({ user, onClose, onConfirm }: RoleModalProps) {
  const [selected, setSelected] = useState(user.role);
  const [saving, setSaving] = useState(false);

  async function handleConfirm() {
    if (selected === user.role) {
      onClose();
      return;
    }
    setSaving(true);
    await onConfirm(user.id, selected);
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Changer le role</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Modifier le role de{" "}
          <strong>{user.name ?? user.phone}</strong>
        </p>
        <div className="space-y-2 mb-6">
          {Object.entries(roleLabel).map(([k, v]) => (
            <label
              key={k}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                selected === k
                  ? "border-artp-500 bg-artp-50"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={k}
                checked={selected === k}
                onChange={() => setSelected(k)}
                className="text-artp-600 focus:ring-artp-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{v}</p>
              </div>
              <span className={`ml-auto badge ${roleColor[k]}`}>{v}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving}
            className="btn-primary flex-1 justify-center"
          >
            {saving ? "Enregistrement..." : "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalUser, setModalUser] = useState<User | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (role) params.set("role", role);
    api
      .get(`/users?${params}`)
      .then((r) => {
        setUsers(r.data.data ?? []);
        setTotal(r.data.pagination?.total ?? 0);
      })
      .catch(() => toast.error("Erreur lors du chargement"))
      .finally(() => setLoading(false));
  }, [page, search, role]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeRole(userId: string, newRole: string) {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      toast.success("Role mis a jour avec succes");
      load();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e.response?.data?.error ?? "Erreur lors de la mise a jour");
    }
  }

  const totalPages = Math.ceil(total / 20) || 1;

  return (
    <div className="space-y-5">
      {modalUser && (
        <RoleModal
          user={modalUser}
          onClose={() => setModalUser(null)}
          onConfirm={changeRole}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Utilisateurs</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {total.toLocaleString("fr-FR")} utilisateur{total > 1 ? "s" : ""} inscrit
            {total > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="card py-3 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (setPage(1), load())}
            placeholder="Rechercher par telephone ou nom..."
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
          />
        </div>
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
        >
          <option value="">Tous les roles</option>
          {Object.entries(roleLabel).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {/* Tableau */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-artp-600" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <UsersIcon className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Aucun utilisateur trouve</p>
            <p className="text-sm text-gray-400 mt-1">
              Essayez de modifier vos filtres
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[
                    "Telephone",
                    "Nom",
                    "Role",
                    "Region",
                    "Operateur",
                    "Verifie",
                    "Mesures",
                    "Plaintes",
                    "Inscription",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">
                      {u.phone}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {u.name ?? <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge ${
                          roleColor[u.role] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {roleLabel[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-500 text-xs">
                      {u.region?.replace(/_/g, " ") ?? "—"}
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-500">
                      {u.operator ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {u.isVerified ? (
                        <span className="text-green-600 text-xs font-medium">
                          Oui
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Non</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-center">
                      {u._count?.qosMeasures ?? 0}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-center">
                      {u._count?.complaints ?? 0}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {formatDistanceToNow(new Date(u.createdAt), {
                        locale: fr,
                        addSuffix: true,
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setModalUser(u)}
                        className="text-xs text-artp-600 hover:text-artp-800 font-medium px-2 py-1 rounded hover:bg-artp-50 transition-colors"
                      >
                        Changer role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500">
            Page {page} sur {totalPages} &mdash;{" "}
            {total.toLocaleString("fr-FR")} resultats
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary py-1 px-3 text-xs disabled:opacity-40"
            >
              Precedent
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="btn-secondary py-1 px-3 text-xs disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
