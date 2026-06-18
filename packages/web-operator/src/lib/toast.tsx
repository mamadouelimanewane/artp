import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

type ToastType = "success" | "error" | "info";
interface ToastItem { id: number; message: string; type: ToastType }

const Ctx = createContext<{ success:(m:string)=>void; error:(m:string)=>void; info:(m:string)=>void }>
  ({ success:()=>{}, error:()=>{}, info:()=>{} });

let _counter = 0;
let _listener: ((m:string, t:ToastType)=>void) | null = null;

export const toast = {
  success: (m: string) => _listener?.(m, "success"),
  error:   (m: string) => _listener?.(m, "error"),
  info:    (m: string) => _listener?.(m, "info"),
};

export function useToastEmitter() {
  const ctx = useContext(Ctx);
  React.useEffect(() => {
    _listener = (m, t) => ctx[t](m);
    return () => { _listener = null; };
  }, [ctx]);
}

const ICONS = { success: CheckCircleIcon, error: XCircleIcon, info: InformationCircleIcon };
const COLORS = {
  success: "bg-white border-l-4 border-green-500 text-green-800",
  error:   "bg-white border-l-4 border-red-500 text-red-800",
  info:    "bg-white border-l-4 border-blue-500 text-blue-800",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const add = useCallback((message: string, type: ToastType) => {
    const id = ++_counter;
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  const success = useCallback((m: string) => add(m, "success"), [add]);
  const error   = useCallback((m: string) => add(m, "error"),   [add]);
  const info    = useCallback((m: string) => add(m, "info"),    [add]);
  const remove  = (id: number) => setToasts(p => p.filter(t => t.id !== id));

  return (
    <Ctx.Provider value={{ success, error, info }}>
      {children}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 w-80">
        {toasts.map(t => {
          const Icon = ICONS[t.type];
          return (
            <div key={t.id} className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg ${COLORS[t.type]} animate-slide-in`}>
              <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="flex-1 text-sm font-medium">{t.message}</p>
              <button onClick={() => remove(t.id)} className="flex-shrink-0 opacity-50 hover:opacity-100">
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}
