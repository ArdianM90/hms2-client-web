import type { DictionaryValue } from "./DictionaryValue.ts";

export type RoomOffer = {
  roomId: number;
  standard: DictionaryValue;
  capacity: number;
  pricePerNight: number;
};

export type ReservationOffer = {
  numberOfNights: number;
  totalPrice: number;
  rooms: RoomOffer[];
};
