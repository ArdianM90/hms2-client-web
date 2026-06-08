import {Box, Tabs, Tab, Paper, Typography } from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import HotelIcon from "@mui/icons-material/Hotel";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const currentTab = location.pathname;

    return (
        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
            <Paper
                elevation={2}
                sx={{
                    width: 220,
                    flexShrink: 0,
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                <Typography
                    variant="overline"
                    sx={{
                        display: "block",
                        px: 2,
                        pt: 2,
                        pb: 1,
                        color: "text.secondary",
                        fontWeight: 600,
                        letterSpacing: 1,
                    }}
                >
                    Administracja
                </Typography>

                <Tabs
                    orientation="vertical"
                    value={currentTab}
                    onChange={(_, value) => navigate(value)}
                    sx={{
                        "& .MuiTab-root": {
                            alignItems: "flex-start",
                            textAlign: "left",
                            px: 2,
                            py: 1.5,
                            minHeight: 44,
                            textTransform: "none",
                            fontSize: "0.9rem",
                            color: "text.secondary",
                        },
                        "& .Mui-selected": {
                            color: "#6b1020",
                            fontWeight: 600,
                            bgcolor: "rgba(107,16,32,0.06)",
                        },
                        "& .MuiTabs-indicator": {
                            left: 0,
                            right: "auto",
                            width: 3,
                            bgcolor: "#6b1020",
                            borderRadius: "0 2px 2px 0",
                        },
                    }}
                >
                    <Tab icon={<MeetingRoomIcon fontSize="small" />} iconPosition="start"
                         label="Zarządzanie pokojami" value="/admin/rooms" />
                    <Tab icon={<HotelIcon fontSize="small" />} iconPosition="start"
                        label="Zarządzanie hotelem" value="/admin/hotel" />
                </Tabs>
            </Paper>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Outlet />
            </Box>
        </Box>
    );
}