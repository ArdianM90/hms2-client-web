import {
    Box, Typography, Button, Card, CardContent,
    Stack, TextField, MenuItem, Divider, Alert
} from "@mui/material";
import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import type {RoomStandard} from "../types/RoomStandard.ts";
import type {RoomCreateRequest} from "../types/RoomCreateRequest.ts";
import {roomApi} from "../api/roomApi.ts";

type RoomForm = {
    roomNumber: string;
    roomStandardCode: string;
    capacity: number | "";
    pricePerNight: number | "";
    floor: number | "";
    areaM2: number | "";
};

const emptyForm: RoomForm = {
    roomNumber: "",
    roomStandardCode: "standard",
    capacity: "",
    pricePerNight: "",
    floor: "",
    areaM2: "",
};

type AxiosErrorResponse = {
    response?: {
        data?: {
            message?: string;
        };
    };
};

export default function AddRoomPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState<RoomForm>(emptyForm);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [standards, setStandards] = useState<RoomStandard[]>([]);

    useEffect(() => {
        roomApi.getStandards()
            .then(setStandards)
            .catch(() => setError("Nie udało się pobrać standardów pokoi."));
    }, []);

    const handleChange = (field: keyof RoomForm) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm(prev => ({ ...prev, [field]: e.target.value }));
        };

    const handleSubmit = async () => {
        setError(null);

        if (!form.roomNumber || !form.roomStandardCode || !form.capacity || !form.pricePerNight) {
            setError("Wypełnij wszystkie wymagane pola.");
            return;
        }

        setLoading(true);
        const request: RoomCreateRequest = {
            roomNumber: form.roomNumber,
            roomStandardCode: form.roomStandardCode,
            capacity: Number(form.capacity),
            pricePerNight: Number(form.pricePerNight),
            floor: form.floor !== "" ? Number(form.floor) : null,
            areaM2: form.areaM2 !== "" ? Number(form.areaM2) : null,
        };
        try {
            await roomApi.createRoom(request);
            navigate("/admin/rooms");
        } catch (e: unknown) {
            const axiosError = e as AxiosErrorResponse;
            setError(axiosError?.response?.data?.message ?? "Wystąpił błąd podczas dodawania pokoju.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Stack direction="row" sx={{ justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h4">
                    Dodaj pokój
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        sx={{ borderColor: "#6b1020", color: "#6b1020" }}
                        onClick={() => navigate("/admin/rooms")}
                    >
                        Anuluj
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: "#6b1020", "&:hover": { bgcolor: "#87182b" } }}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Zapisywanie..." : "Zapisz pokój"}
                    </Button>
                </Stack>
            </Stack>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Card sx={{ borderLeft: "5px solid #6b1020" }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Podstawowe informacje
                    </Typography>

                    <Stack spacing={2}>
                        <TextField
                            label="Numer pokoju *"
                            value={form.roomNumber}
                            onChange={handleChange("roomNumber")}
                            fullWidth
                        />
                        <TextField
                            label="Standard pokoju *"
                            value={form.roomStandardCode}
                            onChange={handleChange("roomStandardCode")}
                            select
                            fullWidth
                        >
                            {standards.map(s => (
                                <MenuItem key={s.code} value={s.code}>
                                    {s.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Liczba osób *"
                            type="number"
                            value={form.capacity}
                            onChange={handleChange("capacity")}
                            fullWidth
                            slotProps={{ htmlInput: { min: 1 } }}
                        />
                        <TextField
                            label="Cena za noc (zł) *"
                            type="number"
                            value={form.pricePerNight}
                            onChange={handleChange("pricePerNight")}
                            fullWidth
                            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                        />
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Szczegóły
                    </Typography>

                    <Stack spacing={2}>
                        <TextField
                            label="Piętro"
                            type="number"
                            value={form.floor}
                            onChange={handleChange("floor")}
                            fullWidth
                            slotProps={{ htmlInput: { min: 0 } }}
                        />
                        <TextField
                            label="Powierzchnia (m²)"
                            type="number"
                            value={form.areaM2}
                            onChange={handleChange("areaM2")}
                            fullWidth
                            slotProps={{ htmlInput: { min: 1 } }}
                        />
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}