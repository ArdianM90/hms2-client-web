type EnumValue = {
    code: string;
    label: string;
};

export type ReservationDto = {
    reservationId: number;
    createdAt: string;
    updatedAt: string | null;
    startDate: string;
    endDate: string;
    reservationStatus: EnumValue;
    reservationSource: EnumValue;
    totalPrice: number;
    roomsQty: number;
};