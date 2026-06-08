import {Box, Card, CardContent, Chip, Divider, IconButton, Typography} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import BedroomParentOutlinedIcon from '@mui/icons-material/BedroomParentOutlined';
import type { Room } from "../types/Room.ts";

type Props = {
    room: Room;
    onDelete: (id: number) => void;
};

export default function RoomCard({ room, onDelete }: Props) {
    return (
        <Card
            sx={{
                borderLeft: "4px solid #6b1020",
                borderRadius: "0 12px 12px 0",
                "&:hover": { boxShadow: 4 },
            }}
        >
            <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                            <BedroomParentOutlinedIcon sx={{ color: "#6b1020", fontSize: 22, flexShrink: 0 }} />
                            <Box>
                                <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                                    Pokój nr {room.roomNumber}
                                </Typography>
                                <Chip
                                    label={room.standard.name}
                                    size="small"
                                    sx={{
                                        bgcolor: "rgba(107,16,32,0.08)",
                                        color: "#6b1020",
                                        fontWeight: 500,
                                        height: 20,
                                        fontSize: "0.7rem",
                                        mt: 0.5,
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                    <IconButton
                        size="small"
                        onClick={() => onDelete(room.id)}
                        sx={{
                            color: "#a32d2d",
                            border: "0.5px solid #a32d2d",
                            borderRadius: 1,
                            "&:hover": { bgcolor: "#fcebeb" },
                        }}
                    >
                        <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Divider sx={{ my: 1 }} />

                {[
                    { label: "Liczba osób", value: room.capacity },
                    { label: "Piętro", value: room.floor ?? "—" },
                    { label: "Powierzchnia", value: room.areaM2 ? `${room.areaM2} m²` : "—" },
                ].map(({ label, value }) => (
                    <Box key={label} sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">{label}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{value}</Typography>
                    </Box>
                ))}

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", pt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">Cena za dobę</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#6b1020" }}>
                        {room.pricePerNight} zł
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}