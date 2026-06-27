export type GuestCheckInRequest = {
  firstName: string;
  lastName: string;
  pesel?: string;
  dateOfBirth: string;
  documentTypeCode: string;
  documentNumber?: string;
  citizenshipCode?: string;
  phone?: string;
};

export type RoomCheckInRequest = {
  roomId: number;
  guests: GuestCheckInRequest[];
};

export type CheckInRequest = {
  reservationId: number;
  rooms: RoomCheckInRequest[];
};
