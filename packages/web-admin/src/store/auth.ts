import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  id: string;
  phone: string;
  name?: string;
  role: "citizen" | "agent_artp" | "admin" | "operator";
  region: string;
  operator?: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "artp-auth" }
  )
);
