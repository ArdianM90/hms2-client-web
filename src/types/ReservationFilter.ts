type ReservationRoomRequirement = {
  id: number;
  capacity: number;
};

export type ReservationFilter = {
  startDate: string;
  endDate: string;
  rooms: ReservationRoomRequirement[];
  standardCode: string;
  priceFrom: string;
  priceTo: string;
};
