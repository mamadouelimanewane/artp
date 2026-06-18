import { useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Quelles sont les obligations de couverture des opérateurs au Sénégal ?",
  "Comment calculer les sanctions pour non-conformité QoS ?",
  "Quelle est la procédure d'instruction des plaintes ARTP ?",
  "Résume les dispositions du Code des télécommunications sur les tarifs",
];

const KNOWLEDGE_BASE = [
  { title: "Code des télécommunications 2011", articles: 124 },
  { title: "Décisions ARTP 2020–2026", articles: 247 },
  { title: "Directives CEDEAO/UA", articles: 38 },
  { title: "Jurisprudence comparative", articles: 89 },
];

function mockResponse(question: string): string {
  if (question.toLowerCase().includes("couverture")) {
    return `**Obligations de couverture des opérateurs au Sénégal**

Selon le Code des télécommunications et les décisions ARTP :

**1. Obligations légales**
- Couverture nationale minimale de 90% de la population pour les opérateurs mobiles de 1ère catégorie
- Couverture des chefs-lieux de région à 100% dans les 24 mois suivant l'attribution de licence

**2. Obligations de service universel**
- Les zones rurales et zones blanches font l'objet d'un programme national (FONSIS)
- Contribution des opérateurs au Fonds de Service Universel : 2% du chiffre d'affaires annuel

**3. Sanctions en cas de non-conformité**
- Mise en demeure avec délai de 3 mois pour mise en conformité
- Amende pouvant aller jusqu'à 5% du CA annuel (art. 78 Code télécom)
- Suspension de licence dans les cas les plus graves

*Source : Code des télécommunications sénégalais, Décision ARTP n°2024-012*`;
  }
  if (question.toLowerCase().includes("plainte") || question.toLowerCase().includes("instruction")) {
    return `**Procédure d'instruction des plaintes ARTP**

**Étape 1 — Recevabilité (5 jours ouvrés)**
- Vérification de la qualité du plaignant et de la compétence de l'ARTP
- Accusé de réception obligatoire

**Étape 2 — Instruction contradictoire (30 jours)**
- Notification à l'opérateur mis en cause
- Délai de réponse : 15 jours ouvrés
- Possibilité de demander des pièces complémentaires

**Étape 3 — Décision**
- Décision motivée notifiée aux deux parties
- Voies de recours : Comité de Règlement des Différends (15 jours) puis Tribunal Administratif

*Source : Règlement intérieur ARTP, art. 23-31*`;
  }
  return `Je suis l'Assistant Juridique IA PNIR, spécialisé dans le droit des télécommunications sénégalais.

Je peux vous aider sur :
- **Réglementation nationale** : Code des télécommunications, décisions ARTP
- **Droit régional** : Directives CEDEAO, cadre UA
- **Jurisprudence** : Décisions comparatives (ARCEP, ARTCI, ANRT)
- **Procédures** : Instruction plaintes, sanctions, recours

Posez votre question ou sélectionnez une suggestion ci-dessous.`;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: mockResponse("") }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages(p => [...p, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages(p => [...p, { role: "assistant", content: mockResponse(text) }]);
      setLoading(false);
    }, 800);
  }

  return (
    <div className="p-6 h-screen flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Assistant Juridique IA</h1>
        <p className="text-slate-500 text-sm">LLM spécialisé — Droit des télécommunications sénégalais</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
        {/* Base de connaissances */}
        <div className="card p-4 h-fit">
          <h2 className="font-semibold text-slate-700 text-sm mb-3">Base de connaissances</h2>
          <div className="space-y-2">
            {KNOWLEDGE_BASE.map(kb => (
              <div key={kb.title} className="p-2 bg-slate-50 rounded-lg">
                <p className="text-xs font-medium text-slate-700">{kb.title}</p>
                <p className="text-[10px] text-slate-400">{kb.articles} textes indexés</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="lg:col-span-3 card flex flex-col min-h-0" style={{ height: "calc(100vh - 220px)" }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
                <div className={`max-w-xl px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                  ${m.role==="user"
                    ? "bg-pnir-600 text-white rounded-br-sm"
                    : "bg-slate-100 text-slate-800 rounded-bl-sm"}`}
                  dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g,"<br/>") }}
                />
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-2 h-2 bg-pnir-400 rounded-full animate-bounce" style={{ animationDelay: `${i*150}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => send(s)}
                className="text-[11px] px-2.5 py-1 bg-pnir-50 text-pnir-700 border border-pnir-200 rounded-full hover:bg-pnir-100 transition-colors">
                {s.length > 50 ? s.slice(0,50)+"…" : s}
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 flex gap-2">
            <input
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pnir-400"
              placeholder="Posez votre question juridique…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send(input)}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="px-4 py-2.5 bg-pnir-600 text-white rounded-xl text-sm font-semibold hover:bg-pnir-700 disabled:opacity-50 transition-colors"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
