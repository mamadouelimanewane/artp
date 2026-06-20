import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ target, suffix = "", prefix = "", duration = 2000 }: { target: number; suffix?: string; prefix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      observer.disconnect();
      const start = Date.now();
      const tick = () => {
        const t = Math.min(1, (Date.now() - start) / duration);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        setVal(Math.round(ease * target));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString("fr-FR")}{suffix}</span>;
}

// ── TypeWriter ────────────────────────────────────────────────────────────────
function TypeWriter({ texts, speed = 55 }: { texts: string[]; speed?: number }) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [char, setChar] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = texts[idx % texts.length];
    const t = setTimeout(() => {
      if (!del) {
        if (char < cur.length) { setDisplay(cur.slice(0, char + 1)); setChar(c => c + 1); }
        else setTimeout(() => setDel(true), 2200);
      } else {
        if (char > 0) { setDisplay(cur.slice(0, char - 1)); setChar(c => c - 1); }
        else { setDel(false); setIdx(i => i + 1); }
      }
    }, del ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [char, del, idx, texts, speed]);
  return (
    <span style={{ color: "#06b6d4" }}>
      {display}
      <span style={{ animation: "blink 1s step-end infinite", color: "#818cf8" }}>|</span>
    </span>
  );
}

// ── Particle dot (subtle background) ─────────────────────────────────────────
function FloatingOrb({ size, x, y, color, delay }: { size: number; x: string; y: string; color: string; delay: number }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      width: size, height: size, borderRadius: "50%",
      background: `radial-gradient(circle, ${color}33 0%, ${color}00 70%)`,
      animation: `floatOrb ${6 + delay}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      pointerEvents: "none",
    }} />
  );
}

// ── Module card ───────────────────────────────────────────────────────────────
function ModuleCard({ icon, label, desc, color, path, delay }: { icon: string; label: string; desc: string; color: string; path: string; delay: number }) {
  const [hov, setHov] = useState(false);
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? `${color}15` : "rgba(255,255,255,.025)",
        border: `1px solid ${hov ? color : color + "30"}`,
        borderRadius: 14,
        padding: "1.25rem 1rem",
        textAlign: "left",
        cursor: "pointer",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? `0 8px 32px ${color}25` : "none",
        transition: "all .22s cubic-bezier(.4,0,.2,1)",
        animation: `fadeUp .6s ease ${delay}s both`,
      }}>
      <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: hov ? "#fff" : "rgba(255,255,255,.9)", marginBottom: 5, lineHeight: 1.3 }}>{label}</div>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,.38)", lineHeight: 1.5 }}>{desc}</div>
      <div style={{ marginTop: 10, fontSize: 10, fontWeight: 700, color: color, display: "flex", alignItems: "center", gap: 4 }}>
        Accéder <span style={{ transition: "transform .18s", transform: hov ? "translateX(3px)" : "none" }}>→</span>
      </div>
    </button>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const MODULES = [
  { icon: "📊", label: "Centre de Commandement", desc: "Dashboard SOC · Alertes live · 3s refresh", color: "#6366f1", path: "/dashboard" },
  { icon: "📡", label: "Surveillance Trafic", desc: "SS7 · Diameter · SIM Box < 30s · LSTM 97,4%", color: "#06b6d4", path: "/trafic" },
  { icon: "📱", label: "Registre IMEI", desc: "12,8M terminaux · CNN clones · GSMA sync", color: "#8b5cf6", path: "/imei" },
  { icon: "💳", label: "Mobile Money & AML", desc: "Wave · OM · Free · CENTIF · GAFI R.16", color: "#10b981", path: "/mobilemoney" },
  { icon: "💰", label: "Gouvernance Fiscale", desc: "7 taxes · CDR réconciliés · 35 Mds FCFA/an", color: "#f59e0b", path: "/fiscalite" },
  { icon: "🤖", label: "IA Prédictive", desc: "LSTM · Transformer · XGBoost · GNN · IF", color: "#a78bfa", path: "/ia" },
  { icon: "🛡️", label: "Souveraineté & Audit", desc: "Merkle Tree · RBAC 8 niveaux · ISO 27001", color: "#ef4444", path: "/souverainete" },
  { icon: "📋", label: "CDR Réconciliation", desc: "ASN.1 3GPP TS 32.298 · SFTP TLS 1.3 · 100%", color: "#06b6d4", path: "/cdr" },
  { icon: "🪪", label: "CNIE / KYC SIM", desc: "19M SIM · Interface DGE · Conformité ARTP", color: "#10b981", path: "/cnie" },
  { icon: "⚖️", label: "Dossier Légal Auto", desc: "SHA-256 · TSA RFC 3161 · Parquet Dakar", color: "#f59e0b", path: "/dossier" },
  { icon: "📲", label: "OTT Monitor", desc: "WhatsApp · TikTok · 41,5 Mds FCFA impact", color: "#ec4899", path: "/ott" },
  { icon: "🎮", label: "Simulateur Terrain", desc: "8 scénarios · Fraude live · Mode formation", color: "#8b5cf6", path: "/simulateur" },
];

const STATS = [
  { value: 141, prefix: "", suffix: "M", label: "CDR traités / jour", icon: "📡", color: "#6366f1" },
  { value: 97, prefix: "", suffix: ",4%", label: "Précision LSTM SIM Box", icon: "🎯", color: "#10b981" },
  { value: 30, prefix: "<", suffix: "s", label: "Temps détection fraude", icon: "⚡", color: "#f59e0b" },
  { value: 55, prefix: "", suffix: " Mds", label: "FCFA récupérables / an", icon: "💰", color: "#a78bfa" },
];

const LIVE_ALERTS = [
  { lvl: "CRIT", color: "#ef4444", msg: "SIM Box · Orange SN · Route Dakar-Thiès · 847 appels · 28s" },
  { lvl: "ALRT", color: "#f59e0b", msg: "CDR manquants · Free SN · Fenêtre 14h00-14h15 · SFTP notifié" },
  { lvl: "CRIT", color: "#ef4444", msg: "AML Wave · Transaction fractionnée · 42 comptes · CENTIF notifié" },
  { lvl: "INFO", color: "#10b981", msg: "Réconciliation Expresso · 99,97% complétude · 0 anomalie" },
  { lvl: "ALRT", color: "#f59e0b", msg: "Grey Route · Transit int. non déclaré · 128 FCFA/min perdu" },
  { lvl: "CRIT", color: "#ef4444", msg: "IMEI clone · Samsung S21 · 15 appareils · 4 régions simultanées" },
];

const TIMELINE = [
  { id: "P1", label: "Fondation", months: "M1–M3", budget: "480 M FCFA", color: "#6366f1", items: ["Infrastructure DC Dakar + Thiès", "Connecteurs SS7/Diameter", "CDR Engine v1 · Pentest validé"] },
  { id: "P2", label: "Déploiement", months: "M4–M9", budget: "1,12 Md", color: "#06b6d4", items: ["3 opérateurs connectés", "LSTM SIM Box + AML Wave/OM", "1ers avis de régularisation DGI"] },
  { id: "P3", label: "Consolidation", months: "M10–M15", budget: "890 M", color: "#10b981", items: ["IMEI National 12,8M terminaux", "CNIE/KYC croisement DGE", "1er dossier judiciaire Parquet"] },
  { id: "P4", label: "Innovation", months: "M16–M24", budget: "1,36 Md", color: "#f59e0b", items: ["OTT DPI complet 6 services", "Transformer CDR génération 2", "DC2 Thiès miroir DR/BC opé."] },
  { id: "P5", label: "CEDEAO", months: "M25–M36", budget: "1,0 Md", color: "#a78bfa", items: ["Export SaaS 7 pays CEDEAO", "169M abonnés couverts", "Sénégal = Hub régional régulation"] },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const [alertIdx, setAlertIdx] = useState(0);
  const [activePhase, setActivePhase] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setAlertIdx(i => (i + 1) % LIVE_ALERTS.length), 3000);
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    setTimeout(() => setHeroVisible(true), 80);
    return () => { clearInterval(t); window.removeEventListener("scroll", onScroll); };
  }, []);

  const alert = LIVE_ALERTS[alertIdx];

  return (
    <div style={{ background: "#020617", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif", overflowX: "hidden" }}>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? "rgba(2,6,23,.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(99,102,241,.15)" : "none",
        transition: "all .35s cubic-bezier(.4,0,.2,1)",
        padding: "0 2.5rem", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 17, boxShadow: "0 0 16px rgba(99,102,241,.5)",
          }}>S</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, letterSpacing: ".06em", color: "#fff" }}>SIGNUM</div>
            <div style={{ fontSize: 9, color: "#6366f1", fontWeight: 700, letterSpacing: ".05em" }}>by Processingenierie</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.8rem" }}>
          {[["Modules", "modules"], ["Architecture", "pipeline"], ["Déploiement", "deploiement"], ["Impact", "impact"]].map(([label, id]) => (
            <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,.5)", fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0, letterSpacing: ".02em", transition: "color .18s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.5)")}>
              {label}
            </button>
          ))}
          <button onClick={() => navigate("/simulateur")}
            style={{ background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.35)", borderRadius: 8, padding: "6px 14px", color: "#a5b4fc", fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all .18s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,.12)"; }}>
            🎮 Simulateur
          </button>
          <button onClick={() => navigate("/dashboard")}
            style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", border: "none", borderRadius: 8, padding: "7px 18px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 20px rgba(99,102,241,.4)", transition: "all .18s" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 30px rgba(99,102,241,.7)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 20px rgba(99,102,241,.4)"; e.currentTarget.style.transform = "none"; }}>
            Accéder →
          </button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "7rem 2rem 5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>

        {/* Background orbs */}
        <FloatingOrb size={700} x="50%" y="-10%" color="#6366f1" delay={0} />
        <FloatingOrb size={400} x="75%" y="40%" color="#06b6d4" delay={2} />
        <FloatingOrb size={350} x="10%" y="55%" color="#8b5cf6" delay={4} />
        <FloatingOrb size={250} x="20%" y="10%" color="#10b981" delay={1} />

        {/* Grid background subtile */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99,102,241,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,.04) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

        {/* Badge souveraineté */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.25)",
          borderRadius: 100, padding: "7px 20px", marginBottom: "2.2rem",
          opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all .7s ease .1s",
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 8px #10b981", animation: "livePulse 2s infinite" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#6ee7b7", letterSpacing: ".1em" }}>PLATEFORME SOUVERAINE — SÉNÉGAL 🇸🇳</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,.3)", fontWeight: 600 }}>LIVE</span>
        </div>

        {/* Titre */}
        <h1 style={{
          fontSize: "clamp(3.5rem, 9vw, 7rem)", fontWeight: 900, lineHeight: 1,
          marginBottom: "1rem", letterSpacing: "-.03em",
          opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all .8s ease .2s",
        }}>
          <span style={{ background: "linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #67e8f9 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "block" }}>
            SIGNUM
          </span>
        </h1>

        {/* Sous-titre */}
        <p style={{
          fontSize: "clamp(.95rem, 1.8vw, 1.2rem)", color: "rgba(255,255,255,.65)",
          marginBottom: "1rem", fontWeight: 600, letterSpacing: ".01em", lineHeight: 1.5,
          opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all .8s ease .35s",
        }}>
          Surveillance Intelligente et Gouvernance<br />des Numéros et Usages Mobiles
        </p>

        {/* TypeWriter */}
        <div style={{
          fontSize: "clamp(.9rem, 1.6vw, 1.1rem)", color: "rgba(255,255,255,.4)",
          marginBottom: "2.8rem", minHeight: 30,
          opacity: heroVisible ? 1 : 0, transition: "opacity .8s ease .5s",
        }}>
          La première plateforme télécom{" "}
          <TypeWriter texts={[
            "100% souveraine du Sénégal",
            "qui surpasse GVG sur tous les plans",
            "avec IA prédictive native LSTM 97,4%",
            "certifiée DC Dakar · DC Thiès",
            "qui traite 100% des CDR en temps réel",
          ]} />
        </div>

        {/* Live alert ticker */}
        <div style={{
          background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 10, padding: "10px 22px", marginBottom: "2.8rem",
          maxWidth: 700, width: "100%",
          display: "flex", alignItems: "center", gap: 12,
          opacity: heroVisible ? 1 : 0, transition: "opacity .8s ease .6s",
        }}>
          <span style={{
            background: alert.color, color: "#fff", fontSize: 9, fontWeight: 900,
            padding: "2px 7px", borderRadius: 4, letterSpacing: ".08em", flexShrink: 0,
          }}>{alert.lvl}</span>
          <span style={{ width: 1, height: 14, background: "rgba(255,255,255,.1)", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,.6)", transition: "all .5s" }}>{alert.msg}</span>
          <span style={{ marginLeft: "auto", fontSize: 9, color: "rgba(255,255,255,.25)", flexShrink: 0 }}>LIVE ●</span>
        </div>

        {/* CTAs */}
        <div style={{
          display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "4.5rem",
          opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all .8s ease .7s",
        }}>
          <button onClick={() => navigate("/dashboard")}
            style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", border: "none", borderRadius: 14, padding: "15px 36px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 40px rgba(99,102,241,.45)", letterSpacing: ".02em", transition: "all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(99,102,241,.65)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 0 40px rgba(99,102,241,.45)"; }}>
            🛰️ Entrer dans SIGNUM
          </button>
          <button onClick={() => navigate("/simulateur")}
            style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: "15px 36px", color: "rgba(255,255,255,.85)", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.09)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.05)"; e.currentTarget.style.transform = "none"; }}>
            🎮 Simulateur Live
          </button>
          <button onClick={() => document.getElementById("modules")?.scrollIntoView({ behavior: "smooth" })}
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "15px 28px", color: "rgba(255,255,255,.5)", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.25)"; e.currentTarget.style.color = "rgba(255,255,255,.8)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; e.currentTarget.style.color = "rgba(255,255,255,.5)"; }}>
            Découvrir ↓
          </button>
        </div>

        {/* KPI strip */}
        <div id="impact" style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem",
          maxWidth: 820, width: "100%",
          opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all .9s ease .8s",
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.035)", border: `1px solid ${s.color}25`, borderRadius: 14, padding: "1.4rem 1rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: s.color, opacity: .7 }} />
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 900, color: s.color, lineHeight: 1 }}>
                <Counter target={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginTop: 5, lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", animation: "scrollBounce 2.2s infinite" }}>
          <div style={{ width: 22, height: 38, border: "1.5px solid rgba(255,255,255,.15)", borderRadius: 11, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <div style={{ width: 3, height: 7, background: "rgba(255,255,255,.35)", borderRadius: 2, animation: "scrollDot 2.2s infinite" }} />
          </div>
        </div>
      </section>

      {/* ── SECTION : Pourquoi SIGNUM ? ─────────────────────────────────────── */}
      <section style={{ padding: "6rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 14 }}>Souveraineté & Performance</div>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900, marginBottom: 14 }}>SIGNUM dépasse GVG sur tous les critères</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.4)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>Global Voice Group (Luxembourg) facture des royalties perpétuelles et stocke vos données à l'étranger. SIGNUM est souverain, une fois pour toutes.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" }}>
          {[
            { icon: "🛰️", color: "#6366f1", title: "Couverture 100% vs 60-70%", desc: "SIGNUM ingère SS7, Diameter, CDR data, OTT DPI, Mobile Money et SFTP ASN.1. GVG couvre uniquement la signalisation voix SS7 par échantillonnage.", tag: "SIGNUM : 14,1M CDR/jour · GVG : ~8M estimé" },
            { icon: "🇸🇳", color: "#10b981", title: "Données 100% au Sénégal", desc: "DC1 Dakar + DC2 Thiès. Clés HSM exclusives ARTP. Zéro octet hors du territoire sénégalais. Conformité Loi 2018-28 et DPCP garantie.", tag: "GVG : serveurs Luxembourg — violation Loi 2018-28" },
            { icon: "🤖", color: "#a78bfa", title: "IA native vs règles statiques", desc: "5 modèles ML spécialisés (LSTM 97,4% · Transformer 98,7% · XGBoost+GNN · CNN · Isolation Forest). GVG : seuils fixes, aucun apprentissage.", tag: "Détection 40% de fraudes supplémentaires vs GVG" },
            { icon: "💎", color: "#f59e0b", title: "Propriété permanente vs royalties", desc: "Investissement unique 5,1 Mds FCFA — actif ARTP à vie. GVG : 0,015 USD/min royalties = 120+ Mds FCFA sur 10 ans, sans transfert d'actif.", tag: "ROI net 3 ans : +2 134% — 22 FCFA / 1 FCFA investi" },
          ].map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.025)", border: `1px solid ${item.color}25`, borderRadius: 16, padding: "1.75rem", position: "relative", overflow: "hidden", animation: `fadeUp .6s ease ${.1 * i}s both` }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: `linear-gradient(180deg, ${item.color}, ${item.color}44)` }} />
              <div style={{ fontSize: 28, marginBottom: 12, marginLeft: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 8, marginLeft: 8 }}>{item.title}</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.45)", lineHeight: 1.7, marginBottom: 14, marginLeft: 8 }}>{item.desc}</div>
              <div style={{ background: `${item.color}12`, border: `1px solid ${item.color}30`, borderRadius: 6, padding: "5px 10px", display: "inline-flex", marginLeft: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: item.color }}>✅ {item.tag}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Score bar */}
        <div style={{ marginTop: "2.5rem", background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginBottom: 8, fontWeight: 600, letterSpacing: ".08em" }}>SCORE GLOBAL (130 critères)</div>
            <div style={{ display: "flex", gap: "2.5rem", alignItems: "flex-end" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 38, fontWeight: 900, color: "#6366f1", lineHeight: 1 }}>117</div>
                <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 700, marginTop: 4 }}>SIGNUM<br />90%</div>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.25)", paddingBottom: 14, fontWeight: 700 }}>vs</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 38, fontWeight: 900, color: "rgba(255,255,255,.25)", lineHeight: 1 }}>41</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.25)", fontWeight: 700, marginTop: 4 }}>GVG<br />31,5%</div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, maxWidth: 500 }}>
            {[
              { label: "SIGNUM", val: 90, color: "#6366f1" },
              { label: "GVG", val: 31.5, color: "#475569" },
            ].map(row => (
              <div key={row.label} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: row.label === "SIGNUM" ? "#fff" : "rgba(255,255,255,.35)" }}>{row.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: row.color }}>{row.val}%</span>
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,.06)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${row.val}%`, background: row.color, borderRadius: 4, transition: "width 2s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION : 13 Modules ─────────────────────────────────────────────── */}
      <section id="modules" style={{ padding: "6rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#06b6d4", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 14 }}>Architecture opérationnelle</div>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900, marginBottom: 14 }}>13 modules, 1 écosystème souverain</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.4)", maxWidth: 480, margin: "0 auto" }}>De la collecte CDR à la preuve judiciaire, chaque module couvre un maillon essentiel de la régulation télécom nationale.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.85rem" }}>
          {MODULES.map((m, i) => (
            <ModuleCard key={i} {...m} delay={i * 0.05} />
          ))}
          {/* Accueil institutionnel */}
          <ModuleCard icon="🏛️" label="Accueil Institutionnel" desc="Présentation SIGNUM · KPIs live · Timeline" color="#6366f1" path="/accueil" delay={MODULES.length * 0.05} />
        </div>
      </section>

      {/* ── SECTION : Pipeline technique ─────────────────────────────────────── */}
      <section id="pipeline" style={{ padding: "6rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 14 }}>Stack technique</div>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900 }}>Pipeline de données souverain</h2>
        </div>

        {/* Flow */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, flexWrap: "nowrap", overflowX: "auto", padding: "0 1rem" }}>
          {[
            { icon: "📡", label: "Opérateurs", sub: "Orange · Free\nExpresso · Saga", color: "#6366f1" },
            null,
            { icon: "🔌", label: "Collecte CDR", sub: "SS7 · Diameter\nSFTP TLS 1.3", color: "#06b6d4" },
            null,
            { icon: "⚡", label: "Streaming", sub: "Apache Kafka\nFlink RT", color: "#8b5cf6" },
            null,
            { icon: "🗄️", label: "Stockage", sub: "ClickHouse\nPostgreSQL", color: "#10b981" },
            null,
            { icon: "🤖", label: "IA / ML", sub: "LSTM · GNN\nTransformer", color: "#f59e0b" },
            null,
            { icon: "🏛️", label: "ARTP", sub: "Alertes · Dossiers\nRapports · API", color: "#ef4444" },
          ].map((item, i) => {
            if (!item) return <div key={i} style={{ color: "rgba(255,255,255,.2)", fontSize: 18, margin: "0 6px", flexShrink: 0 }}>→</div>;
            return (
              <div key={i} style={{ background: "rgba(255,255,255,.035)", border: `1px solid ${item.color}35`, borderRadius: 14, padding: "1.1rem .95rem", textAlign: "center", minWidth: 108, flexShrink: 0 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,.35)", lineHeight: 1.5, whiteSpace: "pre" }}>{item.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Tech grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginTop: "2.5rem" }}>
          {[
            { tech: "Kafka + Apache Flink", role: "Ingestion streaming CDR temps réel", color: "#6366f1", icon: "⚡" },
            { tech: "ClickHouse + TimescaleDB", role: "Analytics OLAP + séries temporelles", color: "#06b6d4", icon: "🗄️" },
            { tech: "MinIO + PostgreSQL", role: "Objets CDR + données relationnelles", color: "#10b981", icon: "💾" },
            { tech: "Merkle Tree + TSA RFC 3161", role: "Audit immuable + horodatage légal", color: "#8b5cf6", icon: "🔐" },
          ].map((t, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.025)", border: `1px solid ${t.color}25`, borderRadius: 12, padding: "1rem 1.1rem", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: t.color, marginBottom: 4 }}>{t.tech}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", lineHeight: 1.5 }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION : Déploiement 5 phases ───────────────────────────────────── */}
      <section id="deploiement" style={{ padding: "6rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 14 }}>Plan de déploiement</div>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900, marginBottom: 14 }}>36 mois · 5 phases · 4,85 Mds FCFA</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.4)", maxWidth: 480, margin: "0 auto" }}>Un plan structuré avec des retours sur investissement dès le 9e mois, jusqu'à l'export SaaS vers 7 pays de la CEDEAO.</p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          {TIMELINE.map((ph, i) => (
            <div key={i} onClick={() => setActivePhase(i)}
              style={{
                flex: i === activePhase ? 2.2 : 1,
                background: i === activePhase ? `${ph.color}12` : "rgba(255,255,255,.025)",
                border: `1px solid ${i === activePhase ? ph.color + "60" : "rgba(255,255,255,.07)"}`,
                borderRadius: 16, padding: i === activePhase ? "1.5rem" : "1.25rem .9rem",
                cursor: "pointer", transition: "all .35s cubic-bezier(.4,0,.2,1)", overflow: "hidden",
              }}>
              <div style={{ display: "flex", alignItems: i === activePhase ? "center" : "flex-start", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: i === activePhase ? ph.color : `${ph.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, flexShrink: 0, transition: "background .3s" }}>{ph.id}</div>
                <div>
                  <div style={{ fontSize: i === activePhase ? 13 : 11, fontWeight: 700, color: i === activePhase ? "#fff" : "rgba(255,255,255,.55)", transition: "all .3s" }}>{ph.label}</div>
                  <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.3)" }}>{ph.months}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: ph.color, marginBottom: i === activePhase ? 12 : 0 }}>{ph.budget}</div>
              {i === activePhase && (
                <div>
                  {ph.items.map((item, j) => (
                    <div key={j} style={{ fontSize: 11, color: "rgba(255,255,255,.55)", padding: "5px 0", borderTop: j > 0 ? "1px solid rgba(255,255,255,.06)" : "none", display: "flex", gap: 8 }}>
                      <span style={{ color: ph.color, flexShrink: 0 }}>✓</span> {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "2rem" }}>
          {[
            { val: "Mois 9", label: "Premiers retours fiscaux mesurables", color: "#10b981" },
            { val: "30", label: "ingénieurs sénégalais formés en 18 mois", color: "#6366f1" },
            { val: "+2 134%", label: "ROI net sur 3 ans (22 FCFA / 1 FCFA investi)", color: "#f59e0b" },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.025)", border: `1px solid ${s.color}25`, borderRadius: 12, padding: "1.2rem", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color, marginBottom: 6 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", lineHeight: 1.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "6rem 2.5rem", textAlign: "center", position: "relative" }}>
        <FloatingOrb size={500} x="50%" y="0%" color="#6366f1" delay={0} />
        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg, #6366f1, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, margin: "0 auto 2rem", boxShadow: "0 0 50px rgba(99,102,241,.4)" }}>S</div>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, marginBottom: "1rem", lineHeight: 1.2 }}>Prêt pour la démonstration ?</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", marginBottom: "2.5rem", lineHeight: 1.8 }}>
            Accédez au simulateur live, lancez un scénario SIM Box ou AML,<br />et voyez SIGNUM détecter en <strong style={{ color: "#06b6d4" }}>28 secondes</strong> ce que GVG manquerait pendant 47 heures.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/dashboard")}
              style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", border: "none", borderRadius: 14, padding: "15px 40px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 50px rgba(99,102,241,.5)", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 70px rgba(99,102,241,.7)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 0 50px rgba(99,102,241,.5)"; }}>
              🛰️ Entrer dans SIGNUM
            </button>
            <button onClick={() => navigate("/simulateur")}
              style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 14, padding: "15px 32px", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.06)"; e.currentTarget.style.transform = "none"; }}>
              🎮 Simulateur
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,.06)", padding: "2.5rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900 }}>S</div>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#a5b4fc" }}>SIGNUM v1.0 · © 2026 Processingenierie</span>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.2)" }}>Dakar, République du Sénégal · DC1 Dakar · DC2 Thiès · SLA 99,97%</div>
        </div>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,.2)" }}>Loi 2018-28 · ISO 27001 ready · 3GPP TS 32.298 · DPCP conforme</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "livePulse 2s infinite" }} />
            <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>🇸🇳 Souveraineté 100% sénégalaise</span>
          </div>
        </div>
      </footer>

      {/* ── CSS Keyframes ────────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes livePulse { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(16,185,129,.4)} 50%{opacity:.6;box-shadow:0 0 0 6px rgba(16,185,129,0)} }
        @keyframes scrollBounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
        @keyframes scrollDot { 0%{opacity:1;transform:translateY(0)} 70%{opacity:0;transform:translateY(14px)} 100%{opacity:0} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes floatOrb { 0%,100%{transform:translate(-50%,-50%) translateY(0)} 50%{transform:translate(-50%,-50%) translateY(-30px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #1e3a8a; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #6366f1; }
      `}</style>
    </div>
  );
}
