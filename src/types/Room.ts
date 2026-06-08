export type Room = {
    id: number;
    roomNumber: string;
    standard: {
        code: string;
        name: string;
    };
    capacity: number;
    pricePerNight: number;
    floor: number | null;
    areaM2: number | null;
};