import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

const REGIONS_DATA = [
  { region: "Dakar", total: 824, debit: 312, couverture: 189, facturation: 198, service: 125 },
  { region: "Thies", total: 234, debit: 89, couverture: 67, facturation: 44, service: 34 },
  { region: "Kaolack", total: 156, debit: 61, couverture: 48, facturation: 28, service: 19 },
  { region: "Saint-Louis", total: 134, debit: 52, couverture: 41, facturation: 24, service: 17 },
  { region: "Ziguinchor", total: 98, debit: 38, couverture: 32, facturation: 16, service: 12 },
  { region: "Tambacounda", total: 67, debit: 26, couverture: 24, facturation: 10, service: 7 },
  { region: "Louga", total: 54, debit: 21, couverture: 18, facturation: 9, service: 6 },
  { region: "Matam", total: 43, debit: 17, couverture: 15, facturation: 7, service: 4 },
];

const TYPE_DATA = [
  { name: "Debit insuffisant", value: 616, color: "#3b82f6" },
  { name: "Absence couverture", value: 434, color: "#ef4444" },
  { name: "Facturation", value: 336, color: "#f97316" },
  { name: "Service indispo.", value: 224, color: "#8b5cf6" },
  { name: "Spam/Fraude", value: 89, color: "#ec4899" },
];

export default function CartePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Carte des signalements</h1>
        <p className="text-slate-500 text-sm">Distribution geographique des alertes citoyennes — 30 derniers jours</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { v: "1 699", l: "Signalements ce mois", c: "text-alert-700" },
          { v: "1 284", l: "Traites (75.6%)", c: "text-emerald-700" },
          { v: "4.2j", l: "Delai moyen resolution", c: "text-blue-700" },
          { v: "96%", l: "Taux de satisfaction", c: "text-purple-700" },
        ].map(k => (
          <div key={k.l} className="card p-4 text-center">
            <p className={`text-2xl font-bold ${k.c}`}>{k.v}</p>
            <p className="text-xs text-slate-500 mt-1">{k.l}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Carte textuelle par region */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Signalements par region</h2>
          <div className="space-y-3">
            {REGIONS_DATA.map(r => {
              const pct = Math.round((r.total / REGIONS_DATA[0].total) * 100);
              return (
                <div key={r.region}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{r.region}</span>
                    <span className="text-slate-500 font-mono">{r.total}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-alert-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pie par type */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Repartition par type</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={TYPE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3}>
                {TYPE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [`${v} signalements`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-1 gap-1.5 mt-2">
            {TYPE_DATA.map(t => (
              <div key={t.name} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                <span className="text-slate-600 flex-1">{t.name}</span>
                <span className="font-semibold text-slate-700">{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar chart par region + type */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Detail par type et region (Top 5)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={REGIONS_DATA.slice(0,5)}>
            <XAxis dataKey="region" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="debit" name="Debit" fill="#3b82f6" stackId="a" />
            <Bar dataKey="couverture" name="Couverture" fill="#ef4444" stackId="a" />
            <Bar dataKey="facturation" name="Facturation" fill="#f97316" stackId="a" />
            <Bar dataKey="service" name="Service" fill="#8b5cf6" stackId="a" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
