import { useState } from "react";
import {
  DocumentChartBarIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import toast from "react-hot-toast";
import { generateArtpPdf } from "../utils/exportPdf";

// Donnees realistes simulees pour les decideurs
const RAPPORT_MOIS = "Novembre 2024";

const KPI_DATA = [
  {
    label: "Taux de resolution des plaintes",
    value: "78.4%",
    prev: "71.2%",
    trend: "up",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Plaintes traitees ce mois",
    value: "342",
    prev: "298",
    trend: "up",
    color: "text-artp-600",
    bg: "bg-artp-50",
  },
  {
    label: "Debit moyen national",
    value: "9.7 Mbps",
    prev: "8.9 Mbps",
    trend: "up",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Zones blanches actives",
    value: "47",
    prev: "53",
    trend: "down",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    label: "Nouvelles inscriptions",
    value: "1 248",
    prev: "1 071",
    trend: "up",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Operateurs conformes",
    value: "2/3",
    prev: "1/3",
    trend: "up",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

const OPERATEURS_TABLE = [
  {
    operateur: "Orange",
    download: "14.8",
    upload: "8.2",
    latence: "42",
    zones_blanches: 8,
    score_conformite: 94,
    statut: "conforme",
  },
  {
    operateur: "Free",
    download: "9.2",
    upload: "5.1",
    latence: "67",
    zones_blanches: 15,
    score_conformite: 78,
    statut: "conforme",
  },
  {
    operateur: "Expresso",
    download: "3.8",
    upload: "2.1",
    latence: "128",
    zones_blanches: 24,
    score_conformite: 31,
    statut: "non_conforme",
  },
];

const EVOLUTION_ABONNES = [
  { mois: "Jun", citoyens: 18200, mesures: 4200 },
  { mois: "Jul", citoyens: 21400, mesures: 5100 },
  { mois: "Aou", citoyens: 24800, mesures: 6300 },
  { mois: "Sep", citoyens: 28100, mesures: 7800 },
  { mois: "Oct", citoyens: 31400, mesures: 9200 },
  { mois: "Nov", citoyens: 35600, mesures: 11400 },
];

const PLAINTES_MENSUEL = [
  { mois: "Jun", soumises: 89, resolues: 62, taux: 70 },
  { mois: "Jul", soumises: 112, resolues: 81, taux: 72 },
  { mois: "Aou", soumises: 98, resolues: 74, taux: 76 },
  { mois: "Sep", soumises: 145, resolues: 108, taux: 74 },
  { mois: "Oct", soumises: 298, resolues: 212, taux: 71 },
  { mois: "Nov", soumises: 342, resolues: 268, taux: 78 },
];

const RECOMMANDATIONS = [
  {
    priorite: "haute",
    titre: "Mise en demeure Expresso",
    description:
      "Le debit moyen d'Expresso (3.8 Mbps) est en dessous du seuil reglementaire de 5 Mbps depuis 3 mois consecutifs. Une mise en demeure formelle est recommandee conformement a l'article 42 du code des telecoms.",
    action: "Initier la procedure de mise en demeure",
  },
  {
    priorite: "haute",
    titre: "Zones blanches persistantes — Tambacounda",
    description:
      "24 zones blanches sont documentees dans la region de Tambacounda. Des engagements d'investissement de la part des operateurs dans la region devraient etre exiges.",
    action: "Convoquer les operateurs en audience",
  },
  {
    priorite: "moyenne",
    titre: "Amelioration du taux de resolution",
    description:
      "Le taux de resolution a progresse de 71.2% a 78.4%. Pour atteindre l'objectif de 85%, il est recommande de renforcer les equipes d'instruction des plaintes.",
    action: "Recruter 2 agents instructeurs supplementaires",
  },
  {
    priorite: "basse",
    titre: "Extension de la plateforme de mesures",
    description:
      "Le nombre de mesures QoS a augmente de 24% ce mois. Promouvoir l'application mobile auprès des citoyens des regions eloignees permettrait d'ameliorer la couverture des donnees.",
    action: "Campagne de sensibilisation dans 5 regions",
  },
];

const prioriteConfig = {
  haute: { label: "Haute priorite", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
  moyenne: { label: "Priorite moyenne", color: "bg-orange-100 text-orange-700", dot: "bg-orange-400" },
  basse: { label: "Priorite basse", color: "bg-blue-100 text-blue-700", dot: "bg-blue-400" },
};

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);

  function generatePdf() {
    setGenerating(true);
    try {
      generateArtpPdf({
        period: RAPPORT_MOIS,
        kpis: KPI_DATA.map((k) => ({
          label: k.label,
          value: k.value,
          trend: `Préc.: ${k.prev}`,
        })),
        operators: OPERATEURS_TABLE.map((op) => ({
          name: op.operateur,
          download: parseFloat(op.download),
          upload: parseFloat(op.upload),
          latency: parseInt(op.latence),
          blindSpots: op.zones_blanches,
          score: op.score_conformite,
        })),
        recommendations: RECOMMANDATIONS.map((r) => ({
          priority: r.priorite,
          text: r.description,
        })),
      });
      toast.success(
        `Rapport ${RAPPORT_MOIS} généré avec succès — téléchargement en cours`,
        { duration: 4000 }
      );
    } catch {
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Rapports ARTP</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Rapport mensuel de performance — {RAPPORT_MOIS}
          </p>
        </div>
        <button
          onClick={generatePdf}
          disabled={generating}
          className="btn-primary"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          {generating ? "Generation en cours..." : "Generer rapport PDF"}
        </button>
      </div>

      {/* Bandeau rapport */}
      <div className="bg-gradient-to-r from-artp-700 to-artp-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 rounded-xl p-3">
            <DocumentChartBarIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">
              Rapport de Performance QoS &amp; Plaintes
            </h3>
            <p className="text-artp-200 text-sm mt-0.5">
              Autorite de Regulation des Telecommunications et des Postes du Senegal
            </p>
            <p className="text-artp-300 text-xs mt-1">
              Periode: {RAPPORT_MOIS} &bull; Genere automatiquement par la plateforme
              Mon Reseau SN
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-artp-200 text-xs">Statut</p>
            <p className="text-white font-bold">Finalise</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {KPI_DATA.map(({ label, value, prev, trend, color, bg }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`${bg} p-3 rounded-xl flex-shrink-0`}>
              {trend === "up" ? (
                <ArrowTrendingUpIcon className={`h-5 w-5 ${color}`} />
              ) : (
                <ArrowTrendingDownIcon className={`h-5 w-5 ${color}`} />
              )}
            </div>
            <div className="min-w-0">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Precedent: {prev}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolution abonnes */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-1">
            Evolution des inscriptions et mesures
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Citoyens inscrits et mesures QoS soumises par mois
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={EVOLUTION_ABONNES}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="citoyens"
                stroke="#3b5ef0"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Citoyens inscrits"
              />
              <Line
                type="monotone"
                dataKey="mesures"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Mesures QoS"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Plaintes */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-1">
            Traitement des plaintes
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Plaintes soumises vs resolues par mois
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={PLAINTES_MENSUEL}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                dataKey="soumises"
                name="Soumises"
                fill="#f97316"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="resolues"
                name="Resolues"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tableau de synthese operateurs */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              Synthese de conformite par operateur
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Seuils reglementaires: Download ≥ 5 Mbps | Latence ≤ 100 ms
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Operateur",
                  "Download moy.",
                  "Upload moy.",
                  "Latence",
                  "Zones blanches",
                  "Score conformite",
                  "Statut",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OPERATEURS_TABLE.map((op) => {
                const conforme = op.statut === "conforme";
                return (
                  <tr key={op.operateur} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="py-4 px-5">
                      <span className="font-bold text-gray-900">{op.operateur}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`font-semibold ${
                          parseFloat(op.download) >= 5
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {op.download} Mbps
                      </span>
                    </td>
                    <td className="py-4 px-5 text-gray-700">{op.upload} Mbps</td>
                    <td className="py-4 px-5">
                      <span
                        className={
                          parseInt(op.latence) <= 100
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {op.latence} ms
                      </span>
                    </td>
                    <td className="py-4 px-5 text-gray-700">{op.zones_blanches}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-20">
                          <div
                            className={`h-full rounded-full ${
                              op.score_conformite >= 70
                                ? "bg-green-500"
                                : op.score_conformite >= 40
                                ? "bg-orange-400"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${op.score_conformite}%` }}
                          />
                        </div>
                        <span className="font-semibold text-gray-900 text-xs">
                          {op.score_conformite}/100
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      {conforme ? (
                        <span className="flex items-center gap-1.5 text-green-700 text-xs font-medium">
                          <CheckCircleIcon className="h-4 w-4" />
                          Conforme
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-700 text-xs font-medium">
                          <ExclamationTriangleIcon className="h-4 w-4" />
                          Non conforme
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommandations */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <LightBulbIcon className="h-5 w-5 text-artp-500" />
          Recommandations automatiques
        </h3>
        <p className="text-xs text-gray-400 mb-5">
          Generees automatiquement a partir des donnees du mois de {RAPPORT_MOIS}
        </p>
        <div className="space-y-4">
          {RECOMMANDATIONS.map((rec, i) => {
            const conf = prioriteConfig[rec.priorite as keyof typeof prioriteConfig];
            return (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <span
                    className={`w-2.5 h-2.5 rounded-full inline-block ${conf.dot}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-gray-900 text-sm">{rec.titre}</p>
                    <span className={`badge ${conf.color}`}>{conf.label}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {rec.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-artp-600 font-medium bg-artp-50 px-2 py-1 rounded">
                      Action recommandee: {rec.action}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer rapport */}
      <div className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
        Rapport genere automatiquement par la plateforme Mon Reseau SN &bull; ARTP
        Senegal &bull; Autorite de Regulation des Telecommunications et des Postes
        &bull; {RAPPORT_MOIS}
      </div>
    </div>
  );
}
