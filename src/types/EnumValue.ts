import type { ReservationStatusCode } from "../constants/reservationStatus.ts";
import type { ReservationSourceCode } from "../constants/reservationSource.ts";

export type ReservationStatusValue = {
  code: ReservationStatusCode;
  label: string;
};

export type ReservationSourceValue = {
  code: ReservationSourceCode;
  label: string;
};
