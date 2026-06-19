import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "", duration = 1800 }: { target: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      observer.disconnect();
      const start = Date.now();
      const tick = () => {
        const t = Math.min(1, (Date.now() - start) / duration);
        const ease = 1 - Math.pow(1 - t, 3);
        setVal(Math.round(ease * target));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val.toLocaleString("fr-FR")}{suffix}</span>;
}

// ── Typing effect ─────────────────────────────────────────────────────────────
function TypeWriter({ texts, speed = 60 }: { texts: string[]; speed?: number }) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[idx % texts.length];
    const timer = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setDisplay(current.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        } else {
          setTimeout(() => setDeleting(true), 2000);
        }
      } else {
        if (charIdx > 0) {
          setDisplay(current.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        } else {
          setDeleting(false);
          setIdx(i => i + 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, idx, texts, speed]);

  return (
    <span style={{ color: "#06b6d4" }}>
      {display}
      <span style={{ animation: "blink 1s step-end infinite", color: "#6366f1" }}>|</span>
    </span>
  );
}

const MODULES = [
  { icon: "📡", label: "Surveillance Trafic", desc: "SS7 · Diameter · SIM Box < 30s", color: "#6366f1", path: "/trafic" },
  { icon: "📱", label: "Registre IMEI", desc: "12.8M terminaux · GSMA temps réel", color: "#06b6d4", path: "/imei" },
  { icon: "💳", label: "Mobile Money & AML", desc: "CENTIF · GAFI R.16 · Wave/OM/Free", color: "#10b981", path: "/mobilemoney" },
  { icon: "💰", label: "Gouvernance Fiscale", desc: "CDR 100% réconciliés · OTT taxé", color: "#f59e0b", path: "/fiscalite" },
  { icon: "🤖", label: "IA Prédictive", desc: "LSTM 97.4% · Transformer 98.7%", color: "#8b5cf6", path: "/ia" },
  { icon: "🛡️", label: "Souveraineté & Audit", desc: "Blockchain · ISO 27001 · DC Dakar", color: "#ef4444", path: "/souverainete" },
  { icon: "📞", label: "CDR Réconciliation", desc: "ASN.1 3GPP TS 32.298 · SFTP TLS", color: "#06b6d4", path: "/cdr" },
  { icon: "⚖️", label: "Dossier Légal Auto", desc: "TSA RFC 3161 · Parquet · ARMP", color: "#f59e0b", path: "/dossier" },
  { icon: "🌐", label: "OTT Monitor", desc: "WhatsApp · Viber · Skype · TikTok", color: "#10b981", path: "/ott" },
  { icon: "🎮", label: "Simulateur Live", desc: "6 scénarios · ROI · vs GVG · CEDEAO", color: "#8b5cf6", path: "/simulateur" },
];

const STATS = [
  { value: 38, suffix: "+", unit: "Mds FCFA", label: "récupérables / an", icon: "💰" },
  { value: 97, suffix: ".4%", unit: "", label: "précision détection fraude", icon: "🎯" },
  { value: 30, suffix: "s", unit: "", label: "temps de détection SIM Box", icon: "⚡" },
  { value: 100, suffix: "%", unit: "", label: "données souveraines au Sénégal", icon: "🇸🇳" },
];

const TIMELINE = [
  { id: "P1", label: "Fondation", sub: "M1–M3", budget: "480 M FCFA", color: "#3b82f6", items: ["Infrastructure DC Dakar", "Connecteurs SS7/Diameter", "CDR Engine v1"] },
  { id: "P2", label: "Déploiement", sub: "M4–M9", budget: "1,12 Md", color: "#10b981", items: ["3 opérateurs connectés", "IA SIM Box + Grey Route", "Mobile Money AML"] },
  { id: "P3", label: "Consolidation", sub: "M10–M15", budget: "890 M", color: "#f59e0b", items: ["IMEI National 12.8M", "CNIE/KYC croisement", "Dossiers judiciaires auto"] },
  { id: "P4", label: "Innovation", sub: "M16–M24", budget: "1,36 Md", color: "#ef4444", items: ["OTT fiscal complet", "Transformer CDR", "Blockchain audit trail"] },
  { id: "P5", label: "CEDEAO", sub: "M25–M36", budget: "1,0 Md", color: "#8b5cf6", items: ["Export SaaS 8 pays", "169M abonnés couverts", "Hub régional Dakar"] },
];

const ALERTS = [
  "🔴 SIM Box — Orange SN · Route Dakar-Thiès · 847 appels interceptés · 28s",
  "🟡 CDR manquants — Free SN · Fenêtre 14h00-14h15 · Alerte SFTP envoyée",
  "🔴 AML Wave — Transaction fractionnée · 42 comptes liés · CENTIF notifié",
  "🟢 Réconciliation — Expresso · 99.97% complétude · 0 anomalie",
  "🔴 Grey Route — Transit international non déclaré · 128 FCFA/min perdu",
  "🟡 IMEI clone — Samsung S21 · 15 appareils · 4 régions simultanées",
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);
  const [activePhase, setActivePhase] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 2500);
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => { clearInterval(t); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <div style={{ background: "linear-gradient(180deg, #020617 0%, #0f0a2e 30%, #020617 100%)", minHeight: "100vh", color: "#fff", fontFamily: "Arial, sans-serif", overflowX: "hidden" }}>

      {/* ══ NAV ══════════════════════════════════════════════════════════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(2,6,23,.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(99,102,241,.2)" : "none",
        transition: "all .3s", padding: "0 2.5rem", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16 }}>S</div>
          <div>
            <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: ".05em" }}>SIGNUM</span>
            <span style={{ fontSize: 10, color: "#6366f1", marginLeft: 8, fontWeight: 600 }}>by Processingenierie</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,.5)", cursor: "pointer" }} onClick={() => document.getElementById("modules")?.scrollIntoView({ behavior: "smooth" })}>Modules</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,.5)", cursor: "pointer" }} onClick={() => document.getElementById("deploiement")?.scrollIntoView({ behavior: "smooth" })}>Déploiement</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,.5)", cursor: "pointer" }} onClick={() => document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" })}>Impact</span>
          <button onClick={() => navigate("/simulateur")}
            style={{ background: "rgba(99,102,241,.15)", border: "1px solid rgba(99,102,241,.4)", borderRadius: 8, padding: "6px 14px", color: "#a5b4fc", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
            🎮 Simulateur
          </button>
          <button onClick={() => navigate("/dashboard")}
            style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", border: "none", borderRadius: 8, padding: "7px 16px", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
            Accéder →
          </button>
        </div>
      </nav>

      {/* ══ HERO ═════════════════════════════════════════════════════════════ */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "6rem 2rem 4rem", textAlign: "center", position: "relative" }}>
        {/* Glow background */}
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(99,102,241,.15) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.3)", borderRadius: 100, padding: "6px 16px", marginBottom: "2rem" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#a5b4fc", letterSpacing: ".08em" }}>PLATEFORME SOUVERAINE — SÉNÉGAL 🇸🇳</span>
        </div>

        {/* Titre principal */}
        <h1 style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 900, lineHeight: 1.05, marginBottom: "1.5rem", letterSpacing: "-.02em" }}>
          <span style={{ background: "linear-gradient(135deg,#fff 0%,#a5b4fc 60%,#06b6d4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            SIGNUM
          </span>
        </h1>
        <h2 style={{ fontSize: "clamp(1rem,2.5vw,1.5rem)", fontWeight: 700, color: "rgba(255,255,255,.85)", marginBottom: "0.75rem", letterSpacing: ".01em" }}>
          Surveillance Intelligente et Gouvernance<br />des Numéros et Usages Mobiles
        </h2>

        {/* Typewriter */}
        <div style={{ fontSize: "clamp(.9rem,2vw,1.15rem)", color: "rgba(255,255,255,.5)", marginBottom: "2.5rem", minHeight: 32 }}>
          La première solution{" "}
          <TypeWriter texts={["100% souveraine du Sénégal", "qui dépasse GVG en couverture", "avec IA prédictive native", "certifiée ISO 27001 ready", "déployée DC Dakar + Thiès"]} />
        </div>

        {/* Live ticker */}
        <div style={{ background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.2)", borderRadius: 8, padding: "8px 20px", marginBottom: "3rem", maxWidth: 680, width: "100%" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: ".1em", marginRight: 12 }}>LIVE</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,.65)", transition: "opacity .5s" }}>{ALERTS[tick % ALERTS.length]}</span>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "4rem" }}>
          <button onClick={() => navigate("/dashboard")}
            style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", border: "none", borderRadius: 12, padding: "14px 32px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 32px rgba(99,102,241,.4)" }}>
            🛰️ Centre de Commandement
          </button>
          <button onClick={() => navigate("/simulateur")}
            style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 12, padding: "14px 32px", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            🎮 Voir le Simulateur Live
          </button>
        </div>

        {/* KPIs rapides */}
        <div id="stats" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", maxWidth: 720, width: "100%" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "1.1rem .75rem", textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 900, background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                <Counter target={s.value} suffix={s.suffix} />{s.unit}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.45)", marginTop: 3, lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", animation: "bounce 2s infinite" }}>
          <div style={{ width: 24, height: 40, border: "2px solid rgba(255,255,255,.2)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <div style={{ width: 4, height: 8, background: "rgba(255,255,255,.4)", borderRadius: 2, animation: "scrollDot 2s infinite" }} />
          </div>
        </div>
      </section>

      {/* ══ COMPARATIF vs GVG ════════════════════════════════════════════════ */}
      <section style={{ padding: "5rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 12 }}>Pourquoi SIGNUM ?</div>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 900, marginBottom: 12 }}>SIGNUM dépasse GVG sur tous les plans</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", maxWidth: 500, margin: "0 auto" }}>Global Voice Group (Luxembourg) coûte 3-5 Mds FCFA/an en royalties perpétuelles. SIGNUM est souverain, une fois.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {[
            { icon: "🛰️", title: "Couverture 100% vs 60-70%", desc: "SIGNUM capture voix SS7, DATA DPI, OTT, Mobile Money, CDR ASN.1. GVG couvre uniquement la signalisation voix SS7.", signum: true },
            { icon: "🇸🇳", title: "Souveraineté totale", desc: "Données hébergées exclusivement à Dakar (DC1) et Thiès (DC2). GVG expose les CDR sénégalais à des serveurs luxembourgeois.", signum: true },
            { icon: "🤖", title: "IA native vs règles statiques", desc: "LSTM 97.4%, Transformer 98.7%, XGBoost+GNN AML. GVG utilise des seuils fixes sans apprentissage automatique.", signum: true },
            { icon: "💎", title: "Propriété permanente vs royalties", desc: "4.85 Mds FCFA sur 36 mois, puis actif ARTP. GVG : 25-44 Mds sur 10 ans sans transfert d'actif ni de compétences.", signum: true },
          ].map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(99,102,241,.2)", borderRadius: 14, padding: "1.5rem" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.45)", lineHeight: 1.6 }}>{item.desc}</div>
              <div style={{ marginTop: 12, fontSize: 11, fontWeight: 700, color: "#10b981" }}>✅ Avantage SIGNUM</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MODULES ══════════════════════════════════════════════════════════ */}
      <section id="modules" style={{ padding: "5rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#06b6d4", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 12 }}>Architecture</div>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 900 }}>10 modules opérationnels</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "0.75rem" }}>
          {MODULES.map((m, i) => (
            <button key={i} onClick={() => navigate(m.path)}
              style={{ background: "rgba(255,255,255,.03)", border: `1px solid ${m.color}33`, borderRadius: 12, padding: "1.1rem .9rem", textAlign: "left", cursor: "pointer", transition: "all .18s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${m.color}18`; (e.currentTarget as HTMLButtonElement).style.borderColor = m.color; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,.03)"; (e.currentTarget as HTMLButtonElement).style.borderColor = `${m.color}33`; (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{m.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.4)", lineHeight: 1.4 }}>{m.desc}</div>
              <div style={{ marginTop: 8, fontSize: 9, color: m.color, fontWeight: 600 }}>Accéder →</div>
            </button>
          ))}
        </div>
      </section>

      {/* ══ PIPELINE TECHNIQUE ═══════════════════════════════════════════════ */}
      <section style={{ padding: "5rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 12 }}>Stack technique</div>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 900 }}>Pipeline de données souverain</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
          {[
            { label: "Opérateurs", sub: "Orange · Free · Expresso", icon: "📡", color: "#6366f1" },
            { arrow: true },
            { label: "Collecte", sub: "SS7 · Diameter · SFTP", icon: "🔌", color: "#06b6d4" },
            { arrow: true },
            { label: "Streaming", sub: "Kafka · Flink", icon: "⚡", color: "#8b5cf6" },
            { arrow: true },
            { label: "Stockage", sub: "ClickHouse · PostgreSQL", icon: "🗄️", color: "#10b981" },
            { arrow: true },
            { label: "IA / ML", sub: "LSTM · XGBoost · GNN", icon: "🤖", color: "#f59e0b" },
            { arrow: true },
            { label: "ARTP", sub: "Alertes · Dossiers · API", icon: "🏛️", color: "#ef4444" },
          ].map((item, i) => {
            if ("arrow" in item) return (
              <div key={i} style={{ color: "rgba(255,255,255,.2)", fontSize: 20, margin: "0 8px" }}>→</div>
            );
            return (
              <div key={i} style={{ background: "rgba(255,255,255,.04)", border: `1px solid ${item.color}44`, borderRadius: 12, padding: "1rem .85rem", textAlign: "center", minWidth: 110 }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{item.label}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,.35)", marginTop: 3, lineHeight: 1.4 }}>{item.sub}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginTop: "2rem" }}>
          {[
            { tech: "Kafka + Apache Flink", role: "Streaming temps réel CDR", color: "#6366f1" },
            { tech: "ClickHouse + TimescaleDB", role: "Analytics + séries temporelles", color: "#06b6d4" },
            { tech: "MinIO + PostgreSQL", role: "Objets CDR + données structurées", color: "#10b981" },
            { tech: "Blockchain SHA-256", role: "Audit immuable + preuves TSA", color: "#8b5cf6" },
          ].map((t, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.03)", border: `1px solid ${t.color}22`, borderRadius: 10, padding: ".85rem", textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.color, marginBottom: 4 }}>{t.tech}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)" }}>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TIMELINE 5 PHASES ════════════════════════════════════════════════ */}
      <section id="deploiement" style={{ padding: "5rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 12 }}>Plan de déploiement</div>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 900 }}>36 mois · 4,85 Mds FCFA · 47 ingénieurs</h2>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {TIMELINE.map((ph, i) => (
            <div key={i} onClick={() => setActivePhase(i)}
              style={{ flex: i === activePhase ? 2 : 1, background: i === activePhase ? `${ph.color}18` : "rgba(255,255,255,.03)", border: `1px solid ${i === activePhase ? ph.color : "rgba(255,255,255,.08)"}`, borderRadius: 14, padding: "1.25rem", cursor: "pointer", transition: "all .3s", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: ph.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, flexShrink: 0 }}>{ph.id}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{ph.label}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)" }}>{ph.sub}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: ph.color, marginBottom: 8 }}>{ph.budget}</div>
              {i === activePhase && (
                <div style={{ marginTop: 8 }}>
                  {ph.items.map((item, j) => (
                    <div key={j} style={{ fontSize: 10, color: "rgba(255,255,255,.55)", padding: "3px 0", borderTop: j > 0 ? "1px solid rgba(255,255,255,.06)" : "none" }}>
                      ✓ {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginTop: "2rem" }}>
          {[
            { val: "4,85 Mds", label: "FCFA investissement total", color: "#6366f1" },
            { val: "47", label: "ingénieurs sénégalais formés", color: "#10b981" },
            { val: "+2 234%", label: "ROI projeté sur 5 ans", color: "#f59e0b" },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.03)", border: `1px solid ${s.color}33`, borderRadius: 12, padding: "1.1rem", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA FINAL ════════════════════════════════════════════════════════ */}
      <section style={{ padding: "5rem 2.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, margin: "0 auto 1.5rem" }}>S</div>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 900, marginBottom: "1rem" }}>Prêt pour la démonstration ?</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", marginBottom: "2rem", lineHeight: 1.7 }}>
            Accédez au simulateur live, lancez un scénario SIM Box ou AML en temps réel, et voyez SIGNUM détecter en 28 secondes ce que GVG manquerait pendant 47 heures.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/simulateur")}
              style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", border: "none", borderRadius: 12, padding: "14px 32px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 32px rgba(99,102,241,.35)" }}>
              🎮 Lancer le Simulateur
            </button>
            <button onClick={() => navigate("/dashboard")}
              style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 12, padding: "14px 32px", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              🛰️ Centre de Commandement
            </button>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════════ */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,.06)", padding: "2rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc", marginBottom: 4 }}>SIGNUM v1.0 · © 2026 Processingenierie</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.25)" }}>Dakar, République du Sénégal · DC1 Dakar · DC2 Thiès · Uptime 99.97%</div>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,.25)" }}>Loi 2018-28 · ISO 27001 ready · 3GPP TS 32.298</span>
          <span style={{ fontSize: 12, color: "#10b981", fontWeight: 700 }}>🇸🇳 Souveraineté 100% sénégalaise</span>
        </div>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
        @keyframes scrollDot { 0%{opacity:1;transform:translateY(0)} 75%{opacity:0;transform:translateY(12px)} 100%{opacity:0} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
