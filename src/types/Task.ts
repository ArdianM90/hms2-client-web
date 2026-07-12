import type { DictionaryValue } from "./DictionaryValue.ts";

export const TaskType = {
  PREPARE_ROOM: "prepare_room",
} as const;
export type TaskType = (typeof TaskType)[keyof typeof TaskType];

export const TaskStatus = {
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export type TaskListItem = {
  employeeTaskId: number;
  createdByUserId: string;
  createdByFirstName: string;
  createdByLastName: string;
  assigneeUserId: string;
  assigneeFirstName: string;
  assigneeLastName: string;
  roomNumber: string | null;
  reservationId: number | null;
  taskType: DictionaryValue;
  status: DictionaryValue;
  title: string;
  description: string | null;
  priority: number;
  dueAt: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
};

export type AddTaskRequest = {
  assigneeUserId: string;
  createdByUserId: string;
  roomId?: number | null;
  reservationId?: number | null;
  taskTypeCode: TaskType;
  title: string;
  description?: string | null;
  priority?: number;
  dueAt?: string | null;
};

export type UpdateStatusRequest = {
  statusCode: TaskStatus;
  completedAt?: string | null;
};

export type TasksFilterParams = {
  query?: string;
  taskTypeCodes?: string[];
  dueFrom?: string;
  dueTo?: string;
};
