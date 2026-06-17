import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  SignalIcon,
  PaperClipIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const statusLabel: Record<string, string> = {
  submitted: "Soumise",
  under_review: "En examen",
  forwarded_to_operator: "Transmise a l'operateur",
  pending_response: "En attente de reponse",
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

const statusDotColor: Record<string, string> = {
  submitted: "bg-blue-400",
  under_review: "bg-yellow-400",
  forwarded_to_operator: "bg-purple-400",
  pending_response: "bg-orange-400",
  resolved: "bg-green-400",
  closed: "bg-gray-400",
  rejected: "bg-red-400",
};

interface ComplaintEvent {
  id: string;
  status: string;
  message: string;
  resolution?: string;
  createdAt: string;
  agent?: { name?: string; phone?: string };
}

interface ComplaintData {
  id: string;
  reference: string;
  subject: string;
  description: string;
  operator: string;
  category: string;
  status: string;
  priority: string;
  region: string;
  createdAt: string;
  resolvedAt?: string;
  events?: ComplaintEvent[];
  attachments?: { id: string; url: string; filename: string }[];
  user?: { name?: string; phone?: string; region?: string };
}

function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      {Icon && <Icon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />}
      <div className="flex-1 flex justify-between gap-2 min-w-0">
        <span className="text-gray-500 flex-shrink-0">{label}</span>
        <span className="font-medium text-gray-900 capitalize text-right truncate">{value}</span>
      </div>
    </div>
  );
}

export default function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<ComplaintData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [newPriority, setNewPriority] = useState("");
  const [message, setMessage] = useState("");
  const [resolution, setResolution] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api
      .get(`/complaints/${id}`)
      .then((r) => setComplaint(r.data.data))
      .catch(() => toast.error("Impossible de charger la plainte"))
      .finally(() => setLoading(false));
  }, [id]);

  async function updateStatus(e: React.FormEvent) {
    e.preventDefault();
    if (!newStatus || !message) return;
    setUpdating(true);
    try {
      const { data } = await api.patch(`/complaints/${id}/status`, {
        status: newStatus,
        message,
        resolution: resolution || undefined,
        priority: newPriority || undefined,
      });
      setComplaint(data.data);
      setNewStatus("");
      setNewPriority("");
      setMessage("");
      setResolution("");
      toast.success("Statut mis a jour avec succes");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e.response?.data?.error ?? "Erreur de mise a jour");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-artp-600" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mb-3" />
        <p className="text-gray-700 font-medium">Plainte introuvable</p>
        <button
          onClick={() => navigate("/complaints")}
          className="mt-4 btn-secondary text-sm"
        >
          Retour aux plaintes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* En-tete */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 mt-0.5 flex-shrink-0"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-gray-900 font-mono">
              {complaint.reference}
            </h2>
            <span
              className={`badge ${
                statusColor[complaint.status] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              {statusLabel[complaint.status] ?? complaint.status}
            </span>
            <span
              className={`badge ${
                priorityColor[complaint.priority] ?? "bg-gray-100 text-gray-500"
              }`}
            >
              {priorityLabel[complaint.priority] ?? complaint.priority}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{complaint.subject}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-5">
          {/* Description */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">Description de la plainte</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {complaint.description}
            </p>
          </div>

          {/* Pieces jointes */}
          {complaint.attachments && complaint.attachments.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <PaperClipIcon className="h-4 w-4" />
                Pieces jointes ({complaint.attachments.length})
              </h3>
              <div className="space-y-2">
                {complaint.attachments.map((att) => (
                  <a
                    key={att.id}
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-artp-600 hover:underline"
                  >
                    <PaperClipIcon className="h-4 w-4" />
                    {att.filename}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-gray-400" />
              Historique des evenements
            </h3>
            {!complaint.events || complaint.events.length === 0 ? (
              <p className="text-sm text-gray-400">Aucun evenement enregistre</p>
            ) : (
              <ol className="relative border-l border-gray-200 space-y-6 ml-3">
                {complaint.events.map((ev) => (
                  <li key={ev.id} className="ml-5">
                    <div
                      className={`absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full border-2 border-white ${
                        statusDotColor[ev.status] ?? "bg-gray-400"
                      }`}
                    />
                    <div className="bg-gray-50 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`badge ${
                            statusColor[ev.status] ?? "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {statusLabel[ev.status] ?? ev.status}
                        </span>
                        {ev.agent && (
                          <span className="text-xs text-gray-400">
                            par {ev.agent.name ?? ev.agent.phone}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{ev.message}</p>
                      {ev.resolution && (
                        <p className="text-sm text-green-700 mt-1 bg-green-50 rounded p-2">
                          Resolution: {ev.resolution}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {format(new Date(ev.createdAt), "d MMMM yyyy 'a' HH:mm", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Mise a jour statut */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">
              Mettre a jour la plainte
            </h3>
            <form onSubmit={updateStatus} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Nouveau statut *
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
                    required
                  >
                    <option value="">Choisir un statut</option>
                    {Object.entries(statusLabel).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Nouvelle priorite (optionnel)
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500"
                  >
                    <option value="">Conserver la priorite actuelle</option>
                    {Object.entries(priorityLabel).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Message pour le citoyen *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Expliquez les actions entreprises..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500 resize-none"
                  required
                />
              </div>

              {["resolved", "closed"].includes(newStatus) && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Resolution detaillee
                  </label>
                  <textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Decrivez la resolution apportee..."
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500 resize-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={updating || !newStatus || !message}
                className="btn-primary"
              >
                <CheckCircleIcon className="h-4 w-4" />
                {updating ? "Mise a jour en cours..." : "Confirmer la mise a jour"}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Informations plainte */}
          <div className="card space-y-3">
            <h3 className="font-semibold text-gray-900">Informations</h3>
            <InfoRow
              label="Operateur"
              value={complaint.operator}
              icon={SignalIcon}
            />
            <InfoRow
              label="Categorie"
              value={complaint.category?.replace(/_/g, " ") ?? "—"}
            />
            <InfoRow label="Region" value={complaint.region ?? "—"} icon={MapPinIcon} />
            <InfoRow
              label="Priorite"
              value={priorityLabel[complaint.priority] ?? complaint.priority}
            />
            <div className="border-t border-gray-100 pt-3">
              <InfoRow
                label="Deposee le"
                value={format(new Date(complaint.createdAt), "d MMM yyyy", {
                  locale: fr,
                })}
                icon={ClockIcon}
              />
              {complaint.resolvedAt && (
                <InfoRow
                  label="Resolue le"
                  value={format(new Date(complaint.resolvedAt), "d MMM yyyy", {
                    locale: fr,
                  })}
                />
              )}
            </div>
          </div>

          {/* Citoyen */}
          {complaint.user && (
            <div className="card space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-gray-400" />
                Citoyen
              </h3>
              {complaint.user.phone && (
                <InfoRow
                  label="Telephone"
                  value={complaint.user.phone}
                  icon={PhoneIcon}
                />
              )}
              {complaint.user.name && (
                <InfoRow label="Nom" value={complaint.user.name} />
              )}
              {complaint.user.region && (
                <InfoRow
                  label="Region"
                  value={complaint.user.region}
                  icon={MapPinIcon}
                />
              )}
            </div>
          )}

          {/* Raccourcis statut rapide */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">
              Actions rapides
            </h3>
            <div className="space-y-2">
              {[
                {
                  s: "under_review",
                  label: "Passer en examen",
                  color: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
                },
                {
                  s: "forwarded_to_operator",
                  label: "Transmettre a l'operateur",
                  color: "bg-purple-50 text-purple-700 hover:bg-purple-100",
                },
                {
                  s: "resolved",
                  label: "Marquer comme resolue",
                  color: "bg-green-50 text-green-700 hover:bg-green-100",
                },
              ].map(({ s, label, color }) => (
                <button
                  key={s}
                  onClick={() => {
                    setNewStatus(s);
                    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                  }}
                  className={`w-full text-left text-xs font-medium px-3 py-2 rounded-lg transition-colors ${color}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
