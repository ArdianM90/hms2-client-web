import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import type { TableColumn } from "../types/TableColumn.ts";

type Props<T> = {
  reservations: T[];
  columns: TableColumn<T>[];
  sortBy: string;
  sortDescending: boolean;
  onSortChange: (key: string) => void;
  onRowClick?: (dto: T) => void;
};

export default function ReservationsTable<T extends { reservationId: number }>({
  reservations,
  columns,
  sortBy,
  sortDescending,
  onSortChange,
  onRowClick,
}: Props<T>) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              "& .MuiTableCell-head": { fontWeight: 700, color: "#6b1020" },
            }}
          >
            {columns.map((col, i) => (
              <TableCell key={i} align={col.align}>
                {col.sortKey ? (
                  <TableSortLabel
                    active={sortBy === col.sortKey}
                    direction={
                      sortBy === col.sortKey && sortDescending ? "desc" : "asc"
                    }
                    onClick={() => onSortChange(col.sortKey!)}
                  >
                    {col.header}
                  </TableSortLabel>
                ) : (
                  col.header
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.map((dto, index) => (
            <TableRow
              title="Kliknij aby zobaczyć szczegóły"
              key={dto.reservationId}
              hover={!!onRowClick}
              onClick={() => onRowClick?.(dto)}
              sx={
                onRowClick
                  ? {
                      cursor: "pointer",
                      "&:hover": { bgcolor: "rgba(107,16,32,0.03)" },
                    }
                  : {}
              }
            >
              {columns.map((col, i) => (
                <TableCell key={i} align={col.align}>
                  {col.render(dto, index)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
