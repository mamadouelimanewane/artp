import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMissionsStore, Measurement, MeasureType, GpsCoord } from "../store/missions";
import BottomNav from "../components/BottomNav";
import {
  BoltIcon, MapPinIcon, SignalIcon, ArrowLeftIcon,
  CheckCircleIcon, ExclamationTriangleIcon, ArrowPathIcon,
} from "@heroicons/react/24/outline";

const MEASURE_TYPES: { type: MeasureType; label: string; icon: typeof BoltIcon; unit: string; color: string }[] = [
  { type: "download",   label: "Débit descendant", icon: BoltIcon,    unit: "Mbps", color: "from-blue-500 to-indigo-600"    },
  { type: "upload",     label: "Débit montant",    icon: BoltIcon,    unit: "Mbps", color: "from-emerald-500 to-teal-600"   },
  { type: "latency",    label: "Latence",           icon: SignalIcon,  unit: "ms",   color: "from-amber-500 to-orange-600"   },
  { type: "coverage",   label: "Couverture",        icon: SignalIcon,  unit: "%",    color: "from-violet-500 to-purple-600"  },
  { type: "blind_spot", label: "Zone blanche",      icon: MapPinIcon,  unit: "",     color: "from-red-500 to-rose-600"       },
];
const OPERATORS = ["Orange", "Free", "Expresso", "Tous"];
const TECHS = ["4G", "3G", "2G", "5G", "No signal"] as const;

export default function MeasurePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const missionId = searchParams.get("mission") ?? "";
  const defaultType = (searchParams.get("type") ?? "download") as MeasureType;

  const { missions, addMeasurement } = useMissionsStore();
  const [step, setStep]           = useState<"form" | "gps" | "success">("form");
  const [measureType, setType]    = useState<MeasureType>(defaultType);
  const [operator, setOperator]   = useState("Orange");
  const [tech, setTech]           = useState<typeof TECHS[number]>("4G");
  const [value, setValue]         = useState("");
  const [signal, setSignal]       = useState("3");
  const [note, setNote]           = useState("");
  const [coords, setCoords]       = useState<GpsCoord | null>(null);
  const [gpsError, setGpsError]   = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [saved, setSaved]         = useState(false);

  const missionOpts = missions.filter(m => m.status !== "completed" && m.status !== "synced");
  const [selMission, setSelMission] = useState(missionId || (missionOpts[0]?.id ?? ""));

  const mt = MEASURE_TYPES.find(t => t.type === measureType)!;

  function acquireGps() {
    setGpsLoading(true); setGpsError("");
    if (!navigator.geolocation) {
      // Demo fallback
      setCoords({ lat: 14.6928, lng: -17.4467, accuracy: 10, timestamp: Date.now() });
      setGpsLoading(false); return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, timestamp: Date.now() });
        setGpsLoading(false);
      },
      () => {
        // Demo fallback on error
        setCoords({ lat: 14.6928 + (Math.random()-0.5)*0.02, lng: -17.4467 + (Math.random()-0.5)*0.02, accuracy: 15, timestamp: Date.now() });
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  useEffect(() => { if (step === "gps") acquireGps(); }, [step]);

  function handleSave() {
    if (!coords) return;
    const m: Measurement = {
      id: `m-${Date.now()}`,
      type: measureType,
      value: measureType === "blind_spot" ? 0 : parseFloat(value) || 0,
      unit: mt.unit,
      coords,
      operator,
      technology: tech,
      signalStrength: parseInt(signal),
      note,
      photos: [],
      timestamp: Date.now(),
      synced: false,
    };
    if (selMission) addMeasurement(selMission, m);
    setSaved(true);
    setStep("success");
  }

  if (step === "success") return (
    <div className="page bg-slate-50 flex flex-col items-center justify-center px-6">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5 animate-bounce">
        <CheckCircleIcon className="h-10 w-10 text-emerald-500"/>
      </div>
      <h2 className="text-xl font-black text-slate-800 mb-2">Mesure enregistrée</h2>
      <p className="text-slate-400 text-sm text-center mb-8">
        La mesure a été sauvegardée localement.<br/>Elle sera synchronisée dès que vous serez en ligne.
      </p>
      <div className="card w-full p-4 mb-4 text-sm space-y-2">
        <div className="flex justify-between"><span className="text-slate-400">Type</span><span className="font-semibold text-slate-700">{mt.label}</span></div>
        {measureType !== "blind_spot" && <div className="flex justify-between"><span className="text-slate-400">Valeur</span><span className="font-black text-blue-600">{value} {mt.unit}</span></div>}
        <div className="flex justify-between"><span className="text-slate-400">Opérateur</span><span className="font-semibold text-slate-700">{operator}</span></div>
        <div className="flex justify-between"><span className="text-slate-400">Technologie</span><span className="font-semibold text-slate-700">{tech}</span></div>
        {coords && <div className="flex justify-between"><span className="text-slate-400">GPS</span><span className="font-mono text-xs text-slate-600">{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</span></div>}
      </div>
      <div className="flex gap-3 w-full">
        <button onClick={() => { setStep("form"); setValue(""); setNote(""); setCoords(null); setSaved(false); }} className="btn-secondary flex-1">Nouvelle mesure</button>
        <button onClick={() => navigate(selMission ? `/missions/${selMission}` : "/")} className="btn-primary flex-1">Terminer</button>
      </div>
      <BottomNav/>
    </div>
  );

  return (
    <div className="page bg-slate-50">
      {/* Header */}
      <div className={`bg-gradient-to-br ${mt.color} px-5 pt-8 pb-14 relative overflow-hidden`}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-white/70 text-sm mb-4">
          <ArrowLeftIcon className="h-4 w-4"/> Retour
        </button>
        <h1 className="text-white text-xl font-black">Nouvelle mesure</h1>
        <p className="text-white/70 text-sm mt-0.5">GPS automatique · Sauvegarde offline</p>
      </div>

      <div className="px-4 -mt-6 space-y-4 pb-4">
        {step === "form" && (
          <>
            {/* Type de mesure */}
            <div className="card p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Type de mesure</p>
              <div className="grid grid-cols-2 gap-2">
                {MEASURE_TYPES.map(t => (
                  <button key={t.type} onClick={() => setType(t.type)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 transition-all text-left ${measureType === t.type ? `border-transparent bg-gradient-to-r ${t.color} text-white shadow-sm` : "border-slate-100 text-slate-600"}`}>
                    <t.icon className="h-4 w-4 flex-shrink-0"/>
                    <span className="text-xs font-semibold">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mission */}
            {missionOpts.length > 0 && (
              <div className="card p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Mission associée</p>
                <select className="input" value={selMission} onChange={e => setSelMission(e.target.value)}>
                  <option value="">— Sans mission —</option>
                  {missionOpts.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
              </div>
            )}

            {/* Valeur */}
            {measureType !== "blind_spot" && (
              <div className="card p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Valeur mesurée</p>
                <div className="flex items-center gap-3">
                  <input type="number" inputMode="decimal" className="input flex-1 text-lg font-bold"
                    placeholder="0.0" value={value} onChange={e => setValue(e.target.value)}/>
                  <span className="text-slate-400 font-semibold w-12 text-center">{mt.unit}</span>
                </div>
              </div>
            )}

            {measureType === "blind_spot" && (
              <div className="card p-4 border-l-4 border-red-500">
                <div className="flex items-start gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5"/>
                  <div>
                    <p className="text-sm font-bold text-red-700 mb-1">Signalement zone blanche</p>
                    <p className="text-xs text-red-500">Les coordonnées GPS seront enregistrées comme zone sans couverture</p>
                  </div>
                </div>
              </div>
            )}

            {/* Opérateur + Technologie */}
            <div className="card p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Opérateur & réseau</p>
              <div className="flex gap-2 mb-3 flex-wrap">
                {OPERATORS.map(op => (
                  <button key={op} onClick={() => setOperator(op)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${operator === op ? "border-field-500 bg-field-50 text-field-700" : "border-slate-100 text-slate-500"}`}>
                    {op}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {TECHS.map(t => (
                  <button key={t} onClick={() => setTech(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${tech === t ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-100 text-slate-500"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Signal */}
            <div className="card p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Force du signal (barres)</p>
              <div className="flex gap-2">
                {[0,1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setSignal(String(n))}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-black border-2 transition-all ${parseInt(signal) === n ? "border-blue-500 bg-blue-500 text-white" : "border-slate-100 text-slate-400"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="card p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Note (optionnel)</p>
              <textarea className="input resize-none" rows={3} placeholder="Observations, conditions particulières…"
                value={note} onChange={e => setNote(e.target.value)}/>
            </div>

            <button onClick={() => setStep("gps")} className="btn-primary w-full flex items-center justify-center gap-2">
              <MapPinIcon className="h-5 w-5"/>
              Acquérir la position GPS
            </button>
          </>
        )}

        {step === "gps" && (
          <div className="card p-8 flex flex-col items-center text-center slide-up">
            {gpsLoading ? (
              <>
                <div className="w-20 h-20 bg-field-100 rounded-full flex items-center justify-center mb-5 gps-pulse">
                  <MapPinIcon className="h-10 w-10 text-field-600"/>
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2">Acquisition GPS…</h3>
                <p className="text-slate-400 text-sm">Recherche du signal satellite</p>
              </>
            ) : coords ? (
              <>
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
                  <MapPinIcon className="h-10 w-10 text-emerald-500"/>
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2">Position acquise</h3>
                <div className="bg-slate-50 rounded-xl p-4 w-full mb-5 text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Latitude</span>
                    <span className="font-mono font-semibold text-slate-700">{coords.lat.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Longitude</span>
                    <span className="font-mono font-semibold text-slate-700">{coords.lng.toFixed(6)}</span>
                  </div>
                  {coords.accuracy && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Précision</span>
                      <span className={`font-semibold ${coords.accuracy < 20 ? "text-emerald-600" : "text-amber-600"}`}>±{Math.round(coords.accuracy)}m</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 w-full">
                  <button onClick={acquireGps} className="btn-secondary flex-1 flex items-center justify-center gap-1.5 text-sm py-2.5">
                    <ArrowPathIcon className="h-4 w-4"/> Réacquérir
                  </button>
                  <button onClick={handleSave} className="btn-primary flex-1">Enregistrer</button>
                </div>
              </>
            ) : (
              <>
                <ExclamationTriangleIcon className="h-10 w-10 text-amber-400 mb-3"/>
                <p className="text-slate-600 text-sm mb-4">{gpsError || "Impossible d'obtenir la position"}</p>
                <button onClick={acquireGps} className="btn-primary">Réessayer</button>
              </>
            )}
          </div>
        )}
      </div>

      <BottomNav/>
    </div>
  );
}
