import type {
  AddTaskRequest,
  TaskListItem,
  TasksFilterParams,
} from "../types/Task.ts";
import type { LabeledValue } from "./LabeledValue.ts";
import { api } from "./axios.ts";

export const taskApi = {
  getTasks: (filterParams?: TasksFilterParams) =>
    api
      .get<TaskListItem[]>("/api/hms/tasks", { params: filterParams })
      .then((res) => res.data),

  addTask: (request: AddTaskRequest) =>
    api
      .post<LabeledValue<number>>("/api/hms/tasks", request)
      .then((res) => res.data),
};
