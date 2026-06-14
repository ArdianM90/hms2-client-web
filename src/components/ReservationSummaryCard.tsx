import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import type { ReservationOffer } from "../types/ReservationOffer.ts";
import { useNavigate } from "react-router-dom";
import type { MakeReservationRequest } from "../types/MakeReservationRequest.ts";
import { reservationApi } from "../api/reservationApi.ts";
import InfoBox from "./InfoBox.tsx";

type Props = {
  offer: ReservationOffer;
  startDate: string;
  endDate: string;
  comment: string;
};

export default function ReservationSummaryCard({
  offer,
  startDate,
  endDate,
  comment,
}: Props) {
  const navigate = useNavigate();

  const handleReservation = async () => {
    const request: MakeReservationRequest = {
      roomIds: offer.rooms.map((r) => r.roomId),
      dateStart: startDate,
      dateEnd: endDate,
      totalPrice: offer.totalPrice,
      comment: comment || null,
    };
    await reservationApi.makeReservation(request);
    navigate("/reservation/my");
  };

  return (
    <Card sx={{ borderLeft: "5px solid #6b1020" }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Szczegóły pobytu
        </Typography>
        <Stack spacing={1}>
          <InfoBox label="Data pobytu" value={`${startDate} - ${endDate}`} />
          <InfoBox label="Liczba dób hotelowych" value={offer.numberOfNights} />
          <InfoBox label="Liczba pokoi" value={offer.rooms.length} />
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Typography variant="body2" color="text.secondary">
          Cena całkowita
        </Typography>
        <Typography
          variant="h3"
          sx={{
            color: "#6b1020",
            fontWeight: 700,
            mb: 3,
          }}
        >
          {offer.totalPrice} zł
        </Typography>
        <Stack spacing={1}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#6b1020",
              "&:hover": {
                bgcolor: "#87182b",
              },
            }}
            onClick={() => handleReservation()}
          >
            Zarezerwuj
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate(-1)}
            sx={{
              borderColor: "#6b1020",
              color: "#6b1020",
            }}
          >
            Powrót
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
