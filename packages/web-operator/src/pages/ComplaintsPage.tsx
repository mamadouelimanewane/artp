import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import Layout from "../components/Layout";
import { MagnifyingGlassIcon, PlusIcon, FunnelIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const STATUS_OPTIONS = [
  { value: "all",                    label: "Toutes"       },
  { value: "forwarded_to_operator",  label: "Transmises"   },
  { value: "pending_response",       label: "En attente"   },
  { value: "under_review",           label: "En examen"    },
  { value: "resolved",               label: "Résolues"     },
];

const STATUS_MAP: Record<string, { label: string; badge: string; dot: string }> = {
  submitted:             { label: "Soumise",    badge: "bg-blue-50 text-blue-700",    dot: "bg-blue-400"    },
  under_review:          { label: "En examen",  badge: "bg-amber-50 text-amber-700",  dot: "bg-amber-400"   },
  forwarded_to_operator: { label: "Transmise",  badge: "bg-violet-50 text-violet-700",dot: "bg-violet-400"  },
  pending_response:      { label: "En attente", badge: "bg-orange-50 text-orange-700",dot: "bg-orange-400"  },
  resolved:              { label: "Résolue",    badge: "bg-green-50 text-green-700",  dot: "bg-green-400"   },
  rejected:              { label: "Rejetée",    badge: "bg-red-50 text-red-700",      dot: "bg-red-400"     },
};

const PRIORITY_MAP: Record<string, string> = {
  high:   "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low:    "bg-slate-100 text-slate-600",
};
const PRIORITY_LABEL: Record<string, string> = { high: "Urgente", medium: "Normale", low: "Faible" };

const DEMO: any[] = [
  { id:"c1", reference:"ARTP-2026-00128", subject:"Internet coupé depuis 5 jours",     category:"network_quality", status:"forwarded_to_operator", priority:"high",   createdAt: new Date(Date.now()-86400000*1).toISOString() },
  { id:"c2", reference:"ARTP-2026-00125", subject:"Facturation erronée forfait 4G",     category:"billing",         status:"pending_response",      priority:"medium", createdAt: new Date(Date.now()-86400000*2).toISOString() },
  { id:"c3", reference:"ARTP-2026-00120", subject:"Zone sans signal à Thiès-Nord",      category:"coverage",        status:"forwarded_to_operator", priority:"high",   createdAt: new Date(Date.now()-86400000*3).toISOString() },
  { id:"c4", reference:"ARTP-2026-00115", subject:"Service client injoignable 72h",     category:"customer_service",status:"under_review",          priority:"medium", createdAt: new Date(Date.now()-86400000*5).toISOString() },
  { id:"c5", reference:"ARTP-2026-00108", subject:"Débit très faible 0.5 Mbps",         category:"network_quality", status:"resolved",              priority:"low",    createdAt: new Date(Date.now()-86400000*8).toISOString() },
  { id:"c6", reference:"ARTP-2026-00102", subject:"Coupure réseau pendant 2 heures",    category:"network_quality", status:"resolved",              priority:"medium", createdAt: new Date(Date.now()-86400000*10).toISOString() },
];

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/complaints?limit=100").then(r => {
      setComplaints(r.data.data?.complaints ?? r.data.data ?? []);
    }).catch(() => setComplaints(DEMO)).finally(() => setLoading(false));
  }, []);

  const filtered = complaints.filter(c => {
    const matchStatus = filter === "all" || c.status === filter;
    const matchSearch = !search || c.subject?.toLowerCase().includes(search.toLowerCase()) || c.reference?.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Plaintes</h1>
            <p className="text-slate-400 text-sm mt-0.5">{filtered.length} dossier{filtered.length > 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Filtres + recherche */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par référence ou sujet..."
              className="input pl-10 w-full" />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <div className="flex gap-1.5 flex-wrap">
              {STATUS_OPTIONS.map(s => (
                <button key={s.value} onClick={() => setFilter(s.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    filter === s.value ? "bg-op-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Priorité","Référence","Sujet","Catégorie","Statut","Date","Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-slate-50">
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-100 rounded animate-pulse w-24" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">Aucune plainte correspondante</td></tr>
                ) : filtered.map(c => {
                  const st = STATUS_MAP[c.status] ?? STATUS_MAP["submitted"];
                  return (
                    <tr key={c.id} className="table-row">
                      <td className="px-4 py-3">
                        <span className={`badge ${PRIORITY_MAP[c.priority] ?? PRIORITY_MAP.medium}`}>
                          {PRIORITY_LABEL[c.priority] ?? "Normale"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-500 whitespace-nowrap">{c.reference}</td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-sm font-semibold text-slate-800 truncate">{c.subject}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 capitalize whitespace-nowrap">
                        {c.category?.replace(/_/g, " ") ?? "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`badge ${st.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                        {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: fr })}
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/complaints/${c.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-op-600 hover:text-op-700">
                          Traiter <ChevronRightIcon className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
