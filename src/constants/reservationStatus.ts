export const ReservationStatusCode = {
  CREATED: "created",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  CHECKED_IN: "checked_in",
  CHECKED_OUT: "checked_out",
  NO_SHOW: "no_show",
} as const;

export const RESERVATION_STATUS_LABELS: Record<ReservationStatusCode, string> =
  {
    [ReservationStatusCode.CREATED]: "Utworzona",
    [ReservationStatusCode.CONFIRMED]: "Potwierdzona",
    [ReservationStatusCode.CANCELLED]: "Anulowana",
    [ReservationStatusCode.CHECKED_IN]: "Zameldowany",
    [ReservationStatusCode.CHECKED_OUT]: "Wymeldowany",
    [ReservationStatusCode.NO_SHOW]: "Nie pojawił się",
  };

export type ReservationStatusCode =
  (typeof ReservationStatusCode)[keyof typeof ReservationStatusCode];

export const getStatusLabel = (code: ReservationStatusCode): string =>
  RESERVATION_STATUS_LABELS[code];
