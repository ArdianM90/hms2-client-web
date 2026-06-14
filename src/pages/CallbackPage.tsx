import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userManager } from "../auth/oidcClient.ts";
import { Box, CircularProgress } from "@mui/material";

export default function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    userManager.signinRedirectCallback().then(() => {
      const redirectTo =
        sessionStorage.getItem("redirectAfterLogin") ?? "/dashboard";
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectTo, { replace: true });
    });
  }, [navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress sx={{ color: "#6b1020" }} />
    </Box>
  );
}
