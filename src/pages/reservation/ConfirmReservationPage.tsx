import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import type { ReservationOffer } from "../../types/ReservationOffer.ts";
import ReservationRoomCard from "../../components/ReservationRoomCard.tsx";
import ReservationSummaryCard from "../../components/ReservationSummaryCard.tsx";
import { useState } from "react";

type LocationState = {
  offer: ReservationOffer;
  startDate: string;
  endDate: string;
};

function ExpandMoreIcon() {
  return null;
}

export default function ConfirmReservationPage() {
  const location = useLocation();

  const state = location.state as LocationState | undefined;

  if (!state) {
    return <Alert severity="error">Nie znaleziono danych oferty.</Alert>;
  }

  const { offer, startDate, endDate } = state;
  const [comment, setComment] = useState("");

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Szczegóły rezerwacji
      </Typography>

      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
        <Box sx={{ width: 400, flexShrink: 0 }}>
          <Box
            sx={{
              position: "sticky",
              top: 16,
              mb: 3,
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto",
            }}
          >
            <ReservationSummaryCard
              offer={offer}
              startDate={startDate}
              endDate={endDate}
              comment={comment}
            />
          </Box>

          <Accordion sx={{ borderLeft: "5px solid #6b1020" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                {comment ? "Komentarz" : "Dodaj komentarz"}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <TextField
                fullWidth
                multiline
                minRows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </AccordionDetails>
          </Accordion>
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
