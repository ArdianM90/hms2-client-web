import {Alert, Box, Button, CircularProgress, Stack, Typography,} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {RoomStandard} from "../../../types/RoomStandard.ts";
import {roomApi} from "../../../api/roomApi.ts";
import RoomForm, {type RoomFormState} from "../../../components/RoomForm.tsx";

export default function RoomEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [standards, setStandards] = useState<RoomStandard[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<RoomFormState>({
        roomNumber: "",
        roomStandardCode: "",
        capacity: "",
        pricePerNight: "",
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

    const updateField = <K extends keyof RoomFormState>(
        field: K,
        value: RoomFormState[K]
    ) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await roomApi.updateRoom(Number(id), {
                roomNumber: form.roomNumber,
                roomStandardCode: form.roomStandardCode,
                capacity: Number(form.capacity),
                pricePerNight: Number(form.pricePerNight),
                floor: form.floor !== "" ? Number(form.floor) ?? null : null,
                areaM2: form.areaM2 !== "" ? Number(form.areaM2) ?? null : null,
            });
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

            <RoomForm
                form={form}
                standards={standards}
                onChange={updateField}
            />
        </Box>
    );
}