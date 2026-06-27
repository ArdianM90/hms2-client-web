import { api } from "./axios";
import type { DictionaryValue } from "../types/DictionaryValue";

export const DictionaryType = {
  ROOM_STANDARDS: "room_standards",
  DOCUMENT_TYPES: "document_types",
  CITIZENSHIP: "citizenship",
} as const;

export type DictionaryType =
  (typeof DictionaryType)[keyof typeof DictionaryType];

export const dictionaryApi = {
  getDictionary: (type: DictionaryType) =>
    api
      .get<DictionaryValue[]>(`/api/hms/dictionaries/${type}`)
      .then((res) => res.data),
};
