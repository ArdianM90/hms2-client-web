export type MakeReservationRequest = {
    roomIds: number[];
    dateStart: string;
    dateEnd: string;
    totalPrice: number;
    comment?: string;
};