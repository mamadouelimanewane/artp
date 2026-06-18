import { createContext, useContext, useState, useCallback } from "react";

type Toast = { id: number; message: string; type: "success"|"error"|"info" };
type Ctx = { toast: (msg: string, type?: Toast["type"]) => void };

const ToastCtx = createContext<Ctx>({ toast: () => {} });

let _id = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = ++_id;
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);

  const colors = { success: "bg-emerald-600", error: "bg-red-600", info: "bg-pnir-600" };

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map(t => (
          <div key={t.id} className={`${colors[t.type]} text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium animate-pulse`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
