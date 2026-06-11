export type SearchReservationOffersRequest = {
    startDate: string;
    endDate: string;
    roomCapacities: number[];
    standardCode?: string;
    priceFrom?: number;
    priceTo?: number;
};