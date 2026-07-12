import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  Box,
  InputLabel,
  FormControl,
  Alert,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { taskApi } from "../api/taskApi";
import { useCurrentUserId } from "../hooks/useCurrentUserId";
import { type AddTaskRequest, TaskType } from "../types/Task.ts";
import type { RoomSimple } from "../types/Room.ts";
import { roomApi } from "../api/roomApi.ts";

type AxiosErrorResponse = {
  response?: { data?: { message?: string } };
};

const emptyForm = {
  title: "",
  description: "",
  roomId: "",
  priority: 2,
  dueAt: "",
};

type Props = {
  open: boolean;
  assigneeUserId: string;
  assigneeName: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function TaskFormModal({
  open,
  assigneeUserId,
  assigneeName,
  onClose,
  onSuccess,
}: Props) {
  const createdByUserId = useCurrentUserId();
  const [rooms, setRooms] = useState<RoomSimple[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = form.title.trim() !== "" && createdByUserId !== null;

  useEffect(() => {
    if (open) {
      roomApi
        .getRoomsSimple()
        .then(setRooms)
        .catch(() => setError("Nie udało się pobrać listy pokojów"));
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!isValid || createdByUserId === null) {
      setError("Uzupełnij tytuł zadania.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const request: AddTaskRequest = {
      assigneeUserId,
      createdByUserId,
      taskTypeCode: TaskType.PREPARE_ROOM,
      title: form.title,
      description: form.description || null,
      priority: form.priority,
      roomId: form.roomId ? Number(form.roomId) : null,
      dueAt: form.dueAt ? `${form.dueAt}:00` : null,
    };

    try {
      await taskApi.addTask(request);
      onSuccess();
      onClose();
    } catch (e: unknown) {
      const axiosError = e as AxiosErrorResponse;
      setError(
        axiosError?.response?.data?.message ?? "Nie udało się dodać zadania.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      onClick={(e) => e.stopPropagation()}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Nowe zadanie
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Przypisane do: <strong>{assigneeName}</strong>
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Tytuł"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Opis"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            fullWidth
            multiline
            minRows={2}
          />
          <FormControl fullWidth>
            <InputLabel>Pokój</InputLabel>
            <Select
              label="Pokój"
              value={form.roomId}
              onChange={(e) =>
                setForm({
                  ...form,
                  roomId: e.target.value,
                })
              }
            >
              <MenuItem value="">Brak pokoju</MenuItem>
              {rooms.map((room) => (
                <MenuItem key={room.roomId} value={room.roomId}>
                  Pokój nr {room.roomNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Priorytet</InputLabel>
            <Select
              label="Priorytet"
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: Number(e.target.value) })
              }
            >
              <MenuItem value={1}>Niski</MenuItem>
              <MenuItem value={2}>Średni</MenuItem>
              <MenuItem value={3}>Wysoki</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Termin"
            type="datetime-local"
            value={form.dueAt}
            onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: "#6b1020" }}>
          Anuluj
        </Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "#6b1020", "&:hover": { bgcolor: "#87182b" } }}
          onClick={handleSubmit}
          disabled={submitting || !isValid}
        >
          {submitting ? "Zapisywanie..." : "Dodaj zadanie"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
