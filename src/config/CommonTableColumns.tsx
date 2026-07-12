import { formatDateTime } from "../helpers/Formatter.ts";
import { Chip } from "@mui/material";
import type { TableColumn } from "../types/TableColumn.ts";
import type { ReservationInfo } from "../types/ReservationInfo.ts";
import { type TaskListItem, TaskStatus } from "../types/Task.ts";

const TASK_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  [TaskStatus.ASSIGNED]: { bg: "rgba(107,16,32,0.08)", text: "#6b1020" },
  [TaskStatus.IN_PROGRESS]: { bg: "rgba(255,152,0,0.12)", text: "#e65100" },
  [TaskStatus.COMPLETED]: { bg: "rgba(46,125,50,0.12)", text: "#2e7d32" },
  [TaskStatus.CANCELLED]: { bg: "rgba(0,0,0,0.08)", text: "rgba(0,0,0,0.6)" },
};

function statusColor(code: string) {
  return TASK_STATUS_COLORS[code];
}

export const commonReservationColumns: TableColumn<ReservationInfo>[] = [
  {
    header: "#",
    render: (_, index) => index + 1,
  },
  {
    header: "Data utworzenia",
    render: (dto) => formatDateTime(dto.createdAt),
  },
  {
    header: "Data ostatniej aktualizacji",
    render: (dto) => formatDateTime(dto.updatedAt),
  },
  {
    header: "Data pobytu",
    render: (dto) => `od ${dto.startDate} do ${dto.endDate}`,
  },
  {
    header: "Doby hotelowe",
    render: (dto) => dto.daysQty,
  },
  {
    header: "Status",
    render: (dto) => (
      <Chip
        label={dto.reservationStatus.name}
        size="small"
        sx={{
          bgcolor: "rgba(107,16,32,0.08)",
          color: "#6b1020",
          fontWeight: 600,
        }}
      />
    ),
  },
  {
    header: "Źródło",
    render: (dto) => dto.reservationSource.name,
  },
  {
    header: "Pokoje",
    render: (dto) => dto.roomsQty,
  },
  {
    header: "Cena",
    render: (dto) => `${dto.totalPrice} zł`,
  },
];

export const commonTaskColumns: TableColumn<TaskListItem>[] = [
  {
    header: "Rodzaj zadania",
    sortKey: "task_type",
    render: (dto) => {
      return (
        <Chip
          label={dto.taskType.name}
          size="small"
          sx={{
            bgcolor: "rgba(107,16,32,0.08)",
            color: "#6b1020",
            fontWeight: 600,
          }}
        />
      );
    },
  },
  {
    header: "Tytuł",
    sortKey: "title",
    render: (dto) => dto.title,
  },
  {
    header: "Pokój",
    sortKey: "room_number",
    render: (dto) => (dto.roomNumber ? `nr ${dto.roomNumber}` : "—"),
  },
  {
    header: "Priorytet",
    sortKey: "priority",
    render: (dto) => dto.priority,
  },
  {
    header: "Termin",
    sortKey: "dueAt",
    render: (dto) =>
      dto.dueAt ? new Date(dto.dueAt).toLocaleString("pl-PL") : "—",
  },
  {
    header: "Status",
    sortKey: "status",
    render: (dto) => {
      const { bg, text } = statusColor(dto.status.code);
      return (
        <Chip
          label={dto.status.name}
          size="small"
          sx={{
            bgcolor: bg,
            color: text,
            fontWeight: 500,
          }}
        />
      );
    },
  },
];
