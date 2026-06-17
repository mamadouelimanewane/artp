import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

const statusLabel: Record<string, string> = {
  submitted: "Soumise", under_review: "En examen", forwarded_to_operator: "Transmise",
  pending_response: "En attente", resolved: "Résolue", closed: "Fermée", rejected: "Rejetée",
};
const statusColor: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700", under_review: "bg-yellow-100 text-yellow-700",
  forwarded_to_operator: "bg-purple-100 text-purple-700", pending_response: "bg-orange-100 text-orange-700",
  resolved: "bg-green-100 text-green-700", closed: "bg-gray-100 text-gray-600", rejected: "bg-red-100 text-red-700",
};
const priorityColor: Record<string, string> = {
  low: "text-gray-400", medium: "text-yellow-500", high: "text-orange-500", urgent: "text-red-500",
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [operator, setOperator] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (status) params.set("status", status);
    if (operator) params.set("operator", operator);
    api.get(`/complaints?${params}`).then((r) => {
      setComplaints(r.data.data);
      setTotal(r.data.pagination?.total ?? 0);
    }).finally(() => setLoading(false));
  }, [page, status, operator]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Plaintes</h2>
          <p className="text-sm text-gray-500 mt-0.5">{total} plainte{total > 1 ? "s" : ""} au total</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="card py-4 flex flex-wrap gap-3 items-center">
        <FunnelIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(statusLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select
          value={operator}
          onChange={(e) => { setOperator(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
        >
          <option value="">Tous les opérateurs</option>
          <option value="orange">Orange</option>
          <option value="free">Free</option>
          <option value="expresso">Expresso</option>
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
                {["Référence","Citoyen","Opérateur","Catégorie","Statut","Priorité","Date"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/complaints/${c.id}`} className="font-mono text-xs text-artp-600 hover:underline">
                      {c.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{c.user?.name ?? c.user?.phone ?? "—"}</td>
                  <td className="px-4 py-3 capitalize font-medium">{c.operator}</td>
                  <td className="px-4 py-3 text-gray-500">{c.category?.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${statusColor[c.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {statusLabel[c.status] ?? c.status}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-medium capitalize ${priorityColor[c.priority] ?? ""}`}>
                    {c.priority}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {formatDistanceToNow(new Date(c.createdAt), { locale: fr, addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500">Page {page} sur {Math.ceil(total / 20)}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary py-1 px-3 text-xs disabled:opacity-40">
              Précédent
            </button>
            <button onClick={() => setPage((p) => p + 1)} disabled={page * 20 >= total} className="btn-secondary py-1 px-3 text-xs disabled:opacity-40">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
