import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Alert,
  Button,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useEffect, useState } from "react";
import { reservationApi } from "../../api/reservationApi.ts";
import type { ReservationInfo } from "../../types/ReservationInfo.ts";
import type { ReservationColumn } from "../../types/ReservationColumn.ts";
import { commonColumns } from "../../config/reservationColumns.tsx";
import ReservationsTable from "../../components/ReservationsTable.tsx";
import { useNavigate } from "react-router-dom";

export default function MyReservationsPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<ReservationInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const columns: ReservationColumn<ReservationInfo>[] = [
    ...commonColumns,
    {
      header: "Akcje",
      align: "right",
      render: (dto) => (
        <Button
          color="error"
          startIcon={<CancelOutlinedIcon />}
          onClick={(e) => {
            e.stopPropagation();
            void handleCancel(dto.reservationId);
          }}
          disabled={dto.reservationStatus.code === "cancelled"}
        >
          Anuluj
        </Button>
      ),
    },
  ];

  useEffect(() => {
    reservationApi
      .getMyReservations()
      .then(setReservations)
      .catch(() => setError("Nie udało się pobrać listy rezerwacji"))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: number) => {
    try {
      await reservationApi.changeReservationStatus(id);

      setReservations((prev) =>
        prev.map((r) =>
          r.reservationId === id
            ? {
                ...r,
                reservationStatus: { code: "cancelled", label: "Anulowana" },
              }
            : r,
        ),
      );
    } catch {
      alert("Nie udało się anulować rezerwacji");
    }
  };

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
        Moje rezerwacje
      </Typography>

      <Card sx={{ borderLeft: "5px solid #6b1020" }}>
        <CardContent>
          <ReservationsTable
            reservations={reservations}
            columns={columns}
            onRowClick={(dto) => navigate(`/reservation/${dto.reservationId}`)}
          />

          {reservations.length === 0 && (
            <Typography sx={{ mt: 2, color: "text.secondary" }}>
              Brak rezerwacji
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
