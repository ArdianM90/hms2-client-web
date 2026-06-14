import type { EnumValue } from "./EnumValue.ts";

export type ReservationInfo = {
  reservationId: number;
  createdAt: string;
  updatedAt: string | null;
  startDate: string;
  endDate: string;
  daysQty: number;
  reservationStatus: EnumValue;
  reservationSource: EnumValue;
  totalPrice: number;
  roomsQty: number;
};
