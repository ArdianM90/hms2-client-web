import {
    Box, Card, CardContent, Chip, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Alert, Button,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {reservationApi} from "../../api/reservationApi.ts";
import type {ReservationDto} from "../../types/ReservationDto.ts";
import {formatDateTime} from "../../helpers/Formatter.ts";

export default function MyReservationsPage() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState<ReservationDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        reservationApi.getMyReservations()
            .then(setReservations)
            .catch(() => setError("Nie udało się pobrać rezerwacji"))
            .finally(() => setLoading(false));
    }, []);

    const handleCancel = async (id: number) => {
        try {
            await reservationApi.changeReservationStatus(id);

            setReservations(prev =>
                prev.map(r =>
                    r.reservationId === id
                        ? { ...r, reservationStatus: { code: "cancelled", label: "Anulowana" } }
                        : r
                )
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
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{"& .MuiTableCell-head": {fontWeight: 700, color: "#6b1020"}}}>
                                    <TableCell>#</TableCell>
                                    <TableCell>Data utworzenia</TableCell>
                                    <TableCell>Data ostatniej aktualizacji</TableCell>
                                    <TableCell>Data pobytu</TableCell>
                                    <TableCell>Status rezerwacji</TableCell>
                                    <TableCell>Źródło</TableCell>
                                    <TableCell>Pokoje</TableCell>
                                    <TableCell>Cena</TableCell>
                                    <TableCell align="right">Akcje</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {reservations.map((dto, index) => (
                                    <TableRow key={dto.reservationId} hover>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{formatDateTime(dto.createdAt)}</TableCell>
                                        <TableCell>{formatDateTime(dto.updatedAt)}</TableCell>
                                        <TableCell>od {dto.startDate} do {dto.endDate}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={dto.reservationStatus.label}
                                                size="small"
                                                sx={{
                                                    bgcolor: "rgba(107,16,32,0.08)",
                                                    color: "#6b1020",
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{dto.reservationSource.label}</TableCell>
                                        <TableCell>{dto.roomsQty}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{dto.totalPrice} zł</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                color="error"
                                                startIcon={<CancelOutlinedIcon />}
                                                onClick={() => handleCancel(dto.reservationId)}
                                                disabled={dto.reservationStatus.code === "cancelled"}
                                            >
                                                Anuluj
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

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