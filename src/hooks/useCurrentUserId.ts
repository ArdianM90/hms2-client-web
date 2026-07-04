import { useEffect, useState } from "react";
import { getUser } from "../auth/auth.ts";
import { jwtDecode } from "jwt-decode";

type AccessTokenClaims = {
  user_id?: string;
};

export function useCurrentUserId(): string | null {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getUser().then((user) => {
      if (!user?.access_token) {
        if (active) setUserId(null);
        return;
      }
      try {
        const claims = jwtDecode<AccessTokenClaims>(user.access_token);
        if (active) setUserId(claims.user_id ?? null);
      } catch {
        if (active) setUserId(null);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return userId;
}
