import { Alert, Box, Stack, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import type { ReservationOffer } from "../../types/ReservationOffer.ts";
import ReservationRoomCard from "../../components/ReservationRoomCard.tsx";
import ReservationSummaryCard from "../../components/ReservationSummaryCard.tsx";

type LocationState = {
  offer: ReservationOffer;
  startDate: string;
  endDate: string;
};

export default function ConfirmReservationPage() {
  const location = useLocation();

  const state = location.state as LocationState | undefined;

  if (!state) {
    return <Alert severity="error">Nie znaleziono danych oferty.</Alert>;
  }

  const { offer, startDate, endDate } = state;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Szczegóły rezerwacji
      </Typography>

      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
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
          <ReservationSummaryCard
            offer={offer}
            startDate={startDate}
            endDate={endDate}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Wybrane pokoje
          </Typography>
          <Stack spacing={2}>
            {offer.rooms.map((room, index) => (
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
