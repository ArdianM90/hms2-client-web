// components/CheckInModal.tsx
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RoomCheckInForm from "./RoomCheckInForm";
import { reservationApi } from "../api/reservationApi";
import { dictionaryApi, DictionaryType } from "../api/dictionaryApi";
import { ReservationStatusCode } from "../constants/reservationStatus";
import type { ReservationDetails } from "../types/ReservationDetails";
import type {
  CheckInRequest,
  RoomCheckInRequest,
  GuestCheckInRequest,
} from "../types/CheckInRequest";
import type { DictionaryValue } from "../types/DictionaryValue";
import type { AxiosErrorResponse } from "../api/apiTypes";
import {guestsApi} from "../api/guestsApi.ts";

const emptyGuest: GuestCheckInRequest = {
  firstName: "",
  lastName: "",
  pesel: "",
  dateOfBirth: "",
  documentTypeCode: "",
  documentNumber: "",
  citizenshipCode: "",
  phone: "",
};

type Props = {
  open: boolean;
  reservationId: number;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CheckInModal({
  open,
  reservationId,
  onClose,
  onSuccess,
}: Props) {
  const [reservation, setReservation] = useState<ReservationDetails | null>(
    null,
  );
  const [rooms, setRooms] = useState<RoomCheckInRequest[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DictionaryValue[]>([]);
  const [citizenshipTypes, setCitizenshipTypes] = useState<DictionaryValue[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let active = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [details, docTypes, citizenships] = await Promise.all([
          reservationApi.getReservation(reservationId),
          dictionaryApi.getDictionary(DictionaryType.DOCUMENT_TYPES),
          dictionaryApi.getDictionary(DictionaryType.CITIZENSHIP),
        ]);

        if (!active) return;

        setReservation(details);
        setDocumentTypes(docTypes);
        setCitizenshipTypes(citizenships);
        setRooms(
            details.rooms.map((r) => ({
              roomId: r.roomId,
              guests: [{ ...emptyGuest }],
            }))
        );
      } catch {
        if (active) setError("Nie udało się pobrać danych rezerwacji.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadData();

    return () => {
      active = false;
    };
  }, [open, reservationId]);

  const updateRoom = (index: number, room: RoomCheckInRequest) => {
    setRooms((prev) => prev.map((r, i) => (i === index ? room : r)));
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);

    const request: CheckInRequest = { reservationId, rooms };

    try {
      await guestsApi.checkInGuests(request);
      await reservationApi.changeReservationStatus(
        reservationId,
        ReservationStatusCode.CHECKED_IN,
      );
      onSuccess();
      onClose();
    } catch (e: unknown) {
      const axiosError = e as AxiosErrorResponse;
      setError(
        axiosError?.response?.data?.message ??
          "Nie udało się zameldować gości.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
        Zameldowanie gości
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#6b1020" }} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && reservation && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Rezerwacja #{reservation.reservationId} — od{" "}
              {reservation.startDate} do {reservation.endDate}
            </Typography>

            {reservation.rooms.map((roomOffer, index) => (
              <RoomCheckInForm
                key={roomOffer.roomId}
                room={rooms[index]}
                capacity={roomOffer.capacity}
                roomNumber={index + 1}
                documentTypes={documentTypes}
                citizenshipTypes={citizenshipTypes}
                onChange={(room) => updateRoom(index, room)}
              />
            ))}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: "#6b1020" }}>
          Anuluj
        </Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "#6b1020", "&:hover": { bgcolor: "#87182b" } }}
          onClick={handleSubmit}
          disabled={submitting || loading}
        >
          {submitting ? "Zapisywanie..." : "Zamelduj"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
