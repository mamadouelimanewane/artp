import { useState } from "react";
import { api } from "../services/api";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import { toast } from "../lib/toast";
import { SignalIcon, CheckCircleIcon, ExclamationTriangleIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { WifiIcon } from "@heroicons/react/24/outline";

type TestState = "idle" | "testing" | "done";

interface QosResult {
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number;
  jitter: number;
  packetLoss: number;
  signalStrength: number;
  networkType: string;
}

function ScoreMeter({ value, max, label, unit, threshold, reversed = false }: {
  value: number; max: number; label: string; unit: string; threshold: number; reversed?: boolean;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const good = reversed ? value <= threshold : value >= threshold;
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <div className="flex items-center gap-1.5">
          {good
            ? <CheckCircleIcon className="h-4 w-4 text-green-500" />
            : <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />
          }
          <span className={`text-base font-bold ${good ? "text-green-600" : "text-orange-600"}`}>
            {value.toFixed(1)} <span className="text-xs font-normal text-gray-400">{unit}</span>
          </span>
        </div>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${good ? "bg-green-400" : "bg-orange-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1.5">
        Seuil ARTP : {reversed ? "≤" : "≥"} {threshold} {unit}
      </p>
    </div>
  );
}

export default function QosTestPage() {
  const [state, setState] = useState<TestState>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<QosResult | null>(null);
  const [operator, setOperator] = useState("orange");
  const [networkType, setNetworkType] = useState("4G");

  async function runTest() {
    setState("testing");
    setProgress(0);
    setResult(null);

    const steps = [10, 25, 40, 60, 75, 90, 100];
    for (const p of steps) {
      await new Promise((r) => setTimeout(r, 400));
      setProgress(p);
    }

    const simResult: QosResult = {
      downloadSpeed: Math.random() * 30 + 3,
      uploadSpeed: Math.random() * 10 + 1,
      latency: Math.random() * 120 + 20,
      jitter: Math.random() * 20 + 2,
      packetLoss: Math.random() * 3,
      signalStrength: Math.random() * -40 - 60,
      networkType,
    };

    setResult(simResult);
    setState("done");

    try {
      await api.post("/qos", {
        operator,
        networkType: simResult.networkType,
        downloadSpeed: simResult.downloadSpeed,
        uploadSpeed: simResult.uploadSpeed,
        latency: simResult.latency,
        jitter: simResult.jitter,
        packetLoss: simResult.packetLoss,
        signalStrength: simResult.signalStrength,
        latitude: 14.7167 + (Math.random() - 0.5) * 0.5,
        longitude: -17.4677 + (Math.random() - 0.5) * 0.5,
        region: "dakar",
        isBlindSpot: simResult.downloadSpeed < 1,
      });
      toast.success("Mesure enregistrée et partagée avec l'ARTP !");
    } catch {
      toast.error("Mesure locale uniquement (API indisponible)");
    }
  }

  const overallGood = result
    ? result.downloadSpeed >= 5 && result.latency <= 100 && result.packetLoss <= 1
    : null;

  return (
    <div className="page">
      <TopBar title="Test réseau" subtitle="Mesure de qualité QoS" />

      <div className="px-4 pt-4 max-w-lg mx-auto space-y-4">
        {state === "idle" && (
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-900">Configurer le test</h2>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Opérateur</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "orange", label: "Orange" },
                  { value: "free", label: "Free" },
                  { value: "expresso", label: "Expresso" },
                ].map((op) => (
                  <button
                    key={op.value}
                    onClick={() => setOperator(op.value)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all border-2 ${
                      operator === op.value ? "border-artp-500 bg-artp-50 text-artp-700" : "border-gray-100 bg-white text-gray-500"
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Réseau</label>
              <div className="grid grid-cols-4 gap-2">
                {["2G", "3G", "4G", "5G"].map((n) => (
                  <button
                    key={n}
                    onClick={() => setNetworkType(n)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all border-2 ${
                      networkType === n ? "border-artp-500 bg-artp-50 text-artp-700" : "border-gray-100 bg-white text-gray-500"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="card flex flex-col items-center py-8">
          {state === "idle" && (
            <>
              <div className="w-28 h-28 rounded-full bg-artp-50 border-4 border-artp-100 flex items-center justify-center mb-5">
                <WifiIcon className="h-14 w-14 text-artp-400" />
              </div>
              <p className="text-gray-600 text-sm text-center mb-6 max-w-[220px]">
                Restez dans la zone à tester et appuyez sur le bouton
              </p>
              <button onClick={runTest} className="btn-primary max-w-[200px]">
                Lancer le test
              </button>
            </>
          )}

          {state === "testing" && (
            <>
              <div className="relative w-28 h-28 mb-5">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                  <circle cx="56" cy="56" r="48" fill="none" stroke="#e0e7ff" strokeWidth="8" />
                  <circle
                    cx="56" cy="56" r="48" fill="none" stroke="#2845cc" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 48}`}
                    strokeDashoffset={`${2 * Math.PI * 48 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.4s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-artp-700">{progress}%</span>
                  <SignalIcon className="h-5 w-5 text-artp-400 mt-1" />
                </div>
              </div>
              <p className="text-artp-600 font-medium text-sm animate-pulse">Test en cours...</p>
              <p className="text-gray-400 text-xs mt-1">Ne quittez pas la page</p>
            </>
          )}

          {state === "done" && result && (
            <>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                overallGood ? "bg-green-100" : "bg-orange-100"
              }`}>
                {overallGood
                  ? <CheckCircleIcon className="h-12 w-12 text-green-500" />
                  : <ExclamationTriangleIcon className="h-12 w-12 text-orange-500" />
                }
              </div>
              <p className={`text-lg font-bold ${overallGood ? "text-green-700" : "text-orange-700"}`}>
                {overallGood ? "Réseau conforme" : "Réseau non conforme"}
              </p>
              <p className="text-xs text-gray-400 mt-1 text-center max-w-[200px]">
                {overallGood
                  ? "Votre réseau respecte les seuils ARTP"
                  : "Votre réseau est en dessous des seuils minimum ARTP"}
              </p>

              <div className="flex gap-6 mt-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-artp-600">
                    <ArrowDownIcon className="h-4 w-4" />
                    <span className="text-xl font-bold">{result.downloadSpeed.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-400">Mbps ↓</p>
                </div>
                <div className="w-px bg-gray-100" />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <ArrowUpIcon className="h-4 w-4" />
                    <span className="text-xl font-bold">{result.uploadSpeed.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-400">Mbps ↑</p>
                </div>
                <div className="w-px bg-gray-100" />
                <div className="text-center">
                  <span className="text-xl font-bold text-orange-600">{result.latency.toFixed(0)}</span>
                  <p className="text-xs text-gray-400">ms ping</p>
                </div>
              </div>

              <button onClick={() => setState("idle")} className="mt-5 text-sm text-artp-600 font-medium py-2">
                Refaire un test
              </button>
            </>
          )}
        </div>

        {state === "done" && result && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Détail des mesures</h3>
            <ScoreMeter value={result.downloadSpeed} max={50} label="Débit descendant" unit="Mbps" threshold={5} />
            <ScoreMeter value={result.uploadSpeed} max={20} label="Débit montant" unit="Mbps" threshold={1} />
            <ScoreMeter value={result.latency} max={300} label="Latence (ping)" unit="ms" threshold={100} reversed />
            <ScoreMeter value={result.jitter} max={100} label="Gigue (jitter)" unit="ms" threshold={30} reversed />
            <ScoreMeter value={result.packetLoss} max={10} label="Perte de paquets" unit="%" threshold={1} reversed />
          </div>
        )}

        {state === "done" && result && result.downloadSpeed < 1 && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
            <p className="text-sm font-bold text-red-800">Zone blanche détectée !</p>
            <p className="text-xs text-red-600 mt-1">Votre position a été signalée automatiquement à l'ARTP.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
