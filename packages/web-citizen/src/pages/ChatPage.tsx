import { useState, useRef, useEffect } from "react";
import { api } from "../services/api";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import { PaperAirplaneIcon, LanguageIcon } from "@heroicons/react/24/solid";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  suggestions?: string[];
}

const WELCOME: Message = {
  id: "0",
  role: "bot",
  content: "Bonjour ! Je suis l'assistant de l'ARTP. Posez-moi vos questions sur le réseau, les plaintes ou vos droits.\n\nNanga def ! Mën naa la ndimbal ci télécommunications yi.",
  suggestions: ["Déposer une plainte", "Tester mon réseau", "Contacter l'ARTP", "Mes droits"],
};

function fallback(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("plainte")) return "Pour déposer une plainte, allez dans l'onglet 'Plaintes' et appuyez sur 'Nouvelle'. L'ARTP traitera votre dossier en 15 jours ouvrables.";
  if (m.includes("réseau") || m.includes("débit") || m.includes("internet")) return "Seuils minimaux ARTP : débit ≥ 5 Mbps, latence ≤ 100 ms. Faites un test dans l'onglet 'Test réseau'.";
  if (m.includes("contact") || m.includes("artp") || m.includes("joindre")) return "ARTP : Tél. (+221) 33 849 08 08 • Email : contact@artp.sn • Km 5 Boulevard du Centenaire, Dakar.";
  if (m.includes("délai") || m.includes("temps")) return "Délais ARTP : accusé immédiat, examen 48h, transmission 5 jours, résolution max 15 jours ouvrables.";
  return "Je n'ai pas compris. Essayez : 'Comment déposer une plainte ?' ou 'Quels sont mes droits ?'";
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"fr" | "wo">("fr");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 96) + "px";
  }

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: msg };
    setMessages((p) => [...p, userMsg]);
    setLoading(true);

    try {
      const res = await api.post("/chatbot/chat", { message: msg, lang, context: "general" });
      const d = res.data?.data ?? res.data ?? {};
      setMessages((p) => [...p, {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: d.reply ?? fallback(msg),
        suggestions: d.suggestions ?? [],
      }]);
    } catch {
      setMessages((p) => [...p, {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: fallback(msg),
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-chat">
      <TopBar
        title="Assistant ARTP"
        subtitle="Aide & informations"
        right={
          <button
            onClick={() => setLang((l) => l === "fr" ? "wo" : "fr")}
            className="flex items-center gap-1.5 text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full"
          >
            <LanguageIcon className="h-3.5 w-3.5" />
            {lang === "fr" ? "FR" : "WO"}
          </button>
        }
      />

      {/* Messages — scrollable */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4 max-w-lg mx-auto w-full">
        {messages.map((msg) => (
          <div key={msg.id} className="animate-slide-up">
            <div className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {msg.role === "bot" && (
                <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-artp-600 to-violet-600 flex items-center justify-center flex-shrink-0 mb-0.5 shadow-sm">
                  <span className="text-white text-xs font-extrabold">A</span>
                </div>
              )}
              <div className={`max-w-[80%] px-4 py-3 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-artp-600 to-violet-600 text-white rounded-br-lg shadow-md shadow-artp-200"
                  : "bg-white text-gray-800 rounded-bl-lg shadow-sm border border-gray-100"
              }`}>
                {msg.content}
              </div>
            </div>
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2.5 pl-10">
                {msg.suggestions.map((s) => (
                  <button key={s} onClick={() => send(s)}
                    className="text-xs bg-violet-50 border border-violet-200 text-violet-700 rounded-full px-3 py-1.5 font-semibold active:scale-95 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-artp-600 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white text-xs font-extrabold">A</span>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl rounded-bl-lg px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-4">
                {[0,150,300].map((d) => (
                  <span key={d} className="w-2 h-2 rounded-full bg-artp-300 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-2" />
      </div>

      {/* Barre de saisie — collée au bas, au-dessus de la BottomNav */}
      <div
        className="bg-white border-t border-gray-100 px-4 py-3 max-w-lg mx-auto w-full"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(); }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={lang === "fr" ? "Posez votre question..." : "Def sa laaj..."}
            rows={1}
            disabled={loading}
            className="flex-1 bg-gray-50 border-2 border-gray-100 focus:border-artp-400 focus:bg-white rounded-2xl px-4 py-2.5 text-sm resize-none focus:outline-none disabled:opacity-50 transition-all font-medium placeholder-gray-300"
            style={{ maxHeight: "96px" }}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-artp-600 to-violet-600 disabled:opacity-30 text-white flex items-center justify-center flex-shrink-0 transition-all active:scale-90 shadow-md shadow-artp-200"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
