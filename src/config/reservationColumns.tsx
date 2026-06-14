import {formatDateTime} from "../helpers/Formatter.ts";
import {Chip} from "@mui/material";
import type {ReservationColumn} from "../types/ReservationColumn.ts";
import type {ReservationInfo} from "../types/ReservationInfo.ts";

export const commonColumns: ReservationColumn<ReservationInfo>[] = [
    {
        header: "#",
        render: (_, index) => index + 1,
    },
    {
        header: "Data utworzenia",
        render: (dto) => formatDateTime(dto.createdAt),
    },
    {
        header: "Data ostatniej aktualizacji",
        render: (dto) => formatDateTime(dto.updatedAt),
    },
    {
        header: "Data pobytu",
        render: (dto) => `od ${dto.startDate} do ${dto.endDate}`,
    },
    {
        header: "Doby hotelowe",
        render: (dto) => dto.daysQty,
    },
    {
        header: "Status",
        render: (dto) => (
            <Chip
                label={dto.reservationStatus.label}
                size="small"
                sx={{ bgcolor: "rgba(107,16,32,0.08)", color: "#6b1020", fontWeight: 600 }}
            />
        ),
    },
    {
        header: "Źródło",
        render: (dto) => dto.reservationSource.label,
    },
    {
        header: "Pokoje",
        render: (dto) => dto.roomsQty,
    },
    {
        header: "Cena",
        render: (dto) => `${dto.totalPrice} zł`,
    },
];