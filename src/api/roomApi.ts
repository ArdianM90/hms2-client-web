import { api } from "./axios";
import type { RoomStandard } from "../types/RoomStandard";
import type {CreateRoomRequest} from "../types/CreateRoomRequest.ts";
import type {Room} from "../types/Room.ts";

export const roomApi = {
    getRooms: () =>
        api.get<Room[]>("/api/hms/rooms").then(res => res.data),

    createRoom: (request: CreateRoomRequest) =>
        api.post("/api/hms/rooms", request),

    deleteRoom: (id: number) =>
        api.delete(`/api/hms/rooms/${id}`),

    getStandards: () =>
        api.get<RoomStandard[]>("/api/hms/rooms/standards").then(res => res.data),
};