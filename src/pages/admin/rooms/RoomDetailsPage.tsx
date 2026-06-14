import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { roomApi } from "../../../api/roomApi.ts";
import type { Room } from "../../../types/Room.ts";
import InfoBox from "../../../components/InfoBox.tsx";

export default function RoomDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    roomApi
      .getRoom(Number(id))
      .then(setRoom)
      .catch(() => setError("Nie udało się pobrać pokoju"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress sx={{ color: "#6b1020" }} />
      </Box>
    );
  }

  if (error || !room) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", mb: 3 }}
      >
        <Box>
          <Typography variant="h4">Pokój nr {room.roomNumber}</Typography>
          <Chip
            label={room.standard.name}
            sx={{
              mt: 1,
              bgcolor: "rgba(107,16,32,0.08)",
              color: "#6b1020",
            }}
          />
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/admin/rooms/${room.roomId}/edit`)}
            sx={{ borderColor: "#6b1020", color: "#6b1020" }}
          >
            Edytuj
          </Button>

          <Button
            variant="contained"
            sx={{ bgcolor: "#6b1020" }}
            onClick={() => navigate("/admin/rooms")}
          >
            Powrót
          </Button>
        </Stack>
      </Stack>

      <Card sx={{ borderLeft: "5px solid #6b1020" }}>
        <CardContent>
          <Stack spacing={2}>
            <InfoBox label="Liczba osób" value={room.capacity} />
            <InfoBox label="Piętro" value={room.floor ?? "—"} />
            <InfoBox
              label="Powierzchnia"
              value={room.areaM2 ? `${room.areaM2} m²` : "—"}
            />
            <InfoBox label="Cena za dobę" value={`${room.pricePerNight} zł`} />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            ID: {room.roomId}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
