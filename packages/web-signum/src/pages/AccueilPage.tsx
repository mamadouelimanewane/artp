import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MODULES = [
  { icon: "📡", label: "Surveillance Trafic", desc: "Monitoring temps réel SS7/CDR · Détection SIM Box < 30s", path: "/trafic", color: "#6366f1" },
  { icon: "📱", label: "Registre IMEI", desc: "100% des terminaux identifiés · Croisement CNIE/NIN", path: "/imei", color: "#06b6d4" },
  { icon: "💳", label: "Mobile Money & AML", desc: "Interface CENTIF · Alertes GAFI R.16 · Smurfing GNN", path: "/mobilemoney", color: "#10b981" },
  { icon: "💰", label: "Gouvernance Fiscale", desc: "CDR réconciliés 100% · Redevances OTT calculées", path: "/fiscalite", color: "#f59e0b" },
  { icon: "🤖", label: "IA Prédictive", desc: "LSTM 97,4% · Transformer 98,7% · XGBoost + GNN", path: "/ia", color: "#8b5cf6" },
  { icon: "🛡️", label: "Souveraineté & Audit", desc: "Blockchain SHA-256 · Dossiers admissibles · ISO 27001", path: "/souverainete", color: "#ef4444" },
  { icon: "📞", label: "CDR Réconciliation", desc: "Ingestion SFTP · Anomalies ASN.1 · Rapports ARTP", path: "/cdr", color: "#06b6d4" },
  { icon: "⚖️", label: "Dossier Légal Auto", desc: "PDF signé · RFC 3161 TSA · Prêt pour le Parquet", path: "/dossier", color: "#f59e0b" },
  { icon: "🌐", label: "OTT Monitor", desc: "WhatsApp · Viber · Skype · Impact fiscal quantifié", path: "/ott", color: "#10b981" },
  { icon: "🎮", label: "Simulateur de Terrain", desc: "6 scénarios live · ROI · CEDEAO · Barrières vs GVG", path: "/simulateur", color: "#8b5cf6" },
];

const STATS = [
  { val: "100%", label: "CDR couverts", sub: "vs 60–70% GVG" },
  { val: "< 30s", label: "Détection fraude", sub: "temps réel" },
  { val: "38–55 Mds", label: "FCFA récupérés/an", sub: "dès Phase 2" },
  { val: "100%", label: "Souverain", sub: "Dakar · Thiès" },
];

const TIMELINE = [
  { phase: "P1", label: "Fondation", period: "M1–M3", budget: "480 M FCFA", color: "#3b82f6" },
  { phase: "P2", label: "Déploiement", period: "M4–M9", budget: "1,12 Md", color: "#10b981" },
  { phase: "P3", label: "Consolidation", period: "M10–M15", budget: "890 M", color: "#f59e0b" },
  { phase: "P4", label: "Innovation", period: "M16–M24", budget: "1,36 Md", color: "#ef4444" },
  { phase: "P5", label: "CEDEAO", period: "M25–M36", budget: "1,0 Md", color: "#8b5cf6" },
];

export default function AccueilPage() {
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setInterval(() => setTick(x => x + 1), 2000);
    return () => clearInterval(t);
  }, []);

  const liveAlerts = [
    "🔴 SIM Box détectée · Orange SN · Route Dakar-Thiès · 47 appels interceptés",
    "🟡 CDR manquants · Free SN · Fenêtre 14h00-14h15 · Alerte envoyée",
    "🔴 AML Mobile Money · Wave · Transaction fractionnée · 3 comptes liés · CENTIF notifié",
    "🟢 Réconciliation CDR · Expresso · 99,97% complétude · Aucune anomalie",
    "🔴 Grey Route détectée · Transit international non déclaré · 128 FCFA/min perdu",
  ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #020617 0%, #0f0a2e 50%, #0a1628 100%)" }}>

      {/* ── HERO ── */}
      <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{ padding: "3rem 2.5rem 2rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", borderRadius: "14px", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: "#fff", flexShrink: 0 }}>S</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em" }}>Processingenierie · Dakar, Sénégal</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>SIGNUM</div>
              </div>
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,.55)", maxWidth: 560, lineHeight: 1.6 }}>
              <span style={{ color: "#a5b4fc", fontWeight: 600 }}>Surveillance Intelligente et Gouvernance des Numéros et Usages Mobiles</span>
              <br />Plateforme souveraine de régulation télécom · 100% sénégalaise · Dakar &amp; Thiès
            </div>
          </div>

          {/* Live status */}
          <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "1rem 1.25rem", minWidth: 260 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: ".08em" }}>Système opérationnel</span>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)", lineHeight: 1.8 }}>
              🛰️ 3 opérateurs connectés<br />
              📊 CDR reçus : toutes les 15 min<br />
              🤖 IA : 5 modèles actifs<br />
              🔐 Blockchain : ancrage continu
            </div>
          </div>
        </div>

        {/* Live alert ticker */}
        <div style={{ marginTop: "1.5rem", background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.2)", borderRadius: 8, padding: "0.6rem 1rem", overflow: "hidden" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: ".08em", marginRight: 12 }}>LIVE</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,.7)", transition: "all .5s" }}>
            {liveAlerts[tick % liveAlerts.length]}
          </span>
        </div>
      </div>

      {/* ── KPI STATS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", padding: "0 2.5rem 2rem" }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, padding: "1.1rem", textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.val}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── MODULES GRID ── */}
      <div style={{ padding: "0 2.5rem 2rem" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: "1rem" }}>
          ⚙️ 10 Modules opérationnels
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "0.75rem" }}>
          {MODULES.map((m, i) => (
            <button key={i} onClick={() => navigate(m.path)}
              style={{ background: "rgba(255,255,255,.04)", border: `1px solid ${m.color}33`, borderRadius: 10, padding: "0.9rem 0.75rem", textAlign: "left", cursor: "pointer", transition: "all .18s", width: "100%" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${m.color}15`; (e.currentTarget as HTMLButtonElement).style.borderColor = m.color; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,.04)"; (e.currentTarget as HTMLButtonElement).style.borderColor = `${m.color}33`; }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{m.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.4)", lineHeight: 1.4 }}>{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── BOTTOM ROW : TIMELINE + CTA ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem", padding: "0 2.5rem 2.5rem", alignItems: "start" }}>

        {/* Timeline phases */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: "0.75rem" }}>
            📅 Plan de déploiement — 36 mois · 4,85 Mds FCFA
          </div>
          <div style={{ display: "flex", gap: 0, position: "relative" }}>
            {TIMELINE.map((ph, i) => (
              <div key={i} style={{ flex: 1, position: "relative" }}>
                {/* Connector line */}
                {i < TIMELINE.length - 1 && (
                  <div style={{ position: "absolute", top: 18, left: "calc(50% + 20px)", right: "-50%", height: 2, background: "rgba(255,255,255,.1)", zIndex: 0 }} />
                )}
                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: ph.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#fff" }}>{ph.phase}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", textAlign: "center" }}>{ph.label}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)", textAlign: "center" }}>{ph.period}</div>
                  <div style={{ fontSize: 9, color: ph.color, fontWeight: 600, textAlign: "center" }}>{ph.budget}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.3)", borderRadius: 12, padding: "1.25rem", minWidth: 220, textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Démonstration live</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginBottom: 14, lineHeight: 1.5 }}>Simuler une détection SIM Box, une alerte AML, un dossier judiciaire</div>
          <button onClick={() => navigate("/simulateur")}
            style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", border: "none", borderRadius: 8, padding: "0.65rem 1.25rem", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%", marginBottom: 8 }}>
            🎮 Lancer le Simulateur
          </button>
          <button onClick={() => navigate("/")}
            style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "0.55rem 1.25rem", color: "rgba(255,255,255,.7)", fontSize: 11, cursor: "pointer", width: "100%" }}>
            📊 Centre de commandement
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", padding: "0.9rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.25)" }}>SIGNUM v1.0 · © 2026 Processingenierie · Dakar, Sénégal · 🇸🇳 Souveraineté 100% sénégalaise</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.25)" }}>DC1 Dakar · DC2 Thiès · Uptime 99,97%</div>
      </div>
    </div>
  );
}
