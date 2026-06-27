import type { RoomOffer } from "./ReservationOffer.ts";
import type {
  ReservationSourceValue,
  ReservationStatusValue,
} from "./EnumValue.ts";

export type ReservationDetails = {
  reservationId: number;
  createdAt: string;
  updatedAt: string | null;
  startDate: string;
  endDate: string;
  totalPrice: number;
  reservationStatus: ReservationStatusValue;
  reservationSource: ReservationSourceValue;
  rooms: RoomOffer[];
  comment: string | null;
};
