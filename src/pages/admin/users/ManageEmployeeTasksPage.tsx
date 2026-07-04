import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
  Button,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { taskApi } from "../../../api/taskApi.ts";
import { type TaskListItem, TaskStatus } from "../../../types/Task.ts";
import TaskFormModal from "../../../components/TaskFormModal.tsx";
import type { DictionaryValue } from "../../../types/DictionaryValue.ts";
import { dictionaryApi, DictionaryType } from "../../../api/dictionaryApi.ts";

type LocationState = { assigneeName?: string } | null;

export default function ManageEmployeeTasksPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const assigneeName =
    (location.state as LocationState)?.assigneeName ?? "Pracownik";

  const [tasks, setTasks] = useState<TaskListItem[]>([]);
  const [statuses, setStatuses] = useState<DictionaryValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const statusLabel = (code: string) =>
    statuses.find((s) => s.code === code)?.name ?? code;

  const loadTasks = () => {
    if (!userId) return Promise.resolve();
    return Promise.resolve()
        .then(() => {
          setLoading(true);
          setError(null);
        })
        .then(() => taskApi.getTasks({ userId }))
        .then(setTasks)
        .catch(() => setError("Nie udało się pobrać listy zadań"))
        .finally(() => setLoading(false));
  };

  useEffect(() => {
    dictionaryApi.getDictionary(DictionaryType.TASK_STATUS).then(setStatuses);
    void loadTasks();
  }, [userId]);

  const statusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return "success";
      case TaskStatus.CANCELLED:
        return "default";
      case TaskStatus.IN_PROGRESS:
        return "warning";
      default:
        return "info";
    }
  };

  if (!userId) {
    return <Alert severity="error">Brak identyfikatora pracownika.</Alert>;
  }

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
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <IconButton onClick={() => navigate(-1)} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Zadania — {assigneeName}</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: "#6b1020", "&:hover": { bgcolor: "#87182b" } }}
          onClick={() => setModalOpen(true)}
        >
          Dodaj zadanie
        </Button>
      </Box>

      <Card sx={{ borderLeft: "5px solid #6b1020" }}>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    "& .MuiTableCell-head": {
                      fontWeight: 700,
                      color: "#6b1020",
                    },
                  }}
                >
                  <TableCell>Tytuł</TableCell>
                  <TableCell>Pokój</TableCell>
                  <TableCell>Priorytet</TableCell>
                  <TableCell>Termin</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.employeeTaskId}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.roomId ?? "—"}</TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>
                      {task.dueAt
                        ? new Date(task.dueAt).toLocaleString("pl-PL")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabel(task.statusCode)}
                        color={statusColor(task.statusCode as TaskStatus)}
                        sx={{
                          bgcolor: "rgba(107,16,32,0.08)",
                          color: "#6b1020",
                          fontWeight: 500,
                          height: 20,
                          fontSize: "0.7rem",
                          mt: 0.5,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {tasks.length === 0 && (
            <Typography sx={{ mt: 2, color: "text.secondary" }}>
              Brak przydzielonych zadań
            </Typography>
          )}
        </CardContent>
      </Card>

      <TaskFormModal
        key={modalOpen ? "open" : "closed"}
        open={modalOpen}
        assigneeUserId={userId}
        assigneeName={assigneeName}
        onClose={() => setModalOpen(false)}
        onSuccess={loadTasks}
      />
    </Box>
  );
}
