import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const statusLabel: Record<string, string> = {
  submitted: "Soumise",
  under_review: "En examen",
  forwarded_to_operator: "Transmise",
  pending_response: "En attente",
  resolved: "Resolue",
  closed: "Fermee",
  rejected: "Rejetee",
};

const statusColor: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700",
  under_review: "bg-yellow-100 text-yellow-700",
  forwarded_to_operator: "bg-purple-100 text-purple-700",
  pending_response: "bg-orange-100 text-orange-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600",
  rejected: "bg-red-100 text-red-700",
};

const priorityLabel: Record<string, string> = {
  low: "Faible",
  medium: "Moyenne",
  high: "Elevee",
  urgent: "Urgente",
};

const priorityColor: Record<string, string> = {
  low: "bg-gray-100 text-gray-500",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const REGIONS = [
  "dakar",
  "thies",
  "saint_louis",
  "ziguinchor",
  "tambacounda",
  "kaolack",
  "louga",
  "fatick",
  "kolda",
  "matam",
  "kaffrine",
  "kedougou",
  "sedhiou",
  "diourbel",
];

interface Complaint {
  id: string;
  reference: string;
  subject: string;
  operator: string;
  category: string;
  status: string;
  priority: string;
  region: string;
  createdAt: string;
  user?: { name?: string; phone?: string };
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [operator, setOperator] = useState("");
  const [priority, setPriority] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (operator) params.set("operator", operator);
    if (priority) params.set("priority", priority);
    if (region) params.set("region", region);
    api
      .get(`/complaints?${params}`)
      .then((r) => {
        setComplaints(r.data.data ?? []);
        setTotal(r.data.pagination?.total ?? 0);
      })
      .catch(() => toast.error("Erreur lors du chargement des plaintes"))
      .finally(() => setLoading(false));
  }, [page, search, status, operator, priority, region]);

  useEffect(() => {
    load();
  }, [load]);

  function resetFilters() {
    setSearch("");
    setStatus("");
    setOperator("");
    setPriority("");
    setRegion("");
    setPage(1);
  }

  function exportCsv() {
    if (complaints.length === 0) {
      toast.error("Aucune donnee a exporter");
      return;
    }
    const headers = [
      "Reference",
      "Citoyen",
      "Operateur",
      "Categorie",
      "Statut",
      "Priorite",
      "Region",
      "Date",
    ];
    const rows = complaints.map((c) => [
      c.reference,
      c.user?.name ?? c.user?.phone ?? "",
      c.operator,
      c.category?.replace(/_/g, " ") ?? "",
      statusLabel[c.status] ?? c.status,
      priorityLabel[c.priority] ?? c.priority,
      c.region ?? "",
      new Date(c.createdAt).toLocaleDateString("fr-FR"),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plaintes_artp_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${complaints.length} plainte(s) exportee(s)`);
  }

  const totalPages = Math.ceil(total / 20) || 1;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Plaintes</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {total.toLocaleString("fr-FR")} plainte{total > 1 ? "s" : ""} au total
          </p>
        </div>
        <button onClick={exportCsv} className="btn-secondary text-sm">
          <ArrowDownTrayIcon className="h-4 w-4" />
          Exporter CSV
        </button>
      </div>

      {/* Filtres */}
      <div className="card py-4">
        <div className="flex flex-wrap gap-3 items-center">
          <FunnelIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />

          {/* Recherche */}
          <div className="relative flex-1 min-w-48">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (setPage(1), load())}
              placeholder="Rechercher par reference, sujet..."
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
            />
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
          >
            <option value="">Tous les statuts</option>
            {Object.entries(statusLabel).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>

          <select
            value={operator}
            onChange={(e) => {
              setOperator(e.target.value);
              setPage(1);
            }}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
          >
            <option value="">Tous les operateurs</option>
            <option value="orange">Orange</option>
            <option value="free">Free</option>
            <option value="expresso">Expresso</option>
          </select>

          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              setPage(1);
            }}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
          >
            <option value="">Toutes les priorites</option>
            {Object.entries(priorityLabel).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>

          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setPage(1);
            }}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
          >
            <option value="">Toutes les regions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r.replace(/_/g, " ")}
              </option>
            ))}
          </select>

          {(search || status || operator || priority || region) && (
            <button
              onClick={resetFilters}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Effacer les filtres
            </button>
          )}
        </div>
      </div>

      {/* Tableau */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-artp-600" />
          </div>
        ) : complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <InboxIcon className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Aucune plainte trouvee</p>
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
                    "Reference",
                    "Citoyen",
                    "Operateur",
                    "Categorie",
                    "Statut",
                    "Priorite",
                    "Region",
                    "Date",
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
                {complaints.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-50 hover:bg-artp-50/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        to={`/complaints/${c.id}`}
                        className="font-mono text-xs text-artp-600 hover:text-artp-800 hover:underline font-medium"
                      >
                        {c.reference}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {c.user?.name ?? c.user?.phone ?? (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 capitalize font-medium text-gray-800">
                      {c.operator}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {c.category?.replace(/_/g, " ") ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge ${
                          statusColor[c.status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {statusLabel[c.status] ?? c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge ${
                          priorityColor[c.priority] ?? "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {priorityLabel[c.priority] ?? c.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs capitalize">
                      {c.region?.replace(/_/g, " ") ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {formatDistanceToNow(new Date(c.createdAt), {
                        locale: fr,
                        addSuffix: true,
                      })}
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
            {/* Pages numerotees */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i));
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`py-1 px-3 text-xs rounded-lg border transition-colors ${
                    pg === page
                      ? "bg-artp-600 text-white border-artp-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pg}
                </button>
              );
            })}
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
