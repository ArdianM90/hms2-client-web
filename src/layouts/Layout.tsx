import { Outlet, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { userManager } from "../auth/oidcClient";

export default function Layout() {
  const logout = async () => {
    const user = await userManager.getUser();
    console.log("id_token:", user?.id_token);
    await userManager.signoutRedirect();
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f6f4f5",
        overflow: "hidden",
      }}
    >
      <AppBar
        position="static"
        sx={{
          bgcolor: "#6b1020",
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            HMS
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={1}>
            <Button component={Link} to="/dashboard" color="inherit">
              Dashboard
            </Button>
            <Button component={Link} to="/admin" color="inherit">
              Administracja
            </Button>
            <Button component={Link} to="/reservation" color="inherit">
              Rezerwacje
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.5)",
              }}
              onClick={logout}
            >
              Wyloguj
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          py: 4,
          px: { xs: 2, md: "auto" },
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: "#1c0a0e",
          color: "rgba(255,255,255,0.7)",
          py: 3,
          mt: 4,
        }}
      >
        <Container maxWidth="lg">
          <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.1)" }} />
          <Stack spacing={0.5} sx={{ alignItems: "flex-start" }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} Adrian Mieńkowski
            </Typography>
            <Typography variant="body2">
              HMS – Hotel Management System
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
