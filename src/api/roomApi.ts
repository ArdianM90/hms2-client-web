import { api } from "./axios";
import type { RoomStandard } from "../types/RoomStandard";
import type {RoomCreateRequest} from "../types/RoomCreateRequest.ts";
import type {Room} from "../types/Room.ts";
import type {RoomUpdateRequest} from "../types/RoomUpdateRequest.ts";

export const roomApi = {
    getRoom: (id: number) =>
        api.get<Room>(`/api/hms/rooms/${id}`).then(res => res.data),

    getRooms: () =>
        api.get<Room[]>("/api/hms/rooms").then(res => res.data),

    createRoom: (request: RoomCreateRequest) =>
        api.post("/api/hms/rooms", request),

    updateRoom: (id: number, request: RoomUpdateRequest) =>
        api.put(`/api/hms/rooms/${id}`, request),

    deleteRoom: (id: number) =>
        api.delete(`/api/hms/rooms/${id}`),

    getStandards: () =>
        api.get<RoomStandard[]>("/api/hms/rooms/standards").then(res => res.data),
};