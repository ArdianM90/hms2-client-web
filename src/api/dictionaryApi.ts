import { api } from "./axios";
import type { DictionaryValue } from "../types/DictionaryValue";

export const DictionaryType = {
  RESERVATION_STATUS: "reservation_status",
  ROOM_STANDARD: "room_standard",
  DOCUMENT_TYPE: "document_type",
  CITIZENSHIP: "citizenship",
  APP_USER_ROLE: "app_user_role",
  EMPLOYEE_POSITION: "employee_position",
  EMPLOYEE_TASK: "employee_task",
  TASK_STATUS: "task_status",
} as const;

export type DictionaryType =
  (typeof DictionaryType)[keyof typeof DictionaryType];

export const dictionaryApi = {
  getDictionary: (type: DictionaryType) =>
    api
      .get<DictionaryValue[]>(`/api/hms/dictionaries/${type}`)
      .then((res) => res.data),
};
