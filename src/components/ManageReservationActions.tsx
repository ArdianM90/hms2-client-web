import { Button } from "@mui/material";
import type { AdminReservationInfo } from "../types/AdminReservationInfo.ts";
import { ReservationStatusCode } from "../constants/reservationStatus.ts";
import CheckInModal from "./CheckInModal.tsx";
import { useState } from "react";

type Props = {
  dto: AdminReservationInfo;
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
      <Button
        variant="contained"
        sx={{ bgcolor: "#6b1020" }}
        onClick={() =>
          onStatusChange(dto.reservationId, ReservationStatusCode.CONFIRMED)
        }
      >
        Potwierdź
      </Button>
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
