import { Box, Typography, Button, Card, CardContent, Stack, TextField, Divider } from "@mui/material";
import type {Hotel} from "../../../types/Hotel.ts";

const mockHotel: Hotel = {
    name: "Hotel Royal",
    address: "ul. Krakowska 15",
    city: "Kraków",
    phone: "+48 123 456 789",
    email: "kontakt@hotelroyal.pl",
    description: "Luksusowy hotel w centrum Krakowa z widokiem na Wawel.",
};

export default function ManageHotelPage() {
    return (
        <Box>
            <Stack direction="row" sx={{ justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h4">
                    Zarządzanie hotelem
                </Typography>

                <Button variant="contained" sx={{ bgcolor: "#6b1020" }}>
                    Zapisz zmiany
                </Button>
            </Stack>

            <Card sx={{ borderLeft: "5px solid #6b1020" }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Informacje podstawowe
                    </Typography>

                    <Stack spacing={2}>
                        <TextField
                            label="Nazwa hotelu"
                            defaultValue={mockHotel.name}
                            fullWidth
                        />
                        <TextField
                            label="Adres"
                            defaultValue={mockHotel.address}
                            fullWidth
                        />
                        <TextField
                            label="Miasto"
                            defaultValue={mockHotel.city}
                            fullWidth
                        />
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Kontakt
                    </Typography>

                    <Stack spacing={2}>
                        <TextField
                            label="Telefon"
                            defaultValue={mockHotel.phone}
                            fullWidth
                        />
                        <TextField
                            label="E-mail"
                            defaultValue={mockHotel.email}
                            fullWidth
                        />
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Opis
                    </Typography>

                    <TextField
                        label="Opis hotelu"
                        defaultValue={mockHotel.description}
                        fullWidth
                        multiline
                        rows={4}
                    />
                </CardContent>
            </Card>
        </Box>
    );
}