import { api } from "./axios";
import type {SearchReservationOffersRequest} from "../types/SearchReservationOffersRequest.ts";
import type {ReservationOffer} from "../types/ReservationOffer.ts";
import type {MakeReservationRequest} from "../types/MakeReservationRequest.ts";

export const reservationApi = {
    searchOffers: (request: SearchReservationOffersRequest) =>
        api.post<ReservationOffer[]>("/api/hms/reservations/search", request)
            .then(res => res.data),

    makeReservation: (request: MakeReservationRequest) =>
        api.post("/api/hms/reservations", request),
};