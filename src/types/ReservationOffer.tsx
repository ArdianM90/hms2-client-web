import type { RoomStandard } from "./RoomStandard";

export type RoomOffer = {
    standard: RoomStandard;
    capacity: number;
    pricePerNight: number;
};

export type ReservationOffer = {
    totalPrice: number;
    rooms: RoomOffer[];
};