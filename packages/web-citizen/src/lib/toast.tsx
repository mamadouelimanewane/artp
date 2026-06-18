import React, { createContext, useContext, useState, useCallback } from "react";

type ToastType = "success" | "error" | "info";
interface ToastItem { id: number; message: string; type: ToastType }

const ToastContext = createContext<{
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
}>({ success: () => {}, error: () => {}, info: () => {} });

let counter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const add = useCallback((message: string, type: ToastType) => {
    const id = ++counter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const success = useCallback((msg: string) => add(msg, "success"), [add]);
  const error = useCallback((msg: string) => add(msg, "error"), [add]);
  const info = useCallback((msg: string) => add(msg, "info"), [add]);

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[min(90vw,360px)]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white animate-fade-in ${
              t.type === "success" ? "bg-green-600" :
              t.type === "error" ? "bg-red-600" : "bg-artp-600"
            }`}
          >
            <span className="text-base">
              {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const toast = {
  success: (msg: string) => _emit("success", msg),
  error: (msg: string) => _emit("error", msg),
  info: (msg: string) => _emit("info", msg),
};

// Imperative API that works outside React tree
type Listener = (msg: string, type: ToastType) => void;
let _listener: Listener | null = null;
function _emit(type: ToastType, msg: string) { _listener?.(msg, type); }

export function useToastEmitter() {
  const ctx = useContext(ToastContext);
  React.useEffect(() => {
    _listener = (msg, type) => ctx[type](msg);
    return () => { _listener = null; };
  }, [ctx]);
}
