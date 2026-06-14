import type { ReservationInfo } from "./ReservationInfo.ts";

export type AdminReservationInfo = ReservationInfo & {
  guestFirstName: string;
  guestLastName: string;
};
