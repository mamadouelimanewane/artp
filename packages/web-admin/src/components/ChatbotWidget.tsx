import { useState, useRef, useEffect } from "react";
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { api } from "../services/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Bonjour ! Je suis l'assistant ARTP. Je peux vous aider sur les plaintes, la qualité réseau et la réglementation télécom au Sénégal.\n\nNanga def ! Mën naa la ndimbal ci télécommunications yi.",
  timestamp: new Date(),
  suggestions: ["Déposer une plainte", "Tester mon réseau", "Contacter l'ARTP", "Signaler une zone blanche"],
};

function fallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("plainte")) {
    return "Pour déposer une plainte, contactez l'ARTP au 800 000 000 (numéro vert gratuit) ou via le formulaire en ligne.";
  }
  if (
    lower.includes("qualité") ||
    lower.includes("qualite") ||
    lower.includes("réseau") ||
    lower.includes("reseau") ||
    lower.includes("débit") ||
    lower.includes("debit")
  ) {
    return "Les seuils minimaux ARTP: débit descendant ≥ 5 Mbps, latence ≤ 100ms. Signalez tout manquement via notre portail.";
  }
  if (lower.includes("opérateur") || lower.includes("operateur")) {
    return "Les opérateurs agréés au Sénégal sont Orange, Free (Saga Africa) et Expresso Télécom.";
  }
  return "Je n'ai pas compris votre question. Appelez le 800 000 000 ou consultez www.artp.sn";
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-artp-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        A
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          <span
            className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chatbot/chat", { message: text, lang: "fr", context: "general" });
      const data = res.data?.data ?? res.data ?? {};
      const responseText = data.reply ?? fallbackResponse(text);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
        suggestions: data.suggestions ?? [],
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fallbackResponse(text),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <>
      {/* Fenetre de chat */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200"
          style={{ width: 380, height: 520 }}
        >
          {/* En-tete */}
          <div className="bg-artp-600 rounded-t-2xl px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">
                  Assistant ARTP
                </p>
                <p className="text-artp-200 text-xs">Français · Wolof</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Zone messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-artp-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    A
                  </div>
                )}
                <div className="max-w-[78%] flex flex-col gap-1.5">
                  <div
                    className={`${
                      msg.role === "user"
                        ? "bg-artp-600 text-white rounded-2xl rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm"
                    } px-3.5 py-2.5`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.role === "user" ? "text-artp-200" : "text-gray-400"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {msg.suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 50); }}
                          className="text-xs bg-white border border-artp-200 text-artp-700 rounded-full px-2.5 py-1 hover:bg-artp-50 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 flex gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question..."
              disabled={loading}
              className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-artp-500 disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-artp-600 hover:bg-artp-700 disabled:opacity-40 text-white rounded-xl px-3 py-2 transition-colors flex-shrink-0"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bouton flottant */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-artp-600 hover:bg-artp-700 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        aria-label="Assistant ARTP"
      >
        {open ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        )}
      </button>
    </>
  );
}
