import Layout from "../components/Layout";
import { ExclamationTriangleIcon, MapPinIcon, SignalIcon, ClockIcon } from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const ALERTS = [
  { id:"a1", type:"blind_spot",  severity:"high",   region:"Dakar–Plateau",        desc:"Zone blanche confirmée par 12 citoyens",             lat:14.6937, lng:-17.4441, createdAt: new Date(Date.now()-3600000*2).toISOString()  },
  { id:"a2", type:"qos_drop",    severity:"high",   region:"Thiès–Centre",         desc:"Débit descendant < 1 Mbps signalé sur 6h",          lat:14.7910, lng:-16.9359, createdAt: new Date(Date.now()-3600000*5).toISOString()  },
  { id:"a3", type:"blind_spot",  severity:"medium", region:"Saint-Louis–Nord",     desc:"Zone sans signal — 3 plaintes en attente",           lat:16.0179, lng:-16.4897, createdAt: new Date(Date.now()-3600000*18).toISOString() },
  { id:"a4", type:"qos_drop",    severity:"medium", region:"Ziguinchor–Est",       desc:"Latence > 200 ms persistante depuis 48h",            lat:12.5681, lng:-16.2719, createdAt: new Date(Date.now()-86400000*1).toISOString()  },
  { id:"a5", type:"outage",      severity:"low",    region:"Kaolack–Médina Baye",  desc:"Interruption réseau 3G signalée — 1 heure",          lat:14.1524, lng:-16.0726, createdAt: new Date(Date.now()-86400000*2).toISOString()  },
];

const TYPE_MAP: Record<string, { label: string; Icon: any; color: string; bg: string }> = {
  blind_spot: { label: "Zone blanche",    Icon: MapPinIcon,            color: "text-red-600",    bg: "bg-red-50"    },
  qos_drop:   { label: "Chute QoS",       Icon: SignalIcon,            color: "text-amber-600",  bg: "bg-amber-50"  },
  outage:     { label: "Coupure réseau",  Icon: ExclamationTriangleIcon,color:"text-orange-600", bg: "bg-orange-50" },
};

const SEV_MAP: Record<string, string> = {
  high:   "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low:    "bg-slate-100 text-slate-600",
};
const SEV_LABEL: Record<string, string> = { high: "Critique", medium: "Modérée", low: "Faible" };

export default function AlertsPage() {
  return (
    <Layout>
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Alertes</h1>
            <p className="text-slate-400 text-sm mt-0.5">Incidents réseau et zones blanches signalés dans votre périmètre</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {ALERTS.filter(a => a.severity === "high").length} alertes critiques
          </div>
        </div>

        <div className="space-y-3">
          {ALERTS.map(a => {
            const t = TYPE_MAP[a.type];
            return (
              <div key={a.id} className={`card p-5 border-l-4 ${a.severity === "high" ? "border-red-400" : a.severity === "medium" ? "border-amber-400" : "border-slate-200"}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${t.bg} flex items-center justify-center flex-shrink-0`}>
                    <t.Icon className={`h-5 w-5 ${t.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`badge ${SEV_MAP[a.severity]}`}>{SEV_LABEL[a.severity]}</span>
                      <span className={`badge ${t.bg} ${t.color}`}>{t.label}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">📍 {a.region}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{a.desc}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true, locale: fr })}
                      </span>
                      <span className="text-xs text-slate-300">
                        {a.lat.toFixed(4)}°N, {Math.abs(a.lng).toFixed(4)}°O
                      </span>
                    </div>
                  </div>
                  <button className="btn-secondary text-xs px-3 py-1.5 flex-shrink-0">
                    Marquer traité
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
