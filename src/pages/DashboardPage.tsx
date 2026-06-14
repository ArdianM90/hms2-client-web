import { User } from "oidc-client-ts";
import { useEffect, useState } from "react";
import { getUser } from "../auth/auth";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUser().then((u) => setUser(u));
  }, []);

  return <div>Witaj {user?.profile?.sub}!</div>;
}
