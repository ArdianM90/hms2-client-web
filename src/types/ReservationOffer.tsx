import type { RoomStandard } from "./RoomStandard";

export type RoomOffer = {
    standard: RoomStandard;
    capacity: number;
    pricePerNight: number;
};

export type ReservationOffer = {
    numberOfNights: number;
    totalPrice: number;
    rooms: RoomOffer[];
};