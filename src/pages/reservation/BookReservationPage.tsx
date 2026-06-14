import { Alert, Box, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { RoomStandard } from "../../types/RoomStandard";
import ReservationSearchForm from "../../components/ReservationSearchForm.tsx";
import { roomApi } from "../../api/roomApi.ts";
import { reservationApi } from "../../api/reservationApi.ts";
import type { ReservationFilter } from "../../types/ReservationFilter.ts";
import type { SearchReservationOffersRequest } from "../../types/SearchReservationOffersRequest.ts";
import type { ReservationOffer } from "../../types/ReservationOffer.ts";
import ReservationOfferCard from "../../components/ReservationOfferCard.tsx";
import type { AxiosErrorResponse } from "../../api/apiTypes.ts";
import { useNavigate } from "react-router-dom";

export default function BookReservationPage() {
  const navigate = useNavigate();
  const [standards, setStandards] = useState<RoomStandard[]>([]);
  const [offers, setOffers] = useState<ReservationOffer[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
    standardCode: "",
    priceFrom: "",
    priceTo: "",
    rooms: [
      {
        id: 1,
        capacity: 2,
      },
    ],
  });

  const canSearch = useMemo(
    () =>
      filter.startDate &&
      filter.endDate &&
      filter.rooms.length > 0 &&
      filter.rooms.every((r) => r.capacity > 0),
    [filter],
  );

  useEffect(() => {
    roomApi.getStandards().then(setStandards);
  }, []);

  const mapFilterToRequest = (
    filter: ReservationFilter,
  ): SearchReservationOffersRequest => ({
    startDate: filter.startDate,
    endDate: filter.endDate,
    roomCapacities: filter.rooms.map((r) => r.capacity),
    standardCode: filter.standardCode || undefined,
    priceFrom: filter.priceFrom ? Number(filter.priceFrom) : undefined,
    priceTo: filter.priceTo ? Number(filter.priceTo) : undefined,
  });

  useEffect(() => {
    if (!canSearch) {
      return;
    }
    const request = mapFilterToRequest(filter);
    reservationApi
      .searchOffers(request)
      .then((data) => {
        setApiError(null);
        setOffers(data);
      })
      .catch((e) => {
        const message =
          (e as AxiosErrorResponse)?.response?.data?.message ??
          "Wystąpił błąd podczas wyszukiwania ofert.";
        setApiError(message);
        setOffers([]);
      });
  }, [filter, canSearch]);

  const addRoom = () => {
    setFilter((prev) => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        {
          id: Date.now(),
          capacity: 1,
        },
      ],
    }));
  };

  const removeRoom = (id: number) => {
    setFilter((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((r) => r.id !== id),
    }));
  };

  const updateRoomCapacity = (roomId: number, capacity: number) => {
    setFilter((prev) => ({
      ...prev,
      rooms: prev.rooms.map((r) => (r.id === roomId ? { ...r, capacity } : r)),
    }));
  };

  const handleSelectOffer = (offer: ReservationOffer) => {
    navigate("/reservation/my", {
      state: {
        offer,
        startDate: filter.startDate,
        endDate: filter.endDate,
      },
    });
  };

  const renderOffersContent = () => {
    if (apiError) {
      return <Alert severity="error">{apiError}</Alert>;
    }
    if (!canSearch) {
      return (
        <Alert severity="info">
          Uzupełnij daty pobytu oraz wymagane pokoje.
        </Alert>
      );
    }
    if (offers.length === 0) {
      return (
        <Alert severity="warning">
          Brak dostępnych ofert dla podanych kryteriów.
        </Alert>
      );
    }
    return (
      <Stack spacing={2}>
        {offers.map((offer, index) => (
          <ReservationOfferCard
            key={index}
            offer={offer}
            onSelect={handleSelectOffer}
          />
        ))}
      </Stack>
    );
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Rezerwacja pokoju
      </Typography>

      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
        <Box
          sx={{
            width: 600,
            flexShrink: 0,
            position: "sticky",
            top: 16,
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
          }}
        >
          <ReservationSearchForm
            filter={filter}
            standards={standards}
            onFilterChange={setFilter}
            onAddRoom={addRoom}
            onRemoveRoom={removeRoom}
            onUpdateRoomCapacity={updateRoomCapacity}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Dostępne oferty
          </Typography>
          {renderOffersContent()}
        </Box>
      </Box>
    </Box>
  );
}
