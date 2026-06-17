import { useEffect, useState } from "react";
import { api } from "../services/api";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const roleLabel: Record<string, string> = {
  citizen: "Citoyen",
  agent_artp: "Agent ARTP",
  admin: "Administrateur",
  operator: "Opérateur",
};
const roleColor: Record<string, string> = {
  citizen: "bg-gray-100 text-gray-600",
  agent_artp: "bg-blue-100 text-blue-700",
  admin: "bg-artp-100 text-artp-700",
  operator: "bg-orange-100 text-orange-700",
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (role) params.set("role", role);
    api.get(`/users?${params}`).then((r) => {
      setUsers(r.data.data);
      setTotal(r.data.pagination?.total ?? 0);
    }).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [page, role]);

  async function changeRole(userId: string, newRole: string) {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      toast.success("Rôle mis à jour");
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? "Erreur");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Utilisateurs</h2>
          <p className="text-sm text-gray-500 mt-0.5">{total} utilisateurs inscrits</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="card py-3 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Rechercher par téléphone ou nom…"
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
          />
        </div>
        <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500">
          <option value="">Tous les rôles</option>
          {Object.entries(roleLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-artp-600" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Téléphone","Nom","Rôle","Région","Opérateur","Mesures","Plaintes","Inscrit","Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{u.phone}</td>
                  <td className="px-4 py-3">{u.name ?? <span className="text-gray-400">—</span>}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${roleColor[u.role] ?? "bg-gray-100 text-gray-600"}`}>
                      {roleLabel[u.role] ?? u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-500">{u.region}</td>
                  <td className="px-4 py-3 capitalize text-gray-500">{u.operator ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{u._count?.qosMeasures ?? 0}</td>
                  <td className="px-4 py-3 text-gray-600">{u._count?.complaints ?? 0}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {formatDistanceToNow(new Date(u.createdAt), { locale: fr, addSuffix: true })}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-artp-500"
                    >
                      {Object.entries(roleLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500">Page {page} sur {Math.ceil(total / 20) || 1}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary py-1 px-3 text-xs disabled:opacity-40">Précédent</button>
            <button onClick={() => setPage((p) => p + 1)} disabled={page * 20 >= total} className="btn-secondary py-1 px-3 text-xs disabled:opacity-40">Suivant</button>
          </div>
        </div>
      </div>
    </div>
  );
}
