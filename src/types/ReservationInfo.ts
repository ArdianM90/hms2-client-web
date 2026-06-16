import type {
  ReservationSourceValue,
  ReservationStatusValue,
} from "./EnumValue.ts";

export type ReservationInfo = {
  reservationId: number;
  createdAt: string;
  updatedAt: string | null;
  startDate: string;
  endDate: string;
  daysQty: number;
  reservationStatus: ReservationStatusValue;
  reservationSource: ReservationSourceValue;
  totalPrice: number;
  roomsQty: number;
};
