import { api } from "./axios";
import type { RoomCreateRequest } from "../types/RoomCreateRequest.ts";
import type { Room } from "../types/Room.ts";
import type { RoomUpdateRequest } from "../types/RoomUpdateRequest.ts";

export const roomApi = {
  getRoom: (roomdId: number) =>
    api.get<Room>(`/api/hms/rooms/${roomdId}`).then((res) => res.data),

  getRooms: () => api.get<Room[]>("/api/hms/rooms").then((res) => res.data),

  createRoom: (request: RoomCreateRequest) =>
    api.post("/api/hms/rooms", request),

  updateRoom: (roomId: number, request: RoomUpdateRequest) =>
    api.put(`/api/hms/rooms/${roomId}`, request),

  deleteRoom: (roomId: number) => api.delete(`/api/hms/rooms/${roomId}`),
};
