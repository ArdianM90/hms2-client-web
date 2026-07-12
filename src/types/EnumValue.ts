import type { ReservationStatusCode } from "../constants/reservationStatus.ts";
import type { ReservationSourceCode } from "../constants/reservationSource.ts";

export type ReservationStatusValue = {
  code: ReservationStatusCode;
  name: string;
};

export type ReservationSourceValue = {
  code: ReservationSourceCode;
  name: string;
};
