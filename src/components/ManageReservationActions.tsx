import { Button, Stack } from "@mui/material";
import { ReservationStatusCode } from "../constants/reservationStatus.ts";
import CheckInModal from "./CheckInModal.tsx";
import { useState } from "react";
import type { ReservationDto } from "../types/Reservation.ts";

type Props = {
  dto: ReservationDto;
  onStatusChange: (reservationId: number, code: ReservationStatusCode) => void;
};

export default function ManageReservationActions({
  dto,
  onStatusChange,
}: Props) {
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const { code } = dto.reservationStatus;

  if (code === ReservationStatusCode.CREATED) {
    return (
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#6b1020",
            "&:hover": { bgcolor: "#87182b" },
          }}
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(dto.reservationId, ReservationStatusCode.CONFIRMED);
          }}
        >
          Potwierdź
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(dto.reservationId, ReservationStatusCode.CANCELLED);
          }}
        >
          Anuluj
        </Button>
      </Stack>
    );
  }
  if (code === ReservationStatusCode.CONFIRMED) {
    return (
      <>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setCheckInModalOpen(true);
          }}
        >
          Zamelduj
        </Button>
        <CheckInModal
          open={checkInModalOpen}
          reservationId={dto.reservationId}
          onClose={() => setCheckInModalOpen(false)}
          onSuccess={() =>
            onStatusChange(dto.reservationId, ReservationStatusCode.CHECKED_IN)
          }
        />
      </>
    );
  }
  if (code === ReservationStatusCode.CHECKED_IN) {
    return (
      <Button
        variant="contained"
        sx={{ bgcolor: "#6b1020" }}
        onClick={() =>
          onStatusChange(dto.reservationId, ReservationStatusCode.CHECKED_OUT)
        }
      >
        Wymelduj
      </Button>
    );
  }
}
