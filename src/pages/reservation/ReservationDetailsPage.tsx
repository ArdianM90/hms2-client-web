import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { reservationApi } from "../../api/reservationApi";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { formatDateTime } from "../../helpers/Formatter.ts";
import type { ReservationDetails } from "../../types/ReservationDetails.ts";
import InfoBox from "../../components/InfoBox.tsx";
import ReservationRoomCard from "../../components/ReservationRoomCard.tsx";

export default function ReservationDetailsPage() {
  const { reservationId } = useParams();

  const [reservation, setReservation] = useState<ReservationDetails | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reservationId) {
      return;
    }

    reservationApi
      .getReservation(Number(reservationId))
      .then(setReservation)
      .catch(() => setError("Nie udało się pobrać szczegółów rezerwacji"))
      .finally(() => setLoading(false));
  }, [reservationId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress sx={{ color: "#6b1020" }} />
      </Box>
    );
  }

  if (error || !reservation) {
    return (
      <Alert severity="error">{error ?? "Nie znaleziono rezerwacji"}</Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Rezerwacja #{reservation.reservationId}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            width: 400,
            flexShrink: 0,
            position: "sticky",
            top: 16,
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
          }}
        >
          <Card sx={{ borderLeft: "5px solid #6b1020" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Szczegóły pobytu
              </Typography>

              <InfoBox
                label="Numer rezerwacji"
                value={reservation.reservationId}
              />
              <InfoBox
                label="Status"
                value={reservation.reservationStatus.label}
              />
              <InfoBox
                label="Źródło"
                value={reservation.reservationSource.label}
              />
              <InfoBox
                label="Pobyt"
                value={`od ${reservation.startDate} do ${reservation.endDate}`}
              />
              <InfoBox
                label="Data utworzenia"
                value={formatDateTime(reservation.createdAt)}
              />
              <InfoBox
                label="Ostatnia aktualizacja"
                value={formatDateTime(reservation.updatedAt)}
              />

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="h5"
                sx={{
                  color: "#6b1020",
                  fontWeight: 700,
                }}
              >
                {reservation.totalPrice} zł
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Cena całkowita
              </Typography>

              {reservation.comment && (
                <>
                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Komentarz
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {reservation.comment}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Zarezerwowane pokoje
          </Typography>

          <Stack spacing={2}>
            {reservation.rooms.map((room, index) => (
              <ReservationRoomCard
                key={index}
                room={room}
                roomNumber={index + 1}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
