import { Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from "@mui/material";
import type { ReservationOffer } from "../types/ReservationOffer";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";

type Props = {
    offer: ReservationOffer;
    onSelect: (offer: ReservationOffer) => void;
};

export default function ReservationOfferCard({ offer, onSelect }: Props) {
    return (
        <Card sx={{ borderLeft: "4px solid #6b1020", borderRadius: "0 12px 12px 0" }}>
            <CardContent>
                <Stack spacing={2}>
                    {offer.rooms.map((room, index) => (
                        <Box key={index}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                                <HotelOutlinedIcon sx={{ color: "#6b1020", fontSize: 20 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                    Pokój {index + 1}
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
                                    }}
                                />
                            </Stack>

                            {[
                                { label: "Liczba osób", value: room.capacity },
                                { label: "Cena za dobę", value: `${room.pricePerNight} zł` },
                            ].map(({ label, value }) => (
                                <Box key={label} sx={{ display: "flex", justifyContent: "space-between", py: 0.25 }}>
                                    <Typography variant="body2" color="text.secondary">{label}</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{value}</Typography>
                                </Box>
                            ))}

                            {index < offer.rooms.length - 1 && <Divider sx={{ mt: 1.5 }} />}
                        </Box>
                    ))}

                    <Divider />

                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Łączna cena za dobę</Typography>
                            <Typography variant="h6" sx={{ color: "#6b1020", fontWeight: 600 }}>
                                {offer.totalPrice} zł
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            sx={{ bgcolor: "#6b1020", "&:hover": { bgcolor: "#87182b" } }}
                            onClick={() => onSelect(offer)}
                        >
                            Wybierz
                        </Button>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}