import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FieldAgent {
  id: string;
  name: string;
  badge: string;
  region: string;
  email: string;
  phone: string;
}

interface AuthState {
  agent: FieldAgent | null;
  token: string | null;
  isOnline: boolean;
  setAuth: (agent: FieldAgent, token: string) => void;
  logout: () => void;
  setOnline: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      agent: null,
      token: null,
      isOnline: navigator.onLine,
      setAuth: (agent, token) => set({ agent, token }),
      logout: () => set({ agent: null, token: null }),
      setOnline: (v) => set({ isOnline: v }),
    }),
    { name: "artp-field-auth" }
  )
);
