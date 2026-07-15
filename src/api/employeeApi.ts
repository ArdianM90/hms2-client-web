import { api } from "./axios.ts";
import type {
  EmployeeListItem,
  EmployeeRequest,
  EmployeesFilterParams,
} from "../types/Employee.ts";
import type { LabeledValue } from "./LabeledValue.ts";
import type { PageableParam, PageableResult } from "../types/Pageable.ts";

export const employeeApi = {
  getEmployees: (filters: EmployeesFilterParams, pageable: PageableParam) =>
    api
      .get<PageableResult<EmployeeListItem[]>>("/api/hms/employees", {
        params: { ...filters, ...pageable },
      })
      .then((res) => res.data),

  addEmployee: (request: EmployeeRequest) =>
    api
      .post<LabeledValue<string>>("/api/hms/employees", request)
      .then((res) => res.data),

  updateEmployee: (userId: string, request: EmployeeRequest) =>
    api.put(`/api/hms/employees/${userId}`, request),

  deleteEmployee: (userId: string) =>
    api.delete(`/api/hms/employees/${userId}`),
};
