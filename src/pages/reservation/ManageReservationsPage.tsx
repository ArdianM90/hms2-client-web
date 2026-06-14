import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import type {ReservationColumn} from "../../types/ReservationColumn.ts";
import {commonColumns} from "../../config/reservationColumns.tsx";
import {Alert, Box, Card, CardContent, CircularProgress, Typography} from "@mui/material";
import {reservationApi} from "../../api/reservationApi.ts";
import ReservationsTable from "../../components/ReservationsTable.tsx";
import ManageReservationActions from "../../components/ManageReservationActions.tsx";
import type {AdminReservationInfo} from "../../types/AdminReservationInfo.ts";

export default function ManageReservationsPage() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState<AdminReservationInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleStatusChange = ():void => {

    }

    const guestColumn: ReservationColumn<AdminReservationInfo> = {
        header: "Gość",
        render: (dto) => `${dto.guestFirstName} ${dto.guestLastName}`,
    };

    const adminActionsColumn: ReservationColumn<AdminReservationInfo> = {
        header: "Akcje",
        align: "right",
        render: (dto) => <ManageReservationActions dto={dto} onStatusChange={handleStatusChange} />,
    };

    const columns: ReservationColumn<AdminReservationInfo>[] = [
        commonColumns[0], // #
        guestColumn,
        ...commonColumns.slice(1),
        adminActionsColumn,
    ];

    useEffect(() => {
        reservationApi
            .getAllReservations()
            .then(setReservations)
            .catch(() => setError("Nie udało się pobrać listy rezerwacji"))
            .finally(() => setLoading(false));
    }, []);

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
                Lista rezerwacji
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