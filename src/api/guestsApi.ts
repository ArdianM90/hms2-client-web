import { api } from "./axios.ts";
import type { CheckInRequest } from "../types/CheckInRequest.ts";

export const guestsApi = {
  checkInGuests: (request: CheckInRequest) =>
    api.post("/api/hms/reservation-guest", request),
};
