import { useState } from "react";
import Layout from "../components/Layout";
import { REGIONS, type RegionData } from "../data/senegal";
import { MapPinIcon, SignalIcon, ClipboardDocumentListIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

type MapMode = "qos" | "blindspots" | "complaints" | "coverage";

const MODE_CONFIG: Record<MapMode, { label:string; desc:string; colorFn:(r:RegionData)=>string; legendItems:{color:string;label:string}[] }> = {
  qos: {
    label:"Score QoS",
    desc:"Score de qualité de service moyen /10",
    colorFn: r => r.qosScore>=8?"#22c55e":r.qosScore>=6.5?"#f59e0b":r.qosScore>=5?"#f97316":"#ef4444",
    legendItems:[{color:"#22c55e",label:"Excellent ≥8"},{color:"#f59e0b",label:"Bon 6.5–8"},{color:"#f97316",label:"Moyen 5–6.5"},{color:"#ef4444",label:"Critique <5"}],
  },
  blindspots: {
    label:"Zones blanches",
    desc:"Nombre de zones sans couverture signalées",
    colorFn: r => r.blindSpots<=5?"#22c55e":r.blindSpots<=15?"#f59e0b":r.blindSpots<=25?"#f97316":"#ef4444",
    legendItems:[{color:"#22c55e",label:"0–5 zones"},{color:"#f59e0b",label:"6–15 zones"},{color:"#f97316",label:"16–25 zones"},{color:"#ef4444",label:">25 zones"}],
  },
  complaints: {
    label:"Plaintes",
    desc:"Volume de plaintes reçues ce mois",
    colorFn: r => r.complaints<=50?"#6366f1":r.complaints<=100?"#8b5cf6":r.complaints<=200?"#a855f7":"#7c3aed",
    legendItems:[{color:"#6366f1",label:"0–50"},{color:"#8b5cf6",label:"51–100"},{color:"#a855f7",label:"101–200"},{color:"#7c3aed",label:">200"}],
  },
  coverage: {
    label:"Couverture 4G",
    desc:"Pourcentage du territoire couvert en 4G",
    colorFn: r => r.coverage>=90?"#22c55e":r.coverage>=75?"#f59e0b":r.coverage>=60?"#f97316":"#ef4444",
    legendItems:[{color:"#22c55e",label:"≥90%"},{color:"#f59e0b",label:"75–90%"},{color:"#f97316",label:"60–75%"},{color:"#ef4444",label:"<60%"}],
  },
};

const MODE_ICONS: Record<MapMode, React.ElementType> = {
  qos:SignalIcon, blindspots:MapPinIcon, complaints:ClipboardDocumentListIcon, coverage:CheckCircleIcon,
};

export default function MapPage() {
  const [mode, setMode] = useState<MapMode>("qos");
  const [selected, setSelected] = useState<RegionData|null>(null);
  const cfg = MODE_CONFIG[mode];

  return (
    <Layout title="Carte réseau nationale" subtitle="Qualité de service par région — Sénégal">
      <div className="flex gap-5 h-[calc(100vh-140px)]">
        {/* Panneau gauche */}
        <div className="w-64 flex flex-col gap-4 flex-shrink-0">
          {/* Mode selector */}
          <div className="card p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Indicateur affiché</p>
            <div className="space-y-1.5">
              {(Object.keys(MODE_CONFIG) as MapMode[]).map(m => {
                const Icon = MODE_ICONS[m];
                return (
                  <button key={m} onClick={() => setMode(m)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      mode===m ? "bg-artp-50 text-artp-700" : "text-slate-500 hover:bg-slate-50"
                    }`}>
                    <Icon className="h-4 w-4 flex-shrink-0"/>
                    {MODE_CONFIG[m].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Légende */}
          <div className="card p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Légende</p>
            <p className="text-xs text-slate-400 mb-3">{cfg.desc}</p>
            <div className="space-y-2">
              {cfg.legendItems.map(l => (
                <div key={l.label} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background:l.color }}/>
                  <span className="text-xs text-slate-600">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Région sélectionnée */}
          {selected && (
            <div className="card p-4 fade-up">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-slate-800">{selected.name}</p>
                <button onClick={() => setSelected(null)} className="text-slate-300 hover:text-slate-500 text-lg leading-none">×</button>
              </div>
              <div className="space-y-2">
                {[
                  { label:"Score QoS",      value:`${selected.qosScore}/10` },
                  { label:"Débit moyen",    value:`${selected.downloadAvg} Mbps` },
                  { label:"Latence",        value:`${selected.latencyAvg} ms` },
                  { label:"Disponibilité",  value:`${selected.availability}%` },
                  { label:"Zones blanches", value:selected.blindSpots },
                  { label:"Plaintes",       value:selected.complaints },
                  { label:"Résolues",       value:`${selected.resolved} (${Math.round(selected.resolved/selected.complaints*100)}%)` },
                  { label:"Couverture 4G",  value:`${selected.coverage}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-slate-400">{label}</span>
                    <span className="font-semibold text-slate-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Carte SVG Sénégal */}
        <div className="flex-1 card p-6 flex flex-col overflow-hidden">
          <div className="flex-1 relative">
            <svg viewBox="0 0 380 430" className="w-full h-full" style={{ maxHeight:"100%" }}>
              {/* Fond mer */}
              <rect width="380" height="430" fill="#e0f2fe" rx="12"/>

              {/* Silhouette simplifiée du Sénégal */}
              <path
                d="M60,80 L80,60 L120,55 L160,50 L200,52 L240,55 L280,70 L310,90 L320,120 L315,150 L300,180 L290,220 L295,260 L290,300 L280,330 L260,350 L240,360 L220,370 L200,380 L180,385 L160,390 L140,385 L120,375 L100,360 L80,340 L70,320 L65,300 L60,280 L55,250 L50,220 L52,190 L55,160 L58,130 L60,100 Z"
                fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5"
              />
              {/* Gambie (enclave) */}
              <path
                d="M115,340 L175,332 L195,335 L175,348 L115,355 Z"
                fill="#e0f2fe" stroke="#93c5fd" strokeWidth="1"
              />

              {/* Points régions */}
              {REGIONS.map(r => {
                const color = cfg.colorFn(r);
                const isSelected = selected?.id === r.id;
                return (
                  <g key={r.id} onClick={() => setSelected(r)} style={{ cursor:"pointer" }}>
                    {/* Halo si sélectionné */}
                    {isSelected && <circle cx={r.cx} cy={r.cy} r={24} fill={color} opacity={0.15}/>}
                    {/* Zone blanche indicator */}
                    {r.blindSpots > 20 && mode === "blindspots" && (
                      <circle cx={r.cx} cy={r.cy} r={18} fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" opacity={0.6}/>
                    )}
                    <circle cx={r.cx} cy={r.cy} r={isSelected?16:12} fill={color} opacity={0.85}
                      stroke={isSelected?"white":"transparent"} strokeWidth={isSelected?2.5:0}
                      className="transition-all duration-200"
                    />
                    {/* Score affiché dans le cercle */}
                    <text x={r.cx} y={r.cy} textAnchor="middle" dominantBaseline="central"
                      fontSize={isSelected?8:7} fontWeight="700" fill="white">
                      {mode==="qos" ? r.qosScore : mode==="coverage" ? `${r.coverage}` : mode==="blindspots" ? r.blindSpots : r.complaints}
                    </text>
                    {/* Nom région */}
                    <text x={r.cx} y={r.cy+(isSelected?22:18)} textAnchor="middle"
                      fontSize={isSelected?9:8} fill="#475569" fontWeight={isSelected?"700":"500"}>
                      {r.name}
                    </text>
                  </g>
                );
              })}

              {/* Légende océan */}
              <text x="20" y="420" fontSize="9" fill="#94a3b8">Atlantique</text>
              <text x="310" y="420" fontSize="9" fill="#94a3b8">Mali / Guinée</text>
            </svg>
          </div>

          {/* Barre résumé en bas */}
          <div className="border-t border-slate-100 pt-4 mt-3 grid grid-cols-4 gap-4">
            {[
              { label:"Meilleure région", value: [...REGIONS].sort((a,b) => b.qosScore-a.qosScore)[0].name, sub:"score QoS", color:"text-emerald-600" },
              { label:"À améliorer",      value: [...REGIONS].sort((a,b) => a.qosScore-b.qosScore)[0].name, sub:"score QoS", color:"text-red-500" },
              { label:"Plus de zones bl.", value: [...REGIONS].sort((a,b) => b.blindSpots-a.blindSpots)[0].name, sub:`${[...REGIONS].sort((a,b)=>b.blindSpots-a.blindSpots)[0].blindSpots} zones`, color:"text-orange-600" },
              { label:"Moyenne nationale",value:`${(REGIONS.reduce((s,r)=>s+r.qosScore,0)/REGIONS.length).toFixed(1)}/10`, sub:"score QoS", color:"text-artp-600" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-slate-400 font-semibold">{s.label}</p>
                <p className="text-[10px] text-slate-300">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
