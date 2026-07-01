import { api } from "./axios.ts";
import type { EmployeeListItem, EmployeeRequest } from "../types/Employee.ts";
import type { LabeledValue } from "./LabeledValue.ts";

export const employeeApi = {
  getEmployees: () =>
    api.get<EmployeeListItem[]>("/api/hms/employees").then((res) => res.data),

  addEmployee: (request: EmployeeRequest) =>
    api
      .post<LabeledValue<string>>("/api/hms/employees", request)
      .then((res) => res.data),

  updateEmployee: (userId: string, request: EmployeeRequest) =>
    api.put(`/api/hms/employees/${userId}`, request),

  deleteEmployee: (userId: string) =>
    api.delete(`/api/hms/employees/${userId}`),
};
