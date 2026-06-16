import { api } from "./axios";
import type { SearchReservationOffersRequest } from "../types/SearchReservationOffersRequest.ts";
import type { ReservationOffer } from "../types/ReservationOffer.ts";
import type { MakeReservationRequest } from "../types/MakeReservationRequest.ts";
import type { ReservationInfo } from "../types/ReservationInfo.ts";
import type { ReservationDetails } from "../types/ReservationDetails.ts";
import type { AdminReservationInfo } from "../types/AdminReservationInfo.ts";

export const reservationApi = {
  getReservation: (reservationId: number) =>
    api
      .get<ReservationDetails>(`/api/hms/reservations/${reservationId}`)
      .then((res) => res.data),

  getAllReservations: () =>
    api
      .get<AdminReservationInfo[]>("/api/hms/reservations/all")
      .then((res) => res.data),

  getMyReservations: () =>
    api.get<ReservationInfo[]>("/api/hms/reservations").then((res) => res.data),

  searchOffers: (request: SearchReservationOffersRequest) =>
    api
      .post<ReservationOffer[]>("/api/hms/reservations/search", request)
      .then((res) => res.data),

  makeReservation: (request: MakeReservationRequest) =>
    api.post("/api/hms/reservations", request),

  changeReservationStatus: (reservationId: number, statusCode: string) =>
    api.patch(`/api/hms/reservations/${reservationId}/status`, { statusCode }),
};
