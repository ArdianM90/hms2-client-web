import type { RoomOffer } from "./ReservationOffer.ts";
import type { EnumValue } from "./EnumValue.ts";

export type ReservationDetails = {
  reservationId: number;
  createdAt: string;
  updatedAt: string | null;
  startDate: string;
  endDate: string;
  totalPrice: number;
  reservationStatus: EnumValue;
  reservationSource: EnumValue;
  rooms: RoomOffer[];
  comment: string | null;
};
