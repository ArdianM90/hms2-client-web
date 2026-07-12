import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { userManager } from "../auth/oidcClient";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await userManager.signinRedirect();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <Card
        sx={{
          width: 420,
          borderTop: "5px solid #6b1020",
          boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 5, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#6b1020",
              letterSpacing: 1,
              mb: 1,
            }}
          >
            HMS
          </Typography>
          <Typography variant="body2" sx={{ color: "#777", mb: 4 }}>
            Hotel Management System
          </Typography>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Zostałeś wylogowany
          </Typography>
          <Stack spacing={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              sx={{
                bgcolor: "#6b1020",
                py: 1.5,
                fontWeight: 600,
                fontSize: "0.95rem",
                borderRadius: 2,
                "&:hover": { bgcolor: "#87182b" },
              }}
            >
              Zaloguj ponownie
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/dashboard")}
              sx={{
                borderColor: "#6b1020",
                color: "#6b1020",
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#87182b",
                  bgcolor: "rgba(107,16,32,0.04)",
                },
              }}
            >
              Przejdź do dashboardu
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
