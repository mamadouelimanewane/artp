import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";

const KPIS = [
  { label: "Capteurs actifs", value: "0", note: "En déploiement", color: "bg-slate-100 text-slate-600" },
  { label: "Bandes surveillées", value: "14", note: "700–3500 MHz", color: "bg-spec-100 text-spec-800" },
  { label: "Alertes spectre", value: "0", note: "Ce mois", color: "bg-emerald-100 text-emerald-700" },
  { label: "Licences attribuées", value: "247", note: "Actives", color: "bg-blue-100 text-blue-700" },
];

const BANDES = [
  { band: "700 MHz", usage: 88, type: "4G/LTE", operator: "Orange, Free" },
  { band: "800 MHz", usage: 62, type: "LTE", operator: "Orange" },
  { band: "900 MHz", usage: 95, type: "GSM/LTE", operator: "Orange, Free, Expresso" },
  { band: "1800 MHz", usage: 74, type: "GSM/4G", operator: "Orange, Free" },
  { band: "2100 MHz", usage: 81, type: "3G/4G", operator: "Orange, Free" },
  { band: "2600 MHz", usage: 45, type: "LTE", operator: "Orange" },
  { band: "3500 MHz", usage: 12, type: "5G (projet)", operator: "—" },
];

const TREND = [
  { m: "Jan", interference: 2, usage: 78 },
  { m: "Fév", interference: 1, usage: 80 },
  { m: "Mar", interference: 3, usage: 82 },
  { m: "Avr", interference: 0, usage: 81 },
  { m: "Mai", interference: 2, usage: 84 },
  { m: "Jun", interference: 0, usage: 86 },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Surveillance Spectre Radioélectrique</h1>
        <p className="text-slate-500 text-sm">SN-SSR · Capteurs SDR IoT · Détection interférences temps réel</p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
        <span className="text-2xl">🚧</span>
        <div>
          <p className="font-semibold text-amber-800 text-sm">Module en phase de déploiement</p>
          <p className="text-amber-700 text-xs">Les capteurs SDR IoT sont en cours d'installation sur 8 sites pilotes. Données simulées affichées.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map(k => (
          <div key={k.label} className="card p-4">
            <p className="text-xs text-slate-500 mb-1">{k.label}</p>
            <p className="text-2xl font-bold text-slate-900">{k.value}</p>
            <span className={`badge mt-1 ${k.color}`}>{k.note}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Taux d'utilisation par bande</h2>
          <div className="space-y-3">
            {BANDES.map(b => (
              <div key={b.band}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">{b.band} — {b.type}</span>
                  <span className={`font-bold ${b.usage > 85 ? "text-red-600" : b.usage > 70 ? "text-amber-600" : "text-emerald-600"}`}>{b.usage}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${b.usage > 85 ? "bg-red-500" : b.usage > 70 ? "bg-amber-400" : "bg-spec-500"}`}
                    style={{ width: `${b.usage}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{b.operator}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Tendance utilisation spectre (6 mois)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="m" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="usage" stroke="#059669" fill="#d1fae5" strokeWidth={2} name="Utilisation %" />
              <Line type="monotone" dataKey="interference" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Interférences" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
