import { createContext, useContext } from "react";

export interface AuthState {
  sub: string | null;
  userId: string | null;
  roles: string[];
  loading: boolean;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isGuest: boolean;
}

export const AuthContext = createContext<AuthState>({
  sub: null,
  userId: null,
  roles: [],
  loading: true,
  hasRole: () => false,
  isAdmin: false,
  isEmployee: false,
  isGuest: false,
});

export function useAuth() {
  return useContext(AuthContext);
}
