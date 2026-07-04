import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Button,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { DictionaryValue } from "../../types/DictionaryValue";
import type { MyTaskListItem } from "../../types/Task";
import { TaskStatus } from "../../types/Task";
import { taskApi } from "../../api/taskApi";
import { dictionaryApi, DictionaryType } from "../../api/dictionaryApi.ts";
import type { TableColumn } from "../../types/TableColumn.ts";
import { commonTaskColumns } from "../../config/CommonTableColumns.tsx";
import TasksTable from "../../components/TasksTable.tsx";

export default function MyTasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<MyTaskListItem[]>([]);
  const [statuses, setStatuses] = useState<DictionaryValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusLabel = (code: string) =>
    statuses.find((s) => s.code === code)?.name ?? code;

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskApi.getMyTasks();
      setTasks(data);
    } catch {
      setError("Nie udało się pobrać listy zadań");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dictionaryApi.getDictionary(DictionaryType.TASK_STATUS).then(setStatuses);
    void loadTasks();
  }, []);

  const updateLocalStatus = (
    employeeTaskId: number,
    statusCode: TaskStatus,
    extra?: Partial<MyTaskListItem>,
  ) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.employeeTaskId === employeeTaskId
          ? { ...t, statusCode, status: statusLabel(statusCode), ...extra }
          : t,
      ),
    );
  };

  const handleStart = async (employeeTaskId: number) => {
    try {
      await taskApi.updateStatus(employeeTaskId, {
        statusCode: TaskStatus.IN_PROGRESS,
      });
      updateLocalStatus(employeeTaskId, TaskStatus.IN_PROGRESS);
    } catch {
      alert("Nie udało się rozpocząć zadania");
    }
  };

  const handleComplete = async (employeeTaskId: number) => {
    const completedAt = new Date().toISOString();
    try {
      await taskApi.updateStatus(employeeTaskId, {
        statusCode: TaskStatus.COMPLETED,
        completedAt,
      });
      updateLocalStatus(employeeTaskId, TaskStatus.COMPLETED, { completedAt });
    } catch {
      alert("Nie udało się zakończyć zadania");
    }
  };

  const statusColumn: TableColumn<MyTaskListItem> = {
    header: "Status",
    render: (dto) => (
      <Chip
        label={statusLabel(dto.statusCode)}
        size="small"
        sx={{
          bgcolor: "rgba(107,16,32,0.08)",
          color: "#6b1020",
          fontWeight: 500,
        }}
      />
    ),
  };

  const actionsColumn: TableColumn<MyTaskListItem> = {
    header: "Akcje",
    align: "center",
    render: (dto) => (
      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
        {dto.statusCode === TaskStatus.ASSIGNED && (
          <Button
            size="small"
            startIcon={<PlayArrowIcon />}
            onClick={() => void handleStart(dto.employeeTaskId)}
            sx={{ color: "#6b1020" }}
          >
            Rozpocznij
          </Button>
        )}
        {dto.statusCode === TaskStatus.IN_PROGRESS && (
          <Button
            size="small"
            startIcon={<TaskAltIcon />}
            onClick={() => void handleComplete(dto.employeeTaskId)}
            sx={{ color: "#6b1020" }}
          >
            Zakończ
          </Button>
        )}
        {dto.reservationId !== null && (
          <Button
            size="small"
            startIcon={<InfoOutlinedIcon />}
            onClick={() => navigate(`/reservation/${dto.reservationId}`)}
          >
            Szczegóły rezerwacji
          </Button>
        )}
      </Box>
    ),
  };

  const columns: TableColumn<MyTaskListItem>[] = [
    ...commonTaskColumns,
    statusColumn,
    actionsColumn,
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress sx={{ color: "#6b1020" }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Moje zadania
      </Typography>

      <Card sx={{ borderLeft: "5px solid #6b1020" }}>
        <CardContent>
          <TasksTable tasks={tasks} columns={columns} />

          {tasks.length === 0 && (
            <Typography sx={{ mt: 2, color: "text.secondary" }}>
              Brak przydzielonych zadań
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
