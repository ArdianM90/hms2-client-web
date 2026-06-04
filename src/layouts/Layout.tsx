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
    const stackProps = {
        direction: "row" as const,
        justifyContent: "space-between" as const,
        flexWrap: "wrap" as const,
        gap: 2,
    };

    const logout = async () => {
        await userManager.signoutRedirect();
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#f6f4f5",
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
                        <Button color="inherit" component={Link} to="/">
                            Dashboard
                        </Button>
                        <Button color="inherit" component={Link} to="/reservations">
                            Rezerwacje
                        </Button>
                        <Button color="inherit" component={Link} to="/rooms">
                            Pokoje
                        </Button>
                        <Button color="inherit" component={Link} to="/admin">
                            Admin
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

            <Container
                maxWidth="lg"
                sx={{
                    flex: 1,
                    py: 4,
                }}
            >
                <Outlet />
            </Container>

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

                    <Stack spacing={1} {...stackProps}>
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