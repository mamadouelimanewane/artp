import { useState } from "react";

const ATTRIBUTIONS = [
  { band: "700 MHz", range: "703–748 / 758–803 MHz", technology: "4G/LTE", holders: ["Orange SN", "Free SN"], expiry: "2030-12-31", status: "active" },
  { band: "900 MHz", range: "880–915 / 925–960 MHz", technology: "GSM/LTE", holders: ["Orange SN", "Free SN", "Expresso"], expiry: "2028-06-30", status: "active" },
  { band: "1800 MHz", range: "1710–1785 / 1805–1880 MHz", technology: "GSM/4G", holders: ["Orange SN", "Free SN"], expiry: "2029-03-31", status: "active" },
  { band: "2100 MHz", range: "1920–1980 / 2110–2170 MHz", technology: "3G/4G", holders: ["Orange SN", "Free SN"], expiry: "2027-09-30", status: "expiring" },
  { band: "2600 MHz", range: "2500–2570 / 2620–2690 MHz", technology: "LTE", holders: ["Orange SN"], expiry: "2031-12-31", status: "active" },
  { band: "3500 MHz", range: "3400–3800 MHz", technology: "5G (réservé)", holders: [], expiry: "—", status: "reserved" },
];

const STATUS_STYLES: Record<string, string> = {
  active:   "bg-emerald-100 text-emerald-700",
  expiring: "bg-amber-100 text-amber-700",
  reserved: "bg-blue-100 text-blue-700",
};

export default function AttributionPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attribution du Spectre</h1>
        <p className="text-slate-500 text-sm">Plan National de Fréquences · Licences d'utilisation</p>
      </div>

      <div className="space-y-2">
        {ATTRIBUTIONS.map(a => (
          <div
            key={a.band}
            className={`card p-4 cursor-pointer hover:shadow-md transition-all ${selected===a.band?"ring-2 ring-spec-400":""}`}
            onClick={() => setSelected(selected===a.band?null:a.band)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 text-center">
                  <p className="font-bold text-slate-900">{a.band}</p>
                  <p className="text-[10px] text-slate-400">{a.technology}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-mono">{a.range}</p>
                  <div className="flex gap-1 mt-1">
                    {a.holders.length > 0
                      ? a.holders.map(h => <span key={h} className="badge bg-slate-100 text-slate-600 text-[10px]">{h}</span>)
                      : <span className="text-xs text-slate-400 italic">Non attribué</span>
                    }
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`badge ${STATUS_STYLES[a.status]}`}>
                  {a.status === "active" ? "Actif" : a.status === "expiring" ? "Expire bientôt" : "Réservé"}
                </span>
                {a.expiry !== "—" && <p className="text-[10px] text-slate-400 mt-1">Expire : {a.expiry}</p>}
              </div>
            </div>
            {selected === a.band && a.status === "expiring" && (
              <div className="mt-3 pt-3 border-t border-amber-200 bg-amber-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-amber-800">⚠️ Renouvellement à planifier</p>
                <p className="text-xs text-amber-700 mt-1">Cette licence expire en {a.expiry}. Initier la procédure de renouvellement au moins 12 mois avant l'échéance.</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
