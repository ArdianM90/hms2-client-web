import type { DictionaryValue } from "./DictionaryValue.ts";
import type { RoomOffer } from "./ReservationOffer.ts";

export type ReservationDto = {
  reservationId: number;
  guestFirstName: string;
  guestLastName: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string | null;
  daysQty: number;
  reservationStatus: DictionaryValue;
  reservationSource: DictionaryValue;
  totalPrice: number;
  roomsQty: number;
};

export type ReservationDetails = {
  reservationId: number;
  createdAt: string;
  updatedAt: string | null;
  startDate: string;
  endDate: string;
  totalPrice: number;
  reservationStatus: DictionaryValue;
  reservationSource: DictionaryValue;
  rooms: RoomOffer[];
  comment: string | null;
};

export type ReservationsFilterParams = {
  query?: string;
  reservationStatusCode?: string;
  createdFrom?: string;
  createdTo?: string;
};
