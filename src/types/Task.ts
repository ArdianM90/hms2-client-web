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

export interface TaskListItem {
  employeeTaskId: number;
  assigneeUserId: string;
  assigneeFirstName: string;
  assigneeLastName: string;
  createdByUserId: string;
  createdByFirstName: string;
  createdByLastName: string;
  roomId: number | null;
  roomNumber: string | null;
  reservationId: number | null;
  taskTypeCode: string;
  taskType: string;
  statusCode: string;
  status: string;
  title: string;
  description: string | null;
  priority: number;
  dueAt: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface MyTaskListItem {
  employeeTaskId: number;
  createdByUserId: string;
  createdByFirstName: string;
  createdByLastName: string;
  roomNumber: string | null;
  reservationId: number | null;
  taskTypeCode: string;
  taskType: string;
  statusCode: string;
  status: string;
  title: string;
  description: string | null;
  priority: number;
  dueAt: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface AddTaskRequest {
  assigneeUserId: string;
  createdByUserId: string;
  roomId?: number | null;
  reservationId?: number | null;
  taskTypeCode: TaskType;
  title: string;
  description?: string | null;
  priority?: number;
  dueAt?: string | null;
}

export interface UpdateStatusRequest {
  statusCode: TaskStatus;
  completedAt?: string | null;
}

export interface TasksFilterParams {
  userId?: string;
}
