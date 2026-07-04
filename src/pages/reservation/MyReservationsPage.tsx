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
import type { TableColumn } from "../../types/TableColumn.ts";
import { commonReservationColumns } from "../../config/CommonTableColumns.tsx";
import ReservationsTable from "../../components/ReservationsTable.tsx";
import { useNavigate } from "react-router-dom";
import {
  getStatusLabel,
  ReservationStatusCode,
} from "../../constants/reservationStatus.ts";

export default function MyReservationsPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<ReservationInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const columns: TableColumn<ReservationInfo>[] = [
    ...commonReservationColumns,
    {
      header: "Akcje",
      align: "center",
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

  const handleCancel = async (reservationId: number) => {
    try {
      await reservationApi.changeReservationStatus(
        reservationId,
        ReservationStatusCode.CANCELLED,
      );

      setReservations((prev) =>
        prev.map((r) =>
          r.reservationId === reservationId
            ? {
                ...r,
                reservationStatus: {
                  code: ReservationStatusCode.CANCELLED,
                  label: getStatusLabel(ReservationStatusCode.CANCELLED),
                },
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
