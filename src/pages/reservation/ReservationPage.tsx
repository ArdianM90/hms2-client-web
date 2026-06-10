import {Alert, Box, Stack, Typography,} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import type {RoomStandard} from "../../types/RoomStandard";
import ReservationSearchForm from "../../components/ReservationSearchForm.tsx";
import {roomApi} from "../../api/roomApi.ts";
import {reservationApi} from "../../api/reservationApi.ts";
import type {ReservationFilter} from "../../types/ReservationFilter.ts";
import type {SearchReservationOffersRequest} from "../../types/SearchReservationOffersRequest.tsx";
import type {ReservationOffer} from "../../types/ReservationOffer.tsx";
import ReservationOfferCard from "../../components/ReservationOfferCard.tsx";

export default function ReservationPage() {
    const [standards, setStandards] = useState<RoomStandard[]>([]);

    const [offers, setOffers] = useState<ReservationOffer[]>([]);

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
            filter.rooms.every(r => r.capacity > 0),
        [filter]
    );

    useEffect(() => {
        roomApi.getStandards().then(setStandards);
    }, []);

    const mapFilterToRequest = (filter: ReservationFilter): SearchReservationOffersRequest => ({
        startDate: filter.startDate,
        endDate: filter.endDate,
        roomCapacities: filter.rooms.map(r => r.capacity),
        standardCode: filter.standardCode || undefined,
        priceFrom: filter.priceFrom ? Number(filter.priceFrom) : undefined,
        priceTo: filter.priceTo ? Number(filter.priceTo) : undefined,
    });

    useEffect(() => {
        if (!canSearch) {
            return;
        }
        const request = mapFilterToRequest(filter);
        reservationApi.searchOffers(request)
            .then(setOffers)
            .catch(console.error);
    }, [filter, canSearch]);

    const addRoom = () => {
        setFilter(prev => ({
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
        setFilter(prev => ({
            ...prev,
            rooms: prev.rooms.filter(r => r.id !== id),
        }));
    };

    const updateRoomCapacity = (roomId: number, capacity: number) => {
        setFilter(prev => ({
            ...prev,
            rooms: prev.rooms.map(r =>
                r.id === roomId
                    ? {...r, capacity}
                    : r
            ),
        }));
    };

    return (
        <Box>

            <Typography variant="h4" sx={{mb: 3}}>
                Rezerwacja pokoju
            </Typography>

            <ReservationSearchForm
                filter={filter}
                standards={standards}
                onFilterChange={setFilter}
                onAddRoom={addRoom}
                onRemoveRoom={removeRoom}
                onUpdateRoomCapacity={updateRoomCapacity}
            />

            {!canSearch && (
                <Alert severity="info">
                    Uzupełnij daty pobytu oraz wymagane pokoje.
                </Alert>
            )}
            {canSearch && (
                <>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Dostępne oferty
                    </Typography>

                    {offers.length === 0 ? (
                        <Alert severity="warning">
                            Brak dostępnych ofert dla podanych kryteriów.
                        </Alert>
                    ) : (
                        <Stack spacing={2}>
                            {offers.map((offer, index) => (
                                <ReservationOfferCard
                                    key={index}
                                    offer={offer}
                                    onSelect={(offer) => console.log("wybrano:", offer)}
                                />
                            ))}
                        </Stack>
                    )}
                </>
            )}
        </Box>
    );
}