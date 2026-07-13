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
import { useAuth } from "../auth/AuthContext.ts";
import { login, logout } from "../auth/auth.ts";

export default function Layout() {
  const { sub, isAdmin, isEmployee, isGuest } = useAuth();

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
            {isAdmin && (
              <Button component={Link} to="/admin" color="inherit">
                Administracja
              </Button>
            )}
            {isGuest && (
              <Button component={Link} to="/reservation" color="inherit">
                Rezerwacje
              </Button>
            )}
            {isEmployee && (
              <Button component={Link} to="/tasks" color="inherit">
                {isAdmin ? "Zadania pracowników" : "Moje zadania"}
              </Button>
            )}
            {sub ? (
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
            ) : (
              <Button
                variant="contained"
                sx={{
                  bgcolor: "white",
                  color: "#6b1020",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#f3f3f3",
                  },
                }}
                onClick={login}
              >
                Zaloguj
              </Button>
            )}
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
