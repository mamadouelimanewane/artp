import { useState } from "react";
import Layout from "../components/Layout";
import { useAuthStore } from "../store/auth";
import { api } from "../services/api";
import { toast } from "../lib/toast";
import { DocumentArrowUpIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const QUARTERS = ["T1 2026 (Jan–Mar)", "T2 2026 (Avr–Jun)", "T3 2026 (Jul–Sep)", "T4 2026 (Oct–Déc)"];
const REGIONS = ["Dakar","Thiès","Saint-Louis","Ziguinchor","Tambacounda","Kaolack","Louga","Fatick","Kolda","Matam","Kaffrine","Kédougou","Sédhiou"];

export default function ReportPage() {
  const user = useAuthStore(s => s.user);
  const [quarter, setQuarter] = useState(QUARTERS[1]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    region: "Dakar",
    downloadAvg: "",
    uploadAvg: "",
    latencyAvg: "",
    availability: "",
    blindSpots: "",
    subscriberCount: "",
    newSubscribers: "",
    complaints: "",
    resolvedComplaints: "",
    notes: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const required = ["downloadAvg","uploadAvg","latencyAvg","availability"];
    if (required.some(k => !form[k as keyof typeof form])) return toast.error("Remplissez tous les indicateurs QoS");
    setLoading(true);
    try {
      await api.post("/reports/qos", { operator: user?.operator, quarter, ...form });
    } catch {}
    toast.success("Rapport soumis à l'ARTP avec succès !");
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) return (
    <Layout>
      <div className="p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mb-5">
          <CheckCircleIcon className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Rapport soumis !</h2>
        <p className="text-slate-400 mt-2 text-sm max-w-sm">
          Votre rapport QoS pour le <b>{quarter}</b> a été transmis à l'ARTP. Vous recevrez une confirmation par email.
        </p>
        <div className="mt-6 p-4 bg-slate-50 rounded-2xl text-left w-full max-w-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Récapitulatif</p>
          <div className="space-y-1 text-sm text-slate-600">
            <p>Opérateur : <b className="capitalize">{user?.operator}</b></p>
            <p>Période : <b>{quarter}</b></p>
            <p>Région : <b>{form.region}</b></p>
            <p>Débit moyen : <b>{form.downloadAvg} Mbps</b></p>
            <p>Disponibilité : <b>{form.availability}%</b></p>
          </div>
        </div>
        <button onClick={() => setSubmitted(false)} className="btn-secondary mt-6">
          Soumettre un autre rapport
        </button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="p-8 max-w-3xl mx-auto">
        <div className="mb-7">
          <h1 className="text-2xl font-black text-slate-900">Soumettre un rapport QoS</h1>
          <p className="text-slate-400 text-sm mt-0.5">Rapport réglementaire trimestriel obligatoire — Article 18 du cahier des charges</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {/* Période */}
          <div className="card p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-4">Période et périmètre</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Trimestre</label>
                <select value={quarter} onChange={e => setQuarter(e.target.value)} className="input">
                  {QUARTERS.map(q => <option key={q}>{q}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Région</label>
                <select value={form.region} onChange={set("region")} className="input">
                  {REGIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* KPIs QoS */}
          <div className="card p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-1">Indicateurs de qualité réseau</h2>
            <p className="text-xs text-slate-400 mb-4">Valeurs moyennes mesurées sur la période</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key:"downloadAvg",   label:"Débit descendant moyen",  unit:"Mbps", min:0, seuil:"≥ 5 Mbps" },
                { key:"uploadAvg",     label:"Débit montant moyen",     unit:"Mbps", min:0, seuil:"≥ 1 Mbps" },
                { key:"latencyAvg",    label:"Latence moyenne",          unit:"ms",   min:0, seuil:"≤ 100 ms"  },
                { key:"availability",  label:"Taux de disponibilité",    unit:"%",    min:0, seuil:"≥ 99%"     },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    {f.label} <span className="text-slate-300 normal-case font-normal">({f.unit})</span>
                  </label>
                  <input type="number" step="0.1" min={f.min} value={form[f.key as keyof typeof form]}
                    onChange={set(f.key as keyof typeof form)} className="input" placeholder="0.0" required />
                  <p className="text-[10px] text-slate-400 mt-1">Seuil ARTP : {f.seuil}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Abonnés & plaintes */}
          <div className="card p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-4">Données commerciales et qualité de service</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key:"subscriberCount",   label:"Nombre d'abonnés total",       placeholder:"Ex: 450000" },
                { key:"newSubscribers",    label:"Nouveaux abonnés ce trimestre", placeholder:"Ex: 12000"  },
                { key:"blindSpots",        label:"Zones blanches signalées",       placeholder:"Ex: 5"      },
                { key:"complaints",        label:"Plaintes reçues",               placeholder:"Ex: 47"     },
                { key:"resolvedComplaints",label:"Plaintes résolues",             placeholder:"Ex: 39"     },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                  <input type="number" min="0" value={form[f.key as keyof typeof form]}
                    onChange={set(f.key as keyof typeof form)} className="input" placeholder={f.placeholder} />
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="card p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-3">Observations et commentaires</h2>
            <textarea value={form.notes} onChange={set("notes")} rows={4}
              placeholder="Actions entreprises pour améliorer la qualité, incidents majeurs, travaux en cours..."
              className="input resize-none" />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
              <DocumentArrowUpIcon className="h-5 w-5" />
              {loading ? "Envoi en cours..." : "Soumettre le rapport à l'ARTP"}
            </button>
          </div>

          <p className="text-xs text-slate-400 text-center">
            En soumettant ce rapport, vous certifiez l'exactitude des données conformément à l'article 18 du cahier des charges ARTP.
          </p>
        </form>
      </div>
    </Layout>
  );
}
