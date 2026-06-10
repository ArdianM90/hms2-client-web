import { api } from "./axios";
import type {SearchReservationOffersRequest} from "../types/SearchReservationOffersRequest.tsx";
import type {ReservationOffer} from "../types/ReservationOffer.tsx";

export const reservationApi = {
    searchOffers: (request: SearchReservationOffersRequest) =>
        api.post<ReservationOffer[]>("/api/hms/reservations/search", request)
            .then(res => res.data),
};