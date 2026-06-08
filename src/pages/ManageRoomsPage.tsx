import {Box, Typography, Button, Grid, Stack, CircularProgress, Alert} from "@mui/material";
import { useEffect, useState } from "react";
import type { Room } from "../types/Room.ts";
import { roomApi } from "../api/roomApi.ts";
import { useNavigate } from "react-router-dom";
import RoomCard from "../components/RoomCard.tsx";

export default function ManageRoomsPage() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        roomApi.getRooms()
            .then(setRooms)
            .catch(() => setError("Nie udało się pobrać listy pokoi."))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await roomApi.deleteRoom(id);
            setRooms(prev => prev.filter(r => r.id !== id));
        } catch {
            setError("Nie udało się usunąć pokoju.");
        }
    };

    return (
        <Box>
            <Stack direction="row" sx={{ justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h4">
                    Zarządzanie pokojami
                </Typography>
                <Button
                    variant="contained"
                    sx={{ bgcolor: "#6b1020" }}
                    onClick={() => navigate("/admin/rooms/add")}
                >
                    Dodaj pokój
                </Button>
            </Stack>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                    <CircularProgress sx={{ color: "#6b1020" }} />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {rooms.map((room) => (
                        <Grid size={{ xs: 12, md: 4 }} key={room.id}>
                            <RoomCard room={room} onDelete={handleDelete} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}