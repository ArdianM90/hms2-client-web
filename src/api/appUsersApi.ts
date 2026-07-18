import { api } from "./axios.ts";
import type {
  AppUserListItem,
  EmployeeRequest,
  UsersFilterParams,
} from "../types/AppUser.ts";
import type { LabeledValue } from "./LabeledValue.ts";
import type { PageableParam, PageableResult } from "../types/Pageable.ts";

export const appUsersApi = {
  getAppUsers: (filters: UsersFilterParams, pageable: PageableParam) =>
    api
      .get<PageableResult<AppUserListItem[]>>("/api/hms/users", {
        params: { ...filters, ...pageable },
      })
      .then((res) => res.data),

  addAppUser: (request: EmployeeRequest) =>
    api
      .post<LabeledValue<string>>("/api/hms/users", request)
      .then((res) => res.data),

  updateAppUser: (userId: string, request: EmployeeRequest) =>
    api.put(`/api/hms/users/${userId}`, request),

  deleteAppUser: (userId: string) => api.delete(`/api/hms/users/${userId}`),
};
