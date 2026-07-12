import type {
  AddTaskRequest,
  TaskListItem,
  TasksFilterParams,
  UpdateStatusRequest,
} from "../types/Task.ts";
import type { LabeledValue } from "./LabeledValue.ts";
import { api } from "./axios.ts";
import type { PageableParam, PageableResult } from "../types/Pageable.ts";

export const taskApi = {
  getTasks: (filterParams?: TasksFilterParams, pageable?: PageableParam) =>
    api
      .get<
        PageableResult<TaskListItem[]>
      >("/api/hms/tasks", { params: { ...filterParams, ...pageable } })
      .then((res) => res.data),

  addTask: (request: AddTaskRequest) =>
    api
      .post<LabeledValue<number>>("/api/hms/tasks", request)
      .then((res) => res.data),

  updateStatus: (employeeTaskId: number, request: UpdateStatusRequest) =>
    api.put(`/api/hms/tasks/${employeeTaskId}/status`, request),
};
