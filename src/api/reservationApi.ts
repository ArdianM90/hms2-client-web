import { api } from "./axios";
import type { SearchReservationOffersRequest } from "../types/SearchReservationOffersRequest.ts";
import type { ReservationOffer } from "../types/ReservationOffer.ts";
import type { MakeReservationRequest } from "../types/MakeReservationRequest.ts";
import type {
  ReservationDetails,
  ReservationDto,
  ReservationsFilterParams,
} from "../types/Reservation.ts";
import type { PageableParam, PageableResult } from "../types/Pageable.ts";

export const reservationApi = {
  getReservation: (reservationId: number) =>
    api
      .get<ReservationDetails>(`/api/hms/reservations/${reservationId}`)
      .then((res) => res.data),

  getReservations: (
    filterParams?: ReservationsFilterParams,
    pageable?: PageableParam,
  ) =>
    api
      .get<
        PageableResult<ReservationDto[]>
      >("/api/hms/reservations", { params: { ...filterParams, ...pageable } })
      .then((res) => res.data),

  searchOffers: (request: SearchReservationOffersRequest) =>
    api
      .post<ReservationOffer[]>("/api/hms/reservations/search", request)
      .then((res) => res.data),

  makeReservation: (request: MakeReservationRequest) =>
    api.post("/api/hms/reservations", request),

  changeReservationStatus: (reservationId: number, statusCode: string) =>
    api.patch(`/api/hms/reservations/${reservationId}/status`, { statusCode }),
};
