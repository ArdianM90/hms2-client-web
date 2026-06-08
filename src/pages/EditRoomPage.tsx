import {Alert, Box, Button, Card, CardContent, CircularProgress, MenuItem, Stack, TextField, Typography,} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {RoomStandard} from "../types/RoomStandard.ts";
import {roomApi} from "../api/roomApi.ts";
import type {RoomUpdateRequest} from "../types/RoomUpdateRequest.ts";

export default function EditRoomPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [standards, setStandards] = useState<RoomStandard[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<RoomUpdateRequest>({
        roomNumber: "",
        roomStandardCode: "",
        capacity: 1,
        pricePerNight: 0,
        floor: null,
        areaM2: null,
    });

    useEffect(() => {
        Promise.all([
            roomApi.getRoom(Number(id)),
            roomApi.getStandards(),
        ])
            .then(([room, standards]) => {
                setStandards(standards);
                setForm({
                    roomNumber: room.roomNumber,
                    roomStandardCode: room.standard.code,
                    capacity: room.capacity,
                    pricePerNight: room.pricePerNight,
                    floor: room.floor,
                    areaM2: room.areaM2,
                });
            })
            .catch(() => setError("Nie udało się pobrać danych pokoju."))
            .finally(() => setLoading(false));
    }, [id]);

    const updateField = <K extends keyof RoomUpdateRequest>(
        field: K,
        value: RoomUpdateRequest[K]
    ) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await roomApi.updateRoom(Number(id), form);
            navigate("/admin/rooms");
        } catch {
            setError("Nie udało się zapisać zmian.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <CircularProgress sx={{ color: "#6b1020" }} />
            </Box>
        );
    }

    return (
        <Box>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4">Edycja pokoju</Typography>
                <Button
                    variant="contained"
                    sx={{ bgcolor: "#6b1020" }}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Zapisywanie..." : "Zapisz zmiany"}
                </Button>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Card sx={{ borderLeft: "5px solid #6b1020" }}>
                <CardContent>
                    <Stack spacing={3}>
                        <TextField
                            label="Numer pokoju"
                            value={form.roomNumber}
                            onChange={(e) => updateField("roomNumber", e.target.value)}
                        />
                        <TextField
                            select
                            label="Standard"
                            value={form.roomStandardCode}
                            onChange={(e) => updateField("roomStandardCode", e.target.value)}
                        >
                            {standards.map((s) => (
                                <MenuItem key={s.code} value={s.code}>{s.name}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Liczba osób"
                            type="number"
                            value={form.capacity}
                            onChange={(e) => updateField("capacity", Number(e.target.value))}
                        />
                        <TextField
                            label="Cena za dobę"
                            type="number"
                            value={form.pricePerNight}
                            onChange={(e) => updateField("pricePerNight", Number(e.target.value))}
                        />
                        <TextField
                            label="Piętro"
                            type="number"
                            value={form.floor ?? ""}
                            onChange={(e) => updateField("floor", e.target.value ? Number(e.target.value) : null)}
                        />
                        <TextField
                            label="Powierzchnia (m²)"
                            type="number"
                            value={form.areaM2 ?? ""}
                            onChange={(e) => updateField("areaM2", e.target.value ? Number(e.target.value) : null)}
                        />
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}