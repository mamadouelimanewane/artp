import { useState } from "react";

const MODULES = [
  {
    id: "pnir", code: "P1", title: "PNIR", emoji: "🧠",
    subtitle: "Intelligence Régulatoire",
    description: "LLM juridique, ML prédictif, veille internationale automatisée",
    port: 5181, color: "from-purple-500 to-purple-700", accent: "#8b5cf6",
    bg: "bg-purple-50", border: "border-purple-200", stars: 5, status: "active",
    kpi: { label: "Décisions analysées", value: "1 247" },
  },
  {
    id: "citizen", code: "P2", title: "Mon Réseau SN", emoji: "📡",
    subtitle: "Application Citoyenne QoS",
    description: "Mesures terrain, plaintes, carte de couverture nationale",
    port: 5173, color: "from-blue-500 to-blue-700", accent: "#3b82f6",
    bg: "bg-blue-50", border: "border-blue-200", stars: 5, status: "active",
    kpi: { label: "Mesures collectées", value: "48 392" },
  },
  {
    id: "spectrum", code: "P3", title: "SN-SSR", emoji: "📻",
    subtitle: "Surveillance Spectre Radio",
    description: "Capteurs SDR IoT, détection interférences temps réel",
    port: 5183, color: "from-emerald-500 to-emerald-700", accent: "#10b981",
    bg: "bg-emerald-50", border: "border-emerald-200", stars: 4, status: "active",
    kpi: { label: "Bandes surveillées", value: "14" },
  },
  {
    id: "domain", code: "P4", title: "RegTech .sn", emoji: "🌐",
    subtitle: "Registre Domaines .sn",
    description: "DNSSEC, anti-cybersquatting, conformité registrars",
    port: 5184, color: "from-orange-500 to-orange-700", accent: "#f97316",
    bg: "bg-orange-50", border: "border-orange-200", stars: 4, status: "active",
    kpi: { label: "Domaines .sn", value: "12 847" },
  },
  {
    id: "academy", code: "P5", title: "ADR-ARTP", emoji: "🎓",
    subtitle: "Académie Digitale de Régulation",
    description: "E-learning, certifications, formation régulateurs Afrique",
    port: 5185, color: "from-sky-500 to-sky-700", accent: "#0ea5e9",
    bg: "bg-sky-50", border: "border-sky-200", stars: 3, status: "active",
    kpi: { label: "Apprenants inscrits", value: "1 284" },
  },
  {
    id: "fraud", code: "P6", title: "SILFT", emoji: "🛡️",
    subtitle: "Lutte contre la Fraude Télécom",
    description: "SIM frauduleuses, SVA non conformes, CERT Télécom",
    port: 5182, color: "from-red-500 to-red-700", accent: "#ef4444",
    bg: "bg-red-50", border: "border-red-200", stars: 3, status: "active",
    kpi: { label: "Incidents ouverts", value: "23" },
  },
  {
    id: "opendata", code: "P7", title: "Open Data", emoji: "🌍",
    subtitle: "Portail data.artp.sn",
    description: "6 datasets publics, API REST, explorateur interactif, licence ouverte",
    port: 5187, color: "from-teal-500 to-teal-700", accent: "#14b8a6",
    bg: "bg-teal-50", border: "border-teal-200", stars: 5, status: "active",
    kpi: { label: "Datasets publics", value: "6" },
  },
  {
    id: "alert", code: "P8", title: "Alerte Citoyenne", emoji: "🔔",
    subtitle: "Signalement & Suivi",
    description: "Signalement 24h/7j, suivi en ligne, carte des alertes nationales",
    port: 5188, color: "from-rose-500 to-rose-700", accent: "#f43f5e",
    bg: "bg-rose-50", border: "border-rose-200", stars: 4, status: "active",
    kpi: { label: "Signalements ce mois", value: "1 699" },
  },
  {
    id: "ailake", code: "P10", title: "AI Lab", emoji: "🤖",
    subtitle: "Lac de Données & IA ARTP",
    description: "Stratégie IA 2026-2030, 8 PoC, scoring opérateurs, résumeur IA",
    port: 5189, color: "from-violet-500 to-violet-700", accent: "#7c3aed",
    bg: "bg-violet-50", border: "border-violet-200", stars: 4, status: "active",
    kpi: { label: "PoC validés", value: "3 / 8" },
  },
  {
    id: "gateway", code: "P11", title: "Open Gateway", emoji: "🔑",
    subtitle: "APIs GSMA Opérateurs",
    description: "KYC, Number Verify, Device Location — accès unifié aux capacités réseau",
    port: 5190, color: "from-amber-500 to-amber-700", accent: "#f59e0b",
    bg: "bg-amber-50", border: "border-amber-200", stars: 4, status: "active",
    kpi: { label: "APIs disponibles", value: "3" },
  },
];

const GLOBAL_KPIS = [
  { label: "Opérateurs régulés", value: "12", icon: "🏢", color: "from-blue-500 to-blue-600" },
  { label: "Plaintes traitées", value: "3 841", icon: "📋", color: "from-emerald-500 to-emerald-600" },
  { label: "Mesures QoS", value: "48 392", icon: "📡", color: "from-purple-500 to-purple-600" },
  { label: "Score conformité", value: "87%", icon: "✅", color: "from-amber-500 to-amber-600" },
];

function StarRating({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i<=n?"text-amber-400":"text-slate-300"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  );
}

export default function App() {
  const [hovered, setHovered] = useState<string | null>(null);

  const VERCEL_URLS: Record<string, string> = {
    pnir:     "https://artp-pnir.vercel.app",
    citizen:  "https://artp-web-citizen.vercel.app",
    spectrum: "https://artp-web-spectrum.vercel.app",
    domain:   "https://artp-web-domain.vercel.app",
    academy:  "https://artp-web-academy.vercel.app",
    fraud:    "https://artp-web-fraud.vercel.app",
    opendata: "https://artp-opendata.vercel.app",
    alert:    "https://web-alert-blond.vercel.app",
    ailake:   "https://web-ailake.vercel.app",
    gateway:  "https://web-gateway-psi.vercel.app",
  };

  function openModule(port: number, id: string) {
    const url = VERCEL_URLS[id] ?? `http://localhost:${port}`;
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen" style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #1e3a5f 60%, #0f2a1a 100%)"
    }}>
      {/* Cercles décoratifs fond */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #0ea5e9, transparent)" }} />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #10b981, transparent)" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, #6366f1, #0ea5e9)" }}>
              A
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Grand SI ARTP</h1>
              <p className="text-xs text-blue-300">Hub Central · 10 modules · Sénégal 2026–2030</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
              Système opérationnel
            </div>
            <div className="text-xs text-white/50 border border-white/20 px-3 py-1.5 rounded-full">
              {new Date().toLocaleDateString("fr-SN", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* Hero section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4 text-blue-300 border border-blue-500/30"
            style={{ background: "rgba(59,130,246,0.1)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block"></span>
            Offre Spontanée · Proposition 2026–2030
          </div>
          <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
            Système d'Information<br />
            <span style={{ background: "linear-gradient(90deg, #6366f1, #0ea5e9, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              de Régulation ARTP
            </span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
            Écosystème digital complet pour la régulation des télécommunications au Sénégal.
            10 modules interconnectés, accessibles depuis ce portail central.
          </p>
        </div>

        {/* KPIs globaux */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {GLOBAL_KPIS.map(k => (
            <div key={k.label} className="rounded-2xl p-5 border border-white/10 text-center"
              style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(10px)" }}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${k.color} flex items-center justify-center text-lg mx-auto mb-3`}>
                {k.icon}
              </div>
              <p className="text-2xl font-black text-white">{k.value}</p>
              <p className="text-xs text-white/50 mt-1">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Titre section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Modules du Grand SI</h3>
            <p className="text-white/40 text-sm mt-0.5">Cliquez sur un module pour l'ouvrir</p>
          </div>
          <span className="text-xs text-white/40 border border-white/20 px-3 py-1.5 rounded-full">
            {MODULES.filter(m => m.status === "active").length} / {MODULES.length} actifs
          </span>
        </div>

        {/* Grille modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MODULES.map((m) => (
            <div
              key={m.id}
              className="group rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden"
              style={{
                background: hovered === m.id
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(255,255,255,0.06)",
                borderColor: hovered === m.id ? m.accent + "80" : "rgba(255,255,255,0.10)",
                backdropFilter: "blur(10px)",
                transform: hovered === m.id ? "translateY(-4px)" : "translateY(0)",
                boxShadow: hovered === m.id ? `0 20px 40px ${m.accent}30` : "none",
              }}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => openModule(m.port, m.id)}
            >
              {/* Barre gradient top */}
              <div className={`h-1 bg-gradient-to-r ${m.color}`} />

              <div className="p-5">
                {/* Header card */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-2xl shadow-md`}>
                    {m.emoji}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white/80 border border-white/20"
                      style={{ background: "rgba(255,255,255,0.10)" }}>
                      {m.code}
                    </span>
                    <StarRating n={m.stars} />
                  </div>
                </div>

                {/* Titre */}
                <h3 className="font-black text-white text-lg leading-tight">{m.subtitle}</h3>
                <p className="text-sm font-medium mt-1 mb-3" style={{ color: m.accent + "dd" }}>{m.title}</p>
                <p className="text-sm text-white/55 leading-relaxed mb-4">{m.description}</p>

                {/* KPI */}
                <div className="rounded-xl px-4 py-3 mb-4 flex items-center justify-between"
                  style={{ background: m.accent + "20", border: `1px solid ${m.accent}40` }}>
                  <span className="text-sm text-white/65">{m.kpi.label}</span>
                  <span className="font-black text-base text-white">{m.kpi.value}</span>
                </div>

                {/* Bouton */}
                <button
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 bg-gradient-to-r ${m.color} text-white`}
                  style={{ opacity: hovered === m.id ? 1 : 0.85 }}
                  onClick={e => { e.stopPropagation(); openModule(m.port, m.id); }}
                >
                  Ouvrir le module →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-14 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/30">
          <span>ARTP Sénégal · Grand SI 2026–2030</span>
          <span>Offre Spontanée · Code des Marchés Publics</span>
          <span>10 modules · 18 services</span>
        </div>
      </main>
    </div>
  );
}
