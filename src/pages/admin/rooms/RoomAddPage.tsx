import {Box, Typography, Button, Stack, Alert} from "@mui/material";
import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import type {RoomStandard} from "../../../types/RoomStandard.ts";
import type {RoomCreateRequest} from "../../../types/RoomCreateRequest.ts";
import {roomApi} from "../../../api/roomApi.ts";
import RoomForm, {type RoomFormState} from "../../../components/RoomForm";
import type {AxiosErrorResponse} from "../../../api/apiTypes.ts";

const emptyForm: RoomFormState = {
    roomNumber: "",
    roomStandardCode: "standard",
    capacity: "",
    pricePerNight: "",
    floor: "",
    areaM2: "",
};

export default function RoomAddPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState<RoomFormState>(emptyForm);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [standards, setStandards] = useState<RoomStandard[]>([]);

    useEffect(() => {
        roomApi.getStandards()
            .then(setStandards)
            .catch(() => setError("Nie udało się pobrać standardów pokoi."));
    }, []);

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

            <RoomForm
                form={form}
                standards={standards}
                onChange={(field, value) =>
                    setForm(prev => ({ ...prev, [field]: value }))
                }
            />
        </Box>
    );
}