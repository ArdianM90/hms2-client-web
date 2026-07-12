import { useEffect, useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { userManager } from "./oidcClient.ts";
import { AuthContext } from "./AuthContext.ts";

interface DecodedAccessToken {
  sub: string;
  user_id: string;
  client_id: string;
  roles: string[];
}

function decodeFromAccessToken(accessToken: string | undefined): {
  sub: string | null;
  userId: string | null;
  roles: string[];
} {
  if (!accessToken) {
    return { sub: null, userId: null, roles: [] };
  }
  try {
    const decoded = jwtDecode<DecodedAccessToken>(accessToken);
    return {
      sub: decoded.sub,
      userId: decoded.user_id,
      roles: decoded.roles,
    };
  } catch {
    return { sub: null, userId: null, roles: [] };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    sub: string | null;
    userId: string | null;
    roles: string[];
    loading: boolean;
  }>({
    sub: null,
    userId: null,
    roles: [],
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    userManager.getUser().then((user) => {
      if (!mounted) return;
      setState({
        ...decodeFromAccessToken(user?.access_token),
        loading: false,
      });
    });

    const onUserLoaded = (user: { access_token: string }) => {
      setState({ ...decodeFromAccessToken(user.access_token), loading: false });
    };
    const onUserUnloaded = () => {
      setState({ sub: null, userId: null, roles: [], loading: false });
    };

    userManager.events.addUserLoaded(onUserLoaded);
    userManager.events.addUserUnloaded(onUserUnloaded);

    return () => {
      mounted = false;
      userManager.events.removeUserLoaded(onUserLoaded);
      userManager.events.removeUserUnloaded(onUserUnloaded);
    };
  }, []);

  const hasRole = (role: string) => state.roles.includes(role);
  const isAdmin = hasRole("ROLE_ADMIN");

  return (
    <AuthContext.Provider
      value={{
        ...state,
        hasRole,
        isAdmin,
        isEmployee: isAdmin || hasRole("ROLE_EMPLOYEE"),
        isGuest: isAdmin || hasRole("ROLE_GUEST"),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
