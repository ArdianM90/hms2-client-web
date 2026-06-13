import { api } from "./axios";
import type {SearchReservationOffersRequest} from "../types/SearchReservationOffersRequest.ts";
import type {ReservationOffer} from "../types/ReservationOffer.ts";
import type {MakeReservationRequest} from "../types/MakeReservationRequest.ts";
import type {ReservationDto} from "../types/ReservationDto.ts";

export const reservationApi = {
    getMyReservations: () =>
        api.get<ReservationDto[]>("/api/hms/reservations")
            .then(res => res.data),

    searchOffers: (request: SearchReservationOffersRequest) =>
        api.post<ReservationOffer[]>("/api/hms/reservations/search", request)
            .then(res => res.data),

    makeReservation: (request: MakeReservationRequest) =>
        api.post("/api/hms/reservations", request),

    changeReservationStatus: (reservationId: number) =>
        api.patch(`/api/hms/reservations/${reservationId}/status`, {
            statusCode: "cancelled"
        })
};