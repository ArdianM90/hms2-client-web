import { api } from "./axios";
import type { RoomStandard } from "../types/RoomStandard";
import type {CreateRoomRequest} from "../types/CreateRoomRequest.ts";

export const roomApi = {
    getStandards: () =>
        api.get<RoomStandard[]>("/api/hms/rooms/standards").then(res => res.data),

    createRoom: (request: CreateRoomRequest) =>
        api.post("/api/hms/rooms", request),
};