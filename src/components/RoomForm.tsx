import {Card, CardContent, Stack, TextField, MenuItem, Divider, Typography} from "@mui/material";

export type RoomFormState = {
    roomNumber: string;
    roomStandardCode: string;
    capacity: number | "";
    pricePerNight: number | "";
    floor: number | null | "";
    areaM2: number | null | "";
};

type Props = {
    form: RoomFormState;
    standards: { code: string; name: string }[];
    onChange: <K extends keyof RoomFormState>(field: K, value: RoomFormState[K]) => void;
};

export default function RoomForm({ form, standards, onChange }: Props) {
    return (
        <Card sx={{ borderLeft: "5px solid #6b1020" }}>
            <CardContent>

                <Typography variant="h6" sx={{ mb: 2 }}>
                    Podstawowe informacje
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Numer pokoju *"
                        value={form.roomNumber}
                        onChange={(e) => onChange("roomNumber", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        select
                        label="Standard *"
                        value={form.roomStandardCode}
                        onChange={(e) => onChange("roomStandardCode", e.target.value)}
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
                        onChange={(e) => onChange("capacity", e.target.value === "" ? "" : Number(e.target.value))}
                        fullWidth
                    />

                    <TextField
                        label="Cena za noc *"
                        type="number"
                        value={form.pricePerNight}
                        onChange={(e) => onChange("pricePerNight", e.target.value === "" ? "" : Number(e.target.value))}
                        fullWidth
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
                        value={form.floor ?? ""}
                        onChange={(e) =>
                            onChange("floor", e.target.value ? Number(e.target.value) : null)
                        }
                        fullWidth
                    />

                    <TextField
                        label="Powierzchnia (m²)"
                        type="number"
                        value={form.areaM2 ?? ""}
                        onChange={(e) =>
                            onChange("areaM2", e.target.value ? Number(e.target.value) : null)
                        }
                        fullWidth
                    />
                </Stack>

            </CardContent>
        </Card>
    );
}