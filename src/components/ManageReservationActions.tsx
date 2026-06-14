import type {ReservationInfo} from "../types/ReservationInfo.ts";
import {Button} from "@mui/material";

type Props = {
    dto: ReservationInfo;
    onStatusChange: (id: number, status: string) => void;
};

export default function ManageReservationActions({ dto, onStatusChange }: Props) {
    const { code } = dto.reservationStatus;

    if (code === "created") {
        return (
            <Button onClick={() => onStatusChange(dto.reservationId, "confirmed")}>
                Potwierdź
            </Button>
        );
    }
    if (code === "confirmed") {
        return (
            <Button onClick={() => onStatusChange(dto.reservationId, "checked_in")}>
                Zamelduj
            </Button>
        );
    }
    if (code === "checked_in") {
        return (
            <Button onClick={() => onStatusChange(dto.reservationId, "checked_out")}>
                Wymelduj
            </Button>
        );
    }
    return null;
}