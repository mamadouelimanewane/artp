import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OpUser {
  id: string;
  name: string;
  email?: string;
  role: string;
  operator: string; // orange | free | expresso
}

interface AuthState {
  token: string | null;
  user: OpUser | null;
  setAuth: (token: string, user: OpUser) => void;
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
    { name: "artp-operator-auth" }
  )
);
