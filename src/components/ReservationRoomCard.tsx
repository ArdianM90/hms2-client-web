import {Box, Card, CardContent, Chip, Stack, Typography} from "@mui/material";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import type {RoomOffer} from "../types/ReservationOffer.ts";

type Props = {
    room: RoomOffer;
    roomNumber: number;
};

export function ReservationRoomCard({ room, roomNumber }: Props) {
    return (<Card sx={{borderLeft: "4px solid #6b1020"}}>
        <CardContent>
            <Stack direction="row" spacing={1} sx={{alignItems: "center", mb: 2}}>
                <HotelOutlinedIcon sx={{color: "#6b1020"}}/>
                <Typography variant="h6">
                    Pokój {roomNumber}
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
            <Info label="Standard" value={room.standard.name}/>
            <Info label="Liczba osób" value={room.capacity}/>
            <Info label="Cena za dobę" value={`${room.pricePerNight} zł`}/>
        </CardContent>
    </Card>)
}

function Info({
                  label,
                  value,
              }: {
    label: string;
    value: string | number;
}) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                py: 0.5,
            }}
        >
            <Typography color="text.secondary">
                {label}
            </Typography>

            <Typography sx={{fontWeight: 500}}>
                {value}
            </Typography>
        </Box>
    );
}