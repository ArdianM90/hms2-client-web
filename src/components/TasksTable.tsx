import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@mui/material";
import type { TableColumn } from "../types/TableColumn.ts";

type Props<T> = {
  tasks: T[];
  columns: TableColumn<T>[];
  onRowClick?: (dto: T) => void;
  sortBy?: string;
  sortDescending?: boolean;
  onSortChange?: (sortKey: string) => void;
};

export default function TasksTable<T extends { employeeTaskId: number }>({
  tasks,
  columns,
  onRowClick,
  sortBy,
  sortDescending,
  onSortChange,
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
                {col.sortKey && onSortChange ? (
                  <TableSortLabel
                    active={sortBy === col.sortKey}
                    direction={
                      sortBy === col.sortKey && sortDescending ? "desc" : "asc"
                    }
                    onClick={() => onSortChange(col.sortKey!)}
                    sx={{
                      "&.MuiTableSortLabel-active, &:hover": {
                        color: "#6b1020",
                      },
                      "& .MuiTableSortLabel-icon": {
                        color: "#6b1020 !important",
                      },
                    }}
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
          {tasks.map((dto, index) => (
            <TableRow
              key={dto.employeeTaskId}
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
