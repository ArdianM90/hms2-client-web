import { useEffect, useState } from "react";
import { isAuthenticated } from "../auth/auth";

interface Props {
  children: React.ReactNode;
}

export default function PublicOnlyRoute({ children }: Props) {
  const [checked, setChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    isAuthenticated().then((auth) => {
      setAuthenticated(auth);
      setChecked(true);
      if (auth) {
        window.location.href = "/dashboard";
      }
    });
  }, []);

  if (!checked) {
    return <div>Ładowanie...</div>;
  }
  if (authenticated) {
    return null;
  }
  return <>{children}</>;
}
