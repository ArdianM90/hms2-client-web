import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { type AuthState, useAuth } from "../auth/AuthContext.ts";

type Props = {
  allow: (auth: AuthState) => boolean;
};

export default function RoleGuard({ allow }: Props) {
  const auth = useAuth();

  if (auth.loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress sx={{ color: "#6b1020" }} />
      </Box>
    );
  }

  if (!allow(auth)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
