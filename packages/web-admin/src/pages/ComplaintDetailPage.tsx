import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const statusLabel: Record<string, string> = {
  submitted: "Soumise", under_review: "En examen", forwarded_to_operator: "Transmise à l'opérateur",
  pending_response: "En attente de réponse", resolved: "Résolue", closed: "Fermée", rejected: "Rejetée",
};
const statusColor: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700", under_review: "bg-yellow-100 text-yellow-700",
  forwarded_to_operator: "bg-purple-100 text-purple-700", pending_response: "bg-orange-100 text-orange-700",
  resolved: "bg-green-100 text-green-700", closed: "bg-gray-100 text-gray-600", rejected: "bg-red-100 text-red-700",
};

export default function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [message, setMessage] = useState("");
  const [resolution, setResolution] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api.get(`/complaints/${id}`).then((r) => setComplaint(r.data.data)).finally(() => setLoading(false));
  }, [id]);

  async function updateStatus(e: React.FormEvent) {
    e.preventDefault();
    if (!newStatus || !message) return;
    setUpdating(true);
    try {
      const { data } = await api.patch(`/complaints/${id}/status`, { status: newStatus, message, resolution: resolution || undefined });
      setComplaint(data.data);
      setNewStatus(""); setMessage(""); setResolution("");
      toast.success("Statut mis à jour");
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? "Erreur de mise à jour");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-artp-600" />
    </div>
  );
  if (!complaint) return <p className="text-red-500">Plainte introuvable</p>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-mono">{complaint.reference}</h2>
          <p className="text-sm text-gray-500">{complaint.subject}</p>
        </div>
        <span className={`badge ml-auto ${statusColor[complaint.status] ?? "bg-gray-100 text-gray-600"}`}>
          {statusLabel[complaint.status] ?? complaint.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Infos plainte */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{complaint.description}</p>
          </div>

          {/* Timeline */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Historique</h3>
            <ol className="relative border-l border-gray-200 space-y-4 ml-3">
              {complaint.events?.map((ev: any) => (
                <li key={ev.id} className="ml-4">
                  <div className="absolute -left-1.5 mt-1 w-3 h-3 bg-artp-400 rounded-full border-2 border-white" />
                  <div>
                    <span className={`badge ${statusColor[ev.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {statusLabel[ev.status] ?? ev.status}
                    </span>
                    <p className="text-sm text-gray-700 mt-1">{ev.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {format(new Date(ev.createdAt), "d MMM yyyy à HH:mm", { locale: fr })}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Mise à jour statut */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Mettre à jour le statut</h3>
            <form onSubmit={updateStatus} className="space-y-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
                required
              >
                <option value="">Choisir un nouveau statut</option>
                {Object.entries(statusLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message pour le citoyen…"
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500 resize-none"
                required
              />
              {["resolved","closed"].includes(newStatus) && (
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Résolution détaillée…"
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500 resize-none"
                />
              )}
              <button type="submit" disabled={updating} className="btn-primary">
                <CheckCircleIcon className="h-4 w-4" />
                {updating ? "Mise à jour…" : "Confirmer"}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar infos */}
        <div className="space-y-4">
          <div className="card text-sm space-y-3">
            <h3 className="font-semibold text-gray-900">Informations</h3>
            <InfoRow label="Opérateur" value={complaint.operator} />
            <InfoRow label="Catégorie" value={complaint.category?.replace(/_/g, " ")} />
            <InfoRow label="Région" value={complaint.region} />
            <InfoRow label="Priorité" value={complaint.priority} />
            <InfoRow label="Déposée le" value={format(new Date(complaint.createdAt), "d MMM yyyy", { locale: fr })} />
            {complaint.resolvedAt && (
              <InfoRow label="Résolue le" value={format(new Date(complaint.resolvedAt), "d MMM yyyy", { locale: fr })} />
            )}
          </div>
          {complaint.user && (
            <div className="card text-sm space-y-2">
              <h3 className="font-semibold text-gray-900">Citoyen</h3>
              <InfoRow label="Téléphone" value={complaint.user.phone} />
              {complaint.user.name && <InfoRow label="Nom" value={complaint.user.name} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 capitalize">{value}</span>
    </div>
  );
}
