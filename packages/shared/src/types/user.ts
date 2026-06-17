export type UserRole = "citizen" | "agent_artp" | "admin" | "operator";

export type Region =
  | "dakar" | "thies" | "saint_louis" | "ziguinchor"
  | "tambacounda" | "kaolack" | "louga" | "fatick"
  | "kolda" | "matam" | "kaffrine" | "kedougou" | "sedhiou";

export interface User {
  id: string;
  phone: string;
  email?: string;
  name?: string;
  role: UserRole;
  region: Region;
  operator?: OperatorSlug;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OperatorSlug = "orange" | "free" | "expresso";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  phone: string;
  otp: string;
}

export interface RegisterRequest {
  phone: string;
  name?: string;
  region: Region;
  operator?: OperatorSlug;
}
