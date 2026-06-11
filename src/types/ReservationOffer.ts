import type { RoomStandard } from "./RoomStandard";

export type RoomOffer = {
    roomId: number;
    standard: RoomStandard;
    capacity: number;
    pricePerNight: number;
};

export type ReservationOffer = {
    numberOfNights: number;
    totalPrice: number;
    rooms: RoomOffer[];
};