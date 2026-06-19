import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const STATS_SIM = [
  { region: "Dakar", sim_total: 4820000, cnie_ok: 4791000, fausses: 18400, inconnues: 10600 },
  { region: "Thiès", sim_total: 1240000, cnie_ok: 1218000, fausses: 12800, inconnues: 9200 },
  { region: "Saint-Louis", sim_total: 680000, cnie_ok: 664000, fausses: 8200, inconnues: 7800 },
  { region: "Ziguinchor", sim_total: 520000, cnie_ok: 498000, fausses: 14100, inconnues: 7900 },
  { region: "Kaolack", sim_total: 480000, cnie_ok: 465000, fausses: 8900, inconnues: 6100 },
  { region: "Diourbel", sim_total: 390000, cnie_ok: 374000, fausses: 9800, inconnues: 6200 },
];

const ALERTES_KYC = [
  { ref: "KYC-4821", type: "SIM enregistrée sur CNIE expirée (2018)", op: "Free SN", count: 48200, risque: "ÉLEVÉ", action: "Réenregistrement obligatoire" },
  { ref: "KYC-4820", type: "Même CNIE liée à +15 SIM actives", op: "Orange SN", count: 1240, risque: "CRITIQUE", action: "Gel + enquête" },
  { ref: "KYC-4819", type: "CNIE de décédé utilisée pour SIM active", op: "Expresso SN", count: 284, risque: "CRITIQUE", action: "Blocage immédiat" },
  { ref: "KYC-4818", type: "Numéro CNIE invalide (format)", op: "Wave SN", count: 28400, risque: "MOYEN", action: "Mise en conformité 30J" },
  { ref: "KYC-4817", type: "Mineur (<18 ans) avec SIM prépayée non déclarée", op: "Orange SN", count: 8900, risque: "MOYEN", action: "Tuteur légal requis" },
];

const RISQUE: Record<string, string> = {
  "CRITIQUE": "bg-red-500/20 text-red-400 border-red-500/30",
  "ÉLEVÉ": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "MOYEN": "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default function CniePage() {
  const [tab, setTab] = useState<"alertes" | "regions" | "recherche">("alertes");
  const [nin, setNin] = useState("");
  const [result, setResult] = useState<null | { statut: string; nom: string; sim: number; alerte: string }>(null);

  const DEMO: Record<string, { statut: string; nom: string; sim: number; alerte: string }> = {
    "7591234567890": { statut: "CONFORME", nom: "M. Ibrahima D.", sim: 2, alerte: "Aucune anomalie" },
    "7598765432100": { statut: "ALERTE", nom: "INCONNU / CNIE INVALIDE", sim: 18, alerte: "18 SIM sur un même NIN — réseau de fraude probable" },
  };

  function rechercher() {
    const r = DEMO[nin] ?? { statut: "NON TROUVÉ", nom: "—", sim: 0, alerte: "NIN absent de la base CNIE. Essayez : 7591234567890 ou 7598765432100" };
    setResult(r);
  }

  return (
    <div className="p-6 space-y-6 min-h-screen"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0f0a2e 40%, #0a1628 100%)" }}>

      <div>
        <h1 className="text-2xl font-black text-white">Interface CNIE — Vérification SIM KYC</h1>
        <p className="text-white/40 text-sm">Croisement CNIE × Base SIM · Fausses identités · SIM fantômes · Loi 2008-12 SN</p>
      </div>

      <div className="rounded-2xl p-4 border border-red-500/30" style={{ background: "rgba(239,68,68,0.07)" }}>
        <p className="text-xs font-bold text-red-300 mb-1">⚡ L'arme que GVG ne peut JAMAIS avoir</p>
        <p className="text-xs text-white/60">En tant qu'entreprise étrangère, Global Voice Group n'a juridiquement <strong className="text-white">aucun droit d'accès</strong> à la base CNIE (Direction du Casier Judiciaire National). SIGNUM, entreprise sénégalaise partenaire de l'ARTP, opère sous mandat régalien. Cette fonctionnalité est <strong className="text-white">structurellement impossible à reproduire par un concurrent étranger</strong>.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "SIM vérifiées vs CNIE", value: "14.2 M", color: "#6366f1", icon: "🪪" },
          { label: "Fausses identités détectées", value: "72 200", color: "#ef4444", icon: "🚫" },
          { label: "SIM sans identité valide", value: "47 800", color: "#f59e0b", icon: "⚠️" },
          { label: "Blocages effectués (30j)", value: "18 400", color: "#10b981", icon: "🔒" },
        ].map(k => (
          <div key={k.label} className="rounded-2xl p-4 border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
            <span className="text-2xl">{k.icon}</span>
            <p className="text-xl font-black mt-2" style={{ color: k.color }}>{k.value}</p>
            <p className="text-[10px] text-white/40 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["alertes", "regions", "recherche"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === t ? "text-white" : "text-white/40 hover:text-white/70"}`}
            style={tab === t ? { background: "linear-gradient(135deg,rgba(99,102,241,0.4),rgba(6,182,212,0.3))", border: "1px solid rgba(99,102,241,0.5)" } : { border: "1px solid rgba(255,255,255,0.1)" }}>
            {t === "alertes" ? "🚨 Alertes KYC" : t === "regions" ? "🗺️ Par région" : "🔍 Recherche NIN"}
          </button>
        ))}
      </div>

      {tab === "alertes" && (
        <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
          <p className="text-sm font-bold text-white mb-4">Anomalies KYC détectées par croisement CNIE</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                {["Référence", "Type d'anomalie", "Opérateur", "SIM affectées", "Risque", "Action requise"].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-white/40 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALERTES_KYC.map(a => (
                <tr key={a.ref} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-mono text-indigo-300 text-[10px]">{a.ref}</td>
                  <td className="py-3 px-3 font-semibold text-white">{a.type}</td>
                  <td className="py-3 px-3 text-white/60">{a.op}</td>
                  <td className="py-3 px-3 font-bold text-red-400">{a.count.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${RISQUE[a.risque]}`}>{a.risque}</span>
                  </td>
                  <td className="py-3 px-3 text-amber-300 text-[10px]">{a.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "regions" && (
        <div className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
          <p className="text-sm font-bold text-white mb-4">Conformité KYC par région (fausses identités détectées)</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={STATS_SIM}>
              <XAxis dataKey="region" tick={{ fill: "#64748b", fontSize: 10 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }} labelStyle={{ color: "#94a3b8" }} />
              <Bar dataKey="fausses" fill="#ef4444" radius={[4,4,0,0]} name="Fausses identités" />
              <Bar dataKey="inconnues" fill="#f59e0b" radius={[4,4,0,0]} name="Identités inconnues" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === "recherche" && (
        <div className="rounded-2xl p-5 border border-cyan-500/30" style={{ background: "rgba(6,182,212,0.06)" }}>
          <p className="text-sm font-bold text-cyan-300 mb-3">🔍 Recherche par NIN (Numéro d'Identification National)</p>
          <div className="flex gap-3">
            <input value={nin} onChange={e => setNin(e.target.value)}
              placeholder="Saisir le NIN (13 chiffres)..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-500/50 font-mono" />
            <button onClick={rechercher}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)" }}>
              Vérifier
            </button>
          </div>
          {result && (
            <div className="mt-4 p-4 rounded-xl border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-white">{result.nom}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${result.statut === "CONFORME" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : result.statut === "ALERTE" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-slate-500/20 text-slate-400 border-slate-500/30"}`}>
                  {result.statut}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div><p className="text-white/40">SIM actives liées</p><p className="font-bold text-white mt-0.5">{result.sim}</p></div>
                <div><p className="text-white/40">Analyse</p><p className="font-semibold text-amber-300 mt-0.5">{result.alerte}</p></div>
              </div>
              {result.statut === "ALERTE" && (
                <div className="mt-3 flex gap-2">
                  <button className="px-4 py-2 rounded-lg text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">Bloquer toutes les SIM</button>
                  <button className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">Transmettre DPJ</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
