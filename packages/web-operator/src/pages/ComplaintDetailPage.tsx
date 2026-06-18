import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Layout from "../components/Layout";
import { toast } from "../lib/toast";
import { ArrowLeftIcon, PaperAirplaneIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";

const DEMO_COMPLAINT = {
  id: "c1",
  reference: "ARTP-2026-00128",
  subject: "Internet coupé depuis 5 jours",
  description: "Depuis le 13 juin 2026, je n'ai plus accès à internet malgré mon forfait actif. J'ai contacté votre service client 3 fois sans résolution. Cela impacte mon travail quotidien.",
  category: "network_quality",
  status: "forwarded_to_operator",
  priority: "high",
  operator: "orange",
  region: "dakar",
  createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  updatedAt: new Date(Date.now() - 86400000).toISOString(),
  user: { name: "Mamadou Diallo", phone: "+221771234567", region: "Dakar" },
  events: [
    { id:"e1", type:"status_change", description:"Plainte soumise par le citoyen", createdAt: new Date(Date.now()-86400000*2).toISOString() },
    { id:"e2", type:"status_change", description:"Prise en charge par l'ARTP",     createdAt: new Date(Date.now()-86400000*1).toISOString() },
    { id:"e3", type:"status_change", description:"Transmise à l'opérateur Orange", createdAt: new Date(Date.now()-3600000*6).toISOString() },
  ],
};

const RESOLUTION_OPTIONS = [
  { value: "", label: "Sélectionnez une résolution..." },
  { value: "Problème technique résolu — rétablissement du service effectué.", label: "Service rétabli" },
  { value: "Remboursement accordé — avoir crédit appliqué sur le compte.", label: "Remboursement accordé" },
  { value: "Incident réseau confirmé — équipe technique dépêchée sur le site.", label: "Intervention terrain" },
  { value: "Aucun problème constaté de notre côté — veuillez vérifier votre équipement.", label: "Pas de problème côté opérateur" },
];

export default function ComplaintDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<any>(null);
  const [response, setResponse] = useState("");
  const [resolution, setResolution] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/complaints/${id}`).then(r => setComplaint(r.data.data)).catch(() => setComplaint(DEMO_COMPLAINT));
  }, [id]);

  async function submitResponse() {
    if (!response.trim()) return toast.error("Rédigez une réponse");
    setSubmitting(true);
    try {
      await api.post(`/complaints/${id}/respond`, { response, resolution: resolution || undefined });
      toast.success("Réponse envoyée à l'ARTP avec succès");
      setResponse("");
      setComplaint((c: any) => ({ ...c, status: "resolved", events: [...(c.events ?? []), {
        id: Date.now().toString(), type: "response", description: `Réponse opérateur : ${response}`,
        createdAt: new Date().toISOString(),
      }]}));
    } catch {
      toast.success("Réponse enregistrée (mode démo)");
      navigate("/complaints");
    } finally {
      setSubmitting(false);
    }
  }

  if (!complaint) return (
    <Layout><div className="p-8 space-y-4">{[...Array(4)].map((_,i) => <div key={i} className="card h-24 animate-pulse bg-slate-100" />)}</div></Layout>
  );

  const isPending = ["forwarded_to_operator","pending_response","under_review"].includes(complaint.status);

  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900">{complaint.subject}</h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{complaint.reference}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className={`badge ${complaint.priority === "high" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
              {complaint.priority === "high" ? "🔴 Urgente" : "🟡 Normale"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-4">
            {/* Détails plainte */}
            <div className="card p-5">
              <h2 className="text-sm font-bold text-slate-700 mb-3">Description du problème</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{complaint.description}</p>
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-50">
                {[
                  { label: "Catégorie", value: complaint.category?.replace(/_/g," ") },
                  { label: "Région",    value: complaint.region },
                  { label: "Opérateur",value: complaint.operator },
                  { label: "Soumise",  value: format(new Date(complaint.createdAt), "dd/MM/yyyy HH:mm") },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
                    <p className="text-sm text-slate-700 capitalize mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulaire de réponse */}
            {isPending ? (
              <div className="card p-5">
                <h2 className="text-sm font-bold text-slate-700 mb-4">Votre réponse à l'ARTP</h2>
                <div className="mb-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                    Type de résolution
                  </label>
                  <select value={resolution} onChange={e => { setResolution(e.target.value); if (e.target.value) setResponse(e.target.value); }}
                    className="input">
                    {RESOLUTION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                    Message détaillé
                  </label>
                  <textarea value={response} onChange={e => setResponse(e.target.value)}
                    placeholder="Décrivez les actions prises pour résoudre ce problème..."
                    rows={5} className="input resize-none" />
                  <p className="text-xs text-slate-400 mt-1 text-right">{response.length}/1000 caractères</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={submitResponse} disabled={submitting || !response.trim()} className="btn-primary flex-1">
                    <PaperAirplaneIcon className="h-4 w-4" />
                    {submitting ? "Envoi..." : "Envoyer la réponse"}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  Cette réponse sera transmise à l'ARTP et visible par le citoyen.
                </p>
              </div>
            ) : (
              <div className="card p-5 bg-green-50 border-green-100">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircleIcon className="h-5 w-5" />
                  <p className="font-bold text-sm">Plainte traitée</p>
                </div>
                <p className="text-xs text-green-600 mt-1">Cette plainte a été résolue et clôturée.</p>
              </div>
            )}
          </div>

          {/* Colonne latérale */}
          <div className="space-y-4">
            {/* Citoyen */}
            <div className="card p-4">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Citoyen</h2>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                  {complaint.user?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{complaint.user?.name ?? "Anonyme"}</p>
                  <p className="text-xs text-slate-400">{complaint.user?.phone}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">📍 {complaint.user?.region ?? complaint.region}</p>
            </div>

            {/* Délai de traitement */}
            <div className="card p-4">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Délai réglementaire</h2>
              <div className="space-y-2">
                {[
                  { label: "Accusé de réception", delay: "Immédiat", done: true },
                  { label: "Examen initial",       delay: "48 heures", done: true },
                  { label: "Transmission opérateur",delay: "5 jours", done: true },
                  { label: "Résolution finale",    delay: "15 jours ouvrables", done: complaint.status === "resolved" },
                ].map(s => (
                  <div key={s.label} className="flex items-start gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${s.done ? "bg-green-100" : "bg-slate-100"}`}>
                      {s.done
                        ? <CheckCircleIcon className="h-3.5 w-3.5 text-green-600" />
                        : <ClockIcon className="h-3.5 w-3.5 text-slate-400" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{s.label}</p>
                      <p className="text-[10px] text-slate-400">{s.delay}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historique */}
            <div className="card p-4">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Historique</h2>
              <div className="space-y-3">
                {(complaint.events ?? []).map((e: any) => (
                  <div key={e.id} className="flex gap-2.5">
                    <div className="w-1.5 self-stretch bg-slate-100 rounded-full flex-shrink-0 relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-op-500 -ml-px" />
                    </div>
                    <div className="pb-3 min-w-0">
                      <p className="text-xs font-medium text-slate-700">{e.description}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {formatDistanceToNow(new Date(e.createdAt), { addSuffix: true, locale: fr })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
