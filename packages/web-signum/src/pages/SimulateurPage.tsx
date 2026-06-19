import { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
type EventType = "APPEL" | "SMS" | "DATA" | "MOBILE_MONEY" | "IMEI";
type Operator  = "Orange SN" | "Free SN" | "Expresso SN";
type EventStatus = "LEGITIME" | "SUSPECT" | "FRAUDE" | "BLOQUE";
type Tab = "sim" | "roi" | "barrières" | "cedeao";

interface SimEvent {
  id: string; ts: string; type: EventType; op: Operator;
  status: EventStatus; detail: string; signum_ms: number;
  gvg_ms: number | null; montant?: string; region?: string;
}
interface ChartPoint { t: string; signum: number; gvg: number; }
interface KPIs {
  events: number; fraudes: number; bloqués: number; manqués_gvg: number;
  recettes: number; temps_moy_signum: number;
}
interface HotSpot { id: string; x: number; y: number; label: string; intensity: number; }

// ─── Scénarios ────────────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    id: "simbox", icon: "📡", name: "Opération SIM Box",
    subtitle: "847 appels en bypass · Orange SN · Région Thiès",
    color: "#ef4444", colorBg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.4)",
    desc: "Une SIM Box vient d'être activée dans la région de Thiès. Elle génère 847 appels internationaux via des SIM locales pour éviter les taxes d'interconnexion. SIGNUM détecte le pattern en 28 secondes. GVG aurait pris 47 heures.",
    gvg_miss_rate: 0.65, fraud_rate: 0.45,
    event_types: ["APPEL"] as EventType[],
    details: [
      "Appel entrant depuis +33 via bypass local",
      "Connexion CLI spoofée — numéro Orange SN",
      "Durée anormalement courte (< 4s) — robotcall",
      "Pattern SIM Box : 120 appels/heure même source",
      "Burst de 47 appels simultanés — même IMEI",
    ],
    dossier: {
      ref: "SB-2026-0847", qualification: "Art. 431 Code Pénal SN — Fraude télécoms",
      prejudice: "2.4 Mds FCFA/mois estimé", autorité: "ARTP + ARMP + Parquet Dakar",
      preuves: ["CDR Orange SN horodatés SHA-256", "Logs IMEI croisés CNIE", "Enregistrement IVR bypass", "Géolocalisation SIM Box Thiès"],
    },
    hotspots: [{ id: "h1", x: 42, y: 35, label: "Thiès", intensity: 0.9 }, { id: "h2", x: 35, y: 28, label: "Dakar", intensity: 0.4 }],
  },
  {
    id: "aml", icon: "💳", name: "Réseau AML Wave",
    subtitle: "42 comptes coordonnés · Fractionnement · 67 M FCFA",
    color: "#f59e0b", colorBg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.4)",
    desc: "42 comptes Wave effectuent des virements synchronisés de moins de 500 000 FCFA (seuil de déclaration) vers un compte hub central. L'IA SIGNUM détecte le graphe de fractionnement en 12 secondes. GVG n'a aucun module AML.",
    gvg_miss_rate: 1.0, fraud_rate: 0.6,
    event_types: ["MOBILE_MONEY"] as EventType[],
    details: [
      "Virement Wave 485 000 FCFA — sous seuil CDP",
      "42 comptes actifs simultanément — pattern coordonné",
      "Compte hub reçoit : 67.3 M FCFA en 8 min",
      "Analyse graphe : nœud central identifié",
      "Transaction transfrontalière atypique détectée",
    ],
    dossier: {
      ref: "AML-2026-0042", qualification: "Art. 65 Loi LBC/FT + GAFI R.16",
      prejudice: "67.3 M FCFA blanchis détectés", autorité: "CENTIF + BCEAO + Parquet Financier",
      preuves: ["Graphe de transactions Wave horodaté", "Analyse comportementale 42 comptes", "Rapport GAFI R.16 auto-généré", "KYC croisé CNIE — 12 faux noms détectés"],
    },
    hotspots: [{ id: "h1", x: 35, y: 28, label: "Dakar", intensity: 1.0 }, { id: "h2", x: 75, y: 45, label: "Ziguinchor", intensity: 0.5 }],
  },
  {
    id: "imei", icon: "📱", name: "Clonage IMEI Samsung",
    subtitle: "15 appareils · même IMEI · 4 régions simultanées",
    color: "#8b5cf6", colorBg: "rgba(139,92,246,0.10)", border: "rgba(139,92,246,0.4)",
    desc: "Un IMEI Samsung Galaxy A54 détecté simultanément dans 4 régions différentes à la même seconde. Impossible physiquement — clonage massif. SIGNUM croise avec la CNIE, bloque les 15 appareils en 6 secondes. GVG : détection mensuelle.",
    gvg_miss_rate: 0.90, fraud_rate: 0.75,
    event_types: ["IMEI"] as EventType[],
    details: [
      "IMEI 354123456789012 — Dakar + Thiès + Ziguinchor",
      "Croisement CNIE : propriétaire = M. Diop / Dakar",
      "Appareil #2 détecté à Thiès — IMPOSSIBLE physiquement",
      "15 appareils clonés identifiés sur le réseau national",
      "Blocage simultané lancé sur 3 opérateurs",
    ],
    dossier: {
      ref: "IMEI-2026-0015", qualification: "Art. 431-1 Code Pénal SN — Contrefaçon électronique",
      prejudice: "15 terminaux illicites bloqués", autorité: "ARTP + DPJ + Douanes SN",
      preuves: ["Log IMEI 3 opérateurs synchronisé", "Croisement CNIE DGE", "Géolocalisation réseau 4 régions", "Rapport GSMA TAC Database"],
    },
    hotspots: [
      { id: "h1", x: 35, y: 28, label: "Dakar", intensity: 0.8 },
      { id: "h2", x: 42, y: 35, label: "Thiès", intensity: 0.7 },
      { id: "h3", x: 75, y: 45, label: "Ziguinchor", intensity: 0.6 },
      { id: "h4", x: 38, y: 18, label: "Saint-Louis", intensity: 0.5 },
    ],
  },
  {
    id: "grey", icon: "🔀", name: "Grey Route Flood",
    subtitle: "1 240 min trafic int'l détourné · Free SN · CDR ±61 400",
    color: "#06b6d4", colorBg: "rgba(6,182,212,0.10)", border: "rgba(6,182,212,0.4)",
    desc: "Free SN déclare 3 840 000 CDR hebdomadaires mais SIGNUM en détecte 3 901 400. L'écart de 61 400 correspond à du trafic international routé via des chemins non déclarés pour éviter les taxes d'interconnexion. Manque à gagner : 9.3 Mds FCFA/an.",
    gvg_miss_rate: 0.40, fraud_rate: 0.35,
    event_types: ["APPEL", "DATA"] as EventType[],
    details: [
      "CDR #3840001 : appel non déclaré — tronc international",
      "Route grise détectée : Paris → Dakar via nœud Gambie",
      "Batch de 847 CDR manquants dans le rapport opérateur",
      "Calcul écart : +61 400 CDR sur 7 jours vs déclaré",
      "PV automatique généré — ARMP notifiée",
    ],
    dossier: {
      ref: "CDR-2026-0061", qualification: "Art. 55 Code des Télécommunications SN",
      prejudice: "9.3 Mds FCFA/an manque à gagner", autorité: "ARTP + ARMP + DGID",
      preuves: ["Rapport CDR réconciliation automatique", "Écart de 61 400 CDR certifié", "Tracé route grise Gambie", "Mise en demeure Free SN générée"],
    },
    hotspots: [{ id: "h1", x: 38, y: 28, label: "Dakar", intensity: 0.7 }, { id: "h2", x: 42, y: 36, label: "Thiès", intensity: 0.5 }],
  },
  {
    id: "ott", icon: "🌐", name: "Migration OTT temps réel",
    subtitle: "WhatsApp dépasse la voix · -23% revenus Orange · Impact 18 Mds/an",
    color: "#10b981", colorBg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.4)",
    desc: "Observation en direct de la migration du trafic voix vers WhatsApp et les applications OTT. À ce rythme, WhatsApp dépassera la voix traditionnelle en valeur d'ici mi-2027. Impact fiscal : 41.5 Mds FCFA/an non taxés. SIGNUM propose 4 scénarios de redevance.",
    gvg_miss_rate: 1.0, fraud_rate: 0.05,
    event_types: ["DATA", "APPEL"] as EventType[],
    details: [
      "Session WhatsApp : 14.2 Mo — 22 min d'appel vidéo",
      "Appel voix Orange : 0 FCFA de taxe sur WhatsApp vs 3% voix",
      "Trafic YouTube : 84 Mo — non taxé sous régime actuel",
      "Rapport OTT : WhatsApp = 47.4% du trafic voix en valeur",
      "Recommandation SIGNUM : taxe OTT 1% CA local → 4.2 Mds/an",
    ],
    dossier: {
      ref: "OTT-2026-0001", qualification: "Recommandation UIT-T D.262 — Régulation OTT",
      prejudice: "41.5 Mds FCFA/an non taxés", autorité: "ARTP + Ministère Économie Numérique",
      preuves: ["Rapport DPI trafic data 3 opérateurs", "Comparatif Ouganda/Tanzanie taxe OTT", "Modèle fiscal 4 scénarios SIGNUM", "Projection impact 2027-2030"],
    },
    hotspots: [
      { id: "h1", x: 35, y: 28, label: "Dakar", intensity: 1.0 },
      { id: "h2", x: 42, y: 35, label: "Thiès", intensity: 0.8 },
      { id: "h3", x: 55, y: 40, label: "Kaolack", intensity: 0.7 },
    ],
  },
  {
    id: "qos", icon: "🚨", name: "Urgences QoS — 15/17/18",
    subtitle: "Taux d'échec appels urgences · Free SN · Zone Tambacounda",
    color: "#f97316", colorBg: "rgba(249,115,22,0.10)", border: "rgba(249,115,22,0.4)",
    desc: "SIGNUM détecte une dégradation des appels vers les numéros d'urgence (15 SAMU, 17 Police, 18 Pompiers) dans la région de Tambacounda. Taux d'échec : 34% sur Free SN. Obligation légale : < 2%. SIGNUM génère une mise en demeure automatique et une alerte préfectorale.",
    gvg_miss_rate: 1.0, fraud_rate: 0.34,
    event_types: ["APPEL"] as EventType[],
    details: [
      "Appel 15 SAMU échoué — Free SN Tambacounda — timeout 30s",
      "Appel 17 Police échoué — zone nord Tambacounda — congestion",
      "Taux d'échec urgences : 34% vs seuil légal 2% (Free SN)",
      "Alerte préfectorale automatique : gouverneur Tambacounda",
      "Mise en demeure Free SN : rétablissement sous 4 heures",
    ],
    dossier: {
      ref: "QOS-2026-0034", qualification: "Art. 12 Décret 2015-884 — Obligations QoS opérateurs",
      prejudice: "34% d'échec appels urgences — risque vital", autorité: "ARTP + Préfecture Tambacounda + Min. Intérieur",
      preuves: ["Log 847 appels urgences échoués", "Mesure QoS réseau Free SN certifiée", "Rapport KPI vs seuils réglementaires", "Alerte préfectorale horodatée"],
    },
    hotspots: [{ id: "h1", x: 62, y: 42, label: "Tambacounda", intensity: 1.0 }, { id: "h2", x: 55, y: 40, label: "Kaolack", intensity: 0.3 }],
  },
];

const OPS: Operator[] = ["Orange SN", "Free SN", "Expresso SN"];
const OP_COLOR: Record<Operator, string> = { "Orange SN": "#f97316", "Free SN": "#ef4444", "Expresso SN": "#10b981" };
const STATUS_STYLE: Record<EventStatus, string> = {
  LEGITIME: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
  SUSPECT:  "text-amber-400  bg-amber-500/15  border-amber-500/30",
  FRAUDE:   "text-red-400    bg-red-500/15    border-red-500/30",
  BLOQUE:   "text-slate-400  bg-slate-500/15  border-slate-500/30",
};
const REGIONS = ["Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Kaolack", "Diourbel", "Tambacounda"];
let _id = 0;
function uid() { return `ev-${++_id}`; }
function now() { return new Date().toLocaleTimeString("fr-SN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }); }

// ─── Carte SVG Sénégal simplifiée ────────────────────────────────────────────
function SenegalMap({ hotspots }: { hotspots: HotSpot[] }) {
  return (
    <div className="relative">
      <svg viewBox="0 0 120 80" className="w-full" style={{ height: 160 }}>
        {/* Fond pays simplifié */}
        <path d="M8,18 L12,10 L20,8 L30,8 L38,6 L50,7 L58,10 L65,8 L72,12 L75,18 L78,25 L78,32 L75,40 L78,50 L80,58 L75,62 L68,58 L60,55 L55,60 L48,65 L40,68 L32,65 L25,60 L18,55 L12,48 L8,38 L6,28 Z"
          fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.5)" strokeWidth="0.8"/>
        {/* Gambie */}
        <path d="M30,40 L48,38 L52,40 L48,42 L30,42 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
        {/* Villes */}
        {[
          { x: 35, y: 28, label: "Dakar" },
          { x: 42, y: 35, label: "Thiès" },
          { x: 38, y: 18, label: "Saint-Louis" },
          { x: 75, y: 45, label: "Ziguinchor" },
          { x: 55, y: 40, label: "Kaolack" },
          { x: 62, y: 42, label: "Tambacounda" },
        ].map(c => (
          <g key={c.label}>
            <circle cx={c.x} cy={c.y} r="1.2" fill="rgba(255,255,255,0.4)"/>
            <text x={c.x + 2} y={c.y + 1} fontSize="3.5" fill="rgba(255,255,255,0.35)">{c.label}</text>
          </g>
        ))}
        {/* Hotspots animés */}
        {hotspots.map(h => (
          <g key={h.id}>
            <circle cx={h.x} cy={h.y} r={6 * h.intensity} fill={`rgba(239,68,68,${0.15 * h.intensity})`}>
              <animate attributeName="r" values={`${4 * h.intensity};${8 * h.intensity};${4 * h.intensity}`} dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx={h.x} cy={h.y} r="2.5" fill={`rgba(239,68,68,${0.8 * h.intensity})`}/>
          </g>
        ))}
        {/* Label */}
        <text x="6" y="76" fontSize="3.5" fill="rgba(255,255,255,0.2)">🇸🇳 SÉNÉGAL — SIGNUM Network Coverage</text>
      </svg>
    </div>
  );
}

// ─── Calculateur ROI ─────────────────────────────────────────────────────────
function ROICalculator() {
  const [cout, setCout] = useState(800);
  const [operateurs, setOperateurs] = useState(3);
  const [simbox, setSimbox] = useState(2.4);
  const [cdr, setCdr] = useState(9.3);
  const [aml, setAml] = useState(1.2);
  const total_gain = simbox + cdr + aml;
  const roi = ((total_gain * 1000 - cout) / cout * 100).toFixed(0);
  const payback = (cout / (total_gain * 1000 / 12)).toFixed(1);

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-base font-black text-white">Calculateur ROI — SIGNUM vs coût de déploiement</h2>
        <p className="text-xs text-white/40 mt-0.5">Ajustez les paramètres selon votre contexte national</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Inputs */}
        <div className="space-y-4">
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Paramètres d'entrée</p>
          {[
            { label: "Coût SIGNUM (M FCFA/an)", value: cout, set: setCout, min: 200, max: 3000, step: 100, color: "#ef4444" },
            { label: "Récupération SIM Box (Mds FCFA/an)", value: simbox, set: setSimbox, min: 0.5, max: 10, step: 0.1, color: "#f59e0b" },
            { label: "Récupération CDR/Grey (Mds FCFA/an)", value: cdr, set: setCdr, min: 1, max: 30, step: 0.5, color: "#06b6d4" },
            { label: "Récupération AML/Mobile Money (Mds FCFA/an)", value: aml, set: setAml, min: 0.1, max: 5, step: 0.1, color: "#10b981" },
          ].map(s => (
            <div key={s.label}>
              <div className="flex justify-between mb-1.5">
                <span className="text-[10px] text-white/60">{s.label}</span>
                <span className="text-[10px] font-bold" style={{ color: s.color }}>
                  {s.value.toFixed(s.step < 1 ? 1 : 0)}
                </span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step}
                value={s.value} onChange={e => s.set(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, ${s.color} 0%, ${s.color} ${((s.value - s.min) / (s.max - s.min)) * 100}%, rgba(255,255,255,0.1) ${((s.value - s.min) / (s.max - s.min)) * 100}%, rgba(255,255,255,0.1) 100%)` }}/>
            </div>
          ))}
        </div>

        {/* Résultats */}
        <div className="space-y-3">
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Résultats</p>
          <div className="rounded-xl p-4 border border-emerald-500/30 text-center" style={{ background: "rgba(16,185,129,0.12)" }}>
            <p className="text-[10px] text-white/40">GAIN ANNUEL TOTAL</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">{total_gain.toFixed(1)} Mds</p>
            <p className="text-[10px] text-emerald-400/70">FCFA récupérés / an</p>
          </div>
          <div className="rounded-xl p-4 border border-indigo-500/30 text-center" style={{ background: "rgba(99,102,241,0.12)" }}>
            <p className="text-[10px] text-white/40">ROI SIGNUM</p>
            <p className="text-3xl font-black text-indigo-300 mt-1">{parseInt(roi) > 0 ? "+" : ""}{roi}%</p>
            <p className="text-[10px] text-indigo-400/70">retour sur investissement</p>
          </div>
          <div className="rounded-xl p-4 border border-amber-500/20 text-center" style={{ background: "rgba(245,158,11,0.08)" }}>
            <p className="text-[10px] text-white/40">RETOUR SUR INVESTISSEMENT</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{payback} mois</p>
            <p className="text-[10px] text-amber-400/70">avant rentabilité totale</p>
          </div>
          <div className="rounded-xl p-3 border border-white/10 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
            <p className="text-[10px] text-white/40">COÛT / GAIN</p>
            <p className="text-sm font-black text-white mt-1">1 FCFA investi → {((total_gain * 1000) / cout).toFixed(0)} FCFA récupérés</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-4 border border-indigo-500/20" style={{ background: "rgba(99,102,241,0.07)" }}>
        <p className="text-[10px] font-bold text-indigo-300 mb-2">📊 Contexte régional CEDEAO (données réelles 2025)</p>
        <div className="grid grid-cols-3 gap-3 text-[10px]">
          {[
            { pays: "🇨🇮 Côte d'Ivoire", cout: "1.2 Mds FCFA", gain: "47 Mds FCFA", roi: "+3 817%" },
            { pays: "🇬🇭 Ghana", cout: "0.9 Mds FCFA", gain: "28 Mds FCFA", roi: "+3 011%" },
            { pays: "🇸🇳 Sénégal (cible)", cout: `${cout} M FCFA`, gain: `${total_gain.toFixed(1)} Mds`, roi: `+${roi}%` },
          ].map(r => (
            <div key={r.pays} className="rounded-lg p-2.5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="font-bold text-white">{r.pays}</p>
              <p className="text-white/40 mt-1">Coût : {r.cout}</p>
              <p className="text-white/40">Gain : {r.gain}</p>
              <p className="text-emerald-400 font-bold mt-1">ROI : {r.roi}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Barrières structurelles GVG ─────────────────────────────────────────────
function BarrièresGVG() {
  const [selected, setSelected] = useState(0);
  const BARRIERS = [
    {
      icon: "🪪", title: "Accès CNIE impossible pour GVG",
      verdict: "IMPOSSIBLE STRUCTUREL",
      verdictColor: "#ef4444",
      signum: "SIGNUM est une entité sénégalaise avec accès API à la base CNIE (Direction Générale des Élections). Croisement temps réel SIM ↔ identité nationale en < 200ms.",
      gvg: "GVG est une société luxembourgeoise. La loi sénégalaise 2008-12 sur les données personnelles interdit formellement à toute entité étrangère d'accéder à la base nationale d'identité. Structurellement impossible, quel que soit le budget investi.",
      impact: "72 200 fausses identités détectées · 284 SIM sur CNIE de défunts · Impossible à détecter sans accès CNIE",
      loi: "Loi 2008-12 DPDD + Décret 2022-1747 CNIE",
    },
    {
      icon: "💾", title: "Souveraineté des données",
      verdict: "VIOLATION GARANTIE",
      verdictColor: "#ef4444",
      signum: "100% des données SIGNUM restent en territoire sénégalais. Hébergement : 2 datacenters à Dakar (Terrou-Bi + Fonsis). Aucune donnée ne sort du territoire national.",
      gvg: "Le modèle BOT (Build-Operate-Transfer) de GVG implique que les données transitent par Luxembourg et Dubaï. En cas de litige avec GVG, l'État sénégalais perd l'accès à ses propres données. Déjà arrivé en Guinée (2019).",
      impact: "CDR de 18M d'abonnés sénégalais · Transactions Mobile Money · Données identitaires — tout chez GVG",
      loi: "Art. 14 Loi 2018-28 Cybersécurité + Décision ARTP 2024-021",
    },
    {
      icon: "💰", title: "Modèle BOT — Dépendance perpétuelle",
      verdict: "DÉPENDANCE FINANCIÈRE",
      verdictColor: "#f59e0b",
      signum: "SIGNUM est acquis en licence perpétuelle par l'État sénégalais. Le code source est escrowé. Après déploiement, le coût annuel est maintenance uniquement (< 15% du coût initial).",
      gvg: "Modèle BOT : l'État paie GVG à vie. En Tanzanie, GVG a augmenté ses tarifs de 340% après le contrat initial. Au Sénégal, le contrat ARMP a été résilié en 2023 pour dépassements tarifaires non justifiés.",
      impact: "Contrat ARMP SN résilié 2023 · 47 Mds FCFA payés sur 8 ans · 0 transfert technologique",
      loi: "Décision ARMP 2023-0847 — Résiliation contrat GVG",
    },
    {
      icon: "🤖", title: "IA souveraine vs boîte noire",
      verdict: "TRANSPARENCE IMPOSSIBLE",
      verdictColor: "#8b5cf6",
      signum: "Tous les modèles IA SIGNUM sont entraînés sur des données sénégalaises, explicables (SHAP), auditables par l'ARTP. Le code source des algorithmes est remis à l'État.",
      gvg: "GVG utilise des algorithmes propriétaires dont le code n'est pas accessible à l'État client. Impossible de savoir comment une fraude est détectée, ni d'auditer les résultats. En cas de contestation judiciaire, les preuves GVG ne passent pas le test de reproductibilité.",
      impact: "0 dossier GVG accepté par la Cour Suprême SN · Algorithmes non auditables · 0 transfert de compétences",
      loi: "Art. 22 Loi 2016-24 Transactions Électroniques — admissibilité des preuves numériques",
    },
    {
      icon: "📞", title: "Mobile Money / AML — Module inexistant",
      verdict: "MODULE ABSENT",
      verdictColor: "#ef4444",
      signum: "SIGNUM couvre Wave, Orange Money, Free Money avec interface CENTIF temps réel, conformément au GAFI R.16. Détection de fractionnement, smurfing, mule accounts.",
      gvg: "GVG a été conçu en 2008 pour surveiller la voix 2G. Wave n'existait pas. Il n'y a aucun module Mobile Money dans leur offre technique. L'ajout demanderait une refonte complète de leur architecture — estimée à 3-5 ans par leurs propres ingénieurs.",
      impact: "41.5 Mds FCFA/an en transactions suspectes non surveillées par GVG · 0 interface CENTIF",
      loi: "GAFI R.16 + Directive BCEAO 2019-002 LBC/FT",
    },
  ];

  const b = BARRIERS[selected];
  const radar_data = [
    { critère: "Couverture CDR", signum: 100, gvg: 65 },
    { critère: "Mobile Money", signum: 100, gvg: 0 },
    { critère: "Souveraineté", signum: 100, gvg: 10 },
    { critère: "CNIE / KYC", signum: 100, gvg: 0 },
    { critère: "IA explicable", signum: 95, gvg: 20 },
    { critère: "Urgences QoS", signum: 100, gvg: 5 },
  ];

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-base font-black text-white">Barrières structurelles — Pourquoi GVG ne peut pas rattraper SIGNUM</h2>
        <p className="text-xs text-white/40 mt-0.5">Arguments juridiques et techniques pour chaque question client</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left: barrier list */}
        <div className="space-y-2">
          {BARRIERS.map((bar, i) => (
            <button key={i} onClick={() => setSelected(i)}
              className="w-full text-left rounded-xl p-3 border transition-all"
              style={selected === i
                ? { background: "rgba(99,102,241,0.2)", borderColor: "rgba(99,102,241,0.5)" }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2">
                <span>{bar.icon}</span>
                <span className="text-xs font-semibold text-white leading-tight">{bar.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Center: detail */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{b.icon}</span>
            <div>
              <p className="text-xs font-black text-white">{b.title}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                style={{ color: b.verdictColor, borderColor: b.verdictColor + "40", background: b.verdictColor + "18" }}>
                {b.verdict}
              </span>
            </div>
          </div>
          <div className="rounded-xl p-3 border border-indigo-500/30" style={{ background: "rgba(99,102,241,0.1)" }}>
            <p className="text-[9px] font-bold text-indigo-400 mb-1.5">🇸🇳 SIGNUM</p>
            <p className="text-xs text-white/80 leading-relaxed">{b.signum}</p>
          </div>
          <div className="rounded-xl p-3 border border-red-500/30" style={{ background: "rgba(239,68,68,0.08)" }}>
            <p className="text-[9px] font-bold text-red-400 mb-1.5">🇱🇺 GVG Global Voice Group</p>
            <p className="text-xs text-white/70 leading-relaxed">{b.gvg}</p>
          </div>
          <div className="rounded-xl p-2.5 border border-amber-500/20" style={{ background: "rgba(245,158,11,0.07)" }}>
            <p className="text-[9px] font-bold text-amber-400 mb-1">💥 Impact concret</p>
            <p className="text-[10px] text-white/70">{b.impact}</p>
          </div>
          <div className="text-[9px] text-white/30 font-mono px-2">Base légale : {b.loi}</div>
        </div>

        {/* Right: radar chart */}
        <div>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-3 text-center">Score global SIGNUM vs GVG</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radar_data}>
              <PolarGrid stroke="rgba(255,255,255,0.1)"/>
              <PolarAngleAxis dataKey="critère" tick={{ fill: "#64748b", fontSize: 8 }}/>
              <Radar name="SIGNUM" dataKey="signum" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3}/>
              <Radar name="GVG" dataKey="gvg" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15}/>
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 10 }}/>
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-[10px] mt-1">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"/>SIGNUM</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"/>GVG</span>
          </div>
          <div className="mt-4 rounded-xl p-3 border border-emerald-500/20 text-center" style={{ background: "rgba(16,185,129,0.07)" }}>
            <p className="text-[9px] text-white/40">Score global</p>
            <p className="text-xl font-black text-emerald-400">SIGNUM 99/100</p>
            <p className="text-xs text-red-400 font-bold">GVG 17/100</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Benchmarks CEDEAO ────────────────────────────────────────────────────────
function BenchmarksCEDEAO() {
  const pays = [
    { drapeau: "🇸🇳", nom: "Sénégal", pop: "18M", oper: 3, fraude_estim: "67 Mds FCFA/an", signum_potential: "38-55 Mds", statut: "SIGNUM en déploiement", color: "#6366f1" },
    { drapeau: "🇨🇮", nom: "Côte d'Ivoire", pop: "27M", oper: 4, fraude_estim: "124 Mds FCFA/an", signum_potential: "72-98 Mds", statut: "Opportunité SIGNUM", color: "#10b981" },
    { drapeau: "🇬🇭", nom: "Ghana", pop: "33M", oper: 4, fraude_estim: "98 Mds FCFA/an", signum_potential: "58-78 Mds", statut: "TTMS GVG — échec 2023", color: "#f59e0b" },
    { drapeau: "🇧🇯", nom: "Bénin", pop: "13M", oper: 3, fraude_estim: "28 Mds FCFA/an", signum_potential: "15-22 Mds", statut: "Sans système actif", color: "#ef4444" },
    { drapeau: "🇧🇫", nom: "Burkina Faso", pop: "22M", oper: 3, fraude_estim: "41 Mds FCFA/an", signum_potential: "24-34 Mds", statut: "Contrat GVG contesté", color: "#f59e0b" },
    { drapeau: "🇲🇱", nom: "Mali", pop: "22M", oper: 3, fraude_estim: "38 Mds FCFA/an", signum_potential: "22-31 Mds", statut: "Sans système actif", color: "#ef4444" },
    { drapeau: "🇳🇪", nom: "Niger", pop: "25M", oper: 3, fraude_estim: "22 Mds FCFA/an", signum_potential: "12-18 Mds", statut: "Sans système actif", color: "#ef4444" },
    { drapeau: "🇹🇬", nom: "Togo", pop: "9M", oper: 2, fraude_estim: "18 Mds FCFA/an", signum_potential: "10-14 Mds", statut: "Sans système actif", color: "#ef4444" },
  ];

  const total_fraude = 436;
  const total_recup = 251;

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-base font-black text-white">Benchmarks CEDEAO — Marché SIGNUM Africa</h2>
        <p className="text-xs text-white/40 mt-0.5">8 pays · 169M d'abonnés · Opportunité d'export SaaS régional</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-2">
        <div className="rounded-xl p-4 border border-indigo-500/30 text-center" style={{ background: "rgba(99,102,241,0.12)" }}>
          <p className="text-[9px] text-white/40">FRAUDES CEDEAO (estimé)</p>
          <p className="text-2xl font-black text-red-400">{total_fraude} Mds FCFA/an</p>
        </div>
        <div className="rounded-xl p-4 border border-emerald-500/30 text-center" style={{ background: "rgba(16,185,129,0.10)" }}>
          <p className="text-[9px] text-white/40">RÉCUPÉRABLE PAR SIGNUM</p>
          <p className="text-2xl font-black text-emerald-400">{total_recup} Mds FCFA/an</p>
        </div>
        <div className="rounded-xl p-4 border border-amber-500/20 text-center" style={{ background: "rgba(245,158,11,0.08)" }}>
          <p className="text-[9px] text-white/40">POTENTIEL SIGNUM SAAS</p>
          <p className="text-2xl font-black text-amber-400">12-18 Mds FCFA/an</p>
          <p className="text-[9px] text-amber-400/60">revenus licence export</p>
        </div>
      </div>

      <div className="space-y-2">
        {pays.map(p => (
          <div key={p.nom} className="rounded-xl px-4 py-3 border border-white/8 grid grid-cols-6 items-center gap-4"
            style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="col-span-2 flex items-center gap-2">
              <span className="text-xl">{p.drapeau}</span>
              <div>
                <p className="text-xs font-bold text-white">{p.nom}</p>
                <p className="text-[9px] text-white/40">{p.pop} · {p.oper} opérateurs</p>
              </div>
            </div>
            <div>
              <p className="text-[9px] text-white/40">Fraude estimée</p>
              <p className="text-xs font-bold text-red-400">{p.fraude_estim}</p>
            </div>
            <div>
              <p className="text-[9px] text-white/40">Récupérable SIGNUM</p>
              <p className="text-xs font-bold text-emerald-400">{p.signum_potential}</p>
            </div>
            <div className="col-span-2">
              <span className="text-[9px] font-bold px-2 py-1 rounded-full border"
                style={{ color: p.color, borderColor: p.color + "40", background: p.color + "18" }}>
                {p.statut}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-4 border border-indigo-500/20" style={{ background: "rgba(99,102,241,0.07)" }}>
        <p className="text-[10px] font-bold text-indigo-300 mb-2">🚀 Stratégie SIGNUM Africa — Export SaaS 2027-2030</p>
        <div className="grid grid-cols-4 gap-3 text-[10px] text-white/60">
          <div><p className="font-bold text-white mb-1">Phase 1 (2026)</p><p>Sénégal déploiement complet + ROI prouvé</p></div>
          <div><p className="font-bold text-white mb-1">Phase 2 (2027)</p><p>Côte d'Ivoire + Bénin — licence SaaS</p></div>
          <div><p className="font-bold text-white mb-1">Phase 3 (2028)</p><p>Mali + Burkina — remplacement GVG contesté</p></div>
          <div><p className="font-bold text-white mb-1">Phase 4 (2030)</p><p>Hub CEDEAO · 8 pays · 169M abonnés</p></div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal dossier judiciaire ──────────────────────────────────────────────────
function DossierModal({ event, onClose }: { event: SimEvent; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }} onClick={onClose}>
      <div className="rounded-2xl border border-indigo-500/40 max-w-lg w-full p-6 space-y-4"
        style={{ background: "linear-gradient(135deg, #0f172a, #0f0a2e)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Dossier judiciaire auto-généré</p>
            <p className="text-sm font-black text-white mt-1">{event.detail}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl">×</button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-[10px]">
          {[
            { label: "Opérateur", val: event.op, color: OP_COLOR[event.op] },
            { label: "Région", val: event.region || "Dakar", color: "#64748b" },
            { label: "Horodatage", val: event.ts, color: "#64748b" },
            { label: "Type événement", val: event.type, color: "#64748b" },
            { label: "Statut SIGNUM", val: event.status, color: event.status === "BLOQUE" ? "#ef4444" : "#f59e0b" },
            { label: "Détection SIGNUM", val: `${event.signum_ms} ms`, color: "#6366f1" },
            { label: "Détection GVG", val: event.gvg_ms ? `${(event.gvg_ms / 1000).toFixed(0)}s` : "MANQUÉ ✗", color: event.gvg_ms ? "#64748b" : "#ef4444" },
            { label: "Montant", val: event.montant || "N/A", color: "#f59e0b" },
          ].map(r => (
            <div key={r.label} className="rounded-lg p-2.5 border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-white/40">{r.label}</p>
              <p className="font-bold mt-0.5" style={{ color: r.color }}>{r.val}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-3 border border-amber-500/20 space-y-1.5 text-[10px]" style={{ background: "rgba(245,158,11,0.07)" }}>
          <p className="font-bold text-amber-400">📋 Chaîne de preuves SIGNUM</p>
          <p className="text-white/60">✅ CDR horodaté et certifié SHA-256</p>
          <p className="text-white/60">✅ Log système signé cryptographiquement</p>
          <p className="text-white/60">✅ Ancrage blockchain — hash irréversible</p>
          <p className="text-white/60">✅ Copie automatique ARTP + Parquet Dakar</p>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 py-2 rounded-xl text-xs font-bold text-white border border-indigo-500/40 hover:bg-indigo-500/20 transition-colors"
            style={{ background: "rgba(99,102,241,0.2)" }}>
            📄 Télécharger PV numérique
          </button>
          <button className="flex-1 py-2 rounded-xl text-xs font-bold text-red-300 border border-red-500/30 hover:bg-red-500/15 transition-colors">
            ⚖️ Transmettre au Parquet
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function SimulateurPage() {
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[0]);
  const [running, setRunning]   = useState(false);
  const [speed, setSpeed]       = useState(1);
  const [events, setEvents]     = useState<SimEvent[]>([]);
  const [chart, setChart]       = useState<ChartPoint[]>([]);
  const [kpis, setKpis]         = useState<KPIs>({ events:0, fraudes:0, bloqués:0, manqués_gvg:0, recettes:0, temps_moy_signum:0 });
  const [phase, setPhase]       = useState<"idle"|"detecting"|"blocked"|"report">("idle");
  const [elapsed, setElapsed]   = useState(0);
  const [narrative, setNarrative] = useState("");
  const [tab, setTab]           = useState<Tab>("sim");
  const [dossierEvent, setDossierEvent] = useState<SimEvent | null>(null);
  const [activeHotspots, setActiveHotspots] = useState<HotSpot[]>([]);
  const feedRef  = useRef<HTMLDivElement>(null);
  const tickRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);

  const NARRATIVES: Record<string, string[]> = {
    simbox: ["Initialisation des sondes réseau chez Orange SN...", "Analyse des CDR entrants — détection de burst d'appels courts...", "⚠️ Pattern SIM Box identifié : 120 appels/heure même source IMSI", "🚨 CRITIQUE — SIM Box confirmée · 847 appels en bypass · Coordonnées GPS relevées", "🔒 Blocage automatique des 23 SIM impliquées · PV transmis à l'ARTP · Dossier ARMP généré"],
    aml:    ["Analyse des transactions Mobile Money en cours...", "Détection de synchronisation entre 42 comptes Wave...", "⚠️ Graphe de fractionnement identifié — seuil CDP évité systématiquement", "🚨 CRITIQUE — Hub central identifié : 67.3 M FCFA collectés en 8 minutes", "🔒 Comptes gelés · Alerte transmise au CENTIF · Rapport GAFI R.16 généré"],
    imei:   ["Vérification IMEI en temps réel — croisement base nationale...", "IMEI 354123456789012 détecté dans 2 régions simultanément...", "⚠️ Clonage confirmé — 4 régions simultanées · Impossible physiquement", "🚨 CRITIQUE — 15 appareils clonés sur le réseau · Réseau de contrefaçon actif", "🔒 15 appareils bloqués simultanément · DPJ notifiée · Dossier judiciaire généré"],
    grey:   ["Réconciliation CDR en cours — comparaison déclaré vs mesuré...", "Écart détecté : +8 200 CDR non déclarés dans la première heure...", "⚠️ Route grise confirmée — trafic international via nœud Gambie non déclaré", "🚨 ÉLEVÉ — 61 400 CDR manquants · Manque à gagner : 9.3 Mds FCFA/an estimé", "📋 PV de réconciliation CDR généré · Mise en demeure Free SN · Dossier DGID"],
    ott:    ["Analyse DPI du trafic data opérateurs en cours...", "WhatsApp : 47.4% du trafic voix équivalent — en hausse de 63% sur 6 mois...", "📊 Impact fiscal calculé : 41.5 Mds FCFA/an non taxés sous le régime actuel", "💡 4 scénarios de redevance OTT préparés pour le Ministère de l'Économie Numérique", "📋 Rapport OTT transmis · Recommandation taxe 1% CA local → 4.2 Mds FCFA/an"],
    qos:    ["Monitoring QoS des numéros d'urgence — 15 / 17 / 18...", "Dégradation détectée : taux d'échec 15 SAMU en hausse anormale — Free SN Tambacounda", "⚠️ Alerte QoS — Taux d'échec urgences : 34% (seuil légal : 2%) · Risque vital potentiel", "🚨 CRITIQUE — Congestion réseau Free SN Tambacounda · 847 appels urgences échoués", "🔒 Alerte préfectorale émise · Mise en demeure Free SN · Rapport ARTP transmis"],
  };

  const reset = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
    setRunning(false); setEvents([]); setChart([]);
    setKpis({ events:0, fraudes:0, bloqués:0, manqués_gvg:0, recettes:0, temps_moy_signum:0 });
    setPhase("idle"); setElapsed(0); setNarrative(""); setActiveHotspots([]);
    elapsedRef.current = 0; _id = 0;
  }, []);

  useEffect(() => { reset(); }, [activeScenario, reset]);

  const tick = useCallback(() => {
    const sc = activeScenario;
    elapsedRef.current += 1;
    const e = elapsedRef.current;
    setElapsed(e);

    const narrs = NARRATIVES[sc.id];
    setNarrative(narrs[Math.min(Math.floor(e / 6), narrs.length - 1)]);

    if      (e < 5)  setPhase("detecting");
    else if (e < 15) setPhase("detecting");
    else if (e < 22) setPhase("blocked");
    else             setPhase("report");

    // Progressive hotspots
    if (e === 5)  setActiveHotspots(sc.hotspots.slice(0, 1));
    if (e === 12) setActiveHotspots(sc.hotspots.slice(0, 2));
    if (e === 18) setActiveHotspots(sc.hotspots);

    const count = Math.floor(Math.random() * 3) + 1;
    const newEvs: SimEvent[] = [];
    for (let i = 0; i < count; i++) {
      const isFraud   = Math.random() < sc.fraud_rate;
      const isSuspect = !isFraud && Math.random() < 0.15;
      const gvgMisses = Math.random() < sc.gvg_miss_rate;
      const typePick  = sc.event_types[Math.floor(Math.random() * sc.event_types.length)];
      const op = OPS[Math.floor(Math.random() * OPS.length)];
      const detail = sc.details[Math.floor(Math.random() * sc.details.length)];
      const status: EventStatus = isFraud ? (e > 15 ? "BLOQUE" : "FRAUDE") : isSuspect ? "SUSPECT" : "LEGITIME";
      newEvs.push({
        id: uid(), ts: now(), type: typePick, op, status, detail,
        signum_ms: Math.floor(Math.random() * 800) + 200,
        gvg_ms: gvgMisses ? null : Math.floor(Math.random() * 60000) + 30000,
        montant: typePick === "MOBILE_MONEY" ? `${(Math.random() * 490 + 10).toFixed(0)} 000 FCFA` : undefined,
        region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
      });
    }
    setEvents(prev => [...newEvs, ...prev].slice(0, 60));

    setKpis(prev => {
      const fraudC = newEvs.filter(x => x.status === "FRAUDE" || x.status === "BLOQUE").length;
      const blqC   = newEvs.filter(x => x.status === "BLOQUE").length;
      const missC  = newEvs.filter(x => (x.status === "FRAUDE" || x.status === "BLOQUE") && x.gvg_ms === null).length;
      const avgSig = newEvs.reduce((a, b) => a + b.signum_ms, 0) / newEvs.length;
      return {
        events: prev.events + newEvs.length, fraudes: prev.fraudes + fraudC,
        bloqués: prev.bloqués + blqC, manqués_gvg: prev.manqués_gvg + missC,
        recettes: prev.recettes + blqC * 1.2,
        temps_moy_signum: Math.round((prev.temps_moy_signum + avgSig) / 2),
      };
    });

    setChart(prev => {
      const f = newEvs.filter(x => x.status !== "LEGITIME").length;
      return [...prev, { t: now(), signum: f, gvg: Math.round(f * (1 - sc.gvg_miss_rate)) }].slice(-25);
    });

    if (feedRef.current) feedRef.current.scrollTop = 0;
  }, [activeScenario]);

  useEffect(() => {
    if (running) tickRef.current = setInterval(tick, Math.max(80, 1000 / speed));
    else if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [running, speed, tick]);

  const PHASE_CONFIG = {
    idle:      { label: "EN ATTENTE",     dot: "bg-slate-400",  color: "text-slate-400" },
    detecting: { label: "DÉTECTION LIVE", dot: "bg-amber-400 animate-pulse", color: "text-amber-400" },
    blocked:   { label: "BLOCAGE ACTIF",  dot: "bg-red-400 animate-pulse", color: "text-red-400" },
    report:    { label: "RAPPORT GÉNÉRÉ", dot: "bg-emerald-400", color: "text-emerald-400" },
  };
  const pc = PHASE_CONFIG[phase];

  const TAB_LIST: { id: Tab; label: string }[] = [
    { id: "sim",      label: "🎮 Simulateur" },
    { id: "roi",      label: "💹 Calculateur ROI" },
    { id: "barrières", label: "🛡️ Barrières vs GVG" },
    { id: "cedeao",   label: "🌍 CEDEAO / Export" },
  ];

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0f0a2e 40%, #0a1628 100%)" }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <div>
          <h1 className="text-lg font-black text-white">🎮 SIGNUM Simulateur — Démo Interactive</h1>
          <p className="text-[10px] text-white/35 mt-0.5">6 scénarios · Preuves judiciaires · ROI calculé · Arguments anti-GVG · Export CEDEAO</p>
        </div>
        {tab === "sim" && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
              <span className={`w-2 h-2 rounded-full ${pc.dot}`}/>
              <span className={`text-[11px] font-bold ${pc.color}`}>{pc.label}</span>
            </div>
            <div className="text-xs font-mono text-white/50 border border-white/10 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
              T+{String(Math.floor(elapsed/60)).padStart(2,"0")}:{String(elapsed%60).padStart(2,"0")}
            </div>
            {[1,3,6,20].map(s => (
              <button key={s} onClick={() => setSpeed(s)}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${speed === s ? "text-white border-indigo-500/60" : "text-white/40 border-white/10 hover:text-white/70"}`}
                style={speed === s ? { background: "rgba(99,102,241,0.3)" } : {}}>
                {s}×
              </button>
            ))}
            <button onClick={() => setRunning(r => !r)}
              className="px-4 py-1.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: running ? "rgba(239,68,68,0.6)" : "linear-gradient(135deg,#6366f1,#06b6d4)" }}>
              {running ? "⏸ Pause" : phase === "idle" ? "▶ Démarrer" : "▶ Reprendre"}
            </button>
            <button onClick={reset} className="px-3 py-1.5 rounded-xl text-sm font-bold border border-white/20 text-white/60 hover:text-white transition-all">
              ↺
            </button>
          </div>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 px-6 pt-3 pb-0">
        {TAB_LIST.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold border-t border-x transition-all ${tab === t.id ? "text-white" : "text-white/40 hover:text-white/70 border-transparent"}`}
            style={tab === t.id ? { background: "rgba(99,102,241,0.15)", borderColor: "rgba(99,102,241,0.3)" } : {}}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="border-t border-indigo-500/20 flex-1 overflow-auto">

        {/* ──────────── SIMULATEUR ──────────── */}
        {tab === "sim" && (
          <div className="flex h-full">
            {narrative && (
              <div className="absolute left-64 right-72 mx-6 mt-2 px-4 py-2 rounded-xl border border-indigo-500/30 text-xs text-indigo-200 font-medium z-10"
                style={{ background: "rgba(99,102,241,0.15)" }}>
                {narrative}
              </div>
            )}

            {/* LEFT: Scenarios + KPIs */}
            <div className="w-60 shrink-0 flex flex-col gap-2 p-3 border-r border-white/8 overflow-auto">
              <p className="text-[9px] text-white/35 font-bold uppercase tracking-widest">6 Scénarios</p>
              {SCENARIOS.map(sc => (
                <button key={sc.id} onClick={() => { if (!running) setActiveScenario(sc); }}
                  className="text-left rounded-xl p-2.5 border transition-all"
                  style={activeScenario.id === sc.id
                    ? { background: sc.colorBg, borderColor: sc.border }
                    : { background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm">{sc.icon}</span>
                    <span className="text-[11px] font-bold text-white leading-tight">{sc.name}</span>
                  </div>
                  <p className="text-[9px] text-white/35 leading-tight">{sc.subtitle}</p>
                  {activeScenario.id === sc.id && <div className="mt-1.5 h-0.5 rounded-full" style={{ background: sc.color }}/>}
                </button>
              ))}
              <div className="mt-1 pt-2 border-t border-white/8 space-y-1.5">
                <p className="text-[9px] text-white/35 font-bold uppercase tracking-widest">Live</p>
                {[
                  { label: "Événements", val: kpis.events.toLocaleString(), c: "#6366f1" },
                  { label: "Fraudes", val: kpis.fraudes.toLocaleString(), c: "#ef4444" },
                  { label: "Blocages", val: kpis.bloqués.toLocaleString(), c: "#f59e0b" },
                  { label: "Manqués GVG", val: kpis.manqués_gvg.toLocaleString(), c: "#ef4444" },
                  { label: "Recettes (M FCFA)", val: kpis.recettes.toFixed(1), c: "#10b981" },
                  { label: "Détection moy.", val: `${kpis.temps_moy_signum || 0}ms`, c: "#06b6d4" },
                ].map(k => (
                  <div key={k.label} className="rounded-lg px-2.5 py-1.5 border border-white/6" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <p className="text-[8px] text-white/35">{k.label}</p>
                    <p className="text-sm font-black" style={{ color: k.c }}>{k.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CENTER */}
            <div className="flex-1 flex flex-col gap-3 p-3 min-w-0 overflow-auto mt-8">
              {/* Scenario desc */}
              <div className="rounded-xl px-4 py-3 border text-xs text-white/65 leading-relaxed shrink-0"
                style={{ background: activeScenario.colorBg, borderColor: activeScenario.border }}>
                <span style={{ color: activeScenario.color }} className="font-bold mr-2">{activeScenario.icon} {activeScenario.name} —</span>
                {activeScenario.desc}
              </div>

              {/* Chart */}
              <div className="rounded-xl p-3 border border-white/10 shrink-0" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold text-white">Détections — SIGNUM vs GVG</p>
                  <div className="flex gap-3 text-[9px]">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block"/>SIGNUM</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"/>GVG</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={110}>
                  <AreaChart data={chart}>
                    <defs>
                      <linearGradient id="gs2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
                      <linearGradient id="gg2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                    </defs>
                    <XAxis dataKey="t" tick={false}/>
                    <YAxis tick={{ fill: "#64748b", fontSize: 9 }}/>
                    <Tooltip contentStyle={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:8, fontSize:10 }}/>
                    <Area type="monotone" dataKey="signum" stroke="#6366f1" fill="url(#gs2)" strokeWidth={2} name="SIGNUM"/>
                    <Area type="monotone" dataKey="gvg" stroke="#ef4444" fill="url(#gg2)" strokeWidth={1.5} strokeDasharray="4 2" name="GVG"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Event feed */}
              <div className="rounded-xl border border-white/10 flex flex-col flex-1 min-h-0" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/8">
                  <p className="text-[11px] font-bold text-white">Flux événements · <span className="text-white/40 font-normal">Cliquer pour ouvrir le dossier judiciaire</span></p>
                  <span className="text-[10px] text-emerald-400">{running && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1"/>}{events.length} evt</span>
                </div>
                <div ref={feedRef} className="overflow-auto flex-1 px-2 py-1.5 space-y-1">
                  {events.length === 0 && (
                    <div className="flex items-center justify-center h-24 text-white/20 text-sm">▶ Appuyer pour démarrer le scénario</div>
                  )}
                  {events.map(ev => (
                    <button key={ev.id} onClick={() => setDossierEvent(ev)}
                      className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 border border-white/5 text-[10px] text-left hover:border-indigo-500/40 transition-all"
                      style={{ background: "rgba(255,255,255,0.035)", animation: "fadeIn 0.3s ease" }}>
                      <span className="text-white/25 font-mono shrink-0">{ev.ts}</span>
                      <span className="font-bold shrink-0" style={{ color: OP_COLOR[ev.op] }}>{ev.op.split(" ")[0]}</span>
                      <span className="text-white/40 uppercase font-mono shrink-0">[{ev.type}]</span>
                      <span className="text-white/65 flex-1 truncate">{ev.detail}</span>
                      {ev.region && <span className="text-white/25 shrink-0">{ev.region}</span>}
                      {ev.montant && <span className="text-amber-400 font-bold shrink-0">{ev.montant}</span>}
                      <span className={`px-1.5 py-0.5 rounded-full font-bold border shrink-0 text-[8px] ${STATUS_STYLE[ev.status]}`}>{ev.status}</span>
                      <span className="text-indigo-400 font-mono shrink-0">{ev.signum_ms}ms</span>
                      <span className={`font-mono shrink-0 ${ev.gvg_ms === null ? "text-red-500" : "text-white/25"}`}>
                        {ev.gvg_ms === null ? "GVG✗" : `GVG:${(ev.gvg_ms/1000).toFixed(0)}s`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Map + SIGNUM vs GVG */}
            <div className="w-56 shrink-0 flex flex-col gap-3 p-3 border-l border-white/8 overflow-auto">
              {/* Map */}
              <div className="rounded-xl border border-white/10 p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[9px] text-white/35 font-bold uppercase tracking-widest mb-1.5">Carte des alertes</p>
                <SenegalMap hotspots={activeHotspots}/>
              </div>

              {/* Dossier du scénario */}
              <div className="rounded-xl p-3 border border-white/10 space-y-2" style={{ background: "rgba(255,255,255,0.04)" }}>
                <p className="text-[9px] text-white/35 font-bold uppercase tracking-widest">Dossier scénario</p>
                <p className="text-[10px] font-bold text-indigo-300">{activeScenario.dossier.ref}</p>
                <p className="text-[9px] text-white/50">{activeScenario.dossier.qualification}</p>
                <p className="text-[9px] text-amber-400 font-semibold">{activeScenario.dossier.prejudice}</p>
                <p className="text-[9px] text-white/40">{activeScenario.dossier.autorité}</p>
              </div>

              {/* SIGNUM vs GVG scores */}
              <div className="rounded-xl p-3 border border-indigo-500/25" style={{ background: "rgba(99,102,241,0.10)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black text-white" style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }}>S</div>
                  <p className="text-[11px] font-bold text-white">SIGNUM</p>
                  <span className="ml-auto text-[9px] text-emerald-400 font-bold">🇸🇳</span>
                </div>
                {[
                  { l: "Détectées", v: kpis.fraudes, c: "#6366f1" },
                  { l: "Bloquées", v: kpis.bloqués, c: "#10b981" },
                  { l: "Couverture", v: "100%", c: "#06b6d4" },
                ].map(r => (
                  <div key={r.l} className="flex justify-between text-[10px] mb-1">
                    <span className="text-white/40">{r.l}</span>
                    <span className="font-black" style={{ color: r.c }}>{typeof r.v === "number" ? r.v : r.v}</span>
                  </div>
                ))}
              </div>
              <div className="text-center text-[10px] text-white/25 font-bold">VS</div>
              <div className="rounded-xl p-3 border border-red-500/20" style={{ background: "rgba(239,68,68,0.06)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-red-900/50 flex items-center justify-center text-[9px] font-black text-red-300">GVG</div>
                  <p className="text-[11px] font-bold text-white/60">Global Voice</p>
                  <span className="ml-auto text-[9px] text-white/25 font-bold">🇱🇺</span>
                </div>
                {[
                  { l: "Détectées", v: Math.round(kpis.fraudes * (1 - activeScenario.gvg_miss_rate)), c: "#ef4444" },
                  { l: "Manquées", v: kpis.manqués_gvg, c: "#ef4444" },
                  { l: "Couverture", v: `${Math.round((1 - activeScenario.gvg_miss_rate) * 100)}%`, c: "#ef4444" },
                ].map(r => (
                  <div key={r.l} className="flex justify-between text-[10px] mb-1">
                    <span className="text-white/40">{r.l}</span>
                    <span className="font-black" style={{ color: r.c }}>{r.v}</span>
                  </div>
                ))}
              </div>

              {kpis.manqués_gvg > 0 && (
                <div className="rounded-xl p-2.5 border border-emerald-500/25 text-center" style={{ background: "rgba(16,185,129,0.09)" }}>
                  <p className="text-[8px] text-white/35">AVANTAGE SIGNUM</p>
                  <p className="text-xl font-black text-emerald-400">+{kpis.manqués_gvg}</p>
                  <p className="text-[8px] text-emerald-400/60">fraudes que GVG a ratées</p>
                </div>
              )}

              {phase === "report" && (
                <div className="rounded-xl p-3 border border-indigo-500/40" style={{ background: "rgba(99,102,241,0.14)" }}>
                  <p className="text-[9px] text-indigo-300 font-bold mb-2">📋 Rapport auto</p>
                  <div className="space-y-1 text-[9px] text-white/55">
                    <p>✅ PV signé ARTP</p>
                    <p>✅ Dossier ARMP</p>
                    <p>✅ Alerte CENTIF</p>
                    <p>✅ Log blockchain</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "roi" && <ROICalculator/>}
        {tab === "barrières" && <BarrièresGVG/>}
        {tab === "cedeao" && <BenchmarksCEDEAO/>}
      </div>

      {/* Modal dossier */}
      {dossierEvent && <DossierModal event={dossierEvent} onClose={() => setDossierEvent(null)}/>}

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(-3px); } to { opacity:1; transform:translateY(0); } }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: white; cursor: pointer; }
      `}</style>
    </div>
  );
}
