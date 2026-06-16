import { Button } from "@mui/material";
import type { AdminReservationInfo } from "../types/AdminReservationInfo.ts";
import { ReservationStatusCode } from "../constants/reservationStatus.ts";

type Props = {
  dto: AdminReservationInfo;
  onStatusChange: (reservationId: number, code: ReservationStatusCode) => void;
};

export default function ManageReservationActions({
  dto,
  onStatusChange,
}: Props) {
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
      <Button
        variant="contained"
        sx={{ bgcolor: "#6b1020" }}
        onClick={() =>
          onStatusChange(dto.reservationId, ReservationStatusCode.CHECKED_IN)
        }
      >
        Zamelduj
      </Button>
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
