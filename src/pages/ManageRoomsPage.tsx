import {Box, Typography, Button, Card, CardContent, Grid, Stack} from "@mui/material";
import type {Room} from "../types/Room.ts";
import {useNavigate} from "react-router-dom";

const mockRooms: Room[] = [
    {id: 1, roomNumber: "101", capacity: 2, pricePerNight: 250, floor: 1},
    {id: 2, roomNumber: "102", capacity: 3, pricePerNight: 320, floor: 1},
    {id: 3, roomNumber: "201", capacity: 2, pricePerNight: 280, floor: 2},
];

export default function ManageRoomsPage() {
    const navigate = useNavigate();

    return (
        <Box>
            <Stack direction="row" sx={{ justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h4">
                    Zarządzanie pokojami
                </Typography>

                <Button variant="contained" sx={{bgcolor: "#6b1020"}} onClick={() => navigate("/admin/rooms/add")}>
                    Dodaj pokój
                </Button>
            </Stack>

            <Grid container spacing={3}>
                {mockRooms.map((room) => (
                    <Grid size={{ xs: 12, md: 4 }} key={room.id}>
                        <Card
                            sx={{
                                borderLeft: "5px solid #6b1020",
                                "&:hover": {boxShadow: 4},
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6">
                                    Pokój {room.roomNumber}
                                </Typography>

                                <Typography variant="body2">
                                    Osoby: {room.capacity}
                                </Typography>

                                <Typography variant="body2">
                                    Cena: {room.pricePerNight} zł
                                </Typography>

                                <Typography variant="body2">
                                    Piętro: {room.floor}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}