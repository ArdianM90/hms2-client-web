export type CreateRoomRequest = {
    roomNumber: string;
    roomStandardCode: string;
    capacity: number;
    pricePerNight: number;
    floor: number | null;
    areaM2: number | null;
};